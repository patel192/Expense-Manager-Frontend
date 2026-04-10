import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user : null,
    token:null,
    role:null,
    isAuthenticated:false,
    loading:false,
};
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout:(state) => {
            state.suer = null;
            state.token = null;
            state.role = null,
            state.isAuthenticated = false;
        },
        setLoading:(state,action) => {
            state.loading = action.payload;
        }
    },
});
export const {loginSuccess,logout,setLoading} = authSlice.actions;
export default authSlice.reducer;