// src/components/pages/parent/ParentEnrollment.jsx
import ParentLayout from "../../layout/parent/ParentLayout";
import Enrollment from "../app/Enrollment";

/**
 * Página de inscripción para padres
 * Envuelve el componente Enrollment con el ParentLayout
 */
export default function ParentEnrollment() {
  return (
    <ParentLayout>
      <Enrollment />
    </ParentLayout>
  );
}
