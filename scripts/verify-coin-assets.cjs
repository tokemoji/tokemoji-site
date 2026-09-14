const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const emotions=['evil','fear','good','greed','happy','hate','like','lol','love','mad','omg','sad'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const name of emotions){assert.equal(fs.existsSync(path.join(root,'src/assets/img/emojis',name+'-coin.webm')),false,`Rejected old animation remains: ${name}-coin.webm`);}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'artwork/coins/manifest.json'),'utf8'));
assert.deepEqual(Object.keys(manifest.coins).sort(),emotions);
for(const name of emotions){const item=manifest.coins[name];assert.equal(hash(path.join(root,item.source)),item.source_sha256,`Source changed: ${name}`);assert.equal(hash(path.join(root,item.web)),item.web_sha256,`Unapproved web artwork: ${name}`);}
console.log('PASS: all 12 approved source/web coin pairs match the manifest; no legacy coin WEBM files.');
