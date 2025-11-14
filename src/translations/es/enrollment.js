const enrollment = {
  // EnrollmentStepper
  stepper: {
    course: "Curso",
    child: "Hijo",
    schedule: "Horario",
    payment: "Pago",
    confirm: "Confirmar",
  },

  // CourseSelectionGrid
  courseSelection: {
    loading: "Cargando cursos...",
    error: "Error:",
    noCourses: "No hay cursos activos disponibles por el momento.",
    removeSelection: "Quitar selección",
    continue: "Continuar",
  },

  // ChildSelectionCard
  childSelection: {
    selected: "Seleccionado",
    year: "año",
    years: "años",
    birthDate: "Nacimiento:",
  },

  // BookingSummaryCard
  summary: {
    date: "Fecha",
    schedule: "Horario",
    additionalNote: "Nota adicional",
    paymentMethod: "Método de pago",
    assignedStudent: "Estudiante asignado",
    capacity: "Cap.",
    modality: "Modalidad",
  },

  // CourseCard
  courseCard: {
    selectCourse: "Seleccionar curso",
    selected: "Seleccionado",
    capacity: "Cap.",
    spots: "cupos",
    spot: "cupo",
  },

  // ScheduleCard
  scheduleCard: {
    selected: "Seleccionado",
    clickToSelect: "Haz clic para seleccionar este horario",
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  },

  // WeekCalendarView & WeekNavigator
  calendar: {
    week: "Semana",
    today: "Hoy",
    previousWeek: "Semana anterior",
    nextWeek: "Semana siguiente",
    noSchedules: "No hay horarios disponibles para esta semana.",
    selectSchedule: "Selecciona un horario",
  },

  // ScheduleSelectedCard
  scheduleCard: {
    selectedSchedule: "Horario seleccionado",
    date: "Fecha",
    time: "Hora",
    change: "Cambiar",
  },

  // NoteInput
  noteInput: {
    label: "Nota para la reserva (opcional)",
    placeholder: "Ej. Prefiero este horario por disponibilidad de transporte...",
    maxLength: "Puedes agregar cualquier información adicional que consideres relevante para tu inscripción.",
  },

  // PaymentMethodCard
  paymentMethod: {
    selected: "Seleccionado",
    cash: "Efectivo",
    cashDescription: "Pago en efectivo en nuestras instalaciones",
    card: "Tarjeta",
    cardDescription: "Pago con tarjeta de crédito o débito",
    transfer: "Transferencia",
    transferDescription: "Transferencia bancaria directa",
  },

  // General
  general: {
    back: "Atrás",
    next: "Siguiente",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
  },

  // Páginas de enrollment
  pages: {
    // Enrollment.jsx (Paso 1)
    enrollment: {
      title: "Inscripción",
      step1Title: "Paso 1: Selecciona un curso",
      step1Description: "elige el curso al que deseas inscribirte.",
      parent: "Padre",
      student: "Estudiante",
      user: "Usuario",
      loginRequired: "Debes iniciar sesión para ver los cursos disponibles",
    },

    // EnrollmentChild.jsx (Paso 2)
    child: {
      title: "Inscripción",
      step2Title: "Paso 2: Selecciona al estudiante",
      step2Description: "elige a cuál de tus hijos deseas inscribir en",
      noDataWarning: "No se encontraron datos del curso. Por favor vuelve al paso anterior.",
      backButton: "Regresar",
      noChildren: "No tienes hijos registrados",
      noChildrenDescription: "Debes agregar al menos un hijo para poder inscribirlo en un curso. Ve a tu perfil para gestionar los perfiles de tus hijos.",
      goToProfile: "Ir al perfil",
      importantInfo: "Información importante",
      importantInfoDescription: "La inscripción se realizará a nombre del hijo seleccionado. En el siguiente paso podrás elegir el horario que mejor se ajuste a sus necesidades.",
      reviewSelection: "Revisa tu selección antes de continuar",
      selectChild: "Selecciona un hijo para continuar",
      continueToSchedules: "Continuar a horarios",
    },

    // EnrollmentSchedule.jsx (Paso 2/3)
    schedule: {
      title: "Inscripción",
      step2Title: "Paso 2: Elige un horario",
      step3Title: "Paso 3: Elige un horario",
      description: "Horarios disponibles para",
      chooseSchedule: "elige un horario para",
      noSchedules: "No hay horarios disponibles por el momento.",
      reviewSelection: "Revisa tu selección antes de continuar",
      selectSchedule: "Selecciona un horario para continuar",
      continueToPayment: "Continuar a método de pago",
    },

    // EnrollmentPayment.jsx (Paso 3/4)
    payment: {
      title: "Inscripción",
      step3Title: "Paso 3: Selecciona el método de pago",
      step4Title: "Paso 4: Selecciona el método de pago",
      description: "elige cómo deseas realizar el pago de",
      noDataWarning: "No se encontraron datos para mostrar. Por favor vuelve al paso anterior.",
      importantInfo: "Información importante",
      importantInfoDescription: "Tu reserva quedará confirmada una vez que se verifique el pago. Estarás recibiendo un mensaje.",
      reviewSelection: "Revisa tu selección antes de continuar",
      selectPaymentMethod: "Selecciona un método de pago para continuar",
      continueToSummary: "Continuar al resumen",
      // Métodos de pago
      cash: "Efectivo",
      cashDescription: "Pago en efectivo en las instalaciones",
      transfer: "Transferencia Bancaria",
      transferDescription: "Transferencia electrónica a cuenta bancaria",
      deposit: "Depósito Bancario",
      depositDescription: "Depósito en ventanilla o cajero automático",
    },

    // EnrollmentConfirm.jsx (Paso 4/5)
    confirm: {
      title: "Inscripción",
      step4Title: "Paso 4: Confirmar inscripción",
      step5Title: "Paso 5: Confirmar inscripción",
      noDataWarning: "No se encontraron datos para mostrar. Por favor vuelve al paso anterior.",
      errorLabel: "Error:",
      successLabel: "¡Éxito!",
      successMessage: "Reserva creada exitosamente.",
      bookingCode: "Código de reserva:",
      backButton: "Regresar",
      processing: "Procesando...",
      confirmed: "Confirmado",
      confirmBooking: "Confirmar reserva",
    },
  },
};

export default enrollment;
