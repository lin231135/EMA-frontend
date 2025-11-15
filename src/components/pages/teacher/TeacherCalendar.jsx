// src/components/pages/teacher/TeacherCalendar.jsx
/**
 * @file TeacherCalendar.jsx
 * @description Calendario del maestro con vistas de mes, semana y día
 * 
 * Características:
 * - Vista mensual, semanal y diaria
 * - Sidebar con clases de hoy
 * - Agregar nuevas clases
 * - Eventos de ejemplo integrados
 * - Responsive design
 * - Dark mode support
 * 
 * @author EMA Frontend Team
 * @version 1.0.0
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Badge } from "flowbite-react";
import TeacherLayout from "../../layout/teacher/TeacherLayout";
import AddClassModal from "../../ui/AddClassModal";
import { useAuth } from "../../../contexts/AuthContext";

// ============================== UTILIDADES DE FECHA ==============================
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
  return new Date(d.setDate(diff));
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function sameYMD(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function formatTime(hour) {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const suffix = hour < 12 ? "AM" : "PM";
  return `${h}:00 ${suffix}`;
}

// Horas para las vistas de día y semana (8 AM - 8 PM)
const SCHEDULE_HOURS = Array.from({ length: 13 }, (_, i) => 8 + i);

// Nombres de días (abreviados)
const DAY_NAMES_SHORT = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const DAY_NAMES_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// ============================== MAPA DE COLORES ==============================
const COLOR_MAP = {
  indigo: {
    bg: "bg-indigo-200",
    text: "text-indigo-700",
    darkBg: "dark:bg-indigo-300/30",
    darkText: "dark:text-indigo-200",
    border: "border-l-indigo-500",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    badge: "bg-indigo-500",
  },
  pink: {
    bg: "bg-pink-200",
    text: "text-pink-700",
    darkBg: "dark:bg-pink-300/30",
    darkText: "dark:text-pink-200",
    border: "border-l-pink-500",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    badge: "bg-pink-500",
  },
  violet: {
    bg: "bg-violet-200",
    text: "text-violet-700",
    darkBg: "dark:bg-violet-300/30",
    darkText: "dark:text-violet-200",
    border: "border-l-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    badge: "bg-violet-500",
  },
  cyan: {
    bg: "bg-cyan-200",
    text: "text-cyan-700",
    darkBg: "dark:bg-cyan-300/30",
    darkText: "dark:text-cyan-200",
    border: "border-l-cyan-500",
    bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
    badge: "bg-cyan-500",
  },
  orange: {
    bg: "bg-orange-200",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-300/30",
    darkText: "dark:text-orange-200",
    border: "border-l-orange-500",
    bgLight: "bg-orange-50 dark:bg-orange-900/20",
    badge: "bg-orange-500",
  },
};

// ============================== COMPONENTE PRINCIPAL ==============================
export default function TeacherCalendar() {
  const { user } = useAuth?.() ?? {};

  // Estados principales
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [currentDay, setCurrentDay] = useState(() => new Date());
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  const [showModal, setShowModal] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);
  const midnightTimer = useRef(null);

  // Eventos de ejemplo (datos quemados)
  const [events, setEvents] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return {
      [`${year}-${month}-05`]: [
        { label: "Piano Class — 9:00 AM", color: "indigo", course: "Piano Nivel 1" },
        { label: "Sing Class — 11:00 AM", color: "pink", course: "Canto Grupal" },
      ],
      [`${year}-${month}-08`]: [
        { label: "Academy Class — 10:00 AM", color: "violet", course: "Estimulación Musical" },
      ],
      [`${year}-${month}-15`]: [
        { label: "Piano Class — 9:00 AM", color: "indigo", course: "Piano Nivel 2" },
      ],
      [`${year}-${month}-22`]: [
        { label: "Academy Class — 2:00 PM", color: "cyan", course: "Estimulación Musical" },
      ],
    };
  });

  // Auto-follow para actualizar a medianoche
  useEffect(() => {
    if (!autoFollow || view !== "month") return;

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const ms = nextMidnight.getTime() - now.getTime();

    midnightTimer.current && clearTimeout(midnightTimer.current);
    midnightTimer.current = setTimeout(() => {
      const today = new Date();
      setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    }, ms);

    return () => {
      midnightTimer.current && clearTimeout(midnightTimer.current);
    };
  }, [autoFollow, view]);

  // Label del período según vista
  const periodLabel = useMemo(() => {
    if (view === "month") {
      return cursor.toLocaleDateString("es-ES", { year: "numeric", month: "long" });
    } else if (view === "week") {
      const weekStart = currentWeek;
      const weekEnd = addDays(weekStart, 6);
      const startStr = weekStart.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
      const endStr = weekEnd.toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" });
      return `${startStr} - ${endStr}`;
    } else if (view === "day") {
      const dayStr = currentDay.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return sameYMD(currentDay, new Date()) ? `Hoy - ${dayStr}` : dayStr;
    }
    return "";
  }, [view, cursor, currentDay, currentWeek]);

  // Navegación
  const prevPeriod = () => {
    setAutoFollow(false);
    if (view === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
    } else if (view === "week") {
      setCurrentWeek(addDays(currentWeek, -7));
    } else if (view === "day") {
      setCurrentDay(addDays(currentDay, -1));
    }
  };

  const nextPeriod = () => {
    setAutoFollow(false);
    if (view === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
    } else if (view === "week") {
      setCurrentWeek(addDays(currentWeek, 7));
    } else if (view === "day") {
      setCurrentDay(addDays(currentDay, 1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setAutoFollow(true);
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setCurrentDay(today);
    setCurrentWeek(startOfWeek(today));
  };

  // Crear nueva clase
  const handleCreateClass = (data) => {
    if (!data?.date) return;
    const key = data.date;
    const hour = data.hour || "";
    const classType = data.classType || "Nueva Clase";

    const label = hour ? `${classType} — ${hour}` : classType;

    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { label, color: "cyan", course: classType }],
    }));
  };

  return (
    <TeacherLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Calendario
          </h1>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full flex flex-col">
              <button
                onClick={() => setShowModal(true)}
                className="w-full mb-4 px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
              >
                + Agregar Clase
              </button>

              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                Clases de Hoy
              </h2>
              <div className="mt-2 mb-3 h-px bg-gray-200 dark:bg-gray-700" />

              <TodayClassesList events={events} />
            </div>
          </aside>

          {/* Calendario */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full flex flex-col">
              {/* Header del calendario */}
              <div className="flex items-center justify-between mb-8">
                <Button size="sm" color="light" onClick={goToToday} className="text-sm">
                  Hoy
                </Button>
                <div className="flex items-center gap-3">
                  <Button size="sm" color="light" onClick={prevPeriod}>
                    &lt;
                  </Button>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 min-w-[12rem] text-center capitalize">
                    {periodLabel}
                  </h2>
                  <Button size="sm" color="light" onClick={nextPeriod}>
                    &gt;
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    color={view === "day" ? "cyan" : "light"}
                    onClick={() => setView("day")}
                  >
                    Día
                  </Button>
                  <Button
                    size="sm"
                    color={view === "week" ? "cyan" : "light"}
                    onClick={() => setView("week")}
                  >
                    Semana
                  </Button>
                  <Button
                    size="sm"
                    color={view === "month" ? "cyan" : "light"}
                    onClick={() => setView("month")}
                  >
                    Mes
                  </Button>
                </div>
              </div>

              {/* Fila de días (solo vista mensual) */}
              {view === "month" && (
                <div className="grid grid-cols-7 text-center text-gray-900 dark:text-gray-200 text-xs font-semibold mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  {DAY_NAMES_SHORT.map((d, i) => (
                    <div
                      key={`${d}-${i}`}
                      className={`py-2 ${i === 0 ? "rounded-l-md" : ""} ${
                        i === 6 ? "rounded-r-md" : ""
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              )}

              {/* Vistas */}
              {view === "month" && <CalendarGrid cursor={cursor} events={events} />}
              {view === "week" && <WeekView weekStart={currentWeek} events={events} />}
              {view === "day" && <DayView currentDay={currentDay} events={events} />}
            </div>
          </section>
        </div>
      </div>

      {/* Modal */}
      <AddClassModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateClass}
      />
    </TeacherLayout>
  );
}

// ============================== COMPONENTE: CLASES DE HOY ==============================
function TodayClassesList({ events }) {
  const today = new Date();
  const todayKey = fmtKey(today);
  const todayEvents = events[todayKey] || [];

  if (todayEvents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay clases programadas para hoy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-gray-200/70 dark:divide-gray-700/70 flex-1">
      {todayEvents.map((event, index) => {
        const parts = event.label.split(" — ");
        const classType = parts[0];
        const timeStr = parts[1] || "";

        return (
          <div key={index} className="py-3 flex items-start gap-3">
            <span
              className={`h-10 w-10 rounded-full ${
                COLOR_MAP[event.color]?.badge || "bg-gray-200 dark:bg-gray-700"
              } inline-flex items-center justify-center`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l6 6-6 6z"
                />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-white truncate">
                {classType}
              </p>
              <p className="text-sm text-gray-500">
                {timeStr ? `Hoy a las ${timeStr}` : "Programada para hoy"}
              </p>
              {event.course && (
                <p className="text-xs text-gray-400">{event.course}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================== COMPONENTE: GRID MENSUAL ==============================
function CalendarGrid({ cursor, events }) {
  const hatchStyle = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 6px)",
  };
  const hatchStyleDark = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)",
  };

  const gridDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const jsDow = first.getDay();
    const mondayIndex = jsDow === 0 ? 7 : jsDow;
    const leading = mondayIndex - 1;
    const start = addDays(first, -leading);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  return (
    <div className="grid grid-cols-7 grid-rows-6 gap-[6px]">
      {gridDays.map((d) => {
        const key = fmtKey(d);
        const inMonth =
          d.getFullYear() === cursor.getFullYear() &&
          d.getMonth() === cursor.getMonth();
        const chips = events[key] || [];
        const isToday = sameYMD(d, new Date());

        const style = !inMonth
          ? document?.documentElement?.classList?.contains("dark")
            ? hatchStyleDark
            : hatchStyle
          : undefined;

        return (
          <div
            key={key}
            className={[
              "relative min-h-[96px] rounded-lg border p-1.5 bg-white dark:bg-gray-800",
              "border-gray-200 dark:border-gray-700",
              isToday ? "ring-2 ring-cyan-400" : "",
            ].join(" ")}
            style={style}
          >
            <div
              className={`text-[11px] ${
                inMonth
                  ? "text-gray-600 dark:text-gray-300"
                  : "text-gray-400 dark:text-gray-500"
              } text-right`}
            >
              {d.getDate()}
            </div>

            <div className="space-y-1 mt-1">
              {chips.map((ev, idx) => (
                <div
                  key={idx}
                  className={[
                    "truncate rounded px-2 py-[3px] text-[10px]",
                    COLOR_MAP[ev.color]?.bg || COLOR_MAP.cyan.bg,
                    COLOR_MAP[ev.color]?.text || COLOR_MAP.cyan.text,
                    COLOR_MAP[ev.color]?.darkBg || COLOR_MAP.cyan.darkBg,
                    COLOR_MAP[ev.color]?.darkText || COLOR_MAP.cyan.darkText,
                  ].join(" ")}
                  title={ev.label}
                >
                  {ev.label}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================== COMPONENTE: VISTA SEMANAL ==============================
function WeekView({ weekStart, events }) {
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const hasEvents = weekDays.some((day) => {
    const dayKey = fmtKey(day);
    return events[dayKey] && events[dayKey].length > 0;
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-8 gap-1 min-h-full">
        {/* Columna de horas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-l-lg">
          <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            Hora
          </div>
          {SCHEDULE_HOURS.map((hour) => (
            <div
              key={hour}
              className="h-16 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-600/50"
            >
              {formatTime(hour)}
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        {weekDays.map((day, dayIndex) => {
          const dayKey = fmtKey(day);
          const dayEvents = events[dayKey] || [];
          const isToday = sameYMD(day, new Date());

          return (
            <div
              key={dayKey}
              className={`bg-white dark:bg-gray-800 ${
                dayIndex === 6 ? "rounded-r-lg" : ""
              }`}
            >
              {/* Header del día */}
              <div
                className={`h-12 flex flex-col items-center justify-center text-sm border-b border-gray-200 dark:border-gray-600 ${
                  isToday ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {DAY_NAMES_FULL[dayIndex]?.slice(0, 3)}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isToday
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              {/* Slots de horas */}
              {SCHEDULE_HOURS.map((hour) => (
                <div
                  key={`${dayKey}-${hour}`}
                  className="h-16 border-b border-gray-100 dark:border-gray-700 p-1 relative"
                >
                  {dayEvents
                    .filter((event) => {
                      const eventHour = 8 + (dayEvents.indexOf(event) % 13);
                      return eventHour === hour;
                    })
                    .map((event, eventIndex) => (
                      <Badge
                        key={eventIndex}
                        className={`${
                          COLOR_MAP[event.color]?.badge || COLOR_MAP.cyan.badge
                        } text-white text-xs absolute left-1 right-1 top-1`}
                      >
                        {event.label.split(" — ")[0]}
                      </Badge>
                    ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {!hasEvents && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No hay eventos esta semana
          </p>
        </div>
      )}
    </div>
  );
}

// ============================== COMPONENTE: VISTA DIARIA ==============================
function DayView({ currentDay, events }) {
  const dayKey = fmtKey(currentDay);
  const dayEvents = events[dayKey] || [];
  const isToday = sameYMD(currentDay, new Date());

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-4">
        {/* Header del día */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                {currentDay.toLocaleDateString("es-ES", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              {isToday && (
                <Badge color="blue" className="mt-1">
                  Hoy
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dayEvents.length} {dayEvents.length === 1 ? "evento" : "eventos"}
              </p>
            </div>
          </div>
        </Card>

        {/* Timeline del día */}
        <Card className="flex-1">
          <div className="p-4">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
              Horario
            </h4>

            {dayEvents.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No hay eventos hoy
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {SCHEDULE_HOURS.map((hour) => {
                  const hourEvents = dayEvents.filter((_, index) => {
                    const eventHour = 8 + (index % 13);
                    return eventHour === hour;
                  });

                  return (
                    <div key={hour} className="flex gap-4">
                      <div className="w-20 flex-shrink-0 text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(hour)}
                        </span>
                      </div>

                      <div className="flex-1">
                        {hourEvents.length > 0 ? (
                          <div className="space-y-2">
                            {hourEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`p-3 rounded-lg border-l-4 ${
                                  COLOR_MAP[event.color]?.border || COLOR_MAP.cyan.border
                                } ${COLOR_MAP[event.color]?.bgLight || COLOR_MAP.cyan.bgLight}`}
                              >
                                <h5 className="font-medium text-gray-800 dark:text-white">
                                  {event.label}
                                </h5>
                                {event.course && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {event.course}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-8 border-l-2 border-gray-200 dark:border-gray-600 opacity-30"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}