// src/components/forms/Admin/StudentActionModals.jsx
import { useState } from "react";
import { deactivateStudent, reactivateStudent, deleteStudent } from "../../../services/admin/adminStudentsService";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/**
 * Modal de confirmación para desactivar un estudiante (soft delete)
 */
export function DeactivateStudentModal({ student, isOpen, onClose, onSuccess }) {
  const { lang } = useAuth();
  const t = translations[lang].studentActionModals.deactivate;
  
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await deactivateStudent(student.id, reason);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
      setReason(''); // Limpiar
    } catch (err) {
      setError(err.message || 'Error al desactivar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <span className="font-medium">{t.errorLabel}</span> {error}
              </div>
            )}

            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-2">
                <strong>{t.studentLabel}</strong> {student.name}
              </p>
              <p className="mb-4 text-sm">
                {t.confirmQuestion}
              </p>
              <p className="mb-4 text-sm">
                {t.actionTitle}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-gray-600 dark:text-gray-400">
                {t.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t.reasonLabel}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={loading}
                  rows="3"
                  maxLength="500"
                  placeholder={t.reasonPlaceholder}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {reason.length}/500 {t.characterCount}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 disabled:opacity-50"
            >
              {t.cancelButton}
            </button>
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? t.loadingButton : t.confirmButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de confirmación doble para eliminar un estudiante permanentemente (hard delete)
 */
export function DeleteStudentModal({ student, isOpen, onClose, onSuccess }) {
  const { lang } = useAuth();
  const t = translations[lang].studentActionModals.delete;
  
  const [step, setStep] = useState(1); // 1: primera confirmación, 2: segunda confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFirstConfirm = () => {
    setStep(2);
    setError(null);
  };

  const handleFinalDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteStudent(student.id);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al eliminar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setError(null);
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={!loading ? handleClose : undefined}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 mr-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
                {step === 1 ? t.warningTitle : t.finalConfirmationTitle}
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <span className="font-medium">{t.errorLabel}</span> {error}
              </div>
            )}

            {step === 1 ? (
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-2 font-semibold">
                  {t.step1Question.replace('{name}', student.name)}
                </p>
                <p className="mb-4 text-sm text-red-600 dark:text-red-400 font-medium">
                  {t.step1WarningMessage}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-gray-600 dark:text-gray-400">
                  {t.step1Actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    {t.step1Recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-4 text-lg font-bold text-red-600 dark:text-red-400">
                  {t.step2Question}
                </p>
                <p className="mb-2">
                  {t.step2FinalQuestion.replace('{name}', student.name)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.step2Warning}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 disabled:opacity-50"
            >
              {t.cancelButton}
            </button>
            {step === 1 ? (
              <button
                onClick={handleFirstConfirm}
                className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-lg dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
              >
                {t.continueButton}
              </button>
            ) : (
              <button
                onClick={handleFinalDelete}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? t.loadingButton : t.confirmButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de confirmación para reactivar un estudiante
 */
export function ReactivateStudentModal({ student, isOpen, onClose, onSuccess }) {
  const { lang } = useAuth();
  const t = translations[lang].studentActionModals.reactivate;
  
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReactivate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reactivateStudent(student.id, reason);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
      setReason(''); // Limpiar
    } catch (err) {
      setError(err.message || 'Error al reactivar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <span className="font-medium">{t.errorLabel}</span> {error}
              </div>
            )}

            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-2">
                <strong>{t.studentLabel}</strong> {student.name}
              </p>
              <p className="mb-4 text-sm">
                {t.confirmQuestion}
              </p>
              <p className="mb-4 text-sm">
                {t.actionTitle}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-gray-600 dark:text-gray-400">
                {t.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t.reasonLabel}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={loading}
                  rows="3"
                  maxLength="500"
                  placeholder={t.reasonPlaceholder}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {reason.length}/500 {t.characterCount}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 disabled:opacity-50"
            >
              {t.cancelButton}
            </button>
            <button
              onClick={handleReactivate}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? t.loadingButton : t.confirmButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
