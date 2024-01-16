import React, { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { HiOutlineMinusSm } from "react-icons/hi";
import { GoPlus } from "react-icons/go";

function Cart(props) {
  const {
    cartItem,
    increment,
    toggleCart,
    decrementCart,
    cartCount,
    purchased,
  } = props;
  const [discount, setdiscount] = useState({
    applied: false,
    totalDiscount: 0,
  });

  console.log(discount, "iukn");
  const applyDiscount = (coupon) => {
    let totalPrice = cartCount.totalPrice;
    let bool = !discount.applied;

    setdiscount((prev) => {
      {
        prev.totalDiscount = coupon;
        prev.applied = bool;
        return { ...prev };
      }
    });
  };

  const removeDiscount = () => {
    let totalPrice = cartCount.totalPrice;
    let bool = !discount.applied;

    setdiscount((prev) => {
      {
        prev.totalDiscount = 0;
        prev.applied = bool;
        return { ...prev };
      }
    });
  };
  return (
    <div className="position-fixed top-0 end-0 bg-white  p-4 side-bar shadow-lg">
      <div className="border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
        <h2 className="">Cart</h2>
        <button className="btn btn-dark" onClick={toggleCart}>
          close
        </button>
      </div>
      <div className="cart-items-container border-bottom mb-3">
        {cartItem.map((data) => (
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 id={data.id} className="text-secondary mb-2">
                {data.volumeInfo.title}
              </h5>

              <b className="mb-2">
                Rs. {data.volumeInfo.pageCount}
                {cartItem.length > 0 &&
                  cartItem.filter((item) => item.id == data.id)[0]?.quantity >
                    0 &&
                  ` * ${
                    cartItem.filter((item) => item.id == data.id)[0]?.quantity
                  } = ${
                    cartItem.filter((item) => item.id == data.id)[0]?.quantity *
                    data.volumeInfo.pageCount
                  } `}{" "}
              </b>
            </div>

            <ButtonGroup aria-label="Basic example">
              <Button
                variant="primary"
                onClick={() => decrementCart(data)}
                className="py-0 px-2"
              >
                <HiOutlineMinusSm />
              </Button>
              <span className="btn py-0">
                {cartItem.filter((item) => item.id == data.id)[0].quantity}
              </span>
              <Button
                variant="primary"
                onClick={() => increment(data)}
                className="py-0 px-2"
              >
                <GoPlus />
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </div>
      <div className="">
        <p className="mb-3">Apply Below Code Get Upto 30% off on Total Value</p>
        <div className="d-flex mb-3">
          <button
            className={`btn border me-3 discount-btn1`}
            disabled={discount.applied}
            onClick={() => applyDiscount(0.1)}
          >
            GET10
          </button>
          <button
            className={`btn border me-3 discount-btn2`}
            disabled={discount.applied}
            onClick={() => applyDiscount(0.2)}
          >
            GET20
          </button>
          <button
            className={`btn border discount-btn3`}
            disabled={discount.applied}
            onClick={() => applyDiscount(0.3)}
          >
            GET30
          </button>
        </div>

        <p>
          <b>Total Items : {cartCount.totalItems}</b>
        </p>
        <p>
          <b>
            Total Amount :{" "}
            {discount.totalDiscount != 0
              ? cartCount.totalPrice -
                Math.ceil(cartCount.totalPrice * discount.totalDiscount)
              : cartCount.totalPrice}
          </b>
        </p>
        <div style={{ height: "40px" }} className="">
          {discount.applied && (
            <div className="d-flex justify-content-between">
              <b>
                Discount Applied :{" "}
                {discount.totalDiscount != 0
                  ? Math.ceil(cartCount.totalPrice * discount.totalDiscount)
                  : 0}
              </b>
              <button className="btn " onClick={removeDiscount}>
                Remove
              </button>
            </div>
          )}
        </div>
        <button
          className="mx-3 w-100 py-2 btn btn-primary"
          onClick={() =>
            purchased(
              discount.totalDiscount != 0
                ? cartCount.totalPrice -
                    Math.ceil(cartCount.totalPrice * discount.totalDiscount)
                : cartCount.totalPrice,
              cartCount.totalItems
            )
          }
        >
          Pay :{" "}
          {discount.totalDiscount != 0
            ? cartCount.totalPrice -
              Math.ceil(cartCount.totalPrice * discount.totalDiscount)
            : cartCount.totalPrice}
        </button>
      </div>
    </div>
  );
}

export default Cart;
