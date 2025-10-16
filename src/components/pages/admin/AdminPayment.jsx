// src/components/pages/admin/AdminPayment.jsx
/**
 * Página de registro de pagos para el rol de administrador
 * Envuelve el componente PaymentForm con el layout de administrador
 */

import PaymentForm from "../../forms/PaymentForm";
import AdminLayout from "../../layout/admin/AdminLayout";

/**
 * Esta página permite a los administradores:
 * - Registrar nuevos pagos de estudiantes
 * - Cargar comprobantes de pago
 * - Especificar método y detalles del pago
 */
export default function AdminPayment() {
  return (
    <AdminLayout>
      {/* Formulario de pagos */}
      <PaymentForm contextRole="admin" />
    </AdminLayout>
  );
}
