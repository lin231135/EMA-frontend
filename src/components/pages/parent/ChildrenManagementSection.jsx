// src/components/pages/parent/ChildrenManagementSection.jsx

/**
 * @fileoverview Sección de gestión de perfiles de hijos vinculados a un padre.
 * Se integra dentro de la página Profile.jsx y solo es visible para usuarios con rol "padre".
 * Permite crear, ver, editar, archivar y eliminar perfiles de estudiantes.
 */

import { useState, useMemo } from "react";
import { Button, Spinner, Badge, Card, Avatar } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import AddChildModal from "../../ui/modalProfile/AddChildModal";
import { useChildren } from "../../../hooks/useChildren";
import translations from "../../../translations";
import { HiUserAdd, HiArchive, HiRefresh, HiTrash } from "react-icons/hi";
import { EditIcon } from "../../ui/Icons";

/* =======================
   COMPONENTES AUXILIARES
   ======================= */

/**
 * Componente que muestra las iniciales de un nombre en un círculo.
 */
function CircleInitials({ name }) {
  const initials = useMemo(() => {
    if (!name) return "??";
    return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  }, [name]);

  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center">
      <span className="text-xl font-semibold cursor-default">{initials}</span>
    </div>
  );
}

/**
 * Tarjeta de perfil de hijo con opciones de gestión.
 */
