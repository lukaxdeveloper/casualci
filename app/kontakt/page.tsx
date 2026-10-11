import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
export const metadata: Metadata = {title:"Kontakt | Casualci"};
export default function ContactPage() { return <><SiteHeader /><main id="main" className="info-page"><div className="content-shell"><p className="info-eyebrow">Kontakt</p><h1>Piši nam.</h1><p className="info-lead">Za pitanja o artiklima, porudžbinama, dostavi i reklamacijama.</p><div className="contact-panel"><div><span>Email</span><a href="mailto:casualcirs@proton.me">casualcirs@proton.me</a></div><div><span>Kontakt osoba</span><strong>Nikola Zivkovic</strong></div><div><span>Adresa za kontakt i povrat</span><p>Još nije dostavljena. Zatraži je emailom pre slanja porudžbine ili povrata.</p></div></div><p>Možeš pogledati i <Link href="/informacije/dostava-i-povrat">informacije o dostavi, odustanku i reklamacijama</Link>.</p></div></main><SiteFooter /></>; }
