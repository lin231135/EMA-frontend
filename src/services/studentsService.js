// src/services/studentsService.js
/**
 * Servicio para gestión de estudiantes (CRUD completo)
 * Endpoints del backend: /api/admins/students
 */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const STUDENTS_ENDPOINT = `${API_BASE}/admins/students`;

/**
 * Obtiene la lista de todos los estudiantes
 * @returns {Promise<Array>} Lista de estudiantes con información básica
 */
export async function getStudents() {
  try {
    const response = await fetch(STUDENTS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener estudiantes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getStudents:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de un estudiante específico
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Object>} Información detallada del estudiante (incluye direcciones, reservas y notas)
 */
export async function getStudentById(studentId) {
  try {
    const response = await fetch(`${STUDENTS_ENDPOINT}/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Estudiante no encontrado');
    }

    const data = await response.json();
    // El backend devuelve { student: {...} }, extraer el objeto student
    return data.student || data;
  } catch (error) {
    console.error(`Error en getStudentById(${studentId}):`, error);
    throw error;
  }
}

/**
 * Crea un nuevo estudiante
 * @param {Object} studentData - Datos del estudiante
 * @param {number} studentData.parent_id - ID del padre (obligatorio)
 * @param {string} studentData.name - Nombre completo (obligatorio)
 * @param {string} studentData.birth_date - Fecha de nacimiento YYYY-MM-DD (obligatorio)
 * @param {boolean} [studentData.is_solvent] - Estado de solvencia (opcional, default: false)
 * @param {Object} [studentData.address] - Dirección del estudiante (opcional)
 * @returns {Promise<Object>} Estudiante creado
 */
export async function createStudent(studentData) {
  try {
    console.log('📤 Datos enviados al backend:', studentData);
    console.log('📤 JSON stringified:', JSON.stringify(studentData, null, 2));
    
    const response = await fetch(STUDENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error del backend:', error);
      console.error('❌ Detalles de validación:', error.details);
      throw new Error(error.error || error.message || 'Error al crear el estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createStudent:', error);
    throw error;
  }
}

/**
 * Actualiza la información de un estudiante existente
 * @param {number} studentId - ID del estudiante
 * @param {Object} studentData - Datos a actualizar (todos los campos son opcionales)
 * @param {string} [studentData.name] - Nombre completo
 * @param {string} [studentData.birth_date] - Fecha de nacimiento YYYY-MM-DD
 * @param {boolean} [studentData.is_solvent] - Estado de solvencia
 * @param {number} [studentData.parent_id] - ID del padre
 * @returns {Promise<Object>} Estudiante actualizado
 */
export async function updateStudent(studentId, studentData) {
  try {
    const response = await fetch(`${STUDENTS_ENDPOINT}/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar el estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en updateStudent(${studentId}):`, error);
    throw error;
  }
}

/**
 * Desactiva un estudiante (soft delete)
 * Esta acción marca is_active=false, cancela clases futuras y agrega una nota
 * @param {number} studentId - ID del estudiante
 * @param {string} [reason] - Razón de desactivación (opcional)
 * @returns {Promise<Object>} Resultado de la desactivación
 */
export async function deactivateStudent(studentId, reason = '') {
  try {
    const response = await fetch(`${STUDENTS_ENDPOINT}/${studentId}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al desactivar el estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en deactivateStudent(${studentId}):`, error);
    throw error;
  }
}

/**
 * Reactiva un estudiante previamente desactivado
 * Esta acción marca is_active=true y agrega una nota explicativa
 * ℹ️ NO restaura las clases canceladas (deben reprogramarse manualmente)
 * @param {number} studentId - ID del estudiante
 * @param {string} [reason] - Razón de reactivación (opcional)
 * @returns {Promise<Object>} Resultado de la reactivación
 */
export async function reactivateStudent(studentId, reason = '') {
  try {
    const response = await fetch(`${STUDENTS_ENDPOINT}/${studentId}/reactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al reactivar el estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en reactivateStudent(${studentId}):`, error);
    throw error;
  }
}

/**
 * Elimina permanentemente un estudiante (hard delete)
 * ⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE
 * Elimina el estudiante, sus reservas, notas y referencias en pagos
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function deleteStudent(studentId) {
  try {
    const response = await fetch(`${STUDENTS_ENDPOINT}/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar el estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en deleteStudent(${studentId}):`, error);
    throw error;
  }
}

/**
 * Obtiene la lista de padres disponibles para asignar a un estudiante
 * @returns {Promise<Array>} Lista de usuarios con rol 'padre'
 */
export async function getAvailableParents() {
  try {
    // Endpoint correcto para obtener usuarios con rol padre
    const response = await fetch(`${API_BASE}/users?role=padre`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Agregar token de autenticación cuando esté disponible
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error al obtener padres' }));
      throw new Error(error.error || 'Error al obtener padres');
    }

    const data = await response.json();
    // Manejar diferentes formatos de respuesta
    return Array.isArray(data) ? data : (data.users || data.parents || []);
  } catch (error) {
    console.error('Error en getAvailableParents:', error);
    // Retornar array vacío si falla
    return [];
  }
}
