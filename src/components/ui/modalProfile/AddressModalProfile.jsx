// src/components/ui/modalProfile/AddressModalProfile.jsx
import { useEffect, useRef, useState } from "react";
import translations from "../../../translations";
import { useAuth } from "../../../contexts/AuthContext";

export default function AddressModalProfile({ open, onClose, address, onSubmit }) {
  const { lang } = useAuth();
  const t = translations[lang].studentProfile;
  const dialogRef = useRef(null);

  const [form, setForm] = useState({
    city: address?.city || "",
    apartment: address?.apartment || "",
    street_avenue: address?.street_avenue || "",
    zone: address?.zone || "",
    house_number: address?.house_number || "",
    neighborhood: address?.neighborhood || "",
    municipality: address?.municipality || "",
    is_primary: Boolean(address?.is_primary),
  });

  useEffect(() => {
    if (address) {
      setForm({
        city: address.city || "",
        apartment: address.apartment || "",
        street_avenue: address.street_avenue || "",
        zone: address.zone || "",
        house_number: address.house_number || "",
        neighborhood: address.neighborhood || "",
        municipality: address.municipality || "",
        is_primary: Boolean(address.is_primary),
      });
    }
  }, [address]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) setTimeout(() => dialogRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ id: address?.id, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div ref={dialogRef} tabIndex={-1} onClick={(e) => e.stopPropagation()} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-8">
        <button onClick={onClose} aria-label="Cerrar" className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <h2 className="mt-2 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">{t.modals.addressTitle}</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
            <div><label className="block text-sm font-semibold mb-1">{t.fields.city}</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div><label className="block text-sm font-semibold mb-1">{t.fields.apartment}</label>
              <input name="apartment" value={form.apartment} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div><label className="block text-sm font-semibold mb-1">{t.fields.street}</label>
              <input name="street_avenue" value={form.street_avenue} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div><label className="block text-sm font-semibold mb-1">{t.fields.zone}</label>
              <input name="zone" value={form.zone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div><label className="block text-sm font-semibold mb-1">{t.fields.house}</label>
              <input name="house_number" value={form.house_number} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div><label className="block text-sm font-semibold mb-1">{t.fields.colony}</label>
              <input name="neighborhood" value={form.neighborhood} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-semibold mb-1">{t.fields.municipality}</label>
              <input name="municipality" value={form.municipality} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" name="is_primary" checked={form.is_primary} onChange={handleChange} />
              <span className="text-sm">{lang === "es" ? "Marcar como principal" : "Set as primary"}</span>
            </label>
          </div>

          <div className="pt-2 flex justify-center">
            <button type="submit" className="w-72 max-w-full px-6 py-3 rounded-md text-white font-semibold bg-cyan-500 hover:bg-cyan-600">
              {t.buttons.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}