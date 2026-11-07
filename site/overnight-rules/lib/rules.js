/* rules.js — The Overnight Rules' cast, props and captions, on paper.js and cast.js (load after cast.js). Built on the
   figure kit made for Hide and Seek and Which One Is Mia? (hsFigure, frontReach, hsCaptions, hsTitle).

   hsFigure is cast.js's storybook figure (kind 2) with: a head that can be smaller or bigger (headS), bigger eyes (eyeK),
   a back view (back), front arms drawn over the face (rFront / lFront), hair drawn behind and over the head
   (hairBackP/F, hairTopP/F) and, here, a face overlay drawn over the eyes and mouth (faceP/F: Okafor's glasses, the
   Raincoat Man's shadowed face, Other-Dani's grin). Palette: the store's sick fluorescent green-white, night outside,
   the freezers' cold blue; red only for Other-Dani's captions. */
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

const REST_HS = { ...REST_FIGURE, hat: false, tail: 0, rFront: false, lFront: false, back: false, stepF: 0 };
function hsFigure(parent, { skin = '#f1c9a8', coat, coatFar, legs, legsFar, shoe, hair, hairFar = hair, cheek = '#e79a86',
  headS = 1, eyeK = 1, pony = false, back = '', chest = '', chestF = '', top = null, holds = {}, skirt = false,
  hairBackP = '', hairBackF = '', hairTopP = '', hairTopF = '', mouthK = 1, faceP = '', faceF = '' } = {}) {
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
        <use class="mouth" href="#mX" transform="translate(41,-172) scale(.85)"/>${faceP}${pinAt(0, -146)}</g></g>
      <g data-p="arm"><g filter="url(#paper)"><rect x="6" y="-134" width="17" height="64" rx="8" fill="${coat}"/></g>
        <g data-p="fore"><g filter="url(#paper)"><rect x="8.5" y="-80" width="12" height="54" rx="6" fill="${skin}"/><circle cx="14.5" cy="-26" r="9" fill="${skin}"/></g>
          ${held('N', 14.5, -26)}${pinAt(14.5, -76)}</g>${pinAt(14.5, -128)}</g></g></g>
  <g data-p="bodyF">
    <g data-p="legFL"><g filter="url(#paper)"><rect x="-21" y="${skirt ? 46 : 0}" width="16" height="${skirt ? 114 : 160}" rx="7" fill="${legs}"/><ellipse cx="-13" cy="164" rx="12" ry="7" fill="${shoe}"/></g></g>
    <g data-p="legFR"><g filter="url(#paper)"><rect x="5" y="${skirt ? 46 : 0}" width="16" height="${skirt ? 114 : 160}" rx="7" fill="${legs}"/><ellipse cx="13" cy="164" rx="12" ry="7" fill="${shoe}"/></g></g>
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
    <use class="mouth" href="#mX" transform="translate(0,-166)"/>${faceF}</g></g>
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
    // walking towards or away from us (front or back view): stepF -1…1 lifts one foot and then the other
    const lf = Math.max(0, o.stepF), rf = Math.max(0, -o.stepF);
    tf(P.legFL, `translate(0,${(-12 * lf).toFixed(1)}) scale(1,${(1 - .07 * lf).toFixed(3)})`); tf(P.legFR, `translate(0,${(-12 * rf).toFixed(1)}) scale(1,${(1 - .07 * rf).toFixed(3)})`);
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
   off): white with a dark edge, red for Other-Dani, low in the frame (centred, the line
   on y 828). hsCaptions(p, scene, pre, { red: [clip, …], extra: [[t0, text, t1], …] }) shows the scene's cues
   (join.py's, with their ends) on the scene clock, a cue in red when it falls in one of the `red` clips; `extra` are
   red lines of its own (the Other's count, half a beat behind Sam's), drawn faint. Returns pose(q). */
const CAP = { x: 800, y: 828, size: 40, lineH: 48, maxW: 1150, font: "'Helvetica Neue', Arial, sans-serif" };
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
function hsTitle(p, x = 800, y = 470, text = 'THE OVERNIGHT RULES', size = 84, track = 10) {
  const g = mk('g', { 'pointer-events': 'none' }, p), ch = [...text];
  const rot = ch.map((_, i) => ((i * 53) % 9) - 4).join(' '), dy = ch.map((_, i) => (i ? (((i * 37) % 11) - ((i - 1) * 37 % 11)) * .6 : 0).toFixed(1)).join(' ');
  g.innerHTML = `<text x="${x}" y="${y}" rotate="${rot}" dy="${dy}" letter-spacing="${track}" font-family="Georgia, 'Times New Roman', serif"
      font-size="${size}" font-weight="700" fill="#d8d2c2" text-anchor="middle">${ch.join('')}</text>`;
  return { g, pose({ o = 1 } = {}) { g.setAttribute('opacity', o.toFixed(3)); } };
}




/* ---------- the cast ---------- */
const RULES = { fluor: '#dfeee0', fluorDim: '#9fb8a6', night: '#070a12', freezer: '#bfe2ff', vest: '#2e6a50', vestFar: '#24543f',
  red: '#c8161d', ink: '#0d1210' };
// the store's name badge, on a vest's front (front view) and side (profile)
const badge = (name, x = 14, y = -112) => `<rect x="${x - 13}" y="${y - 7}" width="26" height="14" rx="2" fill="#f2efe6"/>
  <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="8" fill="#24543f">${name}</text>`;
const PHONE_HELD = `<g transform="translate(-1,-12) rotate(-6)"><rect x="-9" y="-17" width="18" height="31" rx="3.5" fill="#101216"/>
  <rect x="-7.2" y="-14.5" width="14.4" height="25" rx="2" fill="#bcd6ff"/></g>`;
const RECEIVER = `<g transform="translate(-2,-8) rotate(-10)"><rect x="-6" y="-26" width="12" height="52" rx="6" fill="#d8cdb4"/>
  <rect x="-9" y="-30" width="18" height="12" rx="5" fill="#cfc3a8"/><rect x="-9" y="18" width="18" height="12" rx="5" fill="#cfc3a8"/></g>`;
const CEREAL = `<g transform="translate(0,-18)"><rect x="-16" y="-24" width="32" height="44" fill="#d9822b"/><rect x="-16" y="-24" width="32" height="10" fill="#b8341f"/>
  <circle cx="0" cy="2" r="8" fill="#f2d05a"/></g>`;
// a wet mop held at the handle, its head on the floor (the hand is about hip height)
const MOP_HELD = `<g><rect x="-3" y="-150" width="6" height="335" rx="3" fill="#c9b48a"/><rect x="-8" y="176" width="16" height="10" fill="#8a8f93"/>
  <path d="M-44,184 h88 l8,24 h-104 Z" fill="#e3dccb"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${-40 + i * 10},206 l${(i % 3) - 1},12" stroke="#cfc6b2" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
// a cardboard case of cereal boxes, carried in front at the hip
const CASE_HELD = `<g transform="translate(-30,-30)"><g filter="url(#paper)"><rect x="-44" y="-36" width="88" height="62" fill="#c49a62"/><rect x="-44" y="-36" width="88" height="12" fill="#a97f4a"/>
  ${[-34, -12, 10].map(x => `<rect x="${x}" y="-56" width="20" height="24" fill="#d9822b"/><rect x="${x}" y="-56" width="20" height="6" fill="#b8341f"/>`).join('')}</g>
  <text x="0" y="8" text-anchor="middle" font-family="Arial Black, Arial" font-size="12" fill="#6a4a24">CEREAL</text></g>`;
const DANI_COL = { skin: '#e8b48f', hair: '#3a2416', hairFar: '#2a1a10' };

// Dani: 19, the night clerk. A green store vest over a grey long-sleeve, black jeans, a dark ponytail, her name badge.
function daniPuppet(parent, { other = false } = {}) {
  // Other-Dani: the same girl, but the eyes are all black and the smile is too wide (drawn over the face)
  const grinF = `<g filter="url(#paper)"><ellipse cx="-14" cy="-196" rx="7.5" ry="9.5" fill="#050506"/><ellipse cx="14" cy="-196" rx="7.5" ry="9.5" fill="#050506"/>
      <ellipse cx="0" cy="-166" rx="20" ry="9" fill="${DANI_COL.skin}"/>
      <path d="M-26,-172 Q0,-148 26,-172 Q0,-160 -26,-172 Z" fill="#1a0b0b"/><path d="M-22,-170 Q0,-158 22,-170" fill="none" stroke="#f1ece0" stroke-width="2.4"/></g>`;
  const grinP = `<g filter="url(#paper)"><ellipse cx="34" cy="-198" rx="6.5" ry="9" fill="#050506"/><ellipse cx="41" cy="-172" rx="10" ry="7" fill="${DANI_COL.skin}"/>
      <path d="M24,-176 Q44,-160 54,-178 Q42,-168 24,-176 Z" fill="#1a0b0b"/></g>`;
  // { other: 'smile' }: Other-Dani by day, the eyes her own, only the smile too wide and too still
  const smileF = `<g filter="url(#paper)"><ellipse cx="0" cy="-166" rx="20" ry="9" fill="${DANI_COL.skin}"/>
      <path d="M-24,-171 Q0,-150 24,-171 Q0,-161 -24,-171 Z" fill="#3a1418"/><path d="M-20,-169 Q0,-160 20,-169" fill="none" stroke="#f6f2e8" stroke-width="2.4"/></g>`;
  const smileP = `<g filter="url(#paper)"><ellipse cx="41" cy="-172" rx="10" ry="7" fill="${DANI_COL.skin}"/><path d="M26,-176 Q44,-162 52,-178 Q42,-169 26,-176 Z" fill="#3a1418"/></g>`;
  return hsFigure(parent, { skin: DANI_COL.skin, coat: RULES.vest, coatFar: RULES.vestFar, top: '#a9a69e', legs: '#1d1f26', legsFar: '#15171c',
    shoe: '#e4e1d8', hair: DANI_COL.hair, hairFar: DANI_COL.hairFar, cheek: '#d98c78', pony: true, headS: .92, eyeK: 1.05,
    faceF: other === 'smile' ? smileF : other ? grinF : '', faceP: other === 'smile' ? smileP : other ? grinP : '', holds: { phone: PHONE_HELD, receiver: RECEIVER, cereal: CEREAL, mop: MOP_HELD, case: CASE_HELD, peaches: `<g transform="translate(0,-16) scale(.32)">${PEACH_CAN}</g>` } });
}

// Mr. Okafor: the manager, 50s. A pale blue shirt and a dark red tie, grey trousers, grey close-cut hair, glasses.
function okaforPuppet(parent) {
  const glassesF = `<g fill="none" stroke="#1b1b1b" stroke-width="2.4"><circle cx="-14" cy="-196" r="10"/><circle cx="14" cy="-196" r="10"/><path d="M-4,-197 h8"/></g>
    <path d="M-12,-176 Q0,-170 12,-176" fill="none" stroke="#2a2a2a" stroke-width="4" stroke-linecap="round"/>`;
  const glassesP = `<g fill="none" stroke="#1b1b1b" stroke-width="2.4"><circle cx="34" cy="-198" r="9"/><path d="M25,-199 L4,-202"/></g>`;
  return hsFigure(parent, { skin: '#7c4e36', coat: '#9fb6c9', coatFar: '#8399ac', top: '#7a2228', legs: '#4a4d55', legsFar: '#3a3d44',
    shoe: '#1d1a18', hair: '#8f8a84', hairFar: '#6f6a64', cheek: '#6b3f2b', headS: 1.02, eyeK: .9,
    hairTopF: `<path d="M-44,-200 C-46,-236 46,-236 44,-200 Q24,-214 0,-212 Q-24,-214 -44,-200 Z" fill="#8f8a84"/>`,
    faceF: glassesF, faceP: glassesP, holds: { coffee: `<g transform="translate(0,-14)"><path d="M-10,-16 L10,-16 L8,16 L-8,16 Z" fill="#f1eee6"/><rect x="-11" y="-20" width="22" height="6" rx="2" fill="#5a3b26"/></g>` } });
}

// The Raincoat Man: a tall figure in a dripping yellow raincoat, hood up; inside the hood only shadow and two pale points.
function raincoatPuppet(parent) {
  const hoodF = `<path d="M-58,-170 C-70,-262 70,-262 58,-170 L54,-130 L-54,-130 Z" fill="#c9a524"/>`;
  const hoodTop = `<path d="M-50,-168 C-60,-246 60,-246 50,-168 Q48,-150 40,-140 L-40,-140 Q-48,-150 -50,-168 Z" fill="none" stroke="#a88a1c" stroke-width="5"/>`;
  const faceF = `<g filter="url(#paper)"><ellipse cx="0" cy="-190" rx="39" ry="39" fill="#121512"/></g>
    <circle cx="-13" cy="-192" r="2.6" fill="#d9dccf"/><circle cx="13" cy="-192" r="2.6" fill="#d9dccf"/>`;
  const faceP = `<g filter="url(#paper)"><path d="M-10,-236 C40,-250 64,-210 58,-170 L50,-140 L-6,-140 Z" fill="#c9a524"/><ellipse cx="30" cy="-188" rx="22" ry="38" fill="#121512"/></g>
    <circle cx="40" cy="-196" r="2.4" fill="#d9dccf"/>`;
  const drips = `<g fill="#9fc3d6" opacity=".8"><path d="M-30,-40 q2,10 0,14 q-2,-4 0,-14 Z"/><path d="M24,-30 q2,10 0,14 q-2,-4 0,-14 Z"/><path d="M-6,20 q2,10 0,14 q-2,-4 0,-14 Z"/></g>`;
  return hsFigure(parent, { skin: '#2b2d28', coat: '#d9b52a', coatFar: '#b3921d', top: '#c9a524', legs: '#2b2b2b', legsFar: '#202020', shoe: '#1a1a1a',
    hair: '#c9a524', hairFar: '#b3921d', cheek: '#121512', skirt: true, hairBackF: hoodF, hairTopF: hoodTop, faceF, faceP, chestF: drips,
    holds: { coins: `<g transform="translate(0,-6)"><circle cx="-4" cy="0" r="5" fill="#c9c2a8"/><circle cx="5" cy="-2" r="5" fill="#b9b096"/></g>` } });
}

// The Girl: about eight, a pale-blue nightdress with a white collar, bare feet; long dark hair and the hem dark and
// dripping wet (the user's design, The_Girl_Nightdress.png).
function girlPuppet(parent) {
  const drip = (x, y, s = 1) => `<path d="M${x},${y} q${2.4 * s},${6 * s} 0,${8 * s} q${-2.4 * s},${-2 * s} 0,${-8 * s} Z" fill="#9cc3dd"/>`;
  const wetHairF = `<path d="M-46,-196 C-58,-150 -56,-112 -48,-80 L-32,-84 C-40,-120 -38,-160 -30,-196 Z M46,-196 C58,-150 56,-112 48,-80 L32,-84 C40,-120 38,-160 30,-196 Z" fill="#2a1a12"/>
    ${drip(-50, -76)}${drip(46, -74)}${drip(-44, -110, .8)}`;
  const collar = `<path d="M-14,-130 q7,10 14,0 q7,10 14,0 l-2,-4 h-24 Z" fill="#f4f2ec"/><path d="M-36,0 q8,10 14,0 q8,12 16,0 q8,10 14,0 q8,12 16,0 q8,10 12,0 L46,30 L-40,30 Z" fill="#7f97b8" opacity=".55"/>
    ${drip(-20, 46, 1.1)}${drip(6, 52)}${drip(28, 44)}`;
  // the grin (Rule Eight): a wide, too-wide smile drawn over the mouth, grin(k 0…1) widening it from a smile to ear to ear
  const grinF = `<g data-p="grin" opacity="0"><g data-p="grinS"><path d="M-30,-174 Q0,-150 30,-174 Q0,-158 -30,-174 Z" fill="#3a1418"/>
    <path d="M-26,-171 Q0,-158 26,-171" fill="none" stroke="#f4efe6" stroke-width="3"/>
    <path d="M-30,-174 Q0,-146 30,-174" fill="none" stroke="#1a1210" stroke-width="2.6" stroke-linecap="round"/></g></g>`;
  const fig = hsFigure(parent, { skin: '#eccdb2', coat: '#a9bcd8', coatFar: '#8ea3c2', legs: '#eccdb2', legsFar: '#dcb9a0', shoe: '#e6c3a8',
    hair: '#2a1a12', hairFar: '#1a100b', cheek: '#e4a59a', headS: 1.2, eyeK: 1.25, skirt: true, chestF: collar, hairBackF: wetHairF, faceF: grinF,
    hairTopF: `<path d="M-44,-196 C-46,-250 46,-250 44,-196 Q20,-214 0,-206 Q-20,-214 -44,-196 Z" fill="#2a1a12"/>${drip(-30, -194, .8)}${drip(22, -196, .8)}` });
  const gG = fig.g.querySelector('[data-p=grin]'), gS = fig.g.querySelector('[data-p=grinS]');
  fig.grin = k => { gG.setAttribute('opacity', k > .01 ? 1 : 0); tf(gS, `translate(0,-166) scale(${(.75 + .9 * k).toFixed(3)},${(.8 + .7 * k).toFixed(3)}) translate(0,166)`); };
  return fig;
}

// Theo: the new hire. The same green vest over a white tee, short sandy hair; he never speaks.
function theoPuppet(parent) {
  return hsFigure(parent, { skin: '#f0c7a4', coat: RULES.vest, coatFar: RULES.vestFar, top: '#ecebe6', legs: '#3b4a63', legsFar: '#2f3b50',
    shoe: '#2a2a2a', hair: '#b0874e', hairFar: '#8e6c3e', cheek: '#e39a86', headS: .95,
    holds: { list: `<g transform="translate(0,-18)"><rect x="-14" y="-20" width="28" height="38" fill="#f4f1e6"/></g>` } });
}

/* ---------- props ---------- */
// The list: Marcus's laminated rules, the handwriting worse towards the bottom; with { nine: true } Dani's Rule Nine
// under them in a different pen, and { faint: 0…1 } the "Don't listen to me." under Rule Six showing.
const RULE_LINES = ['1. Don’t leave the counter between 2:00 and 2:15.', '2. If the freezer door is open, close it without looking inside.',
  '3. A man in a yellow raincoat pays in coins. Count them. If there are 13, refuse the sale.', '4. Never restock aisle 4 after 3 a.m.',
  '5. If the phone rings and the caller says he’s Marcus, hang up. Marcus doesn’t call.',
  '6. If you see yourself on the monitor somewhere you aren’t, DO NOT GO THERE.', '7. A girl will ask to use the bathroom. There is no bathroom.',
  '8. At 4:44 the lights flicker. Stay behind the counter until they stop.'];
function theList(parent) {
  const g = mk('g', {}, parent), wrapAt = (t, n) => { const w = t.split(' '), out = ['']; for (const x of w) { if ((out.at(-1) + ' ' + x).length > n) out.push(x); else out[out.length - 1] = (out.at(-1) + ' ' + x).trim(); } return out; };
  let y = 96, rows = ''; const ruleY = [];
  RULE_LINES.forEach((t, i) => { const tilt = i * .35, ls = wrapAt(t, 46); ruleY.push(y - 20);
    ls.forEach((l, k) => { rows += `<text x="${34 + (k ? 22 : 0)}" y="${y}" transform="rotate(${tilt.toFixed(2)},300,${y})" font-size="${21 - i * .2}">${l.replace(/&/g, '&amp;')}</text>`; y += 27; });
    if (i === 5) { rows += `<text data-p="faint" x="70" y="${y - 2}" font-size="16" fill="#5d6a80" opacity="0" font-style="italic">don’t listen to me</text>`; y += 14; }
    y += 9; });
  g.innerHTML = `<g filter="url(#paper)"><rect x="0" y="0" width="600" height="${y + 120}" rx="6" fill="#f6f3e8"/>
      <rect x="0" y="0" width="600" height="${y + 120}" rx="6" fill="#e9f3f6" opacity=".35"/>
      <rect x="250" y="-16" width="100" height="34" fill="#d8d3b8" opacity=".85" transform="rotate(-3,300,0)"/></g>
    <text x="300" y="52" text-anchor="middle" font-family="'Comic Sans MS','Segoe Print',cursive" font-size="25" font-weight="700" fill="#1d2433">RULES FOR THE OVERNIGHT SHIFT</text>
    <g font-family="'Comic Sans MS','Segoe Print',cursive" fill="#1d2433">${rows}</g>
    <text x="300" y="${y + 14}" text-anchor="middle" font-family="'Comic Sans MS',cursive" font-size="19" fill="#1d2433">Follow all of them. Don’t ask why.  — M.</text>
    <g data-p="nine" opacity="0"><text x="34" y="${y + 66}" font-family="'Segoe Print','Bradley Hand',cursive" font-size="24" fill="#7a1c1c" transform="rotate(-1.5,300,${y + 66})">9. If Dani is working with you… she isn’t.</text></g>`;
  const nine = g.querySelector('[data-p=nine]'), faint = g.querySelector('[data-p=faint]');
  return { g, h: y + 120, ruleY, pose({ nine: n = 0, faint: f = 0 } = {}) { nine.setAttribute('opacity', n); faint.setAttribute('opacity', (f * .8).toFixed(2)); } };
}

// The security monitor: four grainy feeds (1 REGISTER, 2 DOORS, 3 FREEZERS, 4 AISLE 4), a timestamp; feed four has a slot
// for a small figure (Dani where she isn't). pose({ t: 'HH:MM:SS', noise, glitch }).
function securityMonitor(parent) {
  const g = mk('g', {}, parent), W = 700, H = 440;
  const feed = (i, body) => { const x = 24 + (i % 2) * (W / 2 - 12), y = 24 + Math.floor(i / 2) * (H / 2 - 12);
    return `<g transform="translate(${x},${y})"><rect width="${W / 2 - 36}" height="${H / 2 - 36}" fill="#1c241f"/>
      <svg width="${W / 2 - 36}" height="${H / 2 - 36}" viewBox="0 0 314 184">${body}</svg>
      <text x="8" y="18" font-family="monospace" font-size="13" fill="#d8e6da">CAM ${i + 1}</text></g>`; };
  const shelf = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3d4a42"/>` + Array.from({ length: 4 }, (_, k) => `<rect x="${x}" y="${y + k * h / 4}" width="${w}" height="2" fill="#56655b"/>`).join('');
  g.innerHTML = `<g filter="url(#paperBig)"><rect x="-14" y="-14" width="${W + 28}" height="${H + 28}" rx="16" fill="#202322"/><rect width="${W}" height="${H}" fill="#0b0f0d"/></g>
    ${feed(0, `<rect x="0" y="120" width="314" height="64" fill="#46524b"/><rect x="120" y="96" width="70" height="40" fill="#2a332e"/><rect x="40" y="20" width="240" height="60" fill="#344039"/>`)}
    ${feed(1, `<rect x="40" y="10" width="110" height="160" fill="#101512"/><rect x="164" y="10" width="110" height="160" fill="#101512"/><rect x="0" y="160" width="314" height="24" fill="#46524b"/><circle cx="210" cy="40" r="10" fill="#4f5d55"/>`)}
    ${feed(2, `<rect x="0" y="20" width="314" height="120" fill="#4b5c62"/>${[0, 1, 2, 3, 4].map(k => `<rect x="${8 + k * 62}" y="28" width="54" height="104" fill="#62767e"/>`).join('')}<rect x="0" y="140" width="314" height="44" fill="#46524b"/>`)}
    ${feed(3, `<path d="M0,184 L120,70 L194,70 L314,184 Z" fill="#46524b"/>${shelf(0, 20, 110, 150)}${shelf(204, 20, 110, 150)}<rect x="122" y="40" width="70" height="34" fill="#2f3a34"/>`)}
    <g data-p="slot4"></g>
    <rect width="${W}" height="${H}" fill="url(#scan)" opacity=".5"/>
    <text data-p="ts" x="${W - 24}" y="${H - 18}" text-anchor="end" font-family="monospace" font-size="20" fill="#e6f0e8">04:51:07</text>
    <circle cx="36" cy="${H - 24}" r="6" fill="#d33"/><text x="50" y="${H - 18}" font-family="monospace" font-size="18" fill="#e6f0e8">REC</text>`;
  if (!document.getElementById('scan')) document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000"/></pattern></defs></svg>`);
  const ts = g.querySelector('[data-p=ts]'), slot4 = g.querySelector('[data-p=slot4]');
  return { g, W, H, slot4, feed4: { x: 24 + W / 2 - 12, y: 24 + H / 2 - 12, w: W / 2 - 36, h: H / 2 - 36 }, pose({ t = '04:51:07' } = {}) { if (ts.textContent !== t) ts.textContent = t; } };
}

