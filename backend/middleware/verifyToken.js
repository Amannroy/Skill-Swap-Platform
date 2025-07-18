import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach user ID to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
