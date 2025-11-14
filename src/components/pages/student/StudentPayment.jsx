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
import { updatePaymentsWithProof } from "../../../services/student/studentPaymentProofService";
import { getUnpaidBookingsByStudent } from "../../../services/student/studentBookingsService";

/**
 * Componente principal de la página de registro de pagos para estudiantes
 */
export default function StudentPayment() {
  const navigate = useNavigate();
  const { lang, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (paymentData) => {
    try {
      setIsLoading(true);
      
      // El comprobante ya fue subido a ImageKit en ParentMultiPaymentForm
      // Ahora solo actualizamos los pagos con la URL del comprobante
      console.log("Actualizando pagos con comprobante:", paymentData);
      
      const result = await updatePaymentsWithProof(
        paymentData.payment_ids,
        paymentData.reference_pic,
        paymentData.note,
        token
      );
      
      alert(
        lang === "es" 
          ? "Comprobante subido exitosamente. El administrador lo revisará pronto." 
          : "Proof uploaded successfully. The administrator will review it soon."
      );
      navigate("/student/historyPayments");
    } catch (error) {
      console.error("Error al actualizar pagos:", error);
      alert(
        lang === "es"
          ? "Error al actualizar pagos: " + error.message
          : "Error updating payments: " + error.message
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
