import express from "express";
import { trending, recommend } from "../controllers/searchController.js";

const router = express.Router();

router.get("/trending", trending);
router.get("/:id/recommend", recommend);

export default router;
