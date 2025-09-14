import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Connect DB
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
