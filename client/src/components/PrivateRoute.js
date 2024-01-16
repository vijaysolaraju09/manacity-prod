import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, path }) => {
  const user = useSelector((state) => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
