// src/components/pages/student/StudentEnrollmentConfirm.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import EnrollmentConfirm from "../app/EnrollmentConfirm";

/**
 * Página de confirmación de inscripción para estudiantes (Paso 3)
 * Envuelve el componente EnrollmentConfirm con el StudentLayout
 */
export default function StudentEnrollmentConfirm() {
  return (
    <StudentLayout>
      <EnrollmentConfirm />
    </StudentLayout>
  );
}
