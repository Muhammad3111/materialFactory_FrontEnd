import MobileMenu from "@/components/menu/MobileMenu";
import Navbar from "@/components/menu/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <MobileMenu />
    </div>
  );
}
