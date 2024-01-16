import { setCartItems } from "../slices/cartSlice";

export const fetchCartDetails = (userId) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/cart-details?userId=${userId}`
    );
    const data = await response.json();

    if (data.success) {
      dispatch(setCartItems(data.cart));
    }
  } catch (error) {
    console.error("Error fetching cart details:", error);
  }
};
