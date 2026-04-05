const fs = require('fs');
const path = require('path');
const http = require('http');

const patchDir = 'C:/Users/Farzali Valiyev/Desktop/miclean-website/.claude/_patches';
const files = fs.readdirSync(patchDir).filter(f => f.endsWith('.json')).sort();

// Output each embed's data as a line: embedId|size
files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(patchDir, f), 'utf8'));
  console.log(`${f.replace('.json','')}|${data.embedId}|${data.size}`);
});
