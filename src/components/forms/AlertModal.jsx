// src/components/AlertModal.jsx
import React from "react";

const AlertModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-[90%] max-w-md text-center transform transition-all animate-fade-in">
        {/* Ícono de éxito */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title || "Alerta"}
        </h2>

        {/* Mensaje */}
        <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          {message || "Esto es un mensaje de alerta."}
        </p>

        {/* Botón */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
