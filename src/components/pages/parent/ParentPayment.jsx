// src/components/pages/parent/ParentPayment.jsx
/**
 * Página de registro de pagos para el rol de padre/encargado
 * Envuelve el componente PaymentForm con el layout de padre
 */

import PaymentForm from "../../forms/PaymentForm";
import ParentLayout from "../../layout/parent/ParentLayout";

/**
 * Esta página permite a los padres/encargados:
 * - Registrar pagos para sus hijos/estudiantes
 * - Cargar comprobantes de pago
 * - Consultar el monto a pagar
 */
export default function ParentPayment() {
  return (
    <ParentLayout>
      {/* Formulario de pagos */}
      <PaymentForm contextRole="parent" />
    </ParentLayout>
  );
}
