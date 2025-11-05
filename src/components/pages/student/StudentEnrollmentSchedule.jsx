// src/components/pages/student/StudentEnrollmentSchedule.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import EnrollmentSchedule from "../app/EnrollmentSchedule";

/**
 * Página de selección de horario para estudiantes (Paso 2)
 * Envuelve el componente EnrollmentSchedule con el StudentLayout
 */
export default function StudentEnrollmentSchedule() {
  return (
    <StudentLayout>
      <EnrollmentSchedule />
    </StudentLayout>
  );
}
