import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    addAnnotation,
    addBookmark,
    getUserBookmarks,
    getVideoAnnotations,
    getVideoBookmarks,
} from "../controllers/interactionController.js";

const router = express.Router();

//Annotations
router.post("/videos/:id/annotations", protect, addAnnotation);
router.get("/videos/:id/annotations", protect, getVideoAnnotations);

//Videos
router.post("/videos/:id/bookmarks", protect, addBookmark);
router.get("/videos/:id/bookmarks", protect, getVideoBookmarks);
router.get("/users/me/bookmarks", protect, getUserBookmarks);

export default router;
