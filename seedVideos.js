// Run this script with: node seedVideos.js
import mongoose from "mongoose";
import Video from "./src/models/Video.js";
import Channel from "./src/models/Channel.js";
import User from "./src/models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/youtube-clone";
const url = "http://localhost:3001/api/videos";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Create a dummy user and channel
  let user = await User.findOne();
  if (!user) {
    user = await User.create({
      username: "demoUser",
      email: "demo@example.com",
      password: "password123",
    });
  }
  let channel = await Channel.findOne();
  if (!channel) {
    channel = await Channel.create({
      name: "Demo Channel",
      user: user._id,
      description: "A demo channel for testing.",
      subscribers: [],
    });
  }

  // Dummy videos
  const videos = [
    {
      _id: "1",
      title: "Sample Video 1",
      description: "This is a sample video.",
      user: user._id,
      channelId: channel._id,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
      tags: ["sample", "test", "demo"],
      views: 100,
    },
    {
      _id: "2",
      title: "Sample Video 2",
      description: "Another sample video.",
      user: user._id,
      channelId: channel._id,
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
      tags: ["sample", "video"],
      views: 50,
    },
    {
      _id: "3",
      title: "Nature Walk",
      description: "Relaxing walk in the forest.",
      user: user._id,
      channelId: channel._id,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
      tags: ["nature", "relaxing"],
      views: 200,
    },
    {
      _id: "4",
      title: "City Timelapse",
      description: "A fast-paced look at city life.",
      user: user._id,
      channelId: channel._id,
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
      tags: ["city", "timelapse"],
      views: 150,
    },
    {
      _id: "5",
      title: "Cooking 101",
      description: "Learn to cook a simple meal.",
      user: user._id,
      channelId: channel._id,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg",
      tags: ["cooking", "tutorial"],
      views: 300,
    },
  ];

  await Video.deleteMany({});
  await Video.insertMany(videos);

  console.log("Dummy videos seeded!");
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
