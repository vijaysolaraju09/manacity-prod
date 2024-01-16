import React from "react";
import { FaDirections, FaMapMarkedAlt, FaStar } from "react-icons/fa";
import { FcShop } from "react-icons/fc";
function ShopCard(props) {
  const shopData = props.data;
  return (
    <>
      <div className="shadow-sm border rounded-2 mb-3 ">
        <div className="w-100 px-2 py-3 d-flex justify-content-between align-items-start ">
          <div className="d-flex ">
            <img
              className="shop-img me-2 rounded-circle"
              src="https://placekitten.com/800/400"
            />
            <div>
              <h5 className="small-title">{shopData.name}</h5>
              <div className="d-flex align-items-center">
                {/* {shopData.icon} */}
                <span className="text-secondary small-title ms-1">
                  {shopData.businessType}
                </span>
              </div>
            </div>
          </div>
          {shopData.isOpened && (
            <div className="d-flex align-items-center">
              <span className="active-circle d-block rounded-circle me-1"></span>
              <p className="text-success" style={{ fontSize: "12px" }}>
                Opened
              </p>
            </div>
          )}
        </div>
        <button
          className="btn p-1 w-100 d-block text-center   border-top"
          onClick={() => window.open(shopData.location, "_blanks")}
        >
          <FaMapMarkedAlt />
          <span className="text-secondary small-title ms-1">View on maps</span>
        </button>
      </div>
    </>
  );
}

export default ShopCard;
