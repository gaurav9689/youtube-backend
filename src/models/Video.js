import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
