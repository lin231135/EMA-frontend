// src/translations/es/app/historyPayments.js
export default {
  title: "Historial de Pagos",
  tableHeaders: {
    serialNumber: "No. de Serie",
    description: "Descripción",
    monthPaid: "Mes Pagado",
    year: "Año",
    totalCost: "Costo Total",
    status: "Estado",
    actions: "Acciones"
  },
  status: {
    pendiente: "Pendiente",
    en_revision: "En Revisión",
    aceptado: "Aceptado",
    rechazado: "Rechazado",
    cancelado: "Cancelado"
  },
  viewDetails: "Ver Detalles",
  noPayments: "No hay pagos registrados",
  loadingPayments: "Cargando historial de pagos...", 
  search: {
    placeholder: "Buscar pagos...",
    noResults: "No se encontraron pagos que coincidan con tu búsqueda"
  },
  print: {
    button: "Imprimir",
    title: "Historial de Pagos - Impresión"
  },
  invoice: {
    from: "Factura De:",
    to: "Factura Para:",
    date: "Fecha de Factura:",
    dueDate: "Fecha de Vencimiento:",
    company: {
      name: "Ellie's Music Academy (EMA)",
      address: "19 Avenida \"A\" 4-39, Vista Hermosa 1,\nZona 15, Guatemala"
    },
    client: {
      name: "Cliente",
      address: "Ciudad de Guatemala"
    }
  },
  detailsModal: {
    title: "Detalles del Pago",
    close: "Cerrar",
    userNote: "Nota del Usuario",
    adminNote: "Nota Administrativa",
    noUserNote: "Sin notas del usuario",
    noAdminNote: "Sin notas administrativas",
    noNotes: "No hay notas para este pago"
  }
};
