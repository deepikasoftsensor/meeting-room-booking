import api from "../api/axios";
export const signupCompany = async (data) => { const res = await api.post("/auth/signup/company", data); return res.data; };
export const signupJoin = async (data) => { const res = await api.post("/auth/signup/join", data); return res.data; };
export const loginUser = async (data) => { const res = await api.post("/auth/login", data); return res.data; };
export const getMe = async () => { const res = await api.get("/auth/me"); return res.data; };
