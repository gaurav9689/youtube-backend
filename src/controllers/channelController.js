// controllers/channelController.js
import Channel from "../models/Channel.js";

// Create a channel
export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const channel = await Channel.create({
      name,
      description,
      owner: req.user._id,
    });
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscribe to a channel
export const subscribeChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (!channel.subscribers.includes(req.user._id)) {
      channel.subscribers.push(req.user._id);
      await channel.save();
    }

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
