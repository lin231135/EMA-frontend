import React, { useState } from 'react';
import PasswordModal from './Popup'; 
import { useNavigate } from 'react-router-dom';


const Login = () => {
  // Estado para los campos de email y contraseña
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  
  // Estado para el checkbox "Recordar sesión"
  const [rememberMe, setRememberMe] = useState(false);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('');

  const [showResetPopup, setShowResetPopup] = useState(false);
  console.log('showResetPopup:', showResetPopup);

  const [isFirstLogin, setIsFirstLogin] = useState(false); // Estado para simular primer acceso

  // Maneja el cambio en los inputs de email y contraseña
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token en localStorage (o sessionStorage si no se marca "Recordar sesión")
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      // Verifica si es el primer acceso desde el backend (opcional)
      const isFirst = data.user.is_first_login || false;

      if (isFirst) {
        setIsFirstLogin(true);
        setShowResetPopup(true);
      } else {
        alert(`¡Bienvenido/a, ${data.user.name}!`);
        navigate('/'); // Redirige a la página de inicio
      }

      setError('');
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message);
    }
  };


  const handlePasswordUpdate = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

      const response = await fetch('http://localhost:5000/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: data.current,
          newPassword: data.new
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alert('¡Contraseña actualizada correctamente!');
      setTimeout(() => navigate('/'), 1000);

      setShowResetPopup(false);
      setIsFirstLogin(false);
    } catch (err) {
      console.error(err.message);
      alert('Error: ' + err.message);
    }
  };


  // Formulario de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          {/* Ícono de usuario */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
            <svg 
              className="h-8 w-8 text-indigo-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          {/* Título */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        {/* Mensaje de error si existe */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Formulario de login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            {/* Campo de email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>
            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Checkbox "Recordar sesión" y enlace para recuperar contraseña */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordar sesión
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              href="./pages/Home.jsx"            >
              Iniciar sesión
            </button >
          </div>
        </form>
        
        {/* Enlace para registrarse */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate
            </a>
          </p>
        </div>
      </div>
      {/* Popup de restablecimiento de contraseña */}
      <PasswordModal
        isOpen={showResetPopup}
        onClose={() => {
          setShowResetPopup(false);
          setIsFirstLogin(false);
        }}
        onSubmit={handlePasswordUpdate}
      />
    </div>
  );
};

// Exporta el componente Login
export default Login;   