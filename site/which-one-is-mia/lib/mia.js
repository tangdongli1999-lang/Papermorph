/* mia.js — Which One Is Mia?'s cast and props, on paper.js and cast.js (load after cast.js). Built on the figure kit
   made for Hide and Seek (hsFigure, frontReach, nightLight, hsCaptions, hsTitle): see that book's lib/hide.js.

   hsFigure is cast.js's storybook figure (kind 2) with: a head that can be smaller (headS), bigger eyes (eyeK), a back
   view (back), front arms drawn over the face (rFront / lFront), and hair drawn behind and over the head
   (hairBackP/F, hairTopP/F: Jess's bun, Mia's curls). jessPuppet / miaPuppet below; the phone, the door, the beds
   and the covers are props. Palette: dark dorm blue, the phone's cold light, the hall's warm line under the door; red
   only for the bed Mia's caption. */
'use strict';
// The sets' larger paper filter, for the big props (wardrobe, bed, curtain): live for the page and in every bake.
const PAPER_BIG = `<filter id="paperBig" x="-5%" y="-10%" width="110%" height="125%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="cut"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="11" result="fib"/>
    <feColorMatrix in="fib" type="matrix" values="0 0 0 0 .25  0 0 0 0 .17  0 0 0 0 .08  .5 0 0 0 -.15" result="tint"/>
    <feComposite in="tint" in2="cut" operator="in" result="grain"/>
    <feMerge result="tex"><feMergeNode in="cut"/><feMergeNode in="grain"/></feMerge>
    <feDropShadow in="tex" dx="4" dy="6" stdDeviation="5" flood-color="#000" flood-opacity=".4"/>
  </filter>`;
