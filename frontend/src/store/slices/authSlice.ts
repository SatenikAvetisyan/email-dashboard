import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState { token: string | null; email?: string | null }
const initial: AuthState = { token: typeof window !== "undefined" ? (localStorage.getItem("token") || null) : null };

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string; email?: string }>) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      localStorage.setItem("token", action.payload.token);
    },
    clearToken(state) {
      state.token = null;
      state.email = null;
      localStorage.removeItem("token");
    }
  }
});

export const { setToken, clearToken } = slice.actions;
export default slice.reducer;
