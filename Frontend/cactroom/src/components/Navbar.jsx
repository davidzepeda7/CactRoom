import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">🌱 CactRoom</h2>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/inventory">Inventario</Link></li>
        <li><Link to="/sales">Ventas</Link></li>
        <li><Link to="/history">Historial</Link></li>
        <li><Link to="/addproduct">Agregar Producto</Link></li>
        <li><button onClick={handleLogout} className="logout-btn">Cerrar sesión</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
