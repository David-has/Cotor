"use strict";
(() => {

/* ---------- 1. Utilitare ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);
const root = document.documentElement;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const plural = (n, one, many) => (n === 1 ? one : many);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function seeded(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* ---------- 2. Date ---------- */
const WEEK_ID = "orasul"; // cartea săptămânii

// id, titlu, autor, gen, an, pagini, preț, descriere, citat
const RAW = [
  ["orasul", "Orașul din cuvinte", "Teodora Albu", "Roman", 2022, 312, 54, "Într-un oraș unde fiecare locuitor poate rosti o singură frază pe zi, o corectoare de manuscrise începe să adune propozițiile pierdute.", "Un oraș se termină acolo unde nu mai are cine să-l povestească."],
  ["ceasul", "Ceasul din pod", "Matei Stoica", "Roman", 2019, 280, 46, "O familie își descoperă istoria într-un ceas stricat, găsit în podul casei de la țară.", "Timpul nu trece. Doar se strânge, în locurile pe care le uităm."],
  ["mare", "Marea nu are margini", "Ilinca Radu", "Poezie", 2023, 96, 32, "Versuri scurte despre plecări, despre ape și despre scrisorile care nu mai ajung.", "Mi-ai lăsat un cuvânt pe mal, să nu uit cât de departe ești."],
  ["cerneala", "Cerneală pe degete", "Cosmin Barbu", "Poezie", 2021, 88, 29, "Un volum de poezie pentru oamenii care scriu încă de mână, pe marginea paginilor.", "Am învățat să tac din cerneala rămasă pe degete."],
  ["stele", "Ultima stație între stele", "Raluca Dinu", "SF și fantasy", 2024, 404, 59, "O navă lentă duce o grădină întreagă spre o planetă pe care nimeni nu a văzut-o. Pe drum, echipajul uită de ce a plecat.", "Nu ne-am dus după un loc. Ne-am dus după un motiv."],
  ["cartograf", "Cartograful de vânturi", "Andrei Lupescu", "SF și fantasy", 2020, 368, 52, "Un cartograf desenează hărți ale vânturilor, până când unul dintre ele începe să-l conducă singur.", "Hărțile mint politicos. Vântul nu minte niciodată."],
  ["pasari", "Pasărea care număra zilele", "Vlad Oprea", "SF și fantasy", 2018, 340, 48, "O pasăre din bronz ține socoteala unui regat care a uitat ce an trăiește.", "Fiecare zi numărată e o zi pe care n-o mai poți pierde."],
  ["incetineala", "Elogiul încetinelii", "Maria Toma", "Eseu", 2022, 176, 38, "Eseuri despre cum să faci lucrurile mai încet și să le simți mai mult.", "Graba e felul în care ratăm exact ce ne dorim."],
  ["marginalia", "Notițe pe margine", "Sorin Pavel", "Eseu", 2020, 204, 41, "O istorie a notițelor scrise pe marginea cărților și a oamenilor care le-au scris.", "Cea mai bună parte dintr-o carte e adesea ce a scris altcineva pe margine."],
  ["pisica", "Pisica din bibliotecă", "Anca Ene", "Copii", 2023, 64, 35, "O pisică ghicește cărțile pe care vor să le citească vizitatorii unei biblioteci mici.", "Nu toate poveștile sunt pentru toți. Dar toate sunt pentru cineva."],
  ["dragon", "Dragonul care voia să doarmă", "Paul Nistor", "Copii", 2021, 48, 29, "Un dragon prea obosit să mai sufle foc caută cel mai liniștit colț din lume.", "Și dragonii au nevoie de o poveste înainte de culcare."],
  ["gradina", "Grădina cu hărți", "Ioana Dragomir", "Copii", 2024, 72, 39, "Într-o grădină cresc hărți în loc de flori, iar fiecare duce spre o aventură.", "Ce crește bine, crește încet."],
  ["varsta", "Vara în care am învățat să tac", "Daria Matei", "Roman", 2023, 256, 44, "O vară la bunici, într-un sat unde nimeni nu spune ce gândește, dar toți știu totul.", "Tăcerea are limba ei. Trebuie doar să înveți să o asculți."],
  ["scrisori", "Scrisori către un far", "Radu Costin", "Roman", 2017, 298, 43, "Un paznic de far primește, an de an, scrisori de la un necunoscut care îi povestește ce vede de pe țărm.", "Un far nu salvează pe nimeni. Doar arată unde e țărmul."],
  ["cenusa", "Cenușa dimineților", "Elena Fieraru", "Poezie", 2022, 104, 34, "Poezii scrise între patru și șase dimineața, când casa e încă a ta.", "Dimineața se strânge ca o cenușă caldă în palme."],
  ["dupamiaza", "Cum se măsoară o după-amiază", "Gabriel Ionescu", "Eseu", 2024, 188, 40, "Un eseu lung despre cum ne petrecem timpul liber și de ce ne e greu să nu facem nimic.", "O după-amiază bună se măsoară în ceaiuri, nu în ore."]
];
const PAL = [["#8c1d40", "#3a0d1e", "#ffd9a8"], ["#1d3b7a", "#0b1a3d", "#a8d8ff"], ["#e0833b", "#8a3a14", "#2a0f02"], ["#3f8f6b", "#12392a", "#d8ffe8"], ["#f1c453", "#b4791f", "#2b1a04"], ["#6b3fa0", "#2a1450", "#f0dcff"], ["#d9554f", "#7a1d2e", "#fff0e0"], ["#2c7a8c", "#0e3340", "#d2f6ff"]];
const BOOKS = RAW.map(([id, title, author, genre, year, pages, price, desc, quote], i) =>
  ({ id, title, author, genre, year, pages, price, desc, quote, c: PAL[i % PAL.length], pat: i % 3, fs: 14 + (i * 7) % 4 }));
const BOOK = Object.fromEntries(BOOKS.map(b => [b.id, b]));

const TICKER = ["Cărți alese de librari", "Un colț de citit", "6.000 de titluri", "Pisica Pagina te așteaptă", "O cutie cu cărți în fiecare lună", "Evenimente în fiecare săptămână", "Fără algoritm"];
const WORDS = ["poveste", "pagină", "capitol", "rând", "cerneală", "vers", "prolog", "epilog", "filă", "margine", "ecou", "umbră", "noapte", "ceai", "raft", "tipar", "metaforă", "autor", "cotor", "lumină", "tăcere", "ghicitoare"];

const NOTES = [
  ["Ioana", "librar, raftul de roman", "O carte despre cum ne povestim orașul. Am citit-o într-o seară și am început-o din nou a doua zi.", "orasul"],
  ["Matei", "librar, poezie și eseu", "Versuri scurte, care se citesc încet. Le țin aproape, ca să le găsesc ușor când am nevoie.", "mare"],
  ["Dana", "librar, SF și cărți pentru copii", "O aventură între stele cu un final pe care nu-l vezi venind. O citesc și copiii, și adulții.", "stele"]
];

const MOODS = [
  ["Vreau să mă pierd într-o poveste", ["orasul", "varsta", "scrisori"], "O lume în care intri ușor și din care ieși greu."],
  ["Am nevoie de liniște", ["mare", "incetineala", "cenusa", "dupamiaza"], "O carte care se citește încet, cu ceai alături."],
  ["Sunt curios", ["stele", "cartograf", "pasari", "marginalia"], "Idei mari, într-o lume pe care n-ai mai văzut-o."],
  ["Citesc cu cineva mic", ["pisica", "dragon", "gradina"], "Poveste bună pentru seara dinainte de culcare."],
  ["Am doar o oră", ["mare", "cerneala", "dragon", "cenusa"], "Se termină într-o seară, dar rămâne cu tine mai mult."]
];

const MONTHS = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];
const DAYS = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
// id, zile de acum, ora, titlu, descriere, locuri libere
const EVENTS = [
  ["e1", 3, "19:00", "Seară de poezie, cu microfon deschis", "Citești un vers al tău sau al altcuiva. Intrarea e liberă.", 30],
  ["e2", 8, "18:00", "Atelier de caligrafie pentru începători", "Pene, cerneală și o după-amiază fără telefon.", 12],
  ["e3", 13, "19:30", "Clubul de carte: Orașul din cuvinte", "Discutăm despre cartea săptămânii, cu vin fiert.", 25],
  ["e4", 20, "20:00", "Lectură în șoaptă, cu pături și ceai", "Citim în liniște, împreună, la lumina lămpilor.", 18],
  ["e5", 27, "11:00", "Târg de cărți vechi în curte", "Cărți vechi, de la 5 lei, de la anticari din oraș.", 60]
];

// Luni, Marți, ..., Duminică
const HOURS = [["Luni", 10, 20], ["Marți", 10, 20], ["Miercuri", 10, 20], ["Joi", 10, 20], ["Vineri", 10, 20], ["Sâmbătă", 10, 21], ["Duminică", 11, 18]];
const BOX_PRICE = { 1: 49, 2: 89, 3: 125 };
const BOX_GENRES = [...new Set(BOOKS.map(b => b.genre)), "Surprinde-mă"];

/* Copertă desenată din CSS. <small> ia culoarea cernelii, nu roșul global. */
const cover = (b, shelf) =>
  `<div class="cover pat${b.pat}" style="--c1:${b.c[0]};--c2:${b.c[1]};--ink:${b.c[2]};${shelf ? `--fs:${b.fs}px` : ""}"><small style="color:inherit">${esc(b.genre)}</small><strong>${esc(b.title)}</strong><i></i></div>`;

/* ---------- 3. Stare salvată ---------- */
const KEY = "cotor:v1";
let state = { theme: null, list: [], res: [], ev: [], box: { n: 2, term: 1, genres: ["Roman"] } };

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && typeof s === "object") state = { ...state, ...s, box: { ...state.box, ...(s.box || {}) } };
  } catch (e) { /* fără localStorage, continuăm în memorie */ }
  state.list = (Array.isArray(state.list) ? state.list : []).filter(id => BOOK[id]);
  state.res = (Array.isArray(state.res) ? state.res : []).filter(id => BOOK[id]);
  state.ev = (Array.isArray(state.ev) ? state.ev : []).filter(id => EVENTS.some(e => e[0] === id));
  if (!BOX_PRICE[state.box.n]) state.box.n = 2;
  if (![1, 3].includes(state.box.term)) state.box.term = 1;
  state.box.genres = (Array.isArray(state.box.genres) ? state.box.genres : []).filter(g => BOX_GENRES.includes(g));
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorat */ } }
function toggle(arr, id) { const i = arr.indexOf(id); i < 0 ? arr.push(id) : arr.splice(i, 1); return i < 0; }

