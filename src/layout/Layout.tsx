import MobileMenu from "@/components/menu/MobileMenu";
import Navbar from "@/components/menu/Navbar";
import PullToRefreshWrapper from "@/components/pulltorefresh/ReactPullToRefresh";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const handleRefresh = () => {
    return new Promise<void>((resolve) => {
      window.location.reload();
      resolve(); // Reload bo‘lganidan keyin bu ishlamaydi, lekin kutilmoqda
    });
  };
  return (
    <div>
      <Navbar />
      <PullToRefreshWrapper onRefresh={handleRefresh}>
        <Outlet />
      </PullToRefreshWrapper>
      <MobileMenu />
    </div>
  );
}
