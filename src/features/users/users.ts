import api from "@/api/axiosIntstance";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const addUser = async (user: User) => {
  const response = await api.post("/auth/register", user);
  return response;
};

export const updateUser = async (user: User) => {
  const response = await api.put(`users/${user.id}`, user);
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`users/${id}`);
  return response;
};
