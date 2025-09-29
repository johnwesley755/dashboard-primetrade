import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To accept JSON data

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
