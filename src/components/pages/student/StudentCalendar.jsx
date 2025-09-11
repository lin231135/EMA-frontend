
import { useEffect, useMemo, useRef, useState } from "react";
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

  const monthLabel = useMemo(
    () => {
      const locale = lang === 'es' ? 'es-ES' : 'en-US';
      return cursor.toLocaleDateString(locale, { year: "numeric", month: "long" });
    },
    [cursor, lang]
  );

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

  const prevMonth = () => {
    setAutoFollow(false); // usuario tomó control
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setAutoFollow(false);
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
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
              <div className="flex items-center justify-between mb-12">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t.headerToday || "Today"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevMonth}
                    aria-label={t.a11y.prevMonth || "Previous month"}
                    className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    &lt;
                  </button>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 min-w-[9rem] text-center">
                    {monthLabel}
                  </h2>
                  <button
                    onClick={nextMonth}
                    aria-label={t.a11y.nextMonth || "Next month"}
                    className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    &gt;
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {viewKeys.map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1 rounded-md text-sm capitalize ${
                        view === v
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {viewLabels[v]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fila de días EN GRIS */}
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

              {/* Grid de días */}
              <CalendarGrid
                cursor={cursor}
                events={events}
                multiByDay={multiByDay}
              />
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
