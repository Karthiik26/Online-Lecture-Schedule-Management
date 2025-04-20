import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataReducer from "./dataSlice";

const storedUser = localStorage.getItem("user");
const preloadedState = {
  auth: {
    user: storedUser ? JSON.parse(storedUser) : null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  preloadedState,
});
