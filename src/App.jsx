import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Content } from "./components/Common/Content";
import { PublicLayout } from "./components/Layouts/PublicLayout";
import { PrivateRoutes } from "./components/Hooks/PrivateRoutes";
import { UserBudget } from "./components/User/Budget/UserBudget";
import { UserIncome } from "./components/User/Income/UserIncome";

import { UserExpenses } from "./components/User/Expense/UserExpenses";
import { Reports } from "./components/User/Reports";
import { Transaction } from "./components/User/Transaction";
import { UserDashboard } from "./components/User/UserDashboard";

import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AccessControl } from "./components/Admin/AccessControl";
import { ManageCategories } from "./components/Admin/ManageCategories";
import { ManageUsers } from "./components/Admin/ManageUsers";
import { ReportAdmins } from "./components/Admin/ReportAdmins";
import { Systemlog } from "./components/Admin/Systemlog";
import { UserDetails } from "./components/Admin/UserDetails";
import { Account } from "./components/Admin/Account";

import { useEffect } from "react";
import { UserDashboardLayout } from "./components/User/UserDashboardLayout";
import { AdminDashboardLayout } from "./components/Admin/AdminDashboardLayout";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = "auth-page";
    } else if (location.pathname.startsWith("/admin")) {
      document.body.className = "admin-layout";
    } else if (location.pathname.startsWith("/user")) {
      document.body.className = "user-layout";
    } else {
      document.body.className = "public-layout";
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/private" element={<UserDashboardLayout />}>
          <Route path="expenses" element={<UserExpenses />} />
          <Route path="budget" element={<UserBudget />} />
          <Route path="income" element={<UserIncome />} />
          <Route path="reports" element={<Reports />} />
          <Route path="transactions" element={<Transaction />} />
          <Route path="userdashboard" element={<UserDashboard />} />
          <Route path="account/:userId" element={<Account />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="accesscontrol" element={<AccessControl />} />
          <Route path="managecategories" element={<ManageCategories />} />
          <Route path="manageusers" element={<ManageUsers />} />
          <Route path="reportadmins" element={<ReportAdmins />} />
          <Route path="systemlogs" element={<Systemlog />} />
          <Route path="user/:userId" element={<UserDetails />} />
          <Route path="account/:userId" element={<Account />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
