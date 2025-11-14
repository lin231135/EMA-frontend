// src/components/enrollment/BookingSummaryCard.jsx
import { Card, Badge } from "flowbite-react";
import { formatDate, formatTime } from "../ui/ScheduleCard";

/**
 * Card de resumen para confirmación de booking
 * @param {Object} course - Curso seleccionado
 * @param {Object} schedule - Horario seleccionado
 * @param {string} note - Nota opcional
 * @param {number} kid_id - ID del hijo (opcional, solo para padres)
 * @param {string} payment_method - Método de pago seleccionado
 */
export default function BookingSummaryCard({ course, schedule, note, kid_id, payment_method }) {
  return (
    <Card className="mb-6 border-2 border-indigo-200/30 bg-gradient-to-br from-white to-indigo-50/30 shadow-xl dark:border-indigo-800/30 dark:from-slate-800 dark:to-indigo-950/20">
      {/* Encabezado del curso */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
          <svg
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {course.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge color="indigo" className="capitalize">
              {course.modality}
            </Badge>
            <Badge color="purple">Cap. {course.capacity}</Badge>
            <Badge color="success" className="font-semibold">
              Q{Number(course.cost).toFixed(2)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Detalles del horario */}
      <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        {/* Fecha */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Fecha
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(schedule.scheduleDate)}
            </p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Horario
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(schedule.startTime)} – {formatTime(schedule.endTime)}
            </p>
          </div>
        </div>

        {/* Nota opcional */}
        {note && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Nota adicional
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{note}</p>
            </div>
          </div>
        )}

        {/* Método de pago */}
        {payment_method && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <svg
                className="h-5 w-5 text-purple-600 dark:text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Método de pago
              </p>
              <p className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                {payment_method}
              </p>
            </div>
          </div>
        )}

        {/* Estudiante asignado */}
        {kid_id && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Estudiante asignado
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ID: {kid_id}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
