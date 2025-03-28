import api from "@/api/axiosIntstance";

export const getPartners = async () => {
  const response = await api.get("/partners");
  return response.data;
};

export const getPartnerById = async (id: string) => {
  const response = await api.get(`/partners/${id}`);
  return response.data;
};

export const addPartner = async (partner: Partners) => {
  const response = await api.post("/partners/create", partner);
  return response.data;
};

export const updatePartner = async (partner: Partners) => {
  const response = await api.put(`/partners/${partner.id}`, partner);
  return response.data;
};

export const deletePartner = async (id: number) => {
  const response = await api.delete(`/partners/${id}`);
  return response.data;
};
