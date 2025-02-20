import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AuthState } from "../../../types/auth/auth.types";

const initialAuthState: AuthState = {
  email: "",
  role: null,
  token: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{
        email: string;
        role: "patient" | "doctor" | "admin";
        token: string;
        isAuthenticated?: boolean;
      }>
    ) => {
      const { email, role, token, isAuthenticated } = action.payload;

      state.isAuthenticated =
        isAuthenticated !== undefined ? isAuthenticated : true;
      state.email = email;
      state.role = role;
      state.token = token;
    },

    setAuthState: (state) => {
      state.isAuthenticated = true;
    },

    signOut: () => initialAuthState
  }
});

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["email", "role", "token", "isAuthenticated"]
};

export const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer
);
export const { signIn, signOut, setAuthState } = authSlice.actions;
