import React, { useState, useEffect } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchUserDetails } from "../services/fetchUserDetails";
import { fetchCartDetails } from "../redux/actions/fetchCartDetails";

function AllProducts({ isForSale, businessId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products when the component mounts
    if (businessId) {
      fetchAllProducts();
    }
  }, [businessId]);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(
        `https://manacity-server.onrender.com/api/all-products?businessId=${businessId}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);

        // fetchUserDetails(userDetails.mobileNumber);
      } else {
        console.error("Error fetching products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <div>
        <h2>{isForSale ? "Sell" : "Available"} Products</h2>

        {/* Display all products */}
        <div className="row">
          <div className="wrapper">
            {products?.length !== 0 &&
              products.map(
                (product) =>
                  // Check if the product is for sale or not
                  (isForSale ? product.isForSale : !product.isForSale) &&
                  product.stockQuantity > 0 && (
                    <>
                      <ProductCard product={product} />
                    </>
                  )
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllProducts;
