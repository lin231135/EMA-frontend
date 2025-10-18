// src/translations/es/admin/studentActionModals.js
export default {
  // Modal de Desactivación
  deactivate: {
    title: "Desactivar Estudiante",
    studentLabel: "Estudiante:",
    confirmQuestion: "¿Deseas desactivar a este estudiante?",
    actionTitle: "Esta acción:",
    actions: [
      "Marcará la cuenta como inactiva (is_active = false)",
      "El estudiante NO podrá inscribirse en nuevas clases",
      "Cancelará todas las clases activas del estudiante",
      "Agregará una nota explicativa",
      "NO eliminará el registro de la base de datos"
    ],
    reasonLabel: "Razón de desactivación (obligatorio)",
    reasonPlaceholder: "Ej: Estudiante dejó de asistir por problemas económicos",
    characterCount: "caracteres",
    cancelButton: "Cancelar",
    confirmButton: "Desactivar",
    loadingButton: "Desactivando...",
    errorLabel: "Error:"
  },

  // Modal de Reactivación
  reactivate: {
    title: "Reactivar Estudiante",
    studentLabel: "Estudiante:",
    confirmQuestion: "¿Deseas reactivar a este estudiante?",
    actionTitle: "Esta acción:",
    actions: [
      "Marcará la cuenta como activa (is_active = true)",
      "El estudiante podrá inscribirse en nuevas clases",
      "Agregará una nota explicativa",
      "NO restaurará automáticamente las clases canceladas"
    ],
    reasonLabel: "Razón de reactivación (opcional)",
    reasonPlaceholder: "Ej: Estudiante decidió continuar estudios",
    characterCount: "caracteres",
    cancelButton: "Cancelar",
    confirmButton: "Reactivar",
    loadingButton: "Reactivando...",
    errorLabel: "Error:"
  },

  // Modal de Eliminación
  delete: {
    title: "Eliminar Estudiante Permanentemente",
    warningTitle: "ADVERTENCIA",
    finalConfirmationTitle: "CONFIRMACIÓN FINAL",
    studentLabel: "Estudiante:",
    step1Question: '¿Estás seguro de ELIMINAR PERMANENTEMENTE a "{name}"?',
    step1WarningMessage: "Esta acción es IRREVERSIBLE y eliminará:",
    step1Actions: [
      "El registro del estudiante",
      "Todas sus reservas de clases",
      "Todas sus notas",
      "Sus asociaciones con direcciones",
      "Sus referencias en pagos"
    ],
    step1Recommendation: "💡 Recomendación: En lugar de eliminar, considera desactivar el estudiante para mantener el historial.",
    step2Question: "Esta es tu última oportunidad.",
    step2FinalQuestion: '¿REALMENTE deseas eliminar a "{name}" PERMANENTEMENTE?',
    step2Warning: "Esta acción no se puede deshacer y toda la información se perderá para siempre.",
    cancelButton: "Cancelar",
    continueButton: "Continuar",
    confirmButton: "Eliminar Permanentemente",
    loadingButton: "Eliminando...",
    errorLabel: "Error:"
  }
};
