// src/components/ConfirmAlert.jsx
import React from "react";

const ConfirmAlert = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">{title || "¿Estás segura?"}</h2>
        <p className="mb-6">{message || "Esta acción no se puede deshacer."}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