PAPER_EXTRA.push(PAPER_BIG);
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${PAPER_BIG}</defs></svg>`);
const HS = {
  night: '#0e1424', nightHi: '#1b2540', ink: '#0a0d16', lamp: '#ffcf7a', lampHot: '#fff2c8', red: '#c8161d',
  pale: '#cfd6d2', paleShade: '#a9b3b0', nail: '#8e9893',
};

const REST_HS = { ...REST_FIGURE, hat: false, tail: 0, rFront: false, lFront: false, back: false };
function hsFigure(parent, { skin = '#f1c9a8', coat, coatFar, legs, legsFar, shoe, hair, hairFar = hair, cheek = '#e79a86',
  headS = 1, eyeK = 1, pony = false, back = '', chest = '', chestF = '', top = null, holds = {}, skirt = false,
  hairBackP = '', hairBackF = '', hairTopP = '', hairTopF = '', mouthK = 1 } = {}) {
  const ink = '#1a1210', held = (side, x, y) => Object.entries(holds).map(([k, s]) => `<g data-p="hold${side}_${k}" transform="translate(${x},${y})">${s}</g>`).join('');
  const hs = `translate(0,-146) scale(${headS}) translate(0,146)`;   // the head scaled about the neck pin
  const lower = skirt ? 'M-38,-46 L38,-46 C48,0 58,30 64,56 Q0,70 -64,56 C-58,30 -48,0 -38,-46 Z' : 'M-36,-46 L36,-46 L40,10 Q0,18 -40,10 Z';
  const lowerF = skirt ? 'M-40,-46 L40,-46 C52,0 62,30 68,56 Q0,70 -68,56 C-62,30 -52,0 -40,-46 Z' : 'M-38,-46 L38,-46 L42,10 Q0,18 -42,10 Z';
  const ey = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="${4.6 * eyeK}" ry="${6.4 * eyeK}" fill="${ink}"/><circle cx="${cx + 1.4 * eyeK}" cy="${cy - 2.4 * eyeK}" r="${1.5 * eyeK}" fill="#fff" opacity=".85"/>`;
  // a ponytail on its own pin at the back of the head, so it swings
  const tailP = pony ? `<g data-p="tailP"><g filter="url(#paper)"><path d="M-36,-214 C-64,-210 -74,-176 -66,-136 C-62,-118 -52,-108 -44,-104 C-52,-130 -48,-166 -30,-198 Z" fill="${hair}"/>
      <rect x="-40" y="-218" width="12" height="14" rx="4" transform="rotate(-30,-34,-211)" fill="#7b2f3b"/></g></g>` : '';
  const fig = puppet(parent, `<g data-p="body">
    ${legPiece('legF', legsFar, shoe)}${legPiece('legN', legs, shoe)}
    <g filter="url(#paper)"><path d="${lower}" fill="${coat}"/></g>
    <g data-p="upper">
      ${back}
      <g data-p="armF"><g filter="url(#paper)"><rect x="-4.5" y="-134" width="17" height="62" rx="8" fill="${coatFar}"/></g>
        <g data-p="foreF"><g filter="url(#paper)"><rect x="-2" y="-80" width="12" height="54" rx="6" fill="${skin}"/><circle cx="4" cy="-26" r="9" fill="${skin}"/></g>${pinAt(4, -76)}</g>${pinAt(4, -128)}</g>
      <g filter="url(#paper)"><path d="M-28,-128 L26,-128 L34,-42 L-34,-42 Z" fill="${coat}"/>${top ? `<path d="M14,-128 L26,-128 L34,-42 L20,-42 Z" fill="${top}"/>` : ''}<rect x="-8" y="-150" width="16" height="28" fill="${skin}"/>
        <path d="M-30,-132 Q0,-142 30,-130 L28,-118 Q0,-126 -30,-118 Z" fill="${coatFar}"/>${chest}</g>
      <g data-p="headP"><g transform="${hs}">${tailP}<g filter="url(#paper)">${hairBackP}
        <path d="M-44,-186 C-48,-244 34,-256 52,-212 L30,-204 L-6,-206 L-10,-160 L-34,-152 C-46,-162 -44,-176 -44,-186 Z" fill="${hairFar}"/>
        <circle cx="14" cy="-192" r="40" fill="${skin}"/><circle cx="53" cy="-189" r="7" fill="${skin}"/>
        ${pony ? `<path d="M-30,-196 C-34,-238 22,-252 56,-212 Q30,-226 8,-214 Q-12,-214 -22,-196 L-26,-176 Z" fill="${hair}"/>`
               : `<path d="M-28,-200 C-30,-238 20,-250 54,-210 Q32,-222 12,-206 Q-4,-216 -14,-198 Q-20,-186 -16,-172 L-28,-176 Z" fill="${hair}"/><path d="M8,-232 l6,-14 l4,13 l7,-10 l1,12" fill="${hair}"/>`}
        <circle cx="31" cy="-176" r="8.5" fill="${cheek}" opacity=".7"/>${hairTopP}</g>
        <g data-p="lookP"><g class="eyeO">${ey(34, -198)}</g></g>
        <g class="eyeC"><path d="M29,-197 Q34,-193 39,-197" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/></g>
        <path data-p="browP" d="M26,-${209 + 2 * (eyeK - 1) * 6} L41,-${208 + 2 * (eyeK - 1) * 6}" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>
        <use class="mouth" href="#mX" transform="translate(41,-172) scale(.85)"/>${pinAt(0, -146)}</g></g>
      <g data-p="arm"><g filter="url(#paper)"><rect x="6" y="-134" width="17" height="64" rx="8" fill="${coat}"/></g>
        <g data-p="fore"><g filter="url(#paper)"><rect x="8.5" y="-80" width="12" height="54" rx="6" fill="${skin}"/><circle cx="14.5" cy="-26" r="9" fill="${skin}"/></g>
          ${held('N', 14.5, -26)}${pinAt(14.5, -76)}</g>${pinAt(14.5, -128)}</g></g></g>
  <g data-p="bodyF">
    <g filter="url(#paper)"><rect x="-21" y="${skirt ? 46 : 0}" width="16" height="${skirt ? 114 : 160}" rx="7" fill="${legs}"/><rect x="5" y="${skirt ? 46 : 0}" width="16" height="${skirt ? 114 : 160}" rx="7" fill="${legs}"/>
      <ellipse cx="-13" cy="164" rx="12" ry="7" fill="${shoe}"/><ellipse cx="13" cy="164" rx="12" ry="7" fill="${shoe}"/></g>
    <g filter="url(#paper)"><path d="${lowerF}" fill="${coat}"/></g>
    <g filter="url(#paper)"><path d="M-30,-128 L30,-128 L38,-42 L-38,-42 Z" fill="${coat}"/>${top ? `<path d="M-9,-128 L9,-128 L12,-42 L-12,-42 Z" fill="${top}"/>` : ''}<rect x="-8" y="-150" width="16" height="28" fill="${skin}"/>
      <path d="M-32,-132 Q0,-144 32,-132 L30,-120 Q0,-130 -30,-120 Z" fill="${coatFar}"/>${chestF}</g>
    ${frontArm('lArm', -30, -126, coat, skin, 54, 50)}
    ${frontArm('rArm', 30, -126, coat, skin, 54, 50, held('F', 30, -26))}
  </g>
  <g data-p="headF"><g transform="${hs}"><g filter="url(#paper)">${hairBackF}
    ${pony ? `<path d="M30,-222 C70,-214 78,-176 70,-138 C66,-124 58,-116 52,-112 C58,-140 56,-176 40,-206 Z" fill="${hairFar}"/>` : ''}
    <path d="M-50,-178 C-60,-240 60,-240 50,-178 Q40,-170 30,-178 L-30,-178 Q-40,-170 -50,-178 Z" fill="${hairFar}"/><circle cx="0" cy="-188" r="42" fill="${skin}"/>
    ${pony ? `<path d="M-44,-192 C-48,-250 46,-252 44,-194 Q30,-226 4,-224 Q-6,-212 -14,-226 Q-34,-222 -44,-192 Z" fill="${hair}"/>`
           : `<path d="M-44,-196 C-46,-250 46,-250 44,-196 Q24,-222 0,-216 Q-24,-222 -44,-196 Z" fill="${hair}"/><path d="M-6,-234 l4,-16 l5,14 l6,-12 l2,14" fill="${hair}"/>`}
    <circle cx="-23" cy="-176" r="8" fill="${cheek}" opacity=".7"/><circle cx="23" cy="-176" r="8" fill="${cheek}" opacity=".7"/>${hairTopF}</g>
    <g data-p="lookF"><g class="eyeO">${ey(-14, -196)}${ey(14, -196)}</g></g>
    <g class="eyeC"><path d="M-19,-195 Q-14,-191 -9,-195 M9,-195 Q14,-191 19,-195" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/></g>
    <path data-p="browL" d="M-22,-${208 + 12 * (eyeK - 1)} L-7,-${207 + 12 * (eyeK - 1)}" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/><path data-p="browR" d="M7,-${207 + 12 * (eyeK - 1)} L22,-${208 + 12 * (eyeK - 1)}" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>
    <use class="mouth" href="#mX" transform="translate(0,-166)"/></g></g>
  <g data-p="backF"><g transform="${hs}"><g filter="url(#paper)">
    ${pony ? `<path d="M-8,-214 C-30,-180 -24,-140 -10,-112 C-2,-100 8,-100 12,-112 C22,-140 26,-180 8,-214 Z" fill="${hairFar}"/>` : ''}
    <circle cx="0" cy="-190" r="45" fill="${hair}"/><path d="M-44,-200 C-40,-236 40,-236 44,-200" fill="none" stroke="${hairFar}" stroke-width="4"/>
    ${pony ? `<rect x="-8" y="-222" width="16" height="12" rx="4" fill="#7b2f3b"/>` : ''}</g></g></g>
  <g data-p="armsTop"></g>`,
  REST_HS, (P, o, j, g) => {
    if (o.sit !== false) {
      const H = Math.max(10, Math.min(86, o.sit === true ? 86 : +o.sit)), r = Math.PI / 180;
      const knee = a => a - Math.acos(Math.max(0, Math.min(1, (H - 86 * Math.cos(a * r)) / 86))) / r;
      o = { ...o, near: o.near - 90, far: o.far - 84, kNear: o.kNear + knee(90), kFar: o.kFar + knee(84), hop: o.hop + (172 - H) * o.s };
    }
    if (o.crouch) {
      const c = o.crouch, r = Math.PI / 180, n = { near: o.near - 62 * c, far: o.far - 50 * c, kNear: o.kNear + 104 * c, kFar: o.kFar + 100 * c };
      const reach = (a, k) => 86 * Math.cos(a * r) + 86 * Math.cos((a + k) * r), drop = 172 - Math.max(reach(n.near, n.kNear), reach(n.far, n.kFar));
      o = { ...o, ...n, hop: o.hop + Math.max(0, drop) * o.s };
    }
    const { front, ua, fa } = common(P, o, j, g, { neck: [0, -146], sh: [14.5, -128], el: [14.5, -76], fsh: [30, -126], fup: 54, knee: 86, waist: -44 });
    // a front hand at the face (over the eyes, a finger to the lips) is drawn in front of the head: rFront / lFront
    for (const [k, on] of [['rArm', o.rFront], ['lArm', o.lFront]]) { const home = on ? P.armsTop : P.bodyF; if (P[k].parentNode !== home) home.appendChild(P[k]); }
    vis(P.armsTop, front); vis(P.backF, front && o.back);
    tf(P.lookP, `translate(${(3 * o.look).toFixed(1)},0)`); tf(P.lookF, `translate(${(4 * o.look).toFixed(1)},0)`);
    for (const k of ['browP', 'browL', 'browR']) vis(P[k], o.brow !== 0);
    tf(P.browP, `rotate(${(-16 * o.brow).toFixed(1)},26,-209)`);
    tf(P.browL, `rotate(${(-16 * o.brow).toFixed(1)},-22,-208)`); tf(P.browR, `rotate(${(16 * o.brow).toFixed(1)},22,-208)`);
    if (P.tailP) tf(P.tailP, `rotate(${(o.tail + j(12) * 1.2).toFixed(2)},-34,-210)`);
    vis(P.armF, o.fua !== null && !front);
    if (o.fua !== null) { tf(P.armF, `rotate(${(o.fua + j(10) * .6).toFixed(2)},4,-128)`); tf(P.foreF, `rotate(${(o.ffa + j(11) * .6).toFixed(2)},4,-76)`); }
    for (const k of Object.keys(holds)) {
      vis(P[`holdN_${k}`], o.hold === k); vis(P[`holdF_${k}`], o.hold === k);
      tf(P[`holdN_${k}`], `translate(14.5,-26) rotate(${(-(o.lean + ua + fa)).toFixed(2)})`);
      tf(P[`holdF_${k}`], `translate(30,-26) rotate(${(-(o.rua + o.rfa)).toFixed(2)})`);
    }
  });
  return fig;
}

