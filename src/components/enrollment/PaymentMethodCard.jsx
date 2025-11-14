// src/components/enrollment/PaymentMethodCard.jsx

/**
 * Tarjeta de selección de método de pago con radio button
 * @param {Object} method - Método de pago { value, label, icon, description }
 * @param {boolean} selected - Si está seleccionado
 * @param {Function} onSelect - Callback al seleccionar
 */
export default function PaymentMethodCard({ method, selected, onSelect }) {
  const { value, label, icon, description } = method;

  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={`group relative flex w-full cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-500 ring-offset-2 dark:border-indigo-400 dark:bg-indigo-950/30 dark:ring-indigo-400"
          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
      }`}
    >
      {/* Radio button indicator */}
      <div className="flex items-start">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            selected
              ? "border-indigo-600 bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-400"
              : "border-gray-300 bg-white group-hover:border-indigo-400 dark:border-gray-600 dark:bg-gray-700"
          }`}
        >
          {selected && (
            <div className="h-2.5 w-2.5 rounded-full bg-white dark:bg-gray-900"></div>
          )}
        </div>

        {/* Contenido */}
        <div className="ml-4 flex flex-1 flex-col text-left">
          {/* Icono y título */}
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors ${
                selected
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400"
              }`}
            >
              {icon}
            </div>
            <div className="flex-1">
              <h3
                className={`text-lg font-bold transition-colors ${
                  selected
                    ? "text-indigo-900 dark:text-indigo-100"
                    : "text-gray-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300"
                }`}
              >
                {label}
              </h3>
              <p
                className={`mt-1 text-sm transition-colors ${
                  selected
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge "Seleccionado" */}
      {selected && (
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white dark:bg-indigo-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Seleccionado
          </span>
        </div>
      )}
    </button>
  );
}
