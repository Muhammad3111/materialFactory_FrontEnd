import api from "@/api/axiosIntstance";

export const getInvetoryStats = async () => {
  const response = await api.get("/inventory/stats");
  return response.data;
};
