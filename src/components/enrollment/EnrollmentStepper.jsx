// src/components/enrollment/EnrollmentStepper.jsx

/**
 * Componente Stepper visual para el proceso de inscripción
 * @param {number} currentStep - Paso actual (1-5)
 * @param {boolean} isParent - Si es padre (muestra paso de selección de hijo)
 */
export default function EnrollmentStepper({ currentStep = 1, isParent = false }) {
  // Pasos base para estudiantes (4 pasos)
  const studentSteps = [
    {
      number: 1,
      label: "Curso",
      icon: (completed) =>
        completed ? (
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
        ) : (
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 16"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
          </svg>
        ),
    },
    {
      number: 2,
      label: "Horario",
      icon: (completed) =>
        completed ? (
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
        ) : (
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
        ),
    },
    {
      number: 3,
      label: "Pago",
      icon: (completed) =>
        completed ? (
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
        ) : (
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
    },
    {
      number: 4,
      label: "Confirmar",
      icon: (active) =>
        active ? (
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1 1 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
          </svg>
        ) : (
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1 1 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
          </svg>
        ),
    },
  ];

  // Pasos para padres (5 pasos, incluye selección de hijo)
  const parentSteps = [
    studentSteps[0], // Curso
    {
      number: 2,
      label: "Hijo",
      icon: (completed) =>
        completed ? (
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
        ) : (
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-100 lg:h-5 lg:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
          </svg>
        ),
    },
    {
      number: 3,
      label: "Horario",
      icon: studentSteps[1].icon,
    },
    {
      number: 4,
      label: "Pago",
      icon: studentSteps[2].icon,
    },
    {
      number: 5,
      label: "Confirmar",
      icon: studentSteps[3].icon,
    },
  ];

  const steps = isParent ? parentSteps : studentSteps;

  return (
    <div className="mb-6 flex w-full justify-center">
      <nav aria-label="Stepper" className="w-full max-w-2xl">
        <ol className="flex items-center justify-center gap-3">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const showConnector = index < steps.length - 1;

            return (
              <li key={step.number} className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:h-12 lg:w-12 ${
                    isActive
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : isCompleted
                      ? "bg-indigo-100 dark:bg-indigo-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {step.icon(isCompleted || isActive)}
                </span>
                {showConnector && (
                  <div
                    className={`hidden h-1 w-16 rounded sm:block ${
                      isCompleted
                        ? "bg-indigo-200 dark:bg-indigo-900"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  ></div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
