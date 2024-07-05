import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setToken(state, action) {
      state = action.payload;
      return state;
    },

  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
