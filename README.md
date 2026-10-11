# Casualci

Next.js prodavnica za Vercel. Početna stranica prikazuje kolekciju, a svaki artikal ima zasebnu stranicu. Kupci poručuju bez naloga, uz plaćanje pouzećem. Server proverava stavke i cene iz kataloga i šalje zahtev za porudžbinu na Discord webhook. Nema baze podataka ni ChatGPT skladišta.

## Lokalno pokretanje

Potrebni su Node.js 22.13+ i npm.

1. `npm install`
2. Napravi `.env.local` sa `DISCORD_ORDER_WEBHOOK=<tvoj webhook>` (primer je u `.env.example`). Ova datoteka je ignorisana u Git-u.
3. `npm run dev` i otvori `http://localhost:3000`.

Bez webhook promenljive sajt se prikazuje, ali server ne prihvata porudžbine. `npm run build` pravi produkcioni build.

## Vercel

Uvezi ovaj folder kao Next.js projekat. U **Project Settings → Environment Variables** dodaj `DISCORD_ORDER_WEBHOOK` kao osetljivu serversku promenljivu za Production (i Preview ako želiš probne porudžbine). Webhook nikada ne stavljaj u promenljivu sa `NEXT_PUBLIC_` prefiksom. Zatim deployuj projekat. `casualci.rs` poveži kroz Vercel Domains i DNS svog registrara.

Vercel projekat i domen nisu povezani iz ovog repozitorijuma. Postojeći privatni Sites pregled je ranija verzija; ovaj kod se tamo ne objavljuje.

## Katalog i porudžbine

- `public/catalog.js` je jedini spisak artikala, veličina i cena. Njime se služe početna stranica, stranice proizvoda i serverska provera porudžbine.
- Fotografije proizvoda i kampanje su ilustrativne. Logotipi brendova su autentični; njihovi izvori su navedeni u prethodnoj verziji projekta. Pre javne prodaje zameni ilustracije fotografijama stvarnih artikala.
- Korpa i omiljeni artikli su samo u kupčevom `localStorage` radi udobnosti. Server ne čuva lične podatke. Discord poruka je jedini trajni zapis primljenog zahteva za porudžbinu.
- Potvrda kupcu nastaje samo ako Discord potvrdi prijem. Ako Discord ne radi, kupac vidi grešku i može da pokuša ponovo ili piše na `casualcirs@proton.me`.
- Poštarina nije uključena u zbir artikala; dostupnost i poštarina potvrđuju se ručno pre slanja.

## Pre javnog lansiranja

Potrebni su stvarni proizvodi, cene i fotografije, potvrda zaliha, podaci trgovca (naziv, adresa, PIB), kontakt telefon, pravila dostave, reklamacija i povrata. Za automatsku rezervaciju zaliha, istoriju i upravljanje porudžbinama preko sajta biće potrebna baza podataka kojom vlasnik upravlja. Trenutna verzija šalje porudžbine na Discord bez te evidencije.
