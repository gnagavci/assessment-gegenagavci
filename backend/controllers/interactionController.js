import Annotation from "../models/Annotation.js";
import Bookmark from "../models/BookMark.js";
import Video from "../models/Video.js";

/**
 * Add annotation
 * POST /api/videos/:id/annotations
 */
export const addAnnotation = async (req, res) => {
    try {
        const { id } = req.params.id;
        const { timestamp, text } = req.body;

        // 0 = falsy, users can't annotate 0:00
        if (timestamp === undefined || !text) {
            return res
                .status(400)
                .json({ message: "Timestamp and text are required" });
        }

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const annotation = await Annotation.create({
            video: id,
            user: req.user._id, //protect
            timestamp: timestamp,
            text: text,
        });

        res.status(201).json(annotation);
    } catch (error) {
        console.error(`Add Annotation error: ${error}`);
        res.status(500).json({ message: "Server error adding annotation" });
    }
};

/**
 * Get video annotations
 * GET /api/videos/:id/annotations
 */
export const getVideoAnnotations = async (req, res) => {
    try {
        const { id } = req.params.id;
        const { user } = req; //protect --> req.user

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        //Admin sees all, users see their own
        let query;
        if (user.role === "admin") {
            query = { video: id };
        } else {
            query = { video: id, user: user._id };
        }

        const annotations = await Annotation.find(query)
            .populate("user", "username")
            .sort({ timestamp: 1 });

        res.json(annotations);
    } catch (error) {
        console.error(`Get Annotations error ${error}`);
        res.status(500).json({ message: "Server error fetching annotations" });
    }
};

/**
 * Add bookmark
 * POST /api/videos/:id/bookmarks
 */
export const addBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const { timestamp, title } = req.body;

        if (timestamp === undefined || !title) {
            return res
                .status(400)
                .json({ message: "Timestamp and title are required" });
        }

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const bookmark = await Bookmark.create({
            video: id,
            user: req.user._id, //protect
            timestamp: timestamp,
            title: title,
        });

        res.status(201).json(bookmark);
    } catch (error) {
        console.error(`Add bookmark error: ${error}`);
        res.status(500).json({ message: "Server error adding bookmark" });
    }
};
/**
 *  Get user bookmarks
 *  GET /api/users/me/bookmarks
 */
export const getUserBookmarks = async (req, res) => {
    try {
        const { user } = req;

        const bookmarks = await Bookmark.find({ user: user._id })
            .populate("video", "title videoUrl publicId") //populate video details
            .sort({ createdAt: -1 });

        res.json(bookmarks);
    } catch (error) {
        console.error(`Get bookmarks error: ${error}`);
        res.status(500).json({ message: "Server error fetching bookamrks" });
    }
};

/**
 *  Get bookmarks for a specific video
 *  GET /api/videos/:id/bookmarks
 */
export const getVideoBookmarks = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        //Admins see all, Users see only their own
        let query;
        if (user.role === "admin") {
            query = { video: id };
        } else {
            query = { video: id, user: user._id };
        }

        const bookmarks = await Bookmark.find(query)
            .populate("user", "username")
            .sort({ timestamp: 1 });

        res.json(bookmarks);
    } catch (error) {
        console.error(`Get Video Bookmarks error: ${error}`);
        res.status(500).json({ message: "Server error fetching bookmarks" });
    }
};
