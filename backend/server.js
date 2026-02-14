import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// MongoDB connection
connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Video Platform API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
