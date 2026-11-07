/* scene1.js — Rule Four. The list, Rule Four; Okafor's sticky note on the monitor; aisle four (the checkout view):
   Dani walks away from the counter with a box of cereal, eleven steps to the end of the aisle; she turns, and the aisle
   stretches, the counter sliding far off down a corridor of shelves (the painted view nested in itself); she walks
   back towards it without looking, and at her back the shelves restock themselves: box, by box, by box. */
'use strict';
const PRE1 = .3;
const VP = [790, 520];   // where the checkout view's aisle runs to (world px)

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
  // aisle four, the checkout view; three copies of the picture nested inside it make the aisle long
  const chk = mk('g', {}, p), C = checkout(chk, { x: 800, y: 450, z: 1 }), bg = C.cam.layer('bg');
  const copies = [1, 2, 3].map(() => mk('image', { href: '../img/sets/checkout/bg.webp', x: -60, y: -34, width: 1720, height: 968, preserveAspectRatio: 'none' }, bg));
  const dani = daniPuppet(C.cam.stage);
  const boxes = [[160, 440, '#4f77a8'], [1460, 590, '#b9473a'], [240, 700, '#d1a03c']].map(([x, y, c], i) => {
    const g = mk('g', {}, C.cam.layer('shelfR'));
    g.innerHTML = `<g filter="url(#paper)" transform="translate(${x},${y})"><path d="M-46,-120 l14,-12 h92 l-14,12 Z" fill="${c}" opacity=".8"/><rect x="-46" y="-120" width="92" height="120" fill="${c}"/>
      <path d="M46,-120 l14,-12 v120 l-14,12 Z" fill="#00000033"/><circle cx="0" cy="-62" r="22" fill="#f2efe6" opacity=".8"/></g>`;
    return g; });
  nightGrade(chk, .85);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const T_NOTE = sc(4.3), T_AISLE = sc(10.15), T_WALK = sc(14.9), T_END = sc(20.97), T_TURN = sc(21.3), T_FAR = sc(22.6), T_BACK = sc(27.3);
  const T_BOX = [sc(36.11), sc(37.35), sc(37.97)];
  const SHOTS = [[0, 'list'], [T_NOTE, 'note'], [T_AISLE, 'aisle']];
  for (let i = 0; i < 11; i++) sfx('scene1', T_WALK + i * (T_END - T_WALK) / 10, 'step1', .5);
  for (let i = 0; i < 14; i++) sfx('scene1', T_BACK + .3 + i * .62, 'step1', .4 - i * .02);
  T_BOX.forEach(t => sfx('scene1', t, 'thud', 1.1));
  K.cam.to({ x: 385, y: 520, z: 3.1 }, T_NOTE, 5);
  C.cam.cut({ x: 820, y: 470, z: 1.05 }, T_AISLE).to({ x: 800, y: 480, z: 1.12 }, T_AISLE, 10).to({ x: 790, y: 500, z: 1.0 }, T_FAR, 2.8);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(ctr, shot === 'note'); vis(chk, shot === 'aisle');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[3] + 10, 1.8 + .2 * span(q, 0, T_NOTE)); LI.L.pose({}); }
    if (shot === 'note') { K.cam.apply(q, f); K.tv.pose({ t: clockAt('03:09:40', q) }); }
    if (shot !== 'aisle') return cap(q);
    C.cam.apply(q, f);
    // the stretch: each copy shrinks about the aisle's end, the innermost holding the counter, far off
    const u = span(q, T_FAR, T_FAR + 2.8);
    copies.forEach((im, i) => { const s = 1 - (1 - .6 ** (i + 1)) * u; vis(im, u > 0); im.setAttribute('transform', `translate(${VP[0]},${VP[1]}) scale(${s.toFixed(4)}) translate(${-VP[0]},${-VP[1]})`); });
    // Dani: from the counter end of the aisle towards us, eleven steps; turns; walks back, away, into the long aisle
    const steps = Math.min(11, Math.max(0, (q - T_WALK) / ((T_END - T_WALK) / 10)));
    let x, gy, s, back = false, bob = 0;
    if (q < T_TURN) { const k = steps / 11; x = 1080 - 300 * k; gy = 660 + 210 * k; s = .66 + .58 * k; bob = steps > 0 && steps < 11 ? 5 * Math.abs(Math.sin(steps * Math.PI)) : 0; }
    else if (q < T_BACK) { x = 780; gy = 870; s = 1.24; back = q > T_TURN + .25; }
    else { const k = span(q, T_BACK, T_BACK + 9.5); x = 780 + 10 * k; gy = 870 - 330 * k; s = 1.24 - .82 * k; back = true; bob = k < 1 ? 5 * Math.abs(Math.sin(q * 5.07)) : 0; }
    const flip = q > T_TURN && q < T_TURN + .5 ? Math.abs(Math.cos((q - T_TURN) / .5 * Math.PI)) : 1;   // the turn, a card flipped
    const dj = { x, y: hipOn(gy, s) - bob * s, s, head: 'F', turn: 0, back };
    tf(dani.g, `translate(${x},0) scale(${Math.max(.15, flip).toFixed(2)},1) translate(${-x},0)`);
    dani.pose({ ...dj, rua: 12, rfa: -30, hold: 'cereal', lua: -6, look: q > T_END - .5 && !back ? -.3 : 0, brow: q > T_END ? .9 : .2, mouth: 'A',
      shut: !back && (q % 3.4) < .12 }, f);
    // the shelves at her back restock themselves, box by box
    boxes.forEach((g, i) => { const k = span(q, T_BOX[i] - .12, T_BOX[i]); vis(g, k > 0); tf(g, `translate(${((i === 1 ? 1 : -1) * 140 * (1 - k)).toFixed(1)},0)`); });
    cap(q);
  });
}
