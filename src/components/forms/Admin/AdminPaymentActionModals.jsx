// src/components/forms/Admin/AdminPaymentActionModals.jsx
/**
 * Modales de acciones para gestión de pagos
 * - ConfirmPaymentModal: Confirmar pago y marcar estudiantes como solventes
 * - RejectPaymentModal: Rechazar pago con motivo requerido
 */

import { useState } from "react";
import { HiCheck, HiX, HiExclamation } from "react-icons/hi";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { confirmPayment, rejectPayment } from "../../../services/admin/adminPaymentsService";

/**
 * Modal para confirmar un pago
 * Al confirmar, automáticamente marca a los estudiantes como solventes (is_solvent = TRUE)
 */
export function ConfirmPaymentModal({ payment, isOpen, onClose, onSuccess }) {
  const { lang } = useAuth();
  const t = translations[lang].paymentsManagement.confirmModal;

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (!loading) {
      setNote("");
      setError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await confirmPayment(payment.id, note);

      // Éxito
      setNote("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  if (!payment || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
                <HiCheck className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Advertencia importante */}
              <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <HiExclamation className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    {t.warning}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    {t.warningDetail}
                  </p>
                </div>
              </div>

              {/* Información del pago */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t.paymentInfo}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.paymentId}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">#{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.parent}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payment.parent_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.total}:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Q{parseFloat(payment.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.students}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payment.students_count} {payment.students_count === 1 ? "estudiante" : "estudiantes"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nota opcional */}
              <div>
                <label htmlFor="confirm-note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t.noteLabel}
                </label>
                <textarea
                  id="confirm-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.notePlaceholder}
                  rows={3}
                  disabled={loading}
                  className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t.noteHelp}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 w-28"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 w-28"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t.confirming}</span>
                </div>
              ) : (
                t.confirm
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal para rechazar un pago
 * Requiere motivo obligatorio del rechazo
 */
export function RejectPaymentModal({ payment, isOpen, onClose, onSuccess }) {
  const { lang } = useAuth();
  const t = translations[lang].paymentsManagement.rejectModal;

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (!loading) {
      setReason("");
      setError(null);
      onClose();
    }
  };

  const handleReject = async () => {
    // Validación: mínimo 10 caracteres
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError(t.reasonRequired);
      return;
    }
    
    if (trimmedReason.length < 10) {
      setError(t.reasonRequired);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await rejectPayment(payment.id, trimmedReason);

      // Éxito
      setReason("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  if (!payment || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-auto p-4">
        <div className="relative bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900">
                <HiX className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white disabled:opacity-50"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Advertencia importante */}
              <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <HiExclamation className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {t.warning}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {t.warningDetail}
                  </p>
                </div>
              </div>

              {/* Información del pago */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t.paymentInfo}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.paymentId}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">#{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.parent}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payment.parent_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.total}:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      Q{parseFloat(payment.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivo OBLIGATORIO */}
              <div>
                <label 
                  htmlFor="reject-reason" 
                  className="block mb-2 text-sm font-medium text-red-600 dark:text-red-400"
                >
                  {t.reasonLabel}
                </label>
                <textarea
                  id="reject-reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError(null);
                  }}
                  placeholder={t.reasonPlaceholder}
                  rows={4}
                  disabled={loading}
                  maxLength={500}
                  className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                    reason.trim().length > 0 && reason.trim().length < 10
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50`}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {t.reasonHelp}
                  </p>
                  <p className={`text-xs ${
                    reason.trim().length < 10 
                      ? 'text-red-600 dark:text-red-400 font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {reason.length}/500 caracteres
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 w-28"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleReject}
              disabled={loading || reason.trim().length < 10}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50 w-28"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t.rejecting}</span>
                </div>
              ) : (
                t.reject
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
