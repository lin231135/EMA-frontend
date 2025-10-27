// src/translations/en/form/AdminMultiPaymentForm.js
export default {
  header: {
    title: "Register Payment",
    description: "Select a parent and classes to pay"
  },
  form: {
    parent: "Parent/Guardian",
    parent_select: "Select a parent",
    parent_loading: "Loading...",
    classes_title: "Pending Payment Classes",
    no_classes: "No pending payment classes for this parent",
    loading_classes: "Loading classes...",
    student_count_one: "student",
    student_count_many: "students",
    select_all: "Select all",
    deselect_all: "Deselect all",
    total_label: "Total to pay",
    class_one: "class",
    class_many: "classes",
    method: "Payment Method",
    date: "Payment Date",
    proof: "Payment Proof",
    proof_btn: "Upload Proof (JPG, PNG, PDF)",
    uploading: "Uploading...",
    proof_warning: "⚠ The file will be uploaded when confirming the payment",
    notes: "Notes",
    notes_placeholder: "Additional notes about the payment...",
  },
  methodOptions: {
    cash: "Cash",
    transfer: "Bank Transfer",
    deposit: "Deposit",
  },
  actions: {
    cancel: "Cancel",
    submit: "Register Payment",
    uploading_proof: "Uploading proof...",
    processing: "Processing..."
  },
  alerts: {
    select_parent: "Please select a parent",
    select_classes: "Please select at least one class to pay",
    select_date: "Please select a date",
    upload_error: "Error uploading proof:",
    load_parents_error: "Error loading parents list",
    load_classes_error: "Error loading pending classes"
  }
};
