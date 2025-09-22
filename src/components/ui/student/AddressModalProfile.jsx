// src/components/ui/student/AddressModalProfile.jsx
import { useEffect, useRef, useState } from "react";
import translations from "../../../translations";
import { useAuth } from "../../../contexts/AuthContext";

export default function AddressModalProfile({ open, onClose, user, onSubmit }) {
  const { lang } = useAuth();
  const t = translations[lang].studentProfile;
  const dialogRef = useRef(null);

  const [form, setForm] = useState({
    city: user?.address?.city || "",
    apt: user?.address?.apt || "",
    street: user?.address?.street || "",
    zone: user?.address?.zone || "",
    house: user?.address?.house || "",
    colony: user?.address?.colony || "",
    municipality: user?.address?.municipality || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        city: user.address?.city || "",
        apt: user.address?.apt || "",
        street: user.address?.street || "",
        zone: user.address?.zone || "",
        house: user.address?.house || "",
        colony: user.address?.colony || "",
        municipality: user.address?.municipality || "",
      });
    }
  }, [user]);

  // Esc para cerrar
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Autofocus
  useEffect(() => {
    if (open) setTimeout(() => dialogRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ address: { ...form } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-8"
      >
        {/* Botón X */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar y título */}
        <div className="w-full flex justify-center">
          <img
            src={user?.avatar || "/avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <h2 className="mt-4 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t.modals.addressTitle}
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.city}
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder={`${lang === 'es' ? 'Ingresa la' : 'Enter the'} ${t.fields.city.toLowerCase()}`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.apartment}
              </label>
              <input
                name="apt"
                value={form.apt}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingresa el apartamento si aplica' : 'Enter apartment if applicable'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.street}
              </label>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingresa la calle o avenida' : 'Enter street or avenue'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.zone}
              </label>
              <input
                name="zone"
                value={form.zone}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingresa la zona' : 'Enter zone'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.house}
              </label>
              <input
                name="house"
                value={form.house}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingresa el número de casa' : 'Enter house number'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.colony}
              </label>
              <input
                name="colony"
                value={form.colony}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingresa el nombre de la colonia' : 'Enter neighborhood name'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Municipio */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.municipality}
              </label>
              <input
                name="municipality"
                value={form.municipality}
                onChange={handleChange}
                placeholder={lang === 'es' ? 'Ingrese el municipio' : 'Enter municipality'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Botón principal */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="w-72 max-w-full px-6 py-3 rounded-md text-white font-semibold bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {t.buttons.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
