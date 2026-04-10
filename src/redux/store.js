import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import expenseReducer from "./expense/expenseSlice";
import transactionReducer from "./transaction/transactionSlice"
import budgetReducer from "./budget/budgetSlice";
import incomeReducer from "./income/incomeSlice"
import userReducer from "./user/userSlice";
import categoryReducer from "./category/categorySlice";
import logReducer from "./log/logSlice"
import adminReportReducer from "./adminReport/adminReportSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    transaction:transactionReducer,
    budget:budgetReducer,
    income:incomeReducer,
    user:userReducer,
    category:categoryReducer,
    log:logReducer,
    adminReport:adminReportReducer,
  },
});
