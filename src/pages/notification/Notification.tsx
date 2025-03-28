import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Bell,
  Archive,
  DollarSign,
  CheckCircle,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("http://localhost:5000"); // ✅ server manzilini moslashtir

interface NotificationItem {
  id: number;
  type:
    | "inventory_updated"
    | "transaction_updated"
    | "attendance_checkin"
    | "attendance_checkout"
    | "new_work_report";
  timestamp: Date;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sound] = useState(() => new Audio("/notification.wav"));

  useEffect(() => {
    socket.on("notification", (data: NotificationItem) => {
      sound.play();
      setNotifications((prev) => [...prev, { ...data, timestamp: new Date() }]);
    });

    return () => {
      socket.off("notification");
    };
  }, [sound]);

  const getStyle = (type: NotificationItem["type"]) => {
    switch (type) {
      case "inventory_updated":
        return {
          text: "Omborga mahsulot qo‘shildi yoki chiqdi",
          icon: <Archive size={18} />,
          bg: "bg-blue-100 border-blue-400 text-blue-800",
        };
      case "transaction_updated":
        return {
          text: "Yangi tranzaksiya amalga oshirildi",
          icon: <DollarSign size={18} />,
          bg: "bg-green-100 border-green-400 text-green-800",
        };
      case "attendance_checkin":
        return {
          text: "Xodim ishga keldi",
          icon: <CheckCircle size={18} />,
          bg: "bg-emerald-100 border-emerald-400 text-emerald-800",
        };
      case "attendance_checkout":
        return {
          text: "Xodim ishdan ketdi",
          icon: <LogOut size={18} />,
          bg: "bg-yellow-100 border-yellow-400 text-yellow-800",
        };
      case "new_work_report":
        return {
          text: "Bajarilgan ish haqida yangi xabar",
          icon: <LogOut size={18} />,
          bg: "bg-red-100 border-red-400 text-red-800",
        };
      default:
        return {
          text: "Yangi xabar",
          icon: <Bell size={18} />,
          bg: "bg-gray-100 border-gray-400 text-gray-800",
        };
    }
  };

  const removeNotification = (timestamp: Date) => {
    setNotifications((prev) => prev.filter((n) => n.timestamp !== timestamp));
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {notifications.map((n) => {
          const { text, icon, bg } = getStyle(n.type);
          return (
            <motion.div
              key={n.timestamp.toISOString()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`relative ${bg} border px-4 py-3 rounded-lg flex items-start gap-3 shadow-md`}
            >
              <div className="pt-1">{icon}</div>
              <div className="flex-1 text-sm font-medium">{text}</div>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => removeNotification(n.timestamp)}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
