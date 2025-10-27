// src/services/parent/parentService.js
/**
 * Servicio para operaciones relacionadas con padres
 */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

/**
 * Obtiene la lista de hijos del padre autenticado
 * @param {string} token - Token JWT del padre
 * @returns {Promise<Array>} Lista de hijos
 */
export async function getMyChildren(token) {
  try {
    const response = await fetch(`${API_BASE}/parents/dashboard/children`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los hijos');
    }

    const data = await response.json();
    return data.children || [];
  } catch (error) {
    console.error('Error en getMyChildren:', error);
    throw error;
  }
}
