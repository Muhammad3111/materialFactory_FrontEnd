import api from "@/api/axiosIntstance";
import { InventoryProductForm } from "@/pages/inventory/AddProductToInventory";
import { UpdateInventoryProductForm } from "@/pages/inventory/UpdateInventoryProduct";

export const getIncomingProducts = async () => {
  const response = await api.get("inventoryLogs/incoming");
  return response.data;
};

export const getInventoryProductById = async (id: string) => {
  const response = await api.get(`inventoryLogs/${id}`);
  return response.data;
};

export const getOutgoingProducts = async () => {
  const response = await api.get("inventoryLogs/outgoing");
  return response.data;
};

export const addProductToInventory = async (product: InventoryProductForm) => {
  const response = await api.post(`/inventory/${product.type}`, product);
  return response;
};

export const updateInventoryProduct = async (
  product: UpdateInventoryProductForm
) => {
  const response = await api.put(`/inventoryLogs/${product.id}`, product);
  return response;
};

export const deleteInventoryProduct = async (id: string) => {
  const response = await api.delete(`/inventoryLogs/${id}`);
  return response;
};
