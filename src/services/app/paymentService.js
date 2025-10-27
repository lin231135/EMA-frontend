// src/services/app/paymentService.js
/**
 * @file paymentService.js
 * @description Servicio de pagos para comunicación con el backend
 * 
 * Características principales:
 * - Gestiona peticiones HTTP al backend de pagos
 * - Utiliza VITE_API_URL como URL base configurable
 * - Adjunta automáticamente token de autenticación en headers
 * - Normaliza respuestas del backend al formato esperado por la UI
 * - Maneja diferentes formatos de respuesta del API
 * - Soporta filtrado por hijo para padres mediante query parameters
 * - Genera IDs únicos para registros sin identificador
 * 
 * Formato de salida normalizado por item:
 * {
 *   id: string,              // Identificador único del pago
 *   serialNumber: string,    // Número de serie del pago (ej: EMA-0001)
 *   description: string,     // Descripción del concepto pagado
 *   monthPaid: string,       // Mes pagado (en inglés para traducción posterior)
 *   year: string,           // Año del pago
 *   totalCost: string       // Costo total con formato de moneda
 * }
 * 
 * Endpoints soportados:
 * - GET /parent/payments/history[?kid_id=...] - Historial de pagos del padre
 * - GET /student/payments/history - Historial de pagos del estudiante
 * 
 * @author EMA Development Team
 * @version 1.0.0
 */

/**
 * URL base del API obtenida de variables de entorno
 * Se elimina el trailing slash si existe para evitar URLs duplicadas
 * Valor por defecto: http://localhost:5000/api
 */
const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "")) || "http://localhost:5000/api";

/**
 * Genera headers de autenticación para peticiones HTTP
 * 
 * Incluye Content-Type y Authorization Bearer token necesarios
 * para comunicarse con el backend autenticado
 * 
 * @param {string} token - JWT token de autenticación del usuario
 * @returns {Object} Headers HTTP para fetch
 */
function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Genera un ID aleatorio único utilizando crypto API
 * 
 * Intenta usar crypto.randomUUID() (estándar moderno)
 * Si no está disponible, usa Math.random() como fallback
 * 
 * @returns {string} ID único aleatorio
 */
function cryptoRandomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

/**
 * Normaliza la respuesta del backend al formato esperado por la UI
 * 
 * Maneja múltiples formatos de respuesta del backend para asegurar
 * consistencia en la capa de presentación. Extrae y transforma campos
 * que pueden venir con diferentes nombres según el endpoint.
 * 
 * Campos normalizados:
 * - id: payment_id, pid, o genera uno aleatorio
 * - serialNumber: serial_number, serial, o genera formato EMA-XXXX
 * - description: item_description, concept, course_name
 * - monthPaid: month_paid, month, o extrae de payment_date
 * - year: extrae de payment_date o usa valor por defecto
 * - totalCost: total, subtotal, amount con formato de moneda
 * 
 * @param {Array<Object>} items - Array de pagos sin normalizar del backend
 * @returns {Array<Object>} Array de pagos normalizados al formato de la UI
 */
function normalizePayments(items = []) {
  return items.map((it) => {
    // Extrae o genera ID único
    const id = it.id ?? it.payment_id ?? it.pid ?? cryptoRandomId();
    
    // ID del pago (para modal de detalles)
    const paymentId = it.paymentId ?? it.payment_id ?? id;
    
    // Extrae o genera número de serie
    const serial = it.serialNumber ?? it.serial_number ?? it.serial ?? `EMA-${String(id).padStart(4, "0")}`;
    
    // Extrae descripción del pago
    const desc =
      it.description ??
      it.item_description ??
      it.concept ??
      it.course_name ??
      "Payment Item";

    // Extrae mes pagado (en inglés para traducción posterior)
    const month =
      it.monthPaid ??
      it.month_paid ??
      it.month ??
      (it.payment_date
        ? new Date(it.payment_date).toLocaleString("en-US", { month: "long" })
        : "January");

    // Extrae año del pago
    const year =
      it.year ??
      (it.payment_date ? String(new Date(it.payment_date).getFullYear()) : "2024");

    // Extrae monto total
    const total = it.totalCost ?? it.total ?? it.subtotal ?? it.amount ?? 0;

    // Formatea monto como string con símbolo de moneda
    const totalStr =
      typeof total === "number"
        ? `$${total.toFixed(2)}`
        : /^\d+(\.\d+)?$/.test(String(total))
        ? `$${Number(total).toFixed(2)}`
        : String(total);

    // Extrae información adicional del pago
    const state = it.state ?? "pendiente";
    const paymentMethod = it.paymentMethod ?? it.payment_method ?? null;
    const adminNote = it.adminNote ?? it.admin_note ?? null;
    const userNote = it.userNote ?? it.user_note ?? null;
    const referencePic = it.referencePic ?? it.reference_pic ?? null;

    // Retorna objeto normalizado
    return {
      id,
      paymentId,
      serialNumber: String(serial),
      description: String(desc),
      monthPaid: String(month),
      year: String(year),
      totalCost: totalStr,
      state,
      paymentMethod,
      adminNote,
      userNote,
      referencePic,
    };
  });
}

