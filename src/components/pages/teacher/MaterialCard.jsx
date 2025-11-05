// src/components/teacher/materials/MaterialCard.jsx
/**
 * @file MaterialCard.jsx
 * @description Tarjeta visual para mostrar un material educativo
 * 
 * Características:
 * - Vista previa según tipo de archivo (imagen, PDF, video)
 * - Información del material (título, descripción)
 * - Acciones: Ver, Editar, Eliminar
 * - Diseño responsivo con dark mode
 * - Integración con Flowbite
 * 
 * @author EMA Frontend Team
 * @version 1.0.0
 */

import { Card, Button, Badge } from 'flowbite-react';
import { HiEye, HiPencil, HiTrash, HiDocumentText, HiFilm, HiPhotograph } from 'react-icons/hi';

/**
 * Obtiene el icono correspondiente según el tipo de archivo
 * 
 * @param {string} fileType - Tipo de archivo (image, video, raw)
 * @returns {JSX.Element} Componente de icono
 */
const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'image':
      return <HiPhotograph className="w-8 h-8" />;
    case 'video':
      return <HiFilm className="w-8 h-8" />;
    default:
      return <HiDocumentText className="w-8 h-8" />;
  }
};

/**
 * Obtiene el color del badge según el tipo de archivo
 * 
 * @param {string} fileType - Tipo de archivo
 * @returns {string} Color del badge
 */
const getFileTypeBadgeColor = (fileType) => {
  switch (fileType) {
    case 'image':
      return 'success';
    case 'video':
      return 'purple';
    default:
      return 'info';
  }
};

/**
 * Componente MaterialCard
 * 
 * Tarjeta que muestra la información de un material educativo con preview,
 * metadata y acciones disponibles
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.material - Objeto con datos del material
 * @param {Function} props.onView - Callback al ver el material
 * @param {Function} props.onEdit - Callback al editar el material
 * @param {Function} props.onDelete - Callback al eliminar el material
 * @returns {JSX.Element} Tarjeta del material
 */
export default function MaterialCard({ material, onView, onEdit, onDelete }) {
  const { id, title, description, file_url, file_type } = material;

  return (
    <Card className="max-w-sm hover:shadow-lg transition-shadow duration-300">
      {/* ===== Preview del archivo ===== */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
        {file_type === 'image' ? (
          <img
            src={file_url}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            {getFileIcon(file_type)}
          </div>
        )}
        
        {/* Badge con el tipo de archivo */}
        <div className="absolute top-2 right-2">
          <Badge color={getFileTypeBadgeColor(file_type)} size="sm">
            {file_type.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* ===== Información del material ===== */}
      <div className="flex-1">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h5>
        
        <p className="text-sm text-gray-700 dark:text-gray-400 mb-3 line-clamp-3 min-h-[3rem]">
          {description || 'Sin descripción'}
        </p>
      </div>

      {/* ===== Acciones ===== */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          color="gray"
          onClick={() => onView(material)}
          className="flex-1"
        >
          <HiEye className="mr-2 h-4 w-4" />
          Ver
        </Button>
        
        <Button
          size="sm"
          color="light"
          onClick={() => onEdit(material)}
          className="flex-1"
        >
          <HiPencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        
        <Button
          size="sm"
          color="failure"
          onClick={() => onDelete(material)}
        >
          <HiTrash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}


















