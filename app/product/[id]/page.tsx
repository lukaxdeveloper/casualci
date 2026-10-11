import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findProduct, products } from "../../../lib/catalog";
import ProductPurchase from "./purchase";

const logos: Record<string, string> = {
  "Ralph Lauren": "/assets/logos/polo-ralph-lauren.png",
  "Stone Island": "/assets/logos/stone-island.svg",
  "C.P. Company": "/assets/logos/cp-company.svg",
};
const money = (value: number) => new Intl.NumberFormat("sr-RS").format(value) + " RSD";
const imageStyle = (item: { sheet: string; position: string }) => ({ backgroundImage: `url(/assets/collection-${item.sheet}.png)`, backgroundPosition: item.position });

export function generateStaticParams() { return products.map(item => ({ id: item.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = findProduct(id);
  return item ? { title: `${item.name} | Casualci`, description: `${item.brand} ${item.name}. ${item.description}` } : { title: "Artikal nije pronađen | Casualci" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findProduct(id);
  if (!item) notFound();
  const related = products.filter(product => product.id !== item.id && (product.brand === item.brand || product.category === item.category)).slice(0, 3);
  return <main className="pdp-shell">
    <header className="pdp-header"><Link className="wordmark" href="/" aria-label="Casualci početna">CASUALCI<span>.</span></Link><nav aria-label="Navigacija"><Link href="/#kolekcija">Kolekcija</Link><Link href="/#brendovi">Brendovi</Link><Link className="pdp-bag-link" href="/?cart=1">Korpa <span aria-hidden="true">↗</span></Link></nav></header>
    <div className="pdp-breadcrumb"><Link href="/#kolekcija">Kolekcija</Link><span aria-hidden="true">/</span><span>{item.brand}</span><span aria-hidden="true">/</span><span>{item.name}</span></div>
    <section className="pdp-main" aria-labelledby="product-name">
      <div className="pdp-gallery"><div className="pdp-image" role="img" aria-label={`Ilustrativni prikaz: ${item.brand} ${item.name}`} style={imageStyle(item)} /><p>Ilustrativni prikaz artikla. Za fotografiju konkretnog komada piši nam pre poručivanja.</p></div>
      <div className="pdp-detail"><div className="pdp-detail-top"><img className={item.brand === "C.P. Company" ? "pdp-logo pdp-logo-cp" : "pdp-logo"} src={logos[item.brand]} alt={item.brand} /><span>{item.category}</span></div><h1 id="product-name">{item.name}</h1><p className="pdp-price">{money(item.price)}</p><p className="pdp-description">{item.description}</p><div className="pdp-attribute"><span>Boja</span><strong><i style={{ backgroundColor: item.swatch }} />{item.color}</strong></div><ProductPurchase item={{ id: item.id, sizes: item.sizes }} /><div className="pdp-info"><div><strong>Plaćanje pouzećem</strong><p>Iznos artikala plaćaš pri preuzimanju. Trošak dostave potvrđujemo pre slanja.</p></div><div><strong>Dostupnost i veličina</strong><p>Zahtev za porudžbinu stiže nama direktno. Potvrdićemo dostupnost konkretnog artikla i veličine.</p></div><div><strong>Pitanje pre porudžbine?</strong><p>Piši nam na <a href="mailto:casualcirs@proton.me">casualcirs@proton.me</a>.</p></div></div></div>
    </section>
    <section className="pdp-related" aria-labelledby="related-title"><div className="pdp-related-head"><h2 id="related-title">Još iz selekcije</h2><Link href="/#kolekcija">Cela kolekcija ↗</Link></div><div className="pdp-related-grid">{related.map(product => <Link className="pdp-related-card" href={`/product/${product.id}`} key={product.id}><div className="pdp-related-image" style={imageStyle(product)} /><span>{product.brand}</span><strong>{product.name}</strong><small>{money(product.price)}</small></Link>)}</div></section>
    <footer className="pdp-footer"><Link className="wordmark" href="/">CASUALCI<span>.</span></Link><span>© 2026 Casualci</span><a href="mailto:casualcirs@proton.me">casualcirs@proton.me</a></footer>
  </main>;
}
