import api from "../api/axios";

export const getCompanyDashboard = async () => {
  const res = await api.get("/company/dashboard");
  return res.data;
};

export const getMembers = async () => {
  const res = await api.get("/company/members");
  return res.data;
};

export const inviteMember = async (data) => {
  const res = await api.post("/company/invite", data);
  return res.data;
};