/* ---------- 4. Temă ---------- */
const themeBtn = $("#themeBtn");
const metaTheme = document.head.appendChild(Object.assign(document.createElement("meta"), { name: "theme-color" }));
let colMute = "#93a89b", colAcc = "#ff9248";

function readColors() {
  const cs = getComputedStyle(root);
  colMute = cs.getPropertyValue("--mute").trim() || colMute;
  colAcc = cs.getPropertyValue("--accent").trim() || colAcc;
  metaTheme.content = cs.getPropertyValue("--bg").trim();
}
function applyTheme(t) {
  root.dataset.theme = t;
  themeBtn && themeBtn.setAttribute("aria-checked", String(t === "light"));
  readColors();
  drawStatic();
}
function setTheme(t, animate) {
  if (t === root.dataset.theme) return;
  state.theme = t;
  save();
  if (!animate || !document.startViewTransition || reduced()) return applyTheme(t);
  root.dataset.flip = t === "light" ? "ltr" : "rtl";
  const vt = document.startViewTransition(() => applyTheme(t));
  vt.ready.then(() => {
    root.animate(
      [{ transform: "rotateY(0deg)", opacity: 1 }, { opacity: 1, offset: 0.75 }, { transform: `rotateY(${t === "light" ? -100 : 100}deg)`, opacity: 0 }],
      { duration: 950, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards", pseudoElement: "::view-transition-old(root)" }
    );
  }).catch(() => {});
}
on(themeBtn, "click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => { if (!state.theme) applyTheme(e.matches ? "light" : "dark"); });

/* ---------- 5. Hero ---------- */
const hero = $("#top");
const canvas = $("#words");
const ctx = canvas && canvas.getContext("2d");
const b3 = $(".b3");
const stage = $("#stage3d");
const ptr = { x: 0, y: 0, in: false };
let cw = 0, ch = 0, parts = [], running = false, heroVisible = true, last = 0;
const rnd = seeded(42);

function newPart(init) {
  const s = 14 + rnd() * 30;
  return { w: WORDS[Math.floor(rnd() * WORDS.length)], x: rnd() * cw, y: init ? rnd() * ch : ch + s, s, v: 0.12 + rnd() * 0.3, ph: rnd() * 6.28, amp: 8 + rnd() * 26, a: 0.05 + rnd() * 0.17, hi: rnd() < 0.12, ox: 0, oy: 0 };
}
function sizeCanvas() {
  if (!canvas || !hero) return;
  const r = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  cw = r.width; ch = r.height;
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  parts = Array.from({ length: clamp(Math.round(cw * ch / 24000), 14, 60) }, () => newPart(true));
  drawStatic();
}
function draw(t, dt) {
  if (!ctx) return;
  ctx.clearRect(0, 0, cw, ch);
  for (const p of parts) {
    if (dt) { p.y -= p.v * dt; if (p.y < -60) Object.assign(p, newPart(false)); }
    const x = p.x + Math.sin(t / 1900 + p.ph) * p.amp;
    if (ptr.in) {
      const dx = x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy) || 1;
      if (d < 150) { const f = (150 - d) / 150; p.ox += (dx / d * f * 40 - p.ox) * 0.08; p.oy += (dy / d * f * 40 - p.oy) * 0.08; }
      else { p.ox *= 0.94; p.oy *= 0.94; }
    } else { p.ox *= 0.94; p.oy *= 0.94; }
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.hi ? colAcc : colMute;
    ctx.font = `italic 400 ${p.s}px Fraunces, Georgia, serif`;
    ctx.fillText(p.w, x + p.ox, p.y + p.oy);
  }
  ctx.globalAlpha = 1;
}
function drawStatic() { draw(0, 0); }
function tilt(rx, ry) {
  if (!b3) return;
  b3.style.setProperty("--rx", rx.toFixed(1) + "deg");
  b3.style.setProperty("--ry", ry.toFixed(1) + "deg");
}
function frame(now) {
  if (!running) return;
  const dt = Math.min(now - last, 50) / 16.67;
  last = now;
  draw(now, dt);
  if (!ptr.in) tilt(Math.cos(now / 2300) * 4, Math.sin(now / 1800) * 10); // legănare când nu e mouse-ul pe pagină
  requestAnimationFrame(frame);
}
function startLoop() {
  if (running || reduced() || !heroVisible || document.hidden) return;
  running = true; last = performance.now(); requestAnimationFrame(frame);
}
function stopLoop() { running = false; }

function initHero() {
  if (!hero) return;
  sizeCanvas();
  if ("ResizeObserver" in window) new ResizeObserver(() => { sizeCanvas(); buildSpines(); }).observe(hero);
  else on(window, "resize", () => { sizeCanvas(); buildSpines(); });
  if ("IntersectionObserver" in window)
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; heroVisible ? startLoop() : stopLoop(); }).observe(hero);
  on(document, "visibilitychange", () => (document.hidden ? stopLoop() : startLoop()));
  on(hero, "pointermove", e => {
    const r = hero.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.in = true;
    hero.style.setProperty("--mx", ptr.x + "px");
    hero.style.setProperty("--my", ptr.y + "px");
    if (stage) {
      const s = stage.getBoundingClientRect();
      tilt(-clamp((e.clientY - (s.top + s.height / 2)) / (innerHeight / 2), -1, 1) * 12,
        clamp((e.clientX - (s.left + s.width / 2)) / (innerWidth / 2), -1, 1) * 22);
    }
  });
  on(hero, "pointerleave", () => {
    ptr.in = false;
    hero.style.removeProperty("--mx"); hero.style.removeProperty("--my");
    if (reduced()) tilt(0, 0);
  });
  const front = $("#b3front");
  if (front && BOOK[WEEK_ID]) front.innerHTML = cover(BOOK[WEEK_ID], false);
  startLoop();
}

