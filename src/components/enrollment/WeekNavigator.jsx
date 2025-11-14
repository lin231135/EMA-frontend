// src/components/enrollment/WeekNavigator.jsx
import { Button } from "flowbite-react";
import { useAuth } from "../../contexts/AuthContext";
import translations from "../../translations";

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Navegador de semanas para el calendario
 * @param {Date} currentWeekStart - Fecha de inicio de la semana actual
 * @param {Function} onWeekChange - Callback al cambiar de semana
 * @param {string} viewMode - Modo de vista actual ("week" o "list")
 * @param {Function} onViewModeChange - Callback al cambiar modo de vista
 */
export default function WeekNavigator({
  currentWeekStart,
  onWeekChange,
  viewMode,
  onViewModeChange,
}) {
  const { lang } = useAuth();
  const t = translations[lang].enrollmentComponents.calendar;
  const locale = lang === "es" ? "es-ES" : "en-US";

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Navegación de semana */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          color="light"
          onClick={() => onWeekChange(addDays(currentWeekStart, -7))}
        >
          <svg
            className="h-4 w-4"
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
        </Button>

        <div className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentWeekStart.toLocaleDateString(locale, {
              month: "long",
              day: "numeric",
            })}{" "}
            -{" "}
            {addDays(currentWeekStart, 6).toLocaleDateString(locale, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <Button
          size="sm"
          color="light"
          onClick={() => onWeekChange(addDays(currentWeekStart, 7))}
        >
          <svg
            className="h-4 w-4"
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

        <Button
          size="sm"
          color="gray"
          onClick={() => onWeekChange(startOfWeek(new Date()))}
        >
          {t.today}
        </Button>
      </div>

      {/* Toggle de vista */}
      <div className="flex gap-2">
        <Button
          size="sm"
          color={viewMode === "week" ? "indigo" : "light"}
          onClick={() => onViewModeChange("week")}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {t.week}
        </Button>
        <Button
          size="sm"
          color={viewMode === "list" ? "indigo" : "light"}
          onClick={() => onViewModeChange("list")}
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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          {lang === "es" ? "Lista" : "List"}
        </Button>
      </div>
    </div>
  );
}
