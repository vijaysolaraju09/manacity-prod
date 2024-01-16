import React, { useState, useEffect } from "react";
import Item from "./Item";
import Cart from "./Cart";
import { BookApi } from "./data.js";
import Spinner from "react-bootstrap/Spinner";
import "./book-store.css";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";

function LocalStore() {
  const [searchVal, setSearchVal] = useState("react");
  const [booksData, setBooksData] = useState([]);
  let BooksAPI = `https://www.googleapis.com/books/v1/volumes?q=${searchVal}?maxResults=40`;

  const fetchUrl = () => {
    const response = fetch(BooksAPI);

    response
      .then((res) => res.json())
      .then((data) => {
        setBooksData(data.items);
      });
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  const searchBook = (e) => {
    let inputVal = e.target.value.toLowerCase();
    setSearchVal(inputVal);

    // setFilteredData(() =>
    //   booksData.filter((book) =>
    //     book.volumeInfo.title.toLowerCase().includes(inputVal)
    //   )
    // );
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center pt-3 mb-lg-3">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter product name"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              type="search"
              className=" shadow-none"
              onBlur={searchBook}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              className="m-0"
              onClick={fetchUrl}
            >
              Search
            </Button>
          </InputGroup>
          {/* <input
            type="search"
            className="form-control me-2 me-lg-3 shadow-none"
            onBlur={searchBook}
          />
          <button className="btn btn-primary m-0" onClick={fetchUrl}>
            Search
          </button> */}
        </div>
        <div className="d-flex flex-wrap">
          <Item booksData={booksData} />
        </div>
      </div>
    </>
  );
}

export default LocalStore;
