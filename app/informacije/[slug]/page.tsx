import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { CookieSettings } from "../../cookie-notice";

const pages = {
  "uslovi-kupovine": { title: "Uslovi kupovine", sections: [
    ["Ko stoji iza sajta", "Casualci je projekat Nikole Zivkovica. Delatnost još nije registrovana. Poslovno ime, sedište, matični broj i PIB zato nisu dostupni. Kontakt: casualcirs@proton.me. Ove informacije moraju biti dopunjene nakon registracije."],
    ["Kako funkcioniše poručivanje", "Kupac bira artikal, veličinu i količinu, zatim unosi podatke za dostavu. Nakon slanja dobija broj zahteva. Dostupnost artikla i iznos dostave potvrđujemo direktno pre slanja. Ako artikal nije dostupan ili se kupac ne saglasi sa dostavom, zahtev se neće realizovati."],
    ["Cene i plaćanje", "Cene artikala prikazane su u dinarima. Dostava nije uračunata u zbir artikala i njen iznos se saopštava pre slanja. Plaćanje je pouzećem. Ne tražimo unos broja platne kartice na ovom sajtu."],
    ["Artikli i fotografije", "Fotografije proizvoda su ilustrativne i mogu odstupati od konkretnog komada. Za fotografije, stanje, sastav i mere konkretnog artikla kontaktiraj nas pre poručivanja. Nazivi i logotipi brendova pripadaju njihovim vlasnicima; Casualci nije predstavljen kao zvanična prodavnica tih brendova."],
    ["Prava kupca", "Zakonska prava potrošača, uključujući pravo na odustanak od ugovora na daljinu i reklamaciju zbog nesaobraznosti, ne ograničavaju se ovim tekstom. Detalji postupka su na stranici Dostava i povrat."],
  ] },
  "dostava-i-povrat": { title: "Dostava, odustanak i reklamacije", sections: [
    ["Dostava", "Dostavljamo na adrese u Srbiji. Tačan način, rok i trošak dostave zavise od adrese i kurirske službe i saopštavaju se kupcu pre slanja. U prikazanu cenu artikla poštarina nije uračunata."],
    ["Odustanak od kupovine na daljinu", "Potrošač po pravilu može odustati od ugovora zaključenog na daljinu u roku od 14 dana od prijema robe, bez navođenja razloga, uz zakonske izuzetke. Javi se na casualcirs@proton.me sa brojem porudžbine i izjavom o odustanku. Uputstvo za vraćanje i adresa za povrat moraju biti saopšteni pre realizacije prodaje; adresa još nije objavljena."],
    ["Povraćaj novca", "Nakon urednog odustanka novac se vraća u zakonskom roku i na način dogovoren sa kupcem u skladu sa propisima. Trošak povratne dostave saopštavamo pre poručivanja, osim kada po zakonu pada na nas. Kupac ne gubi prava zbog ovog nedovršenog obaveštenja."],
    ["Reklamacije", "Reklamaciju pošalji na casualcirs@proton.me uz broj porudžbine, opis problema i fotografije ako pomažu. Potvrdićemo prijem i odgovoriti u rokovima propisanim Zakonom o zaštiti potrošača. Prava zbog nesaobraznosti robe ne zavise od postojanja komercijalne garancije."],
  ] },
  "privatnost": { title: "Obaveštenje o privatnosti", sections: [
    ["Ko obrađuje podatke", "Kontakt za pitanja o podacima: Nikola Zivkovic, casualcirs@proton.me. Projekat još nije registrovan i poslovna adresa nije objavljena; ovaj identifikacioni podatak mora biti dopunjen."],
    ["Koje podatke prikupljamo", "Pri poručivanju primamo ime i prezime, email, telefon, adresu, grad, poštanski broj, artikle i opcionu napomenu. Korpa i izbor omiljenih čuvaju se u tvom pregledaču. Sajt ne traži podatke platne kartice."],
    ["Svrha i osnov", "Podatke iz porudžbine koristimo za obradu zahteva, kontakt sa kupcem, organizaciju dostave i rešavanje reklamacija. Osnov je preduzimanje radnji na zahtev kupca pre zaključenja ugovora i izvršenje ugovora, odnosno zakonske obaveze kada se primenjuju. Podatke ne koristimo za marketinške poruke bez posebnog osnova."],
    ["Primaoci i čuvanje", "Porudžbina se šalje na privatni Discord kanal putem serverskog webhooka. Hosting obezbeđuje Vercel. Podaci se mogu obrađivati i van Srbije, zavisno od infrastrukture tih pružalaca. Trenutno ne postoji automatski rok brisanja Discord poruka; rok čuvanja i prenos podataka su otvorene stavke koje treba urediti pre punog komercijalnog rada."],
    ["Tvoja prava", "Možeš tražiti pristup, ispravku ili brisanje podataka, ograničenje obrade i uložiti prigovor, u skladu sa zakonom. Piši na casualcirs@proton.me. Imaš pravo i da se obratiš Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti."],
  ] },
  "kolacici": { title: "Kolačići i lokalno čuvanje", sections: [
    ["Šta ovaj sajt koristi", "Casualci trenutno ne koristi analitičke ni reklamne kolačiće. Korpa se čuva u localStorage pregledača kako bi ostala dostupna pri prelasku između stranica. Informacija o izboru podešavanja čuva se u localStorage."],
    ["Opciona pogodnost", "Lista omiljenih artikala čuva se između poseta samo ako prihvatiš opcione pogodnosti. Bez tog izbora omiljeni mogu raditi tokom tekuće posete, bez trajnog čuvanja. Podešavanje možeš promeniti na ovoj stranici ili brisanjem podataka sajta u pregledaču."],
    ["Spoljni servisi", "Vercel može obrađivati tehničke podatke potrebne za isporuku sajta. Discord prima podatke tek kada pošalješ porudžbinu. Ako kasnije dodamo analitiku ili oglašavanje, pre upotrebe ćemo ažurirati ovo obaveštenje i zatražiti odgovarajući izbor."],
  ] },
} as const;

export function generateStaticParams() { return Object.keys(pages).map(slug => ({ slug })); }
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> { const {slug} = await params; return {title: `${pages[slug as keyof typeof pages]?.title || "Informacije"} | Casualci`}; }
export default async function InformationPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params; const page = pages[slug as keyof typeof pages]; if (!page) notFound();
  return <><SiteHeader /><main id="main" className="info-page"><div className="content-shell"><nav className="info-crumb" aria-label="Putanja"><Link href="/">Početna</Link><span>/</span><span>{page.title}</span></nav><h1>{page.title}</h1><p className="info-lead">Informacije za kupce i posetioce Casualci sajta. Ažurirano: 11. oktobar 2026.</p><div className="info-layout"><aside><strong>Informacije</strong><Link href="/informacije/uslovi-kupovine">Uslovi kupovine</Link><Link href="/informacije/dostava-i-povrat">Dostava i povrat</Link><Link href="/informacije/privatnost">Privatnost</Link><Link href="/informacije/kolacici">Kolačići</Link></aside><article>{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}{slug === "kolacici" && <CookieSettings />}<div className="info-note"><strong>Važno</strong><p>Casualci još nije registrovana delatnost. Tekstovi su informativni i ne mogu zameniti podatke registrovanog trgovca, proveru poslovnog modela i konačne uslove prodaje.</p></div><p>Kontakt: <a href="mailto:casualcirs@proton.me">casualcirs@proton.me</a></p></article></div></div></main><SiteFooter /></>;
}
