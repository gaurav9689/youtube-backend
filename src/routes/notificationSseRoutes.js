// SSE notification stream route
import express from "express";

const router = express.Router();

let clients = [];

router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

export function sendSseNotification(notification) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  });
}

export default router;
