// src/components/pages/app/HistoryPayments.jsx
/**
 * @file HistoryPayments.jsx
 * @description Componente genérico de historial de pagos 
 * 
 * Características principales:
 * - Visualización de historial de pagos en tabla responsiva
 * - Búsqueda en tiempo real por múltiples campos
 * - Paginación personalizada con navegación de páginas
 * - Cálculo automático de totales (filtrados)
 * - Funcionalidad de impresión con formato de factura profesional
 * - Traducción de meses según idioma seleccionado
 * - Detección automática de moneda (GTQ/USD)
 * - Soporte completo para modo oscuro
 * - Formato de fechas localizado (es-ES / en-US)
 * 
 * Props requeridas:
 * @prop {Array<Object>} externalData - Array de objetos de pago con estructura:
 *   - id: identificador único
 *   - serialNumber: número de serie del pago
 *   - description: descripción del concepto pagado
 *   - monthPaid: mes pagado (en inglés, se traduce automáticamente)
 *   - year: año del pago
 *   - totalCost: costo total (string con símbolo de moneda)
 * @prop {boolean} loading - Indica si los datos están cargando
 * @prop {string|null} errorMessage - Mensaje de error a mostrar
 * @prop {Object} clientInfoOverride - Información del cliente para la factura
 *   - name: nombre del cliente
 *   - address: dirección del cliente
 * @prop {number} [pageSize=10] - Cantidad de registros por página (opcional)
 * @prop {boolean} [showTotal=true] - Si debe mostrar el total de pagos (opcional, default true)


 * 
 * @author EMA Development Team
 * @version 2.0.0
 */

import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import translations from "../../../translations";
import PaymentDetailsModal from '../../forms/Parent/PaymentDetailsModal';

/**
 * Componente principal de Historial de Pagos
 * 
 * Muestra una tabla paginada con historial de pagos, permite búsqueda,
 * calcula totales y genera facturas imprimibles en formato profesional.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.externalData - Datos de pagos a mostrar
 * @param {boolean} props.loading - Estado de carga
 * @param {string|null} props.errorMessage - Mensaje de error
 * @param {Object} props.clientInfoOverride - Información del cliente
 * @param {number} props.pageSize - Tamaño de página para paginación
 * @param {JSX.Element} props.customFilters - Componente de filtros personalizados
 * @param {boolean} props.showTotal - Si debe mostrar el total de pagos
 * @returns {JSX.Element} Componente HistoryPayments renderizado
 */
