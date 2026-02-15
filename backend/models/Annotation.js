import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema(
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
        text: {
            type: String,
            required: [true, "Text is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Annotation", annotationSchema);
