// src/components/ui/student/PersonalInfoModalProfile.jsx
import { useEffect, useRef, useState } from "react";
import translations from "../../../translations";
import { useAuth } from "../../../contexts/AuthContext";

export default function PersonalInfoModal({ open, onClose, user, onSubmit }) {
  const { lang } = useAuth();
  const t = translations[lang].studentProfile;
  const dialogRef = useRef(null);

  const splitPhone = (raw = "") => {
    const m = String(raw).trim().match(/^(\+\d+)\s*(.*)$/);
    return m ? { code: m[1], num: m[2] } : { code: "+502", num: raw || "" };
  };

  const initial = splitPhone(user?.phone);
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [code, setCode] = useState(initial.code);
  const [num, setNum] = useState(initial.num);

  useEffect(() => {
    setName(user?.name || "");
    setLastName(user?.lastName || "");
    setEmail(user?.email || "");
    const s = splitPhone(user?.phone);
    setCode(s.code);
    setNum(s.num);
  }, [user]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) setTimeout(() => dialogRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      name: name.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: `${code} ${num}`.trim(),
    });
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
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-8"
      >
        {/* Botón X  */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 bg-red-600 text-white dark:bg-red-600 rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar centrado */}
        <div className="w-full flex justify-center">
          <img
            src={user?.avatar || "/avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        {/* Título */}
        <h2 className="mt-4 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t.modals.personalTitle}
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Nombre / Apellido  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.name}
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fields.lastName}
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.fields.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correoNuevo@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Teléfono  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.phone}
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="tel"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                placeholder="12345678"
                required
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Botón principal */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="w-72 max-w-full px-6 py-3 rounded-md text-white font-semibold bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {t.buttons.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
