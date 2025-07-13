
import express from "express";
import {
  createVendorLog,
  getVendorLogs,
} from "../../controllers/employeeController/vendorLogController.js";

const router = express.Router();

router.post("/log", createVendorLog);   // POST: Log vendor activity
router.get("/logs", getVendorLogs);     // GET: Get all logs

export default router;
