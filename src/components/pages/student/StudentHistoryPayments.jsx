// src/components/pages/student/StudentPayments.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import translations from "../../../translations";
// Agregar imports cuando se conecte
// import { fetchStudentPayments } from "../../../services/paymentService"; // API

export default function StudentHistoryPayments() {
  const { lang } = useAuth();
  const t = translations[lang].studentHistoryPayment; // Módulo de traducción
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para fechas dinámicas
  const [currentDate, setCurrentDate] = useState(new Date());

  // Actualizar fecha cada vez que se entra a la vista
  useEffect(() => {
    // Actualizar la fecha al cargar el componente
    setCurrentDate(new Date());
    
    // Opcional: Actualizar la fecha cada minuto para mantenerla fresca
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60000ms = 1 minuto

    // Limpiar el interval al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Funciones para formatear fechas dinámicamente
  const formatDate = (date) => {
    return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  const getDueDate = () => {
    const dueDate = new Date(currentDate);
    dueDate.setDate(dueDate.getDate() + 30); // 30 días después
    return dueDate;
  };

  // Reemplazar esta sección completa cuando conectes
  // ==================== DATOS FICTICIOS (REMOVER) ====================
  const rawPaymentsData = [
    {
      id: 1,
      serialNumber: "EMA-2024-001",
      description: "Monthly Fee - Piano Lessons", // De la DB (no se traduce)
      monthPaid: "January", // Se traducirá según idioma
      year: "2024",
      totalCost: "$150.00"
    },
    {
      id: 2,
      serialNumber: "EMA-2024-002", 
      description: "Monthly Fee - Piano Lessons", // De la DB (no se traduce)
      monthPaid: "February", // Se traducirá según idioma
      year: "2024",
      totalCost: "$120.00"
    },
    {
      id: 3,
      serialNumber: "EMA-2024-003",
      description: "Monthly Fee - Singing Lessons", // De la DB (no se traduce)
      monthPaid: "March", // Se traducirá según idioma
      year: "2024",
      totalCost: "$180.00"
    },
    {
      id: 4,
      serialNumber: "EMA-2024-004",
      description: "Monthly Fee - Singing Lessons", // De la DB (no se traduce)
      monthPaid: "April", // Se traducirá según idioma
      year: "2024", 
      totalCost: "$100.00"
    }
  ];
  // ==================== FIN DATOS FICTICIOS ====================

  // Descomentar y usar esta sección
  // ==================== CONEXIÓN REAL AL BACKEND ====================
  // const [rawPaymentsData, setRawPaymentsData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // 
  // useEffect(() => {
  //   const loadPayments = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await fetchStudentPayments(); // Tu función de API
  //       setRawPaymentsData(data); // data debe tener la estructura mostrada arriba
  //       setError(null);
  //     } catch (err) {
  //       console.error('Error loading payments:', err);
  //       setError('Error loading payment history');
  //       setRawPaymentsData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   loadPayments();
  // }, []);
  // 
  // // Manejo de estados de carga
  // if (loading) {
  //   return (
  //     <StudentLayout>
  //       <div className="p-6 text-center">
  //         <div className="text-gray-500 dark:text-gray-400">
  //           {t.loadingPayments}
  //         </div>
  //       </div>
  //     </StudentLayout>
  //   );
  // }
  // 
  // if (error) {
  //   return (
  //     <StudentLayout>
  //       <div className="p-6 text-center">
  //         <div className="text-red-500 dark:text-red-400">
  //           {error}
  //         </div>
  //       </div>
  //     </StudentLayout>
  //   );
  // }
  // ==================== FIN CONEXIÓN BACKEND ====================

  // Función para traducir meses
  const translateMonth = (month) => {
    const monthTranslations = {
      es: {
        "January": "Enero",
        "February": "Febrero", 
        "March": "Marzo",
        "April": "Abril",
        "May": "Mayo",
        "June": "Junio",
        "July": "Julio",
        "August": "Agosto",
        "September": "Septiembre",
        "October": "Octubre",
        "November": "Noviembre",
        "December": "Diciembre"
      },
      en: {
        "January": "January",
        "February": "February",
        "March": "March", 
        "April": "April",
        "May": "May",
        "June": "June",
        "July": "July",
        "August": "August",
        "September": "September",
        "October": "October",
        "November": "November",
        "December": "December"
      }
    };
    return monthTranslations[lang]?.[month] || month;
  };

  // Aplicar traducciones solo a los meses
  const translatedPaymentsData = rawPaymentsData.map(payment => ({
    ...payment,
    monthPaid: translateMonth(payment.monthPaid) // Solo traducir el mes
  }));

  // Filtrar datos según término de búsqueda
  const paymentsData = translatedPaymentsData.filter(payment => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      payment.serialNumber.toLowerCase().includes(term) ||
      payment.description.toLowerCase().includes(term) ||
      payment.monthPaid.toLowerCase().includes(term) ||
      payment.year.toString().includes(term) ||
      payment.totalCost.toLowerCase().includes(term)
    );
  });

  // Función para imprimir tabla
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const invoiceDate = formatDate(currentDate);
    const invoiceDueDate = formatDate(getDueDate());
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t.print.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            h1 { text-align: center; color: #374151; margin-bottom: 30px; font-size: 24px; }
            .invoice-header { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin-bottom: 40px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb; }
            .invoice-section h3 { font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #374151; }
            .company-name { font-weight: bold; margin-bottom: 4px; }
            .company-address { font-size: 12px; color: #6b7280; white-space: pre-line; }
            .client-info { font-size: 14px; }
            .client-name { font-weight: bold; margin-bottom: 4px; }
            .client-address { font-size: 12px; color: #6b7280; }
            .dates-section { text-align: right; }
            .date-item { margin-bottom: 12px; }
            .date-label { font-size: 14px; font-weight: bold; color: #374151; }
            .date-value { font-size: 14px; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; color: #374151; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .print-date { text-align: right; margin-bottom: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="print-date">${lang === 'es' ? 'Fecha de impresión' : 'Print Date'}: ${new Date().toLocaleDateString()}</div>
          <h1>${t.title}</h1>
          
          <div class="invoice-header">
            <div class="invoice-section">
              <h3>${t.invoice.from}</h3>
              <div class="company-name">${t.invoice.company.name}</div>
              <div class="company-address">${t.invoice.company.address}</div>
            </div>
            
            <div class="invoice-section">
              <h3>${t.invoice.to}</h3>
              <div class="client-name">${t.invoice.client.name}</div>
              <div class="client-address">${t.invoice.client.address}</div>
            </div>
            
            <div class="invoice-section dates-section">
              <div class="date-item">
                <div class="date-label">${t.invoice.date}</div>
                <div class="date-value">${invoiceDate}</div>
              </div>
              <div class="date-item">
                <div class="date-label">${t.invoice.dueDate}</div>
                <div class="date-value">${invoiceDueDate}</div>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t.tableHeaders.serialNumber}</th>
                <th>${t.tableHeaders.description}</th>
                <th>${t.tableHeaders.monthPaid}</th>
                <th>${t.tableHeaders.year}</th>
                <th>${t.tableHeaders.totalCost}</th>
              </tr>
            </thead>
            <tbody>
              ${paymentsData.map(payment => `
                <tr>
                  <td>${payment.serialNumber}</td>
                  <td>${payment.description}</td>
                  <td>${payment.monthPaid}</td>
                  <td>${payment.year}</td>
                  <td>${payment.totalCost}</td>
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

  // TODO: Reemplazar con llamada a API
  // const paymentsData = await fetchPaymentHistory();

  return (
    <StudentLayout>
      <div className="p-6">
        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        {/* Encabezado de Factura */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna 1: Invoice From */}
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

            {/* Columna 2: Invoice To */}
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t.invoice.to}
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-medium mb-1">{t.invoice.client.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {t.invoice.client.address}
                </div>
              </div>
            </div>

            {/* Columna 3: Fechas */}
            <div className="text-center md:text-right">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {t.invoice.date}
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(currentDate)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {t.invoice.dueDate}
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(getDueDate())}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botón de imprimir */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Barra de búsqueda */}
          <div className="relative max-w-md flex-1">
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
              placeholder={t.search.placeholder}
            />
          </div>
          
          {/* Botón de imprimir */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 transition-colors"
          >
            <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {t.print.button}
          </button>
        </div>

        {/* Tabla de historial de pagos */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t.tableHeaders.serialNumber}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.tableHeaders.description}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.tableHeaders.monthPaid}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.tableHeaders.year}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.tableHeaders.totalCost}
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment, index) => (
                <tr 
                  key={payment.id}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${
                    index === paymentsData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {payment.serialNumber}
                  </th>
                  <td className="px-6 py-4">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4">
                    {payment.monthPaid}
                  </td>
                  <td className="px-6 py-4">
                    {payment.year}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                    {payment.totalCost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje cuando no hay pagos */}
        {paymentsData.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? t.search.noResults : t.noPayments}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}