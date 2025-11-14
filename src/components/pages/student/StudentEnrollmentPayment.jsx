// src/components/pages/student/StudentEnrollmentPayment.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import EnrollmentPayment from "../app/EnrollmentPayment";

/**
 * Página de selección de método de pago para estudiantes
 * Envuelve el componente EnrollmentPayment con el StudentLayout
 */
export default function StudentEnrollmentPayment() {
  return (
    <StudentLayout>
      <EnrollmentPayment />
    </StudentLayout>
  );
}
