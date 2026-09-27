# Tokemoji — zasady dla Codexa

Przeczytaj kolejno README.md, docs/PROJECT-HANDOFF.md, docs/CURRENT-STATE.md,
docs/INTEGRATIONS.md, docs/MEDIA-CATALOG.md i NEXT-TASK.md.

- Pracuj na obecnej bazie v1 (HTML/Panini/Gulp/vanilla JS), nie zastępuj jej Reactowym v2 ani nową stroną bez zgody.
- Komunikacja po polsku. Wykonuj i weryfikuj, nie kończ na planie. Ogranicz koszt i długie pętle review. Bez delegowania frontendu do dodatkowych agentów bez zgody.
- Oryginalne postaci Tokemoji obowiązują. Małe emotki bez monet, duże z poprawną obręczą TOKEMOJI, animowane tam, gdzie możliwe. Nie używaj legacy coinów z błędnym napisem ani wygenerowanych zamienników twarzy.
- Kolorowa, komiksowa estetyka. Nie ciemny SaaS. Higgsfield/Seedance generuje sceny newsowe i tła; oryginalne tokeny nakładamy osobno.
- Pod hero reklama Greed/Fear, Good/Evil, Love/Hate z linkami do gauges przy indeksie, nie drugi komplet wskaźników.
- Newsy what-if z osobami publicznymi są satyrą, nie rzeczywistymi doniesieniami ani autentycznymi cytatami. Wygenerowane klipy bez napisów, branding i tekst dodaje frontend.
- Ceny w hero są jawnie ilustracyjne. Indeks używa realnych danych cudzych testowych mintów; braki pokazuj jako braki. Minty NIE są prawdziwymi kontraktami Tokemoji, bez oficjalnych linków kupna.
- Forecast/predictions, punkty i leaderboard: nie używaj języka Play/bet. Nie obiecuj niezatwierdzonych nagród ani tokenomiki.
- Nie ruszaj main, domen produkcyjnych, Sentiment.guru ani tokemoji-predict bez zgody. Publikuj wyłącznie preview po weryfikacji docelowego projectId.
- Nie zapisuj sekretów w Git, logach ani odpowiedziach. GitHub PAT nie daje uprawnień do Vercela/Supabase. Nie pobieraj cudzych sesji OAuth z Hermesa.
- Nie odpalaj pollera, init-tokens, migracji, wysyłek email, testowych predykcji ani przywracania Supabase bez uzgodnienia. To operacje na zdalnych danych, nie testy jednostkowe.
- npm ci; npm test; npm run build. Testuj desktop, mobile portrait i landscape; media muszą rzeczywiście się ładować. Sam build nie dowodzi działania logowania lub bazy.
- Aktualny handoff ma pierwszeństwo przed docs/history i starymi README. Historyczne raporty to wyniki z tamtej chwili, nie gwarancja aktualnego stanu.
