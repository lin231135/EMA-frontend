// src/components/pages/app/Enrollment.jsx
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../ui/CourseCard";
import { getActiveCourses } from "../../../services/app/coursesService";
import { useAuth } from "../../../contexts/AuthContext"; // si el endpoint requiere token

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

  const canContinue = !!selected;

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
    : "schedule"; // fallback si usas rutas anidadas

  return (
    <div className="w-full">
      {/* Título de la página */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Inscripción
      </h1>

      {/* Stepper CENTRADO */}
      <div className="mb-6 flex w-full justify-center">
        <nav aria-label="Stepper" className="w-full max-w-2xl">
          <ol className="flex items-center justify-center gap-3">
            {/* Paso 1: Activo */}
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 lg:h-12 lg:w-12">
                <svg
                  className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-200 lg:h-4 lg:w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
              </span>
              {/* Conector */}
              <div className="hidden h-1 w-16 rounded bg-indigo-200 dark:bg-indigo-900 sm:block"></div>
            </li>

            {/* Paso 2: Deshabilitado */}
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:h-12 lg:w-12">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                </svg>
              </span>
              {/* Conector */}
              <div className="hidden h-1 w-16 rounded bg-gray-300 dark:bg-gray-700 sm:block"></div>
            </li>

            {/* Paso 3: Deshabilitado */}
            <li className="flex items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:h-12 lg:w-12">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1 1 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                </svg>
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Encabezado contextual */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-100">
          Paso 1: Selecciona un curso
        </h2>
        <p className="text-sm text-slate-400">
          {roleText}: elige el curso al que deseas inscribirte.
        </p>
      </div>

      {/* Estado de carga / error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-300">
          <Spinner aria-label="Cargando cursos" />
          <span>Cargando cursos...</span>
        </div>
      )}

      {error && !loading && (
        <Alert color="failure" className="mb-4">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      )}

      {/* Grid de cursos */}
      {!loading && !error && (
        <>
          {courses.length === 0 ? (
            <Alert color="warning" className="mb-6">
              No hay cursos activos disponibles por el momento.
            </Alert>
          ) : (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  selected={selected?.id === c.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setSelected(null)} disabled={!selected}>
              Quitar selección
            </Button>

            <Button
              color="indigo"
              disabled={!canContinue}
              onClick={() => {
                // Navega al Paso 2 con el curso seleccionado.
                navigate(schedulePath, { state: { course: selected } });
              }}
            >
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
