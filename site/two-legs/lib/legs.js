/* legs.js — Two Legs: the cast as cut-out pictures (img/cast/, cut from the user's art pack by
   tools/two-legs/cutouts.py), the captions, the title and the phone screens every chapter uses. */
'use strict';
const CAST = {"biscuit_body_back": [1024, 1536], "biscuit_curled_sleeping": [1264, 1017], "biscuit_headB": [1024, 1536], "biscuit_headF": [1024, 1536], "biscuit_headP": [1024, 1536], "biscuit_head_back_turned": [798, 1504], "biscuit_petcam_look_up": [884, 1254], "biscuit_side_walk": [942, 959], "biscuit_sit_front": [934, 1488], "biscuit_stand_back": [795, 1507], "biscuit_stand_back_hall": [718, 1077], "biscuit_stand_front_stare": [801, 1489], "biscuit_stand_front_tilt": [801, 1503], "biscuit_stand_side_limp": [747, 1488], "biscuit_stand_side_walk": [649, 1476], "cat_bowl": [1066, 584], "door_lever": [1802, 988], "empty_glass": [606, 835], "june_bed_awake": [1894, 712], "june_head_closeup": [991, 1077], "june_head_pillow_closeup": [1920, 1070], "june_pyjamas_front": [505, 1487], "june_pyjamas_glass": [503, 1489], "june_sit_phone_morning": [962, 1429], "petcam_device": [586, 853]};
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

