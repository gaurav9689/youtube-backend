import Subscription from "../models/Subscription.js";
import Channel from "../models/Channel.js";

export const subscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const exists = await Subscription.findOne({ subscriber: req.user._id, channel: channelId });
    if (exists) return res.status(400).json({ message: "Already subscribed" });

    const subscription = await Subscription.create({ subscriber: req.user._id, channel: channelId });
    await Channel.findByIdAndUpdate(channelId, { $push: { subscribers: req.user._id } });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ subscriber: req.user._id, channel: req.params.channelId });
    await Channel.findByIdAndUpdate(req.params.channelId, { $pull: { subscribers: req.user._id } });
    res.json({ message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
