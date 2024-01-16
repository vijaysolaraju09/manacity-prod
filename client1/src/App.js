import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Header from "./components/Header";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Buy from "./pages/Buy";
import Work from "./pages/Work";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ShopDetails from "./pages/ShopDetails";
import { fetchUserDetails } from "./services/fetchUserDetails";
import { useEffect } from "react";
import MyCart from "./pages/MyCart";
import { addUserDetails } from "./redux/slices/userDetailsSlice";
import { fetchCartDetails } from "./redux/actions/fetchCartDetails";
import Wallet from "./pages/Wallet";

function App() {
  const user = useSelector((state) => state.auth.user);
  const userDetails = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();

  const fetchAndSaveUserInfo = async () => {
    const userInfo = await fetchUserDetails(user.phoneNumber);
    dispatch(addUserDetails(userInfo));
  };

  useEffect(() => {
    if (user && user.phoneNumber) {
      // Fetch user details from the server
      fetchAndSaveUserInfo();
    }
  }, []);

  return (
    <div className="main-container container px-0">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<Signin />}></Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/explore" element={<Explore />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/wallet" element={<Wallet />}></Route>
            <Route path="/work" element={<Work />}></Route>
            <Route path="/explore/:id" element={<ShopDetails />}></Route>
            <Route path="/cart" element={<MyCart />}></Route>
          </Route>
        </Routes>
        {user && <Navigation />}
      </BrowserRouter>
    </div>
  );
}

export default App;
// make home, profile, shop,explore protected routes using best practices