// Biscuit upright from behind, his head able to turn all the way round: turn(u) 0 the back of his head, 0.5 his
// profile (from the walking picture), 1 his face. Pieces share one 1024 x 1536 canvas; his feet are at canvas (509, 1528).
// One cat, one size: BISCUIT.stand is his standing height for a given world scale; the other pictures are scaled
// so his head is the same size in every one of them (head heights measured on each picture).
const BISCUIT = { head: 340 / 1507, sit: 1488 / 440, walk: 959 / 325 };
const catH = (U, pose) => pose === 'stand' ? U : U * BISCUIT.head * BISCUIT[pose];
function biscuitTurner(parent) {
  const g = mk('g', {}, parent), img = (n, p) => mk('image', { href: `../img/cast/${n}.webp`, x: -509, y: -1528, width: 1024, height: 1536 }, p);
  img('biscuit_body_back', g);
  const hb = mk('g', {}, g), hp = mk('g', {}, g), hf = mk('g', {}, g); img('biscuit_headB', hb); img('biscuit_headP', hp); img('biscuit_headF', hf);
  const eyes = stareEyes(hf, [[448.5 - 509, 211.5 - 1528], [577.5 - 509, 212.5 - 1528]], { r: 24, pr: 10 });
  const peye = stareEyes(hp, [[651 - 509, 207 - 1528]], { r: 19, pr: 8 }); peye.look(.7, 0);
  const HC = [0, 190 - 1528];   // the head's centre (neck pivot)
  // the head's phases: [which, squash x, shift x, tilt] at a turn u
  const phase = u => {
    if (u < .1) { const a = span(u, 0, .1); return ['b', 1 - .03 * a, 0, -4 * a]; }
    if (u < .42) { const a = span(u, .1, .42); return ['b', 1 - .42 * a, 55 * a, -4 + 2 * a]; }
    if (u < .5) { const a = span(u, .42, .5); return ['p', .72 + .28 * a, 22 * (1 - a), -2]; }
    if (u < .62) return ['p', 1, 0, -2 - 2 * span(u, .5, .62)];
    if (u < .78) { const a = span(u, .62, .78); return ['p', 1 - .38 * a, -40 * a, -4 + 2 * a]; }
    const a = span(u, .78, 1); return ['f', .7 + .3 * a + .04 * Math.sin(Math.PI * a), -30 * (1 - a), -2 * (1 - a)];
  };
  return { g, eyes,
    pose({ x, y, h = 600, turn = 0, tilt = 0, bob = 0, breathe = 0 }) {
      const k = h / 1507; tf(g, `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${k.toFixed(4)},${(k * (1 + breathe)).toFixed(4)})`);
      const [w, sx, dx, t0] = phase(Math.max(0, Math.min(1, turn)));
      const t = `translate(${(HC[0] + dx).toFixed(1)},${(HC[1] + bob).toFixed(1)}) rotate(${(t0 + tilt).toFixed(2)}) scale(${sx.toFixed(3)},1) translate(${-HC[0]},${-HC[1]})`;
      vis(hb, w === 'b'); vis(hp, w === 'p'); vis(hf, w === 'f'); tf(hb, t); tf(hp, t); tf(hf, t);
    } };
}
// A small digital alarm clock (red digits) at (x, y) = the middle of its base, w wide: { g, set('3:07') }.
function alarmClock(parent, x, y, w = 110) {
  const g = mk('g', {}, parent), h = w * .52, X = x - w / 2, Y = y - h;
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const dw = w * .13, dh = w * .25, th = w * .028;
  const digit = (d, dx, dy) => (SEG[d] || '').split('').map(s => {
    const r = { a: [dx, dy, dw, th], g: [dx, dy + dh / 2 - th / 2, dw, th], d: [dx, dy + dh - th, dw, th], f: [dx, dy, th, dh / 2], b: [dx + dw - th, dy, th, dh / 2],
      e: [dx, dy + dh / 2, th, dh / 2], c: [dx + dw - th, dy + dh / 2, th, dh / 2] }[s];
    return `<rect x="${r[0].toFixed(1)}" y="${r[1].toFixed(1)}" width="${r[2].toFixed(1)}" height="${r[3].toFixed(1)}" rx="${(th / 2).toFixed(1)}"/>`; }).join('');
  g.innerHTML = `<defs><filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(w * .02).toFixed(1)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="clkGlow"><stop offset="0" stop-color="#ff3b2f" stop-opacity=".35"/><stop offset="1" stop-color="#ff3b2f" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${x}" cy="${y - h * .4}" rx="${w * 1.3}" ry="${h * 1.4}" fill="url(#clkGlow)"/>
    <rect x="${X + w * .1}" y="${y - 3}" width="${w * .14}" height="5" rx="2" fill="#15161c"/><rect x="${X + w * .76}" y="${y - 3}" width="${w * .14}" height="5" rx="2" fill="#15161c"/>
    <path d="M${X},${y - 2} L${X + w * .06},${Y} L${X + w * .94},${Y} L${X + w},${y - 2} Z" fill="#2b2e3a"/>
    <path d="M${X + w * .06},${Y} L${X + w * .94},${Y} L${X + w * .92},${Y + 4} L${X + w * .08},${Y + 4} Z" fill="#3c4050"/>
    <rect x="${X + w * .1}" y="${Y + h * .16}" width="${w * .8}" height="${h * .64}" rx="${w * .04}" fill="#0a0b10"/>
    <rect x="${X + w * .42}" y="${Y - w * .05}" width="${w * .16}" height="${w * .05}" rx="2" fill="#4a4e60"/>
    <g data-d fill="#ff3b2f" filter="url(#ledGlow)"></g>`;
  const dg = g.querySelector('[data-d]'), ox = X + w * .17, oy = Y + h * .25;
  return { g, set(t) { if (dg._t === t) return; dg._t = t; const [hh, mm] = t.split(':');
    dg.innerHTML = digit(+hh, ox + dw * 1.25, oy) + `<rect x="${ox + dw * 2.55}" y="${oy + dh * .25}" width="${th}" height="${th}"/><rect x="${ox + dw * 2.55}" y="${oy + dh * .65}" width="${th}" height="${th}"/>` +
      digit(+mm[0], ox + dw * 3.0, oy) + digit(+mm[1], ox + dw * 4.25, oy); } };
}

