# Tokemoji — przekazanie do Codexa na Macu

Gałąź `handoff/codex-mac` zawiera aktualny lokalny frontend v1 i dokumentację.
Nie została scalona do `main` ani wdrożona na produkcję w ramach przekazania.

## Start

Wymagany Node.js z npm (zalecany Node 22 LTS), Git. W katalogu repo:

```sh
npm ci
npm test
npm run build
npm run preview
```

Otwórz http://localhost:4291. `npm start` uruchamia istniejący Gulp/BrowserSync.
`npm run preview` serwuje już zbudowany dist, nie obserwuje zmian.
Nie uruchamiaj `init-tokens`, `poller` ani `aggregator` podczas zwykłego QA.

## Dokumentacja

- [Zasady agenta](AGENTS.md)
- [Architektura i kontekst](docs/PROJECT-HANDOFF.md)
- [Stan i blokery](docs/CURRENT-STATE.md)
- [Dostępy, integracje, bezpieczne preview](docs/INTEGRATIONS.md)
- [Media i pochodzenie](docs/MEDIA-CATALOG.md)
- [Następne zadanie](NEXT-TASK.md)
- [Porównanie plików przed przeniesieniem](docs/repo-comparison.json)
- [Weryfikacja handoffu](docs/HANDOFF-VERIFICATION.md)

Istniejący podgląd: https://tokemoji-v1-polish.vercel.app
Jego obecność nie oznacza, że najnowsze niewdrożone assety są już na serwerze.
Repo bazuje na zakupionym/używanym szablonie Memeworld; zachowano istniejące
atrybucje w package.json. Publiczność repo nie oznacza prawa do dalszej
redystrybucji szablonu poza warunkami jego licencji.
