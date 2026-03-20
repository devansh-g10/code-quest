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
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codequest';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

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
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TEMPORARY SEED ROUTE
app.get('/api/seed', async (req, res) => {
  try {
    await Question.deleteMany({});
    const jsonPath = path.join(__dirname, '../src/data/questions.json');
    const existingQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    await Question.insertMany(existingQuestions);
    
    const hrQuestions = [
      { title: "Staircase", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/staircase/problem", tags: ["Basic"], likes: 43210 },
      { title: "Grading Students", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/grading/problem", tags: ["Implementation"], likes: 32100 },
      { title: "Apple and Orange", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/apple-and-orange/problem", tags: ["Implementation"], likes: 29870 },
      { title: "Number Line Jumps", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/kangaroo/problem", tags: ["Implementation"], likes: 27650 },
      { title: "Between Two Sets", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/between-two-sets/problem", tags: ["Implementation"], likes: 25430 },
      { title: "Breaking the Records", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/breaking-best-and-worst-records/problem", tags: ["Implementation"], likes: 24320 },
      { title: "Subarray Division", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/the-birthday-bar/problem", tags: ["Implementation"], likes: 23210 },
      { title: "Divisible Sum Pairs", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/divisible-sum-pairs/problem", tags: ["Implementation"], likes: 22100 }
    ];
    await Question.insertMany(hrQuestions);
    
    res.json({ message: "Cloud DB Seeded Successfully! " + existingQuestions.length });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
