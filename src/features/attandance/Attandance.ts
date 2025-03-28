import api from "@/api/axiosIntstance";

export const getAttandances = async () => {
  const response = await api.get("/attendances");
  return response.data;
};

export const addCheckIn = async () => {
  const response = await api.post("/attendances/check-in");
  return response.data;
};

export const addCheckOut = async () => {
  const response = await api.post("/attendances/check-out");
  return response.data;
};
