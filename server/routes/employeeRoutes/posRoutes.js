import express from 'express';
import { createPOSEvent, getPOSEvents, getPOSStats } from '../../controllers/employeeController/PosController.js';

const router = express.Router();

router.post("/log", createPOSEvent);       // Log new POS event
router.get("/logs", getPOSEvents);         // Get all logs
router.get("/stats", getPOSStats);         // Risk level stats

export default router;
