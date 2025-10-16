// src/components/pages/student/StudentPayment.jsx
/**
 * Página de registro de pagos para el rol de estudiante
 * Envuelve el componente PaymentForm con el layout de estudiante
 */

import PaymentForm from "../../forms/PaymentForm";
import StudentLayout from "../../layout/student/StudentLayout";

/**
 * Esta página permite a los estudiantes:
 * - Visualizar y registrar sus pagos
 * - Cargar comprobantes de pago
 * - Consultar información de pagos pendientes
 */
export default function StudentPayment() {
  return (
    <StudentLayout>
      {/* Formulario de pagos */}
      <PaymentForm contextRole="student" />
    </StudentLayout>
  );
}
