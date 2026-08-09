import fs from 'fs';
import fetch from 'node-fetch';

async function transformData() {
  console.log('Fetching LeetCode data...');
  const lcRes = await fetch('https://leetcode.com/api/problems/all/');
  const lcData = await lcRes.json();
  
  const lcQuestions = lcData.stat_status_pairs.map((q, index) => ({
    id: `lc-${index}`,
    title: q.stat.question__title,
    platform: 'LeetCode',
    difficulty: q.difficulty.level === 1 ? 'Easy' : q.difficulty.level === 2 ? 'Medium' : 'Hard',
    link: `https://leetcode.com/problems/${q.stat.question__title_slug}/`,
    tags: ['Algorithm']
  }));

  console.log('Fetching GFG data...');
  const gfgRes = await fetch('https://raw.githubusercontent.com/AjinkyaTaranekar/geeksforgeeks.pdf/master/JSON/Competitive-Programming.json');
  const gfgRaw = await gfgRes.json();
  
  const gfgQuestions = Object.entries(gfgRaw).map(([title, link], index) => ({
    id: `gfg-${index}`,
    title: title,
    platform: 'GeeksforGeeks',
    difficulty: 'Medium', // Default for now
    link: link,
    tags: ['Competitive Programming']
  }));

  const allQuestions = [...lcQuestions, ...gfgQuestions];
  fs.writeFileSync('./src/data/questions.json', JSON.stringify(allQuestions, null, 2));
  console.log(`Successfully merged ${allQuestions.length} questions.`);
}

transformData();
