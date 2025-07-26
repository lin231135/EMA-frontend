// src/components/AlertModal.jsx
import React from "react";

const AlertModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">{title || "Alerta"}</h2>
        <p className="mb-6">{message || "Esto es un mensaje de alerta."}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
