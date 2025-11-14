// src/components/pages/app/EnrollmentSchedule.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { getSchedulesByCourse } from "../../../services/app/schedulesService";
import ScheduleCard from "../../ui/ScheduleCard";
import {
  EnrollmentStepper,
  WeekCalendarView,
  ScheduleSelectedCard,
  NoteInput,
  WeekNavigator,
} from "../../enrollment";

// Helper
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function EnrollmentSchedule() {
  const { token, user } = useAuth?.() ?? { token: null, user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detecta contexto para construir la ruta del paso 3 (payment)
  const isParent = location.pathname.startsWith("/parent");
  const isStudent = location.pathname.startsWith("/student");
  const paymentPath = isParent
    ? "/parent/enrollment/payment"
    : isStudent
    ? "/student/enrollment/payment"
    : "payment";

  // Curso seleccionado
  const courseFromState = location.state?.course || null;
  const courseFromQuery = {
    id: Number(searchParams.get("courseId")) || null,
    name: searchParams.get("courseName") || null,
  };
  const course =
    courseFromState?.id
      ? courseFromState
      : courseFromQuery?.id
      ? courseFromQuery
      : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date())
  );
  const [viewMode, setViewMode] = useState("week");

  useEffect(() => {
    if (!course?.id) {
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
      user?.role?.toLowerCase?.() || user?.roles?.[0]?.toLowerCase?.() || "";
    if (role.includes("parent")) return "Padre";
    if (role.includes("student")) return "Estudiante";
    return "Usuario";
  }, [user]);

  const canContinue = !!selected;

  const goToPayment = useCallback(() => {
    if (!selected?.id) return;
    navigate(paymentPath, {
      state: {
        course,
        schedule: selected,
        note: note.trim(),
      },
    });
  }, [selected, course, note, navigate, paymentPath]);

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

      {/* Stepper */}
      <EnrollmentStepper currentStep={2} />

      {/* Subtítulo */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paso 2: Elige un horario
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Horarios disponibles para{" "}
          <span className="font-medium">{course?.name}</span>
        </p>
      </div>

      {/* Loading skeleton */}
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

      {/* Error */}
      {error && !loading && (
        <Alert color="failure" className="mb-6">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      )}

      {/* Controles de navegación */}
      {!loading && !error && schedules.length > 0 && (
        <WeekNavigator
          currentWeekStart={currentWeekStart}
          onWeekChange={setCurrentWeekStart}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* Vista de horarios */}
      {!loading && !error && (
        <>
          {schedules.length === 0 ? (
            <Alert color="warning" className="mb-24">
              No hay horarios disponibles por el momento.
            </Alert>
          ) : viewMode === "week" ? (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <WeekCalendarView
                weekStart={currentWeekStart}
                schedules={schedules}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
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

          {/* Horario seleccionado */}
          <ScheduleSelectedCard schedule={selected} />

          {/* Nota opcional */}
          <NoteInput note={note} onChange={setNote} />

          {/* Barra de acciones */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {selected
                  ? "Revisa tu selección antes de continuar"
                  : "Selecciona un horario para continuar"}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Regresar
              </Button>

              <Button
                color="indigo"
                disabled={!canContinue}
                onClick={goToPayment}
                className="flex-1 sm:flex-none"
              >
                Continuar a método de pago
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
