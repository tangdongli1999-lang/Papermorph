/* legs.js — Two Legs: the cast as cut-out pictures (img/cast/, cut from the user's art pack by
   tools/two-legs/cutouts.py), the captions, the title and the phone screens every chapter uses. */
'use strict';
const CAST = {"biscuit_body_back": [1024, 1536], "biscuit_headB": [1024, 1536], "biscuit_headF": [1024, 1536], "biscuit_head_back_turned": [798, 1504],
  "biscuit_side_walk": [942, 959], "biscuit_sit_front": [934, 1488], "biscuit_stand_back": [795, 1507], "biscuit_stand_front_stare": [801, 1489],
  "cat_bowl": [1066, 584], "empty_glass": [606, 835], "june_head_closeup": [991, 1077], "june_pyjamas_front": [505, 1487], "june_pyjamas_glass": [503, 1489]};
const shotAt = (q, shots) => { let s = shots[0][1]; for (const [t0, n] of shots) if (q >= t0) s = n; return s; };
const lerp = (a, b, u) => a + (b - a) * u;

// A cut-out picture standing on its feet: pose({ x, y (the feet), h (height in world px), rot, sx, sy, o }).
// ax, ay: the anchor inside the picture as fractions (0.5, 1 = bottom centre).
function sprite(parent, name, { ax = .5, ay = 1 } = {}) {
  const [w, h] = CAST[name], g = mk('g', {}, parent), inner = mk('g', {}, g);
  mk('image', { href: `../img/cast/${name}.webp`, x: -ax * w, y: -ay * h, width: w, height: h }, inner);
  return { g, inner, w, h,
    pose({ x = 800, y = 800, h: H = 600, rot = 0, sx = 1, sy = 1, o = 1 } = {}) {
      const k = H / h; tf(g, `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${(k * sx).toFixed(4)},${(k * sy).toFixed(4)})`);
      g.setAttribute('opacity', o.toFixed(3));
    } };
}

// Staring eyes laid over a cat picture's own (picture px of each pupil's centre): look(dy) moves the pupils up (-1) or down (+1).
function stareEyes(parent, pts, { r = 25, pr = 10.5 } = {}) {
  const g = mk('g', {}, parent), pupils = [];
  for (const [x, y] of pts) {
    mk('circle', { cx: x, cy: y + 1, r, fill: '#f6f0e2', stroke: '#3a2416', 'stroke-width': 3 }, g);
    pupils.push(mk('circle', { cx: x, cy: y, r: pr, fill: '#2b1a10' }, g));
  }
  return { g, look(dx = 0, dy = 0) { pupils.forEach((p, i) => tf(p, `translate(${(dx * 11).toFixed(1)},${(dy * 12).toFixed(1)})`)); } };
}

// Biscuit upright from behind, his head able to turn round to face us: turn(u) 0 back of the head … 1 his face.
// Pieces share one 1024 x 1536 canvas; his feet are at canvas (509, 1528).
function biscuitTurner(parent) {
  const g = mk('g', {}, parent), img = (n, p) => mk('image', { href: `../img/cast/${n}.webp`, x: -509, y: -1528, width: 1024, height: 1536 }, p);
  img('biscuit_body_back', g);
  const hb = mk('g', {}, g), hf = mk('g', {}, g); img('biscuit_headB', hb); img('biscuit_headF', hf);
  const eyes = stareEyes(hf, [[448.5 - 509, 211.5 - 1528], [577.5 - 509, 212.5 - 1528]], { r: 24, pr: 10 });
  const HC = [509 - 509, 200 - 1528];   // the head's centre
  return { g, eyes,
    pose({ x, y, h = 600, turn = 0, tilt = 0, bob = 0 }) {
      const k = h / 1507; tf(g, `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${k.toFixed(4)})`);
      // the head squashes towards one side as it goes round, swaps to the face at the middle and opens out from the other
      const a = turn < .5 ? 1 - turn * 2 : (turn - .5) * 2, sx = .32 + .68 * a, dx = (turn < .5 ? 1 : -1) * 120 * (1 - a);
      const t = `translate(${HC[0] + dx},${HC[1] + bob}) rotate(${tilt.toFixed(2)}) scale(${sx.toFixed(3)},1) translate(${-HC[0]},${-HC[1]})`;
      vis(hb, turn < .5); vis(hf, turn >= .5); tf(hb, t); tf(hf, t);
    } };
}

