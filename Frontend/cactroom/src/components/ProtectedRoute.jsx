// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const isLogged = localStorage.getItem("loggedIn");

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />  {/* Solo se renderiza cuando el usuario está logueado */}
      {children}
    </>
  );
};

export default ProtectedRoute;
