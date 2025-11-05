// src/services/teacher/materialService.js
/**
 * @file materialService.js
 * @description Servicio para interactuar con la API de materiales educativos
 * 
 * Proporciona funciones para:
 * - Crear materiales (con archivos)
 * - Obtener listado de materiales
 * - Obtener material por ID
 * - Actualizar materiales
 * - Eliminar materiales
 * 
 * @author EMA Frontend Team
 * @version 1.0.0
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Crea un nuevo material educativo
 * 
 * @param {FormData} formData - Datos del material (debe incluir: teacher_course_id, title, description, file)
 * @returns {Promise<Object>} Material creado
 * @throws {Error} Si hay error en la creación
 */
export const createMaterial = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/teachers/materials`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // NO incluir 'Content-Type' - el navegador lo establece automáticamente con boundary para FormData
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear material');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createMaterial:', error);
    throw error;
  }
};

/**
 * Obtiene todos los materiales
 * 
 * @returns {Promise<Array>} Lista de materiales
 * @throws {Error} Si hay error en la obtención
 */
export const getAllMaterials = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/teachers/materials`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener materiales');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllMaterials:', error);
    throw error;
  }
};

/**
 * Obtiene un material por su ID
 * 
 * @param {number} id - ID del material
 * @returns {Promise<Object>} Material encontrado
 * @throws {Error} Si hay error o no se encuentra el material
 */
export const getMaterialById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/teachers/materials/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener material');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getMaterialById:', error);
    throw error;
  }
};

/**
 * Actualiza un material existente
 * 
 * @param {number} id - ID del material
 * @param {FormData} formData - Datos actualizados (puede incluir: title, description, file)
 * @returns {Promise<Object>} Material actualizado
 * @throws {Error} Si hay error en la actualización
 */
export const updateMaterial = async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/teachers/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // NO incluir 'Content-Type' para FormData
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar material');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateMaterial:', error);
    throw error;
  }
};

/**
 * Elimina un material
 * 
 * @param {number} id - ID del material a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 * @throws {Error} Si hay error en la eliminación
 */
export const deleteMaterial = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/teachers/materials/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar material');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteMaterial:', error);
    throw error;
  }
};