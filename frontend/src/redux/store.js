import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supervisorReducer from "./slices/supervisorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    supervisor: supervisorReducer,
  },
});
