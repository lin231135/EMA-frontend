// src/components/pages/student/StudentPayment.jsx
/**
 * @file StudentPayment.jsx
 * @description Página de registro de pagos para el rol estudiante (adulto).
 * 
 * Funcionalidades principales:
 * - Carga la deuda pendiente del estudiante actual
 * - Prellenado automático del nombre del estudiante (usuario logueado)
 * - Permite registrar pagos con comprobante
 * - Sube comprobantes de pago a ImageKit CDN
 * - Muestra modal de confirmación al completar el registro exitosamente
 * 
 * Nota: Este componente es para estudiantes adultos que pagan por sí mismos.
 * Para pagos de padres a nombre de sus hijos, ver ParentPayment.jsx

 */

import { useEffect, useMemo, useState } from "react";
import PaymentForm from "../../forms/PaymentForm";
import StudentLayout from "../../layout/student/StudentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import AlertModal from "../../forms/AlertModal";

// Configuración de URLs de API
const API_URL = import.meta.env.VITE_API_URL; // Backend API base URL
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload"; // ImageKit CDN

/**
 * Mapea los métodos de pago del frontend a los valores ENUM de la base de datos
 * 
 * @param {string} m - Método de pago del frontend ('cash', 'deposit', 'transfer')
 * @returns {string} Valor ENUM para la base de datos ('efectivo', 'deposito', 'transferencia')
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
 * Componente Banner que muestra la deuda pendiente del estudiante
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number|null} props.amount - Monto total de la deuda pendiente
 * @param {string} [props.currency="Q"] - Símbolo de moneda (por defecto Quetzales)
 * @returns {JSX.Element|null} Banner de deuda o null si no hay monto
 */
