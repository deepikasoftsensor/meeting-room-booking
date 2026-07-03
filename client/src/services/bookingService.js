import api from "../api/axios";
export const getBookings = async () => { const res = await api.get("/bookings"); return res.data; };
export const createBooking = async (data) => { const res = await api.post("/bookings", data); return res.data; };
export const cancelBooking = async (id) => { const res = await api.put(`/bookings/${id}/cancel`); return res.data; };