function buildSpines() {
  const box = $("#spines");
  if (!box) return;
  const n = clamp(Math.floor(innerWidth / 34), 10, 48), r = seeded(11);
  box.innerHTML = Array.from({ length: n }, (_, i) => {
    const t = BOOKS[i % BOOKS.length].title;
    return `<div class="spine${i === n - 2 ? " lean" : ""}" style="--w:${22 + Math.round(r() * 18)}px;--ht:${64 + Math.round(r() * 46)}px;--h:${Math.round(r() * 360)}"><span>${esc(t.length > 13 ? t.slice(0, 12) + "…" : t)}</span></div>`;
  }).join("");
}

/* ---------- 6. Bandă și cifre ---------- */
function initTicker() {
  const t = $("#tickerTrack");
  if (!t) return;
  const html = TICKER.map(x => `<span>${esc(x)}</span>`).join("");
  t.innerHTML = html + html; // dublat, ca bucla să nu aibă tăietură
}
function countUp(el) {
  const to = +el.dataset.count;
  if (reduced()) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  (function step(t) {
    const k = clamp((t - t0) / 1600, 0, 1);
    el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- 7. Raftul ---------- */
const shelf = $("#shelf"), booksEl = $("#books"), genresEl = $("#genres");
const prev = $("#prev"), next = $("#next");
let genre = "Toate", dragMoved = false;

function renderGenres() {
  genresEl.innerHTML = ["Toate", ...new Set(BOOKS.map(b => b.genre))]
    .map(g => `<button type="button" aria-pressed="${g === genre}">${esc(g)}</button>`).join("");
}
function renderBooks() {
  const list = BOOKS.filter(b => genre === "Toate" || b.genre === genre);
  booksEl.innerHTML = list.map((b, i) =>
    `<li style="--i:${i}"><button type="button" class="bk-btn" data-open="${b.id}">${cover(b, true)}<span class="bk-price"></span></button></li>`).join("");
  shelf.scrollLeft = 0;
  marks();
  arrows();
}
function marks() { // preț și bifă pentru cărțile din listă
  $$(".bk-btn").forEach(btn => {
    const b = BOOK[btn.dataset.open], inList = state.list.includes(b.id);
    $(".bk-price", btn).textContent = `${b.price} lei${inList ? ", în listă" : ""}`;
    btn.setAttribute("aria-label", `${b.title}, ${b.author}, ${b.price} lei${inList ? ", în lista ta" : ""}`);
  });
}
function arrows() {
  const max = shelf.scrollWidth - shelf.clientWidth - 2;
  prev.disabled = shelf.scrollLeft <= 2;
  next.disabled = shelf.scrollLeft >= max;
  [prev, next].forEach(b => (b.style.opacity = b.disabled ? "0.35" : ""));
}
function scrollShelf(dir) { shelf.scrollBy({ left: dir * shelf.clientWidth * 0.8, behavior: reduced() ? "auto" : "smooth" }); }

function initShelf() {
  if (!shelf || !booksEl || !genresEl) return;
  renderGenres(); renderBooks();
  on(genresEl, "click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    genre = b.textContent; renderGenres(); renderBooks();
  });
  on(prev, "click", () => scrollShelf(-1));
  on(next, "click", () => scrollShelf(1));
  let raf = 0;
  on(shelf, "scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(arrows); }, { passive: true });
  on(window, "resize", arrows);
  on(shelf, "keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); shelf.scrollBy({ left: 200 }); }
    if (e.key === "ArrowLeft") { e.preventDefault(); shelf.scrollBy({ left: -200 }); }
    if (e.key === "Home") shelf.scrollTo({ left: 0 });
    if (e.key === "End") shelf.scrollTo({ left: shelf.scrollWidth });
  });
  // tragere cu mouse-ul (fără să blocăm click-ul pe cărți)
  let down = false, sx = 0, sl = 0;
  on(shelf, "pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true; dragMoved = false; sx = e.clientX; sl = shelf.scrollLeft;
  });
  on(document, "pointermove", e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!dragMoved && Math.abs(dx) > 5) { dragMoved = true; shelf.classList.add("drag"); shelf.style.userSelect = "none"; }
    if (dragMoved) shelf.scrollLeft = sl - dx;
  });
  const stop = () => { down = false; shelf.classList.remove("drag"); shelf.style.userSelect = ""; };
  on(document, "pointerup", stop);
  on(document, "pointercancel", stop);
  on(shelf, "click", e => { if (dragMoved) { e.preventDefault(); e.stopPropagation(); dragMoved = false; } }, true);
}

