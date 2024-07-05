import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import ShopCard from "../components/ShopCard";
import { shopData } from "../assets/data/shops";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col } from "react-bootstrap";
import cloudinary from "cloudinary-react";
import { addUserDetails } from "../redux/slices/userDetailsSlice";

import "./pages.css";
import AllProducts from "../components/AllProducts";
import AddSellProducts from "../components/AddSellProducts";
import History from "../components/History";
import Orders from "../components/Orders";

import { LuMail } from "react-icons/lu";
import { FaPhone } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
function Profile() {
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const userDetails = useSelector((state) => state.user.userDetails);
  const [image, setImage] = useState(userDetails?.profileImageLink);
  const [loader, setLoader] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Function to open the edit modal
  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const dispatch = useDispatch();

  const handleUpdateDetails = async () => {
    console.log(userDetails);
    try {
      const formattedPhoneNumber = user?.phoneNumber.replace("+", "");
      let updatedUserDetails;
      if (userDetails?.userType === "customer") {
        updatedUserDetails = {
          phoneNumber: formattedPhoneNumber,
          email: userDetails.email,
          name: userDetails.name,
          location: userDetails.location,
          about: userDetails.about,
          occupation: userDetails.occupation,
        };
      }
      if (userDetails?.userType === "business") {
        updatedUserDetails = {
          phoneNumber: formattedPhoneNumber,
          email: userDetails.email,
          name: userDetails.name,
          location: userDetails.location,
          about: userDetails.about,
          businessType: userDetails.businessType,
        };
      }

      const response = await fetch(
        `https://manacity-server.onrender.com/api/${
          userDetails?.userType === "customer"
            ? "update-user"
            : "update-business"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedUserDetails }),
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(addUserDetails(data.updatedUser));
        setEditMode(false);
      } else {
        console.error("Error updating user details:", data.message);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  // console.log(userDetails);
  // Function to handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("profileImage", file);
        setLoader(true);
        const response = await fetch(
          `https://manacity-server.onrender.com/api/update-profile-picture?phoneNumber=${userDetails?.mobileNumber}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.success) {
          dispatch(addUserDetails(data.updatedUser));
          setLoader(false);
        } else {
          if (data.errorType === "PROFILE_PICTURE_UPDATE_ERROR") {
            toast.error("Error uploading profile");
          }
          console.error("Error uploading profile:", data.error);
        }
        console.log(data); // Check the response from the server
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  // Function to handle removing the image
  const handleRemoveImage = () => {
    setImage(null);

    // Update the Redux store with a null profile image link
    dispatch(
      addUserDetails({
        ...userDetails,
        profileImageLink: null,
      })
    );
  };

  return (
    <div className="">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="p-3">
        <div className="d-flex mb-2">
          <div className="profile-container d-flex flex-column align-items-center me-3">
            <img
              className="profile__image mb-1"
              style={{ maxHeight: "160px" }}
              src={userDetails?.profileImageLink}
            />
          </div>
          <div className="py-3">
            <div className="mb-2">
              <h2 className="font-16 mb-1 text-capitalize">
                {userDetails?.name}
                <small className="text-info font-14 fw-normal">
                  {userDetails?.userType === "business" && " - Business"}
                </small>
              </h2>

              <div className="d-flex align-items-center mb-1">
                <p className="text-secondary font-12">
                  <span className="me-1">
                    <LuMail />
                  </span>
                  {userDetails?.email}
                </p>
              </div>
              <div className="d-flex align-items-center mb-1">
                <p className="text-secondary font-12">
                  <span className="me-1">
                    <FaPhone />
                  </span>
                  +{userDetails?.mobileNumber}
                </p>
              </div>
              <div class="project">
                <div class="project__toggle-radio-buttons">
                  <div>
                    <input type="checkbox" id="opened" name="theme" />
                    <label for="opened"></label>
                    <div>
                      <span></span>
                    </div>
                    <span>Opened</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h3 className="font-16">About</h3>
            <p className="profile__about-container text-secondary font-14 ">
              {userDetails?.about}
            </p>
          </div>
          <div className="d-flex">
            <div className="me-2">
              <Button
                onClick={() => fileInputRef.current.click()}
                disabled={loader}
              >
                {loader && <Spinner animation="border" size="sm" />}
                Change Profile
              </Button>
              <Form.Group
                controlId="formProfileImage"
                className="mb-3"
                style={{ display: "none" }}
              >
                <Form.Label>Profile Image:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                {loader && "loading.."}
              </Form.Group>
            </div>
            <Button onClick={handleShowEditModal} className="">
              Edit Details
            </Button>
          </div>
        </div>
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Render the edit form component here */}
            <EditProfileDetailsForm userDetails={userDetails} />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={handleCloseEditModal}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleUpdateDetails();
                handleCloseEditModal();
              }}
            >
              Update Details
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      {userDetails?.userType === "business" && (
        <>
          <Tabs
            defaultActiveKey="products"
            id="uncontrolled-tab-example"
            className="profile-tabs mb-3"
          >
            <Tab
              eventKey="products"
              title="Available"
              className="tabs-body px-3 "
            >
              <div className="h-100">
                <AddSellProducts isForSale={false} />
              </div>
            </Tab>
            <Tab eventKey="sell" title="Sell" className="tabs-body px-3">
              <AddSellProducts isForSale={true} />
            </Tab>
            <Tab eventKey="history" title="History" className="tabs-body px-3">
              <History />
            </Tab>
            <Tab eventKey="orders" title="Orders" className="tabs-body px-3">
              <Orders />
            </Tab>
          </Tabs>
        </>
      )}
      {userDetails?.userType === "customer" && (
        <Tabs
          defaultActiveKey="history"
          id="uncontrolled-tab-example"
          className="explore-tabs mb-3"
        >
          <Tab eventKey="history" title="History" className="tabs-body px-3">
            <div className="h-100">
              {shopData.map((data) => (
                <>{/* <History /> */}</>
              ))}
            </div>
          </Tab>
          <Tab eventKey="requests" title="Requests" className="tabs-body px-3">
            {shopData.map((data) => (
              <>{data.opened && <ShopCard data={data} key={data.id} />}</>
            ))}
          </Tab>
        </Tabs>
      )}
    </div>
  );
}

