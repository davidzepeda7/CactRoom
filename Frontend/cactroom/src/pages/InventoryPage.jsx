import React, { useEffect, useState } from "react";
import "../Styles/Inventory.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryPage = ({ refresh }) => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detecta cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://cactroom.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Error al cargar productos ⚠️");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://cactroom.onrender.com/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Producto eliminado correctamente");
        setProducts(products.filter(p => p._id !== id));
      } else {
        toast.error("Error al eliminar el producto ❌");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor ⚠️");
    }
  };

  const handleStockChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setProducts(products.map(p => p._id === id ? { ...p, stock: value } : p));
    }
  };

  const handleUpdateStock = async (id, stock) => {
    try {
      const res = await fetch(`https://cactroom.onrender.com/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(stock) })
      });
      if (res.ok) {
        toast.success("Stock actualizado correctamente");
        const updatedProduct = await res.json();
        setProducts(products.map(p => p._id === id ? updatedProduct : p));
      } else {
        toast.error("Error al actualizar stock");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor ⚠️");
    }
  };

  return (
    <div className="inventory">
      <br />
      <h1>Inventario</h1>

      {/* --- Tabla Desktop --- */}
      {!isMobile && (
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.image ? <img src={p.image} alt={p.name} className="product-image" /> : "Sin imagen"}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>
                  <input type="text" value={p.stock} onChange={(e) => handleStockChange(p._id, e.target.value)} />
                  <button className="update-stock-btn" onClick={() => handleUpdateStock(p._id, p.stock)}>💾</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Cards Mobile --- */}
      {isMobile && (
        <div className="product-cards">
          {products.map((p) => (
            <div className="product-card" key={p._id}>
              {p.image ? <img src={p.image} alt={p.name} /> : <span>Sin imagen</span>}
              <div className="card-info">
                <span><strong>Nombre:</strong> {p.name}</span>
                <span><strong>Categoría:</strong> {p.category}</span>
                <span><strong>Precio:</strong> ${p.price}</span>
                <span>
                  <input type="text" value={p.stock} onChange={(e) => handleStockChange(p._id, e.target.value)} />
                  <button onClick={() => handleUpdateStock(p._id, p.stock)}>💾</button>
                </span>
                <button onClick={() => handleDelete(p._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
              position="top-right"
              autoClose={2000}
              closeButton={true}
              hideProgressBar={false}
              style={{ top: "90px" }} // ajusta este valor según quieras
            />
    </div>
  );
};

export default InventoryPage;