/* ---------- 8. Fereastra unei cărți ---------- */
const dlg = $("#dlg"), dList = $("#dList"), dRes = $("#dRes");
let cur = null, locks = 0;

function lock(on_) { locks = Math.max(0, locks + (on_ ? 1 : -1)); root.style.overflow = locks ? "hidden" : ""; }

function syncDialog() {
  if (!cur || !dList) return;
  const inList = state.list.includes(cur.id), res = state.res.includes(cur.id);
  dList.textContent = inList ? "În lista ta, scoate" : "Adaugă în lista de citit";
  dList.setAttribute("aria-pressed", String(inList));
  dRes.textContent = res ? "Rezervată, anulează" : "Rezervă la librărie";
  dRes.setAttribute("aria-pressed", String(res));
  dRes.title = res ? "Apasă ca să anulezi rezervarea" : "Îți păstrăm cartea la raft";
}
function openBook(id) {
  const b = BOOK[id];
  if (!b || !dlg) return;
  cur = b;
  $("#dCover").innerHTML = cover(b, false);
  $("#dMeta").textContent = `${b.genre}, ${b.year}`;
  $("#dTitle").textContent = b.title;
  $("#dAuthor").textContent = b.author;
  $("#dDesc").textContent = b.desc;
  $("#dQuote").textContent = `„${b.quote}”`;
  $("#dPrice").textContent = `${b.price} lei`;
  $("#dPages").textContent = `${b.pages} de pagini`;
  syncDialog();
  if (!dlg.open) {
    lock(true);
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
}
function initDialog() {
  if (!dlg) return;
  on($("#dClose"), "click", () => dlg.close());
  on(dlg, "click", e => { if (e.target === dlg) dlg.close(); }); // clic pe fundal
  on(dlg, "close", () => lock(false));
  on(dList, "click", () => { if (cur) toggleList(cur.id); });
  on(dRes, "click", () => { if (cur) { toggle(state.res, cur.id); save(); renderList(); } });
}
// orice element cu data-open deschide cartea
on(document, "click", e => {
  const t = e.target.closest("[data-open]");
  if (t) openBook(t.dataset.open);
});

/* ---------- 9. Lista de citit ---------- */
const drawer = $("#drawer"), scrim = $("#scrim"), listBtn = $("#listBtn");
const listEl = $("#listItems"), listEmpty = $("#listEmpty"), listNote = $("#listNote");
const copyBtn = $("#copyList"), clearBtn = $("#clearList");
let drawerOpen = false, noteTimer = 0, armed = 0, opener = null;

function renderList() {
  const items = state.list.map(id => BOOK[id]);
  listEl.innerHTML = items.map(b =>
    `<li>${cover(b, false)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}, ${b.price} lei${state.res.includes(b.id) ? ", rezervată" : ""}</small></div><button type="button" data-rm="${b.id}" aria-label="Scoate ${esc(b.title)} din listă">×</button></li>`).join("");
  listEmpty.hidden = items.length > 0;
  $("#listCount").textContent = items.length;
  copyBtn.disabled = clearBtn.disabled = !items.length;
  marks();
  syncDialog();
}
function toggleList(id) {
  const added = toggle(state.list, id);
  save(); renderList();
  if (added) { listBtn.classList.remove("bump"); void listBtn.offsetWidth; listBtn.classList.add("bump"); }
}
function openDrawer() {
  if (drawerOpen) return;
  drawerOpen = true; opener = document.activeElement;
  drawer.removeAttribute("inert");
  drawer.classList.add("open"); scrim.classList.add("show");
  listBtn.setAttribute("aria-expanded", "true");
  lock(true);
  setTimeout(() => $("#drawerClose").focus(), 60);
}
function closeDrawer() {
  if (!drawerOpen) return;
  drawerOpen = false;
  drawer.classList.remove("open"); scrim.classList.remove("show");
  drawer.setAttribute("inert", "");
  listBtn.setAttribute("aria-expanded", "false");
  lock(false);
  (opener && opener.focus ? opener : listBtn).focus();
}
function note(msg) {
  listNote.textContent = msg; listNote.hidden = false;
  clearTimeout(noteTimer); noteTimer = setTimeout(() => (listNote.hidden = true), 3500);
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) {
    const ta = Object.assign(document.createElement("textarea"), { value: t });
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { /* ignorat */ }
    ta.remove();
    return ok;
  }
}
function initList() {
  if (!drawer) return;
  listBtn.setAttribute("aria-controls", "drawer");
  listBtn.setAttribute("aria-expanded", "false");
  on(listBtn, "click", openDrawer);
  on($("#drawerClose"), "click", closeDrawer);
  on(scrim, "click", closeDrawer);
  on(listEl, "click", e => {
    const b = e.target.closest("[data-rm]");
    if (b) { toggle(state.list, b.dataset.rm); save(); renderList(); }
  });
  on(copyBtn, "click", async () => {
    const items = state.list.map(id => BOOK[id]);
    const total = items.reduce((s, b) => s + b.price, 0);
    const txt = `Lista mea de citit (Cotor)\n${items.map((b, i) => `${i + 1}. ${b.title}, ${b.author}, ${b.price} lei`).join("\n")}\nTotal: ${total} lei`;
    note((await copyText(txt)) ? `Lista a fost copiată (${items.length} ${plural(items.length, "carte", "cărți")}, ${total} lei).` : "Nu am putut copia lista. O poți selecta manual.");
  });
  const reset = () => { clearBtn.textContent = "Golește lista"; armed = 0; };
  on(clearBtn, "click", () => {
    if (!armed) { clearBtn.textContent = "Sigur? Apasă încă o dată"; armed = setTimeout(reset, 3000); return; }
    clearTimeout(armed); reset();
    state.list = []; save(); renderList();
  });
  on(document, "keydown", e => {
    if (!drawerOpen) return;
    if (e.key === "Escape" && !(dlg && dlg.open)) { closeDrawer(); return; }
    if (e.key === "Tab" && !(dlg && dlg.open)) { // focusul rămâne în sertar
      const f = $$("button:not(:disabled)", drawer);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
}

/* ---------- 10. Recomandări, dispoziție, evenimente ---------- */
function renderNotes() {
  const el = $("#notes");
  if (!el) return;
  el.innerHTML = NOTES.map(([name, role, q, id]) =>
    `<article class="note"><blockquote>„${esc(q)}”</blockquote><div class="who"><i>${esc(name[0])}</i><span><b>${esc(name)}</b>${esc(role)}</span></div><button type="button" data-open="${id}">Vezi „${esc(BOOK[id].title)}”</button></article>`).join("");
}

let moodI = -1, moodN = 0;
function renderMoods() {
  $("#moods").innerHTML = MOODS.map(([l], i) => `<button type="button" data-i="${i}" aria-pressed="${i === moodI}">${esc(l)}</button>`).join("");
}
function showMood() {
  const out = $("#moodResult");
  if (moodI < 0) { out.innerHTML = '<p class="empty-msg">Alege o dispoziție și îți găsim o carte.</p>'; return; }
  const [, ids, why] = MOODS[moodI], b = BOOK[ids[moodN % ids.length]];
  out.innerHTML = `<div class="pop">${cover(b, false)}</div><div class="pop"><h3>${esc(b.title)}</h3><p>${esc(b.author)}. ${esc(why)}</p><div class="d-actions"><button type="button" class="btn btn-sm" data-open="${b.id}">Vezi cartea</button>${ids.length > 1 ? '<button type="button" class="btn btn-ghost btn-sm" data-next>Altă recomandare</button>' : ""}</div></div>`;
}
function initMoods() {
  if (!$("#moods")) return;
  renderMoods(); showMood();
  on($("#moods"), "click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    moodI = +b.dataset.i; moodN = 0; renderMoods(); showMood();
  });
  on($("#moodResult"), "click", e => { if (e.target.closest("[data-next]")) { moodN++; showMood(); } });
}

function renderEvents(focusId) {
  const el = $("#events");
  if (!el) return;
  el.innerHTML = EVENTS.map(([id, off, time, title, desc, seats]) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + off);
    const mine = state.ev.includes(id), left = seats - (mine ? 1 : 0), full = left <= 0 && !mine;
    return `<li class="event"><div class="date"><b>${d.getDate()}</b><small>${MONTHS[d.getMonth()]}</small></div><div><h3>${esc(title)}</h3><p>${DAYS[d.getDay()]}, ora ${time}. ${esc(desc)}</p></div><span class="seats"><b>${left}</b> ${plural(left, "loc liber", "locuri libere")}</span><button type="button" class="btn btn-sm" data-ev="${id}" aria-pressed="${mine}"${full ? " disabled" : ""}${mine ? ' title="Apasă ca să anulezi"' : ""}>${mine ? "Locul tău e rezervat" : full ? "Nu mai sunt locuri" : "Rezervă un loc"}</button></li>`;
  }).join("");
  if (focusId) { const b = $(`[data-ev="${focusId}"]`); b && b.focus(); }
}
function initEvents() {
  renderEvents();
  on($("#events"), "click", e => {
    const b = e.target.closest("[data-ev]");
    if (!b) return;
    toggle(state.ev, b.dataset.ev); save(); renderEvents(b.dataset.ev);
  });
}

