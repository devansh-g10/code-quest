import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Question from './models/Question.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codequest';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- AUTH MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// --- ROUTES ---

// 0. Get Questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// 1. Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=3b82f6&color=fff`
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful. You can now login.', email });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// 2. Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        github: user.github,
        leetcode: user.leetcode,
        linkedin: user.linkedin,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 3. Update Profile
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar, github, leetcode, linkedin } = req.body;
    const user = await User.findById(req.userData.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (github !== undefined) user.github = github;
    if (leetcode !== undefined) user.leetcode = leetcode;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        github: user.github,
        leetcode: user.leetcode,
        linkedin: user.linkedin,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { exec } from 'child_process';

// TEMPORARY SEED ROUTE
app.get('/api/seed', (req, res) => {
  const seedScriptPath = path.join(__dirname, 'seed.js');
  
  exec(`node ${seedScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing seed script: ${error}`);
      return res.status(500).json({ error: 'Seed failed', details: error.message });
    }
    console.log(`Seed stdout: ${stdout}`);
    if (stderr) console.error(`Seed stderr: ${stderr}`);
    
    res.json({ message: "Cloud DB Seeded Successfully with all platforms!" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
