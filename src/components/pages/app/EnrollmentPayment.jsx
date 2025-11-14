// src/components/pages/app/EnrollmentPayment.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { EnrollmentStepper } from "../../enrollment";
import PaymentMethodCard from "../../enrollment/PaymentMethodCard";

/**
 * Inscripción (Paso 3: Seleccionar método de pago)
 * - Muestra opciones de métodos de pago disponibles
 * - Usable por roles "parent" y "student"
 */
export default function EnrollmentPayment() {
  const { user } = useAuth?.() ?? { user: null };
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos desde el paso 2
  const { course, schedule, note, kid_id } = location.state || {};

  const [selected, setSelected] = useState(null);

  // Opciones de métodos de pago
  const paymentMethods = [
    {
      value: "efectivo",
      label: "Efectivo",
      description: "Pago en efectivo en las instalaciones",
      icon: (
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      value: "transferencia",
      label: "Transferencia Bancaria",
      description: "Transferencia electrónica a cuenta bancaria",
      icon: (
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
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      value: "deposito",
      label: "Depósito Bancario",
      description: "Depósito en ventanilla o cajero automático",
      icon: (
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
  ];

  const roleText = useMemo(() => {
    const role =
      user?.role?.toLowerCase?.() || user?.roles?.[0]?.toLowerCase?.() || "";
    if (role.includes("parent")) return "Padre";
    if (role.includes("student")) return "Estudiante";
    return "Usuario";
  }, [user]);

  // Detecta el contexto para construir la ruta del paso 4
  const isParent = location.pathname.startsWith("/parent");
  const isStudent = location.pathname.startsWith("/student");
  const confirmPath = isParent
    ? "/parent/enrollment/confirm"
    : isStudent
    ? "/student/enrollment/confirm"
    : "confirm";

  if (!course || !schedule) {
    return (
      <div className="w-full">
        <Alert color="warning" className="mb-6">
          No se encontraron datos para mostrar. Por favor vuelve al paso
          anterior.
          <div className="mt-3">
            <Button color="indigo" onClick={() => navigate(-1)}>
              Regresar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const canContinue = !!selected;

  const handleContinue = () => {
    if (!selected) return;
    navigate(confirmPath, {
      state: {
        course,
        schedule,
        note,
        kid_id,
        payment_method: selected.value,
      },
    });
  };

  return (
    <div className="w-full">
      {/* Título de la página */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Inscripción
      </h1>

      {/* Stepper */}
      <EnrollmentStepper currentStep={3} />

      {/* Encabezado contextual */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paso 3: Selecciona el método de pago
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {roleText}: elige cómo deseas realizar el pago de{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {course.name}
          </span>
        </p>
      </div>

      {/* Resumen rápido del curso y horario */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
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
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">
              {course.name}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <div className="flex items-center gap-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">
              {new Date(schedule.scheduleDate).toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <div className="flex items-center gap-2">
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
            <span className="text-gray-600 dark:text-gray-400">
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Q{Number(course.cost).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de métodos de pago */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.value}
            method={method}
            selected={selected?.value === method.value}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Información adicional */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
        <div className="flex gap-3">
          <svg
            className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              Información importante
            </h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-400">
              Tu reserva quedará confirmada una vez que se verifique el pago. Estarás recibiendo un mensaje. 
            </p>
          </div>
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {selected
              ? "Revisa tu selección antes de continuar"
              : "Selecciona un método de pago para continuar"}
          </span>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <Button
            color="gray"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Regresar
          </Button>

          <Button
            color="indigo"
            disabled={!canContinue}
            onClick={handleContinue}
            className="flex-1 sm:flex-none"
          >
            Continuar al resumen
            <svg
              className="ml-2 h-4 w-4"
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
        </div>
      </div>
    </div>
  );
}
