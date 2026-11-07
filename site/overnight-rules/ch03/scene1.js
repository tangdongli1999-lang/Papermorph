/* scene1.js — Rule Four. The list, Rule Four; Okafor's sticky note on the monitor; aisle four (the checkout view),
   its shelves empty: Dani comes out from behind the counter, round its end and up the aisle towards us with a case of
   cereal, eleven steps to the end; she turns, and the aisle stretches — the counter and the back wall (the painted
   picture) slide far off down one long corridor of empty shelving drawn in its perspective, while the camera pushes in;
   she walks back towards it, and behind her the shelves restock themselves: box, by box, by box (the painted, stocked
   shelves wiping back in, a band at a time). */
'use strict';
const PRE1 = .3;
// the checkout view's aisle as a perspective: eye at the frame's VP, focal F (world px); x across (±W the shelves'
// aisle faces), y down (FLOOR, the shelves' TOP, the CEILing), z away (1 = where the near shelves end in the picture)
const AV = { VP: [816, 500], F: 560, W: .923, D: .28, FLOOR: .441, TOP: -.64, CEIL: -.893 };
const BOARDS = [-.64, -.47, -.3, -.13, .04, .21, .38];
const P3 = (x, y, z) => `${(AV.VP[0] + AV.F * x / z).toFixed(1)},${(AV.VP[1] + AV.F * y / z).toFixed(1)}`;
const Q = (a, b, c, d, fill, more = '') => `<path d="M${a} L${b} L${c} L${d} Z" fill="${fill}"${more}/>`;
// the aisle from depth z0 to zF: empty shelving both sides (back panel, boards with a lip, posts), and, beyond the
// picture's own near part (z > 1), the floor with its tiles and the ceiling with its lights
function aisleSVG(z0, zF) {
  let s = '';
  if (zF > 1.001) {
    s += Q(P3(-AV.W, AV.FLOOR, 1), P3(AV.W, AV.FLOOR, 1), P3(AV.W, AV.FLOOR, zF), P3(-AV.W, AV.FLOOR, zF), '#c3bfb5');
    for (let z = 1.25; z < zF; z += .25) s += `<path d="M${P3(-AV.W, AV.FLOOR, z)} L${P3(AV.W, AV.FLOOR, z)}" stroke="#a9a59b" stroke-width="${(3 / z).toFixed(2)}"/>`;
    for (const x of [-.6, -.3, 0, .3, .6]) s += `<path d="M${P3(x, AV.FLOOR, 1)} L${P3(x, AV.FLOOR, zF)}" stroke="#a9a59b" stroke-width="2"/>`;
    s += Q(P3(-AV.W, AV.CEIL, 1), P3(AV.W, AV.CEIL, 1), P3(AV.W, AV.CEIL, zF), P3(-AV.W, AV.CEIL, zF), '#97a087');
    for (let z = 1.3; z < zF - .2; z += .7) s += Q(P3(-.35, AV.CEIL, z), P3(.35, AV.CEIL, z), P3(.35, AV.CEIL, z + .22), P3(-.35, AV.CEIL, z + .22), '#f4f1e0');
    for (const sd of [-1, 1]) s += Q(P3(sd * AV.W, AV.CEIL, 1), P3(sd * AV.W, AV.CEIL, zF), P3(sd * AV.W, AV.TOP, zF), P3(sd * AV.W, AV.TOP, 1), '#a6b297');   // the wall above the shelving
  }
  for (const sd of [-1, 1]) {
    const face = sd * AV.W, back = sd * (AV.W + AV.D);
    s += Q(P3(back, AV.TOP, z0), P3(back, AV.TOP, zF), P3(back, AV.FLOOR, zF), P3(back, AV.FLOOR, z0), '#ddd5c4');   // the empty shelves' back
    s += Q(P3(back, AV.TOP, z0), P3(face, AV.TOP, z0), P3(face, AV.TOP, zF), P3(back, AV.TOP, zF), '#f1ece0');      // the top cap
    for (const y of BOARDS) {
      s += Q(P3(back, y, z0), P3(face, y, z0), P3(face, y, zF), P3(back, y, zF), y < 0 ? '#cfc6b3' : '#f4efe4');        // underside or top
      s += Q(P3(face, y, z0), P3(face, y, zF), P3(face, y + .03, zF), P3(face, y + .03, z0), '#f7f3ea');                // the lip
      s += Q(P3(face, y + .03, z0), P3(face, y + .03, zF), P3(face, y + .036, zF), P3(face, y + .036, z0), '#b9b0a0');
    }
    s += Q(P3(back, AV.TOP, zF), P3(face, AV.TOP, zF), P3(face, AV.FLOOR, zF), P3(back, AV.FLOOR, zF), '#e9e2d2');   // the shelving's end panel
    for (let z = Math.ceil(z0 * 2) / 2; z < zF; z += .5) s += Q(P3(face, AV.TOP, z), P3(face, AV.TOP, z + .03), P3(face, AV.FLOOR, z + .03), P3(face, AV.FLOOR, z), '#efe8da');
  }
  return s;
}

