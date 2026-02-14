import Video from "../models/Video.js";

/**
 *
 * Upload a new video
 * POST /api/videos
 */
export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        //req.file.path = Cloudinary URL
        //req.file.filename = Cloudinary Public ID
        const video = await Video.create({
            title: title,
            videoUrl: req.file.path,
            publicId: req.file.filename,
            uploader: req.user._id,
        });

        res.status(201).json(video);
    } catch (error) {
        console.error(`Video upload error: ${error}`);
        res.status(500).json({ message: "Server error during video upload" });
    }
};

/**
 *
 * Get all videos
 * GET /api/videos
 */
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("uploader", "username")
            .sort({ createdAt: -1 });

        res.json(videos);
    } catch (error) {
        console.error(`Get videos error ${error}`);
        res.status(500).json({ message: "Server error fetching videos" });
    }
};
