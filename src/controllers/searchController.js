// controllers/videoController.js
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

//Search videos + channels
export const search = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;

    const regex = query
      ? new RegExp(query, "i") // case-insensitive search
      : null;

    // Pagination
    const skip = (page - 1) * limit;

    // Search videos
    const videos = await Video.find(
      regex
        ? {
            $or: [
              { title: regex },
              { description: regex },
              { tags: regex },
            ],
          }
        : {}
    )
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "username");

    // Search channels
    const channels = await Channel.find(regex ? { name: regex } : {})
      .limit(20)
      .select("name subscribers");

    // Count total videos
    const totalVideos = await Video.countDocuments(
      regex
        ? {
            $or: [
              { title: regex },
              { description: regex },
              { tags: regex },
            ],
          }
        : {}
    );

    res.json({
      videos,
      channels,
      page: Number(page),
      totalPages: Math.ceil(totalVideos / limit),
    });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Trending videos (views within last X days)
export const trending = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7; // default last 7 days
    const limit = Number(req.query.limit) || 20;

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Find videos created in timeframe and sort by views desc
    const videos = await Video.find({ createdAt: { $gte: since } })
      .sort({ views: -1 })
      .limit(limit)
      .populate("user", "username");

    res.json({ videos });
  } catch (error) {
    console.error("Trending error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Recommendations based on overlapping tags
export const recommend = async (req, res) => {
  try {
    const videoId = req.params.id;
    const limit = Number(req.query.limit) || 10;

    const video = await Video.findById(videoId).lean();
    if (!video) return res.status(404).json({ message: "Video not found" });

    // If no tags, fall back to most viewed videos
    if (!video.tags || video.tags.length === 0) {
      const fallback = await Video.find({ _id: { $ne: video._id } })
        .sort({ views: -1 })
        .limit(limit)
        .lean();
      return res.json({ recommendations: fallback });
    }

    // Use aggregation to compute tag overlap score
    const recommendations = await Video.aggregate([
      { $match: { _id: { $ne: video._id }, tags: { $in: video.tags } } },
      {
        $addFields: {
          commonTags: { $size: { $setIntersection: ["$tags", video.tags] } },
        },
      },
      { $sort: { commonTags: -1, views: -1 } },
      { $limit: limit },
    ]);

    res.json({ recommendations });
  } catch (error) {
    console.error("Recommend error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