function ChildCard({ child, onArchive, onRestore, onDelete, disabled }) {
  const age = calculateAge(child.birthDate);
  const isArchived = child.isActive === false;

  return (
    <Card className={`transition-all ${isArchived ? "opacity-60" : ""}`}>
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar o iniciales */}
        <div className="relative">
          {child.avatarUrl ? (
            <Avatar img={child.avatarUrl} rounded size="lg" />
          ) : (
            <CircleInitials name={child.name} />
          )}
        </div>

        {/* Información del hijo */}
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white cursor-default">
            {child.name}
          </h4>
          {age !== null && (
            <p className="text-sm text-gray-600 dark:text-gray-400 cursor-default">
              {age} años
            </p>
          )}
          {child.birthDate && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {formatDate(child.birthDate)}
            </p>
          )}
        </div>

        {/* Badge de estado */}
        {!isArchived && (
          <Badge color={child.isSolvent ? "success" : "warning"} className="w-fit cursor-default">
            {child.isSolvent ? "Solvente" : "No Solvente"}
          </Badge>
        )}
        
        {isArchived && (
          <Badge color="gray" className="w-fit cursor-default">
            ARCHIVADO
          </Badge>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2 w-full">
          {!isArchived ? (
            <>
              {/* TODO: Agregar funcionalidad de edición */}
              <Button
                size="xs"
                color="warning"
                onClick={() => onArchive(child)}
                disabled={disabled}
                className="flex-1 text-gray-900 dark:text-white cursor-pointer"
              >
                <HiArchive className="w-4 h-4 mr-1" />
                Archivar
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={() => onDelete(child)}
                disabled={disabled}
                className="flex-1 text-gray-900 dark:text-white cursor-pointer"
              >
                <HiTrash className="w-4 h-4 mr-1"/>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="xs"
                color="success"
                onClick={() => onRestore(child)}
                disabled={disabled}
                className="flex-1  text-gray-900 dark:text-white cursor-pointer"
              >
                <HiRefresh className="w-4 h-4 mr-1" />
                Restaurar
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={() => onDelete(child)}
                disabled={disabled}
                className="flex-1 text-gray-900 dark:text-white cursor-pointer"
              >
                <HiTrash className="w-4 h-4 mr-1"/>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Modal de confirmación para acciones destructivas.
 */
function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText, confirmColor = "failure", loading }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-gray-900/80"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button color="gray" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button color={confirmColor} onClick={onConfirm} disabled={loading}>
            {loading && <Spinner size="sm" className="mr-2" />}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Calcula la edad a partir de una fecha de nacimiento.
 */
function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Formatea una fecha en formato local.
 */
function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/* =======================
   COMPONENTE PRINCIPAL
   ======================= */

/**
 * Sección de gestión de perfiles de hijos.
 * Se integra dentro del componente Profile.jsx.
 * 
 * Características:
 * - Lista de hijos con información básica
 * - Creación de nuevos perfiles
 * - Edición de perfiles existentes
 * - Archivado/restauración de perfiles
 * - Eliminación de perfiles
 * 
 * @param {Function} addToast - Función para mostrar notificaciones toast (del componente padre)
 */
export default function ChildrenManagementSection({ addToast }) {
  const { lang } = useAuth();
  const t = translations[lang]?.childrenManagement || {};
  
  const {
    children,
    loading,
    error,
    operationLoading,
    addChild,
    deleteChild,
    archiveChild,
    restoreChild,
    refresh,
  } = useChildren();

  /* ==================
     ESTADO LOCAL
     ================== */
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    childId: null,
    childName: "",
  });

  /* ==================
     MANEJADORES
     ================== */
  
  /**
   * Maneja la creación de un nuevo hijo.
   */
  const handleAddChild = async (childData) => {
    try {
      await addChild(childData);
      addToast("success", t.toast?.childCreated || "Perfil creado exitosamente");
      setShowAddModal(false);
    } catch (err) {
      // El error ya se maneja en el modal
      throw err;
    }
  };

  /**
   * Abre el modal de confirmación para eliminar.
   */
  const openDeleteConfirm = (child) => {
    setConfirmModal({
      open: true,
      type: "delete",
      childId: child.id,
      childName: child.name,
    });
  };

  /**
   * Abre el modal de confirmación para archivar.
   */
  const openArchiveConfirm = (child) => {
    setConfirmModal({
      open: true,
      type: "archive",
      childId: child.id,
      childName: child.name,
    });
  };

  /**
   * Abre el modal de confirmación para restaurar.
   */
  const openRestoreConfirm = (child) => {
    setConfirmModal({
      open: true,
      type: "restore",
      childId: child.id,
      childName: child.name,
    });
  };

  /**
   * Maneja la confirmación de acciones.
   */
  const handleConfirm = async () => {
    const { type, childId, childName } = confirmModal;

    try {
      if (type === "delete") {
        await deleteChild(childId);
        addToast("success", t.toast?.childDeleted || `Perfil de ${childName} eliminado`);
      } else if (type === "archive") {
        await archiveChild(childId);
        addToast("success", t.toast?.childArchived || `Perfil de ${childName} archivado`);
      } else if (type === "restore") {
        await restoreChild(childId);
        addToast("success", t.toast?.childRestored || `Perfil de ${childName} restaurado`);
      }

      setConfirmModal({ open: false, type: null, childId: null, childName: "" });
    } catch (err) {
      addToast("danger", err.message || t.toast?.error || "Error en la operación");
    }
  };

  /* ==================
     RENDER
     ================== */
  return (
    <>
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            size="sm"
            color="gray"
            onClick={refresh}
            disabled={loading || operationLoading}
          >
            <HiRefresh className="w-4 h-4 mr-2" />
            {t.buttons?.refresh || "Actualizar"}
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300"
          >
            <HiUserAdd className="w-4 h-4 mr-2" />
            {t.buttons?.addChild || "Agregar Hijo"}
          </Button>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading inicial */}
      {loading && children.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="xl" />
        </div>
      )}

      {/* Grid de hijos */}
      {!loading && children.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            {t.sections?.active || "Perfiles Activos"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onArchive={openArchiveConfirm}
                onRestore={openRestoreConfirm}
                onDelete={openDeleteConfirm}
                disabled={operationLoading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && children.length === 0 && (
        <div className="text-center py-8">
          <HiUserAdd className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            {t.empty?.title || "No hay perfiles registrados"}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t.empty?.message || "Comienza agregando el perfil de tu primer hijo"}
          </p>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <HiUserAdd className="w-4 h-4 mr-2" />
            {t.buttons?.addFirstChild || "Agregar Primer Hijo"}
          </Button>
        </div>
      )}

      {/* Modal: Agregar hijo */}
      <AddChildModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddChild}
      />

      {/* Modal: Confirmación */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: null, childId: null, childName: "" })}
        onConfirm={handleConfirm}
        title={
          confirmModal.type === "delete"
            ? (t.confirmModal?.deleteTitle || "Eliminar Perfil")
            : confirmModal.type === "archive"
            ? (t.confirmModal?.archiveTitle || "Archivar Perfil")
            : (t.confirmModal?.restoreTitle || "Restaurar Perfil")
        }
        message={
          confirmModal.type === "delete"
            ? (t.confirmModal?.deleteMessage || `¿Estás seguro de eliminar el perfil de ${confirmModal.childName}?`)
            : confirmModal.type === "archive"
            ? (t.confirmModal?.archiveMessage || `¿Deseas archivar el perfil de ${confirmModal.childName}?`)
            : (t.confirmModal?.restoreMessage || `¿Deseas restaurar el perfil de ${confirmModal.childName}?`)
        }
        confirmText={
          confirmModal.type === "delete"
            ? (t.confirmModal?.deleteButton || "Eliminar")
            : confirmModal.type === "archive"
            ? (t.confirmModal?.archiveButton || "Archivar")
            : (t.confirmModal?.restoreButton || "Restaurar")
        }
        confirmColor={confirmModal.type === "delete" ? "failure" : "warning"}
        loading={operationLoading}
      />
    </>
  );
}
