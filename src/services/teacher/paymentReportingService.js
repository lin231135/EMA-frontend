// src/services/teacher/paymentReportingService.js
/**
 * Servicio para que el maestro gestione pagos en efectivo:
 * - Listar pagos pendientes asignados al maestro
 * - Marcar un pago como "en revisión"
 * - Reportar pagos incorrectos o no recibidos
 */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const TEACHER_ENDPOINT = `${API_BASE}/teachers`;

/**
 * Helper para construir headers con/sin token
 * @param {string} [token]
 */
function buildHeaders(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Lista de pagos pendientes (en efectivo) para el maestro autenticado
 * Endpoint: GET /api/teachers/payments/pending
 * @param {string} [token] - JWT opcional
 * @returns {Promise<Array>}
 */
export async function getPendingPayments(token) {
  const response = await fetch(`${TEACHER_ENDPOINT}/payments/pending`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (_) {}
    const message =
      errorBody?.error ||
      errorBody?.message ||
      "Error al obtener los pagos pendientes";
    throw new Error(message);
  }

  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.payments)) return data.payments;
  return [];
}

/**
 * Marca un pago como "revision"
 * Endpoint: PUT /api/teachers/payments/:paymentId/revision
 * @param {number} paymentId
 * @param {string} [token]
 */
export async function markPaymentAsRevision(paymentId, token) {
  const response = await fetch(
    `${TEACHER_ENDPOINT}/payments/${paymentId}/revision`,
    {
      method: "PUT",
      headers: buildHeaders(token),
    }
  );

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (_) {}
    const message =
      errorBody?.error ||
      errorBody?.message ||
      "Error al actualizar el estado del pago";
    throw new Error(message);
  }

  return await response.json();
}

/**
 * Reporta un pago incorrecto o no recibido
 * Endpoint: POST /api/teachers/payments/report
 * @param {number} paymentId
 * @param {string} reason
 * @param {string} [token]
 */
export async function reportPaymentIssue(paymentId, reason, token) {
  const response = await fetch(`${TEACHER_ENDPOINT}/payments/report`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ paymentId, reason }),
  });

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (_) {}
    const message =
      errorBody?.error ||
      errorBody?.message ||
      "Error al enviar el reporte de pago";
    throw new Error(message);
  }

  return await response.json();
}
