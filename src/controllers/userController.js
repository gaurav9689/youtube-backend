// controllers/userController.js (inside subscribe logic)
import Notification from "../models/Notification";

// After adding subscription
await Notification.create({
  user: channelId,       // channel owner
  sender: req.user._id,  // subscriber
  type: "subscribe",
});
