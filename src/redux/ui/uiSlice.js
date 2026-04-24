import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingCount: 0,
  isLoading: false,
  loadingText: "Processing request...",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loadingCount += 1;
      state.isLoading = true;
      if (action.payload) {
        state.loadingText = action.payload;
      }
    },
    stopLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      state.isLoading = state.loadingCount > 0;
      if (!state.isLoading) {
        state.loadingText = "Processing request...";
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      if (!action.payload) {
        state.loadingCount = 0;
      }
    },
  },
});

export const { startLoading, stopLoading, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
