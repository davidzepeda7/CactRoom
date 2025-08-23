// src/middlewares/authMiddleware.js
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
