// src/pages/teacher/Materials.jsx
/**
 * @file Materials.jsx
 * @description Página principal de gestión de materiales educativos
 * 
 * Características:
 * - Listado de materiales en grid responsivo
 * - CRUD completo (Crear, Leer, Actualizar, Eliminar)
 * - Búsqueda y filtrado
 * - Modales para crear/editar/ver materiales
 * - Confirmación de eliminación
 * - Estados de carga y error
 * - Toast notifications personalizadas
 * - Dark mode y responsive
 * 
 * @author EMA Frontend Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { Button, TextInput, Spinner, Alert, Modal } from 'flowbite-react';
import { HiPlus, HiSearch, HiExclamationCircle } from 'react-icons/hi';

// Layout
import TeacherLayout from '../../layout/teacher/TeacherLayout';

// Componentes
import MaterialCard from './MaterialCard';
import MaterialFormModal from '../../forms/teacher/MaterialFormModal';
import MaterialViewModal from '../..//forms/teacher/MaterialViewModal';

// Servicios
import {
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../../../services/teacher/materialService';

/**
 * Componente ToastStack
 * Sistema de notificaciones tipo toast personalizado
 */
function ToastStack({ toasts, onClose }) {
  return (
    <div aria-live="polite" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
      <div className="w-full flex flex-col items-end space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-xs p-4 mb-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            role="alert"
          >
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg mr-3">
                {t.type === "success" && (
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                )}
                {t.type === "danger" && (
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                  </svg>
                )}
                {t.type === "warning" && (
                  <svg className="w-5 h-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-sm font-normal">{t.message}</div>
              <button
                onClick={() => onClose(t.id)}
                className="ms-3 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente principal Materials
 * 
 * Gestiona el CRUD completo de materiales educativos para maestros
 * 
 * @returns {JSX.Element} Página de gestión de materiales
 */
export default function Materials() {
  // ===== Estados =====
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Estados de modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Material seleccionado para editar/ver/eliminar
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Sistema de toasts
  const [toasts, setToasts] = useState([]);
  const TOAST_DURATION = 4500;

  /**
   * Agrega un nuevo toast
   */
  const addToast = (type, message, duration = TOAST_DURATION) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((s) => [...s, { id, type, message }]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, duration);
  };

  /**
   * Remueve un toast por ID
   */
  const removeToast = (id) => setToasts((s) => s.filter((x) => x.id !== id));

  // ===== Efectos =====

  /**
   * Carga inicial de materiales
   */
  useEffect(() => {
    loadMaterials();
  }, []);

  /**
   * Filtra materiales según el término de búsqueda
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMaterials(materials);
    } else {
      const filtered = materials.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMaterials(filtered);
    }
  }, [searchTerm, materials]);

  // ===== Funciones =====

  /**
   * Carga todos los materiales desde la API
   */
  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los materiales');
      addToast('danger', 'Error al cargar los materiales');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la creación de un nuevo material
   */
  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      const newMaterial = await createMaterial(formData);
      setMaterials(prev => [newMaterial, ...prev]);
      setShowFormModal(false);
      setSelectedMaterial(null);
      addToast('success', 'Material creado exitosamente');
    } catch (err) {
      addToast('danger', err.message || 'Error al crear el material');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la actualización de un material existente
   */
  const handleUpdate = async (formData) => {
    if (!selectedMaterial) return;

    try {
      setIsSubmitting(true);
      const updatedMaterial = await updateMaterial(selectedMaterial.id, formData);
      setMaterials(prev =>
        prev.map(m => (m.id === updatedMaterial.id ? updatedMaterial : m))
      );
      setShowFormModal(false);
      setSelectedMaterial(null);
      addToast('success', 'Material actualizado exitosamente');
    } catch (err) {
      addToast('danger', err.message || 'Error al actualizar el material');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la eliminación de un material
   */
  const handleDelete = async () => {
    if (!selectedMaterial) return;

    try {
      setIsSubmitting(true);
      await deleteMaterial(selectedMaterial.id);
      setMaterials(prev => prev.filter(m => m.id !== selectedMaterial.id));
      setShowDeleteModal(false);
      setSelectedMaterial(null);
      addToast('success', 'Material eliminado exitosamente');
    } catch (err) {
      addToast('danger', err.message || 'Error al eliminar el material');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Abre el modal de formulario para crear
   */
  const handleOpenCreateModal = () => {
    setSelectedMaterial(null);
    setShowFormModal(true);
  };

  /**
   * Abre el modal de formulario para editar
   */
  const handleOpenEditModal = (material) => {
    setSelectedMaterial(material);
    setShowFormModal(true);
  };

  /**
   * Abre el modal de visualización
   */
  const handleOpenViewModal = (material) => {
    setSelectedMaterial(material);
    setShowViewModal(true);
  };

  /**
   * Abre el modal de confirmación de eliminación
   */
  const handleOpenDeleteModal = (material) => {
    setSelectedMaterial(material);
    setShowDeleteModal(true);
  };

  // ===== Renderizado =====

  console.log({
    MaterialFormModal,
    MaterialViewModal,
    ToastStack
  });

  return (
    <TeacherLayout>
      <div className="p-4 md:p-6">
        {/* ===== Header ===== */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Materiales Educativos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gestiona los recursos y materiales para tus cursos
              </p>
            </div>

            <Button color="cyan" onClick={handleOpenCreateModal}>
              <HiPlus className="mr-2 h-5 w-5" />
              Nuevo Material
            </Button>
          </div>

          {/* ===== Barra de búsqueda ===== */}
          <div className="max-w-md">
            <TextInput
              icon={HiSearch}
              placeholder="Buscar materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ===== Contenido principal ===== */}
        {error && (
          <Alert color="failure" icon={HiExclamationCircle} className="mb-6">
            <span className="font-medium">Error:</span> {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Cargando materiales...
            </span>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm ? 'No se encontraron materiales' : 'No hay materiales'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer material educativo'}
            </p>
            {!searchTerm && (
              <Button color="cyan" onClick={handleOpenCreateModal} className="mt-6">
                <HiPlus className="mr-2 h-5 w-5" />
                Crear Material
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onView={handleOpenViewModal}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        )}

        {/* ===== Modales ===== */}

        {/* Modal de crear/editar */}
        <MaterialFormModal
          show={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedMaterial(null);
          }}
          onSubmit={selectedMaterial ? handleUpdate : handleCreate}
          material={selectedMaterial}
          isLoading={isSubmitting}
        />

        {/* Modal de visualización */}
        <MaterialViewModal
          show={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedMaterial(null);
          }}
          material={selectedMaterial}
        />

        {/* Modal de confirmación de eliminación */}
        <Modal
          show={showDeleteModal}
          size="md"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedMaterial(null);
          }}
        >
          <Modal.Header>Confirmar eliminación</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Estás seguro de que deseas eliminar el material{' '}
                <span className="font-semibold">"{selectedMaterial?.title}"</span>?
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 justify-center w-full">
              <Button
                color="failure"
                onClick={handleDelete}
                disabled={isSubmitting}
                isProcessing={isSubmitting}
              >
                Sí, eliminar
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMaterial(null);
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Sistema de Toasts */}
        <ToastStack toasts={toasts} onClose={removeToast} />
      </div>
    </TeacherLayout>
  );
}