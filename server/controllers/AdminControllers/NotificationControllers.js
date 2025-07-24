
import Notification from "../../models/AdminDashboard/NotificationSchema.js";
import mongoose  from "mongoose";


// GET /api/notifications?page=1&limit=10
export const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(),
    ]);

    res.json({
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ error: "Failed to get notifications" });
  }
};


export const getNotificationById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    // Validate both IDs first
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const notification = await Notification.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error.message);
    res.status(500).json({ error: "Server error while fetching notification" });
  }
};

// ✅ Backend controller - mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true }, // <-- make sure your schema uses "isRead"
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
};