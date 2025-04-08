import api from "@/api/axiosIntstance";

export const getAttandances = async () => {
  const response = await api.get("/attendance/logs");
  return response.data;
};

export const addCheckIn = async () => {
  const response = await api.post("/attendance/check-in");
  return response.data;
};

export const addCheckOut = async () => {
  const response = await api.post("/attendance/check-out");
  return response.data;
};
