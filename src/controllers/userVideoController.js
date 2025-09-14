// src/controllers/userVideoController.js
import User from "../models/User.js";
import Video from "../models/Video.js";
import Notification from "../models/Notification.js"; // Import Notification model

// Add video to Watch Later
export const addToWatchLater = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const videoId = req.params.id;

    if (!user.watchLater.includes(videoId)) {
      user.watchLater.push(videoId);
      await user.save();
    }

    res.json({ message: "Added to Watch Later", watchLater: user.watchLater });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove video from Watch Later
export const removeFromWatchLater = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchLater = user.watchLater.filter(
      (v) => v.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: "Removed from Watch Later", watchLater: user.watchLater });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Watch Later list
export const getWatchLater = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchLater");
    res.json(user.watchLater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add video to History
export const addToHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const videoId = req.params.id;

    // Remove old entry if exists
    user.history = user.history.filter((h) => h.video.toString() !== videoId);

    // Add latest watch entry
    user.history.unshift({ video: videoId, watchedAt: new Date() });

    await user.save();
    res.json({ message: "Added to History", history: user.history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get History
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("history.video");
    res.json(user.history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Example: Like a video with notification
export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
      await video.save();

      // ✅ Create notification for video owner
      if (!video.user.equals(userId)) { // don't notify if user likes own video
        await Notification.create({
          user: video.user,      // video owner
          sender: userId,        // liker
          type: "like",
          video: videoId,
          message: `${req.user.username} liked your video.`,
        });
      }
    }

    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
