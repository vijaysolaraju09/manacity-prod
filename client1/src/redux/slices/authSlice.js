import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    phone: null,
    otpVerified: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutSuccess: (state, action) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    addPhoneNumber: (state, action) => {
      state.phone = action.payload;
    },
  },
});
export const { loginSuccess, logoutSuccess, setOtpVerified, addPhoneNumber } =
  authSlice.actions;

export default authSlice.reducer;
