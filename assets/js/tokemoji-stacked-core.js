(function (root) {
  'use strict';
  const emotions = ['greed','fear','good','evil','love','hate','mad','sad','lol','omg','happy','like'];
  const blank = () => ({up:[],down:[]});
  const validDraft = d => !!d && ['up','down'].every(s => Array.isArray(d[s]) && d[s].length <= 3 && d[s].every(t=>emotions.includes(t))) && new Set([...d.up,...d.down]).size === d.up.length+d.down.length;
  function select(draft, side, emotion) {
    if (!validDraft(draft) || !['up','down'].includes(side) || !emotions.includes(emotion)) return draft;
    const other = side === 'up' ? 'down' : 'up';
    if (draft[other].includes(emotion)) return draft;
    const exists=draft[side].includes(emotion);
    if (!exists && draft[side].length === 3) return draft;
    return {...draft,[side]:exists?draft[side].filter(t=>t!==emotion):[...draft[side],emotion]};
  }
  function move(draft,side,index) {
    if(!validDraft(draft)||!['up','down'].includes(side)||index<1||index>=draft[side].length)return draft;
    const picks=[...draft[side]];[picks[index-1],picks[index]]=[picks[index],picks[index-1]];return {...draft,[side]:picks};
  }
  const complete = d => validDraft(d) && d.up.length===3 && d.down.length===3;
  const openRound = (r,now=Date.now()) => !!r && r.status==='open' && r.kind==='daily' && Number.isFinite(Date.parse(r.opens_at)) && Date.parse(r.opens_at)<=now && Number.isFinite(Date.parse(r.locks_at)) && Date.parse(r.locks_at)>now;
  const clamp = n=>Math.min(1,Math.max(0,Number.isFinite(n)?n:0));
  const beat = p=>Math.min(2,Math.floor(clamp(p)*3));
  // The chart endpoint returns raw price ticks for 1h and OHLC closes for longer ranges.
  function historyPoints(data) {
    const rows=Array.isArray(data)?data:data?.data||data?.ticks||[];
    if(!Array.isArray(rows))return [];
    return rows.map(p=>{const raw=p.price_usd??p.price??p.close;return {t:Date.parse(p.timestamp||p.bucket_start||p.created_at||p.time),v:raw===null||raw===undefined||raw===''?NaN:Number(raw)};}).filter(p=>Number.isFinite(p.t)&&Number.isFinite(p.v)&&p.v>=0).sort((a,b)=>a.t-b.t);
  }
  root.TokemojiStackCore={emotions,blank,validDraft,select,move,complete,openRound,clamp,beat,historyPoints};
})(typeof window==='object'?window:globalThis);
