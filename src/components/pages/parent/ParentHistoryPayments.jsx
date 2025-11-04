// src/components/pages/parent/ParentHistoryPayments.jsx
/**
 * @file ParentHistoryPayments.jsx
 * @description Wrapper de historial de pagos para el rol de Padre
 * 
 * Características principales:
 * - Envuelve el componente genérico HistoryPayments con ParentLayout
 * - Obtiene el historial de pagos desde el backend mediante API
 * - Normaliza y pasa los datos al componente genérico vía props
 * - Filtro por hijo para mejor planificación de gastos
 * - Inyecta automáticamente la información del padre como cliente en la factura
 * - Maneja estados de carga y errores
 * - Actualiza datos automáticamente al cambiar de hijo seleccionado
 * 
 * Historia de Usuario:
 * "Como Padre, quiero filtrar mi historial de pagos por hijo para tener una mejor planificación de gastos"
 */

import { useEffect, useMemo, useState } from "react";
import ParentLayout from "../../layout/parent/ParentLayout";
import HistoryPayments from "../app/HistoryPayments";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchParentPayments } from "../../../services/app/paymentService";
import { getMyChildren } from "../../../services/parent/parentService";
import translations from "../../../translations";

/**
 * Componente de Historial de Pagos para Padres
 * 
 * Wrapper que adapta el componente genérico HistoryPayments para el contexto
 * de padres/tutores. Gestiona la obtención de datos desde la API y los inyecta
 * al componente de visualización.
 * 
 * Flujo de datos:
 * 1. Obtiene información del usuario autenticado (padre) desde AuthContext
 * 2. Carga la lista de hijos del padre
 * 3. Permite seleccionar un hijo específico para filtrar pagos
 * 4. Llama a la API fetchParentPayments con los parámetros necesarios
 * 5. Normaliza la información del cliente para la factura
 * 6. Pasa todos los datos al componente genérico HistoryPayments
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
  const t = translations[lang].historyPayments;
  
  // ===== Estado del componente =====
  
  const [loading, setLoading] = useState(true); // Estado de carga de pagos
  const [externalData, setExternalData] = useState([]); // Datos de pagos del backend
  const [error, setError] = useState(null); // Mensaje de error si falla la petición
  
  // Estados para el filtro de hijos
  const [children, setChildren] = useState([]); // Lista de hijos del padre
  const [loadingChildren, setLoadingChildren] = useState(true); // Estado de carga de hijos
  const [selectedKidId, setSelectedKidId] = useState(null); // ID del hijo seleccionado (null = todos)

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

  // ===== Effect: Cargar lista de hijos =====
  
  /**
   * Effect que obtiene la lista de hijos del padre desde el backend
   * Se ejecuta una sola vez al montar el componente
   */
  useEffect(() => {
    let alive = true;
    
    async function loadChildren() {
      try {
        setLoadingChildren(true);
        const kidsData = await getMyChildren(token);
        
        if (!alive) return;
        setChildren(kidsData);
      } catch (err) {
        console.error('Error loading children:', err);
        // No mostramos error crítico, solo no habrá filtro disponible
      } finally {
        if (!alive) return;
        setLoadingChildren(false);
      }
    }
    
    loadChildren();
    
    return () => {
      alive = false;
    };
  }, [token]);

  // ===== Effect: Carga de datos de pagos desde la API =====
  
  /**
   * Effect que obtiene el historial de pagos del padre desde el backend
   * 
   * Se ejecuta cuando cambian: token, selectedKidId o lang
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
        const data = await fetchParentPayments({ 
          token, 
          kidId: selectedKidId, // Puede ser null para todos los hijos
          lang 
        });
        
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
  }, [token, selectedKidId, lang]); // Dependencias: recarga al cambiar estos valores
  
  /**
   * Handler para cambiar el hijo seleccionado
   */
  const handleKidChange = (e) => {
    const value = e.target.value;
    setSelectedKidId(value === "" ? null : Number(value));
  };
  
  /**
   * Componente del filtro de hijos para pasar a HistoryPayments
   */
  const childrenFilter = children.length > 0 ? (
    <div className="flex items-center gap-2">
      <select
        value={selectedKidId || ""}
        onChange={handleKidChange}
        disabled={loadingChildren}
        className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">
          {loadingChildren ? t.filters.loadingChildren : t.filters.allChildren}
        </option>
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </select>
      
      {/* Botón para limpiar filtro */}
      {selectedKidId && (
        <button
          onClick={() => setSelectedKidId(null)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 rounded-lg hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/50 transition-colors"
          title={lang === "es" ? "Limpiar filtro" : "Clear filter"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">{children.find(c => c.id === selectedKidId)?.name}</span>
        </button>
      )}
    </div>
  ) : null;
  
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
        customFilters={childrenFilter}        // Filtro de hijos personalizado
        showTotal={false}                     // Ocultar total para padres (estrategia de negocio)
      />
    </ParentLayout>
  );
}
