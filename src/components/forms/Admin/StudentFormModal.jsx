// src/components/forms/Admin/StudentFormModal.jsx
import { useState, useEffect } from "react";
import { createStudent, updateStudent, getAvailableParents } from "../../../services/admin/adminStudentsService";

/**
 * Modal con formulario para crear o editar un estudiante
 * Modo 'create': Crea un nuevo estudiante
 * Modo 'edit': Edita un estudiante existente
 */
export default function StudentFormModal({ mode = 'create', studentData = null, isOpen, onClose, onSuccess }) {
  const isEditMode = mode === 'edit' && studentData;

  // Estados del formulario
  const [formData, setFormData] = useState({
    parent_id: '',
    name: '',
    birth_date: '',
    is_solvent: false,
    // Dirección (opcional)
    includeAddress: false,
    address: {
      city: '',
      apartment: '',
      street_avenue: '',
      zone: '',
      house_number: '',
      neighborhood: '',
      municipality: '',
      is_primary: true
    }
  });

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingParents, setLoadingParents] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Cargar padres disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadParents();
      if (isEditMode) {
        // Pre-llenar formulario en modo edición
        setFormData({
          parent_id: studentData.parent_id || '',
          name: studentData.name || '',
          birth_date: studentData.birth_date || '',
          is_solvent: studentData.is_solvent || false,
          includeAddress: false,
          address: {
            city: '',
            apartment: '',
            street_avenue: '',
            zone: '',
            house_number: '',
            neighborhood: '',
            municipality: '',
            is_primary: true
          }
        });
      }
    } else {
      // Limpiar formulario al cerrar
      resetForm();
    }
  }, [isOpen, studentData]);

  const loadParents = async () => {
    try {
      setLoadingParents(true);
      const data = await getAvailableParents();
      setParents(data);
    } catch (err) {
      // Continuar aunque falle
    } finally {
      setLoadingParents(false);
    }
  };

  const resetForm = () => {
    setFormData({
      parent_id: '',
      name: '',
      birth_date: '',
      is_solvent: false,
      includeAddress: false,
      address: {
        city: '',
        apartment: '',
        street_avenue: '',
        zone: '',
        house_number: '',
        neighborhood: '',
        municipality: '',
        is_primary: true
      }
    });
    setError(null);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log('🔄 Campo cambiado:', { name, value, type, checked });
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      const fieldValue = type === 'checkbox' ? checked : value;
      console.log('📍 Actualizando dirección:', addressField, '=', fieldValue);
      
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: fieldValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Limpiar error de validación del campo
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.birth_date) {
      errors.birth_date = 'La fecha de nacimiento es obligatoria';
    }

    if (!isEditMode && !formData.parent_id) {
      errors.parent_id = 'Debe seleccionar un padre';
    }

    // Validar dirección si está habilitada
    if (formData.includeAddress) {
      if (!formData.address.city.trim()) {
        errors['address.city'] = 'La ciudad es obligatoria';
      }
      if (!formData.address.street_avenue.trim()) {
        errors['address.street_avenue'] = 'La calle/avenida es obligatoria';
      }
      if (!formData.address.zone.trim()) {
        errors['address.zone'] = 'La zona es obligatoria';
      }
      if (!formData.address.house_number.trim()) {
        errors['address.house_number'] = 'El número de casa es obligatorio';
      }
      if (!formData.address.neighborhood.trim()) {
        errors['address.neighborhood'] = 'La colonia es obligatoria';
      }
      if (!formData.address.municipality.trim()) {
        errors['address.municipality'] = 'El municipio es obligatorio';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Formulario enviado. Modo:', mode);
    console.log('📝 Datos del formulario:', formData);
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const dataToSend = {
        name: formData.name.trim(),
        birth_date: formData.birth_date,
        is_solvent: formData.is_solvent
      };

      // En modo creación, parent_id es OBLIGATORIO
      if (!isEditMode) {
        const parentId = parseInt(formData.parent_id);
        if (isNaN(parentId)) {
          throw new Error('Parent ID inválido');
        }
        dataToSend.parent_id = parentId;
        console.log('✅ Parent ID agregado (crear):', parentId);
      } else if (formData.parent_id) {
        // En modo edición, solo incluir si se proporcionó
        const parentId = parseInt(formData.parent_id);
        if (!isNaN(parentId)) {
          dataToSend.parent_id = parentId;
          console.log('✅ Parent ID agregado (editar):', parentId);
        }
      }

      // Incluir dirección solo si está habilitada y es modo creación
      if (!isEditMode && formData.includeAddress) {
        dataToSend.address = {
          city: formData.address.city.trim(),
          apartment: formData.address.apartment.trim(),
          street_avenue: formData.address.street_avenue.trim(),
          zone: formData.address.zone.trim(),
          house_number: formData.address.house_number.trim(),
          neighborhood: formData.address.neighborhood.trim(),
          municipality: formData.address.municipality.trim(),
          is_primary: Boolean(formData.address.is_primary) // Forzar a boolean
        };
        console.log('✅ Dirección agregada:', dataToSend.address);
      }

      console.log('📤 Datos finales a enviar:', dataToSend);

      let result;
      if (isEditMode) {
        result = await updateStudent(studentData.id, dataToSend);
      } else {
        result = await createStudent(dataToSend);
      }

      console.log('✅ Estudiante guardado exitosamente:', result);

      // Notificar éxito
      if (onSuccess) {
        onSuccess(result);
      }

      // Cerrar modal
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
            </h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Mensaje de error general */}
            {error && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}

            {/* Campos obligatorios */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                Información Básica <span className="text-red-500">*</span>
              </h4>

              {/* Selector de Padre (solo en modo creación) */}
              {!isEditMode && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Padre/Tutor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleChange}
                    disabled={loadingParents || loading}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 ${
                      validationErrors.parent_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {loadingParents ? 'Cargando padres...' : 'Seleccionar padre'}
                    </option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} - {parent.email}
                      </option>
                    ))}
                  </select>
                  {validationErrors.parent_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.parent_id}
                    </p>
                  )}
                </div>
              )}

              {/* Nombre */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Ej: María Pérez"
                  className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 ${
                    validationErrors.birth_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.birth_date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.birth_date}
                  </p>
                )}
              </div>

              {/* Solvencia */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_solvent"
                  checked={formData.is_solvent}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Marcar como solvente (al día con pagos)
                </label>
              </div>
            </div>

            {/* Dirección (opcional, solo en modo creación) */}
            {!isEditMode && (
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeAddress"
                    checked={formData.includeAddress}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Agregar dirección (opcional)
                  </label>
                </div>

                {formData.includeAddress && (
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white border-l-4 border-cyan-500 pl-3">
                      Dirección
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ciudad */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Ciudad <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: Guatemala"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.city'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.city'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.city']}
                          </p>
                        )}
                      </div>

                      {/* Zona */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Zona <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.zone"
                          value={formData.address.zone}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: 10"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.zone'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.zone'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.zone']}
                          </p>
                        )}
                      </div>

                      {/* Calle/Avenida */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Calle/Avenida <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.street_avenue"
                          value={formData.address.street_avenue}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: 5ta Avenida"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.street_avenue'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.street_avenue'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.street_avenue']}
                          </p>
                        )}
                      </div>

                      {/* Número de Casa */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Número de Casa <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.house_number"
                          value={formData.address.house_number}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: 15-30"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.house_number'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.house_number'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.house_number']}
                          </p>
                        )}
                      </div>

                      {/* Apartamento */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Apartamento (opcional)
                        </label>
                        <input
                          type="text"
                          name="address.apartment"
                          value={formData.address.apartment}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: Apto 5-B"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                      </div>

                      {/* Colonia */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Colonia <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.neighborhood"
                          value={formData.address.neighborhood}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: Oakland"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.neighborhood'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.neighborhood'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.neighborhood']}
                          </p>
                        )}
                      </div>

                      {/* Municipio */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Municipio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address.municipality"
                          value={formData.address.municipality}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Ej: Guatemala"
                          className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                            validationErrors['address.municipality'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors['address.municipality'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationErrors['address.municipality']}
                          </p>
                        )}
                      </div>

                      {/* Dirección Principal */}
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="address.is_primary"
                            checked={formData.address.is_primary}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Marcar como dirección principal
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Estudiante'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
