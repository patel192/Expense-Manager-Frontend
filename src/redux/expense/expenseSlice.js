import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/Utils/axiosInstance";

export const fetchCategories = createAsyncThunk("expense/fetchCategories",async () => {
    const res = await axiosInstance.get("/categories");
    return res.data.data || res.data;
})

export const fetchRecentExpenses = createAsyncThunk(
    "expense/fetchRecentExpenses",
    async (userId) => {
        if (!userId) return [];
        const res = await axiosInstance.get(`/recent-expense/${userId}`)
        return res.data.data || res.data || [];
    }
);

export const fetchAllExpenses = createAsyncThunk(
    "expense/fetchAllExpenses",
    async (userId) => {
        if (!userId) return [];
        const res = await axiosInstance.get(`/expensesbyUserID/${userId}`);
        return res.data.data || res.data || [];
    }
);
const initialState = {
    categories : [] ,
    recentExpenses : [],
    expenses : [],
    loading : false,
};
const expenseSlice = createSlice ({
    name:"expense",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchCategories.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchCategories.fulfilled,(state,action) => {
            state.loading = false,
            state.categories = action.payload;
        })

        .addCase(fetchRecentExpenses.fulfilled , (state,action)  => {
           state.recentExpenses = action.payload;
        })

        .addCase(fetchAllExpenses.fulfilled,(state,action)=> {
            state.expenses = action.payload;
        });
    }
});
export default expenseSlice.reducer;