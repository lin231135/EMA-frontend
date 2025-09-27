// src/components/pages/parent/ParentCalendar.jsx
import { useMemo, useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Badge,
} from "flowbite-react";
import ParentLayout from "../../layout/parent/ParentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/* ======= Colores por hijo (misma paleta que el Dashboard) ======= */
const KIDS = {
  daniel: {
    name: "Daniel Chet",
    bar: "bg-violet-500",
    ring: "ring-violet-500",
    tagText: "text-violet-700",
    chipBg: "bg-violet-100",
    chipBorder: "border-violet-400",
  },
  david: {
    name: "David Chet",
    bar: "bg-pink-500",
    ring: "ring-pink-500",
    tagText: "text-pink-700",
    chipBg: "bg-pink-100",
    chipBorder: "border-pink-400",
  },
};

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

/* ======= Datos de ejemplo (ajústalos a tu API cuando conectes) ======= */
const today = new Date();
const MOCK_EVENTS = [
  // Daniel
  {
    id: 1,
    student: "daniel",
    title: "Clase de Piano",
    date: addDays(startOfMonth(today), 3), // 4 del mes
    time: "11:00 AM",
    place: "56 Davion Mission Suite 157",
    avatar: "https://i.pravatar.cc/64?img=11",
  },
  {
    id: 2,
    student: "daniel",
    title: "Piano Recital",
    date: addDays(endOfMonth(today), -1), // 30/31
    time: "18:00 PM",
    place: "Auditorio",
    avatar: "https://i.pravatar.cc/64?img=15",
  },
  // David
  {
    id: 3,
    student: "david",
    title: "Clase de Canto",
    date: addDays(startOfMonth(today), 4), // 5 del mes
    time: "13:00 PM",
    place: "853 Moore Flats Suite 158, Sweden",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 4,
    student: "david",
    title: "Ensayo de Canto",
    date: addDays(startOfMonth(today), 15), // 16 del mes
    time: "16:00 PM",
    place: "Sala 203",
    avatar: "https://i.pravatar.cc/64?img=16",
  },
  // Evento general (no ligado a hijo)
  {
    id: 5,
    student: null,
    title: "Holiday",
    date: addDays(startOfMonth(today), 25), // 26 del mes
    time: "All day",
    place: "",
  },
];

