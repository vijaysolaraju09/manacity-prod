import React, { useEffect, useState } from "react";
import { Button, InputGroup, Tab, Tabs, Form } from "react-bootstrap";
import ShopCard from "../components/ShopCard";
import "./pages.css";
import { shopData } from "../assets/data/shops";
import { Link } from "react-router-dom";
function Explore() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    // Fetch all businesses when the component mounts
    fetchAllBusinesses();
  }, []);

  const fetchAllBusinesses = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/all-businesses");
      const data = await response.json();

      if (data.success) {
        setBusinesses(data.businesses);
      } else {
        console.error("Error fetching businesses:", data.error);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };
  return (
    <div className="explore">
      <div className="p-3">
        <h3 className="primary-title mb-2">Explore your city </h3>
        <div className="d-flex justify-content-center mb-lg-3">
          <InputGroup className="">
            <Form.Control
              placeholder="Enter product name"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              type="search"
              className=" shadow-none"
            />
            <Button variant="outline-dark" id="button-addon2" className="m-0">
              Search
            </Button>
          </InputGroup>
        </div>
      </div>
      <Tabs
        defaultActiveKey="all-shops"
        id="uncontrolled-tab-example"
        className="explore-tabs mb-3"
      >
        <Tab eventKey="all-shops" title="All Shops" className="tabs-body px-3">
          <div className="h-100">
            {businesses?.map((business) => (
              <Link to={`/explore/${business._id}`} key={business._id}>
                <ShopCard data={business} key={business._id} />
              </Link>
            ))}
          </div>
        </Tab>
        <Tab eventKey="opened" title="Opened" className="tabs-body px-3">
          {businesses?.map((business) => (
            <>
              {business.isOpened && (
                <>
                  <Link to={`/explore/${business._id}`} key={business._id}>
                    <ShopCard data={business} key={business._id} />
                  </Link>
                </>
              )}
            </>
          ))}
        </Tab>
      </Tabs>
    </div>
  );
}

export default Explore;