/* ---------- 11. Cutia lunară ---------- */
function renderBox() {
  const { n, term, genres } = state.box;
  $$("#boxCount button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === n)));
  $$("#boxTerm button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === term)));
  $$("#boxGenres button").forEach(b => b.setAttribute("aria-pressed", String(genres.includes(b.textContent))));
  const month = Math.round(BOX_PRICE[n] * (term === 3 ? 0.9 : 1));
  $("#boxPrice").textContent = `${month} lei`;
  $("#boxNote").textContent = `${n} ${plural(n, "carte", "cărți")} pe lună${genres.length ? `, ${genres.join(", ").toLowerCase()}` : ""}. ${term === 3 ? `Plătești ${month * 3} de lei pentru 3 luni.` : "Plătești lunar și oprești oricând."}`;
}
function initBox() {
  if (!$("#boxGenres")) return;
  $("#boxGenres").innerHTML = BOX_GENRES.map(g => `<button type="button" aria-pressed="false">${esc(g)}</button>`).join("");
  renderBox();
  const touch = fn => e => { const b = e.target.closest("button"); if (b) { fn(b); save(); renderBox(); $("#boxOk").hidden = true; } };
  on($("#boxCount"), "click", touch(b => (state.box.n = +b.dataset.v)));
  on($("#boxTerm"), "click", touch(b => (state.box.term = +b.dataset.v)));
  on($("#boxGenres"), "click", touch(b => toggle(state.box.genres, b.textContent)));
  on($("#boxGo"), "click", () => {
    const ok = $("#boxOk");
    if (!state.box.genres.length) {
      $("#boxNote").textContent = "Alege cel puțin un gen, ca librarii să știe ce să pună în cutie.";
      $("#boxGenres button").focus();
      return;
    }
    ok.textContent = `Mulțumim! Ți-am notat cutia cu ${state.box.n} ${plural(state.box.n, "carte", "cărți")} pe lună. Prezentare conceptuală: nu s-a creat niciun abonament.`;
    ok.hidden = false;
  });
}

/* ---------- 12. Program și newsletter ---------- */
function shopNow() { // ora din București, indiferent unde e vizitatorul
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).map(x => [x.type, x.value]));
    return { day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), mins: +p.hour * 60 + +p.minute };
  } catch (e) {
    const d = new Date();
    return { day: (d.getDay() + 6) % 7, mins: d.getHours() * 60 + d.getMinutes() };
  }
}
function renderHours() {
  const { day, mins } = shopNow(), pill = $("#openPill"), [, o, c] = HOURS[day];
  $("#hours").innerHTML = HOURS.map(([d, a, z], i) => `<li${i === day ? ' class="today"' : ""}><span>${d}</span><span>${a}:00 – ${z}:00</span></li>`).join("");
  const open = mins >= o * 60 && mins < c * 60;
  pill.classList.toggle("open", open);
  if (open) pill.textContent = `Deschis acum, până la ${c}:00`;
  else if (mins < o * 60) pill.textContent = `Închis acum, deschidem azi la ${o}:00`;
  else pill.textContent = `Închis acum, deschidem mâine la ${HOURS[(day + 1) % 7][1]}:00`;
}

