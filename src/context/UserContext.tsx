import { createContext, useState, useEffect, ReactNode } from "react";

type Users = User | Partners;

interface UserContextType {
  user: Users | null;
  setUser: (user: Users | null) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Users | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
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

  const setUser = (newUser: Users | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  if (initializing) return <div>Yuklanmoqda...</div>;

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
