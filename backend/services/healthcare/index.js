import "dotenv/config";
import express from "express";
import {connectDB} from "./src/config/db.js";

import patientRoutes from "./src/routes/patient.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import internalRoutes from "./src/routes/internal.routes.js"
const app = express();
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/health/patients", patientRoutes);
app.use("/health/appointments", appointmentRoutes);
app.use("/health/internal",internalRoutes)

// Health check
app.get("/health/system/status", (req, res) => {
  res.json({ status: "UP", service: "Nexus Health" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Nexus Health running on port ${PORT}`);
});
