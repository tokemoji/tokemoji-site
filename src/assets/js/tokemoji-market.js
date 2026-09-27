/* One read-only quote snapshot for the original index and all pair meters. */
(() => {
'use strict';
const valid=v=>typeof v==='number'&&Number.isFinite(v);
window.TokemojiPairMath={
 sort(rows,type){const field=type==="marketcap"?"marketCapRaw":"changeRaw";return [...rows].sort((a,b)=>{const x=a[field],y=b[field];if(!valid(x))return valid(y)?1:0;if(!valid(y))return -1;return type==="losers"?x-y:y-x;});},
 general(a,b){return valid(a)&&valid(b)&&a>=0&&b>=0&&a+b>0?a/(a+b)*100:null;},
 day(a,b){if(!valid(a)||!valid(b)||a< -100||b< -100||a+b===-200)return null;return {leftShare:(100+a)/(200+a+b)*100,spread:a-b};}
};
if(typeof document==='undefined')return;
const names=['LOVE','LOL','GOOD','EVIL','GREED','FEAR','MAD','HATE','OMG','HAPPY','SAD','LIKE'];
const num=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
const money=v=>v===null?'—':'$'+(v>=1000?new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:2}).format(v):Number(v.toPrecision(5)).toString());
const pct=v=>v===null?'—':(v>=0?'+':'')+v.toFixed(2)+'%';
let pending=null,last=0;
const state={rows:[],status:'loading',checked:null};
function normalize(t={}){const price=num(t.price_usd),cap=num(t.market_cap),change=num(t.change_24h);return {...t,ticker:t.emoji_type,priceRaw:price,marketCapRaw:cap,changeRaw:change,price:money(price),marketCap:money(cap),change:pct(change),changeType:change===null||change===0?'neutral':change>0?'positive':'negative',hasGraphic:true};}
const blank=()=>names.map(n=>normalize({emoji_type:n}));state.rows=blank();
async function load(force=false){
 if(pending)return pending;if(!force&&Date.now()-last<30000)return state.rows;
 pending=(async()=>{state.status='loading';try{
  const key=typeof SUPABASE_EDGE_KEY==='string'?SUPABASE_EDGE_KEY:'';
  const r=await fetch('https://lgjiiebmzpgamdrdzqvq.supabase.co/functions/v1/get-tokens',{headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(12000)});
  if(!r.ok)throw Error('Mappings HTTP '+r.status);const raw=await r.json();if(!Array.isArray(raw))throw Error('Unexpected mappings');
  const mappings=new Map(raw.map(t=>[String(t.emoji_type||t.symbol).toUpperCase(),t]));
  const rows=names.map(n=>({...mappings.get(n),emoji_type:n}));
  const mints=[...new Set(rows.map(t=>t.mint_address).filter(m=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(m)))];
  if(mints.length){const q=await fetch('https://api.dexscreener.com/latest/dex/tokens/'+mints.join(','),{signal:AbortSignal.timeout(12000)});if(!q.ok)throw Error('Quotes HTTP '+q.status);const quotes=await q.json();for(const t of rows){const p=(quotes.pairs||[]).filter(p=>p.chainId==='solana'&&p.baseToken?.address===t.mint_address).sort((a,b)=>(b.liquidity?.usd||0)-(a.liquidity?.usd||0))[0];if(p){t.price_usd=num(p.priceUsd);t.market_cap=num(p.marketCap);t.change_24h=num(p.priceChange?.h24);}}}
  state.rows=rows.map(normalize);state.status='ready';state.checked=new Date().toISOString();
 }catch(e){state.rows=blank();state.status='error';state.error=e.message;}finally{last=Date.now();pending=null;document.dispatchEvent(new CustomEvent('tokemoji:quotes',{detail:state}));}return state.rows;})();return pending;
}
window.TokemojiMarket={state,load,money,pct};
})();
