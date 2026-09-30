(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], core=window.TokemojiStackCore;
  if(!document.body.classList.contains('tokemoji-stack')||!core)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let paused=false, frame=0, currentChapter='', pointer={x:0,y:0}, manualProgress=null, filmPlaying=false;
  const chapters=$$('.chapter').map(section=>{
    const marker=document.createElement('div');marker.className='chapter-marker';marker.setAttribute('aria-hidden','true');section.before(marker);
    section.tabIndex=-1;return {section,card:section.querySelector('.chapter-card'),marker,y:0,height:0};
  });
  // Give the bottom of a tall card a readable pause before the next card covers it.
  chapters.slice(1,-1).forEach(({section})=>{const runway=document.createElement('div');runway.className='chapter-runway';runway.setAttribute('aria-hidden','true');section.after(runway);});
  const film=$('#concept-film');let filmReady=false,filmDesired=0,filmError=false;
  const beats=[['News hits.','One headline can change how the whole internet feels.'],['Mood shifts.','Twelve original Tokemoji give those feelings a face.'],['Markets react.','Follow the emotion index. Forecast what moves next.']];
  let shownBeat=-1;
  function showBeat(progress){
    const b=core.beat(progress);
    if(b!==shownBeat){shownBeat=b;$('#concept-title').textContent=beats[b][0];$('#concept-copy').textContent=beats[b][1];$('.caption-number').textContent='0'+(b+1);$$('[data-beat]').forEach(e=>e.setAttribute('aria-pressed',String(Number(e.dataset.beat)===b)));}
    $('.intro-card').style.setProperty('--intro-progress',progress.toFixed(4));
  }
  function seekFilm(){
    if(!filmReady||filmPlaying||film.seeking||filmError||reduced.matches||paused||document.hidden)return;
    const target=filmDesired*Math.max(0,film.duration-.06);
    if(Number.isFinite(target)&&Math.abs(film.currentTime-target)>.065){try{film.currentTime=target;}catch{filmError=true;}}
  }
  film.addEventListener('loadedmetadata',()=>{filmReady=Number.isFinite(film.duration);if(filmReady&&!reduced.matches)film.currentTime=.04;requestFrame();});
  film.addEventListener('seeked',()=>{film.dataset.painted='true';seekFilm();});
  film.addEventListener('playing',()=>{film.dataset.painted='true';});
  film.addEventListener('error',()=>{filmError=true;$('.film-replay').textContent='Illustrated concept';$('.film-replay').disabled=true;});
  film.addEventListener('timeupdate',()=>{if(filmPlaying&&film.duration)showBeat(core.clamp(film.currentTime/film.duration));});
  film.addEventListener('ended',()=>{filmPlaying=false;$('.film-replay').textContent='↺ Replay';});
  $('.film-replay').addEventListener('click',async()=>{if(filmPlaying){film.pause();filmPlaying=false;$('.film-replay').textContent='▶ Watch';return;}try{film.currentTime=0;filmPlaying=true;await film.play();$('.film-replay').textContent='Ⅱ Pause';}catch{filmPlaying=false;$('.film-replay').textContent='Scroll to explore';}});
  $$('[data-beat]').forEach(button=>button.addEventListener('click',()=>{film.pause();filmPlaying=false;manualProgress=Number(button.dataset.beat)/3+.08;filmDesired=manualProgress;showBeat(manualProgress);if(filmReady&&!reduced.matches&&!paused){film.currentTime=filmDesired*(film.duration-.06);}}));
  function measure(){
    const small=innerWidth<=760;
    for(const c of chapters){c.y=c.marker.getBoundingClientRect().top+scrollY;c.height=c.card.offsetHeight;c.section.style.setProperty('--sticky-top',Math.min(small?79:94,innerHeight-c.height-(small?104:28))+'px');}
    requestFrame();
  }
  function requestFrame(){if(!frame)frame=requestAnimationFrame(updateScroll);}
  function updateScroll(){
    frame=0;
    const vh=innerHeight,y=scrollY,noMotion=paused||reduced.matches;
    let active=chapters[0];
    chapters.forEach((c,i)=>{
      if(c.y-y<vh*.42)active=c;
      const next=chapters[i+1],overlap=next?core.clamp((vh-(next.y-y))/(vh*.85)):0;
      c.card.style.setProperty('--card-scale',noMotion?1:(1-overlap*.047).toFixed(4));
      c.card.style.setProperty('--card-brightness',noMotion?1:(1-overlap*.09).toFixed(3));
    });
    if(active.section.id!==currentChapter){currentChapter=active.section.id;document.body.dataset.chapter=currentChapter;$('#chapter-number').textContent=String(chapters.indexOf(active)+1).padStart(2,'0');$$('[data-for]').forEach(e=>{if(e.dataset.for===currentChapter)e.setAttribute('aria-current','location');else e.removeAttribute('aria-current');});}
    document.documentElement.style.setProperty('--read-progress',core.clamp(y/(document.documentElement.scrollHeight-vh)));
    if(!filmPlaying){filmDesired=manualProgress??core.clamp(y/Math.max(1,$('.intro-scroll-space').offsetHeight));showBeat(filmDesired);if(currentChapter==='intro'&&!noMotion)seekFilm();}
  }
  addEventListener('scroll',()=>{manualProgress=null;if(filmPlaying){film.pause();filmPlaying=false;$('.film-replay').textContent='▶ Watch';}requestFrame();},{passive:true});
  let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,100);},{passive:true});
  const ro=new ResizeObserver(()=>measure());chapters.forEach(c=>ro.observe(c.card));
  let pointerFrame=0;
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||innerWidth<1000||paused||reduced.matches)return;pointer={x:(e.clientX/innerWidth-.5)*12,y:(e.clientY/innerHeight-.5)*10};if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;$('.orbit-nav').style.setProperty('--pointer-x',pointer.x+'px');$('.orbit-nav').style.setProperty('--pointer-y',pointer.y+'px');});},{passive:true});
  document.addEventListener('click',e=>{const anchor=e.target.closest('a[href^="#"]');if(!anchor)return;const target=document.getElementById(anchor.hash.slice(1));if(!target)return;e.preventDefault();const chapter=chapters.find(c=>c.section===target||c.section.contains(target));const top=chapter&&chapter.section.id!=='intro'?(chapter.y-86+(target===chapter.section?0:target.offsetTop)):0;scrollTo({top,behavior:reduced.matches?'instant':'smooth'});history.replaceState(null,'',anchor.hash);if(target===chapter?.section)target.focus({preventScroll:true});$('#section-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');});
  $('.menu-toggle').addEventListener('click',()=>{const open=$('#section-menu').hidden;$('#section-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#section-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');}});
  function motionSync(){const off=paused||reduced.matches||document.hidden;document.body.dataset.motion=off?'paused':'running';$('.motion-control').setAttribute('aria-pressed',String(off));$('.motion-control').setAttribute('aria-label',off?'Resume decorative motion':'Pause decorative motion');$('.motion-control span').textContent=off?'▶':'Ⅱ';$$('[data-motion-src]').forEach(img=>{const inView=img.getBoundingClientRect().bottom>0&&img.getBoundingClientRect().top<innerHeight;const src=!off&&inView?img.dataset.motionSrc:img.dataset.stillSrc;if(img.getAttribute('src')!==src)img.src=src;});if(off){film.pause();filmPlaying=false;}requestFrame();}
  $('.motion-control').addEventListener('click',()=>{paused=!paused;motionSync();});reduced.addEventListener('change',motionSync);document.addEventListener('visibilitychange',motionSync);
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{e.target.dataset.visible=String(e.isIntersecting);});motionSync();},{threshold:0});chapters.forEach(c=>io.observe(c.section));
  const imageObserver=new IntersectionObserver(entries=>{for(const e of entries){const img=e.target;img.src=e.isIntersecting&&!paused&&!reduced.matches&&!document.hidden?img.dataset.motionSrc:img.dataset.stillSrc;}},{threshold:.01});$$('[data-motion-src]').forEach(img=>imageObserver.observe(img));

  const descriptions={greed:'Always looking for more.',fear:'What could go wrong?',good:'A little faith in humanity.',evil:'There is always a catch.',love:'The feeling that brings us together.',hate:'A strong reaction, to put it mildly.',mad:'Somebody crossed the line.',sad:'Sometimes the timeline hurts.',lol:'The internet is undefeated.',omg:'Wait. Did that really happen?',happy:'More of this, please.',like:'A little approval goes a long way.'};
  const universe=$('#universe-characters');
  core.emotions.forEach((emotion,i)=>{const angle=i/12*Math.PI*2-Math.PI/2,button=document.createElement('button');button.className='universe-character';button.setAttribute('aria-label','Meet '+emotion.toUpperCase());button.setAttribute('aria-pressed','false');button.style.setProperty('--mood-x',Math.cos(angle)*42+'%');button.style.setProperty('--mood-y',Math.sin(angle)*42+'%');button.style.setProperty('--mood-r',(i%2?9:-9)+'deg');const img=document.createElement('img');img.src='assets/img/emojis/'+emotion+'.webp';img.alt='';img.width=100;img.height=100;img.loading='lazy';button.append(img);button.addEventListener('click',()=>{$$('.universe-character').forEach(e=>e.setAttribute('aria-pressed',String(e===button)));$('.universe-center>span').textContent=emotion.toUpperCase();$('.universe-center>strong').textContent='ALL HUMAN.';$('#mood-description').textContent=descriptions[emotion];});universe.append(button);});
  const allocations=[['93%','COMMUNITY'],['4%','HYPE FUND'],['3%','TEAM']];$$('[data-allocation]').forEach(button=>button.addEventListener('click',()=>{const a=allocations[Number(button.dataset.allocation)];$('#allocation-value').textContent=a[0];$('#allocation-name').textContent=a[1];$$('[data-allocation]').forEach(e=>e.setAttribute('aria-pressed',String(e===button)));}));
  $$('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{detail.querySelector('summary span').textContent=detail.open?'−':'+';measure();}));
  $$('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));

  // One quote snapshot supplies both the index and the forecast selector.
  const market=window.TokemojiMarket;let sort='marketcap',quoteRows=[],selectedHistory=null,historyVersion=0;
  const image=(emotion,size=35)=>{const img=document.createElement('img');img.src='assets/img/emojis/'+emotion.toLowerCase()+'.webp';img.alt='';img.width=size;img.height=size;return img;};
  function renderMarket(){
    const state=market?.state;quoteRows=state?.rows||[];const rows=window.TokemojiPairMath?window.TokemojiPairMath.sort(quoteRows,sort):quoteRows;
    const body=$('#stack-index-rows');body.replaceChildren();
    rows.forEach((row,i)=>{const tr=document.createElement('tr'),name=document.createElement('td'),label=document.createElement('div');label.className='index-emotion';const rank=document.createElement('span');rank.textContent=String(i+1).padStart(2,'0');label.append(rank,image(row.ticker,29),document.createTextNode(row.ticker));name.append(label);tr.append(name);for(const [value,cls] of [[row.price,''],[row.change,row.changeType],[row.marketCap,'']]){const td=document.createElement('td');td.textContent=value||'—';td.className=cls;tr.append(td);}const td=document.createElement('td'),button=document.createElement('button');button.className='history-button';button.textContent='⌁';button.setAttribute('aria-label','View '+row.ticker+' price history');button.addEventListener('click',()=>{selectedHistory=row;$('#chart-title').textContent=row.ticker+' / HISTORY';$('#chart-dialog').showModal();loadHistory();});td.append(button);tr.append(td);body.append(tr);});
    $('#quote-status').textContent=state?.status==='loading'?'Connecting to the sample-token market…':state?.status==='error'?'Market connection unavailable. No prices have been substituted.':state?.checked?'Sample quotes checked '+new Date(state.checked).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'. Missing values remain unavailable.':'No quotes available.';
    const pairs=$('#stack-pairs');pairs.replaceChildren();[['GREED','FEAR'],['GOOD','EVIL'],['LOVE','HATE']].forEach(([a,b])=>{const left=quoteRows.find(r=>r.ticker===a),right=quoteRows.find(r=>r.ticker===b);const share=window.TokemojiPairMath.general(left?.marketCapRaw,right?.marketCapRaw),day=window.TokemojiPairMath.day(left?.changeRaw,right?.changeRaw);const el=document.createElement('article');el.className='pair-meter';const names=document.createElement('div');names.className='pair-names';names.append(image(a,24),document.createTextNode(a+' / '+b),image(b,24));const bar=document.createElement('div');bar.className='pair-bar';if(share!==null){const fill=document.createElement('i');fill.style.width=share+'%';bar.append(fill);}const text=document.createElement('p');text.textContent=share===null?'Market-cap balance unavailable':a+' '+share.toFixed(1)+'% · '+b+' '+(100-share).toFixed(1)+'%';const foot=document.createElement('strong');foot.textContent=day===null?'24h comparison —':(day.spread>=0?a:b)+' leads by '+Math.abs(day.spread).toFixed(2)+' pp';el.append(names,bar,text,foot);pairs.append(el);});
    renderPool();measure();
  }
  document.addEventListener('tokemoji:quotes',renderMarket);
  $$('[data-sort]').forEach(button=>button.addEventListener('click',()=>{sort=button.dataset.sort;$$('[data-sort]').forEach(e=>e.setAttribute('aria-pressed',String(e===button)));renderMarket();}));
  $('#refresh-quotes').addEventListener('click',async()=>{$('#refresh-quotes').disabled=true;try{await market.load(true);}finally{$('#refresh-quotes').disabled=false;}});
  async function loadHistory(){const version=++historyVersion;$('#market-history').replaceChildren();$('#chart-status').textContent='Loading recorded sample prices…';if(!selectedHistory?.id){$('#chart-status').textContent='No connected sample-token mapping. There is no recorded history to display.';return;}try{const url=window.TOKEMOJI_MARKET_EDGE_URL+'/get-token-chart?token_id='+encodeURIComponent(selectedHistory.id)+'&range='+$('#chart-range').value;const response=await fetch(url,{headers:{apikey:SUPABASE_EDGE_KEY,Authorization:'Bearer '+SUPABASE_EDGE_KEY},signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('unavailable');const data=await response.json();if(version!==historyVersion)return;const points=core.historyPoints(data);if(points.length<2){$('#chart-status').textContent='Not enough recorded data for this period.';return;}const low=Math.min(...points.map(p=>p.v)),high=Math.max(...points.map(p=>p.v)),span=points.at(-1).t-points[0].t||1;const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',points.map(p=>`${12+576*(p.t-points[0].t)/span},${177-163*(p.v-low)/(high-low||1)}`).join(' '));line.setAttribute('fill','none');line.setAttribute('stroke','#009dde');line.setAttribute('stroke-width','3');$('#market-history').append(line);$('#chart-status').textContent=points.length+' recorded points · '+market.money(low)+' to '+market.money(high);}catch{if(version===historyVersion)$('#chart-status').textContent='Recorded history is currently unavailable.';}}
  $('#chart-range').addEventListener('change',loadHistory);

  // Same production data model as Forecast; no mock rounds or scoring outcomes.
  const draftKey='tokemoji:stacked:forecast-draft:v1';let draft=core.blank(),direction='up',client=null,round=null,session=null,roundState='loading',submitting=false,submitted=false;
  try{const saved=JSON.parse(localStorage.getItem(draftKey));if(core.validDraft(saved))draft=saved;}catch{}
  function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify(draft));}catch{}}
  function renderPool(){
    const pool=$('#emotion-pool');if(!pool)return;pool.replaceChildren();
    core.emotions.forEach(emotion=>{const button=document.createElement('button');button.className='emotion-option';button.dataset.emotion=emotion;button.append(image(emotion,43));const name=document.createElement('strong');name.textContent=emotion.toUpperCase();const quote=document.createElement('small');const row=quoteRows.find(r=>r.ticker===emotion.toUpperCase());quote.textContent=row?.change||'24H —';quote.className=row?.changeType||'';button.append(name,quote);const other=direction==='up'?'down':'up',idx=draft[direction].indexOf(emotion);button.setAttribute('aria-label',emotion.toUpperCase()+' '+(direction==='up'?'gainer':'loser'));button.setAttribute('aria-pressed',String(idx>=0));button.disabled=submitting||submitted||draft[other].includes(emotion)||(idx<0&&draft[direction].length===3);if(idx>=0){const rank=document.createElement('span');rank.className='pick-rank';rank.textContent=(direction==='up'?'↗':'↘')+(idx+1);button.append(rank);}button.addEventListener('click',()=>{draft=core.select(draft,direction,emotion);saveDraft();renderDraft();});pool.append(button);});
  }
  function renderSlots(side){const list=$('#stack-'+side);list.replaceChildren();for(let i=0;i<3;i++){const li=document.createElement('li'),number=document.createElement('span');number.className='slot-number';number.textContent='#'+(i+1);li.append(number);const emotion=draft[side][i];if(emotion){li.className='filled';const img=image(emotion,44);img.className='slot-image';const label=document.createElement('strong');label.className='slot-label';label.textContent=emotion.toUpperCase();const remove=document.createElement('button');remove.className='slot-remove';remove.textContent='×';remove.setAttribute('aria-label','Remove '+emotion.toUpperCase()+' from '+side);remove.disabled=submitting||submitted;remove.addEventListener('click',()=>{draft=core.select(draft,side,emotion);saveDraft();renderDraft();});li.append(img,label,remove);if(i>0){const move=document.createElement('button');move.className='slot-move';move.textContent='← Move up';move.setAttribute('aria-label','Rank '+emotion.toUpperCase()+' higher in '+side);move.disabled=submitting||submitted;move.addEventListener('click',()=>{draft=core.move(draft,side,i);saveDraft();renderDraft();});li.append(move);}}else{const empty=document.createElement('span');empty.className='slot-empty';empty.textContent='+';const label=document.createElement('span');label.className='slot-label';label.textContent='YOUR PICK';li.append(empty,label);}list.append(li);}}
  function updateSubmit(){const full=core.complete(draft),button=$('#lock-forecast');button.disabled=!full||submitting||submitted||(!!session&&!core.openRound(round));button.textContent=submitted?'Forecast submitted ✓':submitting?'Submitting…':!full?'Choose your six ↗':!session?'Sign in to submit ↗':!core.openRound(round)?'No open round':'Lock forecast ↗';$('#pick-counter').textContent=(draft.up.length+draft.down.length)+' OF 6 PICKED';$('#forecast-note').textContent=submitted?'Saved to your account for this round.':session&&!core.openRound(round)?'Your local draft is ready. Submission needs an open round.':'A local draft until you sign in and submit to an open round.';}
  function renderDraft(){const focused=document.activeElement?.getAttribute('aria-label');renderSlots('up');renderSlots('down');renderPool();$('#pick-instruction').textContent=direction==='up'?'Choose the emotions you expect to rise.':'Choose the emotions you expect to fall.';$$('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===direction)));updateSubmit();if(focused){const match=$$('#forecast button[aria-label]').find(b=>b.getAttribute('aria-label')===focused&&!b.disabled);match?.focus({preventScroll:true});}}
  $$('[data-direction]').forEach(button=>button.addEventListener('click',()=>{direction=button.dataset.direction;renderDraft();}));
  async function queryRound(){if(!client)throw Error('Not connected');const now=new Date().toISOString();const {data,error}=await client.from('rounds').select('*').eq('status','open').eq('kind','daily').lte('opens_at',now).gt('locks_at',now).order('opens_at',{ascending:false}).limit(1).maybeSingle().abortSignal(AbortSignal.timeout(9000));if(error)throw error;return data;}
  function roundCopy(){if(roundState==='error')return 'Round service unavailable · draft stays on this device';if(roundState==='loading')return 'Checking the current round…';if(!core.openRound(round))return 'No open daily round · draft only';const mins=Math.max(0,Math.floor((Date.parse(round.locks_at)-Date.now())/60000));return 'Daily round · locks in '+Math.floor(mins/60)+'h '+(mins%60)+'m';}
  let roundVersion=0;
  async function refreshRound(){
    const version=++roundVersion,userId=session?.user.id;
    if(!client){roundState='error';$('#round-status').textContent=roundCopy();updateSubmit();return;}
    $('#refresh-round').disabled=true;roundState='loading';$('#round-status').textContent=roundCopy();
    try{
      const nextRound=await queryRound();
      if(version!==roundVersion||userId!==session?.user.id)return;
      let existing=null;
      if(userId&&nextRound){
        const {data,error}=await client.from('predictions').select('up_picks,down_picks').eq('user_id',userId).eq('round_id',nextRound.id).maybeSingle().abortSignal(AbortSignal.timeout(9000));
        if(error)throw error;existing=data;
      }
      if(version!==roundVersion||userId!==session?.user.id)return;
      const previousWasSubmitted=submitted;round=nextRound;roundState='ready';submitted=false;
      if(existing&&core.complete({up:existing.up_picks,down:existing.down_picks})){draft={up:existing.up_picks,down:existing.down_picks};submitted=true;}
      else if(previousWasSubmitted){draft=core.blank();saveDraft();}
    }catch{if(version===roundVersion){round=null;roundState='error';submitted=false;}}
    finally{if(version===roundVersion){$('#round-status').textContent=roundCopy();$('#refresh-round').disabled=false;renderDraft();}}
  }
  $('#refresh-round').addEventListener('click',refreshRound);
  $('#lock-forecast').addEventListener('click',async()=>{
    if(!core.complete(draft)||submitting||submitted)return;
    if(!session){$('#auth-status').textContent=roundState==='error'?'The account and round service is unavailable right now. Your draft is preserved.':'';$('#auth-dialog').showModal();return;}
    submitting=true;renderDraft();$('#forecast-feedback').textContent='Verifying the current round…';
    try{const {data:userData,error:userError}=await client.auth.getUser();if(userError||!userData.user)throw Error('Please sign in again.');const fresh=await queryRound();if(!core.openRound(fresh)||!round||fresh.id!==round.id)throw Error('This round is no longer open. Your draft was not submitted.');const payload={round_id:fresh.id,user_id:userData.user.id,up_picks:[...draft.up],down_picks:[...draft.down],fingerprint:null};const {error}=await client.from('predictions').insert(payload);if(error){if(error.code==='23505')throw Error('You already submitted a forecast for this round. Refresh to see it.');throw Error('Submission could not be confirmed. Refresh the round before trying again.');}submitted=true;try{localStorage.removeItem(draftKey);}catch{}$('#forecast-feedback').textContent='Your forecast is saved to this round. Check the results after settlement.';}catch(e){$('#forecast-feedback').textContent=e.message||'Unable to submit. Your draft is still here.';}finally{submitting=false;renderDraft();}
  });
  const redirectURL=location.origin+location.pathname+'#forecast';
  $('#sign-in-x').addEventListener('click',async()=>{if(!client)return;$('#sign-in-x').disabled=true;$('#auth-status').textContent='Opening X sign-in…';try{const {error}=await client.auth.signInWithOAuth({provider:'twitter',options:{redirectTo:redirectURL}});if(error)throw error;}catch{$('#auth-status').textContent='Sign-in is unavailable. Your local draft is safe.';}finally{$('#sign-in-x').disabled=false;}});
  $('#email-sign-in').addEventListener('submit',async e=>{e.preventDefault();if(!client)return;const button=e.currentTarget.querySelector('button');button.disabled=true;$('#auth-status').textContent='Requesting your sign-in link…';try{const {error}=await client.auth.signInWithOtp({email:$('#forecast-email').value.trim(),options:{emailRedirectTo:redirectURL}});if(error)throw error;$('#auth-status').textContent='Link requested. Check your inbox to continue.';}catch{$('#auth-status').textContent='Could not send a sign-in link. Please try when the service is available.';}finally{button.disabled=false;}});
  async function connect(){try{if(!window.supabase?.createClient||!window.TOKEMOJI_SUPABASE_URL)throw Error('configuration');client=window.supabase.createClient(window.TOKEMOJI_SUPABASE_URL,window.TOKEMOJI_SUPABASE_ANON_KEY);const {data}=await client.auth.getSession();session=data.session;client.auth.onAuthStateChange((_event,newSession)=>{session=newSession;setTimeout(()=>{if(newSession){$('#auth-dialog').close();refreshRound();}else{roundVersion++;submitted=false;draft=core.blank();try{const saved=JSON.parse(localStorage.getItem(draftKey));if(core.validDraft(saved))draft=saved;}catch{}renderDraft();refreshRound();}},0);});await refreshRound();}catch{roundState='error';$('#round-status').textContent=roundCopy();updateSubmit();}}
  setInterval(()=>{if(document.hidden)return;$('#round-status').textContent=roundCopy();updateSubmit();},15000);
  renderDraft();renderMarket();market?.load();connect();measure();motionSync();
  document.fonts?.ready.then(measure);addEventListener('pageshow',measure);
  if(location.hash){const target=chapters.find(c=>'#'+c.section.id===location.hash);if(target)requestAnimationFrame(()=>scrollTo({top:target.section.id==='intro'?0:target.y-86,behavior:'instant'}));}
})();