// ===== Funciones exportadas del servicio =====

/**
 * Obtiene el historial de pagos del padre desde el backend
 * 
 * Endpoint: GET /parent/payments/history[?kid_id=...]
 * 
 * Soporta filtrado opcional por hijo mediante el parámetro kidId.
 * Si se proporciona kidId, solo retorna pagos asociados a ese hijo.
 * Si no se proporciona, retorna todos los pagos del padre.
 * 
 * Proceso:
 * 1. Construye la URL con query parameter opcional
 * 2. Realiza petición GET con autenticación Bearer
 * 3. Verifica respuesta HTTP exitosa
 * 4. Extrae array de items de la respuesta
 * 5. Normaliza datos al formato de la UI
 * 
 * @param {Object} params - Parámetros de la petición
 * @param {string} params.token - JWT token de autenticación
 * @param {string} [params.kidId] - ID opcional del hijo para filtrar pagos
 * @returns {Promise<Array<Object>>} Promise con array de pagos normalizados
 * @throws {Error} Si la petición falla o el servidor retorna error
 * 
 * @example
 * // Obtener todos los pagos del padre
 * const payments = await fetchParentPayments({ token: "jwt-token" });
 * 
 * @example
 * // Obtener pagos de un hijo específico
 * const payments = await fetchParentPayments({ token: "jwt-token", kidId: "123" });
 */
export async function fetchParentPayments({ token, kidId }) {
  // Construye query string si se proporciona kidId
  const qs = kidId ? `?kid_id=${encodeURIComponent(kidId)}` : "";
  const url = `${API_BASE}/parent/payments/history${qs}`;
  
  // Realiza petición GET con autenticación
  const res = await fetch(url, { headers: authHeaders(token) });

  // Verifica respuesta exitosa
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  // Extrae datos de la respuesta
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items || [];
  
  // Normaliza y retorna
  return normalizePayments(items);
}

/**
 * Obtiene el historial de pagos del estudiante desde el backend
 * 
 * Endpoint: GET /student/payments/history
 * 
 * Retorna todos los pagos asociados al estudiante autenticado.
 * No requiere parámetros adicionales ya que el backend identifica
 * al estudiante mediante el token JWT.
 * 
 * Proceso:
 * 1. Construye la URL del endpoint
 * 2. Realiza petición GET con autenticación Bearer
 * 3. Verifica respuesta HTTP exitosa
 * 4. Extrae array de items de la respuesta
 * 5. Normaliza datos al formato de la UI
 * 
 * @param {Object} params - Parámetros de la petición
 * @param {string} params.token - JWT token de autenticación del estudiante
 * @returns {Promise<Array<Object>>} Promise con array de pagos normalizados
 * @throws {Error} Si la petición falla o el servidor retorna error
 * 
 * @example
 * // Obtener historial de pagos del estudiante
 * const payments = await fetchStudentPayments({ token: "jwt-token" });
 */
export async function fetchStudentPayments({ token }) {
  // Construye URL del endpoint de estudiante
  const url = `${API_BASE}/student/payments/history`;
  
  // Realiza petición GET con autenticación
  const res = await fetch(url, { headers: authHeaders(token) });

  // Verifica respuesta exitosa
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  // Extrae datos de la respuesta
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items || [];
  
  // Normaliza y retorna
  return normalizePayments(items);
}
