// src/components/pages/app/EnrollmentSchedule.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { getSchedulesByCourse } from "../../../services/app/schedulesService";
import ScheduleCard from "../../ui/ScheduleCard";

export default function EnrollmentSchedule() {
  const { token, user } = useAuth?.() ?? { token: null, user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detecta contexto para construir la ruta del paso 3 (confirmación)
  const isParent = location.pathname.startsWith("/parent");
  const isStudent = location.pathname.startsWith("/student");
  const confirmPath = isParent
    ? "/parent/enrollment/confirm"
    : isStudent
    ? "/student/enrollment/confirm"
    : "confirm"; // fallback si usas rutas anidadas

  // Curso seleccionado (preferimos state del paso 1)
  const courseFromState = location.state?.course || null;
  const courseFromQuery = {
    id: Number(searchParams.get("courseId")) || null,
    name: searchParams.get("courseName") || null,
  };
  const course =
    courseFromState?.id ? courseFromState : courseFromQuery?.id ? courseFromQuery : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!course?.id) {
      // si no hay curso, volvemos al paso 1
      navigate(-1);
      return;
    }

    let alive = true;
    setLoading(true);
    setError("");

    getSchedulesByCourse(course.id, { token })
      .then((list) => {
        if (!alive) return;
        setSchedules(list);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "No se pudieron cargar los horarios");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [course?.id, token, navigate]);

  const roleText = useMemo(() => {
    const role =
      user?.role?.toLowerCase?.() ||
      user?.roles?.[0]?.toLowerCase?.() ||
      "";
    if (role.includes("parent")) return "Padre";
    if (role.includes("student")) return "Estudiante";
    return "Usuario";
  }, [user]);

  const canContinue = !!selected;

  const goToConfirm = () => {
    if (!selected?.id) return;
    // Si más adelante agregas selección de hijo (kid_id) en este paso,
    // pásalo aquí dentro de "state".
    navigate(confirmPath, {
      state: {
        course,
        schedule: selected,
        note: note.trim(),
        // kid_id: selectedKidId, // opcional (solo padre)
      },
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inscripción
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {roleText}: elige un horario para{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {course?.name}
          </span>
        </p>
      </div>

      {/* Stepper CENTRADO (Paso 2 activo) */}
      <div className="mb-6 flex w-full justify-center">
        <nav aria-label="Stepper" className="w-full max-w-2xl">
          <ol className="flex items-center justify-center gap-3">
            {/* Paso 1 */}
            <li className="flex w-full items-center text-indigo-600 dark:text-indigo-400 after:content-[''] after:w-full after:h-1 after:border-b after:border-indigo-200/60 after:border-4 after:inline-block dark:after:border-indigo-800/60">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                <svg
                  className="h-4 w-4 text-indigo-700 dark:text-indigo-200"
                  viewBox="0 0 16 12"
                  fill="none"
                >
                  <path
                    d="M1 6 5.5 10.5 15 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </li>

            {/* Paso 2 activo */}
            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-indigo-200/60 after:border-4 after:inline-block dark:after:border-indigo-800/60">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                <svg
                  className="h-5 w-5 text-indigo-700 dark:text-indigo-200"
                  viewBox="0 0 20 16"
                  fill="currentColor"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                </svg>
              </span>
            </li>

            {/* Paso 3 */}
            <li className="flex w-full items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-100"
                  viewBox="0 0 18 20"
                  fill="currentColor"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1 1 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                </svg>
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Subtítulo */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paso 2: Elige un horario
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Horarios disponibles para <span className="font-medium">{course?.name}</span>
        </p>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="mb-2 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <Alert color="failure" className="mb-6">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      )}

      {/* Grid de horarios */}
      {!loading && !error && (
        <>
          {schedules.length === 0 ? (
            <Alert color="warning" className="mb-24">
              No hay horarios disponibles por el momento.
            </Alert>
          ) : (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((s) => (
                <ScheduleCard
                  key={s.id}
                  schedule={s}
                  selected={selected?.id === s.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}

          {/* Nota opcional */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Nota para la reserva (opcional)
            </label>
            <Textarea
              rows={3}
              placeholder="Ej. Prefiero este horario por disponibilidad de transporte..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Puedes agregar cualquier información adicional que consideres relevante para tu inscripción.
            </p>
          </div>

          {/* Barra de acciones */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {selected ? "Revisa tu selección antes de continuar" : "Selecciona un horario para continuar"}
              </span>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              <Button
                color="gray"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Regresar
              </Button>

              <Button
                color="indigo"
                disabled={!canContinue}
                onClick={goToConfirm}
                className="flex-1 sm:flex-none"
              >
                Continuar al resumen
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
