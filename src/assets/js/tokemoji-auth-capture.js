/**
 * Tokemoji Auth Capture — runs on EVERY page.
 * Detects Supabase auth tokens in URL hash (from magic link / OAuth redirect),
 * stores the session via Supabase client, then redirects to /predict.html.
 * This fixes the "magic link goes to index.html" problem.
 */
(function () {
  'use strict';

  // Quick check: is there an access_token in the hash?
  if (!window.location.hash || window.location.hash.indexOf('access_token') === -1) {
    return; // no auth callback on this page, nothing to do
  }

  // Need config + vendor
  if (!window.TOKEMOJI_SUPABASE_URL || !window.TOKEMOJI_SUPABASE_ANON_KEY ||
      !window.supabase || !window.supabase.createClient) {
    return;
  }

  // Initialize client and let it capture the session from the hash
  var client = window.supabase.createClient(
    window.TOKEMOJI_SUPABASE_URL,
    window.TOKEMOJI_SUPABASE_ANON_KEY
  );

  // onAuthStateChange fires when the client parses the hash and stores the session
  client.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_IN' && session) {
      // Clean the URL hash and redirect to predict page
      var target = window.location.origin + '/predict.html';
      window.location.replace(target);
    }
  });

  // Also try getSession as fallback — the client may have already parsed the hash
  client.auth.getSession().then(function (result) {
    if (result.data && result.data.session) {
      var target = window.location.origin + '/predict.html';
      window.location.replace(target);
    }
  });
})();
