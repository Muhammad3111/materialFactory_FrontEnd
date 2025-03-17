import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser konteksi UserProvider ichida ishlatilishi kerak!");
  }
  return context;
};
