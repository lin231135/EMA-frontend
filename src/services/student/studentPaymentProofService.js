// src/services/student/studentPaymentProofService.js
/**
 * Servicio para actualizar pagos con comprobante
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Actualiza múltiples pagos pendientes con el comprobante ya subido
 * @param {Array<number>} paymentIds - IDs de los pagos
 * @param {string} referencePic - URL del comprobante (ya subido a ImageKit)
 * @param {string} notes - Notas opcionales
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function updatePaymentsWithProof(paymentIds, referencePic, notes, token) {
  try {
    const response = await fetch(`${API_BASE}/students/payments/upload-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_ids: paymentIds,
        reference_pic: referencePic,
        notes: notes || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir el comprobante');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updatePaymentsWithProof:', error);
    throw error;
  }
}
