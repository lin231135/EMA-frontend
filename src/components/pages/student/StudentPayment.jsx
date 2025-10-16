// src/components/pages/student/StudentPayment.jsx
/**
 * Página de registro de pagos para estudiantes
 * Permite al estudiante registrar pagos, cargar comprobantes y ver su deuda
 */

import { useEffect, useMemo, useState } from "react";
import PaymentForm from "../../forms/PaymentForm";
import StudentLayout from "../../layout/student/StudentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

/**
 * Configuración de URLs de la API
 */
const API_URL = import.meta.env.VITE_API_URL; // URL base del backend
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload"; // URL de ImageKit para subir archivos

/**
 * Mapea los métodos de pago del frontend al ENUM de la base de datos
 * @param {string} m - Método de pago del formulario ('cash', 'deposit', 'transfer', etc.)
 * @returns {string} Método mapeado al ENUM de BD ('efectivo', 'deposito', 'transferencia')
 */
const mapMethodToEnum = (m) => {
  switch (m) {
    case "cash":
      return "efectivo";
    case "deposit":
      return "deposito";
    case "transfer":
    default:
      return "transferencia";
  }
};

/**
 * Banner informativo que muestra el monto de deuda del estudiante
 * @param {Object} props - Propiedades del componente
 * @param {number} props.amount - Monto de la deuda
 * @param {string} props.currency - Símbolo de la moneda (default: "Q")
 * @returns {JSX.Element|null} Banner con información de deuda o null si no hay monto
 */
function DebtBanner({ amount, currency = "Q" }) {
  if (amount == null) return null;
  return (
    <div className="mb-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4">
      <p className="text-yellow-900 dark:text-yellow-200 font-medium">
        {`Monto a pagar: ${currency} ${Number(amount).toFixed(2)} (estimado)`}
      </p>
      <p className="text-yellow-800/70 dark:text-yellow-300/70 text-sm">
        El administrador verificará el comprobante y confirmará el pago.
      </p>
    </div>
  );
}

/**
 * Gestiona el flujo completo de registro de pagos para estudiantes:
 * - Carga y muestra la deuda pendiente
 * - Permite seleccionar estudiantes asociados
 * - Sube comprobantes a ImageKit
 * - Registra el pago en el backend
 */
