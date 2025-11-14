const enrollment = {
  // EnrollmentStepper
  stepper: {
    course: "Course",
    child: "Child",
    schedule: "Schedule",
    payment: "Payment",
    confirm: "Confirm",
  },

  // CourseSelectionGrid
  courseSelection: {
    loading: "Loading courses...",
    error: "Error:",
    noCourses: "No active courses available at the moment.",
    removeSelection: "Remove selection",
    continue: "Continue",
  },

  // ChildSelectionCard
  childSelection: {
    selected: "Selected",
    year: "year",
    years: "years",
    birthDate: "Birth date:",
  },

  // BookingSummaryCard
  summary: {
    date: "Date",
    schedule: "Schedule",
    additionalNote: "Additional note",
    paymentMethod: "Payment method",
    assignedStudent: "Assigned student",
    capacity: "Cap.",
    modality: "Modality",
  },

  // CourseCard
  courseCard: {
    selectCourse: "Select course",
    selected: "Selected",
    capacity: "Cap.",
    spots: "spots",
    spot: "spot",
  },

  // ScheduleCard
  scheduleCard: {
    selected: "Selected",
    clickToSelect: "Click to select this schedule",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  // WeekCalendarView & WeekNavigator
  calendar: {
    week: "Week",
    today: "Today",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    noSchedules: "No schedules available for this week.",
    selectSchedule: "Select a schedule",
  },

  // ScheduleSelectedCard
  scheduleCard: {
    selectedSchedule: "Selected schedule",
    date: "Date",
    time: "Time",
    change: "Change",
  },

  // NoteInput
  noteInput: {
    label: "Booking note (optional)",
    placeholder: "E.g. I prefer this schedule due to transportation availability...",
    maxLength: "You can add any additional information you consider relevant for your enrollment.",
  },

  // PaymentMethodCard
  paymentMethod: {
    selected: "Selected",
    cash: "Cash",
    cashDescription: "Cash payment at our facilities",
    card: "Card",
    cardDescription: "Credit or debit card payment",
    transfer: "Transfer",
    transferDescription: "Direct bank transfer",
  },

  // General
  general: {
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },

  // Enrollment pages
  pages: {
    // Enrollment.jsx (Step 1)
    enrollment: {
      title: "Enrollment",
      step1Title: "Step 1: Select a course",
      step1Description: "choose the course you want to enroll in.",
      parent: "Parent",
      student: "Student",
      user: "User",
      loginRequired: "You must log in to see available courses",
    },

    // EnrollmentChild.jsx (Step 2)
    child: {
      title: "Enrollment",
      step2Title: "Step 2: Select the student",
      step2Description: "choose which of your children you want to enroll in",
      noDataWarning: "Course data not found. Please return to the previous step.",
      backButton: "Go back",
      noChildren: "You have no registered children",
      noChildrenDescription: "You must add at least one child to enroll them in a course. Go to your profile to manage your children's profiles.",
      goToProfile: "Go to profile",
      importantInfo: "Important information",
      importantInfoDescription: "The enrollment will be made in the name of the selected child. In the next step you can choose the schedule that best suits their needs.",
      reviewSelection: "Review your selection before continuing",
      selectChild: "Select a child to continue",
      continueToSchedules: "Continue to schedules",
    },

    // EnrollmentSchedule.jsx (Step 2/3)
    schedule: {
      title: "Enrollment",
      step2Title: "Step 2: Choose a schedule",
      step3Title: "Step 3: Choose a schedule",
      description: "Available schedules for",
      chooseSchedule: "choose a schedule for",
      noSchedules: "No schedules available at the moment.",
      reviewSelection: "Review your selection before continuing",
      selectSchedule: "Select a schedule to continue",
      continueToPayment: "Continue to payment method",
    },

    // EnrollmentPayment.jsx (Step 3/4)
    payment: {
      title: "Enrollment",
      step3Title: "Step 3: Select payment method",
      step4Title: "Step 4: Select payment method",
      description: "choose how you want to make the payment for",
      noDataWarning: "No data found to display. Please return to the previous step.",
      importantInfo: "Important information",
      importantInfoDescription: "Your reservation will be confirmed once payment is verified. You will receive a message.",
      reviewSelection: "Review your selection before continuing",
      selectPaymentMethod: "Select a payment method to continue",
      continueToSummary: "Continue to summary",
      // Payment methods
      cash: "Cash",
      cashDescription: "Cash payment at our facilities",
      transfer: "Bank Transfer",
      transferDescription: "Electronic transfer to bank account",
      deposit: "Bank Deposit",
      depositDescription: "Deposit at branch or ATM",
    },

    // EnrollmentConfirm.jsx (Step 4/5)
    confirm: {
      title: "Enrollment",
      step4Title: "Step 4: Confirm enrollment",
      step5Title: "Step 5: Confirm enrollment",
      noDataWarning: "No data found to display. Please return to the previous step.",
      errorLabel: "Error:",
      successLabel: "Success!",
      successMessage: "Booking created successfully.",
      bookingCode: "Booking code:",
      backButton: "Go back",
      processing: "Processing...",
      confirmed: "Confirmed",
      confirmBooking: "Confirm booking",
    },
  },
};

export default enrollment;
