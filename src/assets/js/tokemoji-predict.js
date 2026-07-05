/**
 * Tokemoji Predict — main page logic for predict.html
 * Handles: auth gate, round info, countdown, prediction form (3 UP + 3 DOWN),
 * leaderboard rendering, already-submitted state.
 */
(function (global) {
  'use strict';

  var upPicks = [];
  var downPicks = [];
  var currentRound = null;
  var myExistingPrediction = null;

  function emojiImg(token, size) {
    size = size || 48;
    var file = token.toLowerCase();
    return '<img src="assets/img/emojis/' + file + '.webp" alt="' + token +
           '" width="' + size + '" height="' + size + '" style="object-fit:contain">';
  }

  function init() {
    // TEST SEASON banner
    if (!window.TOKEMOJI_SUPABASE_URL || window.TOKEMOJI_SUPABASE_URL === 'placeholder') {
      document.getElementById('test-season-banner').classList.remove('d-none');
    }

    var ready = TokemojiAuth.init();

    if (!ready) {
      showAuthGate();
      return;
    }

    TokemojiAuth.getSession().then(function (session) {
      if (session) {
        showForecastApp();
      } else {
        showAuthGate();
      }
    });

    TokemojiAuth.onAuthStateChange(function (event, session) {
      if (session) showForecastApp();
      else showAuthGate();
    });
  }

  function showAuthGate() {
    document.getElementById('auth-gate').style.display = '';
    document.getElementById('forecast-app').style.display = 'none';
  }

  async function showForecastApp() {
    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('forecast-app').style.display = '';

    // Try to get current round from Supabase
    currentRound = await TokemojiAuth.getCurrentRound();
    if (currentRound) {
      document.getElementById('round-opens').textContent =
        new Date(currentRound.opens_at).toUTCString().slice(5, 22) + ' UTC';
      startCountdown(new Date(currentRound.locks_at));
    } else {
      document.getElementById('round-opens').textContent = 'No active round';
      document.getElementById('countdown').textContent = '—';
    }

    // Check if already submitted
    if (currentRound) {
      myExistingPrediction = await TokemojiAuth.getMyPrediction(currentRound.id);
      if (myExistingPrediction) {
        showLockedState(myExistingPrediction);
        return;
      }
    }

    buildForm();
    loadLeaderboard();
  }

  function startCountdown(lockDate) {
    function tick() {
      var now = new Date();
      var diff = lockDate - now;
      if (diff <= 0) {
        document.getElementById('countdown').textContent = 'LOCKED';
        document.getElementById('forecast-form').style.display = 'none';
        document.getElementById('forecast-locked').style.display = '';
        document.getElementById('forecast-locked').innerHTML =
          '<div class="text-center p-6"><h3 class="text-heading">Round is locked</h3>' +
          '<p class="text-muted">Settlement runs shortly. Check the leaderboard!</p></div>';
        return;
      }
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      document.getElementById('countdown').textContent =
        String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  function showLockedState(pred) {
    document.getElementById('forecast-form').style.display = 'none';
    var locked = document.getElementById('forecast-locked');
    locked.style.display = '';
    var html = '<div class="row g-3 mt-2">';
    html += '<div class="col-sm-6"><h5 class="text-success">UP Picks</h5><ol>';
    pred.up_picks.forEach(function (t) {
      html += '<li class="mb-1">' + emojiImg(t, 28) + ' ' + t.toUpperCase() + '</li>';
    });
    html += '</ol></div>';
    html += '<div class="col-sm-6"><h5 class="text-danger">DOWN Picks</h5><ol>';
    pred.down_picks.forEach(function (t) {
      html += '<li class="mb-1">' + emojiImg(t, 28) + ' ' + t.toUpperCase() + '</li>';
    });
    html += '</ol></div></div>';
    document.getElementById('locked-picks').innerHTML = html;
  }

  function buildForm() {
    var tokens = TokemojiScoring.EMOTIONS;
    var meta = TokemojiScoring.EMOTION_META;

    // Build UP slots
    var upSlots = document.getElementById('up-slots');
    upSlots.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      upSlots.innerHTML += renderSlot('up', i);
    }

    // Build DOWN slots
    var downSlots = document.getElementById('down-slots');
    downSlots.innerHTML = '';
    for (var j = 0; j < 3; j++) {
      downSlots.innerHTML += renderSlot('down', j);
    }

    // Build token pools (same 12 for both)
    var upPool = document.getElementById('up-tokens');
    var downPool = document.getElementById('down-tokens');
    upPool.innerHTML = '';
    downPool.innerHTML = '';

    tokens.forEach(function (token) {
      var m = meta[token];
      upPool.innerHTML += renderTokenBtn('up', token, m);
      downPool.innerHTML += renderTokenBtn('down', token, m);
    });

    // Wire up click handlers
    document.querySelectorAll('.token-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var side = btn.dataset.side;
        var token = btn.dataset.token;
        togglePick(side, token);
      });
    });
  }

  function renderSlot(side, index) {
    var num = index + 1;
    var color = side === 'up' ? 'success' : 'danger';
    return '<div class="col-4">' +
      '<div class="slot border border-2 border-' + color + ' border-opacity-25 rounded-3 text-center p-2" ' +
      'id="slot-' + side + '-' + index + '" data-token="" style="min-height:90px;">' +
      '<span class="badge bg-' + color + ' mb-1">#' + num + '</span>' +
      '<div class="slot-content text-muted small">Empty</div>' +
      '</div></div>';
  }

  function renderTokenBtn(side, token, meta) {
    return '<button class="btn btn-sm btn-outline-dark rounded-3 token-btn" ' +
      'data-side="' + side + '" data-token="' + token + '" ' +
      'style="min-width:64px;">' +
      emojiImg(token, 28) + '<div class="small fw-bold">' + meta.code + '</div>' +
      '</button>';
  }

  function togglePick(side, token) {
    var picks = side === 'up' ? upPicks : downPicks;
    var otherSide = side === 'up' ? downPicks : upPicks;

    // Don't allow same token on both sides
    if (otherSide.indexOf(token) !== -1) return;

    var idx = picks.indexOf(token);
    if (idx !== -1) {
      picks.splice(idx, 1);
    } else if (picks.length < 3) {
      picks.push(token);
    } else {
      return; // full
    }

    renderSlots(side);
    updateTokenButtons();
    updateSubmitButton();
  }

  function renderSlots(side) {
    var picks = side === 'up' ? upPicks : downPicks;
    var color = side === 'up' ? 'success' : 'danger';

    for (var i = 0; i < 3; i++) {
      var slot = document.getElementById('slot-' + side + '-' + i);
      if (picks[i]) {
        var m = TokemojiScoring.EMOTION_META[picks[i]];
        slot.dataset.token = picks[i];
        slot.querySelector('.slot-content').innerHTML =
          emojiImg(picks[i], 40) + '<div class="small fw-bold" style="color:' + m.color + '">' + m.code + '</div>';
        slot.classList.add('bg-' + color + '-subtle');
      } else {
        slot.dataset.token = '';
        slot.querySelector('.slot-content').innerHTML = '<span class="text-muted small">Empty</span>';
        slot.classList.remove('bg-' + color + '-subtle');
      }
    }
  }

  function updateTokenButtons() {
    document.querySelectorAll('.token-btn').forEach(function (btn) {
      var side = btn.dataset.side;
      var token = btn.dataset.token;
      var picks = side === 'up' ? upPicks : downPicks;
      var otherPicks = side === 'up' ? downPicks : upPicks;

      if (picks.indexOf(token) !== -1) {
        btn.classList.add('active', 'btn-dark');
        btn.classList.remove('btn-outline-dark');
      } else {
        btn.classList.remove('active', 'btn-dark');
        btn.classList.add('btn-outline-dark');
      }

      // Disable if on the other side
      if (otherPicks.indexOf(token) !== -1) {
        btn.setAttribute('disabled', 'disabled');
      } else {
        btn.removeAttribute('disabled');
      }
    });
  }

  function updateSubmitButton() {
    var btn = document.getElementById('submit-btn');
    btn.disabled = !(upPicks.length === 3 && downPicks.length === 3);
  }

  async function submitForecast() {
    var btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Locking…';

    if (!currentRound) {
      alert('No active round. Please try again later.');
      btn.disabled = false;
      btn.textContent = 'Lock Forecast';
      return;
    }

    var result = await TokemojiAuth.submitPrediction(
      currentRound.id, upPicks, downPicks, getFingerprint()
    );

    if (result.ok) {
      showLockedState({ up_picks: upPicks, down_picks: downPicks });
      document.getElementById('forecast-form').style.display = 'none';
    } else if (result.error === 'already_submitted') {
      alert('You already submitted a forecast for this round.');
    } else {
      alert('Error: ' + result.error);
      btn.disabled = false;
      btn.textContent = 'Lock Forecast';
    }
  }

  function getFingerprint() {
    // Simple canvas fingerprint for anti-abuse
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('tokemoji', 2, 2);
      return canvas.toDataURL().slice(-32);
    } catch (e) {
      return 'fp_' + navigator.userAgent.length + '_' + screen.width;
    }
  }

  async function loadLeaderboard() {
    var tbody = document.getElementById('leaderboard-body');
    var data = await TokemojiAuth.getLeaderboard(20);
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">' +
        'No forecasts yet. Be the first!</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(function (row, i) {
      var handle = (row.profiles && row.profiles.handle) || 'Anon';
      var avatar = (row.profiles && row.profiles.avatar_url)
        ? '<img src="' + row.profiles.avatar_url + '" width="24" height="24" class="rounded-circle me-1">'
        : '';
      var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
      return '<tr>' +
        '<td class="text-center fw-bold">' + medal + (i + 1) + '</td>' +
        '<td>' + avatar + handle + '</td>' +
        '<td class="text-center fw-bold">' + (row.total_points || 0).toLocaleString() + '</td>' +
        '<td class="text-center">🔥 ' + (row.daily_streak || 0) + '</td>' +
        '<td class="text-center d-none d-sm-table-cell">' + (row.perfect_days || 0) + '</td>' +
        '</tr>';
    }).join('');
  }

  async function sendMagicLink() {
    var email = document.getElementById('magic-email').value.trim();
    if (!email) return;
    var btn = document.getElementById('magic-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    var ok = await TokemojiAuth.signInWithMagicLink(email);
    if (ok) {
      btn.textContent = 'Sent! Check email';
      btn.classList.add('btn-success');
    } else {
      btn.textContent = 'Error';
      btn.disabled = false;
    }
  }

  // Expose for onclick handlers
  global.submitForecast = submitForecast;
  global.sendMagicLink = sendMagicLink;

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
