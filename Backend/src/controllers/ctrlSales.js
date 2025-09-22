import Sale from "../models/sale.js";
import Product from "../models/product.js";

// Consolidado por producto
export const getProductSummary = async (req, res) => {
  try {
    // Traer todas las ventas
    const sales = await Sale.find();

    // Traer productos
    const products = await Product.find();

    // Fechas de referencia
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Estructura base de cada producto
    const summary = products.map((product) => ({
      productId: product._id,
      name: product.name,
      image: product.image,
      week: 0,
      month: 0,
      general: 0,
    }));

    // Recorrer ventas y acumular cantidades
    sales.forEach((sale) => {
      sale.products.forEach((p) => {
        const productSummary = summary.find(item => item.productId.equals(p._id));
        if (productSummary) {
          const saleDate = new Date(sale.createdAt);

          // Acumular siempre en general
          productSummary.general += p.quantity;

          // Si es de esta semana
          if (saleDate >= startOfWeek) {
            productSummary.week += p.quantity;
          }

          // Si es de este mes
          if (saleDate >= startOfMonth) {
            productSummary.month += p.quantity;
          }
        }
      });
    });

    res.json(summary);
  } catch (error) {
    console.error("Error en consolidado por producto:", error);
    res.status(500).json({ message: "Error obteniendo consolidado por producto" });
  }
};
