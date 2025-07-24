import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // fixed import path
import employeeDashboardRoute from "./routes/employeeRoutes/dashboardRoutes.js"
import { startCronJobs } from "./utls/cronJobs.js";
import posRoutes from "./routes/employeeRoutes/posRoutes.js"
import vendorLogRoutes from "./routes/employeeRoutes/vendorLogsRoutes.js";
import NotificationRoutes from "./routes/AdminRoutes/NotificationRoutes.js"
import StatsRoutes from "./routes/AdminRoutes/StatsRoutes.js"
import PhishingRoute from "./routes/employeeRoutes/PhishingRoutes.js"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

startCronJobs();

app.get("/debug", (req, res) => res.send("🟢 Debug route works!"));
app.use("/api/auth", authRoutes); // ✅ working now
app.use("/api/empdash",employeeDashboardRoute)
app.use("/api/pos",posRoutes)
app.use("/api/notifications",NotificationRoutes)
app.use("/api/vendor",vendorLogRoutes)
app.use("/api/stats",StatsRoutes)
app.use("/api/phishing",PhishingRoute)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 3000;
app.get("/api/test", (req, res) => {
  res.send("✅ Server + routes are working");
});
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
