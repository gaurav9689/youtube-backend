// Get a single video
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('user', 'username').populate('channelId', 'name subscribers');
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Format to match frontend expectations
    const formattedVideo = {
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      channelName: video.channelId ? video.channelId.name : video.user.username,
      views: video.views,
      comments: video.comments,
      likes: video.likes,
      dislikes: video.dislikes,
      channelId: video.channelId ? { _id: video.channelId._id, subscribedUsers: video.channelId.subscribers } : { _id: "ch1", subscribedUsers: [] },
    };
    res.json({ video: formattedVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Increment view count
export const incrementView = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json({ video: { views: video.views + 1 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get recommended videos (related videos)
export const getRecommendedVideos = async (req, res) => {
  try {
    // For now, return dummy videos since DB may not be seeded
    const dummyVideos = [
      {
        _id: "2",
        title: "Demo Video 2",
        description: "Another sample video.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnailUrl: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
        channelName: "Demo Channel",
        views: 456,
        comments: [],
        likes: [],
        dislikes: [],
        channelId: { _id: "ch1", subscribedUsers: [] },
      },
      {
        _id: "3",
        title: "Nature Walk",
        description: "Relaxing walk in the forest.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
        channelName: "Nature Channel",
        views: 789,
        comments: [],
        likes: [],
        dislikes: [],
        channelId: { _id: "ch2", subscribedUsers: [] },
      },
    ];
    res.json(dummyVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// src/controllers/videoController.js
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

//  Upload a video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

    const newVideo = await Video.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
      videoUrl: req.file.path, // assuming file saved locally
      tags: req.body.tags ? req.body.tags.split(",") : [],
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("user", "username");
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Like / Unlike video
export const toggleLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id;

    if (video.likes.includes(userId)) {
      video.likes.pull(userId); // unlike
    } else {
      video.likes.push(userId); // like
      video.dislikes.pull(userId); // remove dislike if any
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Dislike / Undislike video
export const toggleDislike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id;

    if (video.dislikes.includes(userId)) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Add a comment
export const addComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    video.comments.push(comment);
    await video.save();

    res.status(201).json(video.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Get all comments
export const getComments = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("comments.user", "username");
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json(video.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


