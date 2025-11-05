// src/components/ui/ScheduleCard.jsx
import { Card, Badge } from "flowbite-react";

/**
 * ScheduleCard
 * - Muestra fecha, rango de hora y estado de selección.
 * - Mantiene lenguaje visual de tus CourseCard (bordes indigo, sombras suaves).
 */
export default function ScheduleCard({
  schedule,         // { id, scheduleDate, startTime, endTime }
  selected = false,
  onSelect,
}) {
  if (!schedule) return null;

  const date = formatDate(schedule.scheduleDate);
  const dayName = getDayName(schedule.scheduleDate);
  const range = `${formatTime(schedule.startTime)} – ${formatTime(schedule.endTime)}`;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(schedule)}
      className={[
        "group relative w-full text-left rounded-xl transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-indigo-400/80",
        selected
          ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]"
          : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-indigo-400 hover:shadow-md hover:scale-[1.01]",
      ].join(" ")}
    >
      <div className={[
        "p-5 rounded-xl transition-colors",
        selected
          ? "bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20"
          : "bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-750"
      ].join(" ")}>
        
        {/* Header con día de la semana */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {dayName}
            </span>
          </div>
          
          {/* Check de seleccionado */}
          {selected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 16 12">
                <path d="M1 5.917 5.724 10.5 15 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Seleccionado
              </span>
            </div>
          )}
        </div>

        {/* Fecha */}
        <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {date}
        </h4>

        {/* Horario */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
            {range}
          </span>
        </div>

        {/* Hint text */}
        {!selected && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Haz clic para seleccionar este horario
          </p>
        )}
      </div>
    </button>
  );
}

/* ------- utils ------- */
function pad(n){ return String(n).padStart(2, "0"); }

export function formatDate(isoLike) {
  try {
    const d = new Date(isoLike);
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${day}/${m}/${y}`;
  } catch { return isoLike; }
}

export function getDayName(isoLike) {
  try {
    const d = new Date(isoLike);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[d.getDay()];
  } catch { return ""; }
}

export function formatTime(hhmmOrHms) {
  const [h, m] = (hhmmOrHms || "").split(":");
  if (!h || !m) return hhmmOrHms || "";
  // 24h -> 12h
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${suffix}`;
}