/* ---------- reaching with a front arm ----------
   frontReach(fig pose o, 'R' | 'L', [x, y] in the parent's coordinates) → { rua, rfa } or { lua, lfa }: the front arm's
   angles that put its hand on the point (two links: 52 to the elbow, 46 on to the hand's centre), the elbow kept low and
   outside; far > 1 when the point is out of reach (the hand stops short, along the line). */
function frontReach(o, side, [px, py], { up = 52, fore = 46 } = {}) {
  const s = o.s || 1, sx = side === 'R' ? 30 : -30, sy = -126;
  const tx = (px - o.x) / s - sx, ty = (py - o.y) / s - sy, d = Math.hypot(tx, ty), far = d / (up + fore);
  const dd = Math.min(d, up + fore - .01), a = (up * up - fore * fore + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, up * up - a * a));
  const ux = tx / d, uy = ty / d, flip = side === 'R' ? 1 : -1;
  // of the two elbows, the one further out to the arm's own side (and lower)
  const e1 = [a * ux + h * -uy, a * uy + h * ux], e2 = [a * ux - h * -uy, a * uy - h * ux];
  const E = (e1[0] * flip + e1[1] * .3) > (e2[0] * flip + e2[1] * .3) ? e1 : e2;
  const ang = (vx, vy) => Math.atan2(-vx, vy) * 180 / Math.PI;   // the angle that turns (0, 1) to (vx, vy)
  const ua = ang(E[0], E[1]), fa = ang(ux * dd - E[0], uy * dd - E[1]) - ua;
  return side === 'R' ? { rua: ua, rfa: fa, far } : { lua: ua, lfa: fa, far };
}

