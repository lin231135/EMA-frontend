// src/components/pages/admin/AdminPayment.jsx
/**
 * Página de registro de pagos para el rol de administrador
 * Envuelve el componente PaymentForm con el layout de administrador
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMultiPaymentForm from "../../forms/AdminMultiPaymentForm";
import AdminLayout from "../../layout/admin/AdminLayout";
import { createPayment } from "../../../services/admin/adminPaymentsService";

/**
 * Esta página permite a los administradores:
 * - Registrar nuevos pagos de estudiantes
 * - Cargar comprobantes de pago
 * - Especificar método y detalles del pago
 */
export default function AdminPayment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (paymentData) => {
    try {
      setIsLoading(true);
      
      // El payload ya viene correctamente formateado desde AdminMultiPaymentForm
      console.log("Enviando pago:", paymentData);
      const result = await createPayment(paymentData);
      
      alert("Pago registrado exitosamente");
      navigate("/admin/payments");
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alert("Error al registrar el pago: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Formulario de pagos multi-estudiante */}
      <AdminMultiPaymentForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
