# Kontekst i architektura

## Produkt
Tokemoji to 12 emocji: LOVE, LOL, GOOD, EVIL, GREED, FEAR, MAD, HATE, OMG,
HAPPY, SAD, LIKE. News ma wywoływać czytelną reakcję emocji. Strona łączy
filmowe hero, reklamę trzech rywalizacji, indeks rynku i daily forecast.

Sentiment.guru to osobny, powiązany projekt analizy newsów przez Guru:
12 emocji, horyzonty 24h/7d i pary Fear/Greed, Good/Evil, Love/Hate.
Strategia porzuciła tradycyjne aktywa. Nie zakładaj, że integracja Guru jest
ukończona. Docelowe nagrody z creator fees Pump.fun są kierunkiem produktu,
nie dowodem istniejącej wypłaty lub zatwierdzonych parametrów.

## Kod
- HTML/Panini w src/pages, src/layouts, src/partials; style SCSS i Bootstrap.
- gulpfile.js buduje dist. Custom JS kopiowany oddzielnie; kolejność tagów
  w src/layouts/single-page.html ma znaczenie.
- app.js zawiera legacy funkcje rynku, wykresów, WS i inne sekcje. Samo
  usunięcie osobnego tagu script nie usuwa legacy kodu z bundla app.js.
- tokemoji-cinema-core.js: matematyka osi czasu istniejącego filmu.
- tokemoji-hero.js: obecne trzy newsy, scroll seek, pauza, DWIE reakcje.
- tokemoji-battles.js: reklamowe karty z Higgsfield i linki do gauges.
- tokemoji-market.js, tokemoji-sample-market.js: sample data i obliczenia par.
- tokemoji-index-restore.js: oryginalny indeks, sortowanie, karty i mini-gauges.
- tokemoji-pair-indicators.js: General (udział kapitalizacji), Last 24h
  (porównanie procentowych zmian, różnica w punktach procentowych).
- tokemoji-motion-assets.js: kontrola ruchu i widoczności oryginalnych WebM.
- tokemoji-config.js, tokemoji-auth.js, tokemoji-auth-capture.js,
  tokemoji-predict.js, tokemoji-scoring.js: auth/forecast/leaderboard.

## Backend
Dwa różne cele w kodzie: MARKET lgjiiebmzpgamdrdzqvq i AUTH/PREDICT
ssamtadrdxsvvdtclcmz. Nie zamieniaj kluczy między nimi. Drugi ref jest
równocześnie projektem Sentiment.guru — szerokie zmiany mogą dotknąć inną stronę.
W repo są źródła czterech edge functions: get-tokens, get-token-chart,
get-market-summary, get-sol-price; to nie jest kompletny eksport backendu.
Nie zakładaj identyczności wdrożonych funkcji i źródeł w repo.

backend/services ma poller Moralis → price_ticks i agregator czasowy;
backend/init-tokens.js zapisuje konfigurację do bazy. Nie uruchamiać przy
handoffie. Dokumentacja starych tabel lub scoringu nie dowodzi ich wdrożenia.
Forecast wybiera 3 UP + 3 DOWN bez duplikowania emocji między stronami.
Scoring ma istniejącą implementację; nie modyfikuj ekonomii w ramach filmów.

## Czego nie przenosimy jako aktywnej bazy
Odrzucony Reactowy v2 nie zastępuje v1. Jego ilustracje mogą być archiwalnym
materiałem. Nie kopiujemy node_modules, .env, sesji OAuth, prywatnej pamięci
Hermesa, kontenera, dumpów bazy ani treści innych prywatnych repozytoriów.