// The night: everything darkens away from the lamp; `dark` 0…1 turns the room to black (the lamp off).
function nightLight(parent, [lx, ly] = [450, 800]) {
  const id = 'hsNight' + Math.random().toString(36).slice(2, 7), g = mk('g', { 'pointer-events': 'none' }, parent);
  g.innerHTML = `<defs><radialGradient id="${id}" cx="${lx}" cy="${ly}" r="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#05070e" stop-opacity="0"/><stop offset=".28" stop-color="#05070e" stop-opacity=".08"/><stop offset=".7" stop-color="#05070e" stop-opacity=".42"/><stop offset="1" stop-color="#05070e" stop-opacity=".6"/></radialGradient></defs>
    <rect x="-400" y="-400" width="1700" height="2500" fill="url(#${id})"/>`;
  const black = mk('rect', { x: -400, y: -400, width: 1700, height: 2500, fill: '#000', opacity: 0 }, g);
  return { g, pose({ dark = 0 } = {}) { black.setAttribute('opacity', dark.toFixed(3)); } };
}
/* ---------- burned-in captions ----------
   A Short carries its words in the picture, so the captions are drawn on the stage (the player's own captions stay
   off): white with a dark edge for Sam and Leo, red for the Other, in the platforms' safe area (x 50–810, the line
   above y 1290). hsCaptions(p, scene, pre, { red: [clip, …], extra: [[t0, text, t1], …] }) shows the scene's cues
   (join.py's, with their ends) on the scene clock, a cue in red when it falls in one of the `red` clips; `extra` are
   red lines of its own (the Other's count, half a beat behind Sam's), drawn faint. Returns pose(q). */
