// src/translations/en/form/ParentMultiPaymentForm.js
export default {
  header: {
    title: "Make Payment",
    description: "Select the classes you want to pay for"
  },
  form: {
    classes_title: "Pending Payment Classes",
    no_classes: "All caught up! You have no pending payment classes.",
    no_classes_subtitle: "Pending classes will appear here when available",
    loading_classes: "Loading classes...",
    student_count_one: "child",
    student_count_many: "children",
    select_all: "Select all",
    deselect_all: "Deselect all",
    total_label: "Total to pay",
    class_one: "class",
    class_many: "classes",
    method: "Payment Method",
    method_info: "Only bank transfer or deposit available",
    date: "Payment Date",
    proof: "Payment Proof",
    proof_required_notice: "⚠️ Uploading payment proof is mandatory",
    proof_btn: "Upload Proof (JPG, PNG, PDF)",
    uploading: "Uploading...",
    file_selected: "File selected",
    notes: "Notes (optional)",
    notes_placeholder: "Additional information about the payment...",
    review_notice: "Your payment will be reviewed by the administrator. You will receive confirmation once approved."
  },
  methodOptions: {
    transfer: "Bank Transfer",
    deposit: "Deposit",
  },
  actions: {
    cancel: "Cancel",
    submit: "Submit Payment",
    uploading_proof: "Uploading proof...",
    processing: "Processing..."
  },
  alerts: {
    select_classes: "Please select at least one class to pay",
    select_date: "Please select a date",
    proof_required: "You must upload payment proof (transfer or deposit)",
    upload_error: "Error uploading proof:",
    load_classes_error: "Error loading pending classes"
  }
};
