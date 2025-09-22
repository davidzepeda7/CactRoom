import React, { useEffect, useState } from "react";
import "../Styles/Inventory.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryPage = ({ refresh }) => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Modal de eliminar producto
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [password, setPassword] = useState("");

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

  // Abrir modal de eliminar
  const handleOpenModal = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
    setPassword("");
  };

  const handleDelete = async () => {
    if (!password) {
      toast.error("Debes ingresar la contraseña.");
      return;
    }

    try {
      const res = await fetch(
        `https://cactroom.onrender.com/api/products/${selectedProductId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al eliminar el producto");
        return;
      }

      toast.success("Producto eliminado correctamente");
      setProducts(products.filter((p) => p._id !== selectedProductId));
      handleCloseModal();
    } catch (err) {
      toast.error("Error de conexión con el servidor ⚠️");
    }
  };

  const handleStockChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setProducts(products.map((p) => (p._id === id ? { ...p, stock: value } : p)));
    }
  };

  const handleUpdateStock = async (id, stock) => {
    try {
      const res = await fetch(`https://cactroom.onrender.com/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(stock) }),
      });
      if (res.ok) {
        toast.success("Stock actualizado correctamente");
        const updatedProduct = await res.json();
        setProducts(products.map((p) => (p._id === id ? updatedProduct : p)));
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
                  <button onClick={() => handleOpenModal(p._id)}>Eliminar</button>
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
                <button onClick={() => handleOpenModal(p._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de eliminación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Eliminar Producto</h3>
            <p>Ingresa la contraseña para confirmar la eliminación del producto.</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleCloseModal} className="cancel-btn">Cancelar</button>
              <button onClick={handleDelete} className="confirm-btn">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeButton={true}
        hideProgressBar={false}
        style={{ top: "90px" }}
      />
    </div>
  );
};

export default InventoryPage;
