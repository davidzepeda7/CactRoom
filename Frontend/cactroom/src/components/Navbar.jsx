import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
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
        <li>
          <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
            {/* SVG de logout */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6 3a1 1 0 0 1 1-1h5.5a.5.5 0 0 1 0 1H7a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h5.5a.5.5 0 0 1 0 1H7a1 1 0 0 1-1-1V3z"/>
              <path d="M11.854 8.354a.5.5 0 0 0 0-.708L9.5 5.293a.5.5 0 1 0-.708.708L10.293 8l-1.5 1.5a.5.5 0 0 0 .708.708l2.354-2.354z"/>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
