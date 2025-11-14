// src/components/pages/student/StudentPayment.jsx
/**
 * @description Página de registro de pagos para el rol estudiante (adulto).
 * 
 * Funcionalidades principales:
 * - Muestra las clases pendientes de pago del estudiante
 * - Permite seleccionar múltiples clases para pagar en una sola transacción
 * - Requiere subir comprobante de pago (obligatorio)
 * - Solo permite transferencia o depósito (no efectivo)
 * - Envía pagos para revisión del administrador
 * - Interfaz moderna igual a la de padres y administradores
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentMultiPaymentForm from "../../forms/ParentMultiPaymentForm";
import StudentLayout from "../../layout/student/StudentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { createPayment } from "../../../services/admin/adminPaymentsService";
import { getUnpaidBookingsByStudent } from "../../../services/student/studentBookingsService";

/**
 * Componente principal de la página de registro de pagos para estudiantes
 */
export default function StudentPayment() {
  const navigate = useNavigate();
  const { lang } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (paymentData) => {
    try {
      setIsLoading(true);
      
      // El payload ya viene correctamente formateado desde StudentMultiPaymentForm
      console.log("Enviando pago del estudiante:", paymentData);
      const result = await createPayment(paymentData);
      
      alert(
        lang === "es" 
          ? "Pago registrado exitosamente. El administrador lo revisará pronto." 
          : "Payment successfully registered. The administrator will review it soon."
      );
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alert(
        lang === "es"
          ? "Error al registrar el pago: " + error.message
          : "Error registering payment: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <ParentMultiPaymentForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        bookingsService={getUnpaidBookingsByStudent}
      />
    </StudentLayout>
  );
}