/* ---------- captions (burned in, one sentence at a time) and the title ---------- */
const CAP = { x: 800, y: 836, size: 44, lineH: 54, perLine: 34, font: "'Helvetica Neue', Arial, sans-serif", hi: '#ffd84a' };
// Captions burned in, at most ten words at a time (tools/two-legs/eleven_in.py cuts them), the word she is saying in
// yellow: each clip's forced-aligned words (TIMINGS[clip].words) placed by the joined scene's parts.
function legCaptions(p, scene, pre) {
  const T = TIMINGS[scene], words = [];
  for (const [clip, at] of Object.entries(T.parts).sort((a, b) => a[1] - b[1])) for (const [a, b, w] of TIMINGS[clip]?.words || []) words.push({ t0: pre + at + a, t1: pre + at + b, w });
  const cues = T.cues.map(([t0, text, t1], i) => ({ t0: pre + t0 - .05, t1: pre + Math.min(t1 ?? T.dur, T.cues[i + 1]?.[0] ?? T.dur), text }));
  for (const c of cues) {   // the cue's own words (by order in the text, their times from the aligned list)
    const n = c.text.split(' ').length, k = words.findIndex(w => w.t0 >= c.t0 - .02); c.words = words.slice(k, k + n);
    const lines = [[]]; let len = 0;
    c.text.split(' ').forEach((w, i) => { if (len + w.length > CAP.perLine && lines.at(-1).length) { lines.push([]); len = 0; } lines.at(-1).push(i); len += w.length + 1; });
    if (lines.length === 2 && lines[1].length < 3 && lines[0].length > 4) lines[1].unshift(lines[0].pop());   // no lone word on a line
    c.lines = lines;
  }
  const g = mk('g', { 'pointer-events': 'none', 'font-family': CAP.font, 'font-weight': 800, 'text-anchor': 'middle', 'font-size': CAP.size }, p);
  let shown = null, spans = [];
  const build = c => {
    g.innerHTML = ''; spans = [];
    if (!c) return;
    const ws = c.text.split(' ');
    c.lines.forEach((ids, li) => {
      const t = mk('text', { x: CAP.x, y: CAP.y + (li - c.lines.length + 1) * CAP.lineH, fill: '#f6f2ea', stroke: '#05060a', 'stroke-width': 10, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g);
      ids.forEach((i, j) => { const s = mk('tspan', {}, t); s.textContent = (j ? ' ' : '') + ws[i]; spans[i] = s; });
    });
  };
  return (q, on = true) => {
    const c = on ? cues.find(c => q >= c.t0 && q < c.t1) : null;
    if (c !== shown) { build(c); shown = c; }
    if (!c) return;
    let cur = -1; c.words.forEach((w, i) => { if (q >= w.t0 - .03 && q < (c.words[i + 1]?.t0 ?? w.t1 + .15)) cur = i; });
    spans.forEach((s, i) => { const f = i === cur ? CAP.hi : '#f6f2ea'; if (s._f !== f) s.setAttribute('fill', s._f = f); });
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

/* ---------- the pet camera ---------- */
// Night vision: everything under it in grey-green (put filter="url(#nv)" on a group). Defined once per page.
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="nv" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2 .45 .1 0 .03  .26 .58 .13 0 .05  .21 .48 .11 0 .04  0 0 0 1 0"/></filter></defs></svg>`);
// The camera's overlay: REC dot, the camera's name, the time (pose({ t: 'HH:MM:SS', rec })) and a sound meter (level 0…1).
function camOverlay(p, name = 'HALLWAY CAM') {
  const g = mk('g', { 'pointer-events': 'none', 'font-family': "'Courier New', monospace", 'font-weight': 700 }, p);
  g.innerHTML = `<rect x="-10" y="-10" width="1620" height="920" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="40"/>
    <circle data-r cx="70" cy="66" r="13" fill="#ff3b2f"/><text x="94" y="78" font-size="34" fill="#e9f3e6" stroke="#000" stroke-width="5" paint-order="stroke">REC</text>
    <text x="1540" y="78" text-anchor="end" font-size="34" fill="#e9f3e6" stroke="#000" stroke-width="5" paint-order="stroke">${name}</text>
    <text data-t x="1540" y="848" text-anchor="end" font-size="38" fill="#e9f3e6" stroke="#000" stroke-width="5" paint-order="stroke"></text>
    <g data-m transform="translate(60,770)"><text x="0" y="-14" font-size="24" fill="#e9f3e6" stroke="#000" stroke-width="4" paint-order="stroke">AUDIO</text></g>`;
  const T = g.querySelector('[data-t]'), R = g.querySelector('[data-r]'), M = g.querySelector('[data-m]'), bars = [];
  for (let i = 0; i < 28; i++) bars.push(mk('rect', { x: i * 11, y: 0, width: 7, height: 4, fill: '#9cf09a' }, M));
  return { g, pose({ t = '03:07:00', rec = true, level = 0, q = 0 } = {}) {
    if (T._t !== t) T.textContent = T._t = t; R.setAttribute('opacity', rec ? '1' : '0');
    vis(M, level > 0);
    bars.forEach((b, i) => { const h = 4 + level * 70 * Math.abs(Math.sin(q * 6.3 + i * .9) * Math.sin(q * 2.1 + i * .37)); b.setAttribute('y', (-h).toFixed(1)); b.setAttribute('height', h.toFixed(1)); });
  } };
}
const clockAdd = (base, secs) => { const [h, m, s] = base.split(':').map(Number), t = h * 3600 + m * 60 + s + Math.floor(secs);
  return [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(n => String(n).padStart(2, '0')).join(':'); };
