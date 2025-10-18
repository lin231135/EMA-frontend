// src/services/childrenService.js

/**
 * @fileoverview Servicio para la gestión de perfiles de hijos vinculados a padres.
 * Proporciona funciones para crear, obtener, actualizar y eliminar perfiles de estudiantes.
 * 
 * ENDPOINTS UTILIZADOS:
 * - GET  /api/parents/profiles  → Obtener perfil del padre y lista de hijos
 * - POST /api/parents/children  → Crear nuevo hijo
 * - PUT  /api/parents/children/:id  → Actualizar hijo (preparado)
 * - DELETE /api/parents/children/:id  → Eliminar hijo (preparado)
 * - PATCH /api/parents/children/:id/archive  → Archivar hijo (preparado)
 * - PATCH /api/parents/children/:id/restore  → Restaurar hijo (preparado)
 */

const API_BASE = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/**
 * Construye los headers de autenticación para las peticiones API.
 * 
 * @param {string} token - Token JWT de autenticación
 * @param {boolean} isJson - Si true, incluye Content-Type: application/json
 * @returns {Object} Headers de la petición
 */
const buildHeaders = (token, isJson = true) => {
  const headers = {
    Accept: "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

/**
 * Procesa la respuesta de la API y lanza errores si es necesario.
 * 
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<Object>} Datos parseados de la respuesta
 * @throws {Error} Si la respuesta no es exitosa
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Si no se puede parsear el error, usar mensaje genérico
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * Servicio de gestión de perfiles de hijos.
 */
export const childrenService = {
  /**
   * Obtiene la lista de todos los hijos vinculados al padre autenticado.
   * Usa el endpoint /api/parents/profiles que retorna el perfil del padre y sus hijos.
   * 
   * @param {string} token - Token de autenticación
   * @param {Function} authFetch - Función de fetch autenticada (opcional)
   * @returns {Promise<Array>} Lista de perfiles de hijos
   * 
   * @example
   * const children = await childrenService.getChildren(token);
   * // [{id: 456, name: "María Pérez", avatarUrl: null, type: "student"}, ...]
   */
  async getChildren(token, authFetch = null) {
    const url = `${API_BASE}/parents/profiles`;
    const fetchFn = authFetch || fetch;
    
    const response = await fetchFn(url, {
      method: "GET",
      headers: buildHeaders(token, false),
    });
    
    const data = await handleResponse(response);
    
    // El endpoint retorna { parent: {...}, children: [...] }
    // Mapeamos los hijos para incluir información adicional si es necesario
    const children = (data.children || []).map(child => ({
      id: child.id,
      name: child.name,
      avatarUrl: child.avatarUrl,
      type: child.type || "student",
      // Campos que podrían venir del backend (preparados para futuro)
      birthDate: child.birthDate,
      isSolvent: child.isSolvent !== undefined ? child.isSolvent : true,
      isActive: child.isActive !== undefined ? child.isActive : true,
      createdAt: child.createdAt,
    }));
    
    return children;
  },

  /**
   * Crea un nuevo perfil de hijo vinculado al padre autenticado.
   * 
   * @param {Object} childData - Datos del hijo a crear
   * @param {string} childData.name - Nombre completo (2-255 caracteres)
   * @param {string} childData.birth_date - Fecha de nacimiento en formato YYYY-MM-DD
   * @param {string} token - Token de autenticación
   * @param {Function} authFetch - Función de fetch autenticada (opcional)
   * @returns {Promise<Object>} Perfil del hijo creado
   * 
   * @example
   * const child = await childrenService.createChild(
   *   { name: "Juan Pérez", birth_date: "2016-05-20" },
   *   token
   * );
   */
  async createChild(childData, token, authFetch = null) {
    const url = `${API_BASE}/parents/children`;
    const fetchFn = authFetch || fetch;
    
    const response = await fetchFn(url, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(childData),
    });
    
    const data = await handleResponse(response);
    return data.child;
  },
};
