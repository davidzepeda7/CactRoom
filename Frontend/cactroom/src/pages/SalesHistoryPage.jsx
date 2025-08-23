import React, { useEffect, useState } from "react";
import "../Styles/History.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesHistoryPage = () => {
  const [summary, setSummary] = useState({});
  const [period, setPeriod] = useState("day");

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/products/sales/summary?period=${period}`
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
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [period]);

  return (
    <div className="history-page">
      <br />
      <h2>Historial de Ventas</h2>

      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="day">Hoy</option>
        <option value="week">Esta semana</option>
      </select>

      <div className="summary-info">
        <p><strong>Total ventas:</strong> {summary.totalSales || 0}</p>
        <p><strong>Total monto:</strong> ${summary.totalAmount || 0}</p>
      </div>

      <ul className="sales-list">
        {summary.sales?.map((sale) => (
          <li key={sale._id} className="sale-item">
            <div className="sale-header">
              <span>{new Date(sale.createdAt).toLocaleString()}</span>
              <span><strong>Total:</strong> ${sale.total}</span>
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
                    <span className="product-quantity">Cantidad: {p.quantity}</span>
                    {p.price && <span className="product-price">Precio: ${p.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
        hideProgressBar={false}
      />
    </div>
  );
};

export default SalesHistoryPage;
