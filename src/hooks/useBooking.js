// src/hooks/useBooking.js

/**
 * @fileoverview Hook personalizado para gestión de reservas (bookings).
 * Maneja estado, operaciones de creación y listado, y notificaciones para la gestión de reservas de clases.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { bookingsService } from "../services/app/bookingsService";

/**
 * Hook para gestionar reservas de clases.
 * 
 * Proporciona funcionalidades para:
 * - Cargar lista de reservas del usuario
 * - Crear nuevas reservas
 * - Gestionar estados de carga y errores
 * 
 * @returns {Object} Estado y funciones de gestión
 * 
 * @example
 * const {
 *   bookings,
 *   loading,
 *   error,
 *   createBooking,
 *   refresh
 * } = useBooking();
 */
export function useBooking() {
  const { token, authFetch } = useAuth();

  /* ==================
     ESTADO
     ================== */
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  /* ==================
     CARGA INICIAL
     ================== */
  
  /**
   * Carga la lista de reservas desde el backend.
   */
  const loadBookings = useCallback(async () => {
    if (!token) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await bookingsService.getBookings(token, authFetch);
      setBookings(data);
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setError(err.message || "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  }, [token, authFetch]);

  // Cargar al montar el componente
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  /* ==================
     OPERACIONES
     ================== */

  /**
   * Crea una nueva reserva de clase.
   * 
   * @param {Object} bookingData - Datos de la reserva
   * @param {number} bookingData.schedule_id - ID del horario (requerido)
   * @param {number} [bookingData.kid_id] - ID del hijo (opcional)
   * @param {string} bookingData.payment_method - Método de pago (requerido)
   * @param {string} [bookingData.note] - Nota adicional (opcional)
   * @returns {Promise<Object>} Objeto con booking y payment creados
   * @throws {Error} Si la creación falla
   * 
   * @example
   * const result = await createBooking({ 
   *   schedule_id: 17, 
   *   kid_id: 10,
   *   payment_method: "transferencia",
   *   note: "Primera clase" 
   * });
   * // { booking: {...}, payment: {...} }
   */
  const createBooking = useCallback(async (bookingData) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      const result = await bookingsService.createBooking(bookingData, token, authFetch);
      
      // Recargar lista completa para obtener los datos con joins
      await loadBookings();
      
      return result;
    } catch (err) {
      console.error("Error creando reserva:", err);
      setError(err.message || "Error al crear la reserva");
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [token, authFetch, loadBookings]);

  /**
   * Recarga la lista de reservas desde el servidor.
   */
  const refresh = useCallback(() => {
    loadBookings();
  }, [loadBookings]);

  /* ==================
     RETURN
     ================== */
  return {
    // Estado
    bookings,
    loading,
    error,
    operationLoading,
    
    // Operaciones
    createBooking,
    refresh,
  };
}
