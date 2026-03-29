// MVP Pre-Launch section renderer for index.html
document.addEventListener('DOMContentLoaded', function () {
  const state = loadState();

  // Season/Week
  document.getElementById('mvp-season').textContent = state.season;
  const seasonBadge = document.getElementById('mvp-season-badge');
  if (seasonBadge) seasonBadge.textContent = state.season;
  document.getElementById('mvp-week').textContent = state.week;

  // Marketing bits (optional, only on prelaunch page)
  const eowTitle = document.getElementById('mvp-eow-title');
  if (eowTitle) eowTitle.textContent = `Emotion of the Week #${state.week}`;
  const rewardPoolEl = document.getElementById('mvp-reward-pool');
  if (rewardPoolEl) rewardPoolEl.textContent = (state.rewardPool || 100000).toLocaleString() + " (winner token)";

  // Post of the Day
  const post = state.postOfTheDay;
  document.getElementById('mvp-pod-date').textContent = post.date;
  document.getElementById('mvp-pod-title').textContent = `Tokemoji Daily Mood Card`;
  document.getElementById('mvp-pod-desc').textContent = `Ranking: ${post.ranking.join(', ')} | ${post.reason}`;
  const podLink = document.getElementById('mvp-pod-link');
  podLink.href = '#'; // TODO: link to actual X post
  podLink.title = 'Open on X';

  // Quests list
  const questsList = document.getElementById('mvp-quests');
  questsList.innerHTML = '';
  state.quests.forEach(quest => {
    let html = `
      <div class="d-flex justify-content-between align-items-center border border-dark rounded-4 p-3 bg-light">
        <div>
          <strong class="text-heading">${quest.title}</strong>
          <div class="small text-muted">${quest.description}</div>
          <div class="small">XP: ${typeof quest.xp === 'object' ? `RT ${quest.xp.rt} / Quote ${quest.xp.quote}` : quest.xp}</div>
        </div>
        <div>
    `;
    if (quest.completed) {
      html += `<span class="badge bg-success">Done</span>`;
    } else {
      if (quest.type === 'RT_QUOTE') {
        html += `
          <div class="mb-2">
            <input type="text" class="form-control form-control-sm mb-1" placeholder="@handle" id="h-${quest.id}">
            <input type="url" class="form-control form-control-sm mb-1" placeholder="Paste link" id="p-${quest.id}">
            <button class="btn btn-sm btn-secondary" onclick="submitProof('${quest.id}')">Submit</button>
          </div>
        `;
      } else if (quest.type === 'VOTE_MATCHUP') {
        const options = post.matchups ? post.matchups.map(m => m.split(' vs ')).flat() : TOKENS;
        html += `
          <div class="mb-2">
            <select class="form-select form-select-sm" id="v-${quest.id}">
              ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <button class="btn btn-sm btn-secondary mt-1" onclick="submitVote('${quest.id}')">Vote</button>
          </div>
        `;
      } else if (quest.type === 'READ_MOOD') {
        html += `<button class="btn btn-sm btn-secondary" onclick="completeRead('${quest.id}')">Got it</button>`;
      }
    }
    html += `</div></div>`;
    questsList.innerHTML += html;
  });

  // Prediction stub
  const predDiv = document.getElementById('mvp-prediction');
  const pred = state.prediction;
  if (pred.resultsRevealed) {
    predDiv.innerHTML = `<p>Next week winner: <strong>${pred.winner}</strong></p>`;
  } else if (pred.userVote) {
    predDiv.innerHTML = `<p>You voted: <strong>${pred.userVote}</strong></p>`;
  } else {
    predDiv.innerHTML = `
      <div class="mb-2">Vote for next week's dominant emotion:</div>
      <select class="form-select form-select-sm" id="mvp-vote-select">
        ${TOKENS.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <button class="btn btn-sm btn-primary mt-2" onclick="submitPrediction()">Submit</button>
    `;
  }

  // Leaderboard
  const leaderboardBody = document.getElementById('mvp-leaderboard-body');
  renderLeaderboard(state.leaderboard, leaderboardBody);

  const searchEl = document.getElementById('mvp-leaderboard-search');
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      const term = this.value.toLowerCase();
      const filtered = state.leaderboard.filter(u => u.username.toLowerCase().includes(term));
      renderLeaderboard(filtered, leaderboardBody);
    });
  }

  // Expose functions
  window.submitProof = function(questId) {
    const proof = document.getElementById(`p-${questId}`).value.trim();
    if (!proof) { alert('Paste link'); return; }
    const handle = document.getElementById(`h-${questId}`).value.trim();
    const st = loadState();
    const q = st.quests.find(q => q.id === questId);
    if (q) { q.completed = true; q.proof = { type:'link', url: proof, handle }; saveState(st); alert('Submitted!'); location.reload(); }
  };
  window.submitVote = function(questId) {
    const vote = document.getElementById(`v-${questId}`).value;
    const st = loadState();
    st.prediction.votes[vote] = (st.prediction.votes[vote]||0)+1;
    st.prediction.userVote = vote;
    const q = st.quests.find(q => q.id === questId);
    if (q) { q.completed = true; q.vote = vote; }
    saveState(st); alert('Vote recorded'); location.reload();
  };
  window.completeRead = function(questId) {
    const st = loadState(); const q = st.quests.find(q => q.id === questId);
    if (q) { q.completed = true; saveState(st); alert('Done'); location.reload(); }
  };
  window.submitPrediction = function() {
    const vote = document.getElementById('mvp-vote-select').value;
    const st = loadState();
    st.prediction.votes[vote] = (st.prediction.votes[vote]||0)+1;
    st.prediction.userVote = vote;
    saveState(st); alert('Vote submitted'); location.reload();
  };
});

function prizeForRank(rank) {
  // MVP/demo schedule. Replace with real payouts before launch.
  if (rank === 1) return 1000;
  if (rank === 2) return 500;
  if (rank === 3) return 300;
  if (rank <= 10) return 100;
  if (rank <= 50) return 25;
  if (rank <= 100) return 10;
  return 0;
}

function renderLeaderboard(list, tbody) {
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(u => {
    const tr = document.createElement('tr');
    const prize = prizeForRank(u.rank);
    // Support both layouts: old (Activity/Holder/WeeklyScore) and new (WeeklyScore/Prize)
    const wantsPrizeOnly = tbody.closest('table')?.querySelectorAll('thead th').length === 4;

    if (wantsPrizeOnly) {
      tr.innerHTML = `
        <td>${u.rank}</td>
        <td>${u.username}</td>
        <td class="text-end"><strong>${u.total.toLocaleString()}</strong></td>
        <td class="text-end">${prize ? prize.toLocaleString() : '—'}</td>
      `;
    } else {
      tr.innerHTML = `
        <td>${u.rank}</td>
        <td>${u.username}</td>
        <td class="text-end">${u.activityScore.toLocaleString()}</td>
        <td class="text-end">${u.holderScore.toLocaleString()}</td>
        <td class="text-end"><strong>${u.total.toLocaleString()}</strong></td>
      `;
    }
    tbody.appendChild(tr);
  });
}
