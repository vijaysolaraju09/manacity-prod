import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: {},
  },
  reducers: {
    updateWallet: (state, action) => {
      state.wallet = action.payload;
    },
  },
});
export const { updateWallet } = walletSlice.actions;
export default walletSlice.reducer;
