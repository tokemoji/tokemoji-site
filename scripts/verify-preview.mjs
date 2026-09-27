import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire('/opt/data/projects/tokemoji-v2/package.json');
const {JSDOM}=require('jsdom');
const manifest=JSON.parse(readFileSync('artwork/coins/manifest.json','utf8'));
assert.equal(Object.keys(manifest).length,12);
for(const [name,h] of Object.entries(manifest)){
 for(const [path,hash] of [[`artwork/coins/${name}-coin-clean.png`,h.original],[`src/assets/img/emojis/${name}-coin.webp`,h.web]])assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash,path);
 assert(existsSync(`dist/assets/img/emojis/${name}-coin.webp`));
}
const dom=new JSDOM(readFileSync('dist/predict.html','utf8'),{url:'https://preview.test/predict.html',runScripts:'outside-only'}),w=dom.window,d=w.document;
w.TOKEMOJI_SUPABASE_URL='https://test.invalid';w.TokemojiAuth={init:()=>true,getSession:async()=>null,onAuthStateChange:()=>{},getLeaderboard:async()=>[]};
w.eval(readFileSync('src/assets/js/tokemoji-scoring.js','utf8'));w.eval(readFileSync('src/assets/js/tokemoji-predict.js','utf8'));
await new Promise(r=>setTimeout(r,20));
const click=(side,token)=>d.querySelector(`[data-side="${side}"][data-token="${token}"]`).click();
for(const n of ['greed','love','good'])click('up',n);
assert(d.querySelector('[data-side="down"][data-token="greed"]').disabled);
click('up','happy');assert.equal(d.querySelectorAll('#up-slots .slot[data-token]:not([data-token=""])').length,3);
for(const n of ['fear','hate','evil'])click('down',n);
assert.equal(d.querySelectorAll('.slot:not([data-token=""])').length,6);
assert(d.querySelector('#submit-btn').disabled,'Anonymous draft must not submit');
click('up','greed');assert.equal(d.querySelectorAll('.slot:not([data-token=""])').length,5);
assert(!d.querySelector('[data-side="down"][data-token="greed"]').disabled);
assert(!d.querySelector('#leaderboard-body').textContent.includes('Loading'));
const app=readFileSync('dist/assets/js/app.js','utf8');assert(!app.includes('THE WORLD MAKES HEADLINES'),'Hero must not execute from bundle too');
console.log('PASS: 12 approved artwork hashes + built assets; 3 UP/3 DOWN; duplicate prevention; max-3; deselection; anonymous submission blocked; leaderboard resolves; no duplicate hero bundle.');
w.close();
