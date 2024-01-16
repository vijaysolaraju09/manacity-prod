import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userDetailsSlice from "./slices/userDetailsSlice";
import cartSlice from "./slices/cartSlice";
import walletSlice from "./slices/walletSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userDetailsSlice,
    cart: cartSlice,
    wallet: walletSlice,
  },
});
export default store;
