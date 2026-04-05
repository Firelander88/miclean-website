const fs=require('fs');
const p=process.argv[2];
const raw=fs.readFileSync(p,'utf8');
const d=JSON.parse(raw);
const txt=d[0].text;
const jsonStart=txt.indexOf('{');
const inner=JSON.parse(txt.slice(jsonStart));
inner.customEmbeds.forEach(e=>{
  console.log([e.id, e.revision, e.position, e.name, e.embedData.html.length].join('|'));
});
