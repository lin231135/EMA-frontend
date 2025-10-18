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
   * Actualiza un perfil de hijo existente.
   * 
   * @param {number} childId - ID del hijo
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Perfil actualizado
   * @throws {Error} Si la actualización falla
   * 
   * @example
   * await updateChild(1, { name: "Ana María López" });
   */
  const updateChild = useCallback(async (childId, childData) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      const updated = await childrenService.updateChild(childId, childData, token, authFetch);
      
      // Actualizar lista local
      setChildren(prev =>
        prev.map(child => child.id === childId ? updated : child)
      );
      
      return updated;
    } catch (err) {
      console.error("Error actualizando hijo:", err);
      setError(err.message || "Error al actualizar el perfil");
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [token, authFetch]);

  /**
   * Elimina un perfil de hijo.
   * 
   * @param {number} childId - ID del hijo a eliminar
   * @returns {Promise<void>}
   * @throws {Error} Si la eliminación falla
   * 
   * @example
   * await deleteChild(1);
   */
  const deleteChild = useCallback(async (childId) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      await childrenService.deleteChild(childId, token, authFetch);
      
      // Remover de la lista local
      setChildren(prev => prev.filter(child => child.id !== childId));
    } catch (err) {
      console.error("Error eliminando hijo:", err);
      setError(err.message || "Error al eliminar el perfil");
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [token, authFetch]);

  /**
   * Archiva un perfil de hijo (establece isActive = false).
   * 
   * @param {number} childId - ID del hijo a archivar
   * @returns {Promise<Object>} Perfil archivado
   * @throws {Error} Si el archivado falla
   * 
   * @example
   * await archiveChild(1);
   */
  const archiveChild = useCallback(async (childId) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      const archived = await childrenService.archiveChild(childId, token, authFetch);
      
      // Actualizar lista local
      setChildren(prev => 
        prev.map(child => child.id === childId ? archived : child)
      );
      
      return archived;
    } catch (err) {
      console.error("Error archivando hijo:", err);
      setError(err.message || "Error al archivar el perfil");
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [token, authFetch]);

  /**
   * Restaura un perfil de hijo archivado (establece isActive = true).
   * 
   * @param {number} childId - ID del hijo a restaurar
   * @returns {Promise<Object>} Perfil restaurado
   * @throws {Error} Si la restauración falla
   * 
   * @example
   * await restoreChild(1);
   */
  const restoreChild = useCallback(async (childId) => {
    if (!token) throw new Error("No autenticado");

    try {
      setOperationLoading(true);
      setError(null);

      const restored = await childrenService.restoreChild(childId, token, authFetch);
      
      // Actualizar lista local
      setChildren(prev => 
        prev.map(child => child.id === childId ? restored : child)
      );
      
      return restored;
    } catch (err) {
      console.error("Error restaurando hijo:", err);
      setError(err.message || "Error al restaurar el perfil");
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
