import React, { useEffect, useState } from "react";
import "../Styles/Sales.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://cactroom.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Error al cargar productos ⚠️");
    }
  };

  const addToCart = (product) => {
    const exists = cart.find((p) => p.productId === product._id);
    if (exists) {
      setCart(
        cart.map((p) =>
          p.productId === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
      toast.info(`Cantidad de ${product.name} aumentada ➕`);
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
      toast.success(`${product.name} agregado al carrito 🛒`);
    }
  };

  const handleSale = async () => {
    try {
      const res = await fetch("https://cactroom.onrender.com/api/products/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cart }),
      });

      if (res.ok) {
        toast.success("Venta registrada con éxito");
        setCart([]);
        fetchProducts();
      } else {
        toast.error("❌ Error al registrar la venta");
      }
    } catch (err) {
      toast.error("⚠️ Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="sales-page">
      <br />
      <br />
      <h1>Realizar Venta</h1>

      <div className="products-list">
        <h2>Productos disponibles:</h2>
        <ul>
          {products.map((p) => (
            <li key={p._id}>
              {p.image && (
                <img src={p.image} alt={p.name} className="product-image" />
              )}
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-price">${p.price}</span>
                <span className="product-stock">Stock: {p.stock}</span>
              </div>
              <button onClick={() => addToCart(p)}>Agregar</button>
            </li>
          ))}
        </ul>
      </div>
<div className="cart">
  <h2>Carrito:</h2>
  <ul>
    {cart.map((c) => (
      <li key={c.productId} className="cart-item">
        {c.image && (
          <img src={c.image} alt={c.name} className="product-image" />
        )}
        <div className="product-info">
          <span className="product-name">{c.name}</span>
          <span className="product-price">
            {c.quantity} x ${c.price}
          </span>
        </div>
        {/* Botón para eliminar producto */}
        <button
          className="remove-btn"
          onClick={() => {
            setCart(cart.filter((p) => p.productId !== c.productId));
            toast.info(`${c.name} eliminado del carrito ❌`);
          }}
        >
          X
        </button>
      </li>
    ))}
  </ul>
  {cart.length > 0 && (
    <button onClick={handleSale}>Vender</button>
  )}
</div>


      {/* Contenedor de notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={3000}   // desaparece solo en 3 segundos
        closeButton={false} // quita la "X"
        hideProgressBar={false} // opcional: mantener barra de progreso
      />
    </div>
  );
};

export default SalesPage;
