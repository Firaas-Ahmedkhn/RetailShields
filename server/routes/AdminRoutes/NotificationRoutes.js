import express from "express";

import {getNotifications , getNotificationById ,markNotificationAsRead ,getUnreadCount} from "../../controllers/AdminControllers/NotificationControllers.js"
import verifyToken from "../../middleware/middleware.js"
const router = express.Router();

router.get("/",getNotifications);
router.get("/user/:id",verifyToken,getNotificationById);
router.patch("/:id/read", markNotificationAsRead);
router.get("/unread-count",getUnreadCount);


export default router;