// src/translations/es/paymentsManagement.js
export const paymentsManagement = {
  // Título y generales
  title: "Gestión de Pagos",
  subtitle: "Procesar y confirmar los pagos para llevar un control de ingresos",
  loading: "Cargando...",
  reload: "Recargar",
  noPayments: "No hay pagos registrados",
  noResults: "No se encontraron pagos con los filtros aplicados",
  view: "Ver",
  confirm: "Confirmar",
  reject: "Rechazar",

  // Estados de pago
  states: {
    pendiente: "Pendiente",
    en_revision: "En Revisión",
    aceptado: "Aceptado",
    rechazado: "Rechazado",
    cancelado: "Cancelado",
  },

  // Métodos de pago
  methods: {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    deposito: "Depósito",
  },

  // Tabla
  table: {
    id: "ID",
    parent: "Padre",
    students: "Estudiantes",
    method: "Método",
    total: "Total",
    date: "Fecha",
    state: "Estado",
    actions: "Acciones",
  },

  // Filtros
  filters: {
    title: "Filtros",
    searchPlaceholder: "Buscar por ID o nombre del padre...",
    filterByState: "Filtrar por estado",
    allStates: "Todos los estados",
    filterByMethod: "Filtrar por método",
    allMethods: "Todos los métodos",
    clearFilters: "Limpiar filtros",
  },

  // Modal de detalles
  detailsModal: {
    title: "Detalles del Pago",
    loading: "Cargando detalles...",
    error: "Error al cargar los detalles del pago",
    close: "Cerrar",
    
    // Información del pago
    paymentId: "Pago",
    createdAt: "Creado",
    updatedAt: "Actualizado",
    paymentInfo: "Información del Pago",
    method: "Método de pago",
    date: "Fecha de pago",
    total: "Total",
    
    // Información del padre
    parentInfo: "Información del Padre",
    parentName: "Nombre",
    parentEmail: "Correo electrónico",
    
    // Ítems del pago
    itemsInfo: "Estudiantes e Ítems",
    noItems: "No hay ítems asociados a este pago",
    unknownItem: "Item desconocido",
    noDescription: "Sin descripción",
    
    // Comprobante
    voucher: "Comprobante de Pago",
    downloadVoucher: "Descargar comprobante",
    
    // Notas
    notes: "Notas",
    userNote: "Nota del Usuario",
    adminNote: "Nota Administrativa",
    
    // Botones de acción
    confirm: "Confirmar",
    reject: "Rechazar",
  },

  // Modal de confirmación
  confirmModal: {
    title: "Confirmar Pago",
    warning: "¡Atención! Esta acción es importante",
    warningDetail: "Al confirmar este pago, los estudiantes asociados serán marcados automáticamente como SOLVENTES (is_solvent = TRUE).",
    
    // Información del pago
    paymentInfo: "Información del Pago",
    paymentId: "ID del Pago",
    parent: "Padre",
    total: "Monto Total",
    students: "Estudiantes",
    
    // Nota opcional
    noteLabel: "Nota (Opcional)",
    notePlaceholder: "Agregar una nota sobre esta confirmación...",
    noteHelp: "Puede agregar notas adicionales sobre la confirmación del pago.",
    
    // Botones
    cancel: "Cancelar",
    confirm: "Confirmar",
    confirming: "Confirmando...",
    
    // Mensajes
    error: "Error al confirmar el pago",
    success: "Pago confirmado exitosamente",
  },

  // Modal de rechazo
  rejectModal: {
    title: "Rechazar Pago",
    warning: "¡Atención! Esta acción requiere justificación",
    warningDetail: "Al rechazar este pago, los estudiantes asociados NO serán marcados como solventes. Debe proporcionar un motivo del rechazo.",
    
    // Información del pago
    paymentInfo: "Información del Pago",
    paymentId: "ID del Pago",
    parent: "Padre",
    total: "Monto Total",
    
    // Motivo OBLIGATORIO
    reasonLabel: "Motivo del Rechazo *",
    reasonPlaceholder: "Explique detalladamente por qué se rechaza este pago (mínimo 10 caracteres)...\nEjemplo: El comprobante no es válido, la transferencia no se refleja en el banco, etc.",
    reasonHelp: "* El motivo es obligatorio (mínimo 10 caracteres) y será visible para el padre.",
    reasonRequired: "Debe proporcionar un motivo para rechazar el pago (mínimo 10 caracteres)",
    
    // Botones
    cancel: "Cancelar",
    reject: "Rechazar",
    rejecting: "Rechazando...",
    
    // Mensajes
    error: "Error al rechazar el pago",
    success: "Pago rechazado exitosamente",
  },
};
