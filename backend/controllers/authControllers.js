import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username is already registered" });
        }

        // generate password hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user in DB & generate token
        const user = await User.create({
            username: username,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully",
            _id: user._id,
            username: user.username,
            role: user.role,
            token: token,
        });
    } catch (error) {
        console.error(`Registration error ${error}`);
        res.status(500).json({
            message: "Server error during user registration",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "username & password are required" });
        }

        // check if user exists
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // compare input and user passwords match
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({
            message: "Login successful",
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(`Login error: ${error}`);
        res.status(500).json({ message: "Server error during login" });
    }
};
