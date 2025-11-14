// src/components/enrollment/ChildSelectionCard.jsx

/**
 * Card de selección de hijo con radio button
 * Similar a PaymentMethodCard pero adaptado para datos de hijos
 * @param {Object} child - Datos del hijo (id, name, birth_date)
 * @param {boolean} selected - Si está seleccionado
 * @param {Function} onSelect - Callback al seleccionar
 */
export default function ChildSelectionCard({ child, selected, onSelect }) {
  // Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(child.birth_date);

  return (
    <button
      type="button"
      onClick={() => onSelect(child)}
      className={`group relative w-full rounded-xl border-2 p-6 text-left transition-all duration-200 ${
        selected
          ? "border-indigo-600 bg-indigo-50 shadow-lg dark:border-indigo-500 dark:bg-indigo-950/30"
          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-700"
      }`}
    >
      {/* Radio indicator */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? "border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500"
              : "border-gray-300 bg-white group-hover:border-indigo-400 dark:border-gray-600 dark:bg-gray-700"
          }`}
        >
          {selected && (
            <svg
              className="h-3 w-3 text-white"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <circle cx="6" cy="6" r="3" />
            </svg>
          )}
        </div>

        {/* Badge de seleccionado */}
        {selected && (
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white dark:bg-indigo-500">
            Seleccionado
          </span>
        )}
      </div>

      {/* Icono y contenido */}
      <div className="flex items-start gap-4">
        {/* Avatar icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
            selected
              ? "bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Información del hijo */}
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold transition-colors ${
              selected
                ? "text-indigo-900 dark:text-indigo-100"
                : "text-gray-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300"
            }`}
          >
            {child.name}
          </h3>
          {age !== null && (
            <p
              className={`mt-1 text-sm transition-colors ${
                selected
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {age} {age === 1 ? "año" : "años"}
            </p>
          )}
          {child.birth_date && (
            <p
              className={`mt-1 text-xs transition-colors ${
                selected
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-500"
              }`}
            >
              Nacimiento: {new Date(child.birth_date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
