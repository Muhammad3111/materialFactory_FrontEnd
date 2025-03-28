import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosIntstance";
import { useUser } from "@/hooks/useUser";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser(); // ✅ contextdan user va logout olish

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleOverlayClick = () => setIsOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const logOut = async () => {
    await api.post("/auth/logout");
    logout(); // ✅ context logout funksiyasini chaqirish
    navigate("/login");
  };

  return (
    <div>
      <Button
        onClick={toggleMenu}
        className="bg-transparent text-black shadow-lg border"
      >
        <MenuIcon size={20} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={handleOverlayClick}
            className="fixed top-0 right-0 h-screen w-full bg-black/30 z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-100 p-4 rounded-l-xl shadow-md flex flex-col gap-6 w-[70%] h-full justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Profil menyusi</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMenu}
                    className="bg-transparent text-red-500"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="flex items-center gap-2 text-lg hover:text-blue-500 transition"
                >
                  <User /> Profil
                </button>

                {/* ✅ Faqat admin uchun Ruxsatlar menyusi */}
                {user?.role === "admin" && (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => handleNavigate("/permissions")}
                      className="flex items-center gap-2 text-lg hover:text-blue-500 transition"
                    >
                      <ShieldCheck /> Ruxsatlar
                    </button>
                    <button
                      onClick={() => handleNavigate("/users")}
                      className="flex items-center gap-2 text-lg hover:text-blue-500 transition"
                    >
                      <Users /> Xodimlar
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={logOut}
                className="flex items-center gap-2 text-lg hover:text-blue-500 transition text-red-500"
              >
                <LogOut /> Chiqish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
