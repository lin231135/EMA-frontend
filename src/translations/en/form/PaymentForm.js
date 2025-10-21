// src/translations/en/form/PaymentForm.js
export default {
  header: { breadcrumb: "Payments /", title: "New payment", back: "Back" },
  form: {
    currencySymbol: "Q",
    studentName: "Student",
    student_select_ph: "Select a student",
    studentName_ph: "Student name",
    parentName: "Parent/Guardian",
    parentName_ph: "Parent or guardian",
    method: "Payment method",
    date: "Payment date",
    total: "Total",
    total_ph: "0.00",
    proof: "Proof",
    proof_btn: "Upload proof",
    selected: "Selected:",
    notes: "Notes",
    notes_ph: "Add a note (optional)",
  },
  methodOptions: {
    cash: "Cash",
    transfer: "Bank Transfer",
    deposit: "Deposit",
  },
  actions: { 
    cancel: "Cancel", 
    submit: "Submit Payment",
    submitting: "Processing..."
  },
  alerts: { 
    required: "Please enter the student's name.",
    dateRequired: "Please select a date.",
    invalidAmount: "Please enter a valid amount greater than 0."
  },
};