export default Profile;

const EditProfileDetailsForm = ({ userDetails }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="edit-mode-form">
        <Form as={Row} className="mb-3">
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              value={userDetails?.email}
              onChange={(e) =>
                dispatch(
                  addUserDetails({ ...userDetails, email: e.target.value })
                )
              }
            />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              value={userDetails?.name}
              onChange={(e) =>
                dispatch(
                  addUserDetails({ ...userDetails, name: e.target.value })
                )
              }
            />
          </Form.Group>
        </Form>

        <Form as={Row} className="mb-3">
          <Form.Group controlId="formLocation">
            <Form.Label>Location:</Form.Label>
            <Form.Control
              type="text"
              value={userDetails?.location}
              onChange={(e) =>
                dispatch(
                  addUserDetails({ ...userDetails, location: e.target.value })
                )
              }
            />
          </Form.Group>
          <Form.Group controlId="formAbout">
            <Form.Label>About:</Form.Label>
            <Form.Control
              as="textarea"
              value={userDetails?.about}
              onChange={(e) =>
                dispatch(
                  addUserDetails({ ...userDetails, about: e.target.value })
                )
              }
            />
          </Form.Group>
        </Form>
        {userDetails?.userType === "customer" ? (
          <>
            <Form as={Row} className="mb-3">
              <Form.Group controlId="formProfession">
                <Form.Label>Occupation:</Form.Label>
                <Form.Control
                  type="text"
                  value={userDetails?.occupation}
                  onChange={(e) =>
                    dispatch(
                      addUserDetails({
                        ...userDetails,
                        occupation: e.target.value,
                      })
                    )
                  }
                />
              </Form.Group>
            </Form>
          </>
        ) : (
          <>
            <Form as={Row} className="mb-3">
              <Form.Group controlId="formBusinessType">
                <Form.Label>Business Type:</Form.Label>
                <Form.Control
                  as="select"
                  value={userDetails?.businessType}
                  onChange={(e) =>
                    dispatch(
                      addUserDetails({
                        ...userDetails,
                        businessType: e.target.value,
                      })
                    )
                  }
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="shop">Shop</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </>
        )}
      </div>
    </>
  );
};
