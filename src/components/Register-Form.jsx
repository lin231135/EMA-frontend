import React, { useState } from 'react';

function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    prefijo: '',
    telefono: '',
    correo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    // Prefijo
    if (!formData.prefijo.trim()) {
        newErrors.prefijo = 'El prefijo es obligatorio';
    } else if (!/^\+\d{1,4}$/.test(formData.prefijo)) {
        newErrors.prefijo = 'Prefijo no válido (ejemplo: +502)';
    }
        // Teléfono
    if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{6,15}$/.test(formData.telefono)) {
        newErrors.telefono = 'Teléfono no válido';
    }
    
    if (!formData.correo) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correo)) {
      newErrors.correo = 'Correo no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log('Datos enviados:', formData);
        setIsSubmitting(false);
        setSuccessMessage('¡Registro exitoso! Bienvenido/a.');
        
        setTimeout(() => {
          setSuccessMessage('');
          setFormData({
            nombre: '',
            apellido: '',
            telefono: '',
            correo: '',
            password: '',
            confirmPassword: ''
          });
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-white">Formulario de Prueba</h1>
            <p className="text-indigo-200 mt-1">Regístrate para comenzar</p>
          </div>
          
          <div className="p-6">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>
                
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.apellido ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="prefijo" className="block text-sm font-medium text-gray-700 mb-1">
                        Prefijo
                    </label>
                    <input
                        id="prefijo"
                        name="prefijo"
                        type="text"
                        value={formData.prefijo}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.prefijo ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="+502"
                    />
                    {errors.prefijo && <p className="mt-1 text-sm text-red-600">{errors.prefijo}</p>}
                </div>
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                    </label>
                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.telefono ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="123456789"
                    />
                    {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                    </div>
                </div>
              
              <div className="mt-4">
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.correo ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="tu@email.com"
                />
                {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
              </div>
              
              
              
             
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium shadow-md ${
                  isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 transition duration-300'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </div>
                ) : 'Registrarse'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default RegisterForm;