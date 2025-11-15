// src/components/pages/admin/StudentListReport.jsx
/**
 * @file StudentListReport.jsx
 * @description Reporte simplificado de listado de estudiantes
 * 
 * Características:
 * - Tabla con 3 columnas: Nombre, Rol, Fecha de Registro
 * - Búsqueda y filtros básicos
 * - Exportación a PDF y Excel
 * - Impresión directa
 * - Paginación
 * - Sin acciones de edición
 * 
 * @author EMA Frontend Team
 * @version 3.0.0
 */

import { useState, useEffect } from "react";
import TeacherLayout from "../../layout/teacher/TeacherLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { getStudents } from "../../../services/admin/adminStudentsService";

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
  const [itemsPerPage] = useState(10);

  // Estados para filtros
  const [filterRole, setFilterRole] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
        setStudents([]);
        setError('Formato de respuesta inválido del servidor');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los estudiantes');
      setStudents([]); // Asegurar que students siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  // Efecto para resetear la página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterDate]);

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterRole("");
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
  // Definir URL del logo
  const logoUrl = `${window.location.origin}/LogoColorEMA3.svg`;
  
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${t.title || "Listado de Estudiantes"}</title>
    <style>
      @page { size: A4 portrait; margin: 20mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-family: "Segoe UI", Roboto, Arial, sans-serif; margin: 0; color: #1f2937; background: #ffffff; }

      header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0ea5e9; padding: 10px 0; margin-bottom: 20px; }
      .invoice-logo { height: 60px; }

      h1 { text-align: center; color: #0f172a; font-size: 22px; margin: 20px 0; letter-spacing: 0.5px; }

      .invoice-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 25px;
      }
      .invoice-section h3 { font-size: 13px; font-weight: 600; color: #334155; margin: 0 0 6px 0; }
      .company-name { font-weight: 700; color: #0f172a; font-size: 14px; }
      .company-address { font-size: 12px; color: #64748b; white-space: pre-line; }
      .client-name { font-weight: 600; font-size: 14px; }
      .client-address { font-size: 12px; color: #475569; }

      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
      th { background-color: #e0f2fe; color: #0c4a6e; padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #0ea5e9; }
      td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
      tr:nth-child(even) { background-color: #f9fafb; }

      .print-date { text-align: right; color: #6b7280; font-size: 12px; margin: 5px 0 0 0; }

      .badge { display: inline-block; background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }

      .totals { margin-top: 12px; display: flex; justify-content: flex-end; }
      .totals-box { min-width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; background: #f8fafc; }
      .totals-row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
      .totals-label { color: #0f172a; font-weight: 600; }
      .totals-value { color: #0369a1; font-weight: 700; }

      .empty { text-align: center; color: #64748b; padding: 18px 0; font-size: 13px; }

      footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 8px; }
    </style>
  </head>
  <body>
    <header>
      <img src="${logoUrl}" alt="EMA Logo" class="invoice-logo" />
      <div class="print-date">${lang === "es" ? "Fecha de impresión" : "Print Date"}: ${new Date().toLocaleDateString(lang === "es" ? "es-GT" : "en-US")}</div>
    </header>

    <h1>${t.title || (lang === "es" ? "Listado de Estudiantes" : "Student List")}</h1>

    <div class="invoice-header">
      <div class="invoice-section">
        <h3>${lang === "es" ? "Origen" : "From"}</h3>
        <div class="company-name">Ellie's Music Academy</div>
        <div class="company-address">${lang === "es" ? "Ciudad de Guatemala\nGuatemala" : "Guatemala City\nGuatemala"}</div>
      </div>

      <div class="invoice-section">
        <h3>${lang === "es" ? "Resumen" : "Summary"}</h3>
        <div class="client-name">${lang === "es" ? "Total de estudiantes" : "Total students"}</div>
        <div class="client-address">${filteredStudents.length}</div>
      </div>

      <div class="invoice-section">
        <h3>${lang === "es" ? "Fecha" : "Date"}</h3>
        <div>${new Date().toLocaleDateString(lang === "es" ? "es-GT" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>${t.id || "ID"}</th>
          <th>${t.name || (lang === "es" ? "Nombre" : "Name")}</th>
          <th>${t.role || (lang === "es" ? "Rol" : "Role")}</th>
          <th>${t.registeredAt || (lang === "es" ? "Fecha de Registro" : "Registered At")}</th>
        </tr>
      </thead>
      <tbody>
        ${
          filteredStudents.length === 0
            ? `<tr><td colspan="4"><div class="empty">${lang === "es" ? "No hay estudiantes para mostrar." : "There are no students to display."}</div></td></tr>`
            : filteredStudents
                .map(
                  (student) => `
              <tr>
                <td>${student.id ?? ""}</td>
                <td>${student.name ?? ""}</td>
                <td><span class="badge">${student.role || (lang === "es" ? "Estudiante" : "Student")}</span></td>
                <td>${
                  student.created_at
                    ? new Date(student.created_at).toLocaleDateString(
                        lang === "es" ? "es-GT" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                    : ""
                }</td>
              </tr>`
                )
                .join("")
        }
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <div class="totals-label">${lang === "es" ? "Total de registros:" : "Total records:"}</div>
          <div class="totals-value">${filteredStudents.length}</div>
        </div>
      </div>
    </div>

    <footer>
      © ${new Date().getFullYear()} Ellie's Music Academy
    </footer>

    <script>
      const imgs = Array.from(document.images);
      Promise.all(
        imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; }))
      ).then(() => {
        window.focus();
        window.print();
      });
    </script>
  </body>
</html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  // eliminar iframe después de imprimir
  const removeIframe = () => {
    setTimeout(() => {
      if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
      window.removeEventListener("focus", removeIframe);
    }, 500);
  };
  window.addEventListener("focus", removeIframe);
};

// Función para exportar a PDF 
const handleExportPDF = async () => {
  try {
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ compress: true });

    const pageWidth  = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // -------- cargar imagen como dataURL --------
    const loadAsDataURL = async (url) => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Fetch logo failed');
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    // -------- Header --------
    const marginX = 14;
    const logoBox = { x: marginX, y: 10, w: 18, h: 18 }; // caja reservada del logo
    let logoLoaded = false;

    // 1) Intentar logo
    try {
      const logoUrl = `${window.location.origin}/LogoColorEMA3.png`;
      const dataURL = await loadAsDataURL(logoUrl); // admite PNG/JPEG
      // Detectar formato por cabecera del dataURL
      const isPNG = /^data:image\/png/i.test(dataURL);
      const isJPG = /^data:image\/jpe?g/i.test(dataURL);

      doc.addImage(
        dataURL,
        isPNG ? 'PNG' : (isJPG ? 'JPEG' : 'PNG'),
        logoBox.x, logoBox.y, logoBox.w, logoBox.h,
        undefined,
        'FAST' // calidad adecuada; usa 'SLOW' si quieres máxima nitidez
      );
      logoLoaded = true;
    } catch {
      // si falla, continuamos con fallback tipográfico
      logoLoaded = false;
    }

    // 2) Títulos del header (a la derecha del logo si cargó; si no, en el lugar del header)
    const textBaseX = logoLoaded ? (logoBox.x + logoBox.w + 4) : marginX;
    const titleY    = logoBox.y + 7;   // alineado verticalmente con el logo
    const subY      = logoBox.y + 12;

    if (!logoLoaded) {
      // marco visual sutil para mantener alturas consistentes cuando no hay logo
      doc.setDrawColor(255,255,255);
      doc.rect(logoBox.x, logoBox.y, logoBox.w, logoBox.h);
    }

    // 3) Fecha de impresión (arriba derecha)
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const printDateText =
      `${lang === "es" ? "Fecha de impresión" : "Print Date"}: ` +
      new Date().toLocaleDateString(lang === "es" ? "es-GT" : "en-US");
    doc.text(printDateText, pageWidth - marginX, logoBox.y + 5, { align: 'right' });

    // 4) Línea divisoria bajo el header (dejamos 28px de alto total de header)
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.5);
    const headerBottomY = Math.max(logoBox.y + logoBox.h, subY + 3) + 4; // altura segura
    doc.line(marginX, headerBottomY, pageWidth - marginX, headerBottomY);

    // -------- Título de la página --------
    let yPosition = headerBottomY + 10;
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(
      t.title || (lang === "es" ? "Listado de Estudiantes" : "Student List"),
      pageWidth / 2, yPosition, { align: 'center' }
    );
    yPosition += 12;

    // -------- Cuadro de información --------
    const boxY = yPosition;
    const boxHeight = 24;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(marginX, boxY, pageWidth - marginX * 2, boxHeight, 2, 2, 'FD');

    const colWidth = (pageWidth - marginX * 2) / 3;
    const col = (i) => marginX + 4 + i * colWidth;

    // Col 1 - Origen
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.setTextColor(51, 65, 85);
    doc.text(lang === "es" ? "Origen" : "From", col(0), boxY + 6);
    doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.setTextColor(15,23,42);
    doc.text("Ellie's Music Academy", col(0), boxY + 12);
    doc.setFontSize(9); doc.setFont(undefined, 'normal'); doc.setTextColor(100,116,139);
    doc.text(lang === "es" ? "Ciudad de Guatemala" : "Guatemala City", col(0), boxY + 17);
    doc.text("Guatemala", col(0), boxY + 21);

    // Col 2 - Resumen
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.setTextColor(51, 65, 85);
    doc.text(lang === "es" ? "Resumen" : "Summary", col(1), boxY + 6);
    doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.setTextColor(15,23,42);
    doc.text(lang === "es" ? "Total de estudiantes" : "Total students", col(1), boxY + 12);
    doc.setFontSize(10); doc.setFont(undefined, 'normal'); doc.setTextColor(71,85,105);
    doc.text(`${filteredStudents.length}`, col(1), boxY + 17);

    // Col 3 - Fecha
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.setTextColor(51, 65, 85);
    doc.text(lang === "es" ? "Fecha" : "Date", col(2), boxY + 6);
    doc.setFontSize(9); doc.setFont(undefined, 'normal'); doc.setTextColor(71,85,105);
    const fullDate = new Date().toLocaleDateString(
      lang === "es" ? "es-GT" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    doc.text(fullDate, col(2), boxY + 12);

    yPosition = boxY + boxHeight + 8;

    // -------- Tabla (SIN columna de acciones) --------
    const tableData = filteredStudents.map(s => [
      s.id || '',
      s.name || '',
      s.role || (lang === "es" ? 'Estudiante' : 'Student'),
      s.created_at
        ? new Date(s.created_at).toLocaleDateString(lang === "es" ? "es-GT" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })
        : ''
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[
        t.id || 'ID',
        t.name || (lang === "es" ? "Nombre" : "Name"),
        t.role || (lang === "es" ? "Rol" : "Role"),
        t.registrationDate || (lang === "es" ? "Fecha de Registro" : "Registered At")
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [224, 242, 254],
        textColor: [12, 74, 110],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 3
      },
      bodyStyles: { fontSize: 10, halign: 'left', cellPadding: 2.5 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 40 }, 3: { cellWidth: 55 } },
      margin: { left: marginX, right: marginX },
      didDrawPage: (data) => {
        const footerY = pageHeight - 15;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(marginX, footerY - 5, pageWidth - marginX, footerY - 5);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(`© ${new Date().getFullYear()} Ellie's Music Academy`, pageWidth / 2, footerY, { align: 'center' });
      }
    });

    // -------- Totales --------
    const finalY = doc.lastAutoTable.finalY + 5;
    const totalsBoxWidth = 70;
    const totalsBoxHeight = 12;
    const totalsBoxX = pageWidth - marginX - totalsBoxWidth;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(totalsBoxX, finalY, totalsBoxWidth, totalsBoxHeight, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(lang === "es" ? "Total de registros:" : "Total records:", totalsBoxX + 4, finalY + 8);
    doc.setTextColor(3, 105, 161);
    doc.text(`${filteredStudents.length}`, totalsBoxX + totalsBoxWidth - 4, finalY + 8, { align: 'right' });

    // Guardar PDF
    doc.save(`estudiantes_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (err) {
    console.error('Error al generar PDF:', err);
    alert(lang === "es" ? "Error al generar el PDF" : "Error generating PDF");
  }
};


// Función para exportar a Excel
const handleExportExcel = async () => {
  try {
    // Importar xlsx dinámicamente
    const XLSX = await import('xlsx');
    
    // Preparar datos para Excel (SIN columna de acciones)
    const excelData = filteredStudents.map(student => ({
      [t.id || 'ID']: student.id || '',
      [t.name || 'Nombre']: student.name || '',
      [t.role || 'Rol']: student.role || 'Estudiante',
      [t.registrationDate || 'Fecha de Registro']: new Date(student.created_at).toLocaleDateString(lang === "es" ? "es-GT" : "en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
    
    // Crear libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, lang === "es" ? "Estudiantes" : "Students");
    
    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 10 },  // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // Rol
      { wch: 25 }   // Fecha
    ];
    worksheet['!cols'] = columnWidths;
    
    // Guardar archivo
    XLSX.writeFile(workbook, `estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Error al generar Excel:', error);
    alert(lang === "es" ? "Error al generar el archivo Excel" : "Error generating Excel file");
  }
};


  return (
    <TeacherLayout>
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

                {/* Filtro por Fecha de Registro */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                  placeholder={t.registrationDate || "Fecha de Registro"}
                />

                {/* Botón limpiar filtros */}
                {(searchTerm || filterRole || filterDate) && (
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
                  
                  {/* Botón de exportar a PDF */}
                  <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clipRule="evenodd"/>
                    </svg>
                    {t.exportPDF || "PDF"}
                  </button>
                  
                  {/* Botón de exportar a Excel */}
                  <button
                    onClick={handleExportExcel}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors"
                  >
                    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clipRule="evenodd"/>
                    </svg>
                    {t.exportExcel || "Excel"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de estudiantes (SIN columnas de estado y acciones) */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.name || "Nombre"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.role || "Rol"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      {t.registrationDate || "Fecha de Registro"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? t.noResults : t.noStudents}
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {student.role || 'Estudiante'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {new Date(student.created_at).toLocaleDateString('es-GT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
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
      </div>
    </TeacherLayout>
  );
}