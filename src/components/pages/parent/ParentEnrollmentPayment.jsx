// src/components/pages/parent/ParentEnrollmentPayment.jsx
import ParentLayout from "../../layout/parent/ParentLayout";
import EnrollmentPayment from "../app/EnrollmentPayment";

/**
 * Página de selección de método de pago para padres
 * Envuelve el componente EnrollmentPayment con el ParentLayout
 */
export default function ParentEnrollmentPayment() {
  return (
    <ParentLayout>
      <EnrollmentPayment />
    </ParentLayout>
  );
}
