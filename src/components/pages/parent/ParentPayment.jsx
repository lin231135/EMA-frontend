// src/components/pages/parent/ParentPayment.jsx
/**
 * @description Página de registro de pagos para el rol padre.
 * 
 * Funcionalidades principales:
 * - Carga la deuda pendiente total de los hijos asociados al padre
 * - Obtiene y muestra la lista de estudiantes (hijos) con deuda pendiente
 * - Permite al padre seleccionar el hijo y registrar un pago
 * - Sube comprobantes de pago a ImageKit (si está disponible)
 * - Muestra modal de confirmación al completar el registro exitosamente
 */

import { useEffect, useMemo, useState } from "react";
import PaymentForm from "../../forms/PaymentForm";
import ParentLayout from "../../layout/parent/ParentLayout";
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
 * Componente Banner que muestra la deuda pendiente del padre
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
 * Componente principal de la página de registro de pagos para padres
 */
export default function ParentPayment() {
  // Hooks de autenticación y estado
  const { token, user, lang } = useAuth(); // Token JWT, datos del usuario y lenguaje activo
  
  // Estados del componente
  const [loading, setLoading] = useState(false); // Indicador de carga durante el submit
  const [debt, setDebt] = useState({ amount: null, currency: "Q" }); // Deuda pendiente total
  const [studentOptions, setStudentOptions] = useState([]); // Lista de hijos con formato [{label, value}]
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Control del modal de éxito

  /**
   * Effect: Cargar deuda pendiente y lista de estudiantes (hijos) al montar el componente
   * 
   * Realiza un fetch a /students/payments/pending para obtener:
   * - total_due: Monto total de deuda
   * - items: Array de pagos pendientes con información de cada estudiante
   */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/students/payments/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("[ParentPayment] Error del servidor:", res.status, errorText);
          
          if (!mounted) return;
          
          // Mostrar mensaje al usuario
          toast.error(
            lang === "es" 
              ? `Error al cargar deuda pendiente (${res.status})` 
              : `Failed to load pending debt (${res.status})`
          );
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        console.log("[ParentPayment] Deuda recibida:", data);

        setDebt({
          amount: data?.total_due != null ? Number(data.total_due) : null,
          currency: "Q",
        });


        // Construir opciones únicas de estudiante
        // Si tus items no traen id del hijo, al menos usa el nombre
        const unique = Array.from(
          new Set((data?.items || []).map((it) => it.student_name?.trim()).filter(Boolean))
        );
        // Ajusta al tipo que espera tu PaymentForm:
        // - Si es un Select con objetos:
        const opts = unique.map((name, idx) => ({ label: name, value: name }));
        setStudentOptions(opts);
        
        console.log("[ParentPayment] Opciones de estudiantes:", opts);

        // - Si es un input texto, podrías omitir esto y dejar vacío
      } catch (err) {
        console.error("[ParentPayment] Error al cargar deuda:", err);
        if (mounted) {
          toast.error(
            lang === "es" 
              ? "Error de conexión al cargar deuda pendiente" 
              : "Connection error loading pending debt"
          );
        }
      }
    })();
    return () => (mounted = false);
  }, [token, lang]);

  /**
   * Sube el comprobante de pago a ImageKit CDN
   * 
   * Proceso:
   * 1. Solicita firma de autenticación al backend
   * 2. Crea FormData con el archivo y credenciales
   * 3. Sube el archivo a ImageKit
   * 4. Retorna la URL pública del archivo subido
   */
  const uploadProofToImageKit = async (file) => {
    if (!file) return null;
    
    try {
      // 1. Obtener firma de autenticación desde el backend
      const sigRes = await fetch(`${API_URL}/storage/imagekit/signature`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!sigRes.ok) {
        console.warn(`[ParentPayment] ImageKit signature endpoint no disponible (${sigRes.status})`);
        toast.warning(
          lang === "es"
            ? "El comprobante no se puede subir aún. Implementación pendiente."
            : "Proof upload not available yet. Pending implementation."
        );
        return null;
      }

      // 2. Extraer credenciales de la respuesta
      const { token: ikToken, signature, expire, publicKey, folder } = await sigRes.json();

      // 3. Preparar FormData con el archivo y credenciales
      const form = new FormData();
      form.append("file", file);
      form.append("fileName", file.name);
      if (folder) form.append("folder", folder);
      form.append("publicKey", publicKey);
      form.append("signature", signature);
      form.append("expire", expire);
      form.append("token", ikToken);

      // 4. Subir archivo a ImageKit
      const uploadRes = await fetch(IMAGEKIT_UPLOAD_URL, { method: "POST", body: form });
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Error al subir a ImageKit: ${errText}`);
      }
      
      // 5. Extraer URL del archivo subido
      const uploadData = await uploadRes.json();
      return uploadData?.url || null;
      
    } catch (err) {
      console.error("[ParentPayment] Error en uploadProofToImageKit:", err);
      // No bloqueamos el flujo completo si falla la subida del comprobante
      toast.warning(
        lang === "es"
          ? "No se pudo subir el comprobante, pero el pago se registrará."
          : "Could not upload proof, but payment will be recorded."
      );
      return null;
    }
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
      console.warn("[ParentPayment] No se pudo parsear la respuesta como JSON");
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
   * 2. Sube el comprobante a ImageKit (si está habilitado)
   * 3. Envía el pago al backend
   * 4. Muestra modal de éxito y actualiza la deuda
   * 5. Maneja errores específicos (sin bookings, errores del servidor)
   * 
   * @param {Object} payload - Datos del formulario
   * @param {string} payload.method - Método de pago seleccionado
   * @param {string} payload.notes - Notas adicionales
   * @param {File} payload.proof - Archivo del comprobante
   */
  const handleSubmit = async (payload) => {
    console.log("[ParentPayment] handleSubmit payload:", payload);

    try {
      setLoading(true);

      // Flag para habilitar/deshabilitar la subida de comprobantes
      // TODO: Cambiar a true cuando el endpoint de ImageKit esté implementado
      const USE_IMAGEKIT = false;

      // Paso 1: Subir comprobante si está habilitado y hay archivo
      let proofUrl = null;
      if (USE_IMAGEKIT && payload.proof) {
        console.log("[ParentPayment] Subiendo comprobante...");
        proofUrl = await uploadProofToImageKit(payload.proof);
        console.log("[ParentPayment] Comprobante URL:", proofUrl);
      }

      // Paso 2: Registrar el pago en el backend
      console.log("[ParentPayment] Creando pago con método:", payload.method);
      await createPayment({ method: payload.method, notes: payload.notes, proofUrl });

      // Paso 3: Mostrar confirmación de éxito
      setShowSuccessModal(true);
      
      toast.success(
        lang === "es" ? "Pago enviado para revisión." : "Payment submitted for review."
      );
      
      // Paso 4: Resetear la deuda mostrada
      setDebt((d) => ({ ...d, amount: 0 }));
      
    } catch (err) {
      console.error("[ParentPayment] Error en handleSubmit:", err);

      // Paso 1: Construir mensaje de error desde diferentes fuentes
      const raw = (err && (err.data?.message || err.message)) || String(err || "");

      // Paso 2: Intentar extraer JSON embebido en el string de error
      let parsedMsg = "";
      try {
        const i = raw.indexOf("{");
        if (i !== -1) {
          const jsonStr = raw.slice(i).trim();
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed.message === "string") {
            parsedMsg = parsed.message;
          }
        }
      } catch (parseError) {
        // Ignorar errores de parseo - no todos los errores vienen en JSON
      }

      // Paso 3: Detectar casos específicos de error
      const hayBookingsMsg = "no hay bookings pendientes para pagar";
      const rawLower = raw.toLowerCase();
      const parsedLower = parsedMsg.toLowerCase();

      const isNoBookings =
        rawLower.includes(hayBookingsMsg) || parsedLower.includes(hayBookingsMsg);

      // Caso especial: No hay bookings pendientes (no es realmente un error)
      if (isNoBookings) {
        toast.info(
          lang === "es"
            ? "No tienes pagos pendientes por el momento."
            : "You have no pending payments at this time."
        );
        return; 
      }

      // Paso 4: Otros errores (500, 404, problemas de red, etc.)
      toast.error(
        lang === "es"
          ? `No se pudo enviar el pago: ${raw}`
          : `Failed to submit payment: ${raw}`
      );
    } finally {
      // Siempre desactivar el loading, sin importar si hubo éxito o error
      setLoading(false);
    }
  };

  // Construir nombre completo del padre desde la información del usuario
  const parentFullName = `${user?.name ?? ""} ${user?.last_name ?? ""}`.trim();

  /**
   * Valores iniciales del formulario de pago
   * Se recalculan cuando cambia la deuda o el nombre del padre
   */
  const initialValues = useMemo(() => {
    return {
      total: debt.amount != null ? String(debt.amount) : "",  // Monto de la deuda
      currency: debt.currency || "Q",                         // Moneda (Quetzales)
      date: new Date().toISOString().slice(0, 10),            // Fecha actual en formato YYYY-MM-DD
      method: "transfer",                                     // Método por defecto: transferencia
      notes: "",                                              // Notas vacías inicialmente
      parentName: parentFullName,                             // Nombre del padre (readonly)
      studentName: "",                                        // Estudiante vacío - debe seleccionarse
    };
  }, [debt.amount, debt.currency, parentFullName]);

  /**
   * Configuración de campos de solo lectura en el formulario
   */
  const readOnlyFields = {
    total: typeof debt.amount === "number" && debt.amount > 0, // Total readonly si hay deuda
    studentName: false,                                         // Estudiante es editable (selector)
    parentName: true,                                           // Nombre del padre es readonly
  };

  return (
    <ParentLayout>
      {/* Banner informativo con el monto de la deuda */}
      <div className="px-6 pt-4">
        <DebtBanner amount={debt.amount} currency={debt.currency} />
      </div>

      {/* Formulario de registro de pago */}
      <PaymentForm
        contextRole="parent"                    // Indica que el formulario es para padre
        onSubmit={handleSubmit}                 // Handler cuando se envía el formulario
        initialValues={initialValues}           // Valores iniciales del formulario
        readOnlyFields={readOnlyFields}         // Campos que deben ser readonly
        studentOptions={studentOptions}         // Lista de estudiantes para el selector
        isLoading={loading}                     // Estado de carga para deshabilitar el form
      />

      {/* Modal de confirmación de éxito */}
      <AlertModal
        isOpen={showSuccessModal}
        title={
          lang === "es" 
            ? " ¡Pago Registrado Exitosamente!" 
            : " Payment Registered Successfully!"
        }
        message={
          lang === "es"
            ? "Tu pago ha sido enviado para revisión. El administrador verificará el comprobante y confirmará tu pago pronto."
            : "Your payment has been submitted for review. The administrator will verify the receipt and confirm your payment soon."
        }
        onClose={() => setShowSuccessModal(false)}
      />
    </ParentLayout>
  );
}
