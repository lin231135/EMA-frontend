// src/components/pages/parent/ParentHistoryPayments.jsx
/**
 * @file ParentHistoryPayments.jsx
 * @description Wrapper de historial de pagos para el rol de Padre
 * 
 * Características principales:
 * - Envuelve el componente genérico HistoryPayments con ParentLayout
 * - Obtiene el historial de pagos desde el backend mediante API
 * - Normaliza y pasa los datos al componente genérico vía props
 * - Soporta filtrado opcional por hijo específico mediante query param ?kid_id=
 * - Inyecta automáticamente la información del padre como cliente en la factura
 * - Maneja estados de carga y errores
 * - Actualiza datos automáticamente al cambiar de hijo seleccionado
 * 
 * Query Parameters:
 * @queryparam {string} kid_id - ID opcional del hijo para filtrar pagos específicos
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ParentLayout from "../../layout/parent/ParentLayout";
import HistoryPayments from "../app/HistoryPayments";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchParentPayments } from "../../../services/app/paymentService";

/**
 * Componente de Historial de Pagos para Padres
 * 
 * Wrapper que adapta el componente genérico HistoryPayments para el contexto
 * de padres/tutores. Gestiona la obtención de datos desde la API y los inyecta
 * al componente de visualización.
 * 
 * Flujo de datos:
 * 1. Obtiene información del usuario autenticado (padre) desde AuthContext
 * 2. Lee el query parameter kid_id si existe (para filtrar por hijo)
 * 3. Llama a la API fetchParentPayments con los parámetros necesarios
 * 4. Normaliza la información del cliente para la factura
 * 5. Pasa todos los datos al componente genérico HistoryPayments
 * 
 * @returns {JSX.Element} Componente ParentHistoryPayments renderizado
 */
export default function ParentHistoryPayments() {
  // ===== Hooks de contexto y navegación =====
  
  /**
   * Obtiene datos del usuario autenticado, token y idioma
   * user: {id, name, last_name, role}
   * token: JWT para autenticación en API
   * lang: idioma actual ('es' o 'en')
   */
  const { user, token, lang } = useAuth();
  
  // Lee parámetros de la URL (ejemplo: ?kid_id=123)
  const [params] = useSearchParams();
  
  // ===== Estado del componente =====
  
  const [loading, setLoading] = useState(true); // Estado de carga
  const [externalData, setExternalData] = useState([]); // Datos de pagos del backend
  const [error, setError] = useState(null); // Mensaje de error si falla la petición

  // Extrae el ID del hijo desde los query params (opcional)
  const kidId = params.get("kid_id");

  // ===== Información del cliente para la factura =====
  
  /**
   * Construye la información del cliente que se mostrará en el bloque "Invoice To"
   * de la factura impresa.
   * 
   * Memoizado para evitar recálculos innecesarios cuando no cambian las dependencias
   */
  const clientInfo = useMemo(
    () => ({
      // Nombre completo del padre (combina name y last_name)
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
   * Effect que obtiene el historial de pagos del padre desde el backend
   * 
   * Se ejecuta cuando cambian: token, kidId o lang
   * 
   * Proceso:
   * 1. Activa el estado de carga
   * 2. Limpia errores previos
   * 3. Llama a fetchParentPayments con los parámetros actuales
   * 4. Actualiza el estado con los datos recibidos
   * 5. Maneja errores si la petición falla
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
        // Llamada a la API con parámetros actuales
        const data = await fetchParentPayments({ token, kidId, lang });
        
        // Solo actualiza si el componente sigue montado
        if (!alive) return;
        setExternalData(data);
      } catch (err) {
        // Manejo de errores
        if (!alive) return;
        setError(err?.message || "Error fetching parent payments");
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
  }, [token, kidId, lang]); // Dependencias: recarga al cambiar estos valores
  
  return (
    // Layout específico para padres (incluye sidebar, navbar, etc.)
    <ParentLayout>
      {/* Componente genérico de historial de pagos */}
      {/* Se le inyectan los datos obtenidos desde la API del padre */}
      <HistoryPayments
        externalData={externalData}           // Datos de pagos normalizados
        loading={loading}                     // Estado de carga
        errorMessage={error}                  // Mensaje de error si existe
        clientInfoOverride={clientInfo}       // Info del padre para la factura
      />
    </ParentLayout>
  );
}
