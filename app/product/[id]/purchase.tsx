"use client";

import { useState } from "react";

export default function ProductPurchase({ item }: { item: { id: string; sizes: string[] } }) {
  const [size, setSize] = useState(""), [quantity, setQuantity] = useState(1), [error, setError] = useState("");
  function add() {
    if (!size) { setError("Izaberi veličinu pre dodavanja u korpu."); return; }
    try {
      const stored = JSON.parse(localStorage.getItem("casualci-cart") || "[]");
      const cart: { id: string; size: string; quantity: number }[] = Array.isArray(stored) ? stored : [];
      const line = cart.find(entry => entry.id === item.id && entry.size === size);
      if (line && line.quantity + quantity > 10) { setError("Najviše 10 komada po veličini."); return; }
      if (line) line.quantity += quantity; else cart.push({ id: item.id, size, quantity });
      localStorage.setItem("casualci-cart", JSON.stringify(cart));
      window.location.assign("/?cart=1");
    } catch { setError("Korpa trenutno nije dostupna. Pokušaj ponovo."); }
  }
  return <div className="pdp-purchase"><div className="pdp-field-heading"><strong>Veličina</strong><span>Odaberi svoju veličinu</span></div><div className="pdp-sizes" role="group" aria-label="Veličina">{item.sizes.map(value => <button type="button" key={value} className={size === value ? "selected" : ""} aria-pressed={size === value} onClick={() => { setSize(value); setError(""); }}>{value}</button>)}</div><div className="pdp-quantity-row"><span>Količina</span><div className="pdp-quantity"><button type="button" aria-label="Smanji količinu" disabled={quantity <= 1} onClick={() => setQuantity(n => n - 1)}>−</button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Povećaj količinu" disabled={quantity >= 10} onClick={() => setQuantity(n => n + 1)}>+</button></div></div><button className="pdp-add" type="button" onClick={add}>Dodaj u korpu <span aria-hidden="true">↗</span></button>{error && <p className="pdp-error" role="alert">{error}</p>}<p className="pdp-purchase-note">Bez plaćanja unapred. Dostupnost potvrđujemo nakon prijema porudžbine.</p></div>;
}
