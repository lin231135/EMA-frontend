// src/components/forms/teacher/MaterialViewModal.jsx
/**
 * @file MaterialViewModal.jsx
 * @description Modal para visualizar materiales en detalle
 * 
 * Características:
 * - Vista de imágenes en tamaño completo
 * - Reproductor de videos
 * - Vista previa de PDFs
 * - Descarga de archivos
 * - Información detallada del material
 * - Dark mode y responsive
 * 
 * @author EMA Frontend Team
 * @version 1.0.0
 */

import { Modal, Button, Badge } from 'flowbite-react';
import { HiDownload, HiExternalLink } from 'react-icons/hi';

/**
 * Renderiza el contenido del archivo según su tipo
 * 
 * @param {string} fileType - Tipo de archivo
 * @param {string} fileUrl - URL del archivo
 * @param {string} title - Título del material
 * @returns {JSX.Element} Componente de visualización
 */
const renderFileContent = (fileType, fileUrl, title) => {
  switch (fileType) {
    case 'image':
      return (
        <img
          src={fileUrl}
          alt={title}
          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
        />
      );
    
    case 'video':
      return (
        <video
          controls
          className="w-full h-auto max-h-[70vh] rounded-lg"
          src={fileUrl}
        >
          Tu navegador no soporta la reproducción de videos.
        </video>
      );
    
    default:
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <svg
            className="w-24 h-24 text-gray-400 dark:text-gray-500 mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vista previa no disponible
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Haz clic en "Abrir archivo" para verlo en una nueva pestaña
          </p>
        </div>
      );
  }
};

/**
 * Componente MaterialViewModal
 * 
 * Modal que muestra los detalles completos de un material educativo
 * con opciones de visualización y descarga
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback al cerrar el modal
 * @param {Object} props.material - Material a visualizar
 * @returns {JSX.Element} Modal de visualización
 */
export default function MaterialViewModal({ show, onClose, material }) {
  if (!material) return null;

  const { title, description, file_url, file_type } = material;

  /**
   * Maneja la descarga del archivo
   */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file_url;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Abre el archivo en una nueva pestaña
   */
  const handleOpenInNewTab = () => {
    window.open(file_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal show={show} onClose={onClose} size="5xl">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <span>{title}</span>
          <Badge color="info" size="sm">
            {file_type.toUpperCase()}
          </Badge>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          {/* ===== Visualización del archivo ===== */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {renderFileContent(file_type, file_url, title)}
          </div>

          {/* ===== Información del material ===== */}
          {description && (
            <div className="space-y-4">
              {/* Descripción */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-3 justify-between w-full">
          <Button color="gray" onClick={onClose}>
            Cerrar
          </Button>
          
          <div className="flex gap-3">
            <Button color="light" onClick={handleOpenInNewTab}>
              <HiExternalLink className="mr-2 h-5 w-5" />
              Abrir archivo
            </Button>
            
            <Button color="cyan" onClick={handleDownload}>
              <HiDownload className="mr-2 h-5 w-5" />
              Descargar
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}