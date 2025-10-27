// src/translations/es/form/AdminMultiPaymentForm.js
export default {
  header: {
    title: "Registrar Pago",
    description: "Selecciona un padre y las clases a pagar"
  },
  form: {
    parent: "Padre/Encargado",
    parent_select: "Selecciona un padre",
    parent_loading: "Cargando...",
    classes_title: "Clases Pendientes de Pago",
    no_classes: "No hay clases pendientes de pago para este padre",
    loading_classes: "Cargando clases...",
    student_count_one: "estudiante",
    student_count_many: "estudiantes",
    select_all: "Seleccionar todas",
    deselect_all: "Deseleccionar todas",
    total_label: "Total a pagar",
    class_one: "clase",
    class_many: "clases",
    method: "Método de Pago",
    date: "Fecha de Pago",
    proof: "Comprobante de Pago",
    proof_btn: "Subir Comprobante (JPG, PNG, PDF)",
    uploading: "Subiendo...",
    proof_warning: "⚠ El archivo se subirá al confirmar el pago",
    notes: "Notas",
    notes_placeholder: "Notas adicionales sobre el pago...",
  },
  methodOptions: {
    cash: "Efectivo",
    transfer: "Transferencia",
    deposit: "Depósito",
  },
  actions: {
    cancel: "Cancelar",
    submit: "Registrar Pago",
    uploading_proof: "Subiendo comprobante...",
    processing: "Procesando..."
  },
  alerts: {
    select_parent: "Por favor selecciona un padre",
    select_classes: "Por favor selecciona al menos una clase para pagar",
    select_date: "Por favor selecciona una fecha",
    upload_error: "Error al subir el comprobante:",
    load_parents_error: "Error al cargar la lista de padres",
    load_classes_error: "Error al cargar las clases pendientes"
  }
};
