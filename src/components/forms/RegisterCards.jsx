import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../translations';

// Tarjeta de imagen
export const RegisterImageCard = () => {
  const { lang } = useAuth();
  const t = translations[lang].register;

  return (
    <div className="flex-1 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 relative shadow-2xl overflow-hidden rounded-lg">
      <img
        src="/imagen_registro.jpg"
        alt={t.altImage}
        className="object-cover w-full h-full opacity-90"
      />
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

// Tarjeta del formulario
export const RegisterFormCard = () => {
  const { lang } = useAuth();
  const t = { ...translations[lang].common, ...translations[lang].register };

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      fieldErrors.push(t.requiredField);
    }

    if (value.trim()) {
      if (rules.minLength && value.length < rules.minLength) {
        fieldErrors.push(t.minLength.replace('{minLength}', rules.minLength));
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        switch (name) {
          case 'nombre':
          case 'apellido':
            fieldErrors.push(t.onlyLetters);
            break;
          case 'telefono':
            fieldErrors.push(t.phoneLength);
            break;
          case 'email':
            fieldErrors.push(t.invalidEmail);
            break;
          case 'password':
            fieldErrors.push(t.passwordRequirements);
            break;
        }
      }

      if (rules.matchPassword && value !== formData.password) {
        fieldErrors.push(t.passwordsDoNotMatch);
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

    // Limpiar mensajes de éxito y error de API
    if (successMessage) setSuccessMessage('');
    if (errors.api) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.api;
        return newErrors;
      });
    }

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
    const hasErrors = Object.keys(errors).some(key => 
      key !== 'api' && errors[key] && errors[key].length > 0
    );
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled && !hasErrors);
  }, [formData, errors]);

  // Manejar envío del formulario con integración de API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateAllFields()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          last_name: formData.apellido,
          prefix: `+502`,
          phone: formData.telefono,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: 'padre'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message || t.unknownError });
      } else {
        setSuccessMessage(t.successMessage);
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          telefono: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Limpiar estados
        setTouched({});
        setErrors({});
      }
    } catch (err) {
      setErrors({ api: t.connectionError });
    } finally {
      setIsSubmitting(false);
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

  // Componente Alert de Flowbite para mensajes de éxito
  const SuccessAlert = () => {
    if (!successMessage) return null;
    
    return (
      <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-300" role="alert">
        <div className="flex items-center">
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">{t.success}</span>
          <div className="font-medium">
            {successMessage}
          </div>
        </div>
      </div>
    );
  };

  // Componente Alert de Flowbite para errores de API
  const ErrorAlert = () => {
    if (!errors.api) return null;
    
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-300" role="alert">
        <div className="flex items-center">
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">{t.error}</span>
          <div className="font-medium">
            {errors.api}
          </div>
        </div>
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
            alt={t.altLogo}
            className="w-30 h-30 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t.title}
        </h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Alertas de Flowbite */}
      <SuccessAlert />
      <ErrorAlert />

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Apellido en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {t.firstName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={t.firstNamePlaceholder}
              className={getInputClasses('nombre')}
              disabled={isSubmitting}
            />
            <ErrorMessage errors={errors.nombre} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {t.lastName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={t.lastNamePlaceholder}
              className={getInputClasses('apellido')}
              disabled={isSubmitting}
            />
            <ErrorMessage errors={errors.apellido} />
          </div>
        </div>

        {/* Prefijo + Teléfono */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {t.phone} <span className="text-red-500">*</span>
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
              placeholder={t.phonePlaceholder}
              className={`rounded-none rounded-r-lg ${getInputClasses('telefono').replace('rounded-lg', '')}`}
              disabled={isSubmitting}
            />
          </div>
          <ErrorMessage errors={errors.telefono} />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {t.email} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t.emailPlaceholder}
            className={getInputClasses('email')}
            disabled={isSubmitting}
          />
          <ErrorMessage errors={errors.email} />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {t.password} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t.passwordPlaceholder}
            className={getInputClasses('password')}
            disabled={isSubmitting}
          />
          <ErrorMessage errors={errors.password} />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {t.confirmPassword} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t.passwordPlaceholder}
            className={getInputClasses('confirmPassword')}
            disabled={isSubmitting}
          />
          <ErrorMessage errors={errors.confirmPassword} />
        </div>

        {/* Botón de registro */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 transform flex items-center justify-center ${
            isFormValid && !isSubmitting
              ? 'text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] cursor-pointer'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              {t.submittingButton}
            </>
          ) : (
            <>
              {isFormValid ? t.submitButton : t.fillFieldsButton}
            </>
          )}
        </button>

        {/* Enlace de inicio de sesión */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t.alreadyHaveAccount}{' '}
            <Link
              to="/login"
              className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
