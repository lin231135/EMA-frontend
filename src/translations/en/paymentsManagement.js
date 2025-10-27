// src/translations/en/paymentsManagement.js
export const paymentsManagement = {
  // Title and general
  title: "Payments Management",
  subtitle: "Process and confirm payments to maintain income control",
  loading: "Loading...",
  reload: "Reload",
  noPayments: "No registered payments",
  noResults: "No payments found with the applied filters",
  view: "View",
  confirm: "Confirm",
  reject: "Reject",

  // Payment states
  states: {
    pendiente: "Pending",
    en_revision: "Under Review",
    aceptado: "Accepted",
    rechazado: "Rejected",
    cancelado: "Cancelled",
  },

  // Payment methods
  methods: {
    efectivo: "Cash",
    transferencia: "Transfer",
    deposito: "Deposit",
  },

  // Table
  table: {
    id: "ID",
    parent: "Parent",
    students: "Students",
    method: "Method",
    total: "Total",
    date: "Date",
    state: "Status",
    actions: "Actions",
  },

  // Filters
  filters: {
    title: "Filters",
    searchPlaceholder: "Search by ID or parent name...",
    filterByState: "Filter by status",
    allStates: "All statuses",
    filterByMethod: "Filter by method",
    allMethods: "All methods",
    clearFilters: "Clear filters",
  },

  // Details modal
  detailsModal: {
    title: "Payment Details",
    loading: "Loading details...",
    error: "Error loading payment details",
    close: "Close",
    
    // Payment information
    paymentId: "Payment",
    createdAt: "Created",
    updatedAt: "Updated",
    paymentInfo: "Payment Information",
    method: "Payment method",
    date: "Payment date",
    total: "Total",
    
    // Parent information
    parentInfo: "Parent Information",
    parentName: "Name",
    parentEmail: "Email",
    
    // Payment items
    itemsInfo: "Students & Items",
    noItems: "No items associated with this payment",
    unknownItem: "Unknown item",
    noDescription: "No description",
    
    // Voucher
    voucher: "Payment Voucher",
    downloadVoucher: "Download voucher",
    
    // Notes
    notes: "Notes",
    userNote: "User Note",
    adminNote: "Administrative Note",
    
    // Action buttons
    confirm: "Confirm",
    reject: "Reject",
  },

  // Confirm modal
  confirmModal: {
    title: "Confirm Payment",
    warning: "Attention! This action is important",
    warningDetail: "By confirming this payment, the associated students will be automatically marked as SOLVENT (is_solvent = TRUE).",
    
    // Payment information
    paymentInfo: "Payment Information",
    paymentId: "Payment ID",
    parent: "Parent",
    total: "Total Amount",
    students: "Students",
    
    // Optional note
    noteLabel: "Note (Optional)",
    notePlaceholder: "Add a note about this confirmation...",
    noteHelp: "You can add additional notes about the payment confirmation.",
    
    // Buttons
    cancel: "Cancel",
    confirm: "Confirm",
    confirming: "Confirming...",
    
    // Messages
    error: "Error confirming payment",
    success: "Payment confirmed successfully",
  },

  // Reject modal
  rejectModal: {
    title: "Reject Payment",
    warning: "Attention! This action requires justification",
    warningDetail: "By rejecting this payment, the associated students will NOT be marked as solvent. You must provide a reason for rejection.",
    
    // Payment information
    paymentInfo: "Payment Information",
    paymentId: "Payment ID",
    parent: "Parent",
    total: "Total Amount",
    
    // REQUIRED reason
    reasonLabel: "Rejection Reason *",
    reasonPlaceholder: "Explain in detail why this payment is being rejected (minimum 10 characters)...\nExample: The voucher is not valid, the transfer is not reflected in the bank, etc.",
    reasonHelp: "* The reason is required (minimum 10 characters) and will be visible to the parent.",
    reasonRequired: "You must provide a reason to reject the payment (minimum 10 characters)",
    
    // Buttons
    cancel: "Cancel",
    reject: "Reject",
    rejecting: "Rejecting...",
    
    // Messages
    error: "Error rejecting payment",
    success: "Payment rejected successfully",
  },
};
