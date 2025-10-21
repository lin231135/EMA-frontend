// src/translations/es/form/PaymentForm.js
export default {
  header: { breadcrumb: "Pagos /", title: "Nuevo pago", back: "Volver" },
  form: {
    currencySymbol: "Q",
    studentName: "Estudiante",
    student_select_ph: "Selecciona un estudiante",
    studentName_ph: "Nombre del estudiante",
    parentName: "Padre/Encargado",
    parentName_ph: "Nombre del padre o encargado",
    method: "Método de pago",
    date: "Fecha de pago",
    total: "Total",
    total_ph: "0.00",
    proof: "Comprobante",
    proof_btn: "Subir comprobante",
    selected: "Seleccionado:",
    notes: "Notas",
    notes_ph: "Agregar una nota (opcional)",
  },
  methodOptions: {
    cash: "Efectivo",
    transfer: "Transferencia",
    deposit: "Depósito",
  },
  actions: { 
    cancel: "Cancelar", 
    submit: "Enviar Pago",
    submitting: "Procesando..."
  },
  alerts: { 
    required: "Por favor completa el nombre del estudiante.",
    dateRequired: "Por favor selecciona una fecha.",
    invalidAmount: "Por favor ingresa un monto válido mayor a 0."
  },
};
