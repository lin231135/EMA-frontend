// src/translations/en/admin/studentActionModals.js
export default {
  // Deactivation Modal
  deactivate: {
    title: "Deactivate Student",
    studentLabel: "Student:",
    confirmQuestion: "Do you want to deactivate this student?",
    actionTitle: "This action will:",
    actions: [
      "Mark the account as inactive (is_active = false)",
      "The student will NOT be able to enroll in new classes",
      "Cancel all active classes for the student",
      "Add an explanatory note",
      "NOT delete the record from the database"
    ],
    reasonLabel: "Reason for deactivation (required)",
    reasonPlaceholder: "E.g., Student stopped attending due to financial issues",
    characterCount: "characters",
    cancelButton: "Cancel",
    confirmButton: "Deactivate",
    loadingButton: "Deactivating...",
    errorLabel: "Error:"
  },

  // Reactivation Modal
  reactivate: {
    title: "Reactivate Student",
    studentLabel: "Student:",
    confirmQuestion: "Do you want to reactivate this student?",
    actionTitle: "This action will:",
    actions: [
      "Mark the account as active (is_active = true)",
      "The student will be able to enroll in new classes",
      "Add an explanatory note",
      "NOT automatically restore cancelled classes"
    ],
    reasonLabel: "Reason for reactivation (optional)",
    reasonPlaceholder: "E.g., Student decided to continue studies",
    characterCount: "characters",
    cancelButton: "Cancel",
    confirmButton: "Reactivate",
    loadingButton: "Reactivating...",
    errorLabel: "Error:"
  },

  // Delete Modal
  delete: {
    title: "Permanently Delete Student",
    warningTitle: "WARNING",
    finalConfirmationTitle: "FINAL CONFIRMATION",
    studentLabel: "Student:",
    step1Question: 'Are you sure you want to PERMANENTLY DELETE "{name}"?',
    step1WarningMessage: "This action is IRREVERSIBLE and will delete:",
    step1Actions: [
      "The student record",
      "All class reservations",
      "All notes",
      "Address associations",
      "Payment references"
    ],
    step1Recommendation: "💡 Recommendation: Instead of deleting, consider deactivating the student to maintain history.",
    step2Question: "This is your last chance.",
    step2FinalQuestion: 'Do you REALLY want to delete "{name}" PERMANENTLY?',
    step2Warning: "This action cannot be undone and all information will be lost forever.",
    cancelButton: "Cancel",
    continueButton: "Continue",
    confirmButton: "Permanently Delete",
    loadingButton: "Deleting...",
    errorLabel: "Error:"
  }
};
