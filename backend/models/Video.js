import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        videoUrl: {
            type: String,
            required: [true, "Video URL is required"],
        },
        publicId: {
            type: String,
            required: [true, "Cloudinary Public ID is required"],
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Video", videoSchema);
