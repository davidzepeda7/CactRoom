import React, { useEffect, useState } from "react";
import "../Styles/History.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesHistoryPage = () => {
  const [summary, setSummary] = useState({});
  const [period, setPeriod] = useState("day");
  const [loading, setLoading] = useState(false);

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [password, setPassword] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://cactroom.onrender.com/api/products/sales/summary?period=${period}`
      );
      const data = await res.json();
      setSummary(data);

      if (!data.sales || data.sales.length === 0) {
        toast.info("No hay ventas registradas en este período.");
      } else {
        toast.success("Historial cargado correctamente.");
      }
    } catch (error) {
      toast.error("Error al cargar el historial de ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [period]);

  // Abrir modal
  const handleOpenModal = (saleId) => {
    setSelectedSaleId(saleId);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSaleId(null);
    setPassword("");
  };

  // Eliminar venta
  const handleDeleteSale = async () => {
    if (!password) {
      toast.error("Debes ingresar la contraseña.");
      return;
    }

    try {
      const res = await fetch(
        `https://cactroom.onrender.com/api/products/sales/${selectedSaleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al eliminar la venta.");
        return;
      }

      toast.success("Venta eliminada correctamente.");
      fetchSummary();
      handleCloseModal();
    } catch (error) {
      toast.error("Error de conexión al eliminar la venta.");
    }
  };

  return (
    <div className="history-page">
      <br />
      <h2>Historial de Ventas</h2>

      <div className="filters-container">
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="day">Hoy</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mes</option>
          <option value="all">Todas</option>
        </select>
      </div>

      {loading && <p className="loading-text">Cargando historial...</p>}

      <div className="summary-info">
        <p>
          <strong>Total ventas:</strong> {summary.totalSales || 0}
        </p>
        <p>
          <strong>Total monto:</strong> ${summary.totalAmount || 0}
        </p>
      </div>

      <ul className="sales-list">
        {summary.sales?.map((sale) => (
          <li key={sale._id} className="sale-item">
            <div className="sale-header">
              <span>{new Date(sale.createdAt).toLocaleString()}</span>
              <span>
                <strong>Total:</strong> ${sale.total}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleOpenModal(sale._id)}
              >
                Eliminar
              </button>
            </div>

            <div className="products-container">
              {sale.products.map((p, idx) => (
                <div key={idx} className="sale-product">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="sale-product-image"
                    />
                  )}
                  <div className="product-details">
                    <span className="product-name">{p.name}</span>
                    <span className="product-quantity">
                      Cantidad: {p.quantity}
                    </span>
                    {p.price && (
                      <span className="product-price">Precio: ${p.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para confirmar eliminación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Eliminar Venta</h3>
            <p>
              Ingresa la contraseña para confirmar la eliminación de la venta.
            </p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleCloseModal} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={handleDeleteSale} className="confirm-btn">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={1500}
        closeButton={true}
        hideProgressBar={false}
        style={{ top: "90px" }}
      />
    </div>
  );
};

export default SalesHistoryPage;
