import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import bcrypt from 'bcryptjs'; // <-- IMPORT BCRYPT
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword; // Hashing is handled by the pre-save hook in the model
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid old password' });
  }
});
export default router;
