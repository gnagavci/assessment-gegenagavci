import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
    {
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        timestamp: {
            type: Number,
            required: [true, "Timestamp is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Bookmark", bookmarkSchema);
