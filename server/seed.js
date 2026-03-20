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
  { title: "Staircase", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/staircase/problem", tags: ["Basic", "Logic"], likes: 43210 },
  { title: "Grading Students", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/grading/problem", tags: ["Implementation"], likes: 32100 },
  { title: "Apple and Orange", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/apple-and-orange/problem", tags: ["Implementation"], likes: 29870 },
  { title: "Number Line Jumps", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/kangaroo/problem", tags: ["Implementation"], likes: 27650 },
  { title: "Between Two Sets", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/between-two-sets/problem", tags: ["Implementation"], likes: 25430 },
  { title: "Breaking the Records", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/breaking-best-and-worst-records/problem", tags: ["Implementation"], likes: 24320 },
  { title: "Subarray Division", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/the-birthday-bar/problem", tags: ["Implementation", "Arrays"], likes: 23210 },
  { title: "Divisible Sum Pairs", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/divisible-sum-pairs/problem", tags: ["Implementation", "Arrays"], likes: 22100 },
  { title: "Migratory Birds", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/migratory-birds/problem", tags: ["Implementation", "Hash Map"], likes: 21000 },
  { title: "Day of the Programmer", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/day-of-the-programmer/problem", tags: ["Implementation"], likes: 19870 },
  { title: "Bill Division", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/bon-appetit/problem", tags: ["Implementation"], likes: 18760 },
  { title: "Sales by Match", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/sock-merchant/problem", tags: ["Implementation", "Hash Map"], likes: 17650 },
  { title: "Drawing Book", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/drawing-book/problem", tags: ["Implementation"], likes: 16540 },
  { title: "Counting Valleys", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/counting-valleys/problem", tags: ["Implementation"], likes: 15430 },
  { title: "Electronics Shop", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/electronics-shop/problem", tags: ["Implementation"], likes: 14320 },
  { title: "Cats and a Mouse", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/cats-and-a-mouse/problem", tags: ["Implementation"], likes: 13210 },
  { title: "Picking Numbers", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/picking-numbers/problem", tags: ["Implementation", "Arrays"], likes: 12100 },
  { title: "Climbing the Leaderboard", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/climbing-the-leaderboard/problem", tags: ["Implementation", "Binary Search"], likes: 54321 },
  { title: "The Hurdle Race", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/the-hurdle-race/problem", tags: ["Implementation"], likes: 11000 },
  { title: "New Year Chaos", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/new-year-chaos/problem", tags: ["Arrays", "Logic"], likes: 32000 },
  { title: "2D Array - DS", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/2d-array/problem", tags: ["Arrays"], likes: 25000 },
  { title: "Left Rotation", platform: "HackerRank", difficulty: "Easy", link: "https://www.hackerrank.com/challenges/array-left-rotation/problem", tags: ["Arrays"], likes: 19500 },
  { title: "Sparse Arrays", platform: "HackerRank", difficulty: "Medium", link: "https://www.hackerrank.com/challenges/sparse-arrays/problem", tags: ["Arrays", "Data Structures"], likes: 18000 },
  { title: "Array Manipulation", platform: "HackerRank", difficulty: "Hard", link: "https://www.hackerrank.com/challenges/crush/problem", tags: ["Arrays", "Prefix Sum"], likes: 30000 },
];

const seedCodeChefQuestions = [
  { title: "Chef and SnackDown", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/SNCKYEAR", tags: ["Basic Programming"], likes: 12050 },
  { title: "ATM", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/HS08TEST", tags: ["Math", "Basic"], likes: 85000 },
  { title: "Enormous Input Test", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/INTEST", tags: ["Implementation"], likes: 62000 },
  { title: "Add Two Numbers", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FLOW001", tags: ["Basic Programming"], likes: 98000 },
  { title: "First and Last Digit", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FLOW004", tags: ["Math"], likes: 45000 },
  { title: "Sum of Digits", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FLOW006", tags: ["Math"], likes: 48000 },
  { title: "Reverse The Number", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FLOW007", tags: ["Math"], likes: 43000 },
  { title: "Find Remainder", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FLOW002", tags: ["Math"], likes: 42000 },
  { title: "Lucky Four", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/LUCKFOUR", tags: ["Math", "Implementation"], likes: 38000 },
  { title: "Turbo Sort", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/TSORT", tags: ["Sorting"], likes: 35000 },
  { title: "Small factorials", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FCTRL2", tags: ["Math", "BigInt"], likes: 34000 },
  { title: "Racing Horses", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/HORSES", tags: ["Sorting", "Greedy"], likes: 32000 },
  { title: "Coin Flip", platform: "CodeChef", difficulty: "Medium", link: "https://www.codechef.com/problems/CONFLIP", tags: ["Logic", "Math"], likes: 25000 },
  { title: "Uncle Johny", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/JOHNY", tags: ["Sorting", "Search"], likes: 21000 },
  { title: "Cleaning Up", platform: "CodeChef", difficulty: "Medium", link: "https://www.codechef.com/problems/CLEANUP", tags: ["Greedy"], likes: 18000 },
  { title: "Paying up", platform: "CodeChef", difficulty: "Medium", link: "https://www.codechef.com/problems/MARCHA1", tags: ["Backtracking", "Bitmasking"], likes: 15000 },
  { title: "Factorial", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/FCTRL", tags: ["Math"], likes: 29000 },
  { title: "Chef and Remissness", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/REMISS", tags: ["Math", "Logic"], likes: 23000 },
  { title: "Packaging Cupcakes", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/MUFFINS3", tags: ["Math"], likes: 27000 },
  { title: "The Lead Game", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/TLG", tags: ["Implementation", "Arrays"], likes: 24000 },
  { title: "Lapindromes", platform: "CodeChef", difficulty: "Medium", link: "https://www.codechef.com/problems/LAPIN", tags: ["Strings", "Hash Map"], likes: 19000 },
  { title: "Life, the Universe, and Everything", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/TEST", tags: ["Basic Programming"], likes: 45000 },
  { title: "Chef and Operators", platform: "CodeChef", difficulty: "Easy", link: "https://www.codechef.com/problems/CHOPRT", tags: ["Logic"], likes: 18000 },
];

const seedGFGQuestions = [
  { title: "Subarray with given sum", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1", tags: ["Arrays", "Sliding Window"], likes: 58000 },
  { title: "Missing number in array", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1", tags: ["Arrays", "Math"], likes: 62000 },
  { title: "Kadane's Algorithm", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1", tags: ["Arrays", "Dynamic Programming"], likes: 71000 },
  { title: "Minimum number of jumps", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1", tags: ["Dynamic Programming", "Greedy"], likes: 45000 },
  { title: "Sort an array of 0s, 1s and 2s", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1", tags: ["Arrays", "Sorting"], likes: 54000 },
  { title: "Equilibrium Point", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/equilibrium-point-1587115620/1", tags: ["Arrays", "Prefix Sum"], likes: 41000 },
  { title: "Leaders in an array", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1", tags: ["Arrays"], likes: 38000 },
  { title: "Kth smallest element", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/kth-smallest-element5635/1", tags: ["Arrays", "Sorting", "Heap"], likes: 35000 },
  { title: "Majority Element", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/majority-element-1587115620/1", tags: ["Arrays", "Logic"], likes: 32000 },
  { title: "Parenthesis Checker", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/parenthesis-checker2744/1", tags: ["Strings", "Stacks"], likes: 48000 },
  { title: "Reverse words in a given string", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/reverse-words-in-a-given-string5459/1", tags: ["Strings"], likes: 36000 },
  { title: "Check for BST", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/check-for-bst/1", tags: ["Trees", "BST"], likes: 29000 },
  { title: "Find duplicates in an array", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/find-duplicates-in-an-array/1", tags: ["Arrays", "Hash Map"], likes: 34000 },
  { title: "Detect Loop in linked list", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1", tags: ["Linked List", "Floyd's Algorithm"], likes: 42000 },
  { title: "Left View of Binary Tree", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1", tags: ["Trees", "BFS"], likes: 31000 },
  { title: "Trapping Rain Water", platform: "GFG", difficulty: "Hard", link: "https://practice.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1", tags: ["Arrays", "Two Pointers"], likes: 53000 },
  { title: "Binary Search", platform: "GFG", difficulty: "Basic", link: "https://practice.geeksforgeeks.org/problems/binary-search-1587115620/1", tags: ["Arrays", "Binary Search"], likes: 31000 },
  { title: "Finding middle element in a linked list", platform: "GFG", difficulty: "Easy", link: "https://practice.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1", tags: ["Linked List", "Two Pointers"], likes: 37000 },
  { title: "0 - 1 Knapsack Problem", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", tags: ["Dynamic Programming"], likes: 49000 },
  { title: "Longest Common Subsequence", platform: "GFG", difficulty: "Medium", link: "https://practice.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1", tags: ["Dynamic Programming"], likes: 46000 },
  { title: "N-Queen Problem", platform: "GFG", difficulty: "Hard", link: "https://practice.geeksforgeeks.org/problems/n-queen-problem0315/1", tags: ["Backtracking", "Recursion"], likes: 28000 },
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
    let existingQuestions = [];
    if (fs.existsSync(jsonPath)) {
        existingQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
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
    }

    // Insert expanded HackerRank list
    await Question.insertMany(seedHackerRankQuestions);
    console.log(`✅ Seeded ${seedHackerRankQuestions.length} HackerRank questions`);
    
    // Insert expanded CodeChef list
    await Question.insertMany(seedCodeChefQuestions);
    console.log(`✅ Seeded ${seedCodeChefQuestions.length} CodeChef questions`);
    
    // Insert expanded GFG list
    await Question.insertMany(seedGFGQuestions);
    console.log(`✅ Seeded ${seedGFGQuestions.length} GFG questions`);

    console.log('🚀 Seeding complete! Database is now huge!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
