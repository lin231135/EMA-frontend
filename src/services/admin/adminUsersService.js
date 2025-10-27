// src/services/admin/adminUsersService.js
/**
 * Servicio para gestionar usuarios desde el rol de administrador
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Obtener todos los usuarios (con filtro opcional por rol)
 * @param {Object} options
 * @param {string} options.token - Token JWT del usuario autenticado
 * @param {string} [options.role] - Filtro opcional por rol (padre, maestro, admin, etc.)
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function getUsers({ token, role }) {
  try {
    let url = `${API_BASE}/users`;
    
    // Agregar filtro por rol si se proporciona
    if (role) {
      url += `?role=${encodeURIComponent(role)}`;
    }

    console.log("getUsers - URL:", url);
    console.log("getUsers - Token:", token ? "Present" : "Missing");

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("getUsers - Response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("getUsers - Error response:", error);
      throw new Error(error.message || 'Error al obtener usuarios');
    }

    const data = await response.json();
    console.log("getUsers - Data received:", data);
    return data.users || [];
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
}

/**
 * Obtener los hijos de un padre específico
 * @param {Object} options
 * @param {string} options.token - Token JWT del usuario autenticado
 * @param {number} options.parentId - ID del padre
 * @returns {Promise<Array>} Lista de hijos del padre
 */
export async function getChildrenByParentId({ token, parentId }) {
  try {
    const url = `${API_BASE}/admins/students?parent_id=${parentId}`;
    
    console.log("getChildrenByParentId - URL:", url);
    console.log("getChildrenByParentId - parentId:", parentId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("getChildrenByParentId - Response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("getChildrenByParentId - Error response:", error);
      throw new Error(error.message || 'Error al obtener hijos del padre');
    }

    const data = await response.json();
    console.log("getChildrenByParentId - Data received:", data);
    return data.students || [];
  } catch (error) {
    console.error('Error en getChildrenByParentId:', error);
    throw error;
  }
}

export default {
  getUsers,
  getChildrenByParentId,
};
