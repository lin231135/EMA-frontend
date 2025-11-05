// src/services/app/bookingsService.js
// Crea una reserva: POST /api/bookings
// Body mínimo: { schedule_id, kid_id?, note? }

export async function createBooking({ schedule_id, kid_id, note }, { token } = {}) {
  if (!schedule_id) throw new Error("schedule_id es requerido");

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:5000/api";

  const url = `${baseUrl}/bookings`;
  const body = {
    schedule_id,
    ...(kid_id ? { kid_id } : {}),
    ...(note != null && note !== "" ? { note } : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let payload;
    try { payload = await res.json(); } catch { payload = {}; }
    const msg = payload?.message || payload?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json(); // booking creado
}
