// src/services/student/studentBookingsService.js
/**
 * Servicio para obtener bookings (reservas) de estudiantes
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Obtiene los bookings pendientes de pago del estudiante
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>} Lista de bookings agrupados por estudiante
 */
export async function getUnpaidBookingsByStudent(token) {
  try {
    const response = await fetch(`${API_BASE}/students/bookings/unpaid`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUnpaidBookingsByStudent:', error);
    throw error;
  }
}
