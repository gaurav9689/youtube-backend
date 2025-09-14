
import express from "express";
import multer from "multer";
import {
  uploadVideo,
  getVideos,
  getVideo,
  toggleLike,
  toggleDislike,
  addComment,
  getComments,
  getRecommendedVideos,
  incrementView,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dummy videos for frontend testing

// Dummy videos array for reuse
const dummyVideos = [
  {
    _id: "1",
    title: "Demo Video 1",
    description: "A sample video for testing.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    channelName: "Demo Channel",
    views: 123,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch1", subscribedUsers: [] },
  },
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
  {
    _id: "4",
    title: "City Timelapse",
    description: "A fast-paced look at city life.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
    channelName: "Urban Explorer",
    views: 321,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch3", subscribedUsers: [] },
  },
  {
    _id: "5",
    title: "Cooking 101",
    description: "Learn to cook a simple meal.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg",
    channelName: "Chef's Table",
    views: 654,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch4", subscribedUsers: [] },
  },
  {
    _id: "6",
    title: "Travel Vlog",
    description: "Exploring new places around the world.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    channelName: "Travel Buddy",
    views: 987,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch5", subscribedUsers: [] },
  },
  {
    _id: "7",
    title: "Tech Review",
    description: "Latest gadgets reviewed.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    channelName: "Tech Guru",
    views: 432,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch6", subscribedUsers: [] },
  },
  {
    _id: "8",
    title: "Music Video",
    description: "Official music video release.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg",
    channelName: "Music Channel",
    views: 1200,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch7", subscribedUsers: [] },
  },
  {
    _id: "9",
    title: "Fitness Routine",
    description: "Daily workout for beginners.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/2vjPBrBU-TM/hqdefault.jpg",
    channelName: "Fit Life",
    views: 555,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch8", subscribedUsers: [] },
  },
  {
    _id: "10",
    title: "Science Explained",
    description: "Fun science facts and experiments.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://i.ytimg.com/vi/ZZ5LpwO-An4/hqdefault.jpg",
    channelName: "Science Lab",
    views: 888,
    comments: [],
    likes: [],
    dislikes: [],
    channelId: { _id: "ch9", subscribedUsers: [] },
  },
];

// Serve all dummy videos
router.get("/dummy/all", (req, res) => {
  res.json(dummyVideos);
});

// Get a single video
router.get("/getVideo/:id", getVideo);


// Get recommended videos (related videos)
router.get("/:id/recommendations", getRecommendedVideos);

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload video (protected)
router.post("/", protect, upload.single("video"), uploadVideo);

// Get all videos (public)
router.get("/", getVideos);

// Likes & Dislikes (protected)
router.post("/:id/like", protect, toggleLike);
router.post("/:id/dislike", protect, toggleDislike);

// Comments (protected)
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);

// Increment view (public)
router.put("/:id/view", incrementView);

export default router;
