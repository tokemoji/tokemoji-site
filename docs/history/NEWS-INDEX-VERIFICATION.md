# News / original index / market pair preview verification

Preview: https://tokemoji-v1-polish.vercel.app
Deployment: https://tokemoji-v1-polish-o10uumu22-tmojis-projects.vercel.app
Dedicated project: prj_LPewQO3TofsIXBxNi0ZzqbzVsKH8

## Executed checks
- npm run build: exit 0 (also run by deploy_preview.py).
- node --test scripts/market-pairs.test.cjs: 8 passed, 0 failed.
- Original market dashboard HTML section compared with tokemoji-site: identical.
- Original source and production deployment were not targets of this work.
- Desktop 1280px and mobile 390px browser visual inspection: hero, pair cards, original index. No document horizontal overflow; all 12 rows present; no broken index images.
- Instrumented mobile browser: zero captured JavaScript errors after removing legacy MVP scripts from Gulp bundle.
- Next headline, pause, pair mode switching, index sorting, details dialog exercised.
- Isolated browser test fixture (never published or written to backend): 300/100 capitalization produced 75%; +20/-20 daily returns produced +40 percentage-point spread and 60% normalized relative share. Restored real snapshot immediately.
- Deployed details dialog shows actual sample quote; history request returned no recorded history for selected sample/range.
- Final deployed sort button verified active blue after its CSS transition completes.

## Data limitation (not hidden)
Live API verification returned quotes for 2 of 12 borrowed sample mappings (LOL and LIKE). Other rows and the three pairs show unavailable data, not synthetic prices or a fabricated 50/50 result. Dominance is labeled as share of available sample capitalization. No mint mappings, database schema, or remote records changed. Full quote/history coverage remains a backend/sample-mapping issue.

## Scope
This verifies the requested visual/front-end revision, not end-to-end authentication, forecast settlement, reward payment or token launch readiness. Hero headlines and up/down reactions are explicitly fictional demonstrations. Approved corrected coin graphics are used; original v1 layout remains the base.
