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
              {t.modal.titleD}
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
                  {t.modal.status}
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
                  {t.modal.description}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.modal.amount}
                </p>
                <p className="font-semibold text-cyan-700 dark:text-cyan-400">{payment.totalCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.modal.month}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.monthPaid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.modal.year}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{payment.year}</p>
              </div>
              {payment.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.modal.paymentMethod}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {t.modal.paymentMethods[payment.paymentMethod] || payment.paymentMethod}
                  </p>
                </div>
              )}
            </div>

            {/* Comprobante */}
            {payment.referencePic && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t.modal.receipt}
                </h4>
                {payment.referencePic.toLowerCase().endsWith('.pdf') ? (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t.modal.pdfDocument}
                      </p>
                      <a 
                        href={payment.referencePic} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        {t.modal.viewDownloadPdf}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={payment.referencePic}
                      alt={t.modal.receipt}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}} className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      {t.modal.imageLoadError}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notas - Diseño mejorado lado a lado */}
            {(payment.userNote || payment.adminNote) && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t.modal.notes}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nota del Padre/Usuario */}
                  {payment.userNote && (
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                            {t.modal.parentNote}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 pl-10 whitespace-pre-wrap break-words">
                        {payment.userNote}
                      </p>
                    </div>
                  )}

                  {/* Nota del Administrador */}
                  {payment.adminNote && (
                    <div className={`p-3 rounded-lg border ${
                      payment.state === 'rechazado'
                        ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
                        : 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700'
                    }`}>
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          payment.state === 'rechazado'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${
                            payment.state === 'rechazado'
                              ? 'text-red-900 dark:text-red-300'
                              : 'text-amber-900 dark:text-amber-300'
                          }`}>
                            {payment.state === 'rechazado' ? t.modal.rejectionReason : t.modal.adminNote}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm pl-10 whitespace-pre-wrap break-words ${
                        payment.state === 'rechazado'
                          ? 'text-red-800 dark:text-red-200'
                          : 'text-amber-800 dark:text-amber-200'
                      }`}>
                        {payment.adminNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje informativo SOLO para rechazados */}
            {payment.state === 'rechazado' && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <span className="font-semibold">⚠️ {t.modal.actionRequired}</span>
                  {' '}
                  {t.modal.rejectionMessage}
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
              {t.modal.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
