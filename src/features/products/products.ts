import api from "@/api/axiosIntstance";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: Product) => {
  const response = await api.post("/products/create", product);
  return response;
};

export const updateProduct = async (product: Product) => {
  const response = await api.put(`/products/${product.id}`, product);
  return response;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response;
};
