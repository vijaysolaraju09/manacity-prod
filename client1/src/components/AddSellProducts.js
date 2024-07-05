import React, { useState, useEffect } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ImPlus } from "react-icons/im";
import { Toaster, toast } from "react-hot-toast";

function AddSellProducts({ isForSale }) {
  const businessId = useSelector((state) => state.user.userDetails._id);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [uploadProductImage, setUploadProductImage] = useState(null);
  // Additional state for input validation
  const [productNameError, setProductNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [stockQuantityError, setStockQuantityError] = useState("");

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState();
  const [addProductLoader, setAddProductLoader] = useState(false);

  const handleCloseModal = () => {
    // Reset error messages when closing the modal
    setProductNameError("");
    setPriceError("");
    setDescriptionError("");
    setStockQuantityError("");
    setShowModal(false);
  };

  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    // Fetch all products when the component mounts
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(
        `https://manacity-server.onrender.com/api/all-products?businessId=${businessId}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        console.error("Error fetching products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = async () => {
    // Validate input fields before making the API call
    setAddProductLoader(true);
    if (!productName) {
      setProductNameError("Product Name is required");
      return;
    }
    if (!price) {
      setPriceError("Price is required");
      return;
    }
    if (!description) {
      setDescriptionError("Description is required");
      return;
    }
    if (!stockQuantity) {
      setStockQuantityError("Stock Quantity is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productImage", uploadProductImage);
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stockQuantity", stockQuantity);
      formData.append("businessId", businessId);

      if (isForSale) {
        formData.append("isForSale", true);
      } else {
        formData.append("isForSale", false);
      }

      const response = await fetch(
        "https://manacity-server.onrender.com/api/add-product",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Product added successfully:", data.newProduct);
        // Optionally, reset form fields after successful submission
        setProductName("");
        setPrice(0);
        setDescription("");
        setStockQuantity(0);
        // Fetch updated product list
        fetchAllProducts();
        // Close the modal
        handleCloseModal();
        setAddProductLoader(false);
        toast.success("Product added successfully:");
      } else {
        console.error("Error adding product:", data.error);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(
        "https://manacity-server.onrender.com/api/remove-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Fetch updated product list
        fetchAllProducts();
      } else {
        console.error("Error removing product:", data.error);
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div>
      {/* Button to show modal */}
      <Toaster toastOptions={{ duration: 4000 }} />
      <Button
        variant="primary"
        onClick={handleShowModal}
        className="add-product__button"
      >
        <span className="me-1">
          <ImPlus />
        </span>
        {isForSale ? "Sell Product" : "Add Product"}
      </Button>

      {/* Modal for adding product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isForSale ? "Sell Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add product form inside modal */}
            <Form>
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
                {/* Display error message */}
                <Form.Text className="text-danger">
                  {productNameError}
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                {/* Display error message */}
                <Form.Text className="text-danger">{priceError}</Form.Text>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                {/* Display error message */}
                <Form.Text className="text-danger">
                  {descriptionError}
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="stockQuantity">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter stock quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                />
                {/* Display error message */}
                <Form.Text className="text-danger">
                  {stockQuantityError}
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formProfileImage" className="mb-3">
                <Form.Label>Profile Image:</Form.Label>
                {image ? (
                  <div className="">
                    <img
                      src={uploadProductImage}
                      alt="Profile"
                      className="w-100 me-2"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onChange={(e) => setUploadProductImage(null)}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadProductImage(e.target.files[0])}
                  />
                )}
              </Form.Group>
            </Form>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            {addProductLoader && <Spinner animation="border" size="sm" />}
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Display all products */}
      <div className="row">
        {products?.length !== 0 &&
          products.map(
            (product) =>
              // Check if the product is for sale or not
              (isForSale ? product.isForSale : !product.isForSale) && (
                <div className="px-2 col-md-3" key={product._id}>
                  <Card className="border rounded position-relative">
                    <Card.Img
                      style={{ height: "100px", cursor: "pointer" }}
                      variant="top"
                      src={product?.imageURL}
                    />
                    <Card.Body>
                      <Card.Title
                        id={product._id}
                        className="text-secondary"
                        style={{ fontSize: 14 }}
                      >
                        {product.productName.slice(0, 12).trim()}...
                      </Card.Title>

                      <Card.Text className="mb-2 fw-bold">
                        Rs. {product.price}
                      </Card.Text>
                      <Card.Text className="mb-2">
                        {product.description}
                      </Card.Text>
                      <Card.Text className="mb-2 fw-bold">
                        available - {product.stockQuantity}
                      </Card.Text>
                      <Button
                        variant="danger"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        Remove
                      </Button>
                    </Card.Body>
                    {/* <div className=" position-absolute end-0 bg-dark text-light px-2 py-1 rounded m-1">
                      50%
                    </div> */}
                  </Card>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default AddSellProducts;
