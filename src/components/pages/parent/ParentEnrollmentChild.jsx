// src/components/pages/parent/ParentEnrollmentChild.jsx
import ParentLayout from "../../layout/parent/ParentLayout";
import EnrollmentChild from "../app/EnrollmentChild";

/**
 * Página de selección de hijo para inscripción (solo padres)
 * Envuelve el componente EnrollmentChild con el ParentLayout
 */
export default function ParentEnrollmentChild() {
  return (
    <ParentLayout>
      <EnrollmentChild />
    </ParentLayout>
  );
}
