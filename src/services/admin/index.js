// src/services/admin/index.js
/**
 * Índice de servicios del administrador
 * Exporta todos los servicios de administración para facilitar las importaciones
 */

// Servicios de estudiantes
export {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deactivateStudent,
  reactivateStudent,
  deleteStudent,
  getAvailableParents,
} from './adminStudentsService';

// Servicios de pagos
export {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  confirmPayment,
  rejectPayment,
} from './adminPaymentsService';
