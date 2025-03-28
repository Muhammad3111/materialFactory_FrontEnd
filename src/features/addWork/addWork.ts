import api from "@/api/axiosIntstance";

export const getAllWorks = async () => {
  const response = await api.get("/work");
  return response.data;
};

export const getWorkById = async (id: string) => {
  const response = await api.get(`/work/${id}`);
  return response.data;
};

export const addWork = async (data: Works) => {
  const response = await api.post("/work/create", data);
  return response.data;
};

export const deleteWork = async (id: number) => {
  const response = await api.delete(`/work/${id}`);
  return response.data;
};
