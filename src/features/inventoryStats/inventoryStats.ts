import api from "@/api/axiosIntstance";

export const getInvetoryStats = async () => {
  const response = await api.get("/inventoryStats");
  return response.data;
};
