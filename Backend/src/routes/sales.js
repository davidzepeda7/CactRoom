import express from "express";
import { getProductSummary } from "../controllers/ctrlSales.js";

const router = express.Router();

router.get("/product-summary", getProductSummary);

export default router;
