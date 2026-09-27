const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const {JSDOM}=require('/opt/data/projects/tokemoji-v2/node_modules/jsdom');
test('Anonymous visitor can draft six distinct picks but cannot submit',async()=>{
 const ids=['auth-gate','forecast-app','test-season-banner','forecast-form','forecast-locked','round-opens','countdown','up-slots','down-slots','up-tokens','down-tokens','leaderboard-body'];
 const dom=new JSDOM(ids.map(id=>`<div id="${id}"></div>`).join('')+'<button id="submit-btn"></button>',{runScripts:'outside-only',url:'https://example.test'});const w=dom.window;let writes=0;
 w.TokemojiAuth={init:()=>true,getSession:async()=>null,onAuthStateChange:()=>{},getCurrentRound:async()=>null,getLeaderboard:async()=>[],submitPrediction:async()=>{writes++;return {ok:true}}};w.alert=()=>{};
 w.eval(fs.readFileSync('src/assets/js/tokemoji-scoring.js','utf8'));w.eval(fs.readFileSync('src/assets/js/tokemoji-predict.js','utf8'));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await new Promise(r=>setTimeout(r,20));
 assert.notEqual(w.document.getElementById('forecast-app').style.display,'none');
 assert.equal(w.document.querySelectorAll('.token-btn').length,24);
 const up=[...w.document.querySelectorAll('[data-side="up"].token-btn')],down=[...w.document.querySelectorAll('[data-side="down"].token-btn')];up.slice(0,3).forEach(b=>b.click());assert.equal(down[0].disabled,true);down.slice(3,6).forEach(b=>b.click());
 assert.equal(w.document.getElementById('submit-btn').disabled,true);await w.submitForecast();assert.equal(writes,0);dom.window.close();
});
