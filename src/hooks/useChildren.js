// src/hooks/useChildren.js

/**
 * @fileoverview Hook personalizado para gestión de perfiles de hijos.
 * Maneja estado, operaciones CRUD y notificaciones para la gestión de estudiantes vinculados.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { childrenService } from "../services/childrenService";

/**
 * Hook para gestionar perfiles de hijos vinculados a un padre.
 * 
 * Proporciona funcionalidades para:
 * - Cargar lista de hijos
 * - Crear nuevos perfiles
 * - Actualizar perfiles existentes
 * - Eliminar perfiles
 * - Archivar/restaurar perfiles
 * - Gestionar estados de carga y errores
 * 
 * @returns {Object} Estado y funciones de gestión
 * 
 * @example
 * const {
 *   children,
 *   loading,
 *   error,
 *   addChild,
 *   updateChild,
 *   deleteChild,
 *   archiveChild,
 *   restoreChild,
 *   refresh
 * } = useChildren();
 */
export function useChildren() {
  const { token, authFetch } = useAuth();

  /* ==================
     ESTADO
     ================== */
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  /* ==================
     CARGA INICIAL
     ================== */
  
  /**
   * Carga la lista de hijos desde el backend.
   */
  const loadChildren = useCallback(async () => {
    if (!token) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await childrenService.getChildren(token, authFetch);
      setChildren(data);
    } catch (err) {
      console.error("Error cargando perfiles de hijos:", err);
      setError(err.message || "Error al cargar los perfiles");
    } finally {
      setLoading(false);
    }
  }, [token, authFetch]);

  // Cargar al montar el componente
  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  /* ==================
     OPERACIONES CRUD
     ================== */

  /**
   * Crea un nuevo perfil de hijo.
   * 
   * @param {Object} childData - Datos del hijo
   * @param {string} childData.name - Nombre completo
   * @param {string} childData.birth_date - Fecha de nacimiento (YYYY-MM-DD)
   * @returns {Promise<Object>} Perfil creado
   * @throws {Error} Si la creación falla
   * 
   * @example
   * await addChild({ name: "Ana López", birth_date: "2014-03-10" });
   */
  const addChild = useCallback(async (childData) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      const newChild = await childrenService.createChild(childData, token, authFetch);
      
      // Actualizar lista local
      setChildren(prev => [...prev, newChild]);
      
      return newChild;
    } catch (err) {
      console.error("Error creando hijo:", err);
      setError(err.message || "Error al crear el perfil");
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [token, authFetch]);

  /**
   * Recarga la lista de hijos desde el servidor.
   */
  const refresh = useCallback(() => {
    loadChildren();
  }, [loadChildren]);

  /* ==================
     RETURN
     ================== */
  return {
    // Estado
    children,
    loading,
    error,
    operationLoading,
    
    // Operaciones
    addChild,
    updateChild,
    deleteChild,
    archiveChild,
    restoreChild,
    refresh,
  };
}
