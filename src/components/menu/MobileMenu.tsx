import { NavLink } from "react-router-dom";
import {
  Home,
  Box,
  Archive,
  UserRoundCheck,
  ArrowRightLeft,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

const MobileMenu = () => {
  const { user } = useUser();

  const menuItems = [
    {
      path: "/products",
      icon: <Box size={24} />,
      label: "Mahsulotlar",
      roles: ["admin"],
    },
    {
      path: user?.role === "ishchi" ? "/inventory/add-product" : "/inventory",
      icon: <Archive size={24} />,
      label: "Ombor",
      roles: ["admin", "ishchi", "partner"],
    },
    {
      path: "/",
      icon: <Home size={24} />,
      label: "Bosh sahifa",
      roles: ["admin"],
    },
    {
      path: "/dashboard",
      icon: <Home size={24} />,
      label: "Bosh sahifa",
      roles: ["ishchi"],
    },
    {
      path: user?.role === "admin" ? "/transactions" : "/transactions/user",
      icon: <ArrowRightLeft size={24} />,
      label: "Hisobotlar",
      roles: ["admin", "ishchi", "partner"],
    },
    {
      path: "/partners",
      icon: <UserRoundCheck size={24} />,
      label: "Hamkorlar",
      roles: ["admin"],
    },
  ];

  const filteredItems = user
    ? menuItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around py-2 z-20">
      {filteredItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 transition-all duration-300 border-b-2 ${
              isActive
                ? "text-blue-500 -translate-y-3 border-blue-500"
                : "text-gray-500 hover:text-blue-500 border-transparent"
            }`
          }
        >
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileMenu;
