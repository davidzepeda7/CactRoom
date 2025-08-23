import React, { useState } from "react";
import "../Styles/AddProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductPage = ({ onAdd = () => { } }) => {
  const initialState = {
    name: "",
    category: "Planta",
    price: "",
    stock: "",
    image: ""
  };

  const [product, setProduct] = useState(initialState);

  const handleChange = e => {
    const { name, value } = e.target;

    // Precio puede ser decimal, stock solo números enteros
    if (name === "price") {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setProduct({ ...product, [name]: value });
      }
    } else if (name === "stock") {
      if (value === "" || /^[0-9]*$/.test(value)) {
        setProduct({ ...product, [name]: value });
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.stock) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (parseFloat(product.price) <= 0 || parseInt(product.stock) <= 0) {
      toast.error("Precio y Stock deben ser mayores a 0.");
      return;
    }

    try {
      const res = await fetch("https://cactroom.onrender.comapi/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock)
        })
      });

      if (!res.ok) throw new Error("Error al agregar producto");

      setProduct(initialState);
      toast.success("Producto agregado correctamente");
      onAdd();
    } catch (err) {
      toast.error("No se pudo agregar el producto");
      console.error(err);
    }
  };

  const handleClear = () => {
    setProduct(initialState);
  };

  return (
    <div className="add-product-page">
      <br />
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          value={product.name}
          onChange={handleChange}
          required
        />

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            name="category"
            placeholder="Categoría"
            value={product.category}
            onChange={handleChange}
          />
          <span style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "0.9rem" }}>
            U otra categoría
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            name="price"
            placeholder="Precio (decimales permitidos)"
            value={product.price}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            name="stock"
            placeholder="Stock (solo números enteros)"
            value={product.stock}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>

        <input
          name="image"
          placeholder="URL imagen"
          value={product.image}
          onChange={handleChange}
        />

        <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button type="submit">Agregar</button>
          <button type="button" onClick={handleClear}>Limpiar</button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
        hideProgressBar={false}
      />
    </div>
  );
};

export default AddProductPage;
