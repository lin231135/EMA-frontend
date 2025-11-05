// src/components/pages/parent/ParentEnrollmentSchedule.jsx
import ParentLayout from "../../layout/parent/ParentLayout";
import EnrollmentSchedule from "../app/EnrollmentSchedule";

/**
 * Página de selección de horario para padres (Paso 2)
 * Envuelve el componente EnrollmentSchedule con el ParentLayout
 */
export default function ParentEnrollmentSchedule() {
  return (
    <ParentLayout>
      <EnrollmentSchedule />
    </ParentLayout>
  );
}
