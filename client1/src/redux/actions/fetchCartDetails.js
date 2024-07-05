import { setCartItems } from "../slices/cartSlice";

export const fetchCartDetails = (userId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://manacity-server.onrender.com/api/cart-details?userId=${userId}`
    );
    const data = await response.json();

    if (data.success) {
      dispatch(setCartItems(data.cart));
    }
  } catch (error) {
    console.error("Error fetching cart details:", error);
  }
};