const CAP = { x: 430, y: 1262, size: 46, lineH: 54, maxW: 700, font: "'Helvetica Neue', Arial, sans-serif" };
function hsCaptions(p, scene, pre, { red = [], extra = [] } = {}) {
  const T = TIMINGS[scene], parts = Object.entries(T.parts).sort((a, b) => a[1] - b[1]);
  const owner = t => { let c = null; for (const [k, at] of parts) if (at <= t + 1e-6) c = k; return c; };
  const own = T.ownCues || T.cues;   // a page that adds lines to cues for the .srt keeps the scene's own here
  const cues = own.map(([t0, text, t1], i) => ({ t0: pre + t0, t1: pre + (t1 ?? (own[i + 1]?.[0] ?? T.dur)), text, red: red.includes(owner(t0)) }));
  const reds = extra.map(([t0, text, t1]) => ({ t0, t1, text, red: true, faint: true }));   // the count's echo: faint red
  const g = mk('g', { 'pointer-events': 'none', 'font-family': CAP.font, 'font-weight': 700, 'text-anchor': 'middle' }, p);
  const wrap = text => { const words = text.split(' '), lines = ['']; for (const w of words) { const t = (lines.at(-1) + ' ' + w).trim(); if (t.length * CAP.size * .55 > CAP.maxW && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; } return lines; };
  const line = (fill) => mk('text', { x: CAP.x, 'font-size': CAP.size, fill, stroke: '#05060a', 'stroke-width': 9, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g);
  const white = [line('#f3efe6'), line('#f3efe6')], redL = [line(HS.red), line(HS.red)];
  const set = (els, text, y0) => { const ls = text ? wrap(text) : []; els.forEach((e, i) => { const t = ls[i] || ''; if (e._s !== t) { e.textContent = e._s = t; } e.setAttribute('y', y0 + (i - ls.length + 1) * CAP.lineH); vis(e, !!t); }); };
  return q => {
    const w = cues.filter(c => !c.red && q >= c.t0 && q < c.t1).at(-1), r = [...cues.filter(c => c.red), ...reds].filter(c => q >= c.t0 && q < c.t1).at(-1);
    const both = w && r;
    set(white, w?.text || '', both ? CAP.y - CAP.lineH - 6 : CAP.y);
    set(redL, r?.text || '', CAP.y); redL.forEach(e => { const o = r?.faint ? '.8' : '1'; if (e._o !== o) e.setAttribute('opacity', e._o = o); });
  };
}
// The title in the dark: HIDE AND SEEK in cut-paper capitals, each letter a little crooked; pose({ o }).
function hsTitle(p, x = 450, y = 760, text = 'WHICH ONE IS MIA?', size = 70, track = 6) {
  const g = mk('g', { 'pointer-events': 'none' }, p), ch = [...text];
  const rot = ch.map((_, i) => ((i * 53) % 9) - 4).join(' '), dy = ch.map((_, i) => (i ? (((i * 37) % 11) - ((i - 1) * 37 % 11)) * .6 : 0).toFixed(1)).join(' ');
  g.innerHTML = `<text x="${x}" y="${y}" rotate="${rot}" dy="${dy}" letter-spacing="${track}" font-family="Georgia, 'Times New Roman', serif"
      font-size="${size}" font-weight="700" fill="#d8d2c2" text-anchor="middle">${ch.join('')}</text>`;
  return { g, pose({ o = 1 } = {}) { g.setAttribute('opacity', o.toFixed(3)); } };
}


/* ---------- the cast ---------- */
const MIA_COL = { skin: '#c98f6a', hair: '#1d1512', hairFar: '#140e0c', tee: '#b0473a', teeFar: '#8f3a2f', pants: '#5d6273' };
const JESS_COL = { skin: '#eebd9a', hair: '#3b2618', hairFar: '#2c1c12', hood: '#8f88ab', hoodFar: '#766f92', pants: '#2f3550' };
// a phone in the hand, its screen lit: the room's only light for most of the film
const PHONE_HELD = `<g transform="translate(-1,-12) rotate(-6)"><rect x="-9" y="-17" width="18" height="31" rx="3.5" fill="#101216"/>
  <rect x="-7.2" y="-14.5" width="14.4" height="25" rx="2" fill="#bcd6ff"/></g>`;
// Mia's curls: a halo of round curls behind the head, and a few over the brow
const curls = (cx, cy, r, n, col) => Array.from({ length: n }, (_, i) => { const a = Math.PI * (.95 + 1.1 * i / (n - 1)), rr = r * (.86 + .14 * ((i * 7) % 3) / 2);
  return `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r="${(r * .36).toFixed(1)}" fill="${col}"/>`; }).join('');
const MIA_BACK_F = `<circle cx="0" cy="-196" r="52" fill="${MIA_COL.hairFar}"/>${curls(0, -196, 50, 11, MIA_COL.hairFar)}
  <circle cx="-46" cy="-160" r="20" fill="${MIA_COL.hairFar}"/><circle cx="46" cy="-160" r="20" fill="${MIA_COL.hairFar}"/>`;
const MIA_TOP_F = `${curls(0, -214, 34, 7, MIA_COL.hair)}`;
const MIA_BACK_P = `<circle cx="-8" cy="-200" r="50" fill="${MIA_COL.hairFar}"/>${curls(-8, -200, 48, 10, MIA_COL.hairFar)}<circle cx="-40" cy="-160" r="22" fill="${MIA_COL.hairFar}"/>`;
const MIA_TOP_P = `${curls(8, -222, 26, 6, MIA_COL.hair)}`;
// Jess's messy bun on top, a loose strand at each side
const JESS_BACK_F = `<circle cx="4" cy="-246" r="22" fill="${JESS_COL.hairFar}"/><path d="M-12,-262 q16,-14 32,0" fill="none" stroke="${JESS_COL.hair}" stroke-width="6"/>`;
const JESS_TOP_F = `<path d="M-38,-200 q-8,26 -2,46" fill="none" stroke="${JESS_COL.hair}" stroke-width="5" stroke-linecap="round"/><path d="M36,-202 q8,24 2,42" fill="none" stroke="${JESS_COL.hair}" stroke-width="5" stroke-linecap="round"/>`;
const JESS_BACK_P = `<circle cx="-18" cy="-244" r="21" fill="${JESS_COL.hairFar}"/>`;
const JESS_TOP_P = `<path d="M44,-200 q8,22 2,40" fill="none" stroke="${JESS_COL.hair}" stroke-width="5" stroke-linecap="round"/>`;

// Jess: 19, an oversized lilac hoodie, plaid pyjama trousers, socks, a messy bun; most of the film she holds her phone.
function jessPuppet(parent) {
  return hsFigure(parent, { skin: JESS_COL.skin, coat: JESS_COL.hood, coatFar: JESS_COL.hoodFar, legs: JESS_COL.pants, legsFar: '#262b42', shoe: '#d8d4cc',
    hair: JESS_COL.hair, hairFar: JESS_COL.hairFar, cheek: '#e39a86', headS: .86, eyeK: 1.08, skirt: false,
    chestF: `<path d="M-14,-128 q14,12 28,0" fill="none" stroke="${JESS_COL.hoodFar}" stroke-width="4"/><rect x="-16" y="-82" width="32" height="16" rx="5" fill="${JESS_COL.hoodFar}"/>`,
    hairBackF: JESS_BACK_F, hairTopF: JESS_TOP_F, hairBackP: JESS_BACK_P, hairTopP: JESS_TOP_P, holds: { phone: PHONE_HELD } });
}
// Mia: her roommate, the same age, dark curls, a rust T-shirt, grey joggers.
function miaPuppet(parent) {
  return hsFigure(parent, { skin: MIA_COL.skin, coat: MIA_COL.tee, coatFar: MIA_COL.teeFar, legs: MIA_COL.pants, legsFar: '#4b4f5e', shoe: '#e6e2da',
    hair: MIA_COL.hair, hairFar: MIA_COL.hairFar, cheek: '#b8705a', headS: .86, eyeK: 1.05, skirt: false,
    hairBackF: MIA_BACK_F, hairTopF: MIA_TOP_F, hairBackP: MIA_BACK_P, hairTopP: MIA_TOP_P });
}

/* Mia's face as her contact photo: a round crop, smiling, on the voicemail screen (and nowhere else that bright). */
const miaAvatar = (cx, cy, r) => `<g transform="translate(${cx},${cy}) scale(${r / 60})">
  <clipPath id="miaAv${cx}"><circle r="60"/></clipPath><g clip-path="url(#miaAv${cx})"><rect x="-60" y="-60" width="120" height="120" fill="#e9b04a"/>
  <g transform="translate(0,112) scale(.62)"><circle cx="0" cy="-196" r="58" fill="${MIA_COL.hairFar}"/>${curls(0, -196, 56, 11, MIA_COL.hairFar)}
  <rect x="-60" y="-130" width="120" height="80" rx="30" fill="${MIA_COL.tee}"/><circle cx="0" cy="-188" r="42" fill="${MIA_COL.skin}"/>${curls(0, -214, 34, 7, MIA_COL.hair)}
  <ellipse cx="-14" cy="-194" rx="5" ry="6.5" fill="#1a1210"/><ellipse cx="14" cy="-194" rx="5" ry="6.5" fill="#1a1210"/>
  <path d="M-15,-170 Q0,-156 15,-170" fill="none" stroke="#5a2a1e" stroke-width="3.4" stroke-linecap="round"/></g></g>
  <circle r="60" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="3"/></g>`;

/* The voicemail on the phone's screen, full frame (shots 1 and 3): the lock screen's clock, a voicemail card with
   Mia's photo, and a waveform that plays. pose({ q, progress 0…1, buzz (0/1: the screen shakes) }). */
function voicemailScreen(p) {
  const g = mk('g', { 'pointer-events': 'none' }, p);
  const bars = Array.from({ length: 38 }, (_, i) => 10 + Math.abs(Math.sin(i * 1.7) * 34 + Math.sin(i * .6) * 18));
  g.innerHTML = `<rect width="900" height="1600" fill="#03050a"/>
    <g data-p="dev"><rect x="120" y="150" width="660" height="1300" rx="78" fill="#0d0f14"/><rect x="146" y="176" width="608" height="1248" rx="58" fill="#0e1830"/>
      <rect x="146" y="176" width="608" height="1248" rx="58" fill="url(#vmGlow)"/>
      <text x="450" y="400" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="150" font-weight="200" fill="#e9efff">11:58</text>
      <text x="450" y="455" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="32" fill="#a8b6d6">Friday, 8 November</text>
      <rect x="186" y="560" width="528" height="330" rx="40" fill="#1d2a4a" fill-opacity=".92"/>
      ${miaAvatar(268, 650, 52)}
      <text x="346" y="636" font-family="'Helvetica Neue', Arial, sans-serif" font-size="40" font-weight="700" fill="#f3f6ff">Mia</text>
      <text x="346" y="682" font-family="'Helvetica Neue', Arial, sans-serif" font-size="29" fill="#9fb0d4">Voicemail · 0:07</text>
      <text x="676" y="636" text-anchor="end" font-family="'Helvetica Neue', Arial, sans-serif" font-size="26" fill="#8394bb">now</text>
      <g transform="translate(222,770)">${bars.map((h, i) => `<rect data-p="bar${i}" x="${i * 12.3}" y="${-h / 2}" width="7" height="${h}" rx="3.5" fill="#6f84b5"/>`).join('')}</g>
      <rect x="222" y="836" width="456" height="6" rx="3" fill="#3a4a72"/><rect data-p="prog" x="222" y="836" width="0" height="6" rx="3" fill="#e9efff"/>
      <rect x="380" y="1376" width="140" height="8" rx="4" fill="#e9efff" opacity=".6"/></g>
    <defs><radialGradient id="vmGlow" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3b5fae" stop-opacity=".35"/><stop offset="1" stop-color="#0e1830" stop-opacity="0"/></radialGradient></defs>`;
  const P = pieces(g);
  return { g, pose({ q = 0, progress = 0, buzz = 0 } = {}, f = 0) {
    tf(P.dev, buzz ? `translate(${(jit(f, 7) * 5).toFixed(1)},${(jit(f, 8) * 3).toFixed(1)})` : '');
    P.prog.setAttribute('width', (456 * Math.max(0, Math.min(1, progress))).toFixed(1));
    bars.forEach((h, i) => P['bar' + i].setAttribute('fill', i / bars.length < progress ? '#e9efff' : '#6f84b5'));
  } };
}

/* The dorm door (world px): a plain painted door in its frame, a deadbolt's thumb-turn above the handle, and under it
   the hall's warm light with the shadows of two feet. pose({ lock 0…1 (the thumb-turn's quarter turn), feet 0…1
   (the shadows' darkness), shift (px, the feet moving), shake (px, the door rattling), light }). Built at its floor
   centre (x, y). */
const DOOR = { x: 450, y: 1110, w: 200, h: 470 };   // a person at the back wall stands about 400 px tall
function dormDoor(parent) {
  const { w, h } = DOOR, g = mk('g', { transform: `translate(${DOOR.x},${DOOR.y})` }, parent);
  prop(g, `<g filter="url(#paperBig)"><rect x="${-w / 2 - 26}" y="${-h - 26}" width="${w + 52}" height="${h + 26}" fill="#2a3047"/>
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h - 10}" fill="#3a405c"/>
      <rect x="${-w / 2 + 24}" y="${-h + 36}" width="${w - 48}" height="${h * .36}" fill="none" stroke="#2f354f" stroke-width="7"/>
      <rect x="${-w / 2 + 24}" y="${-h * .5 + 10}" width="${w - 48}" height="${h * .36}" fill="none" stroke="#2f354f" stroke-width="7"/>
      <rect x="${w / 2 - 70}" y="${-h * .47}" width="42" height="12" rx="6" fill="#9a9384"/><circle cx="${w / 2 - 50}" cy="${-h * .47 + 6}" r="13" fill="#b3ab98"/>
      <rect x="${w / 2 - 66}" y="${-h * .58 - 22}" width="34" height="44" rx="8" fill="#8c8576"/>
      <rect x="-40" y="${-h + 80}" width="80" height="46" rx="5" fill="#d9d2c0" opacity=".9" transform="rotate(-3,0,${-h + 103})"/>
      <text x="0" y="${-h + 110}" text-anchor="middle" font-family="Georgia, serif" font-size="21" fill="#5a5243" transform="rotate(-3,0,${-h + 103})">J &amp; M</text></g>`);
  const turn = mk('g', { transform: `translate(${w / 2 - 49},${-h * .58})` }, g);
  mk('rect', { x: -5, y: -15, width: 10, height: 30, rx: 4, fill: '#d6cfbd' }, turn);
  const light = mk('rect', { x: -w / 2, y: -12, width: w, height: 12, fill: '#ffcf86' }, g);
  const glow = mk('rect', { x: -w / 2 - 60, y: -2, width: w + 120, height: 70, fill: 'url(#doorGlow)' }, g);
  g.insertAdjacentHTML('afterbegin', `<defs><linearGradient id="doorGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf86" stop-opacity=".38"/><stop offset="1" stop-color="#ffcf86" stop-opacity="0"/></linearGradient></defs>`);
  const feet = [mk('rect', { x: -50, y: -12, width: 36, height: 12, fill: '#0b0a0c' }, g), mk('rect', { x: 14, y: -12, width: 36, height: 12, fill: '#0b0a0c' }, g)];
  return { g, pose({ lock = 0, feet: fo = 1, shift = 0, shake = 0, light: lo = 1 } = {}, f = 0) {
    tf(g, `translate(${(DOOR.x + (shake ? jit(f, 4) * shake : 0)).toFixed(1)},${DOOR.y})`);
    tf(turn, `translate(${w / 2 - 49},${-h * .58}) rotate(${(90 * lock).toFixed(1)})`);
    light.setAttribute('opacity', lo.toFixed(2)); glow.setAttribute('opacity', lo.toFixed(2));
    feet.forEach((e, i) => { e.setAttribute('opacity', (fo * lo).toFixed(2)); e.setAttribute('x', (i ? 14 : -50) + shift + (i ? 1 : -1) * 4 * Math.sin(f * .7 + i)); });
  } };
}

/* A dorm bed with its duvet (world px; x is its left end, y the floor). pose({ lump 0…1 (someone under the duvet
   sits up: the duvet rises and slides down off them) }) — Mia's bed; Jess's has lump 0. Two layers, so a figure can
   sit between them: back (frame, mattress, pillow) and front (the duvet). */
function dormBed(parent, x, y, { w = 380, duvet = '#4a5578', duvetFar = '#3a4462' } = {}) {
  const back = prop(parent, `<g filter="url(#paperBig)"><rect x="${x}" y="${y - 250}" width="26" height="250" fill="#30283a"/>
      <rect x="${x}" y="${y - 120}" width="${w}" height="60" fill="#30283a"/><rect x="${x + 6}" y="${y - 150}" width="${w - 6}" height="36" rx="10" fill="#d8d6dd"/>
      <ellipse cx="${x + 80}" cy="${y - 158}" rx="62" ry="22" fill="#e6e4ea"/><rect x="${x + 8}" y="${y - 60}" width="20" height="60" fill="#30283a"/><rect x="${x + w - 26}" y="${y - 60}" width="20" height="60" fill="#30283a"/></g>`);
  // a figure in the bed shows only above the mattress: its legs are under the duvet (a still clip; the figure moves)
  const cid = 'bedClip' + Math.random().toString(36).slice(2, 7);
  parent.insertAdjacentHTML('beforeend', `<defs><clipPath id="${cid}"><rect x="${x - 200}" y="${y - 2000}" width="${w + 400}" height="${2000 - 90}"/></clipPath></defs>`);
  const slot = mk('g', { 'clip-path': `url(#${cid})` }, parent);
  const dv = mk('g', {}, parent);
  const cover = prop(dv, `<g filter="url(#paperBig)"><path d="M${x + 26},${y - 160} Q${x + w * .5},${y - 196} ${x + w},${y - 156} L${x + w + 8},${y - 70} Q${x + w * .5},${y - 54} ${x + 20},${y - 74} Z" fill="${duvet}"/>
      <path d="M${x + 40},${y - 150} Q${x + w * .5},${y - 180} ${x + w - 20},${y - 148}" fill="none" stroke="${duvetFar}" stroke-width="7"/></g>`);
  return { back, slot, dv, pose({ lump = 0 } = {}) {
    tf(cover, `translate(0,${(46 * lump).toFixed(1)}) skewX(${(-4 * lump).toFixed(2)})`);
  } };
}
