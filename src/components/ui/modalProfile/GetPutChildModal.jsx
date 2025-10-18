// src/components/ui/modalProfile/AddChildModal.jsx

/**
 * @fileoverview Modal para agregar un nuevo perfil de hijo.
 * Incluye validación de formulario y manejo de errores.
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/**
 * Modal para crear un nuevo perfil de hijo.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Si el modal está visible
 * @param {Function} props.onClose - Callback al cerrar el modal
 * @param {Function} props.onSubmit - Callback al enviar el formulario con datos válidos
 * 
 * @example
 * <AddChildModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={async (data) => await createChild(data)}
 * />
 */
export default function GetPutChildModal({ open, child, onClose, onSubmit }) {
  const { lang } = useAuth();
  const t = translations[lang]?.childrenManagement || {};
  const dialogRef = useRef(null);

  /* ==================
     ESTADO
     ================== */
  const [formData, setFormData] = useState({
    name: child ? child.name || "" : "",
    birth_date: child ? child.birthDate || "" : "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* ==================
     EFECTOS
     ================== */
  
  // Actualizar formulario cuando cambia el hijo a editar
  useEffect(() => {
    if (open && child) {
      setFormData({
        name: child.name || "",
        birth_date: child.birthDate || "",
      });
    } else if (open && !child) {
      // Modal de creación (sin hijo)
      setFormData({
        name: "",
        birth_date: "",
      });
    }
  }, [open, child]);
  
  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setFormData({ name: "", birth_date: "" });
      setErrors({});
      setSubmitError("");
      setLoading(false);
    }
  }, [open]);

  // Manejo de tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus al abrir
  useEffect(() => {
    if (open) setTimeout(() => dialogRef.current?.focus(), 0);
  }, [open]);

  /* ==================
     VALIDACIÓN
     ================== */
  
  /**
   * Valida los datos del formulario.
   * 
   * @param {Object} data - Datos a validar
   * @returns {Object} Objeto con errores (vacío si no hay errores)
   */
  const validate = (data) => {
    const newErrors = {};

    // Validar nombre (2-255 caracteres)
    if (!data.name || data.name.trim().length < 2) {
      newErrors.name = t.errors?.nameRequired || "El nombre debe tener al menos 2 caracteres";
    } else if (data.name.length > 255) {
      newErrors.name = t.errors?.nameTooLong || "El nombre no puede exceder 255 caracteres";
    }

    // Validar fecha de nacimiento
    if (!data.birth_date) {
      newErrors.birth_date = t.errors?.birthDateRequired || "La fecha de nacimiento es requerida";
    } else {
      // Validar formato YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.birth_date)) {
        newErrors.birth_date = t.errors?.invalidDate || "Formato de fecha inválido";
      } else {
        // Validar que sea una fecha válida y no futura
        const birthDate = new Date(data.birth_date);
        const today = new Date();
        
        if (isNaN(birthDate.getTime())) {
          newErrors.birth_date = t.errors?.invalidDate || "Fecha inválida";
        } else if (birthDate > today) {
          newErrors.birth_date = t.errors?.futureDate || "La fecha no puede ser futura";
        } else if (birthDate.getFullYear() < 1900) {
          newErrors.birth_date = t.errors?.dateTooOld || "Fecha demasiado antigua";
        }
      }
    }

    return newErrors;
  };

  /* ==================
     MANEJADORES
     ================== */
  
  /**
   * Maneja cambios en los inputs del formulario.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Limpiar error general
    if (submitError) {
      setSubmitError("");
    }
  };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      child ? await onSubmit(child.id, formData) : await onSubmit(formData);
      
      // Cerrar modal solo si el submit fue exitoso
      onClose();
    } catch (err) {
      console.error("Error en submit:", err);
      setSubmitError(err.message || t.errors?.submitError || "Error al crear el perfil");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula la fecha máxima permitida (hoy).
   */
  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  /* ==================
     RENDER
     ================== */
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-8"
      >
        {/* Botón X */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 bg-red-600 text-white dark:bg-red-600 rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {child ? t.updateChildModal?.title || "Editar Perfil de Hijo" : t.addChildModal?.title || "Agregar Nuevo Hijo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error general */}
          {submitError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-400">
                <span className="font-medium">{t.errors?.error || "Error"}:</span> {submitError}
              </p>
            </div>
          )}

          {/* Campo: Nombre */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.addChildModal?.nameLabel || "Nombre completo"}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t.addChildModal?.namePlaceholder || "Ej: María Pérez"}
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              autoFocus
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Campo: Fecha de nacimiento */}
          <div>
            <label 
              htmlFor="birth_date" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.addChildModal?.birthDateLabel || "Fecha de nacimiento"}
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              max={getMaxDate()}
              disabled={loading}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
                errors.birth_date 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              }`}
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.birth_date}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              {t.addChildModal?.cancelButton || "Cancelar"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading 
                ? (child ? t.updateChildModal?.updatingButton || "Actualizando..." : t.addChildModal?.creatingButton || "Creando...") 
                : ( child ? t.updateChildModal?.updateButton || "Actualizar Perfil" : t.addChildModal?.createButton || "Crear Perfil")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
