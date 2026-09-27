# Seedance cinema and original motion verification

Preview: https://tokemoji-v1-polish.vercel.app
Deployment: https://tokemoji-v1-polish-igbcgmsej-tmojis-projects.vercel.app
Working tree: tokemoji-v1-polish only; production v1 not deployed or edited.

## Generated media provenance
- Seedance 2.0 accepted job cb361572-1c48-430e-a659-6022e05d4cd3, status completed. Native 1280x720, 24fps, 8.041667 seconds; web file trimmed to 8 seconds and short-GOP H264 for scroll seeking.
- First attempt 04058b78-b95c-418e-9034-75ab30453b49 returned ip_detected with no output. Replacement uses an original cartoon direction without a named franchise.
- Higgsfield Nano Banana 2 banner job 96e3f39e-17fa-459f-9821-9deb1a8c8d3b completed; generated environment art only, no replacement Tokemoji.
- 12 large motion coins composite original standalone animations inside approved original TOKEMOJI rings. Small elements retain the original standalone WEBMs.
- Delivered full composite: artifacts/tokemoji-news-8s.mp4. ffprobe: 8.000000 seconds, 1280x720, 4,715,653 bytes. Includes original token animations and clearly labeled illustrative price changes.

## Execution / QA
- `node --test scripts/cinema.test.cjs scripts/market-pairs.test.cjs`: 13/13 pass.
- Build and dedicated Vercel deploy exit 0.
- Desktop 1280x900 screenshot inspected: real UFO film scene, sticky top 76, no overflow, legible tokens/quotes.
- Deployed video duration 8, readyState 4, autoplay running. Half-scroll yields currentTime 3.975 and ALIENS DEMAND RENT; returning to top resumes autoplay.
- Mobile 390x844 deployed screenshot inspected: actual movie framed without extreme portrait crop; stage bottom 834, no horizontal overflow. Scroll near final scene yields time 6.996747 and chapter 2.
- Chapter buttons and pause verified; pause stops all hero videos.
- Initial instrumented desktop/mobile page initialization produced no JS errors.
- All 3 promotional anchors resolve to actual gauge cards; no old .tb-card duplicate data widgets remain.
- 26 original standalone videos present in the index/gauges. Visible videos have currentTime > 0, decoded width 380, and are playing.
- General/Last 24h switches function in the original gauge cards; promotional cards are purely ads/links.
- Reduced-motion fallbacks implemented, not OS-level emulation-tested.

## Known data limitation
The market still has only 2/12 available borrowed sample quotes. No mint mappings were changed. Missing actual quotes stay missing; fictional hero prices are isolated from all API-derived index/gauge values.

## Files / reproducibility
- src/assets/js/tokemoji-cinema-core.js: pure timeline/progress helpers.
- src/assets/js/tokemoji-hero.js: sticky scroll-controlled video + overlays.
- src/assets/js/tokemoji-battles.js: promotional rivalry art cards.
- src/assets/js/tokemoji-pair-indicators.js: modes in original gauges.
- src/assets/js/tokemoji-motion-assets.js: original motion playback/fallback lifecycle.
- scripts/render-original-motion.py: original animation/ring compositing.
- scripts/render-news-export.py: full rendered downloadable film.
- Gulp copyCinemaMedia copies generated media into dist.
- Pre-change source backup: backups/pre-cinema-20260915-210821/src.
