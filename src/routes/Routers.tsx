import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Inventory from "@/pages/inventory/Inventory";
import Login from "@/pages/login/Login";
import AddProduct from "@/pages/products/AddProduct";
import Products from "@/pages/products/Products";
import UpdateProduct from "@/pages/products/UpdateProduct";
import Profile from "@/pages/profile/Profile";
import Transactions from "@/pages/transactions/Transactions";
import AddUser from "@/pages/users/AddUser";
import UpdateUser from "@/pages/users/UpdateUser";
import Users from "@/pages/users/Users";
import { Route, Routes } from "react-router-dom";

export default function Routers() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/:id" element={<UpdateProduct />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/:id" element={<UpdateUser />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
