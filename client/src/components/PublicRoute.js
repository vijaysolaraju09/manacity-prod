import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element, path }) => {
  const user = useSelector((state) => state.auth.user);

  return user ? <Navigate to="/profile" /> : <Outlet />;
};

export default PublicRoute;
