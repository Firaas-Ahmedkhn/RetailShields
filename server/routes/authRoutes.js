import express from "express";
import verifyToken from "../middleware/middleware.js"
import { register, login, requestOtp, resetPassword, verifySecurityQuestion, getUserById, verifyOtp, getAllUsers, updateUser, deleteUser, getSuspiciousLogins, getSuspiciousUsers } from "../controllers/authControllers.js"; // fix typo too
console.log("🚀 authRoute.js loaded");


const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/request-otp', requestOtp);
router.post('/reset-password', resetPassword);
router.post("/verify-security-question", verifySecurityQuestion);
router.get("/users/:id", getUserById);
router.post("/verify-otp", verifyOtp)
router.get("/users", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/suslogin", getSuspiciousLogins)
router.get("/sususers",getSuspiciousUsers)


export default router;
