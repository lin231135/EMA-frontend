// src/components/pages/app/EnrollmentSchedule.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, Textarea, Badge } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { getSchedulesByCourse } from "../../../services/app/schedulesService";
import ScheduleCard from "../../ui/ScheduleCard";

// Helpers para manejo de fechas
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
  return new Date(d.setDate(diff));
};

const sameYMD = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const fmtKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatTime = (hour) => {
  const h = hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${h}:00 ${period}`;
};

// Horarios de 8 AM a 8 PM
const SCHEDULE_HOURS = Array.from({ length: 13 }, (_, i) => 8 + i);

// Nombres de días
const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Colores para los horarios
const COLOR_PALETTE = [
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-cyan-500 hover:bg-cyan-600",
];

/** Componente Vista de Semana */
function WeekView({ weekStart, schedules, selected, onSelect }) {
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // Organizar horarios por día
  const schedulesByDay = useMemo(() => {
    const map = {};
    schedules.forEach(schedule => {
      const scheduleDate = new Date(schedule.scheduleDate);
      const dayKey = fmtKey(scheduleDate);
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(schedule);
    });
    return map;
  }, [schedules]);

  const hasSchedules = weekDays.some(day => {
    const dayKey = fmtKey(day);
    return schedulesByDay[dayKey] && schedulesByDay[dayKey].length > 0;
  });

  return (
    <div className="flex-1 overflow-x-auto">
      {/* Grid de semana */}
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-1">
          {/* Columna de horas */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-l-lg">
            <div className="h-14 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-300 dark:border-gray-600">
              Hora
            </div>
            {SCHEDULE_HOURS.map((hour) => (
              <div key={hour} className="h-20 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-600/50">
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {weekDays.map((day, dayIndex) => {
            const dayKey = fmtKey(day);
            const daySchedules = schedulesByDay[dayKey] || [];
            const isToday = sameYMD(day, new Date());
            
            return (
              <div key={dayKey} className={`bg-white dark:bg-gray-800 ${dayIndex === 6 ? 'rounded-r-lg' : ''} border-l border-gray-200 dark:border-gray-700`}>
                {/* Header del día */}
                <div className={`h-14 flex flex-col items-center justify-center border-b-2 ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {DAY_NAMES[dayIndex]}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {day.getDate()}
                  </div>
                </div>

                {/* Slots de horas */}
                {SCHEDULE_HOURS.map((hour) => {
                  // Encontrar horarios que coincidan con esta hora
                  const matchingSchedules = daySchedules.filter(schedule => {
                    const startTime = schedule.startTime;
                    const scheduleHour = parseInt(startTime.split(':')[0]);
                    return scheduleHour === hour;
                  });

                  return (
                    <div key={`${dayKey}-${hour}`} className="h-20 border-b border-gray-100 dark:border-gray-700 p-1 relative flex flex-col gap-1">
                      {matchingSchedules.map((schedule, idx) => {
                        const isSelected = selected?.id === schedule.id;
                        const colorClass = COLOR_PALETTE[schedule.id % COLOR_PALETTE.length];
                        
                        return (
                          <button
                            key={schedule.id}
                            onClick={() => onSelect(schedule)}
                            className={`w-full h-full text-left text-xs px-2 py-2 rounded-md transition-all duration-200 flex flex-col justify-center ${
                              isSelected 
                                ? 'bg-indigo-600 dark:bg-indigo-500 text-white ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-gray-800 shadow-lg scale-[1.02]' 
                                : `${colorClass} text-white opacity-90 hover:opacity-100 hover:shadow-md`
                            }`}
                          >
                            <div className="font-semibold truncate">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="text-[10px] opacity-90 truncate">
                              Cap: {schedule.capacity}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {!hasSchedules && (
        <div className="flex items-center justify-center py-12 mt-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No hay horarios disponibles esta semana
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date()));
  const [viewMode, setViewMode] = useState("week"); // "week" o "list"

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

      {/* Controles de vista y navegación de semana */}
      {!loading && !error && schedules.length > 0 && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Navegación de semana */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="light"
              onClick={() => setCurrentWeekStart(prev => addDays(prev, -7))}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {currentWeekStart.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })} - {addDays(currentWeekStart, 6).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <Button
              size="sm"
              color="light"
              onClick={() => setCurrentWeekStart(prev => addDays(prev, 7))}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>

            <Button
              size="sm"
              color="gray"
              onClick={() => setCurrentWeekStart(startOfWeek(new Date()))}
            >
              Hoy
            </Button>
          </div>

          {/* Toggle de vista */}
          <div className="flex gap-2">
            <Button
              size="sm"
              color={viewMode === "week" ? "indigo" : "light"}
              onClick={() => setViewMode("week")}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Semana
            </Button>
            <Button
              size="sm"
              color={viewMode === "list" ? "indigo" : "light"}
              onClick={() => setViewMode("list")}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Lista
            </Button>
          </div>
        </div>
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
              <WeekView
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
          {selected && (
            <div className="mb-6 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg dark:border-indigo-800 dark:from-indigo-950/20 dark:to-gray-800">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Horario seleccionado
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selected.scheduleDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
                  <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Inicio</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selected.startTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
                  <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fin</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selected.endTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
                  <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Capacidad</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selected.capacity} personas</p>
                  </div>
                </div>
              </div>
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
