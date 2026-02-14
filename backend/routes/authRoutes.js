import express from "express";
import { login, register } from "../controllers/authControllers.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

//POST /api/auth/register
router.post("/login", login);

export default router;
