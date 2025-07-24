import express from 'express';

import { phishing } from '../../controllers/employeeController/PhishingController.js';

const router = express.Router();

router.post("/analyze",phishing);

export default router;


