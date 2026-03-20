import fs from 'fs';
import path from 'path';

const RAW_LC_PATH = './src/data/leetcode_raw.json';
const RAW_GFG_PATH = './src/data/gfg.json';
const OUTPUT_PATH = './src/data/questions.json';

function getGfgTags(title) {
  const tags = [];
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('array')) tags.push('Array');
  if (lowercaseTitle.includes('string')) tags.push('String');
  if (lowercaseTitle.includes('dynamic programming') || lowercaseTitle.includes(' dp ')) tags.push('Dynamic Programming');
  if (lowercaseTitle.includes('graph')) tags.push('Graph');
  if (lowercaseTitle.includes('tree')) tags.push('Tree');
  if (lowercaseTitle.includes('linked list')) tags.push('Linked List');
  if (lowercaseTitle.includes('sort')) tags.push('Sorting');
  if (lowercaseTitle.includes('search')) tags.push('Searching');
  if (lowercaseTitle.includes('matrix')) tags.push('Matrix');
  if (lowercaseTitle.includes('bit')) tags.push('Bit Manipulation');
  if (lowercaseTitle.includes('math') || lowercaseTitle.includes('prime') || lowercaseTitle.includes('fibonacci')) tags.push('Math');
  
  if (tags.length === 0) tags.push('Competitive Programming');
  return tags;
}

try {
  console.log('Processing LeetCode data...');
  const lcRaw = JSON.parse(fs.readFileSync(RAW_LC_PATH, 'utf8'));
  const processedLC = lcRaw.map((item, index) => {
    const q = item.data.question;
    return {
      id: `lc-${q.questionFrontendId || index}`,
      title: q.title,
      platform: 'LeetCode',
      difficulty: q.difficulty,
      link: q.url || `https://leetcode.com/problems/${q.titleSlug}/`,
      tags: q.topicTags ? q.topicTags.map(t => t.name) : ['Algorithm'],
      isPremium: q.isPaidOnly || false,
      likes: q.likes || 0
    };
  });

  console.log('Processing GFG data...');
  const gfgRaw = JSON.parse(fs.readFileSync(RAW_GFG_PATH, 'utf8'));
  const processedGFG = Object.entries(gfgRaw).map(([title, link], index) => {
    return {
      id: `gfg-${index}`,
      title,
      platform: 'GeeksforGeeks',
      difficulty: 'Medium', 
      link,
      tags: getGfgTags(title),
      isPremium: false,
      likes: 100 // Default for GFG
    };
  });

  const allQuestions = [...processedLC, ...processedGFG];
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allQuestions, null, 2));
  console.log(`Merged ${allQuestions.length} questions into ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Error processing data:', error);
}
