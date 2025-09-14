// controllers/likeController.js
import Video from "../models/Video.js";

// Like Video
export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove user from dislikes if present
    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());

    // Add user to likes if not already liked
    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike Video
export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove user from likes if present
    video.likes = video.likes.filter((id) => id.toString() !== userId.toString());

    // Add user to dislikes if not already disliked
    if (!video.dislikes.includes(userId)) {
      video.dislikes.push(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
