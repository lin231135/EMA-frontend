// src/components/pages/app/EnrollmentConfirm.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Spinner, Card, Badge } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { createBooking } from "../../../services/app/bookingsService";
import { formatDate, formatTime } from "../../ui/ScheduleCard";

/**
 * Inscripción (Paso 3: Confirmación de reserva)
 * - Muestra un resumen del curso y horario seleccionados.
 * - Confirma la reserva (Booking) con POST /api/bookings.
 * - Si el usuario es Padre, envía kid_id; si es Estudiante, no lo incluye.
 */
export default function EnrollmentConfirm() {
  const { token, user } = useAuth?.() ?? { token: null, user: null };
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos desde el paso 2
  const { course, schedule, note, kid_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  if (!course || !schedule) {
    return (
      <Alert color="warning" className="mt-8">
        No se encontraron datos para mostrar. Por favor vuelve al paso anterior.
        <div className="mt-3">
          <Button color="indigo" onClick={() => navigate(-1)}>
            Regresar
          </Button>
        </div>
      </Alert>
    );
  }

  const handleConfirm = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const payload = {
        schedule_id: schedule.id,
        ...(kid_id ? { kid_id } : {}),
        ...(note ? { note } : {}),
      };

      const result = await createBooking(payload, { token });
      setBooking(result);
      setSuccess(true);
    } catch (err) {
      console.error("Error creando booking:", err);
      setError(err?.message || "No fue posible crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Título centrado */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Inscripción
        </h1>

        {/* Stepper centrado */}
        <div className="mb-10 flex w-full justify-center">
          <nav aria-label="Stepper" className="w-full max-w-2xl">
            <ol className="flex items-center justify-center gap-3">
              {/* Paso 1 completado */}
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 lg:h-12 lg:w-12">
                  <svg
                    className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-200 lg:h-4 lg:w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <div className="hidden h-1 w-16 rounded bg-indigo-200 dark:bg-indigo-900 sm:block"></div>
              </li>

              {/* Paso 2 completado */}
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 lg:h-12 lg:w-12">
                  <svg
                    className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-200 lg:h-4 lg:w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <div className="hidden h-1 w-16 rounded bg-indigo-200 dark:bg-indigo-900 sm:block"></div>
              </li>

              {/* Paso 3 activo */}
              <li className="flex items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 lg:h-12 lg:w-12">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1 1 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                  </svg>
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Título del paso */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paso 3: Confirmar inscripción
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Revisa la información antes de confirmar tu reserva
          </p>
        </div>

        {/* Card resumen mejorado */}
        <Card className="mb-6 border-2 border-indigo-200/30 bg-gradient-to-br from-white to-indigo-50/30 shadow-xl dark:border-indigo-800/30 dark:from-slate-800 dark:to-indigo-950/20">
          {/* Encabezado del curso con icono */}
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

          {/* Detalles del horario con iconos */}
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
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {note}
                  </p>
                </div>
              </div>
            )}

            {/* Estudiante asignado (solo para padres) */}
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

        {/* Alertas de estado */}
        {error && (
          <Alert color="failure" className="mb-6 shadow-lg" icon={() => (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          )}>
            <span className="font-semibold">Error:</span> {error}
          </Alert>
        )}
        
        {success && (
          <Alert color="success" className="mb-6 shadow-lg" icon={() => (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}>
            <span className="font-semibold">¡Éxito!</span> Reserva creada exitosamente. 
            {booking?.id && <span className="ml-1">Código de reserva: #{booking.id}</span>}
          </Alert>
        )}

        {/* Botones de acción mejorados */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            color="light"
            size="lg"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Regresar
          </Button>

          <Button
            color={success ? "success" : "indigo"}
            size="lg"
            onClick={handleConfirm}
            disabled={loading || success}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Procesando...
              </>
            ) : success ? (
              <>
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Confirmado
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Confirmar reserva
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
