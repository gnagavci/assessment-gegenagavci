import express from "express";
import { uploadVideo, getAllVideos } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

// GET /api/videos - Get all videos
router.get("/", protect, getAllVideos);

// POST /api/videos - Upload a video
router.post("/", protect, upload.single("video"), uploadVideo);

export default router;
