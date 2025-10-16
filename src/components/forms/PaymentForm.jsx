// src/components/forms/PaymentForm.jsx
/**
 * Componente reutilizable para gestionar pagos
 * Puede ser usado por Admin, Parent y Student con diferentes contextos
 */

import { useRef, useState } from "react";
import { Button, Label, Textarea } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import en from "../../translations/en/form/PaymentForm.js";
import es from "../../translations/es/form/PaymentForm.js";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Formatea una fecha ISO a formato visual mm / dd / yyyy
 * @param {string} iso - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {string} Fecha formateada o placeholder por defecto
 */
const fmtDate = (iso) => {
  if (!iso) return "mm / dd / yyyy";
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm} / ${dd} / ${yyyy}`;
};

/**
 * PaymentForm - Componente de formulario de pagos reutilizable
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Callback ejecutado al enviar el formulario (payload) => void
 * @param {Function} props.onCancel - Callback ejecutado al cancelar (opcional)
 * @param {string} props.contextRole - Rol del contexto: "admin" | "parent" | "student" (para logging/telemetría)
 * @param {boolean} props.showHeader - Mostrar u ocultar el encabezado (default: true)
 */
export default function PaymentForm({
  onSubmit,
  onCancel,
  contextRole = "admin",
  showHeader = true,
}) {
  // Hook de navegación para redirigir al usuario
  const navigate = useNavigate();
  
  // Obtiene el idioma actual del contexto de autenticación
  const { lang } = useAuth();
  
  // Selecciona las traducciones según el idioma (español o inglés)
  const t = (lang === "es" ? es : en) ?? en;

  // Referencias para controlar el input de fecha y archivo
  const dateRef = useRef(null);
  const fileRef = useRef(null);

  // Estado del formulario con todos los campos necesarios
  const [form, setForm] = useState({
    studentName: "",      // Nombre del estudiante
    parentName: "",       // Nombre del encargado/padre
    method: "cash",       // Método de pago (efectivo por defecto)
    date: "",            // Fecha de pago
    status: "completed", // Estado del pago
    currency: t.form.currencySymbol ?? "Q", // Símbolo de moneda
    total: "",           // Monto total
    notes: "",           // Notas adicionales
    proof: null,         // Archivo de comprobante
  });

  /**
   * Maneja los cambios en los campos del formulario
   * Actualiza el estado según el tipo de input (archivo o texto)
   */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  /**
   * Maneja el envío del formulario
   * Valida campos requeridos antes de procesar
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    if (!form.studentName || !form.date || !form.total) {
      alert(t.alerts.required);
      return;
    }
    
    // Construye el payload con los datos del formulario y el contexto
    const payload = { ...form, contextRole };
    
    // Ejecuta el callback onSubmit si existe, sino hace log
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("[PaymentForm] payload:", payload);
    }
  };

  /**
   * Maneja la cancelación del formulario
   * Ejecuta onCancel si existe, sino navega hacia atrás
   */
  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <div className="w-full">
      {/* Encabezado del formulario - opcional según showHeader */}
      {showHeader && (
        <div className="px-6 pt-4 flex items-center justify-between">
          {/* Título */}
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            <span className="text-gray-900 dark:text-gray-100">
              {t.header.breadcrumb}{" "}
            </span>
            {t.header.title}
          </h1>

          {/* Botón de regresar */}
          <Button
            onClick={() => navigate(-1)}
            className="shrink-0 flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300"
            pill
          >
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
              />
            </svg>
            {t.header.back}
          </Button>
        </div>
      )}

      {/* Contenedor principal del formulario */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 min-h-[550px]">
        <form onSubmit={handleSubmit} className="w-full">
          {/* Grid para los campos del formulario */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Campo: Nombre del estudiante */}
            <div>
              <label
                htmlFor="studentName"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.studentName}
              </label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                placeholder={t.form.studentName_ph}
                value={form.studentName}
                onChange={handleChange}
                required
                className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                  text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                  dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              />
            </div>

            {/* Campo: Nombre del encargado/padre */}
            <div>
              <label
                htmlFor="parentName"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.parentName}
              </label>
              <input
                id="parentName"
                name="parentName"
                type="text"
                placeholder={t.form.parentName_ph}
                value={form.parentName}
                onChange={handleChange}
                required
                className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 
                  text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                  dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              />
            </div>

            {/* Campo: Método de pago (dropdown) */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.method}
              </label>
              <Label
                value={t.form.method}
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              {/* Select personalizado con icono de dropdown */}
              <div className="relative w-full max-w-xs">
                <select
                  id="paymentMethod"
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full max-w-xs appearance-none rounded-lg bg-cyan-500 px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-cyan-600"
                >
                  <option value="cash">{t.methodOptions.cash}</option>
                  <option value="transfer">{t.methodOptions.transfer}</option>
                </select>
                {/* Icono de flecha para el select */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Fecha de pago */}
            <div>
              <label
                htmlFor="paymentDate"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.date}
              </label>
              <Label
                value={t.form.date}
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 "
              />
              {/* Input de fecha oculto  */}
              <input
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() =>
                  dateRef.current?.showPicker?.() || dateRef.current?.click()
                }
                className="flex w-full max-w-xs items-center justify-between rounded-lg bg-cyan-500 px-4 py-3 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span>{fmtDate(form.date)}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Monto total del pago */}
            <div>
              <label
                htmlFor="totalPayment"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.total}
              </label>
              <Label
                value={t.form.total}
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              {/* Input de monto con icono de moneda */}
              <div className="flex items-stretch max-w-xs">
                {/* Icono de símbolo de moneda */}
                <div className="flex h-12 w-12 items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                    />
                  </svg>
                </div>
                {/* Input numérico para el monto */}
                <input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  placeholder={t.form.total_ph}
                  value={form.total}
                  onChange={handleChange}
                  className="h-12 flex-1 rounded-r-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                  required
                />
              </div>
            </div>

            {/* Comprobante de pago (archivo) */}
            <div>
              <label
                htmlFor="proofOfPayment"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.proof}
              </label>
              <Label
                value={t.form.proof}
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              {/* Input de archivo oculto */}
              <input
                ref={fileRef}
                type="file"
                name="proof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full max-w-xs rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {t.form.proof_btn}
              </button>
              {/* Muestra el nombre del archivo seleccionado */}
              {form.proof && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t.form.selected}{" "}
                  <span className="font-medium">{form.proof.name}</span>
                </p>
              )}
            </div>

            {/* Notas adicionales (textarea) */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.notes}
              </label>
              <Label
                htmlFor="notes"
                value={t.form.notes}
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <Textarea
                id="notes"
                name="notes"
                placeholder={t.form.notes_ph}
                rows={4}
                value={form.notes}
                onChange={handleChange}
                className="w-full max-w-md rounded-lg border-gray-300 focus:border-gray-500 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Botones de acción: Cancelar y Enviar */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Botón de cancelar */}
            <Button
              color="failure"
              onClick={handleCancel}
              className="w-full sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white"
              type="button"
            >
              {t.actions.cancel}
            </Button>
            {/* Botón de enviar formulario */}
            <Button
              type="submit"
              className="w-full sm:w-auto min-w-[200px] bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {t.actions.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
