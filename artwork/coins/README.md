# Approved Tokemoji coin artwork

The canonical coin images are `src/assets/img/emojis/<emotion>-coin.webp`.
All twelve use the corrected **TOKEMOJI** brand ring, WITHOUT a leading dollar sign.

- Original approved PNGs are preserved in `artwork/coins/*-coin-clean.png`.
- `manifest.json` records the SHA-256 of every original and deployed WebP.
- The standalone character assets `<emotion>.webp` / `<emotion>.webm` are unchanged.
- Old `<emotion>-coin.webm` animations were removed because their frames contain rejected branding. Do not restore them or use a coin WebM fallback. Use the approved static WebP until an approved animation exists.
- Do not generate replacement characters or redraw their features. Dollar eyes on GREED and symbols on HATE are intentional character details, NOT the rejected dollar sign before TOKEMOJI.

Run `npm run verify:artwork`. The standard `npm run build` runs this check first.
Changing artwork requires explicit approval and an accompanying manifest update; never regenerate this manifest merely to make rejected graphics pass validation.
