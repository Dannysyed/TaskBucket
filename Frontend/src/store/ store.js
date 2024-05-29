import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../store/counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add other reducers here if needed
  },
});

export default store;
