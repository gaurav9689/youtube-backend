// controllers/watchLaterController.js
import User from "../models/User.js";
import Video from "../models/Video.js";

// Add video to Watch Later
export const addToWatchLater = async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.watchLater.includes(videoId)) {
      user.watchLater.push(videoId);
      await user.save();
    }

    res.json({ message: "Video added to Watch Later", watchLater: user.watchLater });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove video from Watch Later
export const removeFromWatchLater = async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user._id);

    user.watchLater = user.watchLater.filter((id) => id.toString() !== videoId);
    await user.save();

    res.json({ message: "Video removed from Watch Later", watchLater: user.watchLater });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Watch Later videos
export const getWatchLater = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchLater");
    res.json(user.watchLater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
