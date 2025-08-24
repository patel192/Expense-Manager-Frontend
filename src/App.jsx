import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import { Login } from "./Login";
import axios from "axios";
import { PrivateRoutes } from "./components/Hooks/PrivateRoutes";
import { Signup } from "./Signup";
import { Content } from "./components/Common/Content";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { PublicLayout } from "./components/Layouts/PublicLayout";
import { PrivateLayout } from "./components/Layouts/PrivateLayout";
import { AddExpense } from "./components/User/Expense/AddExpense";
import { AdminLayout } from "./components/Layouts/AdminLayout";

import { Reports } from "./components/User/Reports";

import { Transaction } from "./components/User/Transaction";
import { UserDashboard } from "./components/User/UserDashboard";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { Accesscontrol } from "./components/Admin/Accesscontrol";
import { ManageCategories } from "./components/Admin/ManageCategories";
import { ManageUsers } from "./components/Admin/ManageUsers";
import { ReportAdmins } from "./components/Admin/ReportAdmins";
import { Systemlog } from "./components/Admin/Systemlog";
import { AllExpenses } from "./components/User/Expense/AllExpenses";
import { SetBudget } from "./components/User/Budget/SetBudget";
import { ViewBudget } from "./components/User/Budget/ViewBudget";
import { AddIncome } from "./components/User/Income/AddIncome";
import { ViewIncome } from "./components/User/Income/ViewIncome";
import { IncomeSummary } from "./components/User/Income/IncomeSummary";
import { useEffect } from "react";

import { RecurringExpenses } from "./components/User/RecurringExpenses";
import { UserDetails } from "./components/Admin/UserDetails";
import { Account } from "./components/Admin/Account";
import { BudgetSummary } from "./components/User/Budget/BudgetSummary";

function App() {
  axios.defaults.baseURL = "http://localhost:3001/api";
  const location = useLocation();
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
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
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
      </Route>
      {/* Protected user routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/private" element={<PrivateLayout />}>
          <Route path="addexpense" element={<AddExpense config={config} />} />
          <Route path="allexpenses" element={<AllExpenses config={config} />} />
          <Route path="addbudget" element={<SetBudget />} />
          <Route path="allbudget" element={<ViewBudget />} />
          <Route path="budgetsummary" element={<BudgetSummary />} />
          <Route path="addincome" element={<AddIncome />} config={config}/>
          <Route path="viewincome" element={<ViewIncome config={config}/>} />
          <Route path="incomesummary" element={<IncomeSummary config={config} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="recurring" element={<RecurringExpenses config={config} />} />
          <Route path="transaction" element={<Transaction />} />
          <Route
            path="userdashboard"
            element={<UserDashboard config={config} />}
          />
          <Route path="account/:userId" element={<Account config={config}/>} />
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="admindashboard"
            element={<AdminDashboard config={config} />}
          />
          <Route
            path="accesscontrol"
            element={<Accesscontrol token={token} />}
          />
          <Route path="managecategories" element={<ManageCategories config={config} />} />
          <Route path="manageusers" element={<ManageUsers config={config} />} />
          <Route path="reportadmins" element={<ReportAdmins />} />
          <Route path="systemlogs" element={<Systemlog />} />
          <Route path="user/:userId" element={<UserDetails token={token} />} />
          <Route path="account/:userId" element={<Account token={token} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
