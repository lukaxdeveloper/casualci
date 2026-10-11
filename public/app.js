import {products} from './catalog.js';

const $ = (selector, root = document) => root.querySelector(selector);
const money = value => new Intl.NumberFormat('sr-RS').format(value) + ' RSD';
const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function load(key, fallback) { try { const data = JSON.parse(localStorage.getItem(key)); return data ?? fallback; } catch { return fallback; } }
let cart = load('casualci-cart', []);
let favorites = localStorage.getItem('casualci-preferences') === 'all' ? load('casualci-favorites', []) : [];
let filter = 'Svi';
let query = '';
let sort = 'featured';
let toastTimer;
const productById = id => products.find(item => item.id === id);
const productImage = item => item.imageUrl ? 'background-image:url(' + encodeURI(item.imageUrl) + ');background-position:center;background-size:cover' : 'background-image:url(/assets/collection-' + item.sheet + '.webp);background-position:' + item.position;
const save = () => { localStorage.setItem('casualci-cart', JSON.stringify(cart)); if (localStorage.getItem('casualci-preferences') === 'all') localStorage.setItem('casualci-favorites', JSON.stringify(favorites)); $('#cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0); };
const notify = message => { const element = $('#toast'); element.textContent = message; element.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 3200); };
function setFilter(next) {
  filter = next;
  document.querySelectorAll('[data-filter]').forEach(button => { const selected = button.dataset.filter === next; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', selected); });
  renderProducts();
}
function renderProducts() {
  const term = query.trim().toLocaleLowerCase('sr');
  let list = products.filter(item => (filter === 'Svi' || (filter === 'Omiljeno' ? favorites.includes(item.id) : item.brand === filter)) && (!term || [item.brand, item.name, item.category, item.color].join(' ').toLocaleLowerCase('sr').includes(term)));
  const collator = new Intl.Collator('sr', {sensitivity:'base'});
  list = [...list].sort((a,b) => sort === 'price-low' ? a.price - b.price || collator.compare(a.name,b.name) : sort === 'price-high' ? b.price - a.price || collator.compare(a.name,b.name) : sort === 'name' ? collator.compare(a.name,b.name) : products.indexOf(a) - products.indexOf(b));
  $('#result-count').textContent = list.length + (list.length === 1 ? ' komad' : ' komada');
  $('#product-grid').innerHTML = list.length ? list.map(item => `
    <article class="product-card">
      <div class="product-image-wrap">
        <a class="product-image" href="/product/${encodeURIComponent(item.id)}" style="${productImage(item)}" aria-label="Pogledaj ${safe(item.name)}"></a>
        ${item.tag ? '<span class="product-tag">' + safe(item.tag) + '</span>' : ''}
        <button type="button" class="favorite-button" data-favorite="${item.id}" aria-label="${favorites.includes(item.id) ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}: ${safe(item.name)}" aria-pressed="${favorites.includes(item.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.5c0 4.3-8.8 10.2-8.8 10.2S3.2 12.8 3.2 8.5a4.5 4.5 0 0 1 8.8-1.2 4.5 4.5 0 0 1 8.8 1.2Z"/></svg></button>
        <a class="product-quick" href="/product/${encodeURIComponent(item.id)}" aria-label="Pogledaj ${safe(item.name)}">Detalji artikla</a>
      </div>
      <div class="product-info"><div class="product-brand">${safe(item.brand)}</div><div class="product-title-row"><a href="/product/${encodeURIComponent(item.id)}">${safe(item.name)}</a><strong>${money(item.price)}</strong></div><div class="product-meta">${safe(item.category)} · ${safe(item.color)}</div></div>
    </article>`).join('') : '<div class="empty-state"><h3>Nema rezultata</h3><p>Probaj drugi brend ili izraz za pretragu.</p><button type="button" id="reset-products">Prikaži sve</button></div>';
}
function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
  save(); renderProducts();
  notify(favorites.includes(id) ? 'Dodato u omiljene.' : 'Uklonjeno iz omiljenih.');
}
const cartTotal = () => cart.reduce((sum, line) => sum + (productById(line.id)?.price || 0) * line.quantity, 0);
function renderCart() {
  $('#cart-content').innerHTML = cart.length ? `<div class="cart-items">${cart.map((line, index) => { const item = productById(line.id); if (!item) return ''; return `<div class="cart-item"><div class="cart-thumb" style="${productImage(item)}"></div><div class="cart-item-details"><strong>${safe(item.name)}</strong><small>${safe(item.brand)} · ${safe(line.size)}</small><strong>${money(item.price * line.quantity)}</strong><div class="cart-item-bottom"><div class="quantity"><button type="button" data-quantity="${index}" data-delta="-1" aria-label="Smanji količinu">−</button><span>${line.quantity}</span><button type="button" data-quantity="${index}" data-delta="1" aria-label="Povećaj količinu">+</button></div><button type="button" class="remove-button" data-remove="${index}">Ukloni</button></div></div></div>`; }).join('')}</div><div class="cart-summary"><div class="summary-line"><span>ARTIKLI UKUPNO</span><span>${money(cartTotal())}</span></div><p>Poštarina nije uključena. Iznos dostave potvrđujemo pre slanja.</p><button type="button" class="full-button" id="checkout-trigger">NA PORUČIVANJE ↗</button></div>` : '<div class="empty-cart"><h3>KORPA JE PRAZNA.</h3><p>Počni od komada koji ti je zapao za oko.</p><button type="button" class="full-button" id="continue-shopping">POGLEDAJ KOLEKCIJU ↗</button></div>';
}
function renderCheckout() {
  $('#checkout-content').innerHTML = `<p class="checkout-disclaimer">Porudžbina se plaća pouzećem. Poštarina nije uključena u zbir artikala; njen iznos potvrđujemo pre slanja. Casualci još nije registrovana delatnost; podaci su u <a href="/informacije/uslovi-kupovine" target="_blank" rel="noopener">uslovima kupovine</a>.</p><div class="checkout-lines">${cart.map(line => { const p = productById(line.id); return '<p><span>' + safe(p.name) + ' / ' + safe(line.size) + ' × ' + line.quantity + '</span><strong>' + money(p.price * line.quantity) + '</strong></p>'; }).join('')}<p><strong>ARTIKLI UKUPNO</strong><strong>${money(cartTotal())}</strong></p></div><form id="checkout-form" class="checkout-form"><label>Ime i prezime <input name="name" autocomplete="name" required minlength="3" maxlength="80"></label><label>Email <input name="email" type="email" autocomplete="email" required maxlength="120"></label><label>Telefon <input name="phone" type="tel" autocomplete="tel" required minlength="7" maxlength="30"></label><label>Ulica i broj <input name="address" autocomplete="street-address" required minlength="5" maxlength="160"></label><label>Grad <input name="city" autocomplete="address-level2" required minlength="2" maxlength="80"></label><label>Poštanski broj <input name="postalCode" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}" required maxlength="5"></label><label>Napomena (opciono) <textarea name="note" maxlength="500"></textarea></label><label class="checkout-agreement"><input type="checkbox" required> Pročitao/la sam <a href="/informacije/uslovi-kupovine" target="_blank" rel="noopener">uslove kupovine</a> i <a href="/informacije/privatnost" target="_blank" rel="noopener">obaveštenje o privatnosti</a>.</label><input name="website" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="full-button" type="submit">POTVRDI PORUDŽBINU ↗</button><p id="checkout-error" class="checkout-error" role="alert" hidden></p></form>`;
}
async function submitOrder(form) {
  const data = new FormData(form);
  const button = form.querySelector('button[type="submit"]'), error = $('#checkout-error');
  button.disabled = true; button.textContent = 'ŠALJEMO PORUDŽBINU...'; error.hidden = true;
  try {
    const response = await fetch('/api/orders', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(data),items:cart})});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Porudžbina trenutno nije poslata.');
    cart = []; save();
    $('#checkout-content').innerHTML = `<div class="order-success"><span>PORUDŽBINA JE PRIMLJENA</span><h3>${safe(result.number)}</h3><p>Sačuvaj ovaj broj. Za pitanja piši na <a href="mailto:casualcirs@proton.me">casualcirs@proton.me</a>. Plaćanje je pouzećem; poštarinu potvrđujemo pre slanja.</p><button class="full-button" type="button" data-close="checkout-dialog">NAZAD NA SAJT ↗</button></div>`;
    notify('Porudžbina ' + result.number + ' je primljena.');
  } catch (caught) { error.textContent = caught.message; error.hidden = false; button.disabled = false; button.textContent = 'POTVRDI PORUDŽBINU ↗'; }
}
document.addEventListener('click', event => {
  const close = event.target.closest('[data-close]'); if (close) { $('#' + close.dataset.close).close(); return; }
  const brand = event.target.closest('[data-brand]'); if (brand) { setFilter(brand.dataset.brand); return; }
  const filterButton = event.target.closest('[data-filter]'); if (filterButton) { setFilter(filterButton.dataset.filter); return; }
  const favorite = event.target.closest('[data-favorite]'); if (favorite) { event.stopPropagation(); toggleFavorite(favorite.dataset.favorite); return; }
  const quantity = event.target.closest('[data-quantity]'); if (quantity) { const index = Number(quantity.dataset.quantity); const next = cart[index].quantity + Number(quantity.dataset.delta); if (next > 10) { notify('Najviše 10 komada po veličini.'); return; } cart[index].quantity = next; if (cart[index].quantity < 1) cart.splice(index, 1); save(); renderCart(); return; }
  const remove = event.target.closest('[data-remove]'); if (remove) { cart.splice(Number(remove.dataset.remove), 1); save(); renderCart(); return; }
  if (event.target.id === 'checkout-trigger') { $('#cart-dialog').close(); renderCheckout(); $('#checkout-dialog').showModal(); return; }
  if (event.target.id === 'continue-shopping') { $('#cart-dialog').close(); $('#kolekcija').scrollIntoView(); return; }
  if (event.target.id === 'reset-products') { query = ''; $('#product-search').value = ''; setFilter('Svi'); return; }
});
document.addEventListener('submit', event => { if (event.target.id === 'checkout-form') { event.preventDefault(); submitOrder(event.target); } });
$('#cart-trigger').addEventListener('click', () => { renderCart(); $('#cart-dialog').showModal(); });
$('#favorites-trigger').addEventListener('click', () => { setFilter('Omiljeno'); $('#kolekcija').scrollIntoView(); });
$('#search-trigger').addEventListener('click', () => { $('#search-row').hidden = false; $('#kolekcija').scrollIntoView(); $('#product-search').focus({preventScroll:true}); });
$('#clear-search').addEventListener('click', () => { query = ''; $('#product-search').value = ''; $('#search-row').hidden = true; renderProducts(); });
$('#product-search').addEventListener('input', event => { query = event.target.value; renderProducts(); });
document.addEventListener('change', event => { if (event.target.id === 'sort-select') { sort = event.target.value; renderProducts(); } });
$('#menu-trigger').addEventListener('click', () => { const menu = $('#mobile-nav'); menu.hidden = !menu.hidden; $('#menu-trigger').setAttribute('aria-expanded', !menu.hidden); });
$('#mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) { $('#mobile-nav').hidden = true; $('#menu-trigger').setAttribute('aria-expanded', 'false'); } });
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
cart = cart.filter(line => { const item = productById(line.id); return item && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 10 && item.sizes.includes(line.size); });
favorites = favorites.filter(id => productById(id));
save(); renderProducts();
const params = new URLSearchParams(window.location.search);
if (params.get('brand') && ['Ralph Lauren','Stone Island','C.P. Company'].includes(params.get('brand'))) setFilter(params.get('brand'));
if (params.get('favorites') === '1') setFilter('Omiljeno');
if (params.get('search') === '1') { $('#search-row').hidden = false; $('#product-search').focus({preventScroll:true}); }
if (params.get('cart') === '1') { renderCart(); $('#cart-dialog').showModal(); history.replaceState({}, '', '/kolekcija'); }
