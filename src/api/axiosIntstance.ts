import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Agar kerak bo'lsa, cookielarni yuborish uchun
});

// Interceptor - Har bir javobni tekshiramiz
api.interceptors.response.use(
  (response) => response, // Agar status 200-299 bo'lsa, hech narsa qilmaymiz
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Foydalanuvchini login sahifasiga yo'naltiramiz
        window.location.href = "/login";
      }

      if (status === 403) {
        // Toast orqali warning ko'rsatamiz
        toast.warn("Sizda ushbu amalni bajarishga ruxsat yo'q!");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
