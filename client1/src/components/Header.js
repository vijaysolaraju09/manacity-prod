import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logoImg from "../assets/images/city.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa6";

import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhoneNumber,
  logoutSuccess,
  setOtpVerified,
} from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase.config";
import { removeUserDetails } from "../redux/slices/userDetailsSlice";
import { useEffect } from "react";
import { fetchCartDetails } from "../redux/actions/fetchCartDetails";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.pathname;
  const user = useSelector((state) => state.auth.user);
  const userDetails = useSelector((state) => state.user.userDetails);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userDetails?._id) {
      dispatch(fetchCartDetails(userDetails?._id));
    }
  }, [userDetails]);
  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);
  const onLogout = () => {
    // Perform logout action
    signOut(auth)
      .then(() => {
        dispatch(logoutSuccess());
        dispatch(addPhoneNumber());
        dispatch(setOtpVerified(false));
        dispatch(removeUserDetails());
        // setUser(null);
        toast.success("Logout successful!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Logout failed!");
      });
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary py-3 shadow header"
    >
      <Container>
        <Link to="/home" className="d-flex nav-brand align-items-end">
          <img src={logoImg} className="logo-img d-block me-1 mb-2" />
          <h1 className="logo-title">manaCity</h1>
        </Link>

        {!user && (
          <Link
            to="/signin"
            className="nav-button nav-link d-block rounded-2 text-white px-2 py-1"
          >
            SignIn
          </Link>
        )}
        {user && (
          <>
            <Link to="/cart" className="nav-link">
              <FaCartArrowDown />
              {cartItems?.length}
            </Link>
            {currentLocation === "/profile" ? (
              <button onClick={onLogout} className="btn btn-danger p-0 px-1">
                Logout
              </button>
            ) : (
              <>
                <Link to="/profile" className="d-flex align-items-center">
                  <img
                    src={userDetails?.profileImageLink}
                    className="header-profile"
                  />
                </Link>
              </>
            )}
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
