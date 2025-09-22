// Dependencias
import express from "express";
import cors from "cors";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import salesRoutes from "./src/routes/sales.js";

// Rutas
import productsRoutes from "./src/routes/products.js";


const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://cact-room.vercel.app"],  // permite ambos puertos
    credentials: true,
  })
);
app.use(express.json());

// Endpoints
app.use("/api/products", productsRoutes);   // Productos
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes); 
app.use("/api/sales", salesRoutes);  
      // Ventas



export default app;
