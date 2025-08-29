// Tarjeta de imagen
export const RegisterImageCard = () => (
  <div className="flex-1 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 relative shadow-2xl overflow-hidden">
    <img
      src="/imagen_registro.jpg"
      alt="Registro"
      className="object-cover w-full h-full opacity-90"
    />
    <div className="absolute inset-0 bg-black opacity-30"></div>
  </div>
);

// Tarjeta del formulario
export const RegisterFormCard = () => (
  <div className="flex-1 min-h-[400px] bg-white p-12 shadow-2xl flex flex-col justify-center">
    {/* Logo y título */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
        <img
          src="/LogoColorEMA4.svg"
          alt="Logo EMA"
          className="w-30 h-30 object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Formulario de Registro
      </h1>
      <p className="text-gray-600">Regístrate para comenzar</p>
    </div>

    {/* Campos del formulario */}
    <div className="space-y-4">
      {/* Nombre y Apellido en fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Tu nombre"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Apellido
          </label>
          <input
            type="text"
            placeholder="Tu apellido"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
          />
        </div>
      </div>

      {/* Prefijo + Teléfono */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Prefijo + Teléfono
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
            +502
          </span>
          <input
            type="tel"
            placeholder="12345678"
            className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
          />
        </div>
      </div>

      {/* Correo Electrónico */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Correo Electrónico
        </label>
        <input
          type="email"
          placeholder="tu@gmail.com"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
        />
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
        />
      </div>

      {/* Botón de registro */}
      <button
        type="button"
        className="w-full text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 transform hover:scale-[1.02]"
      >
        INICIAR SESIÓN
      </button>

      {/* Enlace de inicio de sesión */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a href="#" className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  </div>
);
