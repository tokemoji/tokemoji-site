# Tokemoji v1 polish — verified preview

Preview: https://tokemoji-v1-polish.vercel.app
Forecast: https://tokemoji-v1-polish.vercel.app/predict.html
Dedicated Vercel project: prj_LPewQO3TofsIXBxNi0ZzqbzVsKH8

## Executed checks
- `npm run build` succeeded (see build-preview.log).
- 12 approved coin originals converted losslessly to the canonical web paths, hashed in artwork/coins/manifest.json; all 12 exist in the build and loaded in the deployed browser.
- Custom market script excluded from app.js bundle; one sample-market section in DOM.
- Deployed index, predict, rules and hero background each returned HTTP 200 without authentication.
- Hero next-scene control changed headline, pause toggled to Resume motion.
- Desktop battle cards use sticky positioning, first card reached top 90px while next approached 180px. Mobile uses normal relative flow.
- Deployed 390px forecast: 3 UP + 3 DOWN selected, duplicate emotion across sides blocked, anonymous submit disabled. Local test additionally verified removal, replacement, and ignoring a fourth pick.
- Mobile forecast screenshot found inherited yellow-on-yellow copy and row-oriented .btn flex layout; fixed dark copy, column buttons, coin rounding; redeployed and rechecked screenshot and computed styles. All labels fit.
- Deployed hero and forecast mobile documents had no horizontal overflow. Desktop and mobile hero screenshots inspected.
- Market API returned 12 sample mappings; DexScreener quotes were populated from matching Solana base-token addresses. Missing values remain unavailable.
- Chart endpoint returned HTTP 200 with {"range":"24h","data":[]} for tested sample; UI correctly displayed no recorded history.
- Preview market tick writes disabled. No test predictions, emails, or remote database mutations submitted.

## Scope and limitations
This is a visual/interactive preview, not a production launch of the tokens or a fully verified auth/settlement backend. Original deployment and its domains were not replaced. Only index/predict/rules and public assets were uploaded; private source and credentials were not uploaded.
- Guru's last-24h scores are unavailable/empty; battle cards do not invent live percentages.
- Bound Pump.fun mints are third-party API fixtures, not official emotion tokens; no purchase links.
- X sign-in provider reported unconfigured and is disabled in UI.
- Email sign-in delivery/session capture and authenticated submissions were not tested end to end. No emails were sent for QA.
- The tested chart range has no stored history; no fabricated chart points are substituted.
