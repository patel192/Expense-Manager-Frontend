import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/Utils/axiosInstance";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (userId) => {

    const [expenseRes, incomeRes, budgetRes] =
      await Promise.all([
        axiosInstance.get(`/expensesbyUserID/${userId}`),
        axiosInstance.get(`/incomesbyUserID/${userId}`),
        axiosInstance.get(`/budgetsbyUserID/${userId}`),
      ]);

    const expenses =
      (expenseRes.data.data || expenseRes.data || []).map((e) => ({
        ...e,
        type: "Expense",
      }));

    const incomes =
      (incomeRes.data.data || incomeRes.data || []).map((i) => ({
        ...i,
        type: "Income",
      }));

    const budgets =
      budgetRes?.data?.data || budgetRes?.data || [];

    const merged =
      [...expenses, ...incomes].map((t) => {

        if (t.type === "Expense") {

          const hasBudget =
            budgets.some(
              (b) =>
                (b.categoryID?._id) ===
                (t.categoryID?._id)
            );

          return {
            ...t,
            hasBudget,
          };

        }

        return t;

      });

    const totalIncome =
      incomes.reduce(
        (acc, i) => acc + (i.amount || 0),
        0
      );

    const totalExpense =
      expenses.reduce(
        (acc, e) => acc + (e.amount || 0),
        0
      );

    return {
      transactions: merged,
      summary: {
        totalIncome,
        totalExpense,
        balance:
          totalIncome - totalExpense,
      },
    };

  }
);

export const fetchAllTransactions = createAsyncThunk(
  "transaction/fetchAllTransactions",
  async () => {
    const [expenseRes, incomeRes] = await Promise.all([
      axiosInstance.get("/expenses"),
      axiosInstance.get("/incomes"),
    ]);

    const expenses = (expenseRes.data.data || expenseRes.data || []).map((e) => ({
      ...e,
      type: "Expense",
    }));

    const incomes = (incomeRes.data.data || incomeRes.data || []).map((i) => ({
      ...i,
      type: "Income",
    }));

    const merged = [...expenses, ...incomes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      transactions: merged,
      summary: {
        totalIncome: incomes.reduce((acc, i) => acc + (i.amount || 0), 0),
        totalExpense: expenses.reduce((acc, e) => acc + (e.amount || 0), 0),
      },
    };
  }
);

const initialState = {

  transactions: [],

  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  },

  loading: true,

};

const transactionSlice = createSlice({

  name: "transaction",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(
        fetchTransactions.pending,
        (state) => {

          state.loading = true;

        }
      )

      .addCase(
        fetchTransactions.fulfilled,
        (state, action) => {

          state.loading = false;

          state.transactions =
            action.payload.transactions;

          state.summary =
            action.payload.summary;

        }
      )

      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.summary = {
          ...action.payload.summary,
          balance: action.payload.summary.totalIncome - action.payload.summary.totalExpense,
        };
      })
      .addCase(fetchAllTransactions.rejected, (state) => {
        state.loading = false;
      });

  },

});

export default transactionSlice.reducer;