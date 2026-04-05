// Relay server: serves patch data for each embed via HTTP
// Claude will call Wix API for each one
const http = require('http');
const fs = require('fs');
const path = require('path');

const patchDir = path.join(__dirname, '_patches');
const files = fs.readdirSync(patchDir).filter(f => f.endsWith('.json')).sort();

console.log(`Serving ${files.length} patch files:`);
files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(patchDir, f), 'utf8'));
  console.log(`  ${f}: ${data.size} chars → embed ${data.embedId}`);
});

// Serve each file on a unique path
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const name = req.url.replace('/', '').replace('.json', '');
  const filePath = path.join(patchDir, name + '.json');

  if (req.url === '/list') {
    res.end(JSON.stringify(files.map(f => {
      const d = JSON.parse(fs.readFileSync(path.join(patchDir, f), 'utf8'));
      return { file: f, embedId: d.embedId, size: d.size };
    })));
    return;
  }

  if (fs.existsSync(filePath)) {
    res.end(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found', path: req.url }));
  }
});

server.listen(3998, () => console.log('Patch relay on :3998'));