function DebtBanner({ amount, currency = "Q" }) {
  // No mostrar banner si no hay deuda
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
 * Componente principal de la página de registro de pagos para estudiantes
 * 
 * @returns {JSX.Element} Página completa de registro de pagos para estudiante
 */
export default function StudentPayment() {
  // Hooks de autenticación y estado
  const { token, user, lang } = useAuth(); // Token JWT, datos del usuario y lenguaje activo
  
  // Estados del componente
  const [loading, setLoading] = useState(false); // Indicador de carga durante el submit
  const [debt, setDebt] = useState({ amount: null, currency: "Q" }); // Deuda pendiente del estudiante
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Control del modal de éxito

  /**
   * Effect: Cargar deuda pendiente del estudiante al montar el componente
   * 
   * Realiza un fetch a /students/payments/pending para obtener:
   * - total_due: Monto total de deuda del estudiante logueado
   */
  useEffect(() => {
    let mounted = true; // Flag para evitar actualizaciones de estado en componente desmontado
    
    (async () => {
      try {
        // Solicitar deuda pendiente del estudiante actual
        const res = await fetch(`${API_URL}/students/payments/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          
          // Solo actualizar estado si el componente sigue montado
          if (mounted) {
            setDebt({ 
              amount: Number(data?.total_due) || 0, 
              currency: "Q" 
            });
          }
        } else {
          console.warn("No se pudo obtener deuda del estudiante");
        }
      } catch (err) {
        console.error("[StudentPayment] Error al cargar deuda:", err);
      }
    })();
    
    // Cleanup: marcar componente como desmontado
    return () => (mounted = false);
  }, [token]);

  /**
   * Sube el comprobante de pago a ImageKit CDN
   * 
   * Proceso:
   * 1. Solicita firma de autenticación al backend
   * 2. Crea FormData con el archivo y credenciales
   * 3. Sube el archivo a ImageKit
   * 4. Retorna la URL pública del archivo subido
   * 
   * @param {File} file - Archivo del comprobante (imagen o PDF)
   * @returns {Promise<string|null>} URL del archivo en ImageKit o null si falla
   * @throws {Error} Si no se puede obtener la firma o subir el archivo
   */
  const uploadProofToImageKit = async (file) => {
    if (!file) return null;
    
    // Paso 1: Obtener firma de autenticación desde el backend
    const sigRes = await fetch(`${API_URL}/storage/imagekit/signature`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!sigRes.ok) throw new Error("No se pudo obtener firma de ImageKit");

    // Paso 2: Extraer credenciales de la respuesta
    const { token: ikToken, signature, expire, publicKey, folder } = await sigRes.json();

    // Paso 3: Preparar FormData con el archivo y credenciales
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    if (folder) form.append("folder", folder);
    form.append("publicKey", publicKey);
    form.append("signature", signature);
    form.append("expire", expire);
    form.append("token", ikToken);

    // Paso 4: Subir archivo a ImageKit
    const uploadRes = await fetch(IMAGEKIT_UPLOAD_URL, { method: "POST", body: form });
    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Error al subir a ImageKit: ${errText}`);
    }
    
    // Paso 5: Extraer y retornar URL del archivo subido
    const uploadData = await uploadRes.json();
    return uploadData?.url || null;
  };

  /**
   * Envía el registro de pago al backend
   * 
   * @param {Object} params - Parámetros del pago
   * @param {string} params.method - Método de pago (efectivo, transferencia, deposito)
   * @param {string} params.notes - Notas adicionales del pago
   * @param {string|null} params.proofUrl - URL del comprobante en ImageKit
   * @param {string} [params.month] - Mes del pago en formato "YYYY-MM" (opcional)
   * @param {number[]} [params.bookingIds] - IDs de bookings a pagar (opcional)
   * @returns {Promise<Object>} Respuesta del servidor con los datos del pago creado
   * @throws {Error} Error estructurado con status y data si falla la petición
   */
  const createPayment = async ({ method, notes, proofUrl, month, bookingIds }) => {
    // Enviar petición POST al endpoint de pagos
    const res = await fetch(`${API_URL}/students/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        paymentMethod: method,     // "efectivo" | "transferencia" | "deposito"
        referencePic: proofUrl,    // URL del comprobante subido
        note: notes,               // Notas adicionales
        month,                     // Mes opcional en formato "YYYY-MM"
        bookingIds,                // Array opcional de IDs de bookings
      }),
    });

    // Parsear respuesta (puede ser JSON o texto)
    const text = await res.text();
    let data = null;
    try { 
      data = text ? JSON.parse(text) : null; 
    } catch (parseError) {
      console.warn("[StudentPayment] No se pudo parsear la respuesta como JSON");
    }

    // Lanzar error estructurado si la petición falló
    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;  // Código de estado HTTP
      err.data = data;          // Datos adicionales del error
      throw err;
    }

    return data;
  };


  /**
   * Maneja el envío del formulario de pago
   * 
   * Flujo:
   * 1. Activa el estado de loading
   * 2. Sube el comprobante a ImageKit (si hay archivo)
   * 3. Envía el pago al backend
   * 4. Muestra modal de éxito y actualiza la deuda
   * 5. Maneja errores y muestra notificaciones apropiadas
   * 
   * @param {Object} payload - Datos del formulario
   * @param {string} payload.method - Método de pago seleccionado
   * @param {string} payload.notes - Notas adicionales
   * @param {File} payload.proof - Archivo del comprobante
   */
  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      
      // Paso 1: Subir comprobante si se proporcionó
      let proofUrl = null;
      if (payload.proof) {
        proofUrl = await uploadProofToImageKit(payload.proof);
      }
      
      // Paso 2: Registrar el pago en el backend
      await createPayment({ 
        method: payload.method, 
        notes: payload.notes, 
        proofUrl 
      });
      
      // Paso 3: Mostrar confirmación de éxito
      setShowSuccessModal(true);
      
      toast.success(
        lang === "es" 
          ? "Pago enviado para revisión." 
          : "Payment submitted for review."
      );
      
      // Paso 4: Resetear la deuda mostrada
      setDebt((d) => ({ ...d, amount: 0 }));
      
    } catch (err) {
      // Manejo de errores: mostrar mensaje al usuario
      console.error("[StudentPayment] Error en handleSubmit:", err);
      toast.error(
        lang === "es" 
          ? "No se pudo enviar el pago." 
          : "Failed to submit payment."
      );
    } finally {
      // Siempre desactivar el loading, sin importar si hubo éxito o error
      setLoading(false);
    }
  };

  // Construir nombre completo del estudiante desde la información del usuario
  const studentFullName = `${user?.name ?? ""} ${user?.last_name ?? ""}`.trim();

  /**
   * Valores iniciales del formulario de pago
   * Se recalculan cuando cambia la deuda o el nombre del estudiante
   * 
   * Nota: Para estudiantes, tanto studentName como parentName se prellenan
   * con el nombre del estudiante, ya que es un estudiante adulto pagando por sí mismo
   */
  const initialValues = useMemo(() => {
    return {
      total: debt.amount ? String(debt.amount) : "",      // Monto de la deuda
      currency: debt.currency || "Q",                     // Moneda (Quetzales)
      date: new Date().toISOString().slice(0, 10),        // Fecha actual en formato YYYY-MM-DD
      method: "transfer",                                 // Método por defecto: transferencia
      notes: "",                                          // Notas vacías inicialmente
      parentName: studentFullName,                        // Para estudiantes adultos
      studentName: studentFullName,                       // Nombre prellenado del estudiante
    };
  }, [debt.amount, debt.currency, studentFullName, user?.id]);

  /**
   * Configuración de campos de solo lectura en el formulario
   * Para estudiantes, todos los campos de identificación están bloqueados
   */
  const readOnlyFields = {
    total: debt.amount != null,  // Total readonly si hay deuda cargada
    studentName: true,           // Nombre del estudiante bloqueado (es el usuario actual)
    parentName: true,            // Nombre del padre bloqueado (mismo que estudiante)
  };

  // ========== Renderizado del componente ==========
  return (
    <StudentLayout>
      {/* Banner informativo con el monto de la deuda */}
      <div className="px-6 pt-4">
        <DebtBanner amount={debt.amount} currency={debt.currency} />
      </div>

      {/* Formulario de registro de pago */}
      <PaymentForm
        contextRole="student"                   // Indica que el formulario es para estudiante
        onSubmit={handleSubmit}                 // Handler cuando se envía el formulario
        initialValues={initialValues}           // Valores iniciales del formulario
        readOnlyFields={readOnlyFields}         // Campos que deben ser readonly
      />

      {/* Indicador de carga durante el proceso */}
      {loading && (
        <div className="px-6 pb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Procesando pago, por favor espera...
          </p>
        </div>
      )}

      {/* Modal de confirmación de éxito */}
      <AlertModal
        isOpen={showSuccessModal}
        title={
          lang === "es" 
            ? "¡Pago Registrado Exitosamente!" 
            : "Payment Registered Successfully!"
        }
        message={
          lang === "es"
            ? "Tu pago ha sido enviado para revisión. El administrador verificará el comprobante y confirmará tu pago pronto."
            : "Your payment has been submitted for review. The administrator will verify the receipt and confirm your payment soon."
        }
        onClose={() => setShowSuccessModal(false)}
      />
    </StudentLayout>
  );
}
