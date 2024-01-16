import React, { useState, useEffect } from "react";
import Cart from "./Cart";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Spinner from "react-bootstrap/Spinner";
// import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { AiOutlineShoppingCart } from "react-icons/ai";

function Item(props) {
  const { booksData } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [cartItem, setCartItem] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState({ totalItems: 0, totalPrice: 0 });

  const handleShow = (data) => {
    setShowDetails((prev) => !prev);
    setModalDetails(data);
  };

  const handleClose = () => {
    setShowDetails((prev) => !prev);
  };

  const addToCart = (data) => {
    let totalItems = cartCount.totalItems;
    let totalPrice = cartCount.totalPrice;
    setCartCount({
      totalItems: totalItems + 1,
      totalPrice: totalPrice + data.volumeInfo.pageCount,
    });
    setCartItem((prev) => [...prev, { ...data, quantity: 1 }]);
  };

  const decrementCart = (data) => {
    let count = cartItem.filter((item) => item.id === data.id)[0].quantity;
    let totalItems = cartCount.totalItems;
    let totalPrice = cartCount.totalPrice;
    setCartCount({
      totalItems: totalItems - 1,
      totalPrice: totalPrice - data.volumeInfo.pageCount,
    });
    if (count <= 1) {
      setCartItem((prev) => prev.filter((item) => item.id !== data.id));
    } else {
      cartItem.filter((item) => item.id === data.id)[0].quantity = count - 1;

      setCartItem([...cartItem]);
    }

    // let index = cartItem.findIndex((item) => item.id === data.id);
    // cartItem.splice(index, 1);
    // setCartItem([...cartItem]);
    // console.log('decrement');
  };
  const increment = (data) => {
    // setCartCount((count) => count + 1);
    let totalItems = cartCount.totalItems;
    let totalPrice = cartCount.totalPrice;
    setCartCount({
      totalItems: totalItems + 1,
      totalPrice: totalPrice + data.volumeInfo.pageCount,
    });
    let count = cartItem.filter((item) => item.id === data.id)[0].quantity;
    cartItem.filter((item) => item.id === data.id)[0].quantity = count + 1;

    setCartItem([...cartItem]);
  };

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };
  const purchased = (price, quantity) => {
    alert(`Purchased ${quantity} items for Rs: ${price}!`);
    setCartItem([]);
  };

  return (
    <>
      <div className="row">
        {booksData.length !== 0 ? (
          booksData.map((data) => (
            <div className="p-3 mb-5 col-6 col-md-3" key={data.id}>
              <Card className="border rounded position-relative">
                <Card.Img
                  style={{ height: "100px", cursor: "pointer" }}
                  variant="top"
                  src={data.volumeInfo.imageLinks?.thumbnail}
                  onClick={() => handleShow(data)}
                />
                <Card.Body>
                  <Card.Title
                    id={data.id}
                    className="text-secondary"
                    style={{ fontSize: 14 }}
                  >
                    {data.volumeInfo.title.slice(0, 12).trim()}...
                  </Card.Title>
                  <ReactTooltip
                    anchorId={data.id}
                    place="top"
                    content={data.volumeInfo.title}
                  />
                  <Card.Text className="mb-2">
                    Rs. {data.volumeInfo.pageCount}
                    {cartItem.length > 0 &&
                      cartItem.filter((item) => item.id == data.id)[0]
                        ?.quantity > 0 &&
                      `* ${
                        cartItem.filter((item) => item.id == data.id)[0]
                          ?.quantity
                      } = ${
                        cartItem.filter((item) => item.id == data.id)[0]
                          ?.quantity * data.volumeInfo.pageCount
                      } `}{" "}
                  </Card.Text>

                  {cartItem.length > 0 &&
                  cartItem.filter((item) => item.id == data.id)[0]?.quantity >
                    0 ? (
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="primary"
                        className="py-1"
                        style={{ fontSize: "14px" }}
                        onClick={() => decrementCart(data)}
                      >
                        -
                      </Button>
                      <span className="btn">
                        {/* {cartItem.filter((item) => item.id == data.id).length} */}
                        {
                          cartItem.filter((item) => item.id == data.id)[0]
                            .quantity
                        }
                      </span>
                      <Button
                        variant="primary"
                        className="py-1"
                        style={{ fontSize: "14px" }}
                        onClick={() => increment(data)}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Button
                      variant="primary"
                      className="py-1 w-100"
                      style={{ fontSize: "14px" }}
                      onClick={() => addToCart(data)}
                    >
                      Add
                    </Button>
                  )}
                </Card.Body>
                <div className=" position-absolute end-0 bg-dark text-light px-2 py-1 rounded m-1">
                  {data.volumeInfo.publishedDate.slice(0, 4)}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="h-100 w-100 position-absolute d-flex justify-content-center align-items-center bg-opacity-10 bg-black">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      </div>

      {cartItem.length > 0 && (
        <>
          <div
            className="cart-icon bg-dark rounded shadow"
            onClick={toggleCart}
          >
            <div className="position-relative">
              <button className="btn bg-dark text-white ps-3 pe-5 py-1 rounded">
                <AiOutlineShoppingCart />
              </button>
              <span className="position-absolute top-0 end-0 d-inline-block rounded-circle bg-light px-2 m-1">
                {cartCount.totalItems}
              </span>
            </div>
          </div>
        </>
      )}
      {cartItem.length > 0 && showCart && (
        <Cart
          cartItem={cartItem}
          increment={increment}
          decrementCart={decrementCart}
          toggleCart={toggleCart}
          cartCount={cartCount}
          setCartCount={setCartCount}
          purchased={purchased}
        />
      )}
      {showDetails && (
        <Modal show={showDetails} onHide={() => handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>{modalDetails.volumeInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column">
            <img
              src={modalDetails.volumeInfo.imageLinks?.thumbnail}
              className="align-self-center mb-3"
            />
            <p className="mb-3">
              Date of Publish : {modalDetails.volumeInfo.publishedDate}
            </p>
            <p>{modalDetails.volumeInfo.description}</p>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default Item;
