import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/js/dist/dropdown.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { HashRouter as Router, Route, Routes } from "react-router-dom"; // ✅ Updated here
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Sales from "./pages/Sales";
import Layout from "./components/Layout";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewProduct from "./components/Products/AddNewProduct";
import SearchProduct from "./components/Products/SearchProduct";
import EditProduct from "./components/Products/EditProduct";
import EditSuppliers from "./components/EditSuppliers";

import Purchases from "./pages/Purchases";
import PrivateRoute from "./Protect/PrivateRoute";
import Login from "./pages/Login";
import AddNewUser from "./components/Users/AddNewUser";
import LogoutUser from "./components/Users/LogoutUser";
import SalesReportByDate from "./pages/SaleReportByDate";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceList from "./pages/InvoiceLists";
import BackupPage from "./pages/backupPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index={true} element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/salereportbydate" element={<SalesReportByDate />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/addnew" element={<AddNewProduct />} />
          <Route path="/products/edit" element={<EditProduct />} />
          <Route path="/products/find" element={<SearchProduct />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/edit" element={<EditSuppliers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/adduser" element={<AddNewUser />} />
          <Route path="/logout" element={<LogoutUser />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
