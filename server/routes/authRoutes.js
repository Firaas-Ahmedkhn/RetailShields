import express from "express";
import { register, login , requestOtp, resetPassword , verifySecurityQuestion , getUserById, verifyOtp} from "../controllers/authControllers.js"; // fix typo too
console.log("🚀 authRoute.js loaded");


const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/request-otp', requestOtp);
router.post('/reset-password', resetPassword);
router.post("/verify-security-question", verifySecurityQuestion);
router.get("/users/:id", getUserById);
router.post("/verify-otp",verifyOtp)



export default router;
