// src/components/pages/parent/ParentPayment.jsx
/**
 * @description Página de registro de pagos para el rol padre.
 * 
 * Funcionalidades principales:
 * - Muestra las clases pendientes de pago de los hijos del padre
 * - Permite seleccionar múltiples clases para pagar en una sola transacción
 * - Requiere subir comprobante de pago (obligatorio)
 * - Solo permite transferencia o depósito (no efectivo)
 * - Envía pagos para revisión del administrador
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentMultiPaymentForm from "../../forms/ParentMultiPaymentForm";
import ParentLayout from "../../layout/parent/ParentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { createPayment } from "../../../services/admin/adminPaymentsService";

/**
 * Componente principal de la página de registro de pagos para padres
 */
export default function ParentPayment() {
  const navigate = useNavigate();
  const { lang } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (paymentData) => {
    try {
      setIsLoading(true);
      
      // El payload ya viene correctamente formateado desde ParentMultiPaymentForm
      console.log("Enviando pago del padre:", paymentData);
      const result = await createPayment(paymentData);
      
      alert(
        lang === "es" 
          ? "Pago registrado exitosamente. El administrador lo revisará pronto." 
          : "Payment successfully registered. The administrator will review it soon."
      );
      navigate("/parent/dashboard");
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
    <ParentLayout>
      <ParentMultiPaymentForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ParentLayout>
  );
}
