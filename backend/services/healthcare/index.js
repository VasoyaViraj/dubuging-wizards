import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";

import internalRoutes from "./src/routes/internal.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Internal routes (protected by Service JWT)
app.use("/internal", internalRoutes);

// Health check (public)
app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "Healthcare Microservice", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🏥 Healthcare Microservice running at http://localhost:${PORT}`);
  console.log(`   Internal endpoints: /internal/*`);
  console.log(`   Health check: /health\n`);
});
