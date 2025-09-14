import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Receiver of the notification

    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // User who triggered the notification (optional)

    type: {
      type: String,
      enum: ["subscribe", "like", "comment"],
      required: true,
    }, // Type of notification

    video: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Video" 
    }, // Associated video if type is 'like' or 'comment'

    isRead: { 
      type: Boolean, 
      default: false 
    }, // Has the notification been read

    message: { 
      type: String 
    }, // Optional custom message

    link: { 
      type: String 
    }, // Optional link related to notification
  },
  { timestamps: true }
);

// Index for faster querying unread notifications
notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
