/* hide.js — Hide and Seek's own cast and props, on paper.js and cast.js (load after cast.js).

   samPuppet / leoPuppet are storybook figures (cast.js kind 2): drawn at the hip facing right, feet at y 170, a profile
   set and a front set, posed with every key of figurePuppet (REST_FIGURE: turn, near/far, ua/fa, rua/rfa/lua/lfa,
   head, headR, nod, look, brow, lean, crouch, sit, fua/ffa, hold, mouth, shut …). hsFigure is figurePuppet with what
   these two need: back (front set seen from behind: the head all hair, for Sam facing the wall), rFront / lFront (that front arm drawn in front of the head, for a hand at the face), no hat, a head that can be smaller than the child's (Sam is older: headS .84 on a taller scale),
   a ponytail that swings (tail, degrees, + back), bigger eyes (eyeK), pieces drawn behind the profile torso (back:
   Leo's dinosaur spikes) or on the front torso (chest), and footed pyjamas (shoe = the suit's colour).

   otherHand(parent): the Other's pale hand curling round a door edge. Built at the edge (0, 0), the fingers reaching
     to screen left out of the gap; pose({ x, y, s, out: 0…1 (how far it has come out of the gap), curl: 0…1 (the
     fingers wrap round the edge), tap: 0…1 (one finger lifts) }).
   otherEye(parent): one eye in the dark crack; pose({ x, y, s, open: 0…1, look: -1…1 (pupil, + screen right), glow }).
   moonLamp(parent): the nightlight, a paper crescent on a stand with its warm glow; pose({ x, y, s, on: 0…1 }).

   Palette (style.json): night blue-black, one warm lamp, red only for the Other (its caption, the eye). */
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
  headS = 1, eyeK = 1, pony = false, back = '', chest = '', chestF = '', top = null, holds = {}, skirt = false } = {}) {
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
      <g data-p="headP"><g transform="${hs}">${tailP}<g filter="url(#paper)">
        <path d="M-44,-186 C-48,-244 34,-256 52,-212 L30,-204 L-6,-206 L-10,-160 L-34,-152 C-46,-162 -44,-176 -44,-186 Z" fill="${hairFar}"/>
        <circle cx="14" cy="-192" r="40" fill="${skin}"/><circle cx="53" cy="-189" r="7" fill="${skin}"/>
        ${pony ? `<path d="M-30,-196 C-34,-238 22,-252 56,-212 Q30,-226 8,-214 Q-12,-214 -22,-196 L-26,-176 Z" fill="${hair}"/>`
               : `<path d="M-28,-200 C-30,-238 20,-250 54,-210 Q32,-222 12,-206 Q-4,-216 -14,-198 Q-20,-186 -16,-172 L-28,-176 Z" fill="${hair}"/><path d="M8,-232 l6,-14 l4,13 l7,-10 l1,12" fill="${hair}"/>`}
        <circle cx="31" cy="-176" r="8.5" fill="${cheek}" opacity=".7"/></g>
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
  <g data-p="headF"><g transform="${hs}"><g filter="url(#paper)">
    ${pony ? `<path d="M30,-222 C70,-214 78,-176 70,-138 C66,-124 58,-116 52,-112 C58,-140 56,-176 40,-206 Z" fill="${hairFar}"/>` : ''}
    <path d="M-50,-178 C-60,-240 60,-240 50,-178 Q40,-170 30,-178 L-30,-178 Q-40,-170 -50,-178 Z" fill="${hairFar}"/><circle cx="0" cy="-188" r="42" fill="${skin}"/>
    ${pony ? `<path d="M-44,-192 C-48,-250 46,-252 44,-194 Q30,-226 4,-224 Q-6,-212 -14,-226 Q-34,-222 -44,-192 Z" fill="${hair}"/>`
           : `<path d="M-44,-196 C-46,-250 46,-250 44,-196 Q24,-222 0,-216 Q-24,-222 -44,-196 Z" fill="${hair}"/><path d="M-6,-234 l4,-16 l5,14 l6,-12 l2,14" fill="${hair}"/>`}
    <circle cx="-23" cy="-176" r="8" fill="${cheek}" opacity=".7"/><circle cx="23" cy="-176" r="8" fill="${cheek}" opacity=".7"/></g>
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

// Sam's phone, lit (9:58 pm): held in the hand, drawn about the hand's centre.
const PHONE = `<g transform="translate(-2,-14) rotate(-8)"><rect x="-9" y="-18" width="18" height="32" rx="3.5" fill="#15171c"/>
  <rect x="-7.2" y="-15.5" width="14.4" height="26" rx="2" fill="#9fc3ff"/><rect x="-7.2" y="-15.5" width="14.4" height="26" rx="2" fill="#dfeaff" opacity=".35"/></g>`;

// Sam: the babysitter, older than Leo (a smaller head on a taller figure), ponytail, a long oatmeal cardigan open over a
// dark top, dark jeans, trainers. Pose her at s about 1.25 next to Leo at .82.
function samPuppet(parent) {
  return hsFigure(parent, { skin: '#efc6a4', coat: '#b89a6c', coatFar: '#97805a', top: '#3a2d3f', legs: '#2f3b5c', legsFar: '#26304b',
    shoe: '#e9e4da', hair: '#4a2c1e', hairFar: '#3a2217', cheek: '#e39a86', headS: .84, pony: true, skirt: false, holds: { phone: PHONE } });
}

// Leo: about five, green dinosaur footed pyjamas (spikes down the back, a pale belly), messy light-brown hair, big eyes.
const SPIKES_P = `<g filter="url(#paper)">${[[-26, -126], [-33, -104], [-38, -80], [-40, -56]].map(([x, y], i) =>
  `<path d="M${x + 4},${y - 10} L${x - 14 + i},${y + 2} L${x + 4},${y + 12} Z" fill="#e88a3a"/>`).join('')}</g>`;
const BELLY_F = `<path d="M-18,-112 Q0,-118 18,-112 L22,-48 Q0,-42 -22,-48 Z" fill="#cfe0a0"/>
  <path d="M-30,-130 l-8,-12 l12,4 Z M30,-130 l8,-12 l-12,4 Z" fill="#e88a3a"/>`;
const BELLY_P = `<path d="M10,-118 Q24,-114 28,-104 L34,-46 L16,-44 Z" fill="#cfe0a0"/>`;
function leoPuppet(parent) {
  return hsFigure(parent, { skin: '#f4cfb0', coat: '#5e9a52', coatFar: '#4c8143', legs: '#5e9a52', legsFar: '#4c8143', shoe: '#4c8143',
    hair: '#a5703f', hairFar: '#8a5b31', cheek: '#ee9d8a', headS: 1.06, eyeK: 1.3, back: SPIKES_P, chest: BELLY_P, chestF: BELLY_F, skirt: false });
}

/* The Other's hand, seen from the room: the palm is behind the door, so only the fingers show, coming round the door's
   edge (x 0, the edge itself; the door's face runs to screen left) and lying across its face. Each finger is three
   joints; as it curls the tips fold down onto the door, as if gripping it. The scene draws the door slab over x > 0
   (the palm and the gap). A child's fingers, too long and too thin, grey-pale. */
function otherHand(parent) {
  const g = mk('g', {}, parent);
  const F = [[-33, 92, 16], [-12, 104, 17], [9, 99, 16.5], [29, 80, 15]];   // y on the edge, length, width
  const seg = (L, w, k) => `<path d="M0,${-w / 2} L${-L},${-w / 2 + k} Q${-L - w / 2},0 ${-L},${w / 2 - k} L0,${w / 2} Z" fill="${HS.pale}"/>`;
  g.innerHTML = `<g data-p="hand">
    <g filter="url(#paper)"><path d="M60,-50 C26,-52 10,-46 6,-36 L6,42 C14,52 34,56 60,54 Z" fill="#59625f"/><path d="M6,-36 L6,42" stroke="#7d8784" stroke-width="5"/></g>
    ${F.map(([y, L, w], i) => { const a = L * .42, b = L * .32, c = L * .26;
      return `<g data-p="f${i}" transform="translate(4,${y})"><g filter="url(#paper)">${seg(a + 3, w, .5)}
        <path d="M${-a + 4},${-w / 2 + 2} q-2,${w / 2 - 2} 0,${w - 4}" fill="none" stroke="${HS.paleShade}" stroke-width="1.6"/></g>
        <g data-p="f${i}b" transform="translate(${-a},0)"><g filter="url(#paper)">${seg(b + 3, w - 1, .8)}
          <path d="M${-b + 4},${-w / 2 + 2.5} q-2,${w / 2 - 2.5} 0,${w - 5}" fill="none" stroke="${HS.paleShade}" stroke-width="1.4"/></g>
          <g data-p="f${i}c" transform="translate(${-b},0)"><g filter="url(#paper)">${seg(c, w - 2, 1.2)}
            <path d="M${-c + 1.5},${-w / 2 + 2.6} L${-c - w / 2 + 2},${-1.5} L${-c - w / 2 + 2},1.5 L${-c + 1.5},${w / 2 - 2.6} L${-c + 9},${w / 2 - 3} L${-c + 9},${-w / 2 + 3} Z" fill="${HS.nail}"/></g></g></g></g>`; }).join('')}
  </g>`;
  bakeAll(g); const P = pieces(g);
  return { g, pose({ x = 0, y = 0, s = 1, out = 1, curl = 0, tap = 0 } = {}, f = 0) {
    tf(g, `translate(${(x + jit(f, 1) * .5).toFixed(1)},${(y + jit(f, 2) * .5).toFixed(1)}) scale(${s})`);
    F.forEach(([fy, L], i) => {
      // out: the finger slides round the edge, its length showing more and more (scaled along x from the edge)
      const o = Math.max(0, Math.min(1, out * 1.25 - i * .08)), c = Math.max(0, Math.min(1, curl * 1.2 - i * .07)) * (i === 1 ? 1 - tap : 1);
      tf(P[`f${i}`], `translate(4,${fy}) scale(${(.15 + .85 * o).toFixed(3)},1) rotate(${(-4 + 3 * i + jit(f, 10 + i) * .7).toFixed(2)})`);
      // curling folds each joint toward the door face; on a flat door seen head-on that reads as the finger shortening
      // at each knuckle and bending down a little (the tips pressing in)
      tf(P[`f${i}b`], `translate(${-L * .42},0) rotate(${(-18 * c).toFixed(2)}) scale(${(1 - .3 * c).toFixed(3)},1)`);
      tf(P[`f${i}c`], `translate(${-L * .32},0) rotate(${(-40 * c).toFixed(2)}) scale(${(1 - .3 * c).toFixed(3)},1)`);
    });
  } };
}

/* The Other's eye in the wardrobe crack: an almond of dim white, a red iris that catches the lamp, lids that open. */
function otherEye(parent) {
  const g = mk('g', {}, parent);
  g.innerHTML = `<defs><radialGradient id="hsEyeGlow"><stop offset="0" stop-color="${HS.red}" stop-opacity=".55"/><stop offset="1" stop-color="${HS.red}" stop-opacity="0"/></radialGradient>
      <clipPath id="hsEyeClip"><path data-p="clip" d="M-60,0 Q0,-34 60,0 Q0,34 -60,0 Z"/></clipPath></defs>
    <ellipse data-p="glow" rx="90" ry="60" fill="url(#hsEyeGlow)"/>
    <g clip-path="url(#hsEyeClip)"><path d="M-60,0 Q0,-34 60,0 Q0,34 -60,0 Z" fill="#c9c2b4"/>
      <path d="M-60,0 Q0,-34 60,0" fill="none" stroke="#8e8577" stroke-width="10" opacity=".55"/>
      <g data-p="iris"><circle r="21" fill="${HS.red}"/><circle r="21" fill="none" stroke="#5e0508" stroke-width="3"/><circle r="9" fill="#120203"/><circle cx="6" cy="-7" r="3.4" fill="#ffd9b0" opacity=".85"/></g></g>
    <path data-p="lidT" d="M-66,0 Q0,-40 66,0 L66,-60 L-66,-60 Z" fill="#141720"/><path data-p="lidB" d="M-66,0 Q0,40 66,0 L66,60 L-66,60 Z" fill="#141720"/>
    <path d="M-62,0 Q0,-36 62,0 Q0,36 -62,0 Z" fill="none" stroke="#06070b" stroke-width="3"/>`;
  const P = pieces(g);
  return { g, pose({ x = 0, y = 0, s = 1, open = 1, look = 0, glow = 1 } = {}, f = 0) {
    tf(g, `translate(${(x + jit(f, 1) * .4).toFixed(1)},${(y + jit(f, 2) * .4).toFixed(1)}) scale(${s})`);
    const o = Math.max(0, Math.min(1, open));
    tf(P.lidT, `translate(0,${(-34 * o).toFixed(1)})`); tf(P.lidB, `translate(0,${(34 * o).toFixed(1)})`);
    tf(P.iris, `translate(${(22 * look + jit(f, 3) * .6).toFixed(1)},0)`);
    P.glow.setAttribute('opacity', (glow * o).toFixed(2));
  } };
}

/* The moon lamp: a crescent of warm paper on a little stand, with a glow that fills the room. on 0…1. */
function moonLamp(parent) {
  const g = mk('g', {}, parent);
  g.innerHTML = `<defs><radialGradient id="hsLampGlow"><stop offset="0" stop-color="${HS.lamp}" stop-opacity=".55"/><stop offset=".35" stop-color="${HS.lamp}" stop-opacity=".18"/><stop offset="1" stop-color="${HS.lamp}" stop-opacity="0"/></radialGradient></defs>
    <circle data-p="glow" cy="-70" r="420" fill="url(#hsLampGlow)"/>
    <g filter="url(#paper)"><rect x="-6" y="-30" width="12" height="34" fill="#5a4636"/><ellipse cy="4" rx="34" ry="9" fill="#4a3a2d"/></g>
    <g data-p="moonOff"><g filter="url(#paper)"><path d="M14,-128 A50,50 0 1 0 14,-28 A64,64 0 0 1 14,-128 Z" fill="#6f6a5c"/></g></g>
    <g data-p="moonOn"><g filter="url(#paper)"><path d="M14,-128 A50,50 0 1 0 14,-28 A64,64 0 0 1 14,-128 Z" fill="${HS.lamp}"/></g>
      <path d="M2,-120 A44,44 0 0 0 2,-36" fill="none" stroke="${HS.lampHot}" stroke-width="5" opacity=".75"/></g>`;
  bakeAll(g); const P = pieces(g);
  return { g, pose({ x = 0, y = 0, s = 1, on = 1 } = {}, f = 0) {
    tf(g, `translate(${x},${y}) scale(${s})`);
    vis(P.moonOn, on > .5); vis(P.moonOff, on <= .5);
    P.glow.setAttribute('opacity', (on * (.92 + .08 * jit(f, 5))).toFixed(2));
  } };
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

/* ---------- the room's live props (world px of the 'room' set) ---------- */
const WARD = { x: 725, y: 1100, w: 310, h: 770 };   // the wardrobe: seam x, floor y, outer width and height
// The wardrobe: a tall dark cabinet whose two doors meet at the seam; the left door opens on its hinge by `gap` px at
// the seam (a finger's width: 8; the eye: 46). Layers, back to front: the black inside, slotEye (the eye), the doors,
// slotHand (the hand, over the left door's face). pose({ gap, f }).
function wardrobe(parent) {
  const g = mk('g', { transform: `translate(${WARD.x},${WARD.y})` }, parent), W = WARD.w / 2, H = WARD.h;
  const wood = '#2b1e17', wood2 = '#24180f', edge = '#4a3426';
  const body = prop(g, `<g filter="url(#paperBig)"><rect x="${-W - 8}" y="${-H - 26}" width="${2 * W + 16}" height="26" fill="${edge}"/><rect x="${-W}" y="${-H}" width="${2 * W}" height="${H - 18}" fill="${wood2}"/>
    <rect x="${-W + 6}" y="-18" width="26" height="18" fill="${wood2}"/><rect x="${W - 32}" y="-18" width="26" height="18" fill="${wood2}"/></g>`);
  const inside = mk('rect', { x: -W + 10, y: -H + 10, width: 2 * W - 20, height: H - 38, fill: '#030406' }, g);
  const slotEye = mk('g', {}, g);
  const panel = (x0, w) => `<g filter="url(#paper)"><rect x="${x0}" y="${-H + 12}" width="${w}" height="${H - 42}" fill="${wood}"/>
    <rect x="${x0 + 18}" y="${-H + 40}" width="${w - 36}" height="${H * .42}" fill="none" stroke="${edge}" stroke-width="5"/>
    <rect x="${x0 + 18}" y="${-H * .5 + 20}" width="${w - 36}" height="${H * .38}" fill="none" stroke="${edge}" stroke-width="5"/></g>`;
  const doorR = prop(g, panel(0, W - 10) + `<circle cx="16" cy="${-H * .52}" r="6" fill="#8a7a5a"/>`);
  const doorL = mk('g', {}, g);
  const leaf = prop(doorL, panel(-W + 10, W - 10) + `<circle cx="-16" cy="${-H * .52}" r="6" fill="#8a7a5a"/>`);
  const edgeL = mk('rect', { x: -6, y: -H + 12, width: 6, height: H - 42, fill: '#5b4331' }, doorL);   // the door's thickness, seen as it opens
  const slotHand = mk('g', {}, g);
  return { g, slotEye, slotHand, pose({ gap = 0 } = {}, f = 0) {
    const w = W - 10, c = Math.max(.05, 1 - gap / w);
    tf(leaf, `translate(${-W + 10},0) scale(${c.toFixed(4)},1) translate(${W - 10},0)`);
    tf(edgeL, `translate(${(-gap).toFixed(2)},0) scale(${Math.min(1, gap / 6).toFixed(3)},1)`);
  } };
}

const BED = { x0: 20, x1: 440, top: 1232, foot: 1420 };
// The bed in two layers: back (headboard, mattress, duvet top, pillow, the dark space under it) and front (the cover's
// hanging side, which lifts: pose({ lift: 0…1 }) folds it up from its bottom edge). Leo stands between them.
function bedBack(parent) {
  const { x0, x1, top, foot } = BED;
  return prop(parent, `<g filter="url(#paperBig)"><rect x="${x0 - 14}" y="1010" width="30" height="${foot - 1010}" rx="6" fill="#3a2a20"/>
      <path d="M${x0 - 6},1040 Q${x0 + 40},1000 ${x0 + 90},1040 L${x0 + 90},${top} L${x0 - 6},${top} Z" fill="#3a2a20"/>
      <rect x="${x0}" y="${top - 30}" width="${x1 - x0}" height="34" rx="10" fill="#2f4878"/>
      <ellipse cx="${x0 + 80}" cy="${top - 34}" rx="62" ry="22" fill="#c9cad2"/>
      <rect x="${x0}" y="${top}" width="${x1 - x0}" height="${foot - top}" fill="#05060a"/></g>`);
}
function bedFront(parent) {
  const { x0, x1, top, foot } = BED, g = mk('g', {}, parent);
  const cover = prop(g, `<g filter="url(#paperBig)"><path d="M${x0},${top - 6} L${x1 + 6},${top - 6} L${x1 + 10},${foot} Q${(x0 + x1) / 2},${foot + 10} ${x0 - 4},${foot} Z" fill="#2c4372"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${x0 + 30 + i * 46}" cy="${top + 40 + (i % 3) * 44}" r="5" fill="#c9b27a" opacity=".6"/>`).join('')}
      <path d="M${x0},${top - 6} L${x1 + 6},${top - 6}" stroke="#3d5a92" stroke-width="10"/></g>`);
  return { g, pose({ lift = 0 } = {}) {
    tf(cover, `translate(0,${top - 6}) scale(1,${(1 - .82 * lift).toFixed(3)}) translate(0,${-(top - 6)})`);
  } };
}
// The nightstand by the bed's foot, the lamp on it (moonLamp, at NIGHTSTAND.lamp).
const NIGHTSTAND = { x: 510, y: 1330, lamp: [510, 1196] };
function nightstand(parent) {
  return prop(parent, `<g transform="translate(${NIGHTSTAND.x},${NIGHTSTAND.y})" filter="url(#paper)"><rect x="-56" y="-134" width="112" height="16" rx="4" fill="#3a2a20"/>
      <rect x="-50" y="-120" width="100" height="112" fill="#2e2119"/><rect x="-40" y="-104" width="80" height="40" fill="none" stroke="#45332a" stroke-width="4"/>
      <circle cy="-84" r="4" fill="#8a7a5a"/><rect x="-48" y="-10" width="10" height="10" fill="#2e2119"/><rect x="38" y="-10" width="10" height="10" fill="#2e2119"/></g>`);
}
// The long curtain on the window's right: pose({ pull: 0…1 }) gathers it toward the window frame (Sam looks behind it).
function curtain(parent, x = 352, top = 206, bottom = 1062) {
  const g = mk('g', {}, parent);
  const c = prop(g, `<g filter="url(#paperBig)"><path d="M${x},${top} L${x + 70},${top} Q${x + 78},${(top + bottom) / 2} ${x + 74},${bottom} L${x - 4},${bottom} Q${x + 6},${(top + bottom) / 2} ${x},${top} Z" fill="#3b2c4d"/>
      ${[16, 36, 54].map(d => `<path d="M${x + d},${top + 10} Q${x + d + 6},${(top + bottom) / 2} ${x + d + 2},${bottom - 6}" fill="none" stroke="#2c2139" stroke-width="5"/>`).join('')}</g>`);
  const L = prop(g, `<g filter="url(#paperBig)"><path d="M40,${top} L102,${top} Q96,${(top + bottom) / 2} 104,${bottom} L36,${bottom} Q44,${(top + bottom) / 2} 40,${top} Z" fill="#3b2c4d"/>
      ${[56, 76].map(d => `<path d="M${d},${top + 10} Q${d - 4},${(top + bottom) / 2} ${d + 2},${bottom - 6}" fill="none" stroke="#2c2139" stroke-width="5"/>`).join('')}</g>`);
  return { g, pose({ pull = 0, sway = 0 } = {}, f = 0) {
    tf(c, `translate(${x + 74},${top}) skewX(${(-10 * pull + sway).toFixed(2)}) scale(${(1 - .55 * pull).toFixed(3)},1) translate(${-(x + 74)},${-top})`);
  } };
}
// Rain running down the window glass (x0, y0, w, h): streaks on a fixed lattice that fall on twos; the clip never moves.
function rainGlass(parent, x0 = 96, y0 = 236, w = 258, h = 398) {
  const id = 'hsRain' + Math.random().toString(36).slice(2, 7), g = mk('g', { 'clip-path': `url(#${id})` }, parent);
  g.innerHTML = `<defs><clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath></defs>`;
  const fall = mk('g', {}, g), N = 26;
  let d = ''; for (let i = 0; i < N; i++) { const x = x0 + (i * 97) % w, y = y0 - 400 + (i * 173) % 800, l = 30 + (i * 37) % 50; d += `M${x},${y} l-3,${l} M${x},${y + 800} l-3,${l} `; }
  mk('path', { d, stroke: '#7d93c2', 'stroke-width': 2, opacity: .45, 'stroke-linecap': 'round' }, fall);
  return { g, pose(q) { const k = Math.floor(q * 6) / 6; tf(fall, `translate(0,${((k * 520) % 800).toFixed(1)})`); } };
}
// The night: everything darkens away from the lamp; `dark` 0…1 turns the room to black (the lamp off).
function nightLight(parent, [lx, ly] = NIGHTSTAND.lamp) {
  const id = 'hsNight' + Math.random().toString(36).slice(2, 7), g = mk('g', { 'pointer-events': 'none' }, parent);
  g.innerHTML = `<defs><radialGradient id="${id}" cx="${lx}" cy="${ly}" r="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#05070e" stop-opacity="0"/><stop offset=".28" stop-color="#05070e" stop-opacity=".08"/><stop offset=".7" stop-color="#05070e" stop-opacity=".42"/><stop offset="1" stop-color="#05070e" stop-opacity=".6"/></radialGradient></defs>
    <rect x="-400" y="-400" width="1700" height="2500" fill="url(#${id})"/>`;
  const black = mk('rect', { x: -400, y: -400, width: 1700, height: 2500, fill: '#000', opacity: 0 }, g);
  return { g, pose({ dark = 0 } = {}) { black.setAttribute('opacity', dark.toFixed(3)); } };
}
// Sam's forearm and hand in close-up (the wrist Leo grabs): a cardigan sleeve from the shoulder (off frame) to the wrist
// at (0, 0) and the hand beyond it; pose({ x, y, s, r (degrees, the arm's direction: 0 points down), open }).
function samArm(parent) {
  const g = mk('g', {}, parent);
  const a = prop(g, `<g filter="url(#paper)"><rect x="-22" y="-330" width="44" height="300" rx="20" fill="#b89a6c"/><rect x="-17" y="-40" width="34" height="56" rx="14" fill="#efc6a4"/>
      <ellipse cx="0" cy="34" rx="25" ry="30" fill="#efc6a4"/><rect x="-24" y="-44" width="48" height="14" rx="6" fill="#97805a"/></g>`);
  return { g, pose({ x = 0, y = 0, s = 1, r = 0 } = {}, f = 0) { tf(g, `translate(${(x + jit(f, 1) * .4).toFixed(1)},${(y + jit(f, 2) * .4).toFixed(1)}) rotate(${r.toFixed(2)}) scale(${s})`); } };
}
// Leo's small hand gripping (a close-up piece): a fist around something at (0, 0).
function leoGrip(parent) {
  return prop(parent, `<g filter="url(#paper)"><rect x="-80" y="-12" width="70" height="24" rx="11" fill="#5e9a52"/><rect x="-26" y="-10" width="30" height="20" rx="9" fill="#f4cfb0"/>
      <path d="M-2,-26 q18,-4 22,14 q2,12 -8,16 l-16,6 q-14,-4 -12,-18 z" fill="#f4cfb0"/>${[-18, -6, 6].map(x => `<rect x="${x}" y="8" width="11" height="22" rx="5" fill="#f4cfb0"/>`).join('')}</g>`);
}
// Leo's footed-pyjama foot, a dinosaur's: green with three pale claws (the insert under the bed's cover).
function dinoFoot(parent) {
  return prop(parent, `<g filter="url(#paper)"><path d="M-46,10 Q-48,-26 -10,-30 L28,-26 Q50,-20 48,4 Q46,22 20,24 L-30,24 Q-46,22 -46,10 Z" fill="#5e9a52"/>
      ${[[30, -14], [36, 0], [32, 14]].map(([x, y]) => `<path d="M${x},${y - 5} l18,5 l-18,5 z" fill="#e8e3cf"/>`).join('')}
      <path d="M-20,-24 q10,-10 20,0" fill="none" stroke="#4c8143" stroke-width="4"/></g>`);
}

/* ---------- burned-in captions ----------
   A Short carries its words in the picture, so the captions are drawn on the stage (the player's own captions stay
   off): white with a dark edge for Sam and Leo, red for the Other, in the platforms' safe area (x 50–810, the line
   above y 1290). hsCaptions(p, scene, pre, { red: [clip, …], extra: [[t0, text, t1], …] }) shows the scene's cues
   (join.py's, with their ends) on the scene clock, a cue in red when it falls in one of the `red` clips; `extra` are
   red lines of its own (the Other's count, half a beat behind Sam's). Returns pose(q). */
const CAP = { x: 430, y: 1262, size: 46, lineH: 54, maxW: 700, font: "'Helvetica Neue', Arial, sans-serif" };
function hsCaptions(p, scene, pre, { red = [], extra = [] } = {}) {
  const T = TIMINGS[scene], parts = Object.entries(T.parts).sort((a, b) => a[1] - b[1]);
  const owner = t => { let c = null; for (const [k, at] of parts) if (at <= t + 1e-6) c = k; return c; };
  const cues = T.cues.map(([t0, text, t1], i) => ({ t0: pre + t0, t1: pre + (t1 ?? (T.cues[i + 1]?.[0] ?? T.dur)), text, red: red.includes(owner(t0)) }));
  const reds = extra.map(([t0, text, t1]) => ({ t0, t1, text, red: true }));
  const g = mk('g', { 'pointer-events': 'none', 'font-family': CAP.font, 'font-weight': 700, 'text-anchor': 'middle' }, p);
  const wrap = text => { const words = text.split(' '), lines = ['']; for (const w of words) { const t = (lines.at(-1) + ' ' + w).trim(); if (t.length * CAP.size * .55 > CAP.maxW && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; } return lines; };
  const line = (fill) => mk('text', { x: CAP.x, 'font-size': CAP.size, fill, stroke: '#05060a', 'stroke-width': 9, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g);
  const white = [line('#f3efe6'), line('#f3efe6')], redL = [line(HS.red), line(HS.red)];
  const set = (els, text, y0) => { const ls = text ? wrap(text) : []; els.forEach((e, i) => { const t = ls[i] || ''; if (e._s !== t) { e.textContent = e._s = t; } e.setAttribute('y', y0 + (i - ls.length + 1) * CAP.lineH); vis(e, !!t); }); };
  return q => {
    const w = cues.filter(c => !c.red && q >= c.t0 && q < c.t1).at(-1), r = [...cues.filter(c => c.red), ...reds].filter(c => q >= c.t0 && q < c.t1).at(-1);
    const both = w && r;
    set(white, w?.text || '', both ? CAP.y - CAP.lineH - 6 : CAP.y);
    set(redL, r?.text || '', CAP.y);
  };
}
// The title in the dark: HIDE AND SEEK in cut-paper capitals, each letter a little crooked; pose({ o }).
function hsTitle(p, x = 450, y = 760) {
  const g = mk('g', { 'pointer-events': 'none' }, p), word = 'HIDE AND SEEK'.split('');
  g.innerHTML = word.map((ch, i) => `<text x="${x + (i - (word.length - 1) / 2) * 58}" y="${y + ((i * 37) % 11) - 5}" transform="rotate(${((i * 53) % 9) - 4},${x + (i - (word.length - 1) / 2) * 58},${y})"
      font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" fill="#d8d2c2" text-anchor="middle">${ch}</text>`).join('');
  return { g, pose({ o = 1 } = {}) { g.setAttribute('opacity', o.toFixed(3)); } };
}
