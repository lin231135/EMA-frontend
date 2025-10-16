// src/translations/en/forms/PaymentForm.js
export default {
    header: {
      breadcrumb: "Payments >",
      title: "New Payment",
      back: "Back",
    },
    form: {
      studentName: "Student Name",
      studentName_ph: "Student name",
      parentName: "Parent Name",
      parentName_ph: "Parent name",
      method: "Payment Method",
      date: "Payment Date",
      total: "Total Payment",
      total_ph: "0000.00",
      proof: "Proof of Payment",
      proof_btn: "+ Add .jpg .png .pdf",
      selected: "Selected:",
      notes: "Notes",
      notes_ph: "Add optional information",
      currencySymbol: "Q",
    },
    methodOptions: {
      cash: "Cash",
      card: "Card",
      transfer: "Bank transfer",
      check: "Check",
    },
    statusOptions: {
      completed: "Completed",
      pending: "Pending",
      failed: "Failed",
    },
    actions: {
      cancel: "Cancel",
      submit: "+ Add New Payment",
    },
    alerts: {
      required:
        "Please complete Student name, Payment Date and Total Payment.",
    },
};
