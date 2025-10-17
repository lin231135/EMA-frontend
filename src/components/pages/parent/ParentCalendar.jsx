// src/components/pages/parent/ParentCalendar.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Badge,
} from "flowbite-react";
import ParentLayout from "../../layout/parent/ParentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/* ======= Config ======= */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ======= Paleta de colores por hijo (igual que Dashboard) ======= */
const COLOR_PALETTE = [
  { bar: "bg-violet-500", ring: "ring-violet-500", text: "text-violet-600" },
  { bar: "bg-pink-500", ring: "ring-pink-500", text: "text-pink-600" },
  { bar: "bg-cyan-500", ring: "ring-cyan-500", text: "text-cyan-600" },
  { bar: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-600" },
  { bar: "bg-amber-500", ring: "ring-amber-500", text: "text-amber-600" },
  { bar: "bg-sky-500", ring: "ring-sky-500", text: "text-sky-600" },
];
const colorForIndex = (i) =>
  COLOR_PALETTE[((i ?? 0) + COLOR_PALETTE.length) % COLOR_PALETTE.length];

/* ======= Utilidades de fechas (semana inicia lunes) ======= */
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const mondayOfWeek = (d) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0..6 (L..D)
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const sundayOfWeek = (d) => {
  const x = mondayOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23, 59, 59, 999);
  return x;
};
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toYMD = (d) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

