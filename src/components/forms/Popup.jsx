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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-indigo-100 rounded-full p-2 mb-2">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 text-center">Cambia Tú Contraseña</h2>
          <p className="text-xs text-gray-500 text-center">Por seguridad, cambia tu contraseña antes de continuar.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="current" className="block text-xs font-medium text-gray-700 mb-1">
              Contraseña Actual
            </label>
            <input
              id="current"
              name="current"
              type="password"
              value={form.current}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="new" className="block text-xs font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              id="new"
              name="new"
              type="password"
              value={form.new}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-xs font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-xs text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded bg-indigo-600 text-white text-sm font-medium mt-2 transition ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;