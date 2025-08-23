import React, { useEffect, useState } from "react";
import "../Styles/Inventory.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryPage = ({ refresh }) => {
  const [products, setProducts] = useState([]);

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
    // Solo números positivos
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
        // Actualizamos el estado local para reflejar el cambio inmediatamente
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
                <input
                  type="text"
                  value={p.stock}
                  onChange={(e) => handleStockChange(p._id, e.target.value)}
                />
                <button className="update-stock-btn" onClick={() => handleUpdateStock(p._id, p.stock)}>💾</button>
              </td>
              <td>
                <button onClick={() => handleDelete(p._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
        hideProgressBar={false}
      />
    </div>
  );
};

export default InventoryPage;