/* ---------- captions (burned in, one sentence at a time) and the title ---------- */
const CAP = { x: 800, y: 832, size: 40, lineH: 48, maxW: 1200, font: "'Helvetica Neue', Arial, sans-serif" };
function legCaptions(p, scene, pre) {
  const T = TIMINGS[scene], cues = [];
  // a long cue is cut into pieces of about two lines, each shown for its share of the cue's time (by letters)
  T.cues.forEach(([t0, text, t1], i) => {
    const end = t1 ?? (T.cues[i + 1]?.[0] ?? T.dur), words = text.split(' '), pieces = [''];
    for (const w of words) { const t = (pieces.at(-1) + ' ' + w).trim(); if (t.length > 88 && pieces.at(-1)) pieces.push(w); else pieces[pieces.length - 1] = t; }
    const n = pieces.reduce((a, s) => a + s.length, 0); let at = t0;
    for (const s of pieces) { const d = (end - t0) * s.length / n; cues.push({ t0: pre + at, t1: pre + at + d, text: s }); at += d; }
  });
  const g = mk('g', { 'pointer-events': 'none', 'font-family': CAP.font, 'font-weight': 700, 'text-anchor': 'middle' }, p);
  const wrap = text => { const lines = ['']; for (const w of text.split(' ')) { const t = (lines.at(-1) + ' ' + w).trim(); if (t.length * CAP.size * .52 > CAP.maxW && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; } return lines; };
  const els = [0, 1, 2].map(() => mk('text', { x: CAP.x, 'font-size': CAP.size, fill: '#f3efe6', stroke: '#05060a', 'stroke-width': 9, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g));
  return (q, on = true) => {
    const c = on ? cues.filter(c => q >= c.t0 && q < c.t1).at(-1) : null, ls = c ? wrap(c.text) : [];
    els.forEach((e, i) => { const t = ls[i] || ''; if (e._s !== t) e.textContent = e._s = t; e.setAttribute('y', CAP.y + (i - ls.length + 1) * CAP.lineH); vis(e, !!t); });
  };
}
// TWO LEGS in cut-paper capitals in the dark, each letter a little crooked; pose({ o, k }) (k: a slow grow).
function legTitle(p, text = 'TWO LEGS', x = 800, y = 480, size = 150, track = 22) {
  const g = mk('g', { 'pointer-events': 'none' }, p), ch = [...text];
  const rot = ch.map((_, i) => ((i * 53) % 9) - 4).join(' ');
  g.innerHTML = `<rect x="-100" y="-100" width="1800" height="1100" fill="#06070c"/><g data-t><text x="${x}" y="${y}" rotate="${rot}" letter-spacing="${track}" font-family="Georgia, 'Times New Roman', serif"
      font-size="${size}" font-weight="700" fill="#e9dfc9" text-anchor="middle">${ch.join('')}</text>
      <path d="M${x - 330},${y + 40} h660" stroke="#c8662a" stroke-width="7" stroke-linecap="round"/></g>`;
  const t = g.querySelector('[data-t]');
  return { g, pose({ o = 1, k = 0 } = {}) { t.setAttribute('opacity', o.toFixed(3)); tf(t, `translate(${x},${y}) scale(${(1 + .06 * k).toFixed(4)}) translate(${-x},${-y})`); } };
}

/* ---------- phone screens ---------- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function wrapText(text, perLine) { const out = ['']; for (const w of text.split(' ')) { if ((out.at(-1) + ' ' + w).trim().length > perLine) out.push(w); else out[out.length - 1] = (out.at(-1) + ' ' + w).trim(); } return out; }
// The viral post, drawn into a W x H screen: { g, shares(n) }.
function postCard(parent, W, H, { y0 = 0, dark = false } = {}) {
  const g = mk('g', {}, parent), ink = dark ? '#e8edf2' : '#1b2026', soft = dark ? '#9aa6b2' : '#68737e';
  const lines = wrapText("If your cat ever stands on two legs, don't move. It's only checking if you're awake.", Math.round(W / 15));
  g.innerHTML = `<g transform="translate(0,${y0})">
    <circle cx="${W * .12}" cy="${H * .06}" r="${W * .06}" fill="#c9b8dd"/><circle cx="${W * .12}" cy="${H * .052}" r="${W * .022}" fill="#7b6a91"/>
    <text x="${W * .22}" y="${H * .055}" font-family="Helvetica Neue, Arial" font-weight="700" font-size="${W * .055}" fill="${ink}">nightwatcher_22</text>
    <text x="${W * .22}" y="${H * .085}" font-family="Helvetica Neue, Arial" font-size="${W * .042}" fill="${soft}">3 days ago</text>
    ${lines.map((l, i) => `<text x="${W * .07}" y="${H * .16 + i * W * .085}" font-family="Helvetica Neue, Arial" font-weight="600" font-size="${W * .066}" fill="${ink}">${esc(l)}</text>`).join('')}
    <text data-s x="${W * .07}" y="${H * .16 + lines.length * W * .085 + W * .06}" font-family="Helvetica Neue, Arial" font-weight="700" font-size="${W * .05}" fill="#d0452f"></text></g>`;
  const s = g.querySelector('[data-s]');
  return { g, h: H * .16 + lines.length * W * .085 + W * .1, shares(n) { const t = `♥ ${n >= 1000 ? Math.floor(n / 1000) + 'K' : n} shares`; if (s._t !== t) s.textContent = s._t = t; } };
}
// A comment row: avatar, name, words; returns its height.
function commentRow(parent, W, y, name, words, { hi = false, colour = '#bfd3c6' } = {}) {
  const g = mk('g', { transform: `translate(0,${y})` }, parent), ls = wrapText(words, Math.round(W / 14));
  g.innerHTML = `${hi ? `<rect x="${W * .03}" y="${-W * .045}" width="${W * .94}" height="${W * (.16 + .07 * ls.length)}" rx="${W * .03}" fill="#fff1d6"/>` : ''}
    <circle cx="${W * .1}" cy="${W * .02}" r="${W * .045}" fill="${colour}"/>
    <text x="${W * .18}" y="${W * .035}" font-family="Helvetica Neue, Arial" font-weight="700" font-size="${W * .045}" fill="#39424c">${esc(name)}</text>
    ${ls.map((l, i) => `<text x="${W * .18}" y="${W * (.11 + .07 * i)}" font-family="Helvetica Neue, Arial" font-size="${W * .056}" fill="#1b2026">${esc(l)}</text>`).join('')}`;
  return { g, h: W * (.2 + .07 * ls.length) };
}
