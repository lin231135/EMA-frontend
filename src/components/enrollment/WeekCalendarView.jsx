// src/components/enrollment/WeekCalendarView.jsx
import { useMemo } from "react";

// Helpers
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const sameYMD = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const fmtKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatTime = (hour) => {
  const h = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";
  return `${h}:00 ${period}`;
};

const SCHEDULE_HOURS = Array.from({ length: 13 }, (_, i) => 8 + i);
const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const COLOR_PALETTE = [
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-cyan-500 hover:bg-cyan-600",
];

/**
 * Vista de calendario semanal para horarios
 * @param {Date} weekStart - Fecha de inicio de la semana
 * @param {Array} schedules - Lista de horarios disponibles
 * @param {Object} selected - Horario seleccionado
 * @param {Function} onSelect - Callback al seleccionar un horario
 */
export default function WeekCalendarView({
  weekStart,
  schedules,
  selected,
  onSelect,
}) {
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const schedulesByDay = useMemo(() => {
    const map = {};
    schedules.forEach((schedule) => {
      const scheduleDate = new Date(schedule.scheduleDate);
      const dayKey = fmtKey(scheduleDate);
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(schedule);
    });
    return map;
  }, [schedules]);

  const hasSchedules = weekDays.some((day) => {
    const dayKey = fmtKey(day);
    return schedulesByDay[dayKey] && schedulesByDay[dayKey].length > 0;
  });

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-1">
          {/* Columna de horas */}
          <div className="rounded-l-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex h-14 items-center justify-center border-b-2 border-gray-300 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300">
              Hora
            </div>
            {SCHEDULE_HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-20 items-center justify-center border-b border-gray-200/50 text-xs font-medium text-gray-600 dark:border-gray-600/50 dark:text-gray-400"
              >
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
              <div
                key={dayKey}
                className={`border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
                  dayIndex === 6 ? "rounded-r-lg" : ""
                }`}
              >
                {/* Header del día */}
                <div
                  className={`flex h-14 flex-col items-center justify-center border-b-2 ${
                    isToday
                      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {DAY_NAMES[dayIndex]}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      isToday
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>

                {/* Slots de horas */}
                {SCHEDULE_HOURS.map((hour) => {
                  const matchingSchedules = daySchedules.filter((schedule) => {
                    const startTime = schedule.startTime;
                    const scheduleHour = parseInt(startTime.split(":")[0]);
                    return scheduleHour === hour;
                  });

                  return (
                    <div
                      key={`${dayKey}-${hour}`}
                      className="relative flex h-20 flex-col gap-1 border-b border-gray-100 p-1 dark:border-gray-700"
                    >
                      {matchingSchedules.map((schedule) => {
                        const isSelected = selected?.id === schedule.id;
                        const colorClass =
                          COLOR_PALETTE[schedule.id % COLOR_PALETTE.length];

                        return (
                          <button
                            key={schedule.id}
                            onClick={() => onSelect(schedule)}
                            className={`flex h-full w-full flex-col justify-center rounded-md px-2 py-2 text-left text-xs transition-all duration-200 ${
                              isSelected
                                ? "scale-[1.02] bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-1 dark:bg-indigo-500 dark:ring-offset-gray-800"
                                : `${colorClass} text-white opacity-90 hover:opacity-100 hover:shadow-md`
                            }`}
                          >
                            <div className="truncate font-semibold">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="truncate text-[10px] opacity-90">
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
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No hay horarios disponibles esta semana
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
