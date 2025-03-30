import { Route, Routes } from "react-router-dom";
import "./assets/css/fontawesome-all.min.css";
import "./assets/css/Navbar.css";
import { Login } from "./Login";
import { Navbar } from "./components/Common/Navbar";

import { Signup } from "./Signup";
import { Content } from "./components/Common/Content";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { PublicLayout } from "./components/Layouts/PublicLayout";
import { PrivateLayout } from "./components/Layouts/PrivateLayout";
import { AddExpense } from "./components/User/AddExpense";
import { AdminLayout } from "./components/Layouts/AdminLayout";
import { Budget } from "./components/User/Budget";
import { Reports } from "./components/User/Reports";
import { Income } from "./components/User/Income";
import { Transaction } from "./components/User/Transaction";
import { UserDashboard } from "./components/User/UserDashboard";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { Accesscontrol } from "./components/Admin/Accesscontrol";
import { ManageCategories } from "./components/Admin/ManageCategories";
import { ManageUsers } from "./components/Admin/ManageUsers";
import { ReportAdmins } from "./components/Admin/ReportAdmins";
import { Systemlog } from "./components/Admin/Systemlog";

function App() {
  return (
    <Routes>
     <Route  element={<PublicLayout/>}>
     <Route path="/" element={<Content/>}/>
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/>
     <Route path="/forgotpassword" element={<ForgotPassword/>}/>
     <Route path="/resetpassword/:token" element={<ResetPassword/>}/>
     </Route>
     <Route path="/private" element={<PrivateLayout/>}>
     <Route path="addexpense" element={<AddExpense/>}></Route>
     <Route path="budget" element={<Budget/>}></Route>
     <Route path="income" element={<Income/>}></Route>
     <Route path="reports" element={<Reports/>}></Route>
     <Route path="transaction" element={<Transaction/>}></Route>
     <Route path="dashboard" element={<UserDashboard/>}></Route>
     </Route>
     
     <Route path="/admin" index element={<AdminLayout/>}>
     <Route path="admindashboard" element={<AdminDashboard/>}></Route>
     <Route path="accesscontrol" element={<Accesscontrol/>}></Route>
     <Route path="managecategories" element={<ManageCategories/>}></Route>
     <Route path="manageusers" element={<ManageUsers/>}></Route>
     <Route path="reportadmins" element={<ReportAdmins/>}></Route>
     <Route path="systemlog" element={<Systemlog/>}></Route>
     </Route>
    </Routes>
  );
}

export default App;
