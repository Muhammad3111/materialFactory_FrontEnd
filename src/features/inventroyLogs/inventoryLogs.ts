import api from "@/api/axiosIntstance";

export const getIncomingProducts = async () => {
  const response = await api.get("inventoryLogs/incoming");
  return response.data;
};

export const getOutgoingProducts = async () => {
  const response = await api.get("inventoryLogs/outgoing");
  return response.data;
};
