/**
 * Tokemoji Auth — Supabase client-side auth (X OAuth + magic link).
 * Works on static pages. Requires supabase.js vendor already loaded.
 *
 * Usage:
 *   <script src="assets/js/vendor/supabase.js"></script>
 *   <script src="assets/js/tokemoji-auth.js"></script>
 *   TokemojiAuth.init();  // reads NEXT_PUBLIC_SUPABASE_URL from window
 */
(function (global) {
  'use strict';

  var supabase = null;
  var config = {
    url: window.TOKEMOJI_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: window.TOKEMOJI_SUPABASE_ANON_KEY || 'placeholder',
  };

  function init() {
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('[TokemojiAuth] supabase.js vendor not loaded');
      return false;
    }
    if (config.url === 'https://placeholder.supabase.co') {
      console.warn('[TokemojiAuth] Supabase not configured — running in stub mode');
      return false;
    }
    supabase = window.supabase.createClient(config.url, config.anonKey);
    return true;
  }

  function isReady() {
    return supabase !== null;
  }

  /** Sign in with X (Twitter) OAuth. Redirects to X, then back. */
  async function signInWithX() {
    if (!supabase) { alert('Auth not configured yet.'); return; }
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: window.location.origin + '/predict.html' }
    });
  }

  /** Sign in with magic link (email). */
  async function signInWithMagicLink(email) {
    if (!supabase) { alert('Auth not configured yet.'); return false; }
    var { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { redirectTo: window.location.origin + '/predict.html' }
    });
    if (error) { console.error(error); return false; }
    return true;
  }

  /** Sign out. */
  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    window.location.reload();
  }

  /** Get current session. Returns null if not logged in. */
  async function getSession() {
    if (!supabase) return null;
    var { data } = await supabase.auth.getSession();
    return data.session || null;
  }

  /** Get current user's profile (handle, avatar, wallet). */
  async function getProfile() {
    var session = await getSession();
    if (!session) return null;
    var { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    return data;
  }

  /** Submit a prediction (3 UP + 3 DOWN) for the current open round. */
  async function submitPrediction(roundId, upPicks, downPicks, fingerprint) {
    var session = await getSession();
    if (!session) { alert('Please sign in first.'); return { error: 'not_authenticated' }; }
    if (upPicks.length !== 3 || downPicks.length !== 3) {
      return { error: 'Need exactly 3 UP and 3 DOWN picks' };
    }

    var { error } = await supabase.from('predictions').insert({
      round_id: roundId,
      user_id: session.user.id,
      up_picks: upPicks,
      down_picks: downPicks,
      fingerprint: fingerprint || null,
    });

    if (error) {
      if (error.code === '23505') return { error: 'already_submitted' };
      console.error(error);
      return { error: error.message };
    }
    return { ok: true };
  }

  /** Get the current user's prediction for a round. */
  async function getMyPrediction(roundId) {
    var session = await getSession();
    if (!session) return null;
    var { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('round_id', roundId)
      .eq('user_id', session.user.id)
      .maybeSingle();
    return data;
  }

  /** Get leaderboard (all-time). */
  async function getLeaderboard(limit) {
    if (!supabase) return null;
    var { data } = await supabase
      .from('user_stats')
      .select('user_id, total_points, daily_streak, perfect_days, rounds_played, profiles!inner(handle, avatar_url)')
      .order('total_points', { ascending: false })
      .limit(limit || 100);
    return data || [];
  }

  /** Get the current open round. */
  async function getCurrentRound() {
    if (!supabase) return null;
    var { data } = await supabase
      .from('rounds')
      .select('*')
      .eq('status', 'open')
      .eq('kind', 'daily')
      .order('opens_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }

  /** Auth state change listener. */
  function onAuthStateChange(callback) {
    if (!supabase) return;
    supabase.auth.onAuthStateChange(function (event, session) {
      callback(event, session);
    });
  }

  global.TokemojiAuth = {
    init: init,
    isReady: isReady,
    signInWithX: signInWithX,
    signInWithMagicLink: signInWithMagicLink,
    signOut: signOut,
    getSession: getSession,
    getProfile: getProfile,
    submitPrediction: submitPrediction,
    getMyPrediction: getMyPrediction,
    getLeaderboard: getLeaderboard,
    getCurrentRound: getCurrentRound,
    onAuthStateChange: onAuthStateChange,
  };
})(window);
