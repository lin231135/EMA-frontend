// src/services/app/coursesService.js
// Servicio para obtener cursos activos desde el backend EMA.

export async function getActiveCourses({ token } = {}) {
  // VITE_API_URL ya incluye /api, solo agregamos el endpoint específico
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000/api';
  const url = `${baseUrl}/courses`;

  console.log('[coursesService] Fetching courses from:', url);
  console.log('[coursesService] Token present:', !!token);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },

  });

  console.log('[coursesService] Response status:', res.status);

  // Manejo de errores estándar
  if (!res.ok) {
    let payload;
    try {
      payload = await res.json();
      console.error('[coursesService] Error response:', payload);
    } catch {
      payload = { message: 'Error desconocido del servidor' };
    }
    const msg = payload?.message || payload?.error || `Error HTTP ${res.status}`;
    
    // Si es 401, el token expiró o es inválido
    if (res.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    
    throw new Error(msg);
  }

  const data = await res.json();
  console.log('[coursesService] Data received:', data);
  
  // El backend devuelve { message, count, courses: [...] }
  const coursesList = Array.isArray(data?.courses) 
    ? data.courses 
    : (Array.isArray(data) ? data : []);
  
  console.log('[coursesService] Courses parsed:', coursesList.length, 'courses');
  return coursesList;
}
