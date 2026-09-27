# Aktualny stan przekazania

## Skąd pochodzi wersja
Remote main przy porównaniu: 06cb3c4 — poprawione zatwierdzone monety.
Źródło aktualizacji: lokalny katalog tokemoji-v1-polish, wcześniej poza Git.
Porównanie SHA-256: docs/repo-comparison.json (stan przed selekcją plików).
Nie jest to lista wszystkich wysłanych plików: logi, środowiskowe deployery
oraz maszynowe artefakty celowo pominięto. Zachowano repo-only verifier monet.

## Istnieje
- 8s film Seedance 2.0: AI cures cancer / aliens demand rent / billionaires
  cancel money. Film, poster, eksport z overlayem i źródła renderowania są w repo.
- Reklamowe karty par z wygenerowanym tłem Higgsfield.
- Indeks i mini-gauges, jawne braki notowań, testy obliczeń i forecast UI.
- 12 oryginalnych standalone WebM i poprawione animowane coiny.
- NOWE pliki *-animated.webp i *-coin-animated.webp wygenerowano jako możliwą
  alternatywę dla problemów WebM. Nie wpięto ich jeszcze do sześciu reakcji.

## NIE ukończono
- Czterech nowych filmów 1, 2, A, B — żaden nie został wygenerowany.
- Sprawdzenia, czy Higgsfield oferuje Seedance 2.5 i minimalne 3 sekundy.
- Sześciu dolnych emotek, ciągłych cen i powiększania/pomniejszania.
- Naprawy zgłoszonej niewidoczności overlayu oraz wąskiego kadru landscape.

W Chromium dwa aktualne WebM ładowały się z readyState=4 i videoWidth=380;
nie dowodzi to działania na telefonie użytkownika. Nie potwierdzono uszkodzenia
plików. Podejrzenie kompatybilności WebM wymaga testu Safari/fallbacku.
Zidentyfikowano ograniczanie wysokości filmu przez viewport/flex; mobile CSS
zmniejsza dodatkowo widoczny obszar video. To wymaga poprawy i wizualnego QA.

## Usługi podczas audytu przekazania
Management API zwróciło INACTIVE dla lgjiiebmzpgamdrdzqvq,
ssamtadrdxsvvdtclcmz i ywhbuvhstacuuqiznjfg. To odczyt, nie wykonano restore.
Brak rynku może wynikać z nieaktywnej usługi — nie fabrykuj wartości.
Dawne wyniki 2/12 wycen i HTTP 200 są historyczne, nie stanem gwarantowanym.

Higgsfield na serwerze: CLI zaktualizowano do 1.1.26, OAuth wygasł, próby
logowania timeout. Tymczasowy relay zakończył się. Nic nie renderuje w tle.
Użytkownik ma działające połączenie Higgsfield na Macu; zweryfikuj je tam.

Auth email/X, złożenie predykcji i rozliczenie nie mają pełnego aktualnego
E2E. Nie wysyłano maili ani testowych zapisów do produkcyjnej bazy.
