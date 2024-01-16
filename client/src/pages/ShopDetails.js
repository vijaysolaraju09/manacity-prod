import React, { useEffect, useState } from "react";
import "./pages.css";
import { Tab, Tabs } from "react-bootstrap";
import ShopCard from "../components/ShopCard";
import { useParams, Link } from "react-router-dom";
import AllProducts from "../components/AllProducts";

function ShopDetails() {
  const { id } = useParams();
  const [businessDetails, setBusinessDetails] = useState(null);

  useEffect(() => {
    // Fetch business details when the component mounts
    fetchBusinessDetails(id);
  }, [id]);

  const fetchBusinessDetails = async (businessId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/business-details?businessId=${businessId}`
      );
      const data = await response.json();

      if (data.success) {
        setBusinessDetails(data.user);
      } else {
        console.error("Error fetching business details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  return (
    <div className="">
      <div className="profile-container">
        <img
          className="w-100"
          style={{ maxHeight: "160px" }}
          src={businessDetails?.profileImageLink}
        />
      </div>
      <div className="p-3">
        <div className="mb-2">
          <h2 className="fw-bold font-20 mb-2">
            {businessDetails?.name}
            <small className="text-info font-14 fw-normal">
              {businessDetails?.userType === "business" && " - Business"}
            </small>
          </h2>

          <div className="d-flex align-items-center mb-1">
            <label className="font-16 me-1">Email : </label>
            <p className="text-secondary font-14">{businessDetails?.email}</p>
          </div>
          <div className="d-flex align-items-center mb-1">
            <h3 className="font-16 me-1">Phone :</h3>
            <p className="text-secondary font-14">
              +{businessDetails?.mobileNumber}
            </p>
          </div>
          <div className="mb-2">
            <h3 className="font-16">About</h3>
            <p className="text-secondary font-14">{businessDetails?.about}</p>
          </div>
        </div>
      </div>
      <div>
        <Tabs
          defaultActiveKey="products"
          id="uncontrolled-tab-example"
          className="explore-tabs mb-3"
        >
          <Tab
            eventKey="products"
            title="Available"
            className="tabs-body px-3 "
          >
            <div className="h-100">
              <AllProducts
                isForSale={false}
                isOwner={false}
                businessId={businessDetails?._id}
              />
            </div>
          </Tab>
          <Tab eventKey="buy" title="Buy" className="tabs-body px-3">
            <AllProducts
              isForSale={true}
              isOwner={false}
              businessId={businessDetails?._id}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ShopDetails;