function initNews() {
  const form = $("#news");
  if (!form) return;
  const label = $("label", form), input = $("input", form), err = $("small", form), ok = $("#newsOk");
  const setErr = msg => { label.classList.toggle("invalid", !!msg); err.textContent = msg; input.setAttribute("aria-invalid", String(!!msg)); };
  const check = () => {
    const v = input.value.trim();
    if (!v) return "Scrie adresa ta de email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Adresa nu pare corectă. Verific-o și încearcă din nou.";
    return "";
  };
  on(input, "input", () => { ok.hidden = true; if (label.classList.contains("invalid")) setErr(check()); });
  on(form, "submit", e => {
    e.preventDefault();
    const m = check();
    setErr(m);
    if (m) { input.focus(); return; }
    ok.textContent = `Mulțumim! ${input.value.trim()} e pe listă. Prezentare conceptuală: nu am trimis niciun email.`;
    ok.hidden = false; form.reset();
  });
}

/* ---------- 13. Scroll, apariții, magnet ---------- */
function initScroll() {
  const header = $("#header"), pn = $("#pagenum");
  let busy = false;
  const run = () => {
    const y = scrollY, max = root.scrollHeight - innerHeight;
    header.classList.toggle("solid", y > 24);
    pn.textContent = `pag. ${1 + Math.round((max > 0 ? y / max : 0) * 99)} / 100`;
    busy = false;
  };
  on(window, "scroll", () => { if (!busy) { busy = true; requestAnimationFrame(run); } }, { passive: true });
  run();
}
function initReveal() {
  const els = $$(".reveal"), nums = $$("[data-count]");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); nums.forEach(n => (n.textContent = fmt(+n.dataset.count))); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  els.forEach(e => io.observe(e));
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countUp(e.target); co.unobserve(e.target);
  }), { threshold: 0.6 });
  nums.forEach(n => co.observe(n));
}
function initMagnet() {
  if (!matchMedia("(hover: hover)").matches || reduced()) return;
  $$(".mag").forEach(b => {
    on(b, "pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 12}px, ${((e.clientY - r.top) / r.height - 0.5) * 10}px)`;
    });
    on(b, "pointerleave", () => (b.style.transform = ""));
  });
}

/* ---------- 14. Pornire ---------- */
function init() {
  load();
  applyTheme(state.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  initTicker(); buildSpines(); initHero();
  initShelf(); initDialog(); initList(); renderList();
  renderNotes(); initMoods(); initEvents(); initBox();
  renderHours(); setInterval(renderHours, 60000);
  initNews(); initScroll(); initReveal(); initMagnet();
  on(window, "storage", e => { if (e.key === KEY) { load(); renderList(); renderEvents(); renderBox(); } });
}
init();

})();