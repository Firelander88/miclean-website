// Reads each body file, GETs current revision from Wix API, then PATCHes with updated content
// Uses the Wix API key from environment or prompts for it
const fs = require('fs');
const https = require('https');
const path = require('path');

const SITE_ID = 'b770c699-0cb2-4b4e-914a-80a3e7280e48';
const bodyDir = 'C:/Users/Farzali Valiyev/Desktop/miclean-website/.claude/_bodies';
const API_BASE = 'https://www.wixapis.com/embeds/v1/custom-embeds';

// Try to find the Wix API key
// Check common locations
const possibleKeyPaths = [
  process.env.WIX_API_KEY,
  process.env.WIX_ACCESS_TOKEN,
];

// Read from the .env file if exists
try {
  const envFile = fs.readFileSync('C:/Users/Farzali Valiyev/Desktop/miclean-website/.env', 'utf8');
  const match = envFile.match(/WIX_API_KEY=(.+)/);
  if (match) possibleKeyPaths.push(match[1].trim());
} catch {}

const apiKey = possibleKeyPaths.find(k => k && k.length > 10);

if (!apiKey) {
  // Can't call API directly without key - output bodies for manual PATCH via MCP
  console.log('No Wix API key found. Outputting embed IDs and revisions needed.');
  console.log('Use CallWixSiteAPI MCP tool to PATCH each embed.');

  const files = fs.readdirSync(bodyDir).filter(f => f.endsWith('.json')).sort();
  files.forEach(f => {
    const data = JSON.parse(fs.readFileSync(path.join(bodyDir, f), 'utf8'));
    console.log(`${f}: embedId=${data.customEmbed.id} rev=${data.customEmbed.revision} htmlLen=${data.customEmbed.embedData.html.length}`);
  });
  process.exit(0);
}

// If we have the API key, proceed with direct API calls
async function patchEmbed(embedId, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'www.wixapis.com',
      path: `/embeds/v1/custom-embeds/${embedId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'wix-site-id': SITE_ID,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getRevision(embedId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.wixapis.com',
      path: `/embeds/v1/custom-embeds/${embedId}`,
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'wix-site-id': SITE_ID
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.customEmbed?.revision || '1');
        } catch { resolve('1'); }
      });
    });
    req.on('error', () => resolve('1'));
    req.end();
  });
}

async function main() {
  const files = fs.readdirSync(bodyDir).filter(f => f.endsWith('.json')).sort();
  let success = 0, failed = 0;

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(bodyDir, f), 'utf8'));
    const embedId = data.customEmbed.id;

    // Get current revision
    const rev = await getRevision(embedId);
    data.customEmbed.revision = rev;

    console.log(`Patching ${f} (rev:${rev}, ${data.customEmbed.embedData.html.length} chars)...`);

    try {
      const result = await patchEmbed(embedId, data);
      if (result.status === 200) {
        console.log(`  ✓ ${f} updated successfully`);
        success++;
      } else {
        console.log(`  ✗ ${f} failed: ${result.status} - ${result.body.substring(0, 200)}`);
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ ${f} error: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed out of ${files.length}`);
}

main();
