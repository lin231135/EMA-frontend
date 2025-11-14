// src/components/enrollment/NoteInput.jsx
import { Textarea } from "flowbite-react";

/**
 * Campo de entrada para notas opcionales
 * @param {string} note - Valor de la nota
 * @param {Function} onChange - Callback al cambiar la nota
 */
export default function NoteInput({ note, onChange }) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <svg
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        Nota para la reserva (opcional)
      </label>
      <Textarea
        rows={3}
        placeholder="Ej. Prefiero este horario por disponibilidad de transporte..."
        value={note}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Puedes agregar cualquier información adicional que consideres relevante
        para tu inscripción.
      </p>
    </div>
  );
}
