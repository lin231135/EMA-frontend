// src/translations/en/childrenManagement.js

export default {
  // Main titles
  title: "Children Management",
  subtitle: "Manage profiles linked to your account",

  // Sections
  sections: {
    active: "Active Profiles",
    archived: "Archived Profiles",
  },

  // Buttons
  buttons: {
    addChild: "Add Child",
    addFirstChild: "Add First Child",
    refresh: "Refresh",
    restore: "Restore",
    archive: "Archive",
    delete: "Delete",
    edit: "Edit",
  },

  // Table
  table: {
    name: "Name",
    birthDate: "Birth Date",
    age: "Age",
    status: "Status",
    actions: "Actions",
  },

  // Badges
  badges: {
    solvent: "Solvent",
    notSolvent: "Not Solvent",
    active: "Active",
    archived: "Archived",
  },

  // Modal: Add child
  addChildModal: {
    title: "Add New Child",
    nameLabel: "Full name",
    namePlaceholder: "e.g: María Pérez",
    birthDateLabel: "Birth date",
    cancelButton: "Cancel",
    createButton: "Create Profile",
    creatingButton: "Creating...",
  },

  // Modal: Update child's profile
  updateChildModal: {
    title: "Update Child's Profile",
    updateButton: "Update Profile",
    updatingButton: "Updating...",
  },

  // Modal: Confirmation
  confirmModal: {
    deleteTitle: "Delete Profile",
    deleteMessage: "Are you sure you want to delete this profile? This action cannot be undone.",
    deleteButton: "Delete",
    
    archiveTitle: "Archive Profile",
    archiveMessage: "Do you want to archive this profile? You can restore it later.",
    archiveButton: "Archive",
    
    restoreTitle: "Restore Profile",
    restoreMessage: "Do you want to restore this archived profile?",
    restoreButton: "Restore",
  },

  // Empty state messages
  empty: {
    title: "No profiles registered",
    message: "Start by adding your first child's profile",
  },

  // Errors
  errors: {
    error: "Error",
    nameRequired: "Name must be at least 2 characters long",
    nameTooLong: "Name cannot exceed 255 characters",
    birthDateRequired: "Birth date is required",
    invalidDate: "Invalid date format",
    futureDate: "Date cannot be in the future",
    dateTooOld: "Date is too old",
    submitError: "Error creating profile",
  },

  // Toast notifications
  toast: {
    childCreated: "Profile created successfully",
    childUpdated: "Profile updated successfully",
    childDeleted: "Profile deleted",
    childArchived: "Profile archived",
    childRestored: "Profile restored",
    error: "Operation error",
  },
};
