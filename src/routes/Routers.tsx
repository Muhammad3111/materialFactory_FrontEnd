import { Route, Routes, Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import StaffDashboard from "@/pages/dashboard/StaffDashboard";
import AddProductToInventory from "@/pages/inventory/AddProductToInventory";
import UpdateInventoryProduct from "@/pages/inventory/UpdateInventoryProduct";
import Inventory from "@/pages/inventory/Inventory";
import Login from "@/pages/login/Login";
import AddPartner from "@/pages/partners/AddPartner";
import Partners from "@/pages/partners/Partners";
import UpdatePartner from "@/pages/partners/UpdatePartner";
import AddProduct from "@/pages/products/AddProduct";
import Products from "@/pages/products/Products";
import UpdateProduct from "@/pages/products/UpdateProduct";
import ProfileDetails from "@/pages/profile/ProfileDetails";
import AddUser from "@/pages/users/AddUser";
import UpdateUser from "@/pages/users/UpdateUser";
import Users from "@/pages/users/Users";
import Permissions from "@/pages/permissions/Permissions";
import AddPermission from "@/pages/permissions/AddPermisson";
import UpdatePermission from "@/pages/permissions/UpdatePermission";
import Transactions from "@/pages/transactions/Transactions";
import AddTransaction from "@/pages/transactions/AddTransaction";
import TransactionById from "@/pages/transactions/TransactionById";
import Notification from "@/pages/notification/Notification";
import AttendanceTable from "@/pages/attendance/ReadAttandance";
import ReadWorks from "@/pages/attendance/ReadWorks";
import Jumper from "@/pages/partners/Jumper";
import ReportInventory from "@/pages/inventory/ReportInventory";

export default function Routers() {
  const { user } = useUser();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isAdmin = user.role === "admin";
  const isStaff = user.role === "ishchi";
  const isHamkor = user.role === "partner";

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Admin */}
        {isAdmin && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/:id" element={<UpdateProduct />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/:id" element={<UpdateUser />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route
              path="/inventory/add-product"
              element={<AddProductToInventory />}
            />
            <Route path="/inventory/:id" element={<UpdateInventoryProduct />} />
            <Route path="/report-inventory" element={<ReportInventory />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/add" element={<AddPartner />} />
            <Route path="/partners/:id" element={<UpdatePartner />} />
            <Route path="/faster-links" element={<Jumper />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/permissions/add" element={<AddPermission />} />
            <Route path="/permissions/:id" element={<UpdatePermission />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/add" element={<AddTransaction />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/attandace" element={<AttendanceTable />} />
            <Route path="/works-report" element={<ReadWorks />} />
          </>
        )}
        {(isAdmin || isHamkor) && (
          <>
            <Route path="/transactions/add" element={<AddTransaction />} />
            <Route path="/inventory" element={<Inventory />} />
          </>
        )}
        {/* Ishchi */}
        {(isStaff || isHamkor) && (
          <>
            <Route
              path="/inventory/add-product"
              element={<AddProductToInventory />}
            />
            <Route path="/transactions/user" element={<TransactionById />} />
          </>
        )}

        {isStaff && <Route path="/dashboard" element={<StaffDashboard />} />}

        {/* Har qanday roldagi user */}
        <Route path="/profile" element={<ProfileDetails />} />

        {/* Agar noto‘g‘ri manzilga kirilsa */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAdmin
                  ? "/"
                  : isStaff
                  ? "/dashboard"
                  : "/inventory/add-product"
              }
              replace
            />
          }
        />
      </Route>
      {/* Login */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
