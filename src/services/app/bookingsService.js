// src/services/app/bookingsService.js

/**
 * @fileoverview Servicio para la gestión de reservas (bookings) de clases.
 * Proporciona funciones para crear reservas y obtener el historial de reservas del usuario.
 * 
 * ENDPOINTS UTILIZADOS:
 * - POST /api/bookings → Crear nueva reserva
 * - GET  /api/bookings → Obtener reservas del usuario autenticado
 */

const API_BASE = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/**
 * Construye los headers de autenticación para las peticiones API.
 * 
 * @param {string} token - Token JWT de autenticación
 * @param {boolean} isJson - Si true, incluye Content-Type: application/json
 * @returns {Object} Headers de la petición
 */
const buildHeaders = (token, isJson = true) => {
  const headers = {
    Accept: "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

/**
 * Procesa la respuesta de la API y lanza errores si es necesario.
 * 
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<Object>} Datos parseados de la respuesta
 * @throws {Error} Si la respuesta no es exitosa
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Si no se puede parsear el error, usar mensaje genérico
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * Servicio de gestión de reservas (bookings).
 */
export const bookingsService = {
  /**
   * Crea una nueva reserva de clase para el usuario autenticado.
   * Automáticamente crea un pago asociado a la reserva.
   * 
   * @param {Object} bookingData - Datos de la reserva
   * @param {number} bookingData.schedule_id - ID del horario a reservar (requerido)
   * @param {number} [bookingData.kid_id] - ID del hijo que tomará la clase (opcional)
   * @param {string} bookingData.payment_method - Método de pago: "transferencia", "efectivo", etc. (requerido)
   * @param {string} [bookingData.note] - Nota adicional sobre la reserva (opcional)
   * @param {string} token - Token de autenticación
   * @param {Function} authFetch - Función de fetch autenticada (opcional)
   * @returns {Promise<Object>} Objeto con la reserva y el pago creados
   * 
   * @example
   * const result = await bookingsService.createBooking(
   *   { 
   *     schedule_id: 17, 
   *     kid_id: 10, 
   *     payment_method: "transferencia",
   *     note: "Primera clase de prueba" 
   *   },
   *   token
   * );
   * // { booking: {...}, payment: {...} }
   */
  async createBooking(bookingData, token, authFetch = null) {
    if (!bookingData.schedule_id) {
      throw new Error("schedule_id es requerido");
    }
    
    if (!bookingData.payment_method) {
      throw new Error("payment_method es requerido");
    }

    const url = `${API_BASE}/bookings`;
    const fetchFn = authFetch || fetch;
    
    const response = await fetchFn(url, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(bookingData),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },

  /**
   * Obtiene todas las reservas del usuario autenticado.
   * Incluye información detallada del curso, horario y profesor.
   * 
   * @param {string} token - Token de autenticación
   * @param {Function} authFetch - Función de fetch autenticada (opcional)
   * @returns {Promise<Array>} Lista de reservas con detalles
   * 
   * @example
   * const bookings = await bookingsService.getBookings(token);
   * // [{
   * //   id: 19,
   * //   kid_id: 10,
   * //   status: "programada",
   * //   modality: "academia",
   * //   course_name: "Guitarra (Avanzado)",
   * //   schedule_date: "2025-11-17T00:00:00.000Z",
   * //   start_time: "17:00:00",
   * //   end_time: "18:00:00",
   * //   teacher_name: "Miguel",
   * //   teacher_last_name: "Ángel",
   * //   teacher_phone: "+52-55-1234-5683"
   * // }, ...]
   */
  async getBookings(token, authFetch = null) {
    const url = `${API_BASE}/bookings`;
    const fetchFn = authFetch || fetch;
    
    const response = await fetchFn(url, {
      method: "GET",
      headers: buildHeaders(token, false),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },
};