// The wall phone behind the counter: a beige handset on its cradle, a coiled cord; pose({ off, shake }).
function wallPhone(parent) {
  const g = prop(parent, `<g filter="url(#paper)"><rect x="-34" y="-70" width="68" height="120" rx="10" fill="#d8cdb4"/><rect x="-22" y="10" width="44" height="30" rx="4" fill="#bfb398"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-14 + (i % 3) * 14}" cy="${14 + Math.floor(i / 3) * 9}" r="3" fill="#8d836c"/>`).join('')}</g>`);
  const hand = prop(g, `<g filter="url(#paper)"><rect x="-12" y="-80" width="24" height="90" rx="11" fill="#e2d8c0"/><rect x="-16" y="-86" width="32" height="20" rx="8" fill="#d6cbb0"/><rect x="-16" y="-6" width="32" height="20" rx="8" fill="#d6cbb0"/></g>`);
  const cord = mk('path', { d: 'M0,10 C-20,60 30,80 0,140', fill: 'none', stroke: '#c8bca2', 'stroke-width': 4, 'stroke-dasharray': '6 3' }, g);
  return { g, pose({ off = 0, shake = 0 } = {}, f = 0) { tf(hand, `translate(${(off * -60 + (shake ? 2 * Math.sin(f * 2.3) : 0)).toFixed(1)},${(off * 40).toFixed(1)}) rotate(${(off * -30).toFixed(1)})`); vis(cord, true); } };
}

/* ---------- the security cameras ----------
   cctv(parent): the monitor's four feeds (the user's CAM 1–4 pictures: the store, the doors, the freezers, aisle four
   back to the counter), drawn in a 1600 x 900 box: put it full frame for an insert, or scale it onto the monitor's
   screen in a set. slot4 is cam 4's picture in its own pixels (800 x 450) for a small figure (Dani where she isn't).
   pose({ t: 'HH:MM:SS', hi: feed 1–4 outlined, 0 none }). zoomTo(i) is the transform that fills the frame with feed i. */
const CCTV_BOX = [[16, 16], [804, 16], [16, 454], [804, 454]], CCTV_W = 780, CCTV_H = 430;
function cctv(parent) {
  const g = mk('g', {}, parent), uid = 'c' + Math.random().toString(36).slice(2, 7);
  g.innerHTML = `<defs><clipPath id="${uid}"><rect width="800" height="450"/></clipPath>
      <pattern id="${uid}s" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.6" fill="#000"/></pattern></defs>
    <rect width="1600" height="900" fill="#080b0a"/>
    ${CCTV_BOX.map(([x, y], i) => `<g transform="translate(${x},${y})"><image href="../img/props/cam${i + 1}.webp" width="${CCTV_W}" height="${CCTV_H}" preserveAspectRatio="none" style="filter:grayscale(.85) contrast(1.05) brightness(.95)"/>
      ${i === 3 ? `<g data-p="slot4" clip-path="url(#${uid})" transform="scale(${CCTV_W / 800},${CCTV_H / 450})" style="filter:grayscale(1) contrast(.9) brightness(.92)"></g>` : ''}
      <rect width="${CCTV_W}" height="${CCTV_H}" fill="url(#${uid}s)" opacity=".35"/>
      <rect data-p="hi${i + 1}" width="${CCTV_W}" height="${CCTV_H}" fill="none" stroke="#f2f5ef" stroke-width="6" opacity="0"/>
      ${i === 3 ? `<text x="22" y="44" font-family="monospace" font-size="30" fill="#e6efe7">CAM 4</text>` : ''}</g>`).join('')}
    <circle cx="48" cy="850" r="11" fill="#d33"/><text x="68" y="861" font-family="monospace" font-size="32" fill="#e6efe7">REC</text>
    <text data-p="ts" x="1570" y="861" text-anchor="end" font-family="monospace" font-size="34" fill="#e6efe7">04:51:07</text>`;
  const ts = g.querySelector('[data-p=ts]'), hi = [1, 2, 3, 4].map(i => g.querySelector(`[data-p=hi${i}]`));
  return { g, slot4: g.querySelector('[data-p=slot4]'),
    zoomTo(i, k = 1) {   // k 0…1: from the whole grid to feed i filling the frame
      const [x, y] = CCTV_BOX[i - 1], s = 1 + (1.06 * 1600 / CCTV_W - 1) * k, cx = (x + CCTV_W / 2) * k + 800 * (1 - k), cy = (y + CCTV_H / 2) * k + 450 * (1 - k);
      return `translate(800,450) scale(${s.toFixed(4)}) translate(${(-cx).toFixed(1)},${(-cy).toFixed(1)})`; },
    pose({ t = '04:51:07', hi: h = 0 } = {}) { if (ts.textContent !== t) ts.textContent = t; hi.forEach((e, i) => e.setAttribute('opacity', i + 1 === h ? .9 : 0)); } };
}
// a clock time n seconds after hh:mm:ss, for the CCTV stamp
const clockAt = (base, n) => { const [h, m, s] = base.split(':').map(Number), t = h * 3600 + m * 60 + s + Math.floor(n);
  return [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(v => String(v).padStart(2, '0')).join(':'); };

/* ---------- chapter 2's props ---------- */
// The can of peaches: a squat tin with an orange label, a peach and the word PEACHES (about 100 x 120, base at y 0).
const PEACH_CAN = `<g filter="url(#paper)"><rect x="-50" y="-120" width="100" height="120" rx="6" fill="#b9bfc2"/><rect x="-50" y="-104" width="100" height="88" fill="#e88a3a"/>
  <rect x="18" y="-104" width="32" height="88" fill="#c96e26"/><ellipse cx="0" cy="-120" rx="50" ry="9" fill="#d6dadc"/><ellipse cx="0" cy="-120" rx="40" ry="6" fill="none" stroke="#9aa0a3" stroke-width="2"/>
  <circle cx="-8" cy="-66" r="20" fill="#f6b072"/><path d="M-8,-86 q6,-10 14,-6" stroke="#4f7a3a" stroke-width="4" fill="none"/>
  <text x="0" y="-26" text-anchor="middle" font-family="Arial Black, Arial" font-size="15" fill="#fff4e0">PEACHES</text></g>`;
// Coins on a counter: up to 13 in a row, sliding in (pose({ n: how many, take: how many taken back, slide 0…1 for the last })).
function coinRow(parent, x, y, gap = 34, r = 13) {
  const coins = Array.from({ length: 13 }, (_, i) => prop(parent, `<g filter="url(#paper)"><ellipse cx="0" cy="0" rx="${r}" ry="${r * .55}" fill="#a39b80"/><ellipse cx="0" cy="-2" rx="${r}" ry="${r * .55}" fill="#d2c9a6"/>
    <ellipse cx="0" cy="-2" rx="${r * .62}" ry="${r * .32}" fill="none" stroke="#b5ac8b" stroke-width="1.5"/></g>`));
  return { pose({ n = 0, take = 0, drop = 1 } = {}) {
    coins.forEach((c, i) => { const shown = i < n && i >= take; vis(c, shown); if (!shown) return;
      const last = i === 12 && n === 13 ? 1 - drop : 0;   // the thirteenth falls in from above
      tf(c, `translate(${x + i * gap},${y - 120 * last * last})`); }); } };
}
// Wet footprints across a floor: a list of [x, y, angle (deg, 0 = pointing up the screen), side ±1]; pose(k) shows the first k.
function footprints(parent, steps, scale = y => 1) {
  const fp = steps.map(([x, y, a, side]) => { const s = scale(y);
    return prop(parent, `<g transform="translate(${x},${y}) rotate(${a}) scale(${(s * .9).toFixed(3)},${(s * .55).toFixed(3)})" opacity=".55">
      <ellipse cx="${side * 4}" cy="0" rx="11" ry="22" fill="#4f6670"/><ellipse cx="${side * 4}" cy="-6" rx="7" ry="11" fill="#7d98a3" opacity=".5"/>
      ${[-8, -2, 4, 9].map((tx, i) => `<circle cx="${side * 4 + tx}" cy="${-30 + Math.abs(i - 1.5) * 2}" r="${3.4 - i * .4}" fill="#4f6670"/>`).join('')}</g>`); });
  return { pose(k, from = 0) { fp.forEach((g, i) => vis(g, i < k && i >= from)); } };
}
// Cold mist spilling from an open fridge door across the floor: soft wisps that drift and grow (pose(q, k 0…1)).
function fridgeMist(parent, x, y) {
  const g = mk('g', { 'pointer-events': 'none' }, parent), wisps = Array.from({ length: 9 }, (_, i) => mk('ellipse', { fill: '#e8f3fa', opacity: 0 }, g));
  return { pose(q, k = 1) { wisps.forEach((w, i) => { const u = ((q * .12 + i / 9) % 1), xx = x + 30 + u * 420 + 20 * Math.sin(q + i), yy = y - 10 + 18 * Math.sin(i * 2.1) - 30 * (1 - u);
      w.setAttribute('cx', xx.toFixed(1)); w.setAttribute('cy', yy.toFixed(1)); w.setAttribute('rx', (60 + 140 * u * k).toFixed(1)); w.setAttribute('ry', (14 + 26 * u).toFixed(1));
      w.setAttribute('opacity', (k * .32 * Math.sin(Math.PI * u)).toFixed(3)); }); } };
}
// Water pooling on a counter top (pose(k 0…1)).
function puddle(parent, x, y, w = 160) {
  const e = mk('ellipse', { cx: x, cy: y, fill: '#6f8f9c', opacity: .55 }, parent), hi = mk('ellipse', { cx: x - w * .15, cy: y - 3, fill: '#d6eaf2', opacity: .5 }, parent);
  return { pose(k) { e.setAttribute('rx', (w / 2 * k).toFixed(1)); e.setAttribute('ry', (w * .09 * k).toFixed(1)); hi.setAttribute('rx', (w * .18 * k).toFixed(1)); hi.setAttribute('ry', (w * .025 * k).toFixed(1)); vis(e, k > .01); vis(hi, k > .01); } };
}

// The Raincoat Man's arm reaching in from below the frame (the counter close-up is from his side): a dripping yellow
// sleeve and a dark glove; pose({ x, y (the glove), on }).
function gloveArm(parent) {
  const g = mk('g', {}, parent), arm = mk('g', {}, g);
  arm.innerHTML = `<g filter="url(#paper)"><rect x="0" y="-30" width="520" height="60" rx="28" fill="#d9b52a"/><rect x="0" y="12" width="520" height="18" rx="9" fill="#b3921d"/>
    <rect x="-6" y="-34" width="34" height="68" rx="12" fill="#c9a524"/><ellipse cx="-24" cy="0" rx="30" ry="22" fill="#2b2d28"/>
    ${[-20, -8, 4, 16].map((y, i) => `<rect x="-58" y="${y - 5}" width="${30 - i * 2}" height="11" rx="5" fill="#2b2d28"/>`).join('')}</g>
    <path d="M60,32 q3,12 0,16 q-3,-4 0,-16 Z" fill="#9fc3d6"/>`;
  return { pose({ x = 0, y = 0, on = 1 } = {}) {
    vis(g, on > .01);
    const bx = x + 300, by = y + 520, a = Math.atan2(by - y, bx - x) * 180 / Math.PI;   // from the glove back to off-frame
    tf(arm, `translate(${(x + (bx - x) * (1 - on) * .9).toFixed(1)},${(y + (by - y) * (1 - on) * .9).toFixed(1)}) rotate(${a.toFixed(1)})`); } };
}

/* ---------- chapter four ---------- */
// Rain running down a pane of glass (world box x, y, w, h): streaks sliding down, a few beads; pose(q).
function rainGlass(parent, x, y, w, h) {
  const id = 'rg' + Math.random().toString(36).slice(2, 7), g = mk('g', { 'pointer-events': 'none' }, parent);
  g.innerHTML = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>`;
  const c = mk('g', { 'clip-path': `url(#${id})` }, g), N = 46, streaks = [];
  for (let i = 0; i < N; i++) { const sx = x + ((i * 37.3) % w), len = 30 + (i * 13) % 50, sp = 260 + (i * 71) % 220;
    streaks.push([mk('path', { d: `M${sx.toFixed(1)},0 l${(-2 - i % 3)},${len}`, stroke: '#b8d6e6', 'stroke-width': 1.6 + (i % 3) * .5, opacity: .35 + (i % 4) * .08, 'stroke-linecap': 'round' }, c), sp, (i * 53) % h]); }
  for (let i = 0; i < 22; i++) mk('circle', { cx: x + (i * 61.7) % w, cy: y + (i * 97.1) % h, r: 2 + i % 3, fill: '#cfe5ef', opacity: .35 }, c);
  return { g, pose(q) { for (const [e, sp, o] of streaks) tf(e, `translate(0,${(y + ((q * sp + o) % (h + 80)) - 80).toFixed(1)})`); } };
}
// The restroom door that was never there: a plain door in the bare wall, a frame, a push plate, a little sign.
// (x, y) its bottom-left in world px, w x h; pose(k 0…1) shows it.
function restroomDoor(parent, x, y, w, h) {
  const g = mk('g', {}, parent);
  g.innerHTML = `<g filter="url(#paper)"><rect x="${x - 7}" y="${y - h - 7}" width="${w + 14}" height="${h + 7}" fill="#c9cdc3"/>
    <rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="#8b9a93"/><rect x="${x + 6}" y="${y - h + 6}" width="${w - 12}" height="${h - 12}" fill="#94a39c"/>
    <rect x="${x + w - 26}" y="${y - h * .52}" width="10" height="34" rx="3" fill="#d7d9d2"/>
    <rect x="${x + w / 2 - 34}" y="${y - h * .78}" width="68" height="20" rx="3" fill="#f2efe6"/></g>
    <text x="${x + w / 2}" y="${y - h * .78 + 14}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#2d3a40" letter-spacing="1">RESTROOM</text>
    <rect x="${x}" y="${y - 3}" width="${w}" height="3" fill="#3b4642" opacity=".5"/>`;
  return { g, pose(k = 1) { g.setAttribute('opacity', k.toFixed(3)); vis(g, k > .01); } };
}
// The wall clock behind the counter: a digital clock, red digits; pose('4:43'), with blink of the colon.
function wallClock(parent, x, y, s = 1) {
  const g = mk('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
  g.innerHTML = `<g filter="url(#paper)"><rect x="-84" y="-34" width="168" height="68" rx="8" fill="#26292a"/><rect x="-74" y="-25" width="148" height="50" rx="4" fill="#120c0c"/></g>
    <text data-p="t" x="0" y="17" text-anchor="middle" font-family="'Courier New',monospace" font-weight="700" font-size="46" fill="#ff3b30" letter-spacing="2">4:43</text>
    <rect x="-74" y="-25" width="148" height="50" fill="#ff3b30" opacity=".06"/>`;
  const t = g.querySelector('[data-p=t]');
  return { g, pose(s) { if (t.textContent !== s) t.textContent = s; } };
}
// A trail of wet prints between two points on a floor: [x, y, angle, side] steps for footprints().
function printTrail(a, b, n, gap = 14) {
  const out = [], ang = Math.atan2(b[0] - a[0], -(b[1] - a[1])), r = Math.PI / 180;
  for (let i = 0; i < n; i++) { const u = i / (n - 1), side = i % 2 ? 1 : -1, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
    out.push([x + Math.cos(ang) * gap * side, y + Math.sin(ang) * gap * side * .4, ang / r, side]); }
  return out;
}
