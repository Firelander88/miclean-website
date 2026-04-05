const fs = require('fs');
const path = require('path');
const toolResultPath = fs.readdirSync('C:/Users/Farzali Valiyev/.claude/projects/C--Users-Farzali-Valiyev-Desktop-miclean-website')
  .filter(d => d.match(/^[0-9a-f-]+$/))
  .map(d => path.join('C:/Users/Farzali Valiyev/.claude/projects/C--Users-Farzali-Valiyev-Desktop-miclean-website', d, 'tool-results'))
  .filter(p => fs.existsSync(p))
  .pop();

const files = fs.readdirSync(toolResultPath);
const latestFile = files.filter(f => f.endsWith('.json')).pop();
const data = JSON.parse(fs.readFileSync(path.join(toolResultPath, latestFile), 'utf8'));
const text = data[0].text;
const jsonStr = text.replace('Wix Site API call successful: ', '');
// Handle potential truncation
let parsed;
try {
  parsed = JSON.parse(jsonStr);
} catch(e) {
  // Try to find complete embeds before truncation
  const lastComplete = jsonStr.lastIndexOf('},{');
  const trimmed = jsonStr.substring(0, lastComplete + 1) + ']}';
  parsed = JSON.parse(trimmed);
  console.log('WARNING: JSON was truncated, parsed partial data');
}
const embeds = parsed.customEmbeds;

const searchTerms = ['təmizliklədən', 'Təsdiqliyın', 'sizişlə', 'qaytarila', 'qaytarIlmır', 'Qəydlər', 'yrlə'];

embeds.forEach(e => {
  const html = e.embedData?.html || '';
  const matches = searchTerms.filter(t => html.includes(t));
  if (matches.length > 0) {
    console.log(`\nEMBED: ${e.name} (${e.id})`);
    console.log(`  Revision: ${e.revision}`);
    console.log(`  Position: ${e.position}`);
    console.log(`  HTML length: ${html.length}`);
    console.log(`  Issues: ${matches.join(', ')}`);
  }
});

console.log('\n=== ALL EMBEDS ===');
embeds.forEach(e => {
  console.log(`${e.name} | ${e.id} | rev:${e.revision} | ${e.position} | ${(e.embedData?.html || '').length} chars`);
});
