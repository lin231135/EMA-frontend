// src/components/forms/Admin/AdminPaymentDetailsModal.jsx
/**
 * Modal de detalles completos de un pago
 * Muestra toda la información del pago y permite acciones de confirmar/rechazar
 */

import { useState, useEffect } from "react";
import { HiCheck, HiX, HiDownload } from "react-icons/hi";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { getPaymentById } from "../../../services/admin/adminPaymentsService";

export default function AdminPaymentDetailsModal({ paymentId, isOpen, onClose, onConfirm, onReject }) {
  const { lang } = useAuth();
  const t = translations[lang].paymentsManagement.detailsModal;
  const states = translations[lang].paymentsManagement.states;
  const methods = translations[lang].paymentsManagement.methods;

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && paymentId) {
      loadPaymentDetails();
    }
  }, [isOpen, paymentId]);

  const loadPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentById(paymentId);
      setPayment(data);
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPayment(null);
    setError(null);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(payment);
    handleClose();
  };

  const handleReject = () => {
    onReject(payment);
    handleClose();
  };

  const getStateBadge = (state) => {
    const badges = {
      pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "en revision": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      aceptado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rechazado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      cancelado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return badges[state] || "bg-gray-100 text-gray-800";
  };

  const getMethodBadge = (method) => {
    const badges = {
      efectivo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      transferencia: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      deposito: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    };
    return badges[method] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "es" ? "es-GT" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString(lang === "es" ? "es-GT" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.title}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        ) : payment ? (
          <div className="space-y-6">
            {/* Estado y ID */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t.paymentId} #{payment.id}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t.createdAt}: {formatDateTime(payment.created_at)}
                </p>
              </div>
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStateBadge(payment.state)}`}>
                {states[payment.state.replace(" ", "_")] || payment.state}
              </span>
            </div>

            {/* Información del pago */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                {t.paymentInfo}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.method}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-sm font-medium rounded ${getMethodBadge(payment.payment_method)}`}>
                    {methods[payment.payment_method] || payment.payment_method}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.date}</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                    {formatDate(payment.payment_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.total}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    Q{parseFloat(payment.total).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.updatedAt}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatDateTime(payment.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del padre */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                {t.parentInfo}
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.parentName}</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {payment.parent_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.parentEmail}</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {payment.parent_email || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Estudiantes e ítems del pago */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                {t.itemsInfo}
              </h4>
              {payment.items && payment.items.length > 0 ? (
                <div className="space-y-3">
                  {payment.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.student_name || item.book_name || t.unknownItem}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.course_name || item.book_name ? `${item.course_name || ''} ${item.description || ''}`.trim() : t.noDescription}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white ml-4">
                          Q{parseFloat(item.subtotal || item.unit_cost || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.noItems}</p>
              )}
            </div>

            {/* Comprobante/Voucher */}
            {payment.voucher_url && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                  {t.voucher}
                </h4>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={payment.voucher_url}
                    alt="Comprobante de pago"
                    className="max-w-full max-h-96 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
                  />
                  <a
                    href={payment.voucher_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <HiDownload className="w-4 h-4 mr-2" />
                    {t.downloadVoucher}
                  </a>
                </div>
              </div>
            )}

            {/* Notas */}
            {payment.note && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                  {t.notes}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {payment.note}
                </p>
              </div>
            )}
          </div>
        ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 w-28"
            >
              {t.close}
            </button>

            {/* Botones de acción solo si está "en revision" */}
            {payment && payment.state === "en revision" && (
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 w-28"
                >
                  <HiX className="w-4 h-4 mr-2" />
                  {t.reject}
                </button>
                <button
                  onClick={handleConfirm}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-28"
                >
                  <HiCheck className="w-4 h-4 mr-2" />
                  {t.confirm}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