/* ======= Componentes auxiliares ======= */
function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold tracking-wide text-black dark:text-gray-400">
      {children}
    </h3>
  );
}
function ColoredSide({ student, children, className = "" }) {
  const color = KIDS[student]?.bar ?? "bg-cyan-500";
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute right-0 top-2 bottom-2 w-1 rounded ${color}`} />
      {children}
    </div>
  );
}
function DayCell({ d, inMonth, events = [] }) {
  const hatch =
    "bg-[repeating-linear-gradient(135deg,rgba(148,163,184,0.12)_0px,rgba(148,163,184,0.12)_8px,transparent_8px,transparent_16px)]";
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
        {events.map((ev) => {
          if (!ev.student) {
            return (
              <div
                key={ev.id}
                className="text-[11px] px-2 py-1 rounded-md bg-orange-100 border border-orange-300 text-orange-700 truncate"
                title={ev.title}
              >
                {ev.title}
              </div>
            );
          }
          const kid = KIDS[ev.student];
          return (
            <div
              key={ev.id}
              className={[
                "text-[11px] px-2 py-1 rounded-md border truncate",
                kid?.chipBg ?? "bg-cyan-100",
                kid?.chipBorder ?? "border-cyan-400",
                kid?.tagText ?? "text-cyan-700",
              ].join(" ")}
              title={`${ev.title} — ${kid?.name ?? ""}`}
            >
              {ev.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ParentCalendar() {
  const { lang } = useAuth();
  const t = translations[lang]?.parentCalendar || translations.es.parentCalendar;
  
  /* filtros compartidos en el Sidebar */
  const [kidsFilter, setKidsFilter] = useState({ all: true, daniel: true, david: true });
  const onToggleKid = (key) =>
    setKidsFilter((s) => {
      const next = { ...s, [key]: !s[key] };
      if (key === "all") {
        const v = !s.all;
        return { all: v, daniel: v, david: v };
      } else {
        const allOn = (key === "daniel" ? !s.daniel : s.daniel) && (key === "david" ? !s.david : s.david);
        return { ...next, all: allOn };
      }
    });

  const studentEnabled = (student) =>
    student === null ||
    kidsFilter.all ||
    (student === "daniel" && kidsFilter.daniel) ||
    (student === "david" && kidsFilter.david);

  const [cursor, setCursor] = useState(new Date()); // mes mostrado
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = mondayOfWeek(monthStart);
  const gridEnd = sundayOfWeek(monthEnd);
  const totalDays = Math.round((gridEnd - gridStart) / (1000 * 60 * 60 * 24)) + 1;

  const daysGrid = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(gridStart, i)),
    [cursor]
  );

  const eventsThisRange = useMemo(
    () =>
      MOCK_EVENTS.filter(
        (e) => studentEnabled(e.student) && e.date >= gridStart && e.date <= gridEnd
      ),
    [cursor, kidsFilter]
  );

  const classesToday = useMemo(
    () => MOCK_EVENTS.filter((e) => studentEnabled(e.student) && sameDay(e.date, today)),
    [kidsFilter]
  );

  const monthLabel = `${t.monthNames[cursor.getMonth()]} ${cursor.getFullYear()}`;

  return (
    <ParentLayout
      kidsFilter={kidsFilter}
      onToggleKid={onToggleKid}
      kidsLabels={{ daniel: KIDS.daniel.name, david: KIDS.david.name }}
    >
      <div className="px-6 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
      </div>

      <div className="px-6 pb-6 grid grid-cols-12 gap-4">
        {/* Izquierda: Clases de Hoy y botón */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-0">
            <div className="p-4">
              <Button fullSized>{t.sections.addNewEvent}</Button>
            </div>

            <div className="px-4 pb-4">
              <SectionTitle>{t.sections.todaysClasses}</SectionTitle>
            </div>

            <div className="px-2 pb-4 space-y-6">
              {classesToday.map((c) => {
                const ring = KIDS[c.student]?.ring ?? "ring-cyan-500";
                return (
                  <ColoredSide key={c.id} student={c.student} className="pt-1">
                    <div className="flex items-start gap-3 px-2">
                      <div className={`rounded-full ring-2 ${ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                        <Avatar img={c.avatar} rounded />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.today} {c.time}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.place}</p>
                      </div>
                    </div>
                  </ColoredSide>
                );
              })}
              {classesToday.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2">{t.empty.noEventsToday}</p>
              )}
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

              {/* Toggler (solo Month implementado por ahora) */}
              <div className="flex gap-2">
                <Button size="xs" color="light" disabled>{t.views.day}</Button>
                <Button size="xs" color="light" disabled>{t.views.week}</Button>
                <Button size="xs">{t.views.month}</Button>
              </div>
            </div>

            {/* Cabecera de días */}
            <div className="grid grid-cols-7 gap-2 px-1 pb-2">
              {t.dayNamesShort.map((d, index) => (
                <div key={d} className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Celdas del mes */}
            <div className="grid grid-cols-7 gap-2">
              {daysGrid.map((d) => {
                const inMonth = d.getMonth() === cursor.getMonth();
                const events = eventsThisRange.filter((e) => sameDay(e.date, d));
                return <DayCell key={d.toISOString()} d={d} inMonth={inMonth} events={events} />;
              })}
            </div>
          </Card>

          {/* Nota opcional de leyenda */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-violet-500" /> {t.students.daniel}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-pink-500" /> {t.students.david}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-orange-400" /> {t.legend.generalEvents}
            </span>
            <span className="ml-auto text-gray-400">{t.legend.outsideMonthNote}</span>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}