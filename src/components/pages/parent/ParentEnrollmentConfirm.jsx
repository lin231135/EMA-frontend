// src/components/pages/parent/ParentEnrollmentConfirm.jsx
import ParentLayout from "../../layout/parent/ParentLayout";
import EnrollmentConfirm from "../app/EnrollmentConfirm";

/**
 * Página de confirmación de inscripción para padres (Paso 3)
 * Envuelve el componente EnrollmentConfirm con el ParentLayout
 */
export default function ParentEnrollmentConfirm() {
  return (
    <ParentLayout>
      <EnrollmentConfirm />
    </ParentLayout>
  );
}
