import Product from "../models/product.js";
import Sale from "../models/sale.js";
import dotenv from "dotenv";

dotenv.config();

// --- PRODUCTOS ---
// Crear producto
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener producto por ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- VENTAS ---
// Registrar venta y actualizar stock
export const createSale = async (req, res) => {
  try {
    const { products } = req.body;
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Producto no encontrado: " + item.productId });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });

      product.stock -= item.quantity;
      await product.save();

      total += item.price * item.quantity;
    }

    const sale = new Sale({ products, total });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener historial de ventas
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener resumen de ventas
export const getSalesSummary = async (req, res) => {
  try {
    const { period } = req.query;
    let matchDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "day") {
      matchDate = today;
    } else if (period === "week") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      matchDate = firstDayOfWeek;
    } else if (period === "month") {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      matchDate = firstDayOfMonth;
    } else if (period === "all") {
      matchDate = null; // Sin filtro, todas las ventas
    } else {
      return res.status(400).json({ message: "Periodo inválido" });
    }

    const filter = matchDate ? { createdAt: { $gte: matchDate } } : {};
    const sales = await Sale.find(filter).sort({ createdAt: -1 });

    const total = sales.reduce((acc, sale) => acc + sale.total, 0);

    res.json({ totalSales: sales.length, totalAmount: total, sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Consolidado de ventas por producto ---
export const getSalesConsolidated = async (req, res) => {
  try {
    const { period } = req.query;
    let matchDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "day") {
      matchDate = today;
    } else if (period === "week") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      matchDate = firstDayOfWeek;
    } else if (period === "month") {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      matchDate = firstDayOfMonth;
    } else if (period === "all") {
      matchDate = null; // Sin filtro de fechas
    } else {
      return res.status(400).json({ message: "Periodo inválido" });
    }

    const filter = matchDate ? { createdAt: { $gte: matchDate } } : {};

    const consolidated = await Sale.aggregate([
      { $match: filter },
      { $unwind: "$products" }, // Desglosar productos de cada venta
      {
        $group: {
          _id: "$products.productId",
          name: { $first: "$products.name" },
          image: { $first: "$products.image" },
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);

    res.json({ consolidated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Eliminar una venta
export const deleteSale = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: "Venta no encontrada" });

    // Restaurar stock
    for (const item of sale.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await Sale.findByIdAndDelete(id);

    res.json({ message: "Venta eliminada y stock restaurado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
