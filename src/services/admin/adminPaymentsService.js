// src/services/admin/adminPaymentsService.js
/**
 * Servicio para gestión de pagos por parte del administrador
 * Base URL: http://localhost:3000/api/admins/payments
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const PAYMENTS_ENDPOINT = `${API_BASE}/admins/payments`;

/**
 * 1. Obtiene todos los pagos
 * GET /api/admins/payments
 */
export async function getPayments() {
  try {
    const response = await fetch(PAYMENTS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los pagos');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * 2. Obtiene detalles de un pago específico
 * GET /api/admins/payments/:id
 */
export async function getPaymentById(paymentId) {
  try {
    const response = await fetch(`${PAYMENTS_ENDPOINT}/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener el pago');
    }

    const data = await response.json();
    return data.payment;
  } catch (error) {
    throw error;
  }
}

/**
 * 3. Crea un nuevo pago manualmente (principalmente para efectivo)
 * POST /api/admins/payments
 */
export async function createPayment(paymentData) {
  try {
    const response = await fetch(PAYMENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear el pago');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * 4. Actualiza información de un pago
 * PUT /api/admins/payments/:id
 */
export async function updatePayment(paymentId, paymentData) {
  try {
    const response = await fetch(`${PAYMENTS_ENDPOINT}/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el pago');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * ⭐ 5. CONFIRMA un pago (marca estudiantes como solventes)
 * PATCH /api/admins/payments/:id/confirm
 */
export async function confirmPayment(paymentId, note = '') {
  try {
    const response = await fetch(`${PAYMENTS_ENDPOINT}/${paymentId}/confirm`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al confirmar el pago');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * 6. RECHAZA un pago con motivo obligatorio
 * PATCH /api/admins/payments/:id/reject
 */
export async function rejectPayment(paymentId, reason) {
  if (!reason || reason.trim() === '') {
    throw new Error('El motivo del rechazo es obligatorio');
  }

  try {
    const response = await fetch(`${PAYMENTS_ENDPOINT}/${paymentId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: reason }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al rechazar el pago');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
