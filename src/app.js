import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import notificationSseRoutes from "./routes/notificationSseRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userVideoRoutes from "./routes/userVideoRoutes.js";
import watchLaterRoutes from "./routes/watchLaterRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();


// Security middleware
app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === process.env.CORS_ORIGIN ||
      origin === "http://localhost:5175"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ... rest of app.js unchanged

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Ensure preflight requests are handled automatically
// (No manual app.options needed; CORS middleware handles preflight)

// Rate limiter
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user",userVideoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notifications", notificationSseRoutes); // /api/notifications/stream
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/watchlater",watchLaterRoutes);
app.use("/api/history",historyRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
