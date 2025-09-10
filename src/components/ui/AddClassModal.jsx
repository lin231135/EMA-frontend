// src/components/ui/AddClassModal.jsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import translations from "../../translations"; 

const ACADEMY_ADDR = "19 Avenida A 4-35, Cdad. de Guatemala, Guatemala";

export default function AddClassModal({ open, onClose, onSubmit }) {
  const { lang } = useAuth();
  const t = translations[lang].addClassModal;
  const dialogRef = useRef(null);

  const [form, setForm] = useState({
    studentName: "",
    date: "",
    hour: "16:00",
    classType: "Sing",
    location: "",
  });

  // Guarda el borrador de la dirección del usuario para restaurarla al desmarcar
  const [useAcademyLocation, setUseAcademyLocation] = useState(false);
  const [userLocationDraft, setUserLocationDraft] = useState(form.location || "");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) setTimeout(() => dialogRef.current?.focus(), 0);
  }, [open]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleUseAcademy = (e) => {
    const checked = e.target.checked;
    setUseAcademyLocation(checked);
    if (checked) {
      // guarda lo que el user tenía y autocompleta con la dirección de la academia
      setUserLocationDraft(form.location || "");
      setForm((prev) => ({ ...prev, location: ACADEMY_ADDR }));
    } else {
      // restaura lo que el user había escrito
      setForm((prev) => ({ ...prev, location: userLocationDraft || "" }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-class-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Contenedor modal */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-[92%] max-w-[720px] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl outline-none"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label={t.a11y.close || "Close"}
          className="absolute -right-2 -top-2 h-10 w-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black"
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
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </button>

        {/* Contenido */}
        <form onSubmit={submit} className="p-8">
          <h2
            id="add-class-title"
            className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8"
          >
            {t.title || "Add New Class"}
          </h2>

          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.fields.studentName}
              </label>
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder={t.placeholders.studentName}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.fields.date}
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Class (select) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.fields.class}
              </label>
              <div className="relative">
                <select
                  name="classType"
                  value={form.classType}
                  onChange={handleChange}
                  className="appearance-none w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-cyan-500 text-white px-3 py-2 pr-10 focus:outline-none"
                >
                  <option>{t.options.sing}</option>
                  <option>{t.options.piano}</option>
                </select>

                {/* Chevron */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
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
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Hour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.fields.hour}
              </label>
              <input
                type="time"
                name="hour"
                value={form.hour}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="location-input"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t.fields.location}
              </label>

              <label
                htmlFor="useAcademyLocation"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                title={t.academy.tooltip}
              >
                <input
                  id="useAcademyLocation"
                  type="checkbox"
                  checked={useAcademyLocation}
                  onChange={toggleUseAcademy}
                  className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                {t.academy.useAcademyLabel}
              </label>
            </div>

            <div className="relative">
              <input
                id="location-input"
                type="text"
                name="location"
                value={form.location}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, location: e.target.value }));
                  if (!useAcademyLocation) setUserLocationDraft(e.target.value);
                }}
                placeholder={
                  useAcademyLocation
                    ? ACADEMY_ADDR
                    : t.placeholders.location
                }
                required={!useAcademyLocation}
                readOnly={useAcademyLocation}
                className={[
                  "w-full rounded-lg border px-4 py-3 pr-12 focus:outline-none",
                  useAcademyLocation
                    ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                ].join(" ")}
                aria-describedby="location-help"
              />
            </div>

            <p id="location-help" className="text-xs text-gray-500 dark:text-gray-400">
              {useAcademyLocation
                ? t.academy.using
                : t.academy.required}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="w-[280px] rounded-xl bg-cyan-500 px-6 py-3 text-white text-lg font-extrabold tracking-wide shadow hover:bg-cyan-600 transition"
            >
              {t.cta.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
