const fs = require('fs');

const raw = fs.readFileSync('C:/Users/Farzali Valiyev/.claude/projects/C--Users-Farzali-Valiyev-Desktop-miclean-website/24d89aea-93a0-4b32-8bac-4ccc7715f2e9/tool-results/toolu_01GF1neaAbJTQgEVzNRaw3HK.json', 'utf8');
const data = JSON.parse(raw);
const jsonStr = data[0].text.replace('Wix Site API call successful: ', '');

let parsed;
try { parsed = JSON.parse(jsonStr); } catch(e) {
  const lastBrace = jsonStr.lastIndexOf('}]}');
  if (lastBrace > 0) parsed = JSON.parse(jsonStr.substring(0, lastBrace + 3));
  else {
    const lastObj = jsonStr.lastIndexOf('},{');
    parsed = JSON.parse(jsonStr.substring(0, lastObj + 1) + ']}');
  }
  console.log('NOTE: Truncated JSON parsed successfully');
}

const embeds = parsed.customEmbeds;
const searchTerms = ['təmizliklədən', 'Təsdiqliyın', 'sizişlə', 'qaytarila', 'qaytarIlmır', 'Qəydlər', 'yrlə'];

console.log('=== EMBEDS WITH ISSUES ===');
embeds.forEach(e => {
  const html = e.embedData?.html || '';
  const matches = searchTerms.filter(t => html.includes(t));
  if (matches.length > 0) {
    console.log(`  ${e.name} | ID: ${e.id} | Rev: ${e.revision} | Issues: ${matches.join(', ')}`);
  }
});

console.log('\n=== ALL EMBEDS ===');
embeds.forEach(e => {
  const html = e.embedData?.html || '';
  console.log(`  ${e.name} | ${e.id} | rev:${e.revision} | ${e.position} | ${html.length} chars`);
});