export default function StudentPayment() {
  // Contexto de autenticación para obtener token, usuario y idioma
  const { token, user, lang } = useAuth();
  
  // Estado de carga durante el procesamiento del pago
  const [loading, setLoading] = useState(false);
  
  // Estado de la deuda del estudiante
  const [debt, setDebt] = useState({ amount: null, currency: "Q" });
  
  // Lista de estudiantes asociados al usuario (para selección)
  const [students, setStudents] = useState([]);

  /**
   * Effect 1: Cargar el balance/deuda del estudiante desde el backend
   */
  useEffect(() => {
    let mounted = true; // Flag para evitar actualizaciones de estado en componentes desmontados
    
    (async () => {
      try {
        // Solicitud al backend para obtener el balance del estudiante
        const res = await fetch(`${API_URL}/payments/my-balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json(); // Espera: { amountDue, currency }
          
          if (mounted) {
            // Actualiza el estado con la deuda obtenida
            setDebt({
              amount: data?.amountDue ?? null,
              currency: data?.currency ?? "Q",
            });
          }
        }
      } catch (err) {
        console.error("[StudentPayment] balance error:", err);
      }
    })();
    
    // Cleanup: evita memory leaks
    return () => (mounted = false);
  }, [token]);

  /**
   * Effect 2: Cargar la lista de estudiantes asociados al usuario actual
   * Útil si un padre/encargado tiene múltiples hijos registrados
   */
  useEffect(() => {
    let mounted = true; // Flag de montaje del componente
    
    (async () => {
      try {
        // Solicita la lista de estudiantes asociados al usuario
        // Endpoint esperado: devuelve [{id, name}] o estructura similar
        const res = await fetch(`${API_URL}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const items = await res.json();
          
          if (mounted) {
            // Normaliza la respuesta a formato {id, name}
            const mapped =
              Array.isArray(items)
                ? items.map((s) => ({
                    id: s.id ?? s.student_id ?? s.uuid,
                    name:
                      s.name ??
                      s.fullName ??
                      [s.first_name, s.last_name].filter(Boolean).join(" ") ??
                      "Sin nombre",
                  }))
                : [];
            setStudents(mapped);
          }
        } else {
          // Fallback: Si el endpoint no existe, usa el usuario actual como estudiante único
          if (mounted && user) {
            setStudents([
              { id: user.id, name: `${user.name ?? ""} ${user.last_name ?? ""}`.trim() || "Yo" },
            ]);
          }
        }
      } catch (err) {
        console.error("[StudentPayment] students error:", err);
        // En caso de error, también usa el usuario actual como fallback
        if (user) {
          setStudents([{ id: user.id, name: `${user.name ?? ""} ${user.last_name ?? ""}`.trim() || "Yo" }]);
        }
      }
    })();
    
    return () => (mounted = false);
  }, [token, user]);

  /**
   * Valores iniciales para el formulario de pagos
   * Se recalculan cuando cambia la deuda
   */
  const initialValues = useMemo(() => {
    return {
      total: debt.amount != null ? String(debt.amount) : "", // Precarga el monto de la deuda
      currency: debt.currency || "Q", // Moneda por defecto
      date: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
      method: "transfer", // Método de pago por defecto: transferencia
      notes: "", // Notas vacías inicialmente
      // parentName se autollenará en PaymentForm desde guardianName o AuthContext
    };
  }, [debt.amount, debt.currency]);

  /**
   * Define qué campos del formulario serán de solo lectura
   * Si hay deuda precargada, el campo total no es editable
   */
  const readOnlyFields = {
    total: debt.amount != null, // Solo lectura si hay monto de deuda
  };

  /**
   * Sube el comprobante de pago a ImageKit
   * @param {File} file - Archivo a subir (imagen o PDF)
   * @returns {Promise<string|null>} URL del archivo subido o null
   */
  const uploadProofToImageKit = async (file) => {
    if (!file) return null; // Si no hay archivo, retorna null
    
    // Paso 1: Obtener firma de autenticación desde el backend
    const sigRes = await fetch(`${API_URL}/storage/imagekit/signature`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!sigRes.ok) throw new Error("No se pudo obtener firma de ImageKit");
    
    // Extrae los datos de autenticación para ImageKit
    const { token: ikToken, signature, expire, publicKey, folder } = await sigRes.json();

    // Paso 2: Construir FormData con el archivo y credenciales
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    if (folder) form.append("folder", folder); // Carpeta de destino en ImageKit
    form.append("publicKey", publicKey);
    form.append("signature", signature);
    form.append("expire", expire);
    form.append("token", ikToken);

    // Paso 3: Subir el archivo a ImageKit
    const uploadRes = await fetch(IMAGEKIT_UPLOAD_URL, { method: "POST", body: form });
    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Error al subir a ImageKit: ${errText}`);
    }
    
    // Paso 4: Retornar la URL del archivo subido
    const uploadData = await uploadRes.json();
    return uploadData?.url || null;
  };

  /**
   * Crea un registro de pago en el backend
   * @param {Object} params - Parámetros del pago
   * @param {number} params.studentId - ID del estudiante
   * @param {string} params.method - Método de pago
   * @param {number} params.total - Monto total
   * @param {string} params.date - Fecha del pago
   * @param {string} params.notes - Notas adicionales
   * @param {string} params.proofUrl - URL del comprobante en ImageKit
   * @returns {Promise<Object>} Respuesta del backend
   */
  const createPayment = async ({ studentId, method, total, date, notes, proofUrl }) => {
    // Construye el payload según el formato esperado por el backend
    const body = {
      student_id: studentId, // ID del estudiante que realiza el pago
      payment_method: mapMethodToEnum(method), // Mapea al ENUM de la BD
      total: Number(total), // Convierte a número
      payment_date: date, // Fecha en formato ISO (YYYY-MM-DD)
      state: "en revision", // Estado inicial del pago
      reference_pic: proofUrl || null, // URL del comprobante o null
      note: notes || "", // Notas adicionales
    };

    // Envía la solicitud POST al backend
    const res = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // Manejo de errores
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error al crear el pago: ${errText}`);
    }
    
    return await res.json(); // Retorna la respuesta del backend
  };

  /**
   * Maneja el envío del formulario de pagos
   * @param {Object} payload - Datos del formulario
   */
  const handleSubmit = async (payload) => {
    try {
      setLoading(true); // Activa el estado de carga

      // Validación: debe haber un estudiante seleccionado
      if (!payload.studentId) {
        toast.error(lang === "es" ? "Selecciona un estudiante." : "Select a student.");
        return;
      }

      // Paso 1: Subir el comprobante a ImageKit si existe
      let proofUrl = null;
      if (payload.proof) {
        proofUrl = await uploadProofToImageKit(payload.proof);
      }

      // Paso 2: Registrar el pago en el backend
      await createPayment({
        studentId: payload.studentId,
        method: payload.method,
        total: payload.total,
        date: payload.date,
        notes: payload.notes,
        proofUrl,
      });

      // Paso 3: Mostrar mensaje de éxito
      toast.success(lang === "es" ? "Pago enviado para revisión." : "Payment submitted for review.");
      
      // Actualiza la deuda a 0 (opcional: podrías recargar desde el backend)
      setDebt((d) => ({ ...d, amount: 0 }));
    } catch (err) {
      // Manejo de errores
      console.error(err);
      toast.error(lang === "es" ? "No se pudo enviar el pago." : "Failed to submit payment.");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <StudentLayout>
      {/* Banner que muestra la deuda pendiente del estudiante */}
      <div className="px-6 pt-4">
        <DebtBanner amount={debt.amount} currency={debt.currency} />
      </div>

      {/* Formulario de pagos con configuración específica para estudiantes */}
      <PaymentForm
        contextRole="student" // Define el contexto como estudiante
        onSubmit={handleSubmit} // Callback al enviar el formulario
        initialValues={initialValues} // Valores iniciales (deuda, fecha, etc.)
        readOnlyFields={readOnlyFields} // Campos bloqueados (ej: total si hay deuda)
        studentOptions={students} // Lista de estudiantes para seleccionar
        guardianName={user?.guardianName ?? user?.parentName ?? ""} // Nombre del encargado
      />

      {/* Indicador de carga mientras se procesa el pago */}
      {loading && (
        <div className="px-6 pb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Procesando pago, por favor espera...
          </p>
        </div>
      )}
    </StudentLayout>
  );
}
