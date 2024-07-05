import { setCartItemDetails } from "../slices/cartSlice";

export const fetchCartItemDetails = (productIds) => async (dispatch) => {
  console.log(productIds);
  try {
    const response = await fetch(
      "https://manacity-server.onrender.com/api/fetch-product-details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      }
    );

    const data = await response.json();

    if (data.success) {
      dispatch(setCartItemDetails(data.productDetails));
    } else {
      console.error("Error fetching cart details:", data.error);
    }
  } catch (error) {
    console.error("Error fetching cart details:", error);
  }
};
