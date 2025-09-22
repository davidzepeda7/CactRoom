import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createSale,
  getSales,
  getSalesSummary,
  getSalesConsolidated,
  deleteSale
} from "../controllers/ctrlProducts.js";

const router = Router();

// PRODUCTOS
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// VENTAS
router.post("/sale", createSale);
router.get("/sales", getSales);
router.get("/sales/summary", getSalesSummary);
router.get("/sales/consolidated", getSalesConsolidated);
router.delete("/sales/:id", deleteSale);

export default router;
