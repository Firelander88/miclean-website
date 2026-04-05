const fs = require('fs');
const path = require('path');
const lines = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8').split('\n');

const LIMIT = 14500;
const outDir = path.join(__dirname, 'embed_chunks');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── Dynamic line detection ──────────────────────────────────────────────────
const styleStart = lines.findIndex(l => l.trim() === '<style>');
const styleEnd = lines.findIndex((l, i) => i > styleStart && l.trim() === '</style>');
const bodyStart = lines.findIndex(l => l.trim() === '<body>');
const scriptStart = lines.findIndex((l, i) => i > bodyStart && l.trim() === '<script>');
const scriptEnd = lines.findIndex((l, i) => i > scriptStart && l.trim() === '</script>');
const bodyEnd = lines.findIndex((l, i) => i > scriptEnd && l.trim() === '</body>');

console.log('Structure: <style> L' + (styleStart+1) + ', </style> L' + (styleEnd+1) + ', <body> L' + (bodyStart+1) + ', <script> L' + (scriptStart+1) + ', </script> L' + (scriptEnd+1));

// Extract sections (content only, no structural tags)
const cssLines = lines.slice(styleStart + 1, styleEnd); // between <style> and </style>
const htmlLines = lines.slice(bodyStart + 1, scriptStart); // between <body> and <script>
const jsLines = lines.slice(scriptStart + 1, scriptEnd); // between <script> and </script>

console.log('CSS total:', cssLines.join('\n').length, 'chars (' + cssLines.length + ' lines)');
console.log('HTML total:', htmlLines.join('\n').length, 'chars (' + htmlLines.length + ' lines)');
console.log('JS total:', jsLines.join('\n').length, 'chars (' + jsLines.length + ' lines)');

// ── CSS splits ──────────────────────────────────────────────────────────────
// CSS 1: Wix hide + variables + nav + cover
const css1Prefix = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"><style>#SITE_HEADER,#SITE_FOOTER,[data-mesh-id],#WIX_ADS,[id^="comp-"],.wixui-rich-text,[data-testid="richTextElement"],#SCROLL_TO_TOP{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important}#SITE_CONTAINER,#masterPage,#PAGES_CONTAINER,#SITE_PAGES{display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;background:transparent!important;min-height:0!important;padding:0!important;margin:0!important}body{background:#FFFFFF!important;color:#1A2A3A!important;overflow-x:hidden!important;margin:0!important;padding:0!important}`;
const css1 = css1Prefix + cssLines.slice(0, 61).join('\n') + '</style>';
const css2 = '<style>' + cssLines.slice(61, 199).join('\n') + '</style>';
const css3 = '<style>' + cssLines.slice(199, 299).join('\n') + '</style>';
const css4 = '<style>' + cssLines.slice(299).join('\n') + '</style>';

[['css_1.html', css1], ['css_2.html', css2], ['css_3.html', css3], ['css_4.html', css4]].forEach(([name, content]) => {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log(name + ':', content.length, 'chars', content.length > LIMIT ? '⚠️ OVER LIMIT' : '✅');
});

// ── HTML splits by section comments ─────────────────────────────────────────
// Find section boundaries dynamically
function findHtmlLine(pattern) {
  for (let i = 0; i < htmlLines.length; i++) {
    if (htmlLines[i].includes(pattern)) return i;
  }
  return -1;
}

const kimyeviStart = findHtmlLine('<!-- KİMYƏVİ -->');
const camasirStart = findHtmlLine('<!-- CAMAŞIRXANA -->');
const metbexStart = findHtmlLine('<!-- MƏTBƏX -->');
const amenityStart = findHtmlLine('<!-- AMENITY -->');
const houseStart = findHtmlLine('<!-- HOUSEKEEPING -->');
const hovuzStart = findHtmlLine('<!-- HOVUZ -->');
const xidmetStart = findHtmlLine('<!-- XİDMƏTLƏR -->');
const whyStart = findHtmlLine('<!-- WHY');
const contactStart = findHtmlLine('<!-- CONTACT -->');

console.log('Sections: kimyevi=' + kimyeviStart + ' camasir=' + camasirStart + ' amenity=' + amenityStart + ' house=' + houseStart + ' contact=' + contactStart);

const html1 = htmlLines.slice(0, kimyeviStart).join('\n');
const html2 = htmlLines.slice(kimyeviStart, camasirStart).join('\n');
const html3 = htmlLines.slice(camasirStart, amenityStart).join('\n');
const html4 = htmlLines.slice(amenityStart, houseStart).join('\n');
const html5 = htmlLines.slice(houseStart, contactStart).join('\n');
const html6 = htmlLines.slice(contactStart).join('\n');

[['html_1.html', html1], ['html_2.html', html2], ['html_3.html', html3], ['html_4.html', html4], ['html_5.html', html5], ['html_6.html', html6]].forEach(([name, content]) => {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log(name + ':', content.length, 'chars', content.length > LIMIT ? '⚠️ OVER LIMIT' : '✅');
});

// ── JS splits ───────────────────────────────────────────────────────────────
function findJsLine(pattern) {
  for (let i = 0; i < jsLines.length; i++) {
    if (jsLines[i].includes(pattern)) return i;
  }
  return -1;
}

const searchStart = findJsLine('// ── Product search');
const pillClickStart = findJsLine('// Subcategory pill click');
const historyStart = findJsLine("var HISTORY_KEY");

console.log('JS splits: search=' + searchStart + ' pillClick=' + pillClickStart + ' history=' + historyStart);

const js1 = '<script>' + jsLines.slice(0, searchStart).join('\n') + '</script>';
const js2 = '<script>' + jsLines.slice(searchStart, pillClickStart).join('\n') + '</script>';
const js3 = '<script>' + jsLines.slice(pillClickStart, historyStart).join('\n') + '</script>';
const js4 = '<script>' + jsLines.slice(historyStart).join('\n') + '</script>';

[['js_1.html', js1], ['js_2.html', js2], ['js_3.html', js3], ['js_4.html', js4]].forEach(([name, content]) => {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log(name + ':', content.length, 'chars', content.length > LIMIT ? '⚠️ OVER LIMIT' : '✅');
});

console.log('\nAll chunks saved to:', outDir);
