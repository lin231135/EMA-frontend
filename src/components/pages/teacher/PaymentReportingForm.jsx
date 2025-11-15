// src/components/pages/teacher/PaymentReportingForm.jsx
/**
 * @file PaymentReportingForm.jsx
 * @description Vista para que el maestro pueda:
 *  - Ver pagos pendientes en efectivo asignados a él.
 *  - Marcar un pago como "en revisión" cuando recibe el efectivo.
 *  - Reportar pagos incorrectos o no recibidos al equipo administrativo.
 */

import { useEffect, useState } from "react";
import TeacherLayout from "../../layout/teacher/TeacherLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import {
  getPendingPayments,
  markPaymentAsRevision,
  reportPaymentIssue,
} from "../../../services/teacher/paymentReportingService";

export default function PaymentReportingForm() {
  const { lang, token: contextToken } = useAuth();
  const t = translations[lang]?.teacherDashboard?.paymentReporting || {};

  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // helper: token (por si luego cambias dónde lo guardas)
  const getToken = () =>
    contextToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("ema_token") ||
    null;

  const clearMessages = () => {
    setError(null);
    setSuccessMessage("");
  };

  // Cargar pagos pendientes
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        clearMessages();
        const token = getToken();
        const data = await getPendingPayments(token);
        setPendingPayments(data);
      } catch (err) {
        console.error("Error fetching pending payments:", err);
        setError(
          err.message ||
            (lang === "es"
              ? "Ocurrió un error al cargar los pagos pendientes."
              : "An error occurred while loading pending payments.")
        );
        setPendingPayments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcar como "revision"
  const handleUpdateStatus = async (paymentId) => {
    try {
      clearMessages();
      setSubmitting(true);
      const token = getToken();
      await markPaymentAsRevision(paymentId, token);

      setPendingPayments((prev) =>
        prev.filter((payment) => payment.id !== paymentId)
      );
      setSuccessMessage(
        lang === "es"
          ? "El pago fue marcado como 'En revisión'."
          : "Payment marked as 'Under review'."
      );
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError(
        err.message ||
          (lang === "es"
            ? "Ocurrió un error al actualizar el pago."
            : "An error occurred while updating the payment.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Enviar reporte
  const handleReportPayment = async () => {
    if (!selectedPaymentId || !reportReason.trim()) {
      setError(
        lang === "es"
          ? "Selecciona un pago y escribe un motivo para el reporte."
          : "Please select a payment and provide a reason."
      );
      return;
    }

    try {
      clearMessages();
      setSubmitting(true);
      const token = getToken();
      await reportPaymentIssue(selectedPaymentId, reportReason.trim(), token);

      setPendingPayments((prev) =>
        prev.filter((payment) => payment.id !== selectedPaymentId)
      );
      setSuccessMessage(
        lang === "es"
          ? "El reporte fue enviado al equipo administrativo."
          : "The report was sent to the administrative team."
      );
      setSelectedPaymentId(null);
      setReportReason("");
    } catch (err) {
      console.error("Error reporting payment:", err);
      setError(
        err.message ||
          (lang === "es"
            ? "Ocurrió un error al enviar el reporte."
            : "An error occurred while sending the report.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReport = () => {
    setSelectedPaymentId(null);
    setReportReason("");
    clearMessages();
  };

  const selectedPayment = pendingPayments.find(
    (p) => p.id === selectedPaymentId
  );

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title ||
              (lang === "es"
                ? "Reporte de pagos en efectivo"
                : "Cash Payments Reporting")}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle ||
              (lang === "es"
                ? "Aquí puedes marcar pagos en efectivo que ya recibiste o reportar pagos incorrectos/no recibidos."
                : "Here you can mark received cash payments or report incorrect / missing payments.")}
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div
            className="p-4 mb-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">
              {lang === "es" ? "Error:" : "Error:"}
            </span>{" "}
            {error}
          </div>
        )}

        {successMessage && (
          <div
            className="p-4 mb-2 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            {successMessage}
          </div>
        )}

        {/* Estado de carga */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              {lang === "es"
                ? "Cargando pagos pendientes..."
                : "Loading pending payments..."}
            </span>
          </div>
        ) : (
          <>
            {/* Tabla de pagos pendientes */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-center">
                      {t.parent || (lang === "es" ? "Padre/Madre" : "Parent")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t.student || (lang === "es" ? "Alumno" : "Student")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t.amount || (lang === "es" ? "Monto" : "Amount")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t.method || (lang === "es" ? "Método" : "Method")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t.status || (lang === "es" ? "Estado" : "Status")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t.actions || (lang === "es" ? "Acciones" : "Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        {t.empty ||
                          (lang === "es"
                            ? "No tienes pagos pendientes en efectivo."
                            : "You have no pending cash payments.")}
                      </td>
                    </tr>
                  ) : (
                    pendingPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                          {payment.parent_name || payment.parentName || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {payment.student_name || payment.studentName || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {payment.amount != null
                            ? `Q${Number(payment.amount).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            {payment.payment_method ||
                              payment.method ||
                              "cash"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            {payment.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            disabled={submitting}
                            onClick={() => handleUpdateStatus(payment.id)}
                            className="mb-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                          >
                            {t.markRevision ||
                              (lang === "es"
                                ? "Marcar como recibido"
                                : "Mark as received")}
                          </button>
                          <button
                            disabled={submitting}
                            onClick={() => {
                              clearMessages();
                              setSelectedPaymentId(payment.id);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          >
                            {t.report ||
                              (lang === "es"
                                ? "Reportar problema"
                                : "Report")}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Panel de reporte */}
            {selectedPaymentId && (
              <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t.reportTitle ||
                    (lang === "es"
                      ? "Reporte de pago incorrecto o no recibido"
                      : "Report incorrect or missing payment")}
                </h2>

                {selectedPayment && (
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {lang === "es" ? "Pago seleccionado:" : "Selected payment:"}{" "}
                    <span className="font-medium">
                      {selectedPayment.parent_name ||
                        selectedPayment.parentName ||
                        "-"}{" "}
                      /{" "}
                      {selectedPayment.student_name ||
                        selectedPayment.studentName ||
                        "-"}{" "}
                      —{" "}
                      {selectedPayment.amount != null
                        ? `Q${Number(selectedPayment.amount).toFixed(2)}`
                        : ""}
                    </span>
                  </p>
                )}

                <label
                  htmlFor="reportReason"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t.reasonLabel ||
                    (lang === "es"
                      ? "Motivo del reporte"
                      : "Reason for the report")}
                </label>
                <textarea
                  id="reportReason"
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="block w-full p-2.5 text-sm text-gray-900 bg.white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                  placeholder={
                    t.reasonPlaceholder ||
                    (lang === "es"
                      ? "Ejemplo: El alumno no asistió, el pago no fue entregado, el monto no coincide, etc."
                      : "Example: Student did not attend, payment was not delivered, amount does not match, etc.")
                  }
                  disabled={submitting}
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleReportPayment}
                    disabled={submitting || !reportReason.trim()}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    {submitting
                      ? lang === "es"
                        ? "Enviando..."
                        : "Sending..."
                      : t.submitReport ||
                        (lang === "es" ? "Enviar reporte" : "Submit report")}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelReport}
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    {t.cancel || (lang === "es" ? "Cancelar" : "Cancel")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TeacherLayout>
  );
}