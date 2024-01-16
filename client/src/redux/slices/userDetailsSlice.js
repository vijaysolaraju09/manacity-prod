import { createSlice } from "@reduxjs/toolkit";

export const userDetailsSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: {},
  },
  reducers: {
    addUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    removeUserDetails: (state, action) => {
      state.userDetails = {};
    },
  },
});
export const { addUserDetails, removeUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
