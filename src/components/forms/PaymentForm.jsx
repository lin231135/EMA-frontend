// src/components/forms/PaymentForm.jsx
import { useRef, useState, useEffect } from "react";
import { Button, Label, Textarea } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import en from "../../translations/en/form/PaymentForm";
import es from "../../translations/es/form/PaymentForm";

import { useAuth } from "../../contexts/AuthContext";

const fmtDate = (iso) => {
  if (!iso) return "dd / mm / yyyy";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`; 
};

export default function PaymentForm({
  onSubmit,
  onCancel,
  contextRole = "admin",
  showHeader = true,
  initialValues = {},
  readOnlyFields = {},
  studentOptions = [],
  isLoading = false,
}) {
  const navigate = useNavigate();
  const { lang, user } = useAuth();
  const t = (lang === "es" ? es : en) ?? en;

  const dateRef = useRef(null);
  const fileRef = useRef(null);

  const defaults = {
    studentName: "",
    parentName: "",
    method: "transfer", // Valor por defecto: transferencia
    date: "",
    status: "completed",
    currency: t.form.currencySymbol ?? "Q",
    total: "",
    notes: "",
    proof: null,
  };

  const [form, setForm] = useState({ ...defaults, ...initialValues });

  useEffect(() => {
      // Actualizar formulario cuando cambien los valores iniciales
      if (Object.keys(initialValues).length > 0) {
        setForm((prev) => ({ ...prev, ...initialValues }));
      }
    }, [initialValues]);

    useEffect(() => {
    if (studentOptions.length === 0 || readOnlyFields.studentName) return;

    // Si el form trae label y no value, intenta mapearlo al value correcto.
    const current = form.studentName;
    const hit = studentOptions.find(
      (opt) => opt.value === current || opt.label === current
    );

    if (hit && current !== hit.value) {
      setForm((s) => ({ ...s, studentName: hit.value }));
    }
    // Si no hay match, deja "" para que el usuario elija.
  }, [studentOptions, readOnlyFields.studentName, form.studentName]);


  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.studentName?.trim()) {
      alert(t.alerts?.required || "Por favor completa el nombre del estudiante");
      return;
    }
    
    if (!form.date) {
      alert(t.alerts?.dateRequired || "Por favor selecciona una fecha");
      return;
    }
    
    const amount = parseFloat(form.total);
    if (!form.total || isNaN(amount) || amount <= 0) {
      alert(t.alerts?.invalidAmount || "Por favor ingresa un monto válido mayor a 0");
      return;
    }
    
    const payload = { ...form, contextRole, userId: user?.id };
    onSubmit ? onSubmit(payload) : console.log("[PaymentForm] payload:", payload);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="px-6 pt-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            <span className="text-gray-900 dark:text-gray-100">
              {t.header.breadcrumb}{" "}
            </span>
            {t.header.title}
          </h1>

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

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 min-h-[550px]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Student name */}
            <div>
              <label
                htmlFor="studentName"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.studentName}
              </label>
              
              {studentOptions.length > 0 && !readOnlyFields.studentName ? (
                // Select cuando hay opciones disponibles
                <select
                  id="studentName"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                >
                  <option value="">{t.form.studentName_ph || "Selecciona un estudiante"}</option>
                  {studentOptions.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                // Input texto cuando no hay opciones o es readonly
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  placeholder={t.form.studentName_ph}
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  readOnly={!!readOnlyFields.studentName}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  disabled={readOnlyFields.studentName}
                />
              )}
            </div>

            {/* Parent name */}
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
                readOnly={!!readOnlyFields.parentName}
                disabled={readOnlyFields.parentName}
                className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 
                  text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                  dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                  disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              />
            </div>

            {/* Payment method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.method}
              </label>
              <div className="relative w-full max-w-xs">
                <select
                  id="paymentMethod"
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full max-w-xs appearance-none rounded-lg bg-cyan-500 px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="cash">{t.methodOptions?.cash || "Efectivo"}</option>
                  <option value="transfer">{t.methodOptions?.transfer || "Transferencia"}</option>
                  <option value="deposit">{t.methodOptions?.deposit || "Depósito"}</option>
                </select>
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

            {/* Payment Date */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.date}
              </label>
              <input
                id="date"
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="hidden"
              />
              
              <button
                type="button"
                aria-label="Seleccionar fecha de pago"
                onClick={() =>
                  dateRef.current?.showPicker?.() || dateRef.current?.click()
                }
                disabled={isLoading}
                className="flex w-full max-w-xs items-center justify-between rounded-lg bg-cyan-500 px-4 py-3 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Total Payment */}
            <div>
              <label
                htmlFor="total"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.total}
              </label>
              <div className="flex items-stretch max-w-xs">
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
                <input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={t.form.total_ph || "0.00"}
                  value={form.total}
                  onChange={handleChange}
                  readOnly={!!readOnlyFields.total}
                  disabled={readOnlyFields.total || isLoading}
                  className="h-12 flex-1 rounded-r-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Proof of Payment */}
            <div>
              <label 
              htmlFor="proof"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.proof}
              </label>
              <input
                id="proof"
                ref={fileRef}
                type="file"
                name="proof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                disabled={isLoading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isLoading}
                className="w-full max-w-xs rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.form.proof_btn || "Subir comprobante"}
              </button>
              {form.proof && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t.form.selected || "Archivo seleccionado:"}{" "}
                  <span className="font-medium">{form.proof.name}</span>
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.notes}
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder={t.form.notes_ph || "Notas adicionales (opcional)"}
                rows={4}
                value={form.notes}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full max-w-md rounded-lg border-gray-300 focus:border-gray-500 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              color="failure"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              type="button"
            >
              {t.actions?.cancel || "Cancelar"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[200px] bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading 
                ? (t.actions?.submitting || "Procesando...") 
                : (t.actions?.submit || "Enviar Pago")
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
