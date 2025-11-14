// src/components/enrollment/ScheduleSelectedCard.jsx
import { useAuth } from "../../contexts/AuthContext";
import translations from "../../translations";

/**
 * Card que muestra el horario seleccionado con detalles visuales
 * @param {Object} schedule - Horario seleccionado
 */
export default function ScheduleSelectedCard({ schedule }) {
  const { lang } = useAuth();
  const t = translations[lang].enrollmentComponents.scheduleCard;

  if (!schedule) return null;

  return (
    <div className="mb-6 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg dark:border-indigo-800 dark:from-indigo-950/20 dark:to-gray-800">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.selectedSchedule}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {new Date(schedule.scheduleDate).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
          <svg
            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.time}</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {schedule.startTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
          <svg
            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.time}</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {schedule.endTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800/50">
          <svg
            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.date}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {schedule.capacity} {lang === "es" ? "personas" : "people"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
