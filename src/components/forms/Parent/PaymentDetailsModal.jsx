// src/components/forms/Parent/PaymentDetailsModal.jsx
/**
 * Modal para mostrar los detalles de un pago
 * Usado en el historial de pagos de padres y estudiantes
 * 
 * Muestra:
 * - Estado del pago con badge de color
 * - Información del pago (descripción, monto, mes, año, método)
 * - Comprobante de pago (imagen o PDF)
 * - Nota del usuario (si existe)
 * - Nota administrativa (si existe - importante para rechazos)
 */

import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

export default function PaymentDetailsModal({ payment, isOpen, onClose }) {
  const { lang } = useAuth();
  const t = translations[lang].historyPayments;

  if (!isOpen || !payment) return null;

  /**
   * Obtiene las clases CSS para el badge de estado del pago
   */
  const getStateBadge = (state) => {
    const badges = {
      'pendiente': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'en revision': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'en_revision': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'aceptado': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'rechazado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'cancelado': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return badges[state] || badges['pendiente'];
  };

  /**
   * Obtiene el texto traducido del estado
   */
  const getStateText = (state) => {
    return t.states?.[state] || t.states?.[state.replace(' ', '_')] || state;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {lang === 'es' ? 'Detalles del Pago' : 'Payment Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Estado del Pago */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'es' ? 'Estado del Pago' : 'Payment Status'}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {payment.serialNumber}
                </p>
              </div>
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStateBadge(payment.state)}`}>
                {getStateText(payment.state)}
              </span>
            </div>

            {/* Información del Pago */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'es' ? 'Descripción' : 'Description'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'es' ? 'Monto' : 'Amount'}
                </p>
                <p className="font-semibold text-cyan-700 dark:text-cyan-400">{payment.totalCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'es' ? 'Mes' : 'Month'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.monthPaid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'es' ? 'Año' : 'Year'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.year}</p>
              </div>
              {payment.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'es' ? 'Método de Pago' : 'Payment Method'}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {payment.paymentMethod === 'transferencia' ? (lang === 'es' ? 'Transferencia' : 'Transfer') :
                     payment.paymentMethod === 'deposito' ? (lang === 'es' ? 'Depósito' : 'Deposit') :
                     payment.paymentMethod === 'efectivo' ? (lang === 'es' ? 'Efectivo' : 'Cash') :
                     payment.paymentMethod}
                  </p>
                </div>
              )}
            </div>

            {/* Comprobante */}
            {payment.referencePic && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {lang === 'es' ? 'Comprobante de Pago' : 'Payment Receipt'}
                </h4>
                {payment.referencePic.toLowerCase().endsWith('.pdf') ? (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {lang === 'es' ? 'Documento PDF' : 'PDF Document'}
                      </p>
                      <a 
                        href={payment.referencePic} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        {lang === 'es' ? 'Ver/Descargar PDF' : 'View/Download PDF'}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={payment.referencePic}
                      alt={lang === 'es' ? 'Comprobante' : 'Receipt'}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}} className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      {lang === 'es' ? 'No se pudo cargar la imagen' : 'Could not load image'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nota del Usuario */}
            {payment.userNote && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  {lang === 'es' ? 'Tu Nota' : 'Your Note'}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                  {payment.userNote}
                </p>
              </div>
            )}

            {/* Nota Administrativa */}
            {payment.adminNote && (
              <div className={`p-4 rounded-lg border ${
                payment.state === 'rechazado' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}>
                <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                  payment.state === 'rechazado'
                    ? 'text-red-900 dark:text-red-300'
                    : 'text-yellow-900 dark:text-yellow-300'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  {payment.state === 'rechazado' 
                    ? (lang === 'es' ? 'Motivo del Rechazo' : 'Rejection Reason')
                    : (lang === 'es' ? 'Nota Administrativa' : 'Administrative Note')
                  }
                </h4>
                <p className={`text-sm whitespace-pre-wrap ${
                  payment.state === 'rechazado'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {payment.adminNote}
                </p>
              </div>
            )}

            {/* Mensaje informativo según el estado */}
            {payment.state === 'rechazado' && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  {lang === 'es' 
                    ? '⚠️ Este pago fue rechazado. Por favor, revisa el motivo del rechazo y vuelve a realizar el pago con la información correcta.'
                    : '⚠️ This payment was rejected. Please review the rejection reason and resubmit the payment with the correct information.'
                  }
                </p>
              </div>
            )}

            {payment.state === 'en revision' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {lang === 'es'
                    ? 'ℹ️ Tu pago está en revisión. El administrador lo verificará pronto y actualizará el estado.'
                    : 'ℹ️ Your payment is under review. The administrator will verify it soon and update the status.'
                  }
                </p>
              </div>
            )}

            {payment.state === 'aceptado' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {lang === 'es'
                    ? '✅ Tu pago ha sido aceptado exitosamente.'
                    : '✅ Your payment has been successfully accepted.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
