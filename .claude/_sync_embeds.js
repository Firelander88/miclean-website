const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('public/index.html', 'utf8');

// Extract sections
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1].trim() : '';

const bodyStart = html.indexOf('</head>');
const bodyContent = html.substring(html.indexOf('<body>') + 6);
const scriptStart = bodyContent.indexOf('<script>');
const htmlBody = bodyContent.substring(0, scriptStart).trim();
const jsContent = bodyContent.substring(scriptStart + 8, bodyContent.lastIndexOf('</script>')).trim();

// JS Adaptations for Wix (no local API)
let jsFixed = jsContent
  .replace(/fetch\(['"]\/api\/products['"]\)/g, "Promise.resolve(window._mcD || [])")
  .replace(/fetch\(['"]\/api\/contact['"]/g, "Promise.resolve({ok:true})")
  .replace(/fetch\(['"]\/api\/quotes['"]/g, "Promise.resolve({ok:true})");

const LIMIT = 14950;

// Smart chunking at boundaries
function chunkCSS(css) {
  const chunks = [];
  let remaining = css;
  while (remaining.length > LIMIT) {
    let cutAt = remaining.lastIndexOf('}', LIMIT);
    if (cutAt < LIMIT * 0.5) cutAt = LIMIT;
    chunks.push(remaining.substring(0, cutAt + 1));
    remaining = remaining.substring(cutAt + 1);
  }
  if (remaining.trim()) chunks.push(remaining.trim());
  return chunks;
}

function chunkHTML(html) {
  const chunks = [];
  let remaining = html;
  while (remaining.length > LIMIT) {
    let cutAt = remaining.lastIndexOf('</section>', LIMIT);
    if (cutAt < 0 || cutAt < LIMIT * 0.3) cutAt = remaining.lastIndexOf('</div>', LIMIT);
    if (cutAt < 0 || cutAt < LIMIT * 0.3) cutAt = LIMIT;
    else cutAt += '</section>'.length;
    chunks.push(remaining.substring(0, cutAt));
    remaining = remaining.substring(cutAt);
  }
  if (remaining.trim()) chunks.push(remaining.trim());
  return chunks;
}

function chunkJS(js) {
  const chunks = [];
  let remaining = js;
  while (remaining.length > LIMIT) {
    // Find safe cut points: end of IIFE })(); or end of top-level statement ;\n\n
    let cutAt = -1;
    // Try IIFE boundary first: })();
    let iife = remaining.lastIndexOf('})();', LIMIT);
    if (iife > LIMIT * 0.3) cutAt = iife + 5;
    // Try double newline after semicolon: ;\n\n
    if (cutAt < 0) {
      let semi = remaining.lastIndexOf(';\n\n', LIMIT);
      if (semi > LIMIT * 0.3) cutAt = semi + 1;
    }
    // Try closing brace + newline at start of line: \n}\n
    if (cutAt < 0) {
      let brace = remaining.lastIndexOf('\n}\n', LIMIT);
      if (brace > LIMIT * 0.3) cutAt = brace + 2;
    }
    // Fallback: semicolon + newline
    if (cutAt < 0) {
      let semi2 = remaining.lastIndexOf(';\n', LIMIT);
      if (semi2 > LIMIT * 0.3) cutAt = semi2 + 2;
    }
    if (cutAt < 0) cutAt = LIMIT;
    chunks.push(remaining.substring(0, cutAt));
    remaining = remaining.substring(cutAt);
  }
  if (remaining.trim()) chunks.push(remaining.trim());
  return chunks;
}

const cssChunks = chunkCSS(css);
const htmlChunks = chunkHTML(htmlBody);
const jsChunks = chunkJS(jsFixed);

// Embed ID map
const embedMap = {
  CSS: [
    { id: '1231a748-730b-413c-be44-3aa3fce3d889', name: 'CSS_1' },
    { id: 'c8b4d340-f3b3-4876-994c-5baf223c2835', name: 'CSS_2' },
    { id: '4ea53180-a62a-4225-8c46-f8522cfeb8a6', name: 'CSS_3' },
  ],
  HTML: [
    { id: 'bdd3e230-9ad8-4b1b-8295-a23390b75b56', name: 'HTML_1' },
    { id: '11f6a791-6af7-4767-ac65-a0cb0190186b', name: 'HTML_2' },
    { id: 'db40711c-c28e-4dfd-980d-6119c4910de6', name: 'HTML_3' },
    { id: '4e450914-44ab-40b6-a91a-22ac8cbf4bad', name: 'HTML_4' },
    { id: '9f6a2524-74d4-4b68-b3a2-e148c9638c1d', name: 'HTML_5' },
    { id: 'd7d7fc1e-363f-4ed0-834d-c494e28b1f30', name: 'HTML_6' },
  ],
  JS: [
    { id: '090b97bc-4422-44a8-9ebb-3cf6f8a71622', name: 'JS_1' },
    { id: '95b059e5-3698-4ad1-be6d-2a5df331296b', name: 'JS_2' },
    { id: '9ac1f9e9-4b4b-4ced-826e-b575663bdd1a', name: 'JS_3' },
  ],
};

console.log(`CSS: ${css.length} chars → ${cssChunks.length} chunks`);
console.log(`HTML: ${htmlBody.length} chars → ${htmlChunks.length} chunks`);
console.log(`JS: ${jsFixed.length} chars → ${jsChunks.length} chunks`);

// Prepare patch data
const outDir = path.join(__dirname, '_patches');
try { fs.mkdirSync(outDir, { recursive: true }); } catch {}

// CSS chunks → wrap in <style>
cssChunks.forEach((chunk, i) => {
  if (i >= embedMap.CSS.length) return;
  const embed = embedMap.CSS[i];
  const wrapped = i === 0
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"><style>${chunk}</style>`
    : `<style>${chunk}</style>`;
  fs.writeFileSync(path.join(outDir, `${embed.name}.json`), JSON.stringify({
    embedId: embed.id,
    html: wrapped,
    size: wrapped.length
  }));
  console.log(`  ${embed.name}: ${wrapped.length} chars`);
});

// HTML chunks
htmlChunks.forEach((chunk, i) => {
  if (i >= embedMap.HTML.length) return;
  const embed = embedMap.HTML[i];
  fs.writeFileSync(path.join(outDir, `${embed.name}.json`), JSON.stringify({
    embedId: embed.id,
    html: chunk,
    size: chunk.length
  }));
  console.log(`  ${embed.name}: ${chunk.length} chars`);
});

// JS chunks → wrap in <script>
jsChunks.forEach((chunk, i) => {
  if (i >= embedMap.JS.length) return;
  const embed = embedMap.JS[i];
  const wrapped = `<script>${chunk}</script>`;
  fs.writeFileSync(path.join(outDir, `${embed.name}.json`), JSON.stringify({
    embedId: embed.id,
    html: wrapped,
    size: wrapped.length
  }));
  console.log(`  ${embed.name}: ${wrapped.length} chars`);
});

// Summary
const total = cssChunks.length + htmlChunks.length + jsChunks.length;
console.log(`\nTotal: ${total} chunks ready in ${outDir}`);
console.log('Max embed slots: CSS=3, HTML=6, JS=3');
if (cssChunks.length > 3) console.log('WARNING: CSS needs more than 3 embeds!');
if (htmlChunks.length > 6) console.log('WARNING: HTML needs more than 6 embeds!');
if (jsChunks.length > 3) console.log('WARNING: JS needs more than 3 embeds!');
