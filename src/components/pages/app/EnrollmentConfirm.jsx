// src/components/pages/app/EnrollmentConfirm.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useBooking } from "../../../hooks/useBooking";
import { EnrollmentStepper, BookingSummaryCard } from "../../enrollment";

/**
 * Inscripción (Paso 3: Confirmación de reserva)
 * - Muestra un resumen del curso y horario seleccionados.
 * - Confirma la reserva (Booking) con el nuevo hook useBooking.
 * - Si el usuario es Padre, envía kid_id; si es Estudiante, no lo incluye.
 */
export default function EnrollmentConfirm() {
  const { user } = useAuth?.() ?? { user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const { createBooking, operationLoading } = useBooking();

  // Datos recibidos desde el paso 3 (payment)
  const { course, schedule, note, kid_id, payment_method } = location.state || {};

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  if (!course || !schedule) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <Alert color="warning" className="mt-8">
            No se encontraron datos para mostrar. Por favor vuelve al paso
            anterior.
            <div className="mt-3">
              <Button color="indigo" onClick={() => navigate(-1)}>
                Regresar
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    setError("");
    setSuccess(false);

    try {
      const payload = {
        schedule_id: schedule.id,
        payment_method: payment_method, // Viene del paso 3
        ...(kid_id ? { kid_id } : {}),
        ...(note ? { note } : {}),
      };

      const result = await createBooking(payload);
      setBookingResult(result);
      setSuccess(true);
    } catch (err) {
      console.error("Error creando booking:", err);
      setError(err?.message || "No fue posible crear la reserva.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Título centrado */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Inscripción
        </h1>

        {/* Stepper */}
        <EnrollmentStepper currentStep={4} />

        {/* Título del paso */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paso 4: Confirmar inscripción
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Revisa la información antes de confirmar tu reserva
          </p>
        </div>

        {/* Card resumen */}
        <BookingSummaryCard
          course={course}
          schedule={schedule}
          note={note}
          kid_id={kid_id}
          payment_method={payment_method}
        />

        {/* Alertas de estado */}
        {error && (
          <Alert
            color="failure"
            className="mb-6 shadow-lg"
            icon={() => (
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
            )}
          >
            <span className="font-semibold">Error:</span> {error}
          </Alert>
        )}

        {success && (
          <Alert
            color="success"
            className="mb-6 shadow-lg"
            icon={() => (
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
            )}
          >
            <span className="font-semibold">¡Éxito!</span> Reserva creada
            exitosamente.
            {bookingResult?.booking?.id && (
              <span className="ml-1">
                Código de reserva: #{bookingResult.booking.id}
              </span>
            )}
          </Alert>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            color="light"
            size="lg"
            onClick={() => navigate(-1)}
            disabled={operationLoading}
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
            disabled={operationLoading || success}
            className="w-full sm:w-auto"
          >
            {operationLoading ? (
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
