// routes/playlistRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

// Playlist CRUD
router.post("/", protect, createPlaylist);
router.get("/", protect, getUserPlaylists);
router.put("/:playlistId/add/:videoId", protect, addVideoToPlaylist);
router.put("/:playlistId/remove/:videoId", protect, removeVideoFromPlaylist);
router.delete("/:playlistId", protect, deletePlaylist);

export default router;
