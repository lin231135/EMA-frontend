// src/components/pages/admin/StudentListReport.jsx
import { useState } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

// Datos de ejemplo para la tabla
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "María García",
    address: "Calle Principal 123, Ciudad",
    place: "atHome",
    type: "pianoClass",
    status: "payed"
  },
  {
    id: 2,
    name: "Juan Pérez",
    address: "Avenida Central 456, Ciudad",
    place: "atAcademy",
    type: "singingClass",
    status: "onHold"
  },
  {
    id: 3,
    name: "Ana López",
    address: "Calle Secundaria 789, Ciudad",
    place: "atHome",
    type: "musicStimulation",
    status: "rejected"
  },
  {
    id: 4,
    name: "Carlos Rodríguez",
    address: "Boulevard Norte 321, Ciudad",
    place: "atAcademy",
    type: "pianoClass",
    status: "payed"
  },
  {
    id: 5,
    name: "Laura Martínez",
    address: "Calle Sur 654, Ciudad",
    place: "atHome",
    type: "singingClass",
    status: "onHold"
  }
];

export default function StudentListReport() {
  const { lang } = useAuth();
  const t = translations[lang].adminDashboard.studentListReport;

  // Estados para filtros y búsqueda
  const [placeFilter, setPlaceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status) => {
    const statusConfig = {
      payed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", text: t.payed },
      onHold: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", text: t.onHold },
      rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", text: t.rejected }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPlaceText = (place) => {
    return place === "atHome" ? t.atHome : t.atAcademy;
  };

  const getTypeText = (type) => {
    const typeMap = {
      pianoClass: t.pianoClass,
      singingClass: t.singingClass,
      musicStimulation: t.musicStimulation
    };
    return typeMap[type];
  };

  // Función para filtrar estudiantes
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    // Filtro por lugar
    if (placeFilter && student.place !== placeFilter) return false;
    
    // Filtro por tipo
    if (typeFilter && student.type !== typeFilter) return false;
    
    // Filtro por estado
    if (statusFilter && student.status !== statusFilter) return false;
    
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.address.toLowerCase().includes(term) ||
        student.id.toString().includes(term)
      );
    }
    
    return true;
  });

  // Función para limpiar filtros
  const resetFilters = () => {
    setPlaceFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setSearchTerm("");
  };

  // Función para imprimir
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .print-date { text-align: right; margin-bottom: 20px; color: #6b7280; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status-payed { background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            .status-onhold { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            .status-rejected { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="print-date">${lang === 'es' ? 'Fecha de impresión' : 'Print Date'}: ${new Date().toLocaleDateString()}</div>
          <div class="header">
            <h1>${t.title}</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>${t.id}</th>
                <th>${t.name}</th>
                <th>${t.address}</th>
                <th>${t.place}</th>
                <th>${t.type}</th>
                <th>${t.status}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.map(student => `
                <tr>
                  <td>${student.id}</td>
                  <td>${student.name}</td>
                  <td>${student.address}</td>
                  <td>${getPlaceText(student.place)}</td>
                  <td>${getTypeText(student.type)}</td>
                  <td><span class="status-${student.status}">${student.status === 'payed' ? t.payed : student.status === 'onHold' ? t.onHold : t.rejected}</span></td>
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

        {/* Filtros, Búsqueda y Botón de Imprimir */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-1/2">
            {/* Filtro por Lugar */}
            <select
              value={placeFilter}
              onChange={(e) => setPlaceFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            >
              <option value="">{t.allPlaces}</option>
              <option value="atHome">{t.atHome}</option>
              <option value="atAcademy">{t.atAcademy}</option>
            </select>

            {/* Filtro por Tipo */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            >
              <option value="">{t.allTypes}</option>
              <option value="pianoClass">{t.pianoClass}</option>
              <option value="singingClass">{t.singingClass}</option>
              <option value="musicStimulation">{t.musicStimulation}</option>
            </select>

            {/* Filtro por Estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            >
              <option value="">{t.allStatuses}</option>
              <option value="payed">{t.payed}</option>
              <option value="onHold">{t.onHold}</option>
              <option value="rejected">{t.rejected}</option>
            </select>

            {/* Botón Reset */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-colors"
            >
              {t.resetFilter}
            </button>
          </div>

          {/* Búsqueda y Botón de Imprimir */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-1/2 lg:justify-end">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500" 
                placeholder={t.searchPlaceholder}
              />
            </div>
            
            {/* Botón de imprimir */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 transition-colors"
            >
              <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {t.printButton}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t.id}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.name}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.address}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.place}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.type}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {student.id}
                  </th>
                  <td className="px-6 py-4">
                    {student.name}
                  </td>
                  <td className="px-6 py-4">
                    {student.address}
                  </td>
                  <td className="px-6 py-4">
                    {getPlaceText(student.place)}
                  </td>
                  <td className="px-6 py-4">
                    {getTypeText(student.type)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(student.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}