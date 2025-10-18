// src/components/forms/Admin/StudentDetailsModal.jsx
import { useState, useEffect } from "react";
import { getStudentById } from "../../../services/admin/adminStudentsService";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/**
 * Modal para mostrar los detalles completos de un estudiante
 * Incluye: información personal, direcciones, reservas de clases y notas
 */
export default function StudentDetailsModal({ studentId, isOpen, onClose }) {
  const { lang } = useAuth();
  const t = translations[lang].adminDashboard.studentListReport;
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentDetails();
    }
  }, [isOpen, studentId]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentById(studentId);
      setStudent(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.detailsTitle}
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
          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
              </div>
            )}

            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}

            {student && !loading && (
              <div className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                    {t.personalInfo}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ID
                      </label>
                      <p className="text-gray-900 dark:text-white">{student.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.name}
                      </label>
                      <p className="text-gray-900 dark:text-white">{student.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.birthDate}
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {student.birth_date ? new Date(student.birth_date).toLocaleDateString('es-GT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.solvency}
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.is_solvent 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {student.is_solvent ? t.solvent : t.notSolvent}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.accountStatus}
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.is_active 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {student.is_active ? t.active : t.inactive}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.registrationDate}
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(student.created_at).toLocaleDateString('es-GT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del Padre */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                    {t.parentInfo}
                  </h4>
                  {student.parent ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.name}
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.parent.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.email}
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.parent.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.phone}
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.parent.phone || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t.noParentInfo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Direcciones */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                    {t.addresses}
                  </h4>
                  {student.addresses && student.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {student.addresses.map((address, index) => (
                        <div key={address.id || `address-${index}`} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          {address.is_primary && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mb-2">
                              {t.primaryAddress}
                            </span>
                          )}
                          <p className="text-gray-900 dark:text-white">
                            {address.street_avenue} {address.house_number}
                            {address.apartment && `, ${address.apartment}`}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {address.neighborhood}, Zona {address.zone}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {address.municipality}, {address.city}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t.noAddresses}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reservas/Clases */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                    {t.scheduledClasses}
                  </h4>
                  {student.bookings && student.bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-4 py-2">{t.course}</th>
                            <th className="px-4 py-2">{t.date}</th>
                            <th className="px-4 py-2">{t.schedule}</th>
                            <th className="px-4 py-2">{t.statusClass}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.bookings.map((booking, index) => (
                            <tr key={booking.id || `booking-${index}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="px-4 py-2">{booking.course_name}</td>
                              <td className="px-4 py-2">
                                {new Date(booking.schedule_date).toLocaleDateString('es-GT')}
                              </td>
                              <td className="px-4 py-2">
                                {booking.start_time} - {booking.end_time}
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  booking.status === 'programada' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    : booking.status === 'cancelada'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t.noClasses}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notas */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-500 pl-3">
                    {t.notes}
                  </h4>
                  {student.notes && student.notes.length > 0 ? (
                    <div className="space-y-3">
                      {student.notes.map((note, index) => (
                        <div key={note.id || `note-${index}`} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-gray-900 dark:text-white">{note.note}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {new Date(note.created_at).toLocaleDateString('es-GT', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t.noNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
