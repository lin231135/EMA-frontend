// src/translations/es/app/HistoryPayment.js
export default {
  title: "Historial de Pagos",
  search: "Buscar...",
  searchPlaceholder: "Buscar por N° de serie, descripción, mes o año",
  noResults: "No se encontraron pagos",
  noPayments: "No hay pagos registrados",
  loading: "Cargando historial...",
  error: "Error al cargar el historial de pagos",
  
  // Filtros
  filters: {
    allChildren: "Todos los hijos",
    selectChild: "Seleccionar hijo",
    filterByChild: "Filtrar por hijo:",
    loadingChildren: "Cargando hijos...",
  },
  
  // Búsqueda
  search: {
    placeholder: "Buscar por N° de serie, descripción, mes o año",
    noResults: "No se encontraron resultados",
  },
  
  // Tabla
  table: {
    serialNumber: "N° de Serie",
    description: "Descripción",
    month: "Mes",
    year: "Año",
    total: "Total",
    status: "Estado",
    actions: "Acciones",
  },

  // Fallback para compatibilidad
  tableHeaders: {
    serialNumber: "N° de Serie",
    description: "Descripción",
    monthPaid: "Mes",
    year: "Año",
    totalCost: "Total",
  },
  
  // Estados de pago
  states: {
    pendiente: "Pendiente",
    "en revision": "En Revisión",
    "en_revision": "En Revisión",
    aceptado: "Aceptado",
    rechazado: "Rechazado",
    cancelado: "Cancelado",
  },
  
  // Botones de acción
  viewDetails: "Ver Detalles",
  print: "Imprimir",
  
  // Paginación
  pagination: {
    showing: "Mostrando",
    to: "a",
    of: "de",
    results: "resultados",
    previous: "Anterior",
    next: "Siguiente",
    page: "Página",
  },
  
  // Totales
  totals: {
    title: "Totales",
    filtered: "Total filtrado:",
    all: "Total general:",
  },
  
  // Factura/Impresión
  invoice: {
    title: "FACTURA - ELLIES MUSIC ACADEMY",
    from: "De",
    to: "Para",
    company: {
      name: "Ellies Music Academy",
      address: "Guatemala, Guatemala\nZona 10",
    },
    client: {
      name: "Cliente",
      address: "Dirección del cliente",
    },
    clientInfo: "Información del Cliente",
    name: "Nombre",
    address: "Dirección",
    date: "Fecha de emisión",
    paymentHistory: "Historial de Pagos",
    footer: "Gracias por su confianza",
  },
  
  // Meses traducidos
  months: {
    January: "Enero",
    February: "Febrero",
    March: "Marzo",
    April: "Abril",
    May: "Mayo",
    June: "Junio",
    July: "Julio",
    August: "Agosto",
    September: "Septiembre",
    October: "Octubre",
    November: "Noviembre",
    December: "Diciembre",
  },

  // Modal de Detalles
  modal: {
    titleD: "Detalles del Pago",
    close: "Cerrar",
    status: "Estado del Pago",
    paymentInfo: "Información del Pago",
    description: "Descripción",
    amount: "Monto",
    month: "Mes",
    year: "Año",
    paymentMethod: "Método de Pago",
    receipt: "Comprobante de Pago",
    pdfDocument: "Documento PDF",
    viewDownloadPdf: "Ver/Descargar PDF",
    imageLoadError: "No se pudo cargar la imagen",
    notes: "Notas",
    parentNote: "Nota del Padre",
    adminNote: "Nota del Admin",
    rejectionReason: "Motivo del Rechazo",
    actionRequired: "Acción requerida:",
    rejectionMessage: "Revisa el motivo del rechazo y vuelve a realizar el pago con la información correcta.",
    paymentMethods: {
      transferencia: "Transferencia",
      deposito: "Depósito",
      efectivo: "Efectivo",
    },
  },
};
