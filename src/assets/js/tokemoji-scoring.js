/**
 * Tokemoji Prediction Market — scoring (vanilla JS, frozen spec).
 * Port of tokemoji-predict/src/lib/scoring.ts
 *
 * Per side (UP and DOWN scored independently):
 *   exact position hit:  #1 = 100, #2 = 70, #3 = 50
 *   in actual top3 but wrong position: 30
 *   not in top3: 0
 * Max per side 220, max day 440.
 * Perfect day (all 6 exact) bonus: +60  => 500.
 * Streak multiplier: 1 + 0.1 * (streakDays - 1), capped at 2.0.
 * Weekly rounds: same rules, final result x3.
 */
(function (global) {
  'use strict';

  const POSITION_POINTS = [100, 70, 50];
  const WRONG_POSITION_POINTS = 30;
  const PERFECT_DAY_BONUS = 60;
  const STREAK_CAP = 2.0;
  const WEEKLY_MULTIPLIER = 3;

  const EMOTIONS = [
    'greed', 'fear', 'good', 'evil', 'love', 'hate',
    'mad', 'sad', 'lol', 'omg', 'happy', 'like'
  ];

  const EMOTION_META = {
    greed:  { label: 'Greed',  code: 'GREED',  color: '#22c55e' },
    fear:   { label: 'Fear',   code: 'FEAR',   color: '#a855f7' },
    good:   { label: 'Good',   code: 'GOOD',   color: '#3b82f6' },
    evil:   { label: 'Evil',   code: 'EVIL',   color: '#dc2626' },
    love:   { label: 'Love',   code: 'LOVE',   color: '#ec4899' },
    hate:   { label: 'Hate',   code: 'HATE',   color: '#991b1b' },
    mad:    { label: 'Mad',    code: 'MAD',    color: '#f97316' },
    sad:    { label: 'Sad',    code: 'SAD',    color: '#6366f1' },
    lol:    { label: 'LOL',    code: 'LOL',    color: '#facc15' },
    omg:    { label: 'OMG',    code: 'OMG',    color: '#06b6d4' },
    happy:  { label: 'Happy',  code: 'HAPPY',  color: '#84cc16' },
    like:   { label: 'Like',   code: 'LIKE',   color: '#14b8a6' },
  };

  function rankByChange(changes) {
    return changes
      .slice()
      .sort(function (a, b) {
        return (b.changePct - a.changePct) || (b.volume - a.volume);
      })
      .map(function (c) { return c.token; });
  }

  function scoreSide(picks, actualTop3) {
    var points = 0;
    var exactHits = 0;
    picks.forEach(function (pick, i) {
      if (actualTop3[i] === pick) {
        points += POSITION_POINTS[i];
        exactHits += 1;
      } else if (actualTop3.indexOf(pick) !== -1) {
        points += WRONG_POSITION_POINTS;
      }
    });
    return { points: points, exactHits: exactHits };
  }

  function streakMultiplier(streakDays) {
    if (streakDays <= 1) return 1;
    return Math.min(STREAK_CAP, 1 + 0.1 * (streakDays - 1));
  }

  function scoreRound(upPicks, downPicks, ranking, streakDays, weekly) {
    weekly = weekly || false;
    var actualUp = ranking.slice(0, 3);
    var actualDown = ranking.slice().reverse().slice(0, 3);

    var up = scoreSide(upPicks, actualUp);
    var down = scoreSide(downPicks, actualDown);

    var perfect = up.exactHits === 3 && down.exactHits === 3;
    var base = up.points + down.points + (perfect ? PERFECT_DAY_BONUS : 0);
    var mult = streakMultiplier(streakDays);
    var final = Math.round(base * mult * (weekly ? WEEKLY_MULTIPLIER : 1));

    return { base: base, perfect: perfect, streakMultiplier: mult, final: final,
             upPoints: up.points, downPoints: down.points };
  }

  // ---- Deterministic mock prices (for TEST SEASON) ----
  function xfnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function splitmix32(seed) {
    return function () {
      seed = (seed + 0x9e3779b9) >>> 0;
      var t = Math.imul(seed ^ (seed >>> 16), 0x21f0aaad);
      t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getMockChanges(dateStr) {
    return EMOTIONS.map(function (token) {
      var seed = xfnv1a(token + ':' + dateStr);
      var rng = splitmix32(seed);
      var changePct = (rng() - 0.45) * 35; // -15.75% to +19.25%
      var volume = Math.floor(rng() * 100000) + 1000;
      return { token: token, changePct: Math.round(changePct * 100) / 100, volume: volume };
    });
  }

  global.TokemojiScoring = {
    EMOTIONS: EMOTIONS,
    EMOTION_META: EMOTION_META,
    POSITION_POINTS: POSITION_POINTS,
    WRONG_POSITION_POINTS: WRONG_POSITION_POINTS,
    PERFECT_DAY_BONUS: PERFECT_DAY_BONUS,
    STREAK_CAP: STREAK_CAP,
    WEEKLY_MULTIPLIER: WEEKLY_MULTIPLIER,
    rankByChange: rankByChange,
    scoreSide: scoreSide,
    streakMultiplier: streakMultiplier,
    scoreRound: scoreRound,
    getMockChanges: getMockChanges,
  };
})(window);