function scene1(p, D, m) {
  const sc = t => PRE1 + t;
  const LI = listInsert(p);
  // the sticky note on the monitor (the counter close-up)
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 360, y: 540, z: 2.6 }); nightGrade(ctr, .9);
  vis(K.dani.g, false);
  const note = mk('g', { transform: 'translate(392,476) rotate(7)' }, K.cam.layer('front'));
  note.innerHTML = `<g filter="url(#paper)"><rect x="-46" y="-6" width="92" height="88" fill="#f6dc5a"/><rect x="-46" y="-6" width="92" height="14" fill="#e8c93e"/></g>
    <g font-family="'Comic Sans MS','Segoe Print',cursive" font-size="11.5" fill="#28304a"><text x="-38" y="22">Aisle 4.</text><text x="-38" y="38">Restock.</text>
    <text x="-38" y="54">Don't be lazy.</text><text x="16" y="72" font-size="10">— O.</text></g>`;
  // aisle four: the painted view, the drawn aisle over it, the painted far end (the picture inside the near shelves'
  // ends, from the ceiling to the floor line) that slides away as the aisle grows
  const chk = mk('g', {}, p), C = checkout(chk, { x: 800, y: 450, z: 1 }), bg = C.cam.layer('bg');
  const aisleG = mk('g', {}, bg), farG = mk('g', {}, bg), uid = 'far' + Math.random().toString(36).slice(2, 6);
  farG.innerHTML = `<defs><clipPath id="${uid}"><rect x="299" y="-40" width="1034" height="787"/></clipPath></defs>
    <image href="../img/sets/checkout/bg.webp" x="-60" y="-34" width="1720" height="968" preserveAspectRatio="none" clip-path="url(#${uid})"/>`;
  const dani = daniPuppet(C.cam.stage);
  // the stocked painted shelves come back a band at a time (clipped), over the empty drawn ones
  const bands = [[-100, 430], [430, 640], [640, 1100]], cid = 'rs' + Math.random().toString(36).slice(2, 6);
  const clip = mk('clipPath', { id: cid }, mk('defs', {}, chk)), bandR = bands.map(([y0, y1]) => mk('rect', { x: -200, y: y0, width: 2000, height: 0 }, clip));
  for (const n of ['shelfL', 'shelfR']) C.cam.layer(n).setAttribute('clip-path', `url(#${cid})`);
  nightGrade(chk, .85);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const T_NOTE = sc(4.3), T_AISLE = sc(10.15), T_ROUND = sc(10.4), T_WALK = sc(14.9), T_END = sc(20.97), T_TURN = sc(21.3), T_FAR = sc(22.4), T_BACK = sc(27.3);
  const T_BOX = [sc(36.11), sc(37.35), sc(37.97)];
  const SHOTS = [[0, 'list'], [T_NOTE, 'note'], [T_AISLE, 'aisle']];
  // her path: from behind the counter, left along it and round its end, then up the aisle towards us
  const PATH = [[1150, 640, .7], [985, 646, .71], [930, 676, .76], [900, 712, .82]], NEAR = [800, 872, 1.26];
  for (let i = 0; i < 6; i++) sfx('scene1', T_ROUND + .3 + i * .7, 'step1', .28);
  for (let i = 0; i < 11; i++) sfx('scene1', T_WALK + i * (T_END - T_WALK) / 10, 'step1', .5);
  for (let i = 0; i < 15; i++) sfx('scene1', T_BACK + .25 + i * .6, 'step1', .42 - i * .02);
  T_BOX.forEach(t => sfx('scene1', t, 'thud', 1.1));
  K.cam.to({ x: 385, y: 520, z: 3.1 }, T_NOTE, 5);
  C.cam.cut({ x: 860, y: 470, z: 1.05 }, T_AISLE).to({ x: 800, y: 480, z: 1.1 }, T_AISLE, 10).to({ x: 812, y: 520, z: 1.32 }, T_FAR, 3.2).to({ z: 1.22 }, T_BACK, 9);

  let lastZ = -1;
  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(ctr, shot === 'note'); vis(chk, shot === 'aisle');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[3] + 10, 1.8 + .2 * span(q, 0, T_NOTE)); LI.L.pose({}); }
    if (shot === 'note') { K.cam.apply(q, f); K.tv.pose({ t: clockAt('03:09:40', q) }); }
    if (shot !== 'aisle') return cap(q);
    C.cam.apply(q, f);
    // the aisle grows: its far end recedes from z 1 to z 4.2, the camera pushing in at the same time
    const u = span(q, T_FAR, T_FAR + 3.2), zF = 1 + 3.2 * u;
    if (Math.abs(zF - lastZ) > 1e-4) { aisleG.innerHTML = aisleSVG(.3, zF); lastZ = zF; }
    tf(farG, `translate(${AV.VP[0]},${AV.VP[1]}) scale(${(1 / zF).toFixed(4)}) translate(${-AV.VP[0]},${-AV.VP[1]})`);
    vis(C.cam.layer('counter'), zF < 1.001);
    // the shelves behind her restock themselves, band by band
    bandR.forEach((r, i) => r.setAttribute('height', q >= T_BOX[i] ? bands[i][1] - bands[i][0] : 0));
    // Dani: round the counter, up the aisle (eleven steps), the turn, then back towards the far end
    let x, gy, s, back = false, ph = 0, moving = false;
    if (q < T_WALK) {
      const k = span(q, T_ROUND, T_WALK - .2) * (PATH.length - 1), i = Math.min(PATH.length - 2, Math.floor(k)), t = k - i, A = PATH[i], B = PATH[i + 1];
      x = A[0] + (B[0] - A[0]) * t; gy = A[1] + (B[1] - A[1]) * t; s = A[2] + (B[2] - A[2]) * t; moving = q > T_ROUND && q < T_WALK - .2; ph = (q - T_ROUND) / .7;
    } else if (q < T_TURN) {
      const k = Math.min(1, (q - T_WALK) / (T_END - T_WALK)), A = PATH[PATH.length - 1];
      x = A[0] + (NEAR[0] - A[0]) * k; gy = A[1] + (NEAR[1] - A[1]) * k; s = A[2] + (NEAR[2] - A[2]) * k; moving = k < 1; ph = (q - T_WALK) / ((T_END - T_WALK) / 10);
    } else if (q < T_BACK) { [x, gy, s] = NEAR; back = q > T_TURN + .25; }
    else {   // walking away into the long aisle: she shrinks as her depth grows, never getting there
      const k = span(q, T_BACK, T_BACK + 9.5), z = 1 + 1.4 * k;
      x = AV.VP[0] + (NEAR[0] - AV.VP[0]) / z; gy = AV.VP[1] + (NEAR[1] - AV.VP[1]) / z; s = NEAR[2] / z; back = true; moving = k < 1; ph = (q - T_BACK) / .6;
    }
    const step = moving ? Math.sin(ph * Math.PI) : 0, bob = moving ? 6 * Math.abs(step) : 0;
    const flip = q > T_TURN && q < T_TURN + .5 ? Math.abs(Math.cos((q - T_TURN) / .5 * Math.PI)) : 1;   // the turn, a card flipped
    tf(dani.g, `translate(${x.toFixed(1)},0) scale(${Math.max(.15, flip).toFixed(2)},1) translate(${(-x).toFixed(1)},0)`);
    dani.pose({ x, y: hipOn(gy, s) - bob * s, s, head: 'F', turn: 0, back, stepF: step, rua: 4, lua: -4, hold: 'case', look: !back && q > T_END - .4 ? -.3 : 0,
      brow: q > T_END ? .9 : .2, mouth: 'A', shut: !back && (q % 3.4) < .12 }, f);
    cap(q);
  });
}
