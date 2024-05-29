// counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "search",
  initialState: {
    value: "waterloo",
  },
  reducers: {
    setSearchValue(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setSearchValue } = counterSlice.actions;
export const selectCount = (state) => state.counter.value;
export default counterSlice.reducer;
