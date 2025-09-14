// controllers/historyController.js
import User from "../models/User.js";

// Add video to history
export const addToHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if already exists
    const exists = user.history.find((h) => h.video.toString() === videoId);

    if (exists) {
      exists.watchedAt = new Date(); // Update timestamp if rewatched
    } else {
      user.history.push({ video: videoId });
    }

    await user.save();
    res.json({ message: "Video added to history", history: user.history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("history.video");
    res.json(user.history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear history
export const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.history = [];
    await user.save();
    res.json({ message: "History cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
