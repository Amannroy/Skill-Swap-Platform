import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // ✅ Needed for Socket.IO
import userRoutes from './routes/userRoutes.js'; 
import swapRoutes from './routes/swapRoutes.js'; 
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Create HTTP server to enable Socket.IO
const server = http.createServer(app);

// ⚡ Setup Socket.IO for real-time communication
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend URL
        methods: ["GET", "POST"]
    }
});

// 🔌 Socket.IO connection event
io.on("connection", (socket) => {
    console.log("🟢 User connected: ", socket.id);

    // Listen for user registration (joining their room by userId)
    socket.on("register", (userId) => {
        socket.join(userId); // Join a room named after the user's ID
        console.log(`User ${userId} joined their room`);
    });

    // Detect disconnection
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

// 👉 Export io so it can be used in controllers
export { io };

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 📦 API Routes
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on PORT: ${PORT}`);
});
