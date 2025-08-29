import { useState, useEffect } from 'react';

// Tarjeta de imagen
export const RegisterImageCard = () => (
  <div className="flex-1 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 relative shadow-2xl overflow-hidden rounded-lg">
    <img
      src="/imagen_registro.jpg"
      alt="Registro"
      className="object-cover w-full h-full opacity-90"
    />
    <div className="absolute inset-0 bg-black opacity-30"></div>
  </div>
);

// Tarjeta del formulario
export const RegisterFormCard = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Reglas de validación
  const validationRules = {
    nombre: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    },
    apellido: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    },
    telefono: {
      required: true,
      pattern: /^\d{8}$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    confirmPassword: {
      required: true,
      matchPassword: true
    }
  };

  // Función para validar un campo específico
  const validateField = (name, value) => {
    const rules = validationRules[name];
    const fieldErrors = [];

    if (rules.required && !value.trim()) {
      fieldErrors.push('Este campo es obligatorio');
    }

    if (value.trim()) {
      if (rules.minLength && value.length < rules.minLength) {
        fieldErrors.push(`Debe tener al menos ${rules.minLength} caracteres`);
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        switch (name) {
          case 'nombre':
          case 'apellido':
            fieldErrors.push('Solo se permiten letras y espacios');
            break;
          case 'telefono':
            fieldErrors.push('Debe contener exactamente 8 dígitos');
            break;
          case 'email':
            fieldErrors.push('Ingresa un email válido');
            break;
          case 'password':
            fieldErrors.push('Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial');
            break;
        }
      }

      if (rules.matchPassword && value !== formData.password) {
        fieldErrors.push('Las contraseñas no coinciden');
      }
    }

    return fieldErrors;
  };

  // Validar todos los campos
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar campo en tiempo real si ya fue tocado
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors.length > 0 ? fieldErrors : undefined
      }));
    }
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors.length > 0 ? fieldErrors : undefined
    }));
  };

  // Verificar si el formulario es válido
  useEffect(() => {
    const hasErrors = Object.keys(errors).some(key => errors[key] && errors[key].length > 0);
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled && !hasErrors);
  }, [formData, errors]);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateAllFields()) {
      console.log('Formulario válido:', formData);
      // Aquí iría la lógica de registro
      
      // Mostrar mensaje de éxito (usando alert por simplicidad, en producción usarías un toast)
      alert('¡Registro exitoso!');
    }
  };

  // Función para obtener clases CSS según el estado del campo
  const getInputClasses = (fieldName) => {
    const baseClasses = "block w-full p-3 text-sm rounded-lg border transition-colors duration-200";
    
    if (errors[fieldName]) {
      return `${baseClasses} bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500`;
    }
    
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClasses} bg-green-50 border-green-500 text-green-900 focus:ring-green-500 focus:border-green-500`;
    }
    
    return `${baseClasses} bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500`;
  };

  // Componente para mostrar errores
  const ErrorMessage = ({ errors }) => {
    if (!errors || errors.length === 0) return null;
    
    return (
      <div className="mt-2">
        {errors.map((error, index) => (
          <p key={index} className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-[400px] bg-white p-12 shadow-2xl flex flex-col justify-center rounded-lg">
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

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Apellido en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Tu nombre"
              className={getInputClasses('nombre')}
            />
            <ErrorMessage errors={errors.nombre} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Tu apellido"
              className={getInputClasses('apellido')}
            />
            <ErrorMessage errors={errors.apellido} />
          </div>
        </div>

        {/* Prefijo + Teléfono */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Prefijo + Teléfono <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
              +502
            </span>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="12345678"
              className={`rounded-none rounded-r-lg ${getInputClasses('telefono').replace('rounded-lg', '')}`}
            />
          </div>
          <ErrorMessage errors={errors.telefono} />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="tu@gmail.com"
            className={getInputClasses('email')}
          />
          <ErrorMessage errors={errors.email} />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="••••••••••••"
            className={getInputClasses('password')}
          />
          <ErrorMessage errors={errors.password} />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Confirmar Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="••••••••••••"
            className={getInputClasses('confirmPassword')}
          />
          <ErrorMessage errors={errors.confirmPassword} />
        </div>

        {/* Botón de registro */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 transform ${
            isFormValid
              ? 'text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] cursor-pointer'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isFormValid ? 'INICIAR SESIÓN' : 'COMPLETA TODOS LOS CAMPOS'}
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
      </form>
    </div>
  );
};
