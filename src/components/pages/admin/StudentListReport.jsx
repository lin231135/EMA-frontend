// src/components/pages/admin/StudentListReport.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { getStudents } from "../../../services/studentsService";
import StudentDetailsModal from "../../forms/Admin/StudentDetailsModal";
import StudentFormModal from "../../forms/Admin/StudentFormModal";
import { DeactivateStudentModal, ReactivateStudentModal, DeleteStudentModal } from "../../forms/Admin/StudentActionModals";

export default function StudentListReport() {
  const { lang } = useAuth();
  const t = translations[lang].adminDashboard.studentListReport;

  // Estados para datos del backend
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 elementos por página

  // Estados para filtros
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Estados para modales
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, studentId: null });
  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', studentData: null });
  const [deactivateModal, setDeactivateModal] = useState({ isOpen: false, student: null });
  const [reactivateModal, setReactivateModal] = useState({ isOpen: false, student: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });

  // Cargar estudiantes del backend
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      
      console.log('📊 Datos recibidos del backend:', data);
      
      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        console.log('✅ Primer estudiante (campos disponibles):', data[0]);
        setStudents(data);
      } else if (data && Array.isArray(data.students)) {
        // Si el backend devuelve { students: [...] }
        console.log('✅ Primer estudiante (campos disponibles):', data.students[0]);
        setStudents(data.students);
      } else {
        console.error('Respuesta inesperada del backend:', data);
        setStudents([]);
        setError('Formato de respuesta inválido del servidor');
      }
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError(err.message || 'Error al cargar los estudiantes');
      setStudents([]); // Asegurar que students siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  // Handlers para modales
  const handleOpenDetails = (studentId) => {
    setDetailsModal({ isOpen: true, studentId });
  };

  const handleOpenCreateForm = () => {
    setFormModal({ isOpen: true, mode: 'create', studentData: null });
  };

  const handleOpenEditForm = (student) => {
    setFormModal({ isOpen: true, mode: 'edit', studentData: student });
  };

  const handleOpenDeactivate = (student) => {
    setDeactivateModal({ isOpen: true, student });
  };

  const handleOpenReactivate = (student) => {
    setReactivateModal({ isOpen: true, student });
  };

  const handleOpenDelete = (student) => {
    setDeleteModal({ isOpen: true, student });
  };

  const handleModalSuccess = (result) => {
    // Mostrar mensaje de éxito si está disponible
    if (result?.message) {
      // Podrías agregar un toast notification aquí
      console.log('Éxito:', result.message);
    }
    // Recargar lista de estudiantes
    loadStudents();
  };

  // Efecto para resetear la página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, filterDate]);

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterRole("");
    setFilterStatus("");
    setFilterDate("");
  };

  // Función para filtrar estudiantes
  const filteredStudents = (Array.isArray(students) ? students : []).filter((student) => {
    // Filtro por búsqueda (ID o nombre)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = student.id?.toString().includes(term);
      const matchesName = student.name?.toLowerCase().includes(term);
      if (!matchesId && !matchesName) return false;
    }

    // Filtro por rol
    if (filterRole && student.role !== filterRole) {
      return false;
    }

    // Filtro por estado de usuario
    if (filterStatus) {
      if (filterStatus === "active" && !student.is_active) return false;
      if (filterStatus === "inactive" && student.is_active) return false;
    }

    // Filtro por fecha de registro
    if (filterDate) {
      const studentDate = new Date(student.created_at);
      const filterDateObj = new Date(filterDate);
      
      // Comparar solo la fecha (sin horas)
      if (studentDate.toDateString() !== filterDateObj.toDateString()) {
        return false;
      }
    }
    
    return true;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

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

  // Función para imprimir
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t.title || 'Listado de Estudiantes'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .print-date { text-align: right; margin-bottom: 20px; color: #6b7280; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .badge { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="print-date">${lang === 'es' ? 'Fecha de impresión' : 'Print Date'}: ${new Date().toLocaleDateString()}</div>
          <div class="header">
            <h1>${t.title || 'Listado de Estudiantes'}</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>${t.id || 'ID'}</th>
                <th>${t.name || 'Nombre'}</th>
                <th>Rol</th>
                <th>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.map(student => `
                <tr>
                  <td>${student.id}</td>
                  <td>${student.name}</td>
                  <td><span class="badge">${student.role || 'Estudiante'}</span></td>
                  <td>${new Date(student.created_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
              onClick={loadStudents}
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
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando estudiantes...</span>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500" 
                    placeholder={t.searchPlaceholder || "Buscar por ID o nombre..."}
                  />
                </div>

                {/* Filtro por Rol */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                >
                  <option value="">{t.allRoles || "Todos los Roles"}</option>
                  <option value="Estudiante">{t.student || "Estudiante"}</option>
                </select>

                {/* Filtro por Estado de Usuario */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                >
                  <option value="">{t.allStatus || "Todos los Estados"}</option>
                  <option value="active">{t.active || "Activa"}</option>
                  <option value="inactive">{t.inactive || "Desactivada"}</option>
                </select>

                {/* Filtro por Fecha de Registro */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                  placeholder={t.registrationDate || "Fecha de Registro"}
                />

                {/* Botón limpiar filtros */}
                {(searchTerm || filterRole || filterStatus || filterDate) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {t.clearFilters || "Limpiar"}
                  </button>
                )}

                {/* Espaciador flexible para empujar botones a la derecha */}
                <div className="flex-grow"></div>

                {/* Botones de acción */}
                <div className="flex gap-2 ml-auto">
                  {/* Botón de crear estudiante */}
                  <button
                    onClick={handleOpenCreateForm}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t.newStudent || "Nuevo"}
                  </button>

                  {/* Botón de recargar */}
                  <button
                    onClick={loadStudents}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t.reload || "Recargar"}
                  </button>
                  
                  {/* Botón de imprimir */}
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {t.printButton || "Imprimir"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de estudiantes */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.id || "ID"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.name || "Nombre"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.role || "Rol"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.accountStatus || "Estado de Cuenta"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.registrationDate || "Fecha de Registro"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.actions || "Acciones"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? t.noResults : t.noStudents}
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                          {student.id}
                        </th>
                        <td className="px-6 py-4 text-center">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {student.role || 'Estudiante'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {student.is_active ? t.active : t.inactive}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(student.created_at).toLocaleDateString('es-GT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {/* Botón Ver Detalles */}
                            <button 
                              onClick={() => handleOpenDetails(student.id)}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors w-24"
                              title={t.view}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              {t.view}
                            </button>

                            {/* Botón Editar */}
                            <button 
                              onClick={() => handleOpenEditForm(student)}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors w-24"
                              title={t.edit}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                              {t.edit}
                            </button>

                            {/* Botón Desactivar/Activar (cambia según is_active) */}
                            {student.is_active ? (
                              <button 
                                onClick={() => handleOpenDeactivate(student)}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition-colors w-28"
                                title={t.deactivate}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                </svg>
                                {t.deactivate}
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleOpenReactivate(student)}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors w-28"
                                title={t.reactivate}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {t.reactivate}
                              </button>
                            )}

                            {/* Botón Eliminar */}
                            <button 
                              onClick={() => handleOpenDelete(student)}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors w-24"
                              title={t.delete}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              {t.delete}
                            </button>
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
        <StudentDetailsModal
          studentId={detailsModal.studentId}
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, studentId: null })}
        />

        <StudentFormModal
          mode={formModal.mode}
          studentData={formModal.studentData}
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, mode: 'create', studentData: null })}
          onSuccess={handleModalSuccess}
        />

        <DeactivateStudentModal
          student={deactivateModal.student}
          isOpen={deactivateModal.isOpen}
          onClose={() => setDeactivateModal({ isOpen: false, student: null })}
          onSuccess={handleModalSuccess}
        />

        <ReactivateStudentModal
          student={reactivateModal.student}
          isOpen={reactivateModal.isOpen}
          onClose={() => setReactivateModal({ isOpen: false, student: null })}
          onSuccess={handleModalSuccess}
        />

        <DeleteStudentModal
          student={deleteModal.student}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, student: null })}
          onSuccess={handleModalSuccess}
        />
      </div>
    </AdminLayout>
  );
}