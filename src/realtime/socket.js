// This file sets up socket.io for real-time notifications
import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Example: send a welcome notification
    socket.emit("notification", {
      text: "Welcome! You are connected to real-time notifications.",
      time: new Date().toLocaleTimeString(),
      read: false,
    });

    // Listen for custom events if needed
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export function sendNotificationToAll(notification) {
  if (io) {
    io.emit("notification", notification);
  }
}
