// controllers/playlistController.js
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";

// Create Playlist
export const createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;

    const playlist = new Playlist({
      title,
      description,
      owner: req.user._id,
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Playlists
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate("videos");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Video to Playlist
export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
    }

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Video from Playlist
export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    await Playlist.findByIdAndDelete(playlistId);
    res.json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
