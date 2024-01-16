import React from "react";

function ProductsItemCard() {
  return (
    <div>
      <div className="wrapper">
        <div className="single-card">
          <div className="img-area">
            <img src="img/1.jpg" alt="" />
            <div className="overlay">
              <button className="add-to-cart">Add to Cart</button>
              <button className="view-details">View Details</button>
            </div>
          </div>

          <div className="info">
            <h3>Mobile Phone</h3>
            <p className="price">$199.99</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
          </div>
        </div>

        <div className="single-card">
          <div className="img-area">
            <img src="img/2.jpg" alt="" />
            <div className="overlay">
              <button className="add-to-cart">Add to Cart</button>
              <button className="view-details">View Details</button>
            </div>
          </div>
          <div className="info">
            <h3>Laptop</h3>
            <p className="price">$599.99</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
          </div>
        </div>

        <div className="single-card">
          <div className="img-area">
            <img src="img/3.jpg" alt="" />
            <div className="overlay">
              <button className="add-to-cart">Add to Cart</button>
              <button className="view-details">View Details</button>
            </div>
          </div>
          <div className="info">
            <h3>Headphone</h3>
            <p className="price">$29.99</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsItemCard;
