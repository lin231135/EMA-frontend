// src/services/app/schedulesService.js
// Lista horarios (futuros) para un curso: GET /api/schedules/:courseId

export async function getSchedulesByCourse(courseId, { token } = {}) {
  if (!courseId) throw new Error("courseId es requerido");

  // Igual que coursesService: VITE_API_URL ya incluye /api en tu proyecto
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:5000/api";

  const url = `${baseUrl}/schedules/${encodeURIComponent(courseId)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let payload;
    try { payload = await res.json(); } catch { payload = {}; }
    const msg = payload?.message || payload?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  // backend devuelve { message, count, schedules: [ { id, scheduleDate, startTime, endTime } ] }
  return Array.isArray(data?.schedules) ? data.schedules : [];
}
