import api from "@/api/axiosIntstance";

export const getPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

export const getPermissionById = async (id: string) => {
  const response = await api.get(`/permissions/${id}`);
  return response.data;
};

export const addPermission = async (data: PermissionTypes) => {
  const response = await api.post("/permissions/create", data);
  return response.data;
};

export const updatePermission = async (data: PermissionTypes) => {
  const response = await api.put(`/permissions/${data.id}`, data);
  return response.data;
};

export const deletePermission = async (id: string) => {
  const response = await api.delete(`/permissions/${id}`);
  return response.data;
};
