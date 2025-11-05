// src/components/forms/teacher/MaterialFormModal.jsx
/**
 * @file MaterialFormModal.jsx
 * @description Modal para crear o editar materiales educativos
 * 
 * Características:
 * - Formulario con validación
 * - Upload de archivos con preview
 * - Soporte para imágenes, PDFs y videos
 * - Modo crear/editar
 * - Integración con Flowbite
 * - Dark mode y responsive
 * 
 * @author EMA Frontend Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea, FileInput, Alert } from 'flowbite-react';
import { HiX, HiUpload, HiPhotograph } from 'react-icons/hi';

/**
 * Componente MaterialFormModal
 * 
 * Modal que permite crear o editar un material educativo.
 * Incluye campos para título, descripción y archivo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback al cerrar el modal
 * @param {Function} props.onSubmit - Callback al enviar el formulario
 * @param {Object} props.material - Material a editar (null para crear nuevo)
 * @param {boolean} props.isLoading - Indica si está procesando la petición
 * @returns {JSX.Element} Modal de formulario
 */
export default function MaterialFormModal({ 
  show, 
  onClose, 
  onSubmit, 
  material = null,
  isLoading = false 
}) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    teacher_course_id: '1', // TODO: Obtener dinámicamente del contexto o props
    title: '',
    description: '',
    file: null
  });

  // Estado para preview del archivo
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);

  // Modo edición: cargar datos del material
  useEffect(() => {
    if (material) {
      setFormData({
        teacher_course_id: material.teacher_course_id || '1',
        title: material.title || '',
        description: material.description || '',
        file: null
      });
      setFilePreview(material.file_url || null);
    } else {
      resetForm();
    }
  }, [material]);

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = () => {
    setFormData({
      teacher_course_id: '1',
      title: '',
      description: '',
      file: null
    });
    setFilePreview(null);
    setError(null);
  };

  /**
   * Maneja cambios en los campos de texto
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja la selección de archivo
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({ ...prev, file: null }));
      setFilePreview(null);
      return;
    }

    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setError(null);

    // Generar preview para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!material && !formData.file) {
      setError('Debes seleccionar un archivo');
      return;
    }

    // Crear FormData para enviar
    const data = new FormData();
    data.append('teacher_course_id', formData.teacher_course_id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      await onSubmit(data);
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al guardar el material');
    }
  };

  /**
   * Cierra el modal y resetea el formulario
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose} size="2xl">
      <Modal.Header>
        {material ? 'Editar Material' : 'Crear Nuevo Material'}
      </Modal.Header>
      
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensaje de error */}
          {error && (
            <Alert color="failure" icon={HiX}>
              <span className="font-medium">Error:</span> {error}
            </Alert>
          )}

          {/* Campo: Título */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" value="Título *" />
            </div>
            <TextInput
              id="title"
              name="title"
              type="text"
              placeholder="Ej: Teoría Musical - Capítulo 1"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Campo: Descripción */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Descripción" />
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Breve descripción del material..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Campo: Archivo */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="file" value={material ? "Archivo (dejar vacío para mantener el actual)" : "Archivo *"} />
            </div>
            <FileInput
              id="file"
              name="file"
              accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileChange}
              disabled={isLoading}
              helperText="Formatos soportados: Imágenes, Videos, PDF, Word, PowerPoint. Máximo 10MB"
            />
          </div>

          {/* Preview del archivo */}
          {filePreview && (
            <div className="mt-4">
              <Label value="Vista previa" />
              <div className="mt-2 relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Material actual (solo en modo edición) */}
          {material && !formData.file && (
            <div className="mt-4">
              <Label value="Material actual" />
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <HiPhotograph className="w-8 h-8 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {material.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tipo: {material.file_type}
                    </p>
                  </div>
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 text-sm font-medium"
                  >
                    Ver archivo
                  </a>
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-3 justify-end w-full">
          <Button color="gray" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            color="cyan" 
            onClick={handleSubmit}
            disabled={isLoading}
            isProcessing={isLoading}
          >
            <HiUpload className="mr-2 h-5 w-5" />
            {material ? 'Actualizar' : 'Crear'} Material
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}