import { combineReducers } from '@reduxjs/toolkit';
import userReducer from "./userReducer";
import authReducer from "./authReducer";

const ROOT_REDUCERS =combineReducers({
    // User
    user: userReducer,
    auth: authReducer
  })
  
export default ROOT_REDUCERS;