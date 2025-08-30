import React, { useState, useEffect } from 'react';

const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ current: '', new: '', confirm: '' });
      setError('');
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.current || !form.new || !form.confirm) {
      setError('Completa todos los campos');
      return;
    }
    if (form.new.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (form.new !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit(form);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white p-12 shadow-2xl flex flex-col justify-center rounded-lg relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo y titulo  */}
        <div className="text-center mb-8">
          {/* Ícono de usuario */}
          <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
            <img
              src="/LogoColorEMA4.svg"
              alt="Logo EMA"
              className="w-30 h-30 object-contain"
            />
          </div>
          {/* Título */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cambia Tu Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por seguridad, cambia tu contraseña antes de continuar.
          </p>
        </div>

        {/* Mensaje de error si existe */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            {/* Campo de contraseña actual */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Contraseña Actual <span className="text-red-500">*</span>
              </label>
              <input
                id="current"
                name="current"
                type="password"
                autoComplete="current-password"
                required
                value={form.current}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="block w-full p-3 text-sm rounded-lg border transition-colors duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Nueva contraseña */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Nueva Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="new"
                name="new"
                type="password"
                autoComplete="new-password"
                required
                value={form.new}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="block w-full p-3 text-sm rounded-lg border transition-colors duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirmar Nueva Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="block w-full p-3 text-sm rounded-lg border transition-colors duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Botón cambiar contraseña */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 transform text-white ${loading
                ? 'opacity-60 cursor-not-allowed bg-gray-400'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] cursor-pointer'
                }`}
            >
              {loading ? 'CAMBIANDO...' : 'CAMBIAR CONTRASEÑA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;