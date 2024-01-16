import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    cartItemDetails: [],
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    setCartItemDetails: (state, action) => {
      state.cartItemDetails = action.payload;
    },
  },
});

export const { setCartItems, setCartItemDetails } = cartSlice.actions;

export default cartSlice.reducer;
