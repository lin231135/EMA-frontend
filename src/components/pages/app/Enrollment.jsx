// src/components/pages/app/Enrollment.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getActiveCourses } from "../../../services/app/coursesService";
import { useAuth } from "../../../contexts/AuthContext";
import { EnrollmentStepper, CourseSelectionGrid } from "../../enrollment";

/**
 * Inscripción (Paso 1: Seleccionar curso)
 * - Usable por roles "parent" y "student".
 * - Stepper centrado con el paso 1 activo.
 * - Grid responsive de cursos -> selección.
 * - Este componente NO incluye layout, debe ser envuelto por StudentLayout o ParentLayout.
 */
export default function Enrollment() {
  const auth = useAuth();
  const token = auth?.token;
  const user = auth?.user;

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    if (!token) {
      setError("Debes iniciar sesión para ver los cursos disponibles");
      setLoading(false);
      return;
    }

    getActiveCourses({ token })
      .then((list) => {
        if (!alive) return;
        setCourses(list);
      })
      .catch((err) => {
        if (!alive) return;
        console.error("Error al cargar cursos:", err);
        setError(err?.message || "No se pudieron cargar los cursos");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token]);

  const roleText = useMemo(() => {
    const role =
      user?.role?.toLowerCase?.() ||
      user?.roles?.[0]?.toLowerCase?.() ||
      "";
    if (role.includes("parent")) return "Padre";
    if (role.includes("student")) return "Estudiante";
    return "Usuario";
  }, [user]);

  // Detecta el contexto para construir la ruta del paso 2
  const isParent = location.pathname.startsWith("/parent");
  const isStudent = location.pathname.startsWith("/student");
  const schedulePath = isParent
    ? "/parent/enrollment/schedule"
    : isStudent
    ? "/student/enrollment/schedule"
    : "schedule";

  const handleContinue = () => {
    navigate(schedulePath, { state: { course: selected } });
  };

  return (
    <div className="w-full">
      {/* Título de la página */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Inscripción
      </h1>

      {/* Stepper */}
      <EnrollmentStepper currentStep={1} />

      {/* Encabezado contextual */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paso 1: Selecciona un curso
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {roleText}: elige el curso al que deseas inscribirte.
        </p>
      </div>

      {/* Grid de cursos con estados */}
      <CourseSelectionGrid
        courses={courses}
        selected={selected}
        onSelect={setSelected}
        onContinue={handleContinue}
        loading={loading}
        error={error}
      />
    </div>
  );
}
