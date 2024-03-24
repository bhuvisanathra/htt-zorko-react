import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("auth") ? true : false;

  return isAuthenticated ? children : <Navigate replace to="/login" />;
}

export default PrivateRoute;
