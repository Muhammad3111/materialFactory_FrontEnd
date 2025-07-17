import { createContext, useState, useEffect, ReactNode, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://api.marlin.uz", {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});

type Users = User | Partners;

interface NotificationItem {
  type: string;
  timestamp: string | Date;
}

interface UserContextType {
  user: Users | null;
  setUser: (user: Users | null) => void;
  logout: () => void;
  notifications: NotificationItem[];
  removeNotification: (identifier: string | number) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Users | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const soundRef = useRef(new Audio("./sound/notification.mp3"));

  // Role asosida validatsiya
  const isValidUser = (data: any): data is Users => {
    return data && ["admin", "ishchi", "partner"].includes(data.role);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (isValidUser(parsed)) {
        setUserState(parsed);
      }
    }

    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    setInitializing(false);
  }, []);

  useEffect(() => {
    if (!initializing) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, initializing]);

  useEffect(() => {
    if (!initializing) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications, initializing]);

  useEffect(() => {
    socket.emit("join_notification_channel");

    const handleNotification = (data: any) => {
      soundRef.current.play();
      setNotifications((prev) => [
        ...prev,
        { ...data, timestamp: new Date().toISOString() },
      ]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const setUser = (newUser: Users | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const removeNotification = (identifier: string | number) => {
    setNotifications((prevNotifications) => {
      const updated = prevNotifications.filter((item, index) => {
        return typeof identifier === "number"
          ? index !== identifier
          : item.timestamp !== identifier;
      });

      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  if (initializing) return <div>Yuklanmoqda...</div>;

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, notifications, removeNotification }}
    >
      {children}
    </UserContext.Provider>
  );
};
