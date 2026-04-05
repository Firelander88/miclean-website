// Read embed HTML_5 content, fix text, write to _patch_html5.json
const fs = require('fs');

// HTML_5 fix: Təsdiqliyın → Təsdiqləyin
const embedId5 = '9f6a2524-74d4-4b68-b3a2-e148c9638c1d';
const rev5 = '1';

// Read the cached API response
const toolResultDir = 'C:/Users/Farzali Valiyev/.claude/projects/C--Users-Farzali-Valiyev-Desktop-miclean-website/24d89aea-93a0-4b32-8bac-4ccc7715f2e9/tool-results';
const files = fs.readdirSync(toolResultDir).filter(f => f.endsWith('.json'));

// We need to find the right files - but parsing is tricky due to embedded HTML
// Instead, let's use the Wix API directly via the relay approach

// Start a relay server that accepts PATCH requests and forwards them
const http = require('http');

const fixMap = {
  // HTML_1 fixes
  'bdd3e230-9ad8-4b1b-8295-a23390b75b56': {
    rev: '1',
    fixes: [
      ['təmizliklədən', 'təmizlikdən'],
    ]
  },
  // HTML_5 fixes
  '9f6a2524-74d4-4b68-b3a2-e148c9638c1d': {
    rev: '1',
    fixes: [
      ['Təsdiqliyın', 'Təsdiqləyin'],
    ]
  },
  // HTML_6 fixes
  'd7d7fc1e-363f-4ed0-834d-c494e28b1f30': {
    rev: '1',
    fixes: [
      ['sizi&#351;l&#601;', 'sizinlə'],
      ['Q&#601;ydl&#601;r', 'Qeydlər'],
      ['&#398;li', 'Əli'],
      ['&#398;n az', 'Ən az'],
      ['yrl&#601;&#351;m&#601;', 'yerləşmə'],
      ['&#601;rzind&#601;', 'ərzində'],
      ['&#601;laq&#601;', 'əlaqə'],
      ['saxlayaca&#287;&#305;q', 'saxlayacağıq'],
      ['Se&#231;in', 'Seçin'],
      ['Dig&#601;r', 'Digər'],
      ['T&#601;mizlik', 'Təmizlik'],
      ['Cama&#351;&#305;rxana', 'Camaşırxana'],
      ['M&#601;tb&#601;x', 'Mətbəx'],
      ['&#304;stehlak', 'İstehlak'],
      ['Xidm&#601;tl&#601;r', 'Xidmətlər'],
      ['az&#305; bir kateqoriya se&#231;in', 'azı bir kateqoriya seçin'],
      ['Sor&#287;u G&#246;nd&#601;r', 'Sorğu Göndər'],
      ['proqram&#305;na', 'proqramına'],
      ['&#8211;4 h&#601;ft&#601;', '–4 həftə'],
      ['s&#305;naq', 'sınaq'],
      ['mara&#287;&#305;m', 'marağım'],
      ['H&#252;seynov', 'Hüseynov'],
      ['&#350;irk&#601;t', 'Şirkət'],
      ['m&#246;vcud probleml&#601;r', 'mövcud problemlər'],
      ['Otel yrl', 'Otel yerl'],
      ['say&#305;', 'sayı'],
    ]
  }
};

console.log('Fix map ready for 3 embeds');
console.log(JSON.stringify(Object.keys(fixMap).map(id => ({ id, fixes: fixMap[id].fixes.length }))));
