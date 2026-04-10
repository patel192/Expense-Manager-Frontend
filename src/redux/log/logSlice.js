import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/Utils/axiosInstance";

export const fetchLogs = createAsyncThunk(
    "log/fetchLogs",
    async () => {
        const res = await axiosInstance.get("/logs");
        return res.data || [];
    }
);
const initialState = {
    logs:[],
    loading:false,
    error:null,
};
const logSlice = createSlice({
    name:"log",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
       builder
       .addCase(
        fetchLogs.pending,
        (state) => {
            state.loading = true;
        }
       )

       .addCase(
        fetchLogs.fulfilled,
        (state,action) => {
            state.loading = false;
            state.logs = action.payload;
        }
       )

       .addCase(
        fetchLogs.rejected,
        (state) => {
            state.loading = false;
            state.error = "Failed to fetch logs"
        }
       )
    }
})
export default logSlice.reducer;