/* ======= UI auxiliares ======= */
function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold tracking-wide text-black dark:text-gray-400">
      {children}
    </h3>
  );
}
function ColoredSide({ style, children, className = "" }) {
  const color = style?.bar ?? "bg-cyan-500";
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute right-0 top-2 bottom-2 w-1 rounded ${color}`} />
      {children}
    </div>
  );
}
function DayCell({ d, inMonth, items = [], kidStyles, childrenList }) {
  const hatch =
    "bg-[repeating-linear-gradient(135deg,rgba(148,163,184,0.08)_0px,rgba(148,163,184,0.08)_8px,transparent_8px,transparent_16px)]";
  return (
    <div
      className={[
        "min-h-[92px] p-2 border border-gray-100 dark:border-gray-800 rounded-lg",
        "flex flex-col gap-1",
        inMonth ? "bg-white dark:bg-gray-900" : hatch + " bg-white dark:bg-gray-900",
      ].join(" ")}
    >
      <div className="text-xs text-gray-500 dark:text-gray-400">{d.getDate()}</div>

      <div className="mt-1 flex flex-col gap-1">
        {items.map((cls) => {
          const key = `kid-${cls.kid_id}`;
          const style = kidStyles[key] || colorForIndex(childrenList.findIndex(k => k.id === cls.kid_id));
          return (
            <div
              key={cls.id}
              className="text-[11px] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 truncate flex items-center gap-1"
              title={`${cls.kid_name} • ${cls.course_name} • ${cls.start_time}-${cls.end_time}`}
            >
              <span className={`inline-block w-2 h-2 rounded-full ${style.bar}`} />
              <span className="font-medium">{cls.course_name}</span>
              <span className="opacity-70">· {cls.start_time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ParentCalendar() {
  const { lang, token } = useAuth();
  const t = translations[lang]?.parentCalendar || translations.es.parentCalendar;

  // Hijos y estilos (como en Dashboard)
  const [children, setChildren] = useState([]);
  const [kidStyles, setKidStyles] = useState({}); // { 'kid-<id>': { bar, ring, text } }
  const [loadingKids, setLoadingKids] = useState(true);
  const [kidsError, setKidsError] = useState(null);

  // Filtros (compartidos con Sidebar)
  const [kidsFilter, setKidsFilter] = useState({ all: true });
  const onToggleKid = (key) =>
    setKidsFilter((s) => {
      const next = { ...s, [key]: !s[key] };
      if (key === "all") {
        const v = !s.all;
        const every = Object.fromEntries(Object.keys(s).map((k) => [k, v]));
        return { ...every, all: v };
      } else {
        const allOn = Object.entries(next)
          .filter(([k]) => k !== "all")
          .every(([, val]) => val);
        return { ...next, all: allOn };
      }
    });

  const kidsLabels = useMemo(() => {
    const labels = {};
    children.forEach((k) => (labels[`kid-${k.id}`] = k.name));
    return labels;
  }, [children]);

  // Calendario
  const [cursor, setCursor] = useState(new Date()); // mes mostrado
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = mondayOfWeek(monthStart);
  const gridEnd = sundayOfWeek(monthEnd);
  const totalDays = Math.round((gridEnd - gridStart) / (1000 * 60 * 60 * 24)) + 1;
  const daysGrid = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(gridStart, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor]
  );

  // Clases del rango visible
  const [rangeClasses, setRangeClasses] = useState([]); // sin filtrar
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Cargar hijos
  useEffect(() => {
    let alive = true;
    async function loadChildren() {
      setLoadingKids(true);
      setKidsError(null);
      try {
        const res = await fetch(`${API}/parents/dashboard/children`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;

        const kids = Array.isArray(data.children) ? data.children : [];
        setChildren(kids);

        const styles = {};
        const filter = { all: true };
        kids.forEach((kid, idx) => {
          styles[`kid-${kid.id}`] = colorForIndex(idx);
          filter[`kid-${kid.id}`] = true;
        });
        setKidStyles(styles);
        setKidsFilter(filter);
      } catch (e) {
        if (!alive) return;
        setKidsError(e.message || "Error");
      } finally {
        if (alive) setLoadingKids(false);
      }
    }
    loadChildren();
    return () => { alive = false; };
  }, [token]);

  // Cargar clases del mes visible usando el endpoint de rango (next-classes con from + days)
  useEffect(() => {
    let alive = true;
    async function loadRange() {
      if (!token) return;
      if (!children || children.length === 0) {
        setRangeClasses([]);
        return;
      }
      setLoadingClasses(true);
      try {
        const kidIds = children.map((k) => k.id).join(",");
        const from = toYMD(gridStart);
        const days = Math.max(1, Math.round((sundayOfWeek(monthEnd) - gridStart) / (1000 * 60 * 60 * 24)) + 1);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // El backend ya mostró que acepta { from, days } en /next-classes
        const url = `${API}/parents/dashboard/next-classes?from=${encodeURIComponent(from)}&days=${days}&kid_ids=${encodeURIComponent(kidIds)}`;
        const res = await fetch(url, { headers });
        const json = res.ok ? await res.json() : { classes: [] };
        if (!alive) return;

        setRangeClasses(Array.isArray(json.classes) ? json.classes : []);
      } catch {
        if (!alive) return;
        setRangeClasses([]);
      } finally {
        if (alive) setLoadingClasses(false);
      }
    }
    loadRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, children, cursor]);

  // Filtro aplicado a clases por hijo
  const kidEnabled = (kidId) => (kidsFilter.all ? true : !!kidsFilter[`kid-${kidId}`]);

  const rangeClassesFiltered = useMemo(() => {
    if (!rangeClasses?.length) return [];
    return rangeClasses.filter((c) => kidEnabled(c.kid_id));
  }, [rangeClasses, kidsFilter]);

  const today = new Date();
  const todayClasses = useMemo(() => {
    if (!rangeClassesFiltered.length) return [];
    return rangeClassesFiltered.filter((c) => sameDay(new Date(c.date), today));
  }, [rangeClassesFiltered]);

  const eventsByDay = useMemo(() => {
    const map = new Map(); // ISO date -> array
    rangeClassesFiltered.forEach((c) => {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    return map;
  }, [rangeClassesFiltered]);

  const monthLabel = `${t.monthNames[cursor.getMonth()]} ${cursor.getFullYear()}`;

  return (
    <ParentLayout
      kidsFilter={kidsFilter}
      onToggleKid={onToggleKid}
      kidsLabels={kidsLabels}
      kidStyles={kidStyles}
    >
      <div className="px-6 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
      </div>

      <div className="px-6 pb-6 grid grid-cols-12 gap-4">
        {/* Izquierda: Clases de Hoy */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-0">
            <div className="p-4">
              <Button fullSized color="light" disabled>
                {t.sections.addNewEvent}
              </Button>
            </div>

            <div className="px-4 pb-2">
              <SectionTitle>{t.sections.todaysClasses}</SectionTitle>
            </div>

            <div className="px-2 pb-4 space-y-4">
              {loadingClasses && (
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                  {lang === "es" ? "Cargando clases..." : "Loading classes..."}
                </p>
              )}

              {!loadingClasses && todayClasses.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                  {t.empty?.noEventsToday || (lang === "es" ? "No hay clases hoy." : "No classes today.")}
                </p>
              )}

              {!loadingClasses &&
                todayClasses.map((c, i) => {
                  const k = `kid-${c.kid_id}`;
                  const style =
                    kidStyles[k] ||
                    colorForIndex(children.findIndex((x) => x.id === c.kid_id) || i);

                  return (
                    <ColoredSide key={`${c.id}-${i}`} style={style} className="pt-1">
                      <div className="flex items-start gap-3 px-2">
                        <div className={`rounded-full ring-2 ${style.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                          <Avatar img={null} rounded />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {c.kid_name} <Badge size="xs" color="info">{c.course_name}</Badge>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lang === "es" ? "Horario:" : "Time:"} {c.start_time}–{c.end_time}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lang === "es" ? "Maestro:" : "Teacher:"} {c.teacher_name}
                          </p>
                          <div className="mt-1">
                            <Badge size="xs" color={c.status === "programada" ? "success" : "gray"}>{c.status}</Badge>{" "}
                            <Badge size="xs" color="purple">{c.modality}</Badge>
                          </div>
                        </div>
                      </div>
                    </ColoredSide>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Derecha: Calendario mensual */}
        <div className="col-span-12 lg:col-span-9">
          <Card className="p-4">
            {/* Header del mes */}
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setCursor(addDays(startOfMonth(cursor), -1))}
                  aria-label={t.navigation.previousMonth}
                  title={t.navigation.previousMonth}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15 6l-6 6 6 6"/></svg>
                </button>
                <div className="text-xl font-semibold">{monthLabel}</div>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setCursor(addDays(endOfMonth(cursor), 1))}
                  aria-label={t.navigation.nextMonth}
                  title={t.navigation.nextMonth}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 6l6 6-6 6"/></svg>
                </button>
              </div>

              {/* Toggler (solo Month implementado) */}
              <div className="flex gap-2">
                <Button size="xs" color="light" disabled>{t.views.day}</Button>
                <Button size="xs" color="light" disabled>{t.views.week}</Button>
                <Button size="xs">{t.views.month}</Button>
              </div>
            </div>

            {/* Cabecera de días */}
            <div className="grid grid-cols-7 gap-2 px-1 pb-2">
              {t.dayNamesShort.map((d) => (
                <div key={d} className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Celdas del mes */}
            <div className="grid grid-cols-7 gap-2">
              {daysGrid.map((d) => {
                const inMonth = d.getMonth() === cursor.getMonth();
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                const items = eventsByDay.get(key) || [];
                return (
                  <DayCell
                    key={d.toISOString()}
                    d={d}
                    inMonth={inMonth}
                    items={items}
                    kidStyles={kidStyles}
                    childrenList={children}
                  />
                );
              })}
            </div>

            {/* Estado de carga / error */}
            {loadingClasses && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {lang === "es" ? "Cargando clases del mes..." : "Loading month classes..."}
              </p>
            )}
            {!loadingClasses && rangeClassesFiltered.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {lang === "es" ? "No hay clases en este mes con los filtros actuales." : "No classes this month with current filters."}
              </p>
            )}
          </Card>

          {/* Leyenda simple */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            {children.map((k, idx) => {
              const style = kidStyles[`kid-${k.id}`] || colorForIndex(idx);
              return (
                <span key={k.id} className="inline-flex items-center gap-1">
                  <span className={`inline-block w-3 h-3 rounded ${style.bar}`} /> {k.name}
                </span>
              );
            })}
            <span className="ml-auto text-gray-400">
              {t.legend?.outsideMonthNote || (lang === "es" ? "Las celdas sombreadas son de fuera del mes" : "Shaded cells are outside the month")}
            </span>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}