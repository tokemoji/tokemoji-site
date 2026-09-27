# Następne zadanie: cztery newsy i sześć reakcji

Użytkownik wybrał 1, 2, A, B. Wszystkie to wyraźnie oznaczona satyra WHAT IF,
nie prawdziwe wiadomości. Styl: oryginalna komiksowa kreskówka, grube kontury,
żywe płaskie kolory, przesadna mimika; inspiracja sitcomową animacją.
Wcześniejszy prompt wymieniający serial dostał ip_detected: stosuj własne
postaci/scenografię, nie obchodź ograniczeń usługi.

## Klipy
Higgsfield, Seedance 2.5 jeśli faktycznie dostępny, 720p, 16:9, osobno cztery
klipy możliwie 3s. Sprawdź minimum i koszt. Jeśli minimum większe, wybierz
najkrótszy obsługiwany wariant i sensownie zmontuj do około 3s bez ucinania
puenty; zapisz długość generacji i końcową. Jeśli model niedostępny, zgłoś
blokadę zamiast po cichu używać innego. Bez napisów, liter, logotypów,
watermarków wygenerowanych w scenie. Dół kadru spokojniejszy dla overlayu.

1. MUSK — reklamy we śnie. Krótka wersja: romantyczny sen zostaje przerwany
   przez Cybertruck wjeżdżający między parę; karykatura Muska prezentuje auto.
   Nie próbuj pokazać przycisku Premium tekstem: headline dodamy frontendem.
   Headline roboczy: MUSK PUTS ADS IN YOUR DREAMS.
2. TRUMP — cła na kosmitów. UFO przy szlabanie, karykatura Trumpa pokazuje
   absurdalnie długi rachunek BEZ czytelnych znaków; kosmita zawraca.
   Headline roboczy: TRUMP SLAPS TARIFFS ON ALIENS.
A. DRONY — groźny dron nad ulicą otwiera komorę; zamiast bomby wysypuje
   kwiaty, przestraszony przechodzień łapie bukiet. Bez nazwisk.
   Headline roboczy: AI TURNS WAR DRONES INTO FLOWER DELIVERY.
B. ROBOTY — robot biurowy kicha pikselami i opada na krzesło; człowiek
   z kubkiem triumfalnie przejmuje klawiaturę. Bez nazwisk.
   Headline roboczy: ROBOTS CATCH A VIRUS. HUMANS CLOCK BACK IN.

Jeżeli platforma odmówi generacji osoby publicznej, zgłoś to i uzgodnij
zmianę; nie ukrywaj zastąpienia Muska/Trumpa ogólną postacią.

## Overlay i layout
- Góra: BREAKING NEWS + headline + czytelne oznaczenie fikcyjnego what-if.
- Dół: sześć ORYGINALNYCH Tokemoji, zajmujących niewielki dolny pas.
- Ceny zmieniają się płynnie także podczas oglądania bez scrollowania.
- Wzrost => emotka delikatnie większa, spadek => mniejsza; bez zasłaniania
  akcji. Zmiana newsa zmienia kierunki reakcji spójnie z treścią.
- Cena ilustracyjna jawnie oznaczona; nie używać pozornych kursów live.
- Małe emotki bez monet, duże z zatwierdzonymi monetami.
- Wyeliminować niewidoczne WebM: obrazowy fallback niezależny od dekodera;
  dostępne animowane WebP nie są jeszcze wpięte.
- Desktop i landscape: pełny szeroki kadr, nie wąski pasek. Unikaj ściskania
  filmu do resztek wysokości viewport. Portrait również czytelny.
- Scroll przełącza sceny; kontrolki/pauza, reduced-motion i brak autoplay
  nie mogą ukrywać emotek ani pozostawiać pustego hero.

## Kryteria ukończenia
Cztery realne pliki, sprawdzone ffprobe (długość/720p), kontaktówki obejrzane,
brak wygenerowanego tekstu. Sześć widocznych reakcji, ciągła zmiana cen,
różna skala wzrost/spadek. Testy + build + media HTTP checks + screenshoty
portrait/landscape/desktop + test fallbacku (np. blokada WebM).
Przetestuj Safari jeśli dostępne. Zapisz czego nie udało się zweryfikować.
Osobny preview, nie main/produkcja. Nie deklaruj sukcesu po samym buildzie.
