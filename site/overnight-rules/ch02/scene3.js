/* scene3.js — Rule Three. The list, Rule Three; the door chimes and the Raincoat Man is at the counter, his back to
   us, a can of peaches set down ("For the peaches."); the coins on the counter as Dani counts (ten, eleven, twelve);
   Dani, relieved; a thirteenth coin drops onto the counter; his face in the hood, close: "Thirteen."; Dani: "I... I
   can't sell you that."; he stands there, water pooling on the counter; he takes the coins back one at a time and
   leaves the peaches; Dani with the can; morning: the can, light as nothing: "Still sealed." */
'use strict';
const PRE3 = .3;

function scene3(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene3', PRE3, clip, t);
  const LI = listInsert(p);
  // the checkout, him at the counter (his back to us), Dani behind it; the can and the coins on the counter top
  const chk = mk('g', {}, p), C = checkout(chk, { x: 1110, y: 520, z: 2.0 });
  const dani = daniPuppet(C.cam.stage), man = raincoatPuppet(C.front);
  const top = mk('g', {}, C.cam.layer('counter'));
  const can = mk('g', { transform: 'translate(1215,492) scale(.28)' }, top); can.innerHTML = PEACH_CAN;
  const pool = puddle(top, 1080, 494, 190); nightGrade(chk, .9);
  // the counter close-up, for the coins and Dani's face
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 800, y: 400, z: 2.2 }); nightGrade(ctr, .9);
  const coins = coinRow(K.cam.layer('front'), 560, 690, 30, 12), glove = gloveArm(K.cam.layer('front'));
  const coinX = i => 560 + i * 30;
  // his face, close, against the night doors
  const ent = mk('g', {}, p), E = entrance(ent, { x: 760, y: 430, z: 1.4 }), face = raincoatPuppet(E.cam.stage); nightGrade(ent, 1);
  // morning: the can on the shelf, close
  const morn = mk('g', {}, p); morn.innerHTML = `<rect width="1600" height="900" fill="#d9ded6"/><rect y="560" width="1600" height="40" fill="#f1efe8"/><rect y="600" width="1600" height="300" fill="#c9cfc6"/>`;
  const can2 = mk('g', {}, morn); can2.innerHTML = `<g transform="translate(800,560) scale(2.6)">${PEACH_CAN}</g>`;
  const cap = hsCaptions(p, 'scene3', PRE3);

  const T_MAN = at('r01') + .2, T_COUNT = at('d10'), T_REL = at('d11') - .05, T_DROP = at('r02') + .1, T_FACE = at('r02') + 1.0, T_SORRY = at('d12'),
    T_STAND = at('d13') - .05, T_TAKE = at('d13', 8.1), T_HOLD = at('d13', 12.8), T_MORN = at('d13', 15.4);
  for (let i = 0; i < 13; i++) sfx('scene3', T_TAKE + i * .34 + .12, 'coinslide', .7);
  const SHOTS = [[0, 'list'], [T_MAN, 'counter'], [T_COUNT, 'coins'], [T_REL, 'dani'], [T_DROP, 'coins'], [T_FACE, 'face'], [T_SORRY, 'dani'],
    [T_STAND, 'counter'], [T_TAKE, 'coins'], [T_HOLD, 'dani'], [T_MORN, 'morning']];
  const W = TIMINGS.scene3, wordAt = w => at('d10', w);   // the count's words (scene clip times from the words file)
  const T10 = at('d10', 2.31), T11 = at('d10', 2.88), T12 = at('d10', 3.92);
  [T10, T11, T12].forEach(t => sfx('scene3', t - .05, 'coin', .7));
  const T_SWEEP = T_COUNT + .1, T_SWEPT = T10 - .45;   // he sets down the first nine, one after another
  sfx('scene3', T_MAN - .6, 'chime', .8); for (let i = 0; i < 9; i++) sfx('scene3', T_SWEEP + i * (T_SWEPT - T_SWEEP) / 9, 'coin', .35); sfx('scene3', T_DROP + .35, 'coin', 1.2);
  C.cam.cut({ x: 1110, y: 520, z: 2.0 }, T_MAN).to({ z: 2.15 }, T_MAN, 3).cut({ x: 1110, y: 510, z: 1.8 }, T_STAND).to({ x: 1100, y: 500, z: 2.3 }, T_STAND, 7);
  K.cam.cut({ x: 740, y: 640, z: 3.0 }, T_COUNT).cut({ x: 800, y: 400, z: 2.3 }, T_REL).cut({ x: 740, y: 640, z: 3.4 }, T_DROP)
    .cut({ x: 800, y: 390, z: 2.6 }, T_SORRY).cut({ x: 740, y: 640, z: 3.0 }, T_TAKE).cut({ x: 800, y: 420, z: 2.0 }, T_HOLD);
  E.cam.cut({ x: 760, y: 410, z: 2.2 }, T_FACE).to({ z: 2.6 }, T_FACE, 2.6);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(chk, shot === 'counter'); vis(ctr, ['coins', 'dani'].includes(shot)); vis(ent, shot === 'face'); vis(morn, shot === 'morning');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[2] + 30, 1.6 + .25 * span(q, 0, T_MAN)); LI.L.pose({}); }
    // the coins: ten slid in, then eleven, twelve; the thirteenth falls; then taken back one at a time
    const nine = Math.min(9, Math.floor(span(q, T_SWEEP, T_SWEPT) * 9 + (q > T_SWEEP ? 1 : 0)));
    const n = q < T10 ? nine : q < T11 ? 10 : q < T12 ? 11 : q < T_DROP ? 12 : 13;
    const STEP = .34, take = q < T_TAKE ? 0 : Math.min(13, Math.floor((q - T_TAKE) / STEP) + 1);
    coins.pose({ n: q < T_COUNT ? 0 : n, take, drop: span(q, T_DROP, T_DROP + .35) });
    // his glove: over the coin it is setting down (a little lift between), above the thirteenth as it lets go,
    // over each coin it picks back up; away otherwise
    let hand = { x: coinX(0), y: 680, on: 0 };
    if (q > T_SWEEP - .4 && q < T_SWEPT + .2) { const u = span(q, T_SWEEP, T_SWEPT) * 9, i = Math.min(8, Math.floor(u));
      hand = { x: coinX(i) + 10, y: 676 - 22 * Math.sin(Math.PI * (u % 1)), on: span(q, T_SWEEP - .4, T_SWEEP) * (1 - span(q, T_SWEPT, T_SWEPT + .2)) }; }
    for (const [t, i] of [[T10, 9], [T11, 10], [T12, 11]]) if (q > t - .55 && q < t + .35)
      hand = { x: coinX(i) + 10, y: 676 - 30 * (1 - span(q, t - .45, t)), on: span(q, t - .55, t - .3) * (1 - span(q, t + .1, t + .35)) };
    if (q > T_DROP - .4 && q < T_DROP + .7) hand = { x: coinX(12) + 10, y: 565, on: span(q, T_DROP - .4, T_DROP - .1) * (1 - span(q, T_DROP + .4, T_DROP + .7)) };
    if (q > T_TAKE - .4 && q < T_TAKE + 13 * STEP + .3) { const u = Math.max(0, (q - T_TAKE) / STEP), i = Math.min(12, Math.floor(u));
      hand = { x: coinX(i) + 10, y: 676 - 26 * Math.sin(Math.PI * (u % 1)), on: span(q, T_TAKE - .4, T_TAKE) * (1 - span(q, T_TAKE + 13 * STEP, T_TAKE + 13 * STEP + .3)) }; }
    glove.pose(hand);
    if (shot === 'counter') {
      C.cam.apply(q, f);
      man.pose({ x: 1085, y: hipOn(745, .8), s: .8, head: 'F', turn: 0, back: true, rua: 4, lua: -4, rfa: 0, lfa: 0 }, f);
      const dj = { x: CHK.behind[0] + 20, y: hipOn(CHK.behind[1], .7), s: .7, head: 'F', turn: 0 };
      dani.pose({ ...dj, lua: -6, rua: 6, look: -.4, brow: q > T_STAND ? 1 : .3, mouth: 'A', shut: (q % 3.1) < .13 }, f);
      pool.pose(q < T_STAND ? 0 : span(q, T_STAND + .5, T_STAND + 6));
      vis(can, true);
    }
    if (shot === 'coins' || shot === 'dani') {
      K.cam.apply(q, f);
      const holding = q > T_HOLD;
      const dj = { x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0 }, hc = frontReach(dj, 'R', [dj.x + 30, dj.y - 140]);
      K.dani.pose({ ...dj, lua: -4, rua: holding ? hc.rua : 4, rfa: holding ? hc.rfa : 0, hold: holding ? 'peaches' : null, look: holding ? .3 : q > T_SORRY ? 0 : .1,
        brow: q > T_SORRY ? 1 : q > T_REL ? .1 : .5, nod: holding ? 10 : 0, mouth: worried(lips(q, 'scene3', PRE3, 'd11', 'd12')), shut: (q % 3.7) < .12 }, f);
      K.tv.pose({ t: clockAt('03:02:11', q) });
    }
    if (shot === 'face') {
      E.cam.apply(q, f);
      face.pose({ x: 760, y: hipOn(980, 1.6), s: 1.6, head: 'F', turn: 0, rua: 8, lua: -8, nod: 4 + 3 * span(q, T_FACE, T_FACE + 2) }, f);
    }
    if (shot === 'morning') tf(can2, `translate(0,${(-26 * span(q, T_MORN + 2.2, T_MORN + 2.8) * (1 - span(q, T_MORN + 3.2, T_MORN + 3.8))).toFixed(1)})`);
    cap(q);
  });
}
