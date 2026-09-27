# Katalog mediów

## Aktualne i zatwierdzone
- artwork/coins/*-coin-clean.png: 12 zatwierdzonych źródeł monet. SHA256 źródeł
  nie zmieniły się względem main; nie regeneruj ich przez AI.
- artwork/coins/manifest.json: pary source PNG / web WEBP i hashe.
- src/assets/img/emojis/{emotion}.webm: oryginalna animacja BEZ monety.
- {emotion}.webp: statyczny plakat bez monety.
- {emotion}-coin.webp: zatwierdzona statyczna moneta.
- {emotion}-coin-motion.webm: oryginalna animowana twarz na poprawnej obręczy.
- {emotion}-animated.webp i {emotion}-coin-animated.webp: NOWE obrazowe animacje,
  192px / 12fps, przygotowane do fallbacku. Nadal wymagają wpięcia i QA.
- src/assets/media/news-seedance.mp4: stary 8s film Seedance 2.0 (720p),
  trzy sceny z wcześniejszej iteracji; użytkownik chce teraz inne newsy.
- news-seedance-poster.webp: plakat filmu.
- pairs-higgsfield.webp: wygenerowane komiksowe tło reklamy par.
- artwork/exports/tokemoji-news-8s.mp4: wcześniejszy film z wypalonym overlayem;
  nie używać jako czystego tła do nowego nakładanego overlayu.
- artwork/sources: zachowane surowe materiały generacji.

## Archiwalne / nie zatwierdzone jako aktualny wygląd
artwork/archive zawiera wcześniejsze generacje, v2 i rejected-hero-*. Są
materiałem referencyjnym, nie poleceniem do podmiany obecnych postaci czy UI.
src/assets/media/*-motion-proof.png to pojedyncze kontrolne klatki compositingu.
Legacy *-coin.webm z dawnym brandingiem pozostają zakazane przez verifier.

## Narzędzia
Python + Pillow oraz ffmpeg z libvpx-vp9/libwebp/libx264 są potrzebne do
ponownego renderowania, NIE do zwykłego npm build.
`python3 scripts/render-original-motion.py` odtwarza animowane coiny z oryginałów.
`python3 scripts/render-news-export.py` eksportuje stary film z ilustracyjnymi
cenami; na Macu dobiera Arial Bold lub używa TOKEMOJI_FONT wskazującego TTF.
Uruchamianie rendererów zmienia pliki — obejrzyj diff/klatki przed commitem.

Dla nowych 4 filmów nie ma plików, job IDs ani potwierdzonego modelu 2.5.
Manifest docs/media-manifest.json zawiera ścieżki, rozmiary i SHA256 materiałów.
