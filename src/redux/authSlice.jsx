import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  jwtToken: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.jwtToken = action.payload.jwtToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.jwtToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    setAuthFromLocalStorage: (state, action) => {
      const token = action.payload.jwtToken;
      if (token) {
        state.jwtToken = token;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setError, setAuthFromLocalStorage } =
  authSlice.actions;
export default authSlice.reducer;
