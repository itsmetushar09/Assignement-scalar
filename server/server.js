import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();

const app = express();

// ⚡ Enable CORS for all origins (or restrict to frontend URL)
app.use(cors({
  origin: "*", // <-- For testing, allow all. Replace "*" with your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- Routes ---
app.use("/api", testRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Supabase API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});