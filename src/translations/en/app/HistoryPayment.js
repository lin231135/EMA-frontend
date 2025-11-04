// src/translations/en/app/HistoryPayment.js
export default {
  title: "Payment History",
  search: "Search...",
  searchPlaceholder: "Search by serial number, description, month or year",
  noResults: "No payments found",
  noPayments: "No payments registered",
  loading: "Loading history...",
  error: "Error loading payment history",
  
  // Filters
  filters: {
    allChildren: "All children",
    selectChild: "Select child",
    filterByChild: "Filter by child:",
    loadingChildren: "Loading children...",
  },
  
  // Search
  search: {
    placeholder: "Search by serial number, description, month or year",
    noResults: "No results found",
  },
  
  // Table
  table: {
    serialNumber: "Serial No.",
    description: "Description",
    month: "Month",
    year: "Year",
    total: "Total",
    status: "Status",
    actions: "Actions",
  },

  // Fallback for compatibility
  tableHeaders: {
    serialNumber: "Serial No.",
    description: "Description",
    monthPaid: "Month",
    year: "Year",
    totalCost: "Total",
  },
  
  // Payment states
  states: {
    pendiente: "Pending",
    "en revision": "Under Review",
    "en_revision": "Under Review",
    aceptado: "Accepted",
    rechazado: "Rejected",
    cancelado: "Cancelled",
  },
  
  // Action buttons
  viewDetails: "View Details",
  print: "Print",
  
  // Pagination
  pagination: {
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    previous: "Previous",
    next: "Next",
    page: "Page",
  },
  
  // Totals
  totals: {
    title: "Totals",
    filtered: "Filtered total:",
    all: "Grand total:",
  },
  
  // Invoice/Print
  invoice: {
    title: "INVOICE - ELLIES MUSIC ACADEMY",
    from: "From",
    to: "To",
    company: {
      name: "Ellies Music Academy",
      address: "Guatemala, Guatemala\nZone 10",
    },
    client: {
      name: "Client",
      address: "Client address",
    },
    clientInfo: "Client Information",
    name: "Name",
    address: "Address",
    date: "Issue date",
    paymentHistory: "Payment History",
    footer: "Thank you for your trust",
  },
  
  // Translated months
  months: {
    January: "January",
    February: "February",
    March: "March",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "August",
    September: "September",
    October: "October",
    November: "November",
    December: "December",
  },

  // Details Modal
  modal: {
    titleD: "Payment Details",
    close: "Close",
    status: "Payment Status",
    paymentInfo: "Payment Information",
    description: "Description",
    amount: "Amount",
    month: "Month",
    year: "Year",
    paymentMethod: "Payment Method",
    receipt: "Payment Receipt",
    pdfDocument: "PDF Document",
    viewDownloadPdf: "View/Download PDF",
    imageLoadError: "Could not load image",
    notes: "Notes",
    parentNote: "Parent Note",
    adminNote: "Admin Note",
    rejectionReason: "Rejection Reason",
    actionRequired: "Action required:",
    rejectionMessage: "Review the rejection reason and resubmit the payment with the correct information.",
    paymentMethods: {
      transferencia: "Transfer",
      deposito: "Deposit",
      efectivo: "Cash",
    },
  },
};