export default function HistoryPayments({
  externalData = [],
  loading = false,
  errorMessage = null,
  clientInfoOverride,
  pageSize: pageSizeProp,
  customFilters = null,
  showTotal = true,
}) {
  // Obtener idioma actual del contexto de autenticación
  const { lang } = useAuth();
  // Memoizar traducciones para evitar recálculos innecesarios
  const t = useMemo(() => translations[lang].historyPayments, [lang]);

  // ===== Estado de búsqueda y fechas =====
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  // ===== Estado del modal de detalles =====
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ===== Estado de paginación =====
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(
    Number.isInteger(pageSizeProp) && pageSizeProp > 0 ? pageSizeProp : 10
  );

  /**
   * Effect: Actualiza la fecha actual cada minuto
   * Mantiene la fecha de factura sincronizada con el reloj del sistema
   */
  useEffect(() => {
    setCurrentDate(new Date());
    const interval = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Formatea una fecha según el idioma actual
   * 
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada (ej: "21 de octubre de 2025" o "October 21, 2025")
   */
  const formatDate = (date) =>
    date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  /**
   * Traduce nombres de meses del inglés al idioma actual
   * 
   * Los datos vienen con meses en inglés desde el backend,
   * esta función los traduce para mostrar correctamente en la UI
   * 
   * @param {string} m - Nombre del mes en inglés
   * @returns {string} Nombre del mes traducido
   */
  const translateMonth = (m) => {
    const map = {
      es: {
        January: "Enero",
        February: "Febrero",
        March: "Marzo",
        April: "Abril",
        May: "Mayo",
        June: "Junio",
        July: "Julio",
        August: "Agosto",
        September: "Septiembre",
        October: "Octubre",
        November: "Noviembre",
        December: "Diciembre",
      },
      en: {
        January: "January",
        February: "February",
        March: "March",
        April: "April",
        May: "May",
        June: "June",
        July: "July",
        August: "August",
        September: "September",
        October: "October",
        November: "November",
        December: "December",
      },
    };
    return map[lang]?.[m] || m;
  };

  /**
   * Obtiene las clases CSS para el badge de estado del pago
   * 
   * @param {string} state - Estado del pago
   * @returns {string} Clases CSS para el badge
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
   * 
   * @param {string} state - Estado del pago
   * @returns {string} Texto del estado traducido
   */
  const getStateText = (state) => {
    return t.states?.[state] || t.states?.[state.replace(' ', '_')] || state;
  };

  /**
   * Abre el modal de detalles del pago
   * 
   * @param {Object} payment - Datos del pago
   */
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  // ===== Procesamiento de datos =====
  
  /**
   * Normaliza los datos traduciendo los nombres de meses
   * Crea una copia de los datos con los meses traducidos al idioma actual
   */
  const normalized = externalData.map((p) => ({
    ...p,
    monthPaid: translateMonth(p.monthPaid),
  }));

  /**
   * Filtra los pagos según el término de búsqueda
   * Busca coincidencias en: número de serie, descripción, mes, año y costo total
   */
  const filtered = (Array.isArray(normalized) ? normalized : []).filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.serialNumber?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.monthPaid?.toLowerCase().includes(term) ||
      String(p.year).includes(term) ||
      p.totalCost?.toLowerCase().includes(term)
    );
  });

  /**
   * Effect: Resetea a la primera página cuando cambia el término de búsqueda
   * Evita que el usuario quede en una página vacía al filtrar
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ===== Funciones auxiliares de moneda =====
  
  /**
   * Parsea un valor de moneda a número
   * 
   * Maneja diferentes formatos: números puros, strings con símbolos de moneda,
   * separadores de miles, etc.
   * 
   * @param {string|number} value - Valor a parsear
   * @returns {number} Valor numérico o 0 si no es válido
   */
  const parseAmount = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const n = Number(String(value).replace(/[^\d.,-]/g, "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  /**
   * Detecta automáticamente la moneda basándose en los datos
   * 
   * Examina los símbolos de moneda en los datos:
   * - "Q" para Quetzales (GTQ)
   * - "$" para Dólares (USD)
   * - Si no se detecta símbolo, usa GTQ para español y USD para inglés
   * 
   * @returns {Object} Objeto con code (código ISO) y symbol (símbolo)
   */
  const detectCurrency = () => {
    const sample =
      filtered.find((p) => p?.totalCost)?.totalCost ??
      externalData.find((p) => p?.totalCost)?.totalCost;
    const s = String(sample || "").trim();
    if (s.startsWith("Q")) return { code: "GTQ", symbol: "Q" };
    if (s.startsWith("$")) return { code: "USD", symbol: "$" };
    return lang === "es" ? { code: "GTQ", symbol: "Q" } : { code: "USD", symbol: "$" };
  };

  const { code: currencyCode } = detectCurrency();

  /**
   * Formatea un número como moneda según el idioma y moneda detectada
   * 
   * @param {number} amount - Cantidad a formatear
   * @returns {string} Cantidad formateada con símbolo de moneda
   */
  const formatMoney = (amount) =>
    new Intl.NumberFormat(lang === "es" ? "es-GT" : "en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount || 0);

  // ===== Cálculo de totales =====
  
  /**
   * Calcula el total de todos los pagos filtrados
   * Suma los valores parseados de totalCost para todos los registros visibles
   */
  const totalFiltered = filtered.reduce((acc, p) => acc + parseAmount(p.totalCost), 0);
  const formattedTotalFiltered = formatMoney(totalFiltered);

  // ===== Lógica de paginación =====
  
  // Calcula el número total de páginas basado en los datos filtrados
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Extrae solo los registros de la página actual
  const paginatedData = filtered.slice(startIndex, endIndex);

  /**
   * Cambia a una página específica
   * @param {number} page - Número de página a mostrar
   */
  const handlePageChange = (page) => setCurrentPage(page);
  
  /**
   * Navega a la página anterior
   */
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  
  /**
   * Navega a la página siguiente
   */
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  /**
   * Calcula las páginas visibles en el paginador
   * 
   * Muestra máximo 5 números de página centrados alrededor de la página actual
   * para evitar sobrecargar la UI con demasiados números
   * 
   * @returns {Array<number>} Array con los números de página a mostrar
   */
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      for (let i = start; i <= end; i++) visiblePages.push(i);
    }
    return visiblePages;
  };

  // ===== Función de impresión =====
  
  /**
   * Genera y muestra el diálogo de impresión con formato de factura profesional
   * 
   * Crea un iframe oculto con un documento HTML completo que incluye:
   * - Logo de la academia
   * - Información de la empresa y cliente
   * - Tabla con todos los pagos filtrados (no solo la página actual)
   * - Totales calculados
   * - Estilos profesionales para impresión
   * 
   * El iframe se elimina automáticamente después de cerrar el diálogo de impresión
   */
  const handlePrint = () => {
    // Crear iframe oculto para renderizar el contenido de impresión
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Preparar datos para la factura
    const invoiceDate = formatDate(currentDate);
    const clientName = clientInfoOverride?.name ?? t.invoice.client.name;
    const clientAddress = clientInfoOverride?.address ?? t.invoice.client.address;

    const rows = filtered
      .map(
        (p) => `
          <tr>
            <td>${p.serialNumber}</td>
            <td>${p.description}</td>
            <td>${p.monthPaid}</td>
            <td>${p.year}</td>
            <td style="text-align:right">${p.totalCost}</td>
          </tr>`
      )
      .join("");

    const logoUrl = `${window.location.origin}/LogoColorEMA.svg`;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${t.print.title}</title>
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

      .totals { margin-top: 12px; display: flex; justify-content: flex-end; }
      .totals-box { min-width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; background: #f8fafc; }
      .totals-row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
      .totals-label { color: #0f172a; font-weight: 600; }
      .totals-value { color: #0369a1; font-weight: 700; }

      footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 8px; }
    </style>
  </head>
  <body>
    <header>
      <img src="${logoUrl}" alt="EMA Logo" class="invoice-logo" />
      <div class="print-date">${lang === "es" ? "Fecha de impresión" : "Print Date"}: ${new Date().toLocaleDateString()}</div>
    </header>

    <h1>${t.title}</h1>

    <div class="invoice-header">
      <div class="invoice-section">
        <h3>${t.invoice.from}</h3>
        <div class="company-name">${t.invoice.company.name}</div>
        <div class="company-address">${t.invoice.company.address}</div>
      </div>

      <div class="invoice-section">
        <h3>${t.invoice.to}</h3>
        <div class="client-name">${clientName}</div>
        <div class="client-address">${clientAddress}</div>
      </div>

      <div class="invoice-section">
        <h3>${t.invoice.date}</h3>
        <div>${invoiceDate}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>${t.tableHeaders.serialNumber}</th>
          <th>${t.tableHeaders.description}</th>
          <th>${t.tableHeaders.monthPaid}</th>
          <th>${t.tableHeaders.year}</th>
          <th style="text-align:right">${t.tableHeaders.totalCost}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <div class="totals-label">${lang === "es" ? "Total:" : "Total:"}</div>
          <div class="totals-value">${formattedTotalFiltered}</div>
        </div>
      </div>
    </div>

    <footer>
      © ${new Date().getFullYear()} Ellie's Music Academy}
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

    // Escribir contenido en el iframe
    doc.open();
    doc.write(html);
    doc.close();

    // Limpiar el iframe tras cerrar el diálogo de impresión
    const removeIframe = () => {
      setTimeout(() => {
        if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
        window.removeEventListener("focus", removeIframe);
      }, 500);
    };
    window.addEventListener("focus", removeIframe);
  };

  return (
    <div className="p-6">
      {/* Título */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="mb-4 text-gray-500 dark:text-gray-400">
          {lang === "es" ? "Cargando historial..." : "Loading history..."}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Encabezado factura (en pantalla) */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t.invoice.from}
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium mb-1">{t.invoice.company.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {t.invoice.company.address}
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t.invoice.to}
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium mb-1">
                {clientInfoOverride?.name ?? t.invoice.client.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {clientInfoOverride?.address ?? t.invoice.client.address}
              </div>
            </div>
          </div>

          {/* Fecha de Factura  */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t.invoice.date}
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium mb-1">{formatDate(currentDate)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda + Filtros + Imprimir */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Barra de búsqueda */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            placeholder={t.search.placeholder}
          />
        </div>

        {/* Filtros personalizados (ej: filtro de hijos) */}
        {customFilters && (
          <div className="flex-shrink-0">
            {customFilters}
          </div>
        )}

        {/* Botón de imprimir */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 transition-colors"
        >
          <svg
            className="w-4 h-4 me-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          {t.print.button}
        </button>
      </div>

      {/* Tabla (solo página actual) */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-300">
          <thead className="sticky top-0 z-10 text-xs uppercase text-white bg-cyan-500 border-b-2 border-cyan-500 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-400">
            <tr>
              <th className="px-6 py-3 font-semibold tracking-wide">{t.table?.serialNumber || t.tableHeaders.serialNumber}</th>
              <th className="px-6 py-3 font-semibold tracking-wide">{t.table?.description || t.tableHeaders.description}</th>
              <th className="px-6 py-3 font-semibold tracking-wide">{t.table?.month || t.tableHeaders.monthPaid}</th>
              <th className="px-6 py-3 font-semibold tracking-wide">{t.table?.year || t.tableHeaders.year}</th>
              <th className="px-6 py-3 font-semibold tracking-wide">{t.table?.total || t.tableHeaders.totalCost}</th>
              <th className="px-6 py-3 font-semibold tracking-wide text-center">{t.table?.status || "Estado"}</th>
              <th className="px-6 py-3 font-semibold tracking-wide text-center">{t.table?.actions || "Acciones"}</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((p, idx) => (
              <tr
                key={p.id}
                className={`bg-white border-b border-gray-200 hover:bg-cyan-50/40 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-cyan-900/20 ${
                  idx === paginatedData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {p.serialNumber}
                </th>
                <td className="px-6 py-4">{p.description}</td>
                <td className="px-6 py-4">{p.monthPaid}</td>
                <td className="px-6 py-4">{p.year}</td>
                <td className="px-6 py-4 font-semibold text-cyan-700 dark:text-cyan-400">
                  {p.totalCost}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStateBadge(p.state)}`}>
                    {getStateText(p.state)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewDetails(p)}
                    className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                  >
                    {t.viewDetails || "Ver"}
                  </button>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && !loading && !errorMessage && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {searchTerm ? t.search.noResults : t.noPayments}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* TOTAL en pantalla - Solo se muestra si showTotal es true */}
      {showTotal && (
        <div className="mt-4 flex justify-end">
          <div className="min-w-[260px] px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {lang === "es" ? "Total:" : "Total:"}
              </span>
              <span className="text-base font-bold text-cyan-700 dark:text-cyan-400">
                {formattedTotalFiltered}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav aria-label="Paginación de tabla">
            <ul className="flex items-center -space-x-px h-10 text-base">
              {/* Anterior */}
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === 1
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                      : "text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>

              {/* Números */}
              {getVisiblePages().map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                      currentPage === page
                        ? "z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {/* Siguiente */}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === totalPages
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                      : "text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Modal de Detalles del Pago */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
}
