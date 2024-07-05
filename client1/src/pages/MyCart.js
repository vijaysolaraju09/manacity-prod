import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItemDetails } from "../redux/actions/fetchCartItemDetails";
import ProductsItemCard from "../components/ProductsItemCard";
import { Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import { fetchCartDetails } from "../redux/actions/fetchCartDetails";
import { toast, Toaster } from "react-hot-toast";
import { fetchUserDetails } from "../services/fetchUserDetails";
import { addListener } from "@reduxjs/toolkit";
import { addUserDetails } from "../redux/slices/userDetailsSlice";

function MyCart() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const cartDetails = useSelector((state) => state.cart.cartItems);
  const cartItemDetails = useSelector((state) => state.cart.cartItemDetails);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const [contactDetails, setContactDetails] = useState("");
  const [doorNumber, setDoorNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [villageOrTown, setVillageOrTown] = useState("");
  const [mandal, setMandal] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [liveLocation, setLiveLocation] = useState("");

  // Change handlers for the additional address details
  const handleContactDetailsChange = (e) => setContactDetails(e.target.value);
  const handleDoorNumberChange = (e) => setDoorNumber(e.target.value);
  const handleStreetNameChange = (e) => setStreetName(e.target.value);
  const handleLandmarkChange = (e) => setLandmark(e.target.value);
  const handleVillageOrTownChange = (e) => setVillageOrTown(e.target.value);
  const handleMandalChange = (e) => setMandal(e.target.value);
  const handleDistrictChange = (e) => setDistrict(e.target.value);
  const handleStateChange = (e) => setState(e.target.value);
  const handlePincodeChange = (e) => setPincode(e.target.value);
  const handleLiveLocationChange = (e) => setLiveLocation(e.target.value);

  let val = 0;
  cartItemDetails?.map((cartItem) => {
    val +=
      cartDetails?.filter((item) => item.productId === cartItem._id)[0]
        ?.quantity * cartItem.price;
  });

  useEffect(() => {
    // Fetch cart details when the component mounts
    dispatch(fetchCartItemDetails(cartDetails.map((item) => item.productId)));
  }, [dispatch, cartDetails]);

  const handleAddToCart = async (product) => {
    try {
      const existingCartItem = cartDetails.find(
        (item) => item.productId === product._id
      );
      console.log(product._id);
      const response = await fetch(
        "https://manacity-server.onrender.com/api/move-to-cart",
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
        "https://manacity-server.onrender.com/api/decrement-from-cart",
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
  const validateForm = () => {
    return (
      userDetails &&
      val > 0 &&
      // doorNumber &&
      // streetName &&
      landmark &&
      villageOrTown &&
      mandal &&
      district &&
      state &&
      pincode
    );
  };

  const handlePurchase = async () => {
    try {
      // Validate the form
      if (!validateForm()) {
        toast.error("Please fill in all the required fields.");
        return;
      }

      // Call the route to empty the cart in the database
      const response = await fetch(
        "https://manacity-server.onrender.com/api/process-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userDetails?._id,
            totalAmount: val,
            cart: cartDetails,
            product: cartItemDetails,
            addressDetails: {
              doorNumber,
              streetName,
              landmark,
              villageOrTown,
              mandal,
              district,
              state,
              pincode,
              liveLocation,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setTotalCost(
          cartItemDetails
            ?.map((cartItem) => cartItem.price)
            .reduce((acc, price) => acc + price, 0)
        );
        const updatedUserDetails = await fetchUserDetails(
          userDetails?.mobileNumber
        );
        console.log(updatedUserDetails);
        dispatch(addUserDetails(updatedUserDetails));
        // Empty the cart details in the Redux store
        dispatch(fetchCartDetails(userDetails?._id));
        setShowAddressModal(false);
        setPurchasedItems();
        toast.success("Purchased Successfulluy!");
      } else {
        if (data.errorType === "INSUFFICIENT_FUNDS") {
          toast.error("INSUFFICIENT_FUNDS");
        }
        console.error("Error emptying cart:", data.error);
      }
    } catch (error) {
      console.error("Error handling purchase:", error);
    }
  };

  const handlebuy = async () => {
    console.log(cartDetails);
    console.log(cartItemDetails);
    cartItemDetails.filter((items) => {
      console.log(items);
    });
    const response = await fetch(
      "https://manacity-server.onrender.com/api/test",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cartDetails,
          product: cartItemDetails,
        }),
      }
    );
    const data = await response.json();
  };
  return (
    <div className="wrapper">
      <Toaster toastOptions={{ duration: 4000 }} />
      {cartItemDetails?.length > 0 ? (
        <>
          {cartItemDetails?.map((cartItem) => (
            <>
              <div className="single-card">
                <div className="img-area">
                  <img src={cartItem?.imageURL} alt="" />
                </div>

                <div className="info">
                  <h3>{cartItem?.productName}</h3>
                  <p className="price">₹{cartItem?.price}</p>
                  <p>{cartItem?.description}</p>
                  <>
                    <div className="d-flex flex-column">
                      {cartDetails.filter(
                        (item) => item.productId == cartItem._id
                      )[0]?.quantity > 0 ? (
                        <>
                          <ButtonGroup
                            aria-label="Basic example"
                            className="mb-2"
                          >
                            <Button
                              variant="primary"
                              className="py-1"
                              style={{ fontSize: "14px" }}
                              onClick={() => handleDecrementFromCart(cartItem)}
                            >
                              -
                            </Button>
                            <span className="btn">
                              {
                                cartDetails.find(
                                  (item) => item.productId == cartItem._id
                                ).quantity
                              }
                            </span>
                            <Button
                              variant="primary"
                              className="py-1"
                              style={{ fontSize: "14px" }}
                              onClick={() => handleAddToCart(cartItem)}
                              disabled={
                                cartDetails.find(
                                  (item) => item.productId == cartItem._id
                                ).quantity >= cartItem?.stockQuantity
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
                            onClick={() => handleAddToCart(cartItem)}
                          >
                            Add to Cart
                          </button>
                        </>
                      )}
                      <button className="view-details">View Details</button>
                    </div>
                  </>
                </div>
              </div>
            </>
          ))}
          <div
            className="position-fixed bg-secondary w-100 text-white border-top p-2 "
            style={{ bottom: 50 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>Total Cost: {val}</div>
              <Button
                variant="success"
                onClick={() => setShowAddressModal(true)}
              >
                Add Address
              </Button>
              <Button variant="success" onClick={handlePurchase}>
                Purchase
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-3">
          <h3>Cart is Empty! Please Continue Shoping...</h3>
        </div>
      )}
      {/* Modal to show purchase details */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="landmark">
              <Form.Label>Landmark</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter landmark"
                value={landmark}
                onChange={handleLandmarkChange}
              />
            </Form.Group>

            <Form.Group controlId="villageOrTown">
              <Form.Label>Village or Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter village or town"
                value={villageOrTown}
                onChange={handleVillageOrTownChange}
              />
            </Form.Group>

            <Form.Group controlId="mandal">
              <Form.Label>Mandal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mandal"
                value={mandal}
                onChange={handleMandalChange}
              />
            </Form.Group>

            <Form.Group controlId="district">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter district"
                value={district}
                onChange={handleDistrictChange}
              />
            </Form.Group>

            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state"
                value={state}
                onChange={handleStateChange}
              />
            </Form.Group>

            <Form.Group controlId="pincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={handlePincodeChange}
              />
            </Form.Group>

            {/* <Form.Group controlId="liveLocation">
              <Form.Label>Live Location (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter live location"
                value={liveLocation}
                onChange={handleLiveLocationChange}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddressModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handlePurchase}>
            Proceed to Buy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyCart;
