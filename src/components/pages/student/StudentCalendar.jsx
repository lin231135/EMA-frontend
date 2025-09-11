import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Badge, Tabs } from "flowbite-react";
import StudentLayout from "../../layout/student/StudentLayout";
import AddClassModal from "../../ui/AddClassModal";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";   

// Utilidades de fecha
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

export default function StudentCalendar() {
  const { lang } = useAuth();
  const t = translations[lang].studentCalendar;
  // Fallback por si el orquestador aún no entrega arrays
  const dayNames =
    t.dayNamesShort || ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Eventos de ejemplo traducidos (usando el mes actual)
  const SAMPLE_EVENTS_I18N = useMemo(
    () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      
      return {
        [`${year}-${month}-05`]: [
          { label: t.samples.pianoClass || "Piano Class", color: "indigo" },
          { label: t.samples.singClass || "Sing Class", color: "pink" },
        ],
        [`${year}-${month}-08`]: [{ label: t.samples.academyClass || "Academy Class", color: "violet" }],
        [`${year}-${month}-22`]: [{ label: t.samples.academyClass || "Academy Class", color: "rose" }],
        [`${year}-${month}-30`]: [{ label: t.samples.pianoRecital || "Piano Recital", color: "indigo" }],
      };
    },
    [t]
  );

  const MULTIDAY_I18N = useMemo(
    () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      
      return [
        {
          start: `${year}-${month}-26`,
          end: `${year}-${month}-29`,
          label: t.samples.holiday || "Holiday",
          color: "orange",
        },
      ];
    },
    [t]
  );

  const [view, setView] = useState("month");
  // Usa new Date() para iniciar siempre en mes actual
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  // Para vista de día, también mantener el día específico
  const [currentDay, setCurrentDay] = useState(() => new Date());
  // Para vista de semana, mantener el inicio de semana
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState(SAMPLE_EVENTS_I18N);

  // Auto-follow controlado: activo al inicio; si el usuario navega, se apaga.
  const [autoFollow, setAutoFollow] = useState(true);
  const midnightTimer = useRef(null);

  // Reinyectar eventos traducidos si cambia el idioma
  useEffect(() => {
    setEvents(SAMPLE_EVENTS_I18N);
  }, [SAMPLE_EVENTS_I18N]);

  // Programa un salto a medianoche solo si autoFollow está activo.
  useEffect(() => {
    if (!autoFollow || view !== "month") return;

    // calcula ms hasta la próxima medianoche local
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

  const periodLabel = useMemo(() => {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    if (view === "month") {
      return cursor.toLocaleDateString(locale, { year: "numeric", month: "long" });
    } else if (view === "week") {
      const weekStart = currentWeek;
      const weekEnd = addDays(weekStart, 6);
      const startStr = weekStart.toLocaleDateString(locale, { month: "short", day: "numeric" });
      const endStr = weekEnd.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
      return t.weekView?.weekOf?.replace("{date}", `${startStr} - ${endStr}`) || `${startStr} - ${endStr}`;
    } else if (view === "day") {
      const dayStr = currentDay.toLocaleDateString(locale, { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
      return sameYMD(currentDay, new Date()) 
        ? t.dayView?.todayLabel?.replace("{date}", dayStr) || `Today - ${dayStr}`
        : dayStr;
    }
    return "";
  }, [view, cursor, currentDay, currentWeek, lang, t]);

  const gridDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const jsDow = first.getDay(); // 0 dom..6 sab
    const mondayIndex = jsDow === 0 ? 7 : jsDow; // 1..7
    const leading = mondayIndex - 1;
    const start = addDays(first, -leading);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const colorMap = {
    indigo: { bg: "bg-indigo-200", text: "text-indigo-700", darkBg: "dark:bg-indigo-300/30", darkText: "dark:text-indigo-200" },
    pink: { bg: "bg-pink-200", text: "text-pink-700", darkBg: "dark:bg-pink-300/30", darkText: "dark:text-pink-200" },
    violet: { bg: "bg-violet-200", text: "text-violet-700", darkBg: "dark:bg-violet-300/30", darkText: "dark:text-violet-200" },
    rose: { bg: "bg-rose-200", text: "text-rose-700", darkBg: "dark:bg-rose-300/30", darkText: "dark:text-rose-200" },
    orange: { bg: "bg-orange-200", text: "text-orange-700", darkBg: "dark:bg-orange-300/30", darkText: "dark:text-orange-200" },
    cyan: { bg: "bg-cyan-200", text: "text-cyan-700", darkBg: "dark:bg-cyan-300/30", darkText: "dark:text-cyan-200" },
  };

  const multiByDay = useMemo(() => {
    const map = {};
    for (const r of MULTIDAY_I18N) {
      const start = new Date(r.start);
      const end = new Date(r.end);
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        const key = fmtKey(d);
        map[key] = { ...r, isStart: fmtKey(d) === r.start, isEnd: fmtKey(d) === r.end };
      }
    }
    return map;
  }, [MULTIDAY_I18N]);

  const isSameMonth = (d) =>
    d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();

  const prevPeriod = () => {
    setAutoFollow(false); // usuario tomó control
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

  const handleCreateClass = (data) => {
    if (!data?.date) return;
    const key = data.date;
    const hour = data.hour || "";
    // Intenta usar helper traducible "Today {time}" si el usuario crea clases para "hoy"
    const label = `${data.classType} — ${hour}`;
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { label, color: "cyan" }],
    }));
  };

  const hatchStyle = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 6px)",
  };
  const hatchStyleDark = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)",
  };

  const viewKeys = ["day", "week", "month"];
  const viewLabels = {
    day: t.views.day || "day",
    week: t.views.week || "week",
    month: t.views.month || "month",
  };

  return (
    <StudentLayout>
      <div className="w-full">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {t.title || "Calendar"}
          </h1>
        </div>

        {/* items-stretch para que ambas columnas tengan el mismo alto; tarjetas con h-full */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full flex flex-col">
              <button
                onClick={() => setShowModal(true)}
                aria-label={t.a11y.openCreateClass || "Open create class modal"}
                className="w-full mb-4 px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
              >
                {t.addNewClass || "+ Add New Class"}
              </button>

              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                {t.sidebar.todayClasses || "Today's Classes"}
              </h2>
              <div className="mt-2 mb-3 h-px bg-gray-200 dark:bg-gray-700" />

              {/* Lista de ejemplo (traducida) */}
              <div className="space-y-0 divide-y divide-gray-200/70 dark:divide-gray-700/70 flex-1">
                <div className="py-3 flex items-start gap-3">
                  <span className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 inline-flex" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {t.samples.pianoClass || "Piano Class"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(t.samples.todayAt || "Today {time}").replace("{time}", "11:00 AM")}
                    </p>
                    <p className="text-xs text-gray-400">56 Davion Mission Suite 157</p>
                    <p className="text-xs text-gray-400">Meaghanberg</p>
                  </div>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <span className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 inline-flex" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {t.samples.singClass || "Sing Class"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(t.samples.todayAt || "Today {time}").replace("{time}", "13:00 PM")}
                    </p>
                    <p className="text-xs text-gray-400">853 Moore Flats Suite 15B</p>
                    <p className="text-xs text-gray-400">Sweden</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Calendario */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full flex flex-col">
              {/* Header calendario — MÁS separación vertical (mb-8) */}
              <div className="flex items-center justify-between mb-8">
                <Button
                  size="sm"
                  color="light" 
                  onClick={goToToday}
                  className="text-sm"
                >
                  {t.headerToday || "Today"}
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    color="light"
                    onClick={prevPeriod}
                    aria-label={
                      view === "month" ? t.a11y.prevMonth : 
                      view === "week" ? t.a11y.prevWeek : 
                      t.a11y.prevDay
                    }
                  >
                    &lt;
                  </Button>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 min-w-[12rem] text-center">
                    {periodLabel}
                  </h2>
                  <Button
                    size="sm"
                    color="light"
                    onClick={nextPeriod}
                    aria-label={
                      view === "month" ? t.a11y.nextMonth :
                      view === "week" ? t.a11y.nextWeek :
                      t.a11y.nextDay
                    }
                  >
                    &gt;
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {viewKeys.map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      color={view === v ? "blue" : "light"}
                      onClick={() => setView(v)}
                      className="capitalize"
                    >
                      {viewLabels[v]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Fila de días EN GRIS - solo para vista mensual */}
              {view === "month" && (
                <div className="grid grid-cols-7 text-center text-gray-900 dark:text-gray-200 text-xs font-semibold mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  {dayNames.map((d, i) => (
                    <div
                      key={`${d}-${i}`}
                      className={`py-2 ${i === 0 ? "rounded-l-md" : ""} ${i === 6 ? "rounded-r-md" : ""}`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              )}

              {/* Renderizado condicional de vistas */}
              {view === "month" && (
                <CalendarGrid
                  cursor={cursor}
                  events={events}
                  multiByDay={multiByDay}
                />
              )}
              {view === "week" && (
                <WeekView
                  weekStart={currentWeek}
                  events={events}
                  t={t}
                  lang={lang}
                />
              )}
              {view === "day" && (
                <DayView
                  currentDay={currentDay}
                  events={events}
                  t={t}
                  lang={lang}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* MODAL */}
      <AddClassModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateClass}
      />
    </StudentLayout>
  );
}

/** Componente Vista de Semana */
function WeekView({ weekStart, events, t, lang }) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const dayNamesFull = t.dayNamesFull || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const colorMap = {
    indigo: "bg-blue-500 text-white",
    pink: "bg-pink-500 text-white", 
    violet: "bg-purple-500 text-white",
    rose: "bg-rose-500 text-white",
    orange: "bg-orange-500 text-white",
    cyan: "bg-cyan-500 text-white",
  };

  const hasEvents = weekDays.some(day => {
    const dayKey = fmtKey(day);
    return events[dayKey] && events[dayKey].length > 0;
  });

  return (
    <div className="flex-1 overflow-hidden">
      {/* Grid de semana */}
      <div className="grid grid-cols-8 gap-1 h-full">
        {/* Columna de horas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-l-lg">
          <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            {t.hours?.timeLabel || "Time"}
          </div>
          {SCHEDULE_HOURS.map((hour) => (
            <div key={hour} className="h-16 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-600/50">
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
            <div key={dayKey} className={`bg-white dark:bg-gray-800 ${dayIndex === 6 ? 'rounded-r-lg' : ''}`}>
              {/* Header del día */}
              <div className={`h-12 flex flex-col items-center justify-center text-sm border-b border-gray-200 dark:border-gray-600 ${isToday ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dayNamesFull[dayIndex]?.slice(0, 3) || day.toLocaleDateString(locale, { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Slots de horas */}
              {SCHEDULE_HOURS.map((hour) => (
                <div key={`${dayKey}-${hour}`} className="h-16 border-b border-gray-100 dark:border-gray-700 p-1 relative">
                  {dayEvents
                    .filter(event => {
                      // Simulamos que eventos tienen hora basada en su posición
                      const eventHour = 8 + (dayEvents.indexOf(event) % 13);
                      return eventHour === hour;
                    })
                    .map((event, eventIndex) => (
                      <Badge
                        key={eventIndex}
                        className={`${colorMap[event.color] || colorMap.cyan} text-xs absolute left-1 right-1 top-1`}
                      >
                        {event.label}
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
            {t.weekView?.noEvents || "No events this week"}
          </p>
        </div>
      )}
    </div>
  );
}

/** Componente Vista de Día */
function DayView({ currentDay, events, t, lang }) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const dayKey = fmtKey(currentDay);
  const dayEvents = events[dayKey] || [];
  const isToday = sameYMD(currentDay, new Date());

  const colorMap = {
    indigo: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
    pink: "border-l-pink-500 bg-pink-50 dark:bg-pink-900/20",
    violet: "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20", 
    rose: "border-l-rose-500 bg-rose-50 dark:bg-rose-900/20",
    orange: "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20",
    cyan: "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20",
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-4">
        {/* Header del día */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {currentDay.toLocaleDateString(locale, { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              {isToday && (
                <Badge color="blue" className="mt-1">
                  {t.headerToday || "Today"}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
              </p>
            </div>
          </div>
        </Card>

        {/* Timeline del día */}
        <Card className="flex-1">
          <div className="p-4">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
              {t.dayView?.schedule || "Schedule"}
            </h4>
            
            {dayEvents.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {t.dayView?.noEvents || "No events today"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {SCHEDULE_HOURS.map((hour) => {
                  // Simulamos eventos en diferentes horas
                  const hourEvents = dayEvents.filter((_, index) => {
                    const eventHour = 8 + (index % 13);
                    return eventHour === hour;
                  });

                  return (
                    <div key={hour} className="flex gap-4">
                      {/* Columna de hora */}
                      <div className="w-20 flex-shrink-0 text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(hour)}
                        </span>
                      </div>

                      {/* Columna de eventos */}
                      <div className="flex-1">
                        {hourEvents.length > 0 ? (
                          <div className="space-y-2">
                            {hourEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`p-3 rounded-lg border-l-4 ${colorMap[event.color] || colorMap.cyan}`}
                              >
                                <h5 className="font-medium text-gray-800 dark:text-white">
                                  {event.label}
                                </h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatTime(hour)}
                                </p>
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

/** Componente separado para el grid (sin dependencias de i18n) */
function CalendarGrid({ cursor, events, multiByDay }) {
  const hatchStyle = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 6px)",
  };
  const hatchStyleDark = {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)",
  };

  const colorMap = {
    indigo: { bg: "bg-indigo-200", text: "text-indigo-700", darkBg: "dark:bg-indigo-300/30", darkText: "dark:text-indigo-200" },
    pink: { bg: "bg-pink-200", text: "text-pink-700", darkBg: "dark:bg-pink-300/30", darkText: "dark:text-pink-200" },
    violet: { bg: "bg-violet-200", text: "text-violet-700", darkBg: "dark:bg-violet-300/30", darkText: "dark:text-violet-200" },
    rose: { bg: "bg-rose-200", text: "text-rose-700", darkBg: "dark:bg-rose-300/30", darkText: "dark:text-rose-200" },
    orange: { bg: "bg-orange-200", text: "text-orange-700", darkBg: "dark:bg-orange-300/30", darkText: "dark:text-orange-200" },
    cyan: { bg: "bg-cyan-200", text: "text-cyan-700", darkBg: "dark:bg-cyan-300/30", darkText: "dark:text-cyan-200" },
  };

  const gridDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const jsDow = first.getDay(); // 0 dom..6 sab
    const mondayIndex = jsDow === 0 ? 7 : jsDow; // 1..7
    const leading = mondayIndex - 1;
    const start = addDays(first, -leading);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  return (
    <div className="grid grid-cols-7 grid-rows-6 gap-[6px]">
      {gridDays.map((d) => {
        const key = fmtKey(d);
        const inMonth = d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
        const chips = events[key] || [];
        const multi = multiByDay[key];

        const style = !inMonth
          ? (document?.documentElement?.classList?.contains("dark")
              ? hatchStyleDark
              : hatchStyle)
          : undefined;

        const isToday = sameYMD(d, new Date());

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
                inMonth ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
              } text-right`}
            >
              {d.getDate()}
            </div>

            {/* multi-day */}
            {multi && (
              <div
                className={[
                  "absolute left-1 right-1 top-6 h-6 flex items-center",
                  colorMap[multi.color].bg,
                  colorMap[multi.color].text,
                  colorMap[multi.color].darkBg,
                  colorMap[multi.color].darkText,
                  "px-2 text-[10px]",
                  multi.isStart ? "rounded-l-md" : "",
                  multi.isEnd ? "rounded-r-md" : "",
                ].join(" ")}
                title={multi.label}
              >
                {multi.isStart ? multi.label : ""}
              </div>
            )}

            {/* chips */}
            <div className="space-y-1 mt-6">
              {chips.map((ev, idx) => (
                <div
                  key={idx}
                  className={[
                    "truncate rounded px-2 py-[3px] text-[10px]",
                    colorMap[ev.color]?.bg || colorMap.cyan.bg,
                    colorMap[ev.color]?.text || colorMap.cyan.text,
                    colorMap[ev.color]?.darkBg || colorMap.cyan.darkBg,
                    colorMap[ev.color]?.darkText || colorMap.cyan.darkText,
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
