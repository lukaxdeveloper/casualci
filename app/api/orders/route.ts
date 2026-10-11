import { products } from "../../../lib/catalog";

export const runtime = "nodejs";

type Line = { id: string; size: string; quantity: number };
const reply = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const webhook = process.env.DISCORD_ORDER_WEBHOOK;
  if (!webhook) return reply({ error: "Poručivanje trenutno nije dostupno. Piši nam na casualcirs@proton.me." }, 503);
  if (Number(request.headers.get("content-length") || 0) > 16_384) return reply({ error: "Podaci su preveliki." }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("body");
    body = parsed;
  } catch { return reply({ error: "Neispravni podaci." }, 400); }
  if (body.website) return reply({ error: "Porudžbina nije prihvaćena." }, 400);
  const name = clean(body.name, 80), email = clean(body.email, 120), phone = clean(body.phone, 30);
  const address = clean(body.address, 160), city = clean(body.city, 80), postalCode = clean(body.postalCode, 12), note = clean(body.note, 500);
  if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+\d\s()/-]{7,30}$/.test(phone) || address.length < 5 || city.length < 2 || !/^\d{5}$/.test(postalCode)) return reply({ error: "Proveri ime, email, telefon i adresu za dostavu." }, 400);
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) return reply({ error: "Korpa je neispravna." }, 400);
  const combined = new Map<string, Line>();
  for (const raw of body.items) {
    if (!raw || typeof raw.id !== "string" || typeof raw.size !== "string" || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 10) return reply({ error: "Korpa je neispravna." }, 400);
    const key = `${raw.id}\u0000${raw.size}`;
    const existing = combined.get(key);
    combined.set(key, { id: raw.id, size: raw.size, quantity: (existing?.quantity || 0) + raw.quantity });
  }
  let total = 0;
  const lines: string[] = [];
  for (const line of combined.values()) {
    const product = products.find(item => item.id === line.id);
    if (!product || !product.sizes.includes(line.size) || line.quantity > 10) return reply({ error: "Neki artikal ili veličina više nisu dostupni." }, 409);
    total += product.price * line.quantity;
    lines.push(`${product.brand} · ${product.name} / ${line.size} × ${line.quantity} — ${new Intl.NumberFormat("sr-RS").format(product.price * line.quantity)} RSD`);
  }
  const number = `CA-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const itemFields: { name: string; value: string; inline: boolean }[] = [];
  let currentItems = "";
  for (const line of lines) {
    if (currentItems && (currentItems.length + line.length + 1 > 1000)) {
      itemFields.push({ name: itemFields.length ? `Artikli (${itemFields.length + 1})` : "Artikli", value: currentItems, inline: false });
      currentItems = "";
    }
    currentItems += (currentItems ? "\n" : "") + line;
  }
  if (currentItems) itemFields.push({ name: itemFields.length ? `Artikli (${itemFields.length + 1})` : "Artikli", value: currentItems, inline: false });
  const payload = {
    username: "Casualci porudžbine",
    allowed_mentions: { parse: [] },
    embeds: [{
      title: `Nova porudžbina ${number}`,
      color: 0x30483c,
      fields: [
        { name: "Kupac", value: name, inline: true },
        { name: "Telefon", value: phone, inline: true },
        { name: "Email", value: email, inline: false },
        { name: "Adresa", value: `${address}\n${postalCode} ${city}`, inline: false },
        ...itemFields,
        { name: "Ukupno artikli", value: `${new Intl.NumberFormat("sr-RS").format(total)} RSD`, inline: true },
        { name: "Plaćanje", value: "Pouzećem · dostava se potvrđuje pre slanja", inline: false },
        ...(note ? [{ name: "Napomena", value: note, inline: false }] : []),
      ],
      timestamp: new Date().toISOString(),
    }],
  };
  try {
    const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Discord responded ${response.status}`);
  } catch (error) {
    console.error("Order notification failed", error instanceof Error ? error.message : "unknown error");
    return reply({ error: "Porudžbina nije potvrđena. Pokušaj ponovo ili nam piši na casualcirs@proton.me." }, 502);
  }
  return reply({ number, total, paymentMethod: "cod" }, 201);
}
