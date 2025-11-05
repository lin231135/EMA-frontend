// src/components/ui/ProfileImageUpload.jsx
import { useState, useRef } from "react";
import { Spinner } from "flowbite-react";
import { HiCamera, HiTrash } from "react-icons/hi";

/**
 * Componente para subir y gestionar imagen de perfil
 * Versión MODAL: Foto grande + botones de acción solo con iconos
 */
export default function ProfileImageUpload({
  currentImage,
  userName = "Usuario",
  onUpload,
  onDelete,
  isLoading = false,
  translations = {},
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const t = {
    changePhoto: translations.changePhoto || "Cambiar foto",
    deletePhoto: translations.deletePhoto || "Eliminar foto",
    uploadPhoto: translations.uploadPhoto || "Subir foto",
    maxSize: translations.maxSize || "Máx. 5MB (JPG, PNG, WEBP, GIF)",
    confirmDelete: translations.confirmDelete || "¿Estás seguro de que deseas eliminar tu foto de perfil?",
    invalidType: translations.invalidType || "Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG, WEBP o GIF.",
    tooLarge: translations.tooLarge || "El archivo es demasiado grande. Tamaño máximo: 5MB",
    ...translations,
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert(t.invalidType);
      return;
    }

    if (file.size > maxSize) {
      alert(t.tooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleDeleteClick = () => {
    if (window.confirm(t.confirmDelete)) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onDelete();
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || currentImage;
  const hasImage = Boolean(displayImage);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar grande para el modal */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-4 ring-gray-200 dark:ring-gray-600">
          {displayImage ? (
            <img
              src={displayImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Overlay hover */}
        {!isLoading && (
          <button
            onClick={handleChangeClick}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label={hasImage ? t.changePhoto : t.uploadPhoto}
          >
            <HiCamera className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Spinner size="lg" />
          </div>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      {/* Botones solo con iconos */}
      <div className="flex gap-2">
        <button
          onClick={handleChangeClick}
          disabled={isLoading}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={hasImage ? t.changePhoto : t.uploadPhoto}
        >
          <HiCamera className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        {hasImage && !isLoading && (
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
            title={t.deletePhoto}
          >
            <HiTrash className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        )}
      </div>

      {/* Texto informativo de formatos */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {t.maxSize}
      </p>
    </div>
  );
}