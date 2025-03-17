import { NavLink } from "react-router-dom";
import { Home, Box, Users, Archive, CreditCard } from "lucide-react";

const MobileMenu = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around py-2 z-50">
      {/* Products */}
      <NavLink
        to="/products"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 transition-all duration-300 border-b-2 ${
            isActive
              ? "text-blue-500 -translate-y-3  border-blue-500"
              : "text-gray-500 hover:text-blue-500 border-transparent"
          }`
        }
      >
        <Box size={24} />
        <span className="text-xs">Products</span>
      </NavLink>

      {/* Users */}
      <NavLink
        to="/users"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 transition-all duration-300 ${
            isActive
              ? "text-blue-500 -translate-y-3 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`
        }
      >
        <Users size={24} />
        <span className="text-xs">Users</span>
      </NavLink>

      {/* Home (Markazda) */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 transition-all duration-300 ${
            isActive
              ? "text-blue-500 -translate-y-3 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`
        }
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>

      {/* Inventory */}
      <NavLink
        to="/inventory"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 transition-all duration-300 ${
            isActive
              ? "text-blue-500 -translate-y-3 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`
        }
      >
        <Archive size={24} />
        <span className="text-xs">Inventory</span>
      </NavLink>

      {/* Transactions */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 transition-all duration-300 ${
            isActive
              ? "text-blue-500 -translate-y-3 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`
        }
      >
        <CreditCard size={24} />
        <span className="text-xs">Transactions</span>
      </NavLink>
    </nav>
  );
};

export default MobileMenu;
