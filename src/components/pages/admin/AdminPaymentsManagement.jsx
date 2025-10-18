// src/components/pages/admin/AdminPaymentsManagement.jsx
/**
 * Página de Gestión de Pagos para Administrador
 * Historia de Usuario: "Como Administradora, quiero procesar y confirmar los pagos 
 * para llevar un control de mis ingresos"
 */

import { useState, useEffect } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { getPayments } from "../../../services/admin/adminPaymentsService";
import AdminPaymentDetailsModal from "../../forms/Admin/AdminPaymentDetailsModal";
import { ConfirmPaymentModal, RejectPaymentModal } from "../../forms/Admin/AdminPaymentActionModals";

export default function AdminPaymentsManagement() {
  const { lang } = useAuth();
  const t = translations[lang].paymentsManagement;

  // Estados para datos
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 elementos por página

  // Estados para modales
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, paymentId: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, payment: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payment: null });

  // Cargar pagos al montar
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message || "Error al cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y búsqueda
  const filteredPayments = payments.filter((payment) => {
    // Búsqueda por ID o nombre de padre
    const matchesSearch =
      searchTerm === "" ||
      payment.id.toString().includes(searchTerm) ||
      payment.parent_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesState = filterState === "" || payment.state === filterState;

    // Filtro por método
    const matchesMethod = filterMethod === "" || payment.payment_method === filterMethod;

    return matchesSearch && matchesState && matchesMethod;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Función para ir a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para ir a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para generar números de página visibles
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }
    
    return visiblePages;
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterState("");
    setFilterMethod("");
    setCurrentPage(1);
  };

  // Handlers
  const handleOpenDetails = (paymentId) => {
    setDetailsModal({ isOpen: true, paymentId });
  };

  const handleOpenConfirm = (payment) => {
    setConfirmModal({ isOpen: true, payment });
  };

  const handleOpenReject = (payment) => {
    setRejectModal({ isOpen: true, payment });
  };

  const handleModalSuccess = () => {
    loadPayments(); // Recargar lista después de confirmar/rechazar
  };

  // Utilidades
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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">Error:</span> {error}
            <button 
              onClick={loadPayments}
              className="ml-4 font-medium text-red-800 underline dark:text-red-400 hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado de carga */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
          </div>
        ) : (
          <>
            {/* Barra de búsqueda, filtros y acciones */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Búsqueda */}
                <div className="relative flex-grow min-w-[200px] max-w-xs">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input 
                    type="search" 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500" 
                    placeholder={t.filters.searchPlaceholder}
                  />
                </div>

                {/* Filtro por Estado */}
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                >
                  <option value="">{t.filters.allStates}</option>
                  <option value="pendiente">{t.states.pendiente}</option>
                  <option value="en revision">{t.states.en_revision}</option>
                  <option value="aceptado">{t.states.aceptado}</option>
                  <option value="rechazado">{t.states.rechazado}</option>
                  <option value="cancelado">{t.states.cancelado}</option>
                </select>

                {/* Filtro por Método */}
                <select
                  value={filterMethod}
                  onChange={(e) => {
                    setFilterMethod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                >
                  <option value="">{t.filters.allMethods}</option>
                  <option value="efectivo">{t.methods.efectivo}</option>
                  <option value="transferencia">{t.methods.transferencia}</option>
                  <option value="deposito">{t.methods.deposito}</option>
                </select>

                {/* Botón limpiar filtros */}
                {(searchTerm || filterState || filterMethod) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {t.filters.clearFilters}
                  </button>
                )}

                {/* Espaciador flexible */}
                <div className="flex-grow"></div>

                {/* Botón de recargar */}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={loadPayments}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t.reload}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de pagos */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t.table.parent}</th>
                <th scope="col" className="px-6 py-3">{t.table.students}</th>
                <th scope="col" className="px-6 py-3">{t.table.method}</th>
                <th scope="col" className="px-6 py-3">{t.table.total}</th>
                <th scope="col" className="px-6 py-3">{t.table.date}</th>
                <th scope="col" className="px-6 py-3">{t.table.state}</th>
                <th scope="col" className="px-6 py-3 text-center">{t.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-red-600 dark:text-red-400">
                    {error}
                  </td>
                </tr>
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                    {searchTerm || filterState || filterMethod ? t.noResults : t.noPayments}
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {payment.parent_name || "-"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.parent_email || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.students || "-"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.students_count} {payment.students_count === 1 ? "estudiante" : "estudiantes"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodBadge(payment.payment_method)}`}>
                        {t.methods[payment.payment_method] || payment.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      Q{parseFloat(payment.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStateBadge(payment.state)}`}>
                        {t.states[payment.state.replace(" ", "_")] || payment.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {/* Botón Ver */}
                        <button
                          onClick={() => handleOpenDetails(payment.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors w-20"
                          title={t.view}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {t.view}
                        </button>

                        {/* Botón Confirmar (solo si está en revisión) */}
                        {payment.state === "en revision" && (
                          <button
                            onClick={() => handleOpenConfirm(payment)}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors w-24"
                            title={t.confirm}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {t.confirm}
                          </button>
                        )}

                        {/* Botón Rechazar (solo si está en revisión) */}
                        {payment.state === "en revision" && (
                          <button
                            onClick={() => handleOpenReject(payment)}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors w-24"
                            title={t.reject}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t.reject}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav aria-label="Paginación de tabla">
              <ul className="flex items-center -space-x-px h-10 text-base">
                {/* Botón Anterior */}
                <li>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                      currentPage === 1
                        ? 'text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                    </svg>
                  </button>
                </li>

                {/* Números de página */}
                {getVisiblePages().map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                        currentPage === page
                          ? 'z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400'
                      }`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* Botón Siguiente */}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                      currentPage === totalPages
                        ? 'text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
          </>
        )}

        {/* Modales */}
        <AdminPaymentDetailsModal
          paymentId={detailsModal.paymentId}
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, paymentId: null })}
          onConfirm={handleOpenConfirm}
          onReject={handleOpenReject}
        />

        <ConfirmPaymentModal
          payment={confirmModal.payment}
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, payment: null })}
          onSuccess={handleModalSuccess}
        />

        <RejectPaymentModal
          payment={rejectModal.payment}
          isOpen={rejectModal.isOpen}
          onClose={() => setRejectModal({ isOpen: false, payment: null })}
          onSuccess={handleModalSuccess}
        />
      </div>
    </AdminLayout>
  );
}
