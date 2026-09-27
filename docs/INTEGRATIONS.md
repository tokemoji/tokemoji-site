# Integracje na Macu — bez sekretów w repo

## GitHub
Repo: https://github.com/tokemoji/tokemoji-site (PUBLICZNE).
Gałąź przekazania: handoff/codex-mac. Nie scalaj do main automatycznie.
Repo możesz klonować bez tokenu; token potrzebny do push/PR.
Fine-grained PAT: https://github.com/settings/personal-access-tokens/new
Owner tokemoji; tylko tokemoji-site; Contents Read and write, Pull requests
Read and write (jeżeli Codex tworzy PR), Metadata automatycznie read.
Krótka ważność, np. 30 dni. Nie dawaj Administration, Secrets ani wszystkich repo.
Workflow permissions dopiero jeśli użytkownik zleci zmianę GitHub Actions.
Zaloguj GitHub CLI przez `gh auth login` (browser lub bezpieczny lokalny prompt),
następnie `gh auth setup-git`. Nie wklejaj PAT do promptu, URL repo ani pliku Git.

## Vercel
Projekt podglądowy: tokemoji-v1-polish
projectId: prj_LPewQO3TofsIXBxNi0ZzqbzVsKH8
team/orgId: team_KClegZBu5HD7Whg4xRBF2aPA
Adres: https://tokemoji-v1-polish.vercel.app
Podczas odczytu API: framework=null, buildCommand=null, outputDirectory=null,
link=null. Ten projekt nie był wtedy połączony z repo GitHub. Sam push nie
zapewnia deployu. Historycznie wysyłano zbudowane pliki statyczne.

1. `npx vercel login` — lokalna autoryzacja Vercela.
2. `npx vercel link --project tokemoji-v1-polish --scope team_KClegZBu5HD7Whg4xRBF2aPA`
3. Sprawdź .vercel/project.json: projectId i orgId MUSZĄ zgadzać się powyżej.
4. `npx vercel --scope team_KClegZBu5HD7Whg4xRBF2aPA` tworzy preview (bez --prod).

vercel.json opisuje Gulp build i dist. Nie uruchamiaj deployu zanim nie
sprawdzisz diffu, testów i docelowego projektu. Nie twórz duplikatu projektu
ani nie zmieniaj ochrony wdrożeń. Dawne deployery zależne od /opt/data i
wyłączające ssoProtection celowo nie są częścią tego handoffu.

## Supabase
- MARKET: tokemoji-prod, ref lgjiiebmzpgamdrdzqvq.
- AUTH/PREDICT: sentiment-guru, ref ssamtadrdxsvvdtclcmz.
- Starszy projekt: tokemoji-database, ref ywhbuvhstacuuqiznjfg; nie wybieraj
  go domyślnie, bieżący frontend wskazuje inne refy.

`npx supabase login`, potem `npx supabase projects list` to autoryzacja i odczyt.
Przed `link` ustal konkretny backend zadania; nie linkuj w ciemno jednego refu
jako uniwersalnego. Nie odpalaj migracji, restore ani db push bez zgody.
Publiczne browser anon JWT w istniejącym kodzie nie są administracyjnymi
sekretami; ich rolę sprawdzono podczas skanu. Bezpieczeństwo wymaga RLS.
Service-role i management token NIGDY nie trafiają do przeglądarki ani Git.
.env.example zawiera same puste nazwy backendowych zmiennych. Ten projekt
nie jest Vite: nazwy VITE_* są zastane; frontend częściowo ma jawny config JS,
więc samo dodanie zmiennej .env nie oznacza automatycznego wstrzyknięcia.

## Higgsfield
Sprawdź lokalne `higgsfield --version`, pomoc, konto, listę modeli i koszt
przed płatną generacją. Nie zakładaj ID modelu Seedance 2.5 z nazwy marketingowej.
CLI 1.1.26 używa OAuth PKCE z callback localhost, nie dawnego /device.
Na Macu uruchamiaj logowanie i przeglądarkę na tym samym komputerze.
Połączenie/connector w jednej aplikacji nie gwarantuje autoryzacji CLI.
Nie kopiuj sesji z serwera ani nie umieszczaj tokenów w repo.
