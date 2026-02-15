import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";

dotenv.config();

// MongoDB connection
connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/videos", videoRoutes);
app.use("/api", interactionRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Video Platform API is running" });
});

//Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
