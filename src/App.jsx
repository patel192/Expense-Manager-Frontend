import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Content } from "./components/Common/Content";
import { PublicLayout } from "./components/Layouts/PublicLayout";
import { PrivateLayout } from "./components/Layouts/PrivateLayout";
import { PrivateRoutes } from "./components/Hooks/PrivateRoutes";
import { AdminLayout } from "./components/Layouts/AdminLayout";
import "./api/axios"
import { AddExpense } from "./components/User/Expense/AddExpense";
import { AllExpenses } from "./components/User/Expense/AllExpenses";
import { SetBudget } from "./components/User/Budget/SetBudget";
import { ViewBudget } from "./components/User/Budget/ViewBudget";
import { BudgetSummary } from "./components/User/Budget/BudgetSummary";
import { AddIncome } from "./components/User/Income/AddIncome";
import { ViewIncome } from "./components/User/Income/ViewIncome";
import { IncomeSummary } from "./components/User/Income/IncomeSummary";
import { Reports } from "./components/User/Reports";
import { Transaction } from "./components/User/Transaction";
import { UserDashboard } from "./components/User/UserDashboard";
import { RecurringExpenses } from "./components/User/RecurringExpenses";

import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AccessControl } from "./components/Admin/AccessControl";
import { ManageCategories } from "./components/Admin/ManageCategories";
import { ManageUsers } from "./components/Admin/ManageUsers";
import { ReportAdmins } from "./components/Admin/ReportAdmins";
import { Systemlog } from "./components/Admin/Systemlog";
import { UserDetails } from "./components/Admin/UserDetails";
import { Account } from "./components/Admin/Account";

import { useEffect } from "react";

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
        <Route path="/private" element={<PrivateLayout />}>
          <Route path="addexpense" element={<AddExpense />} />
          <Route path="allexpenses" element={<AllExpenses />} />
          <Route path="addbudget" element={<SetBudget />} />
          <Route path="allbudget" element={<ViewBudget />} />
          <Route path="budgetsummary" element={<BudgetSummary />} />
          <Route path="addincome" element={<AddIncome />} />
          <Route path="viewincome" element={<ViewIncome />} />
          <Route path="incomesummary" element={<IncomeSummary />} />
          <Route path="reports" element={<Reports />} />
          <Route path="recurring" element={<RecurringExpenses />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="userdashboard" element={<UserDashboard />} />
          <Route path="account/:userId" element={<Account />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
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
