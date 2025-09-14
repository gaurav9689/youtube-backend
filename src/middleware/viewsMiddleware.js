import Video from "../models/Video";


// Increment view count when a video is retrieved
export const incrementView = async (req, res, next) => {
try {
const videoId = req.params.id || req.query.id;
if (!videoId) return next();


// Increment views atomically to avoid race conditions
await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
console.log(` Incremented view for video ${videoId}`);
} catch (error) {
console.error(" View increment error:", error.message);
// don't block user if analytics fail
}
next();
};