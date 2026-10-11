# Casualci

Next.js prodavnica za Vercel. Naslovna, katalog, stranice proizvoda, kontakt i informativne stranice su odvojene rute. Kupci poručuju bez naloga, uz plaćanje pouzećem. Porudžbina se proverava na serveru i šalje na privatni Discord webhook. Nema ChatGPT skladišta ni baze podataka.

## Pokretanje

Potrebni su Node.js 22.13+ i npm. Pokreni `npm install`, zatim `npm run dev`. Za slanje porudžbina u `.env.local` postavi `DISCORD_ORDER_WEBHOOK`. Ta datoteka se ne dodaje u Git. Na Vercelu promenljivu postavi kao Secret za Production i ponovo objavi projekat.

## Stranice

- `/` — kratka naslovna sa izdvojenim komadima.
- `/kolekcija` — ceo katalog, pretraga, filteri, sortiranje i korpa.
- `/product/[id]` — detalji i veličine artikla.
- `/o-nama`, `/kontakt` i `/informacije/*` — informacije za kupce.

Katalog je u `public/catalog.js`; isti podaci se koriste pri serverskoj proveri cena. Fotografije proizvoda su ilustrativne. Četiri velike PNG slike zamenjene su WebP datotekama, sa oko 8,5 MB na oko 318 KB ukupno. Katalog ima serverom ispisane kartice, tako da proizvodi nisu prazni dok JavaScript još nije učitan.

## Obavezno pre punog komercijalnog rada

Korisnik je potvrdio da delatnost još nije registrovana i da poručivanje za sada ostaje aktivno. Tekstovi na sajtu otvoreno navode ovaj status. **Oni sami po sebi ne čine prodaju pravno usklađenom.** Potrebno je proveriti registraciju delatnosti, objaviti puno poslovno ime, adresu, matični broj i PIB, dostaviti adresu za povrat, utvrditi troškove i rokove dostave i urediti čuvanje i prenos ličnih podataka iz Discord-a. Za te tačke zatraži stručno pravno/računovodstveno mišljenje pre nastavka prodaje.

Sajt trenutno nema evidenciju narudžbina van Discord-a, automatsko stanje zaliha niti automatski obračun poštarine. Zatraži fotografije i podatke o stvarnim artiklima pre nego što ilustrativne prikaze predstaviš kao konkretne proizvode.
