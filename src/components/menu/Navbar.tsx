import { useUser } from "@/hooks/useUser";
import ProfileMenu from "@/pages/profile/Profile";
import { Bell } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const { notifications } = useUser();
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
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] font-bold w-4 h-4 p-0.5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </NavLink>

      {/* Markazda Logo */}
      <Link
        to="https://xdata.uz/"
        className="text-xl font-bold text-green-600 "
      >
        <span className="text-black text-2xl">X</span>track
      </Link>

      {/* O'ng tomonda User Profile */}
      <ProfileMenu />
    </nav>
  );
};

export default Navbar;
