import React, { useState } from "react";
import { Button, ButtonGroup, Card, Modal } from "react-bootstrap";
import { fetchCartDetails } from "../redux/actions/fetchCartDetails";
import { useDispatch, useSelector } from "react-redux";

function ProductCard({ product }) {
  const userDetails = useSelector((state) => state.user.userDetails);
  const cartDetails = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async (product) => {
    try {
      const existingCartItem = cartDetails.find(
        (item) => item.productId === product._id
      );
      console.log(product._id);
      const response = await fetch("http://localhost:3001/api/move-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails?._id,
          productId: product?._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        if (existingCartItem) {
          // If the product already exists in the cart, update the quantity
          dispatch(fetchCartDetails(userDetails?._id));
          console.log("Product quantity updated in the cart");
        } else {
          // If the product is not in the cart, add it with quantity 1
          dispatch(fetchCartDetails(userDetails?._id));
          console.log("Product added to cart successfully");
        }
      } else {
        console.error("Error adding to cart:", data.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleDecrementFromCart = async (product) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/decrement-from-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userDetails?._id,
            productId: product?._id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // If the product is in the cart, update the quantity
        dispatch(fetchCartDetails(userDetails?._id));
        console.log("Product quantity updated in the cart");

        // If quantity is 0, remove the product from the cart
        if (data.quantity === 0) {
          // Dispatch an action to remove the product from the local state
          // dispatch(removeProductFromCart(product._id));
          console.log("Product removed from the cart");
        }
      } else {
        console.error("Error removing from cart:", data.error);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="single-card">
      <div className="img-area">
        <img src={product?.imageURL} alt="" />
        {product?.isForSale && (
          <>
            <div className="overlay">
              {cartDetails.filter((item) => item.productId == product._id)[0]
                ?.quantity > 0 ? (
                <>
                  <ButtonGroup aria-label="Basic example" className="mb-2">
                    <Button
                      variant="primary"
                      className="py-1"
                      style={{ fontSize: "14px" }}
                      onClick={() => handleDecrementFromCart(product)}
                    >
                      -
                    </Button>
                    <span className="btn">
                      {
                        cartDetails.find(
                          (item) => item.productId == product._id
                        ).quantity
                      }
                    </span>
                    <Button
                      variant="primary"
                      className="py-1"
                      style={{ fontSize: "14px" }}
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        cartDetails.find(
                          (item) => item.productId == product._id
                        ).quantity >= product?.stockQuantity
                      }
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </>
              ) : (
                <>
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </>
              )}
              <button className="view-details" onClick={handleViewDetails}>
                View Details
              </button>
            </div>
          </>
        )}
      </div>

      <div className="info">
        <h3>{product?.productName}</h3>
        {product?.isForSale && (
          <p>
            is in cart:{" "}
            {cartDetails.filter((item) => item.productId == product._id)
              .length > 0 &&
              cartDetails.filter((item) => item.productId == product._id)[0]
                .quantity}
          </p>
        )}
        <p className="price">${product?.price}</p>
        <p>{product?.description}</p>
        <p>Stock Quantity: {product?.stockQuantity}</p>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={product?.imageURL} alt="" className="w-100" />
          <p>Name: {product?.productName}</p>
          <p>Price: ${product?.price}</p>
          <p>Description: {product?.description}</p>
          <p>Stock Quantity: {product?.stockQuantity}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductCard;
