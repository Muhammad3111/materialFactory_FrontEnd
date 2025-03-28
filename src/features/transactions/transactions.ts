import api from "@/api/axiosIntstance";
import { TransactionForm } from "@/pages/transactions/AddTransaction";

export const addTransaction = async (data: TransactionForm) => {
  const response = await api.post("/transactions/create", data);
  return response.data;
};

export const getAllTransactions = async (phone?: string) => {
  const response = await api.get(`/transactions?phone=${phone}`);
  if (response.status === 404) {
    return [];
  } else {
    return response.data;
  }
};

export const getTransactionById = async (id: string) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};
