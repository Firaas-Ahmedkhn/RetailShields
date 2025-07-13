import express from "express";
import { register, login , requestOtp, resetPassword } from "../controllers/authControllers.js"; // fix typo too
console.log("🚀 authRoute.js loaded");


const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/request-otp', requestOtp);
router.post('/reset-password', resetPassword);




export default router;
