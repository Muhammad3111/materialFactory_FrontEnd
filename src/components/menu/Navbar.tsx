import ProfileMenu from "@/pages/profile/Profile";
import { Bell } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-3 z-50">
      {/* Chap tomonda Notification */}
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `hover:text-blue-500 transition relative ${
            isActive ? "text-blue-500" : "text-gray-600"
          }`
        }
      >
        <Bell size={24} />
        {/* Agar yangi bildirishnomalar bo'lsa, qizil badge chiqadi */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] font-bold w-4 h-4 p-0.5 flex items-center justify-center rounded-full">
          3
        </span>
      </NavLink>

      {/* Markazda Logo */}
      <Link to="/" className="text-xl font-bold text-gray-800">
        MyLogo
      </Link>

      {/* O'ng tomonda User Profile */}

      <ProfileMenu />
    </nav>
  );
};

export default Navbar;
