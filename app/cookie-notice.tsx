"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieNotice() {
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => { try { setChoice(localStorage.getItem("casualci-preferences")); } catch { setChoice("essential"); } }, []);
  function decide(value: "essential" | "all") {
    try { localStorage.setItem("casualci-preferences", value); if (value === "essential") localStorage.removeItem("casualci-favorites"); } catch { /* unavailable storage */ }
    setChoice(value);
  }
  if (choice !== null) return null;
  return <aside className="cookie-notice" aria-label="Podešavanje lokalnog čuvanja"><div><strong>Kako čuvamo tvoje izbore</strong><p>Korpa ostaje u tvom pregledaču. Ako želiš, možemo sačuvati i omiljene komade za sledeću posetu. Ne koristimo reklamne ni analitičke kolačiće. <Link href="/informacije/kolacici">Saznaj više</Link>.</p></div><div className="cookie-actions"><button type="button" onClick={() => decide("essential")}>Samo neophodno</button><button type="button" onClick={() => decide("all")}>Sačuvaj i omiljene</button></div></aside>;
}

export function CookieSettings() {
  const [choice, setChoice] = useState("essential");
  useEffect(() => { try { setChoice(localStorage.getItem("casualci-preferences") || "essential"); } catch { /* unavailable storage */ } }, []);
  function change(value: "essential" | "all") {
    try { localStorage.setItem("casualci-preferences", value); if (value === "essential") localStorage.removeItem("casualci-favorites"); } catch { /* unavailable storage */ }
    setChoice(value);
  }
  return <div className="preference-panel" aria-label="Podešavanja lokalnog čuvanja"><p>Trenutni izbor: <strong>{choice === "all" ? "Korpa i omiljeni" : "Samo korpa"}</strong></p><button type="button" onClick={() => change("essential")}>Samo neophodno</button><button type="button" onClick={() => change("all")}>Sačuvaj i omiljene</button></div>;
}
