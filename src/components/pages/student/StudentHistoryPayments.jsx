// src/components/pages/student/StudentHistoryPayments.jsx
/**
 * @file StudentHistoryPayments.jsx
 * @description Wrapper de historial de pagos para el rol de Estudiante adulto
 * 
 * Características principales:
 * - Envuelve el componente genérico HistoryPayments con StudentLayout
 * - Obtiene el historial de pagos del estudiante desde el backend mediante API
 * - Normaliza y pasa los datos al componente genérico vía props
 * - Inyecta automáticamente la información del estudiante como cliente en la factura
 * - Maneja estados de carga y errores
 * - Actualiza datos automáticamente al cambiar el idioma
 * 
 * Diferencias con ParentHistoryPayments:
 * - No requiere filtro por hijo (el estudiante solo ve sus propios pagos)
 * - Usa StudentLayout en lugar de ParentLayout
 * - Llama a fetchStudentPayments en lugar de fetchParentPayments
 */

import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layout/student/StudentLayout";
import HistoryPayments from "../app/HistoryPayments";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchStudentPayments } from "../../../services/app/paymentService";

/**
 * Componente de Historial de Pagos para Estudiantes
 * 
 * Wrapper que adapta el componente genérico HistoryPayments para el contexto
 * de estudiantes adultos. Gestiona la obtención de datos desde la API y los inyecta
 * al componente de visualización.
 * 
 * Flujo de datos:
 * 1. Obtiene información del usuario autenticado (estudiante) desde AuthContext
 * 2. Llama a la API fetchStudentPayments con el token y el idioma
 * 3. Normaliza la información del cliente para la factura
 * 4. Pasa todos los datos al componente genérico HistoryPayments
 * 
 * @returns {JSX.Element} Componente StudentHistoryPayments renderizado
 */
export default function StudentHistoryPayments() {
  // ===== Hooks de contexto =====
  
  /**
   * Obtiene datos del usuario autenticado, token y idioma
   * user: {id, name, last_name, role}
   * token: JWT para autenticación en API
   * lang: idioma actual ('es' o 'en')
   */
  const { user, token, lang } = useAuth();
  
  // ===== Estado del componente =====
  
  const [loading, setLoading] = useState(true); // Estado de carga
  const [externalData, setExternalData] = useState([]); // Datos de pagos del backend
  const [error, setError] = useState(null); // Mensaje de error si falla la petición

  // ===== Información del cliente para la factura =====
  
  /**
   * Construye la información del cliente que se mostrará en el bloque "Invoice To"
   * de la factura impresa.
   * 
   * Para estudiantes, el cliente es el propio estudiante (no un padre)
   * 
   * Memoizado para evitar recálculos innecesarios cuando no cambian las dependencias
   */
  const clientInfo = useMemo(
    () => ({
      // Nombre completo del estudiante (combina name y last_name)
      name: `${user?.name ?? ""} ${user?.last_name ?? ""}`.trim(),
      // Dirección por defecto (puede personalizarse si se tiene en base de datos)
      address:
        lang === "es"
          ? "Ciudad de Guatemala"
          : "Guatemala City",
    }),
    [user, lang]
  );

  // ===== Effect: Carga de datos desde la API =====
  
  /**
   * Effect que obtiene el historial de pagos del estudiante desde el backend
   * 
   * Se ejecuta cuando cambian: token o lang
   * 
   * Proceso:
   * 1. Activa el estado de carga
   * 2. Limpia errores previos
   * 3. Llama a fetchStudentPayments con el token y el idioma actuales
   * 4. Actualiza el estado con los datos recibidos
   * 5. Maneja errores si la petición falla
   * 
   * Nota: A diferencia del componente de padres, no necesita kidId
   * porque el estudiante solo accede a sus propios pagos
   * 
   * Cleanup: usa flag 'alive' para evitar actualizaciones de estado
   * si el componente se desmonta antes de que termine la petición
   */
  useEffect(() => {
    let alive = true; // Flag para evitar memory leaks
    
    async function load() {
      setLoading(true);
      setError(null);
      
      try {
        // Llamada a la API específica para estudiantes
        const data = await fetchStudentPayments({ token, lang });
        
        // Solo actualiza si el componente sigue montado
        if (!alive) return;
        setExternalData(data);
      } catch (err) {
        // Manejo de errores
        if (!alive) return;
        setError(err?.message || "Error fetching student payments");
      } finally {
        // Desactiva loading en cualquier caso
        if (!alive) return;
        setLoading(false);
      }
    }
    
    load();
    
    // Cleanup: marca el componente como desmontado
    return () => {
      alive = false;
    };
  }, [token, lang]); // Dependencias: recarga al cambiar estos valores

  // ===== Renderizado =====
  
  return (
    // Layout específico para estudiantes (incluye sidebar, navbar, etc.)
    <StudentLayout>
      {/* Componente genérico de historial de pagos */}
      {/* Se le inyectan los datos obtenidos desde la API del estudiante */}
      <HistoryPayments
        externalData={externalData}           // Datos de pagos normalizados
        loading={loading}                     // Estado de carga
        errorMessage={error}                  // Mensaje de error si existe
        clientInfoOverride={clientInfo}       // Info del estudiante para la factura
        showTotal={false}                     // Ocultar el total al final
      />
    </StudentLayout>
  );
}
