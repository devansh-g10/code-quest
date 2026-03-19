import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codequest';

const seedHackerRankQuestions = [
  { title: "Staircase", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/staircase/problem", tags: ["Basic"], likes: 43210 },
  { title: "Grading Students", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/grading/problem", tags: ["Implementation"], likes: 32100 },
  { title: "Apple and Orange", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/apple-and-orange/problem", tags: ["Implementation"], likes: 29870 },
  { title: "Number Line Jumps", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/kangaroo/problem", tags: ["Implementation"], likes: 27650 },
  { title: "Between Two Sets", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/between-two-sets/problem", tags: ["Implementation"], likes: 25430 },
  { title: "Breaking the Records", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/breaking-best-and-worst-records/problem", tags: ["Implementation"], likes: 24320 },
  { title: "Subarray Division", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/the-birthday-bar/problem", tags: ["Implementation"], likes: 23210 },
  { title: "Divisible Sum Pairs", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/divisible-sum-pairs/problem", tags: ["Implementation"], likes: 22100 },
  { title: "Migratory Birds", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/migratory-birds/problem", tags: ["Implementation"], likes: 21000 },
  { title: "Day of the Programmer", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/day-of-the-programmer/problem", tags: ["Implementation"], likes: 19870 },
  { title: "Bill Division", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/bon-appetit/problem", tags: ["Implementation"], likes: 18760 },
  { title: "Sales by Match", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/sock-merchant/problem", tags: ["Implementation"], likes: 17650 },
  { title: "Drawing Book", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/drawing-book/problem", tags: ["Implementation"], likes: 16540 },
  { title: "Counting Valleys", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/counting-valleys/problem", tags: ["Implementation"], likes: 15430 },
  { title: "Electronics Shop", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/electronics-shop/problem", tags: ["Implementation"], likes: 14320 },
  { title: "Cats and a Mouse", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/cats-and-a-mouse/problem", tags: ["Implementation"], likes: 13210 },
  { title: "Picking Numbers", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/picking-numbers/problem", tags: ["Implementation"], likes: 12100 },
  { title: "Climbing the Leaderboard", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/climbing-the-leaderboard/problem", tags: ["Implementation"], likes: 54321 },
  { title: "The Hurdle Race", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/the-hurdle-race/problem", tags: ["Implementation"], likes: 11000 },
  { title: "Designer PDF Viewer", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/designer-pdf-viewer/problem", tags: ["Implementation"], likes: 10870 },
  { title: "Utopian Tree", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/utopian-tree/problem", tags: ["Implementation"], likes: 9876 },
  { title: "Angry Professor", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/angry-professor/problem", tags: ["Implementation"], likes: 8765 },
  { title: "Beautiful Days at the Movies", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/beautiful-days-at-the-movies/problem", tags: ["Implementation"], likes: 7654 },
  { title: "Viral Advertising", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/strange-advertising/problem", tags: ["Implementation"], likes: 6543 },
  { title: "Save the Prisoner!", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/save-the-prisoner/problem", tags: ["Implementation"], likes: 5432 },
  { title: "Circular Array Rotation", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/circular-array-rotation/problem", tags: ["Implementation"], likes: 4321 },
  { title: "Jumping on the Clouds: Revisited", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/jumping-on-the-clouds-revisited/problem", tags: ["Implementation"], likes: 3210 },
  { title: "Find Digits", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/find-digits/problem", tags: ["Implementation"], likes: 2100 },
  { title: "Extra Long Factorials", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/extra-long-factorials/problem", tags: ["Math"], likes: 15432 },
  { title: "Append and Delete", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/append-and-delete/problem", tags: ["Strings"], likes: 1234 },
  { title: "Sherlock and Squares", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/sherlock-and-squares/problem", tags: ["Math"], likes: 5678 },
  { title: "Library Fine", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/library-fine/problem", tags: ["Implementation"], likes: 9012 },
  { title: "Cut the sticks", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/cut-the-sticks/problem", tags: ["Implementation"], likes: 3456 },
  { title: "Non-Divisible Subset", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/non-divisible-subset/problem", tags: ["Implementation"], likes: 7890 },
  { title: "Repeated String", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/repeated-string/problem", tags: ["Strings"], likes: 12345 },
  { title: "Jumping on the Clouds", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/jumping-on-the-clouds/problem", tags: ["Implementation"], likes: 6789 },
  { title: "Equalize the Array", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/equality-in-a-array/problem", tags: ["Implementation"], likes: 23456 },
  { title: "Queen's Attack II", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/queens-attack-2/problem", tags: ["Implementation"], likes: 34567 }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Load from questions.json
    const jsonPath = path.join(__dirname, '../src/data/questions.json');
    const existingQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Insert existing
    await Question.insertMany(existingQuestions.map(q => ({
      title: q.title,
      platform: q.platform,
      difficulty: q.difficulty,
      link: q.link,
      tags: q.tags,
      isPremium: q.isPremium,
      likes: q.likes
    })));
    console.log(`✅ Seeded ${existingQuestions.length} questions from questions.json`);

    // Insert expanded HackerRank list
    await Question.insertMany(seedHackerRankQuestions);
    console.log(`✅ Seeded ${seedHackerRankQuestions.length} NEW HackerRank questions`);

    console.log('🚀 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
