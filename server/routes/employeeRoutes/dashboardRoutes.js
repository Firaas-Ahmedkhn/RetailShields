
import express from "express";
import { updateSystemHealth,logLoginActivity,getDashboardSummary,getSystemHealth } from "../../controllers/employeeController/dashboardController.js";
const router = express.Router();


// POST/PUT system health (admin usage)
router.get('/system-health', getSystemHealth);

router.post('/system-health/update',updateSystemHealth)

// POST login activity (triggered on login)
router.post('/login-activity', logLoginActivity);

// GET all dashboard summary
router.get('/summary', getDashboardSummary);

export default router;
