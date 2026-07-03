import api from "../api/axios";

export const getRooms = async () => {
  const res = await api.get("/rooms");
  return res.data;
};

export const createRoom = async (data) => {
  const res = await api.post("/rooms", data);
  return res.data;
};

export const updateRoom = async (id, data) => {
  const res = await api.put(`/rooms/${id}`, data);
  return res.data;
};

export const deleteRoom = async (id) => {
  const res = await api.delete(`/rooms/${id}`);
  return res.data;
};