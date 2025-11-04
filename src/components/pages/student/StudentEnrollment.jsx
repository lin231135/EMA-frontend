// src/components/pages/student/StudentEnrollment.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import Enrollment from "../app/Enrollment";

/**
 * Página de inscripción para estudiantes
 * Envuelve el componente Enrollment con el StudentLayout
 */
export default function StudentEnrollment() {
  return (
    <StudentLayout>
      <Enrollment />
    </StudentLayout>
  );
}
