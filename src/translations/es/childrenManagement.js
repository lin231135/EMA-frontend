// src/translations/es/childrenManagement.js

export default {
  // Títulos principales
  title: "Gestión de Hijos",
  subtitle: "Administra los perfiles vinculados a tu cuenta",

  // Secciones
  sections: {
    active: "Perfiles Activos",
    archived: "Perfiles Archivados",
  },

  // Botones
  buttons: {
    addChild: "Agregar Hijo",
    addFirstChild: "Agregar Primer Hijo",
    refresh: "Actualizar",
    restore: "Restaurar",
    archive: "Archivar",
    delete: "Eliminar",
    edit: "Editar",
  },

  // Tabla
  table: {
    name: "Nombre",
    birthDate: "Fecha de Nacimiento",
    age: "Edad",
    status: "Estado",
    actions: "Acciones",
  },

  // Badges
  badges: {
    solvent: "Solvente",
    notSolvent: "No Solvente",
    active: "Activo",
    archived: "Archivado",
  },

  // Modal: Agregar hijo
  addChildModal: {
    title: "Agregar Nuevo Hijo",
    nameLabel: "Nombre completo",
    namePlaceholder: "Ej: María Pérez",
    birthDateLabel: "Fecha de nacimiento",
    cancelButton: "Cancelar",
    createButton: "Crear Perfil",
    creatingButton: "Creando...",
  },

  // Modal: Confirmación
  confirmModal: {
    deleteTitle: "Eliminar Perfil",
    deleteMessage: "¿Estás seguro de que deseas eliminar este perfil? Esta acción no se puede deshacer.",
    deleteButton: "Eliminar",
    
    archiveTitle: "Archivar Perfil",
    archiveMessage: "¿Deseas archivar este perfil? Podrás restaurarlo más tarde.",
    archiveButton: "Archivar",
    
    restoreTitle: "Restaurar Perfil",
    restoreMessage: "¿Deseas restaurar este perfil archivado?",
    restoreButton: "Restaurar",
  },

  // Mensajes de estado vacío
  empty: {
    title: "No hay perfiles registrados",
    message: "Comienza agregando el perfil de tu primer hijo",
  },

  // Errores
  errors: {
    error: "Error",
    nameRequired: "El nombre debe tener al menos 2 caracteres",
    nameTooLong: "El nombre no puede exceder 255 caracteres",
    birthDateRequired: "La fecha de nacimiento es requerida",
    invalidDate: "Formato de fecha inválido",
    futureDate: "La fecha no puede ser futura",
    dateTooOld: "Fecha demasiado antigua",
    submitError: "Error al crear el perfil",
  },

  // Toast notifications
  toast: {
    childCreated: "Perfil creado exitosamente",
    childUpdated: "Perfil actualizado correctamente",
    childDeleted: "Perfil eliminado",
    childArchived: "Perfil archivado",
    childRestored: "Perfil restaurado",
    error: "Error en la operación",
  },
};
