import { configureStore } from "@reduxjs/toolkit";

// =============== REDUCER IMPORTS ===============
// Domain specific slices
import authReducer from "./auth/authSlice";
import expenseReducer from "./expense/expenseSlice";
import transactionReducer from "./transaction/transactionSlice";
import budgetReducer from "./budget/budgetSlice";
import incomeReducer from "./income/incomeSlice";
import userReducer from "./user/userSlice";
import categoryReducer from "./category/categorySlice";
import logReducer from "./log/logSlice";
import adminReportReducer from "./adminReport/adminReportSlice";

// Global UI state (loading, modals, etc.)
import uiReducer from "./ui/uiSlice";

/**
 * --- CENTRAL REDUX STORE ---
 * This is the "single source of truth" for the entire frontend.
 * Every piece of global state is managed through these reducers.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
    income: incomeReducer,
    user: userReducer,
    category: categoryReducer,
    log: logReducer,
    adminReport: adminReportReducer,
    ui: uiReducer,
  },
});

