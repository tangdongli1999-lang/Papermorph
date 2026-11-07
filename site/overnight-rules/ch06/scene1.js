/* scene1.js — Morning. Dawn through the doors, the chime: Mr. Okafor comes in with his coffee; at the counter: "Morning,
   Dani. Quiet night?" — Dani behind it, her smile too wide: "So quiet."; over his shoulder: "Told you. Marcus always made
   it sound so dramatic." — and on the monitor behind her, camera four: the real Dani hammering on nothing; camera four,
   full: her, screaming without a sound; "I can see the whole store from here": aisle four's view up to the counter, her
   at it; "And every night, I can see the phone": the phone on the wall at night. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;
  const morning = g => { const r = mk('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#ffd9a0', opacity: .07, 'pointer-events': 'none' }, g); return r; };
  // the doors at dawn, Okafor coming in
  const ent = mk('g', {}, p), E = entrance(ent, { x: 760, y: 470, z: 1.15 }, true), okE = okaforPuppet(E.cam.stage);
  // the checkout: him in front of the counter (his back to us), her behind it
  const chk = mk('g', {}, p), C = checkout(chk, { x: 1110, y: 520, z: 1.9 }), herC = daniPuppet(C.cam.stage, { other: 'smile' }), okC = okaforPuppet(C.front); morning(chk);
  // the counter close-up: her, the monitor (camera four: the real Dani), him at the right edge, from behind
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 760, y: 430, z: 1.5 }); vis(K.dani.g, false);
  const her = daniPuppet(K.cam.stage, { other: 'smile' }), okK = okaforPuppet(K.cam.layer('front')); morning(ctr);
  const real4 = daniPuppet(K.tv.slot4);
  // camera four, full frame
  const gridG = mk('g', {}, p), grid = cctv(gridG), realBig = daniPuppet(grid.slot4);
  // aisle four's view of the store, by day; and the phone at night
  const view = mk('g', {}, p), V = checkout(view, { x: 800, y: 450, z: 1 }), herV = daniPuppet(V.cam.stage, { other: 'smile' }); morning(view);
  const night = mk('g', {}, p), N = counterShot(night, { x: 1193, y: 380, z: 2.4 }); vis(N.dani.g, false); nightGrade(night, 1.2);
  const cap = hsCaptions(p, 'scene1', PRE1, { red: ['od4'] });

  const T_IN = sc(.5), T_HI = sc(2.9), T_SO = sc(5.8), T_TOLD = sc(8.45), T_CAM = sc(12.6), T_VIEW = sc(17.5), T_CTR = sc(20.8), T_HER = sc(22.45), T_PHONE = sc(23.45);
  const SHOTS = [[0, 'door'], [T_HI, 'counter'], [T_SO, 'her'], [T_TOLD, 'over'], [T_CAM, 'cam4'], [T_VIEW, 'view'], [T_PHONE, 'phone']];
  sfx('scene1', T_IN, 'chime', .9);
  for (let i = 0; i < 4; i++) sfx('scene1', T_IN + .5 + i * .55, 'step1', .3);
  E.cam.to({ x: 740, y: 480, z: 1.3 }, 0, T_HI);
  C.cam.to({ z: 2.05 }, T_HI, 3);
  K.cam.cut({ x: 800, y: 390, z: 2.4 }, T_SO).to({ z: 2.6 }, T_SO, 2.5).cut({ x: 640, y: 480, z: 1.45 }, T_TOLD).to({ x: 520, y: 520, z: 1.75 }, T_TOLD + .8, 3.6);
  V.cam.cut({ x: 820, y: 470, z: 1.05 }, T_VIEW).to({ x: 1010, y: 470, z: 1.55 }, T_CTR, 1.6).to({ x: 1140, y: 420, z: 2.6 }, T_HER, 1.0);
  N.cam.to({ z: 2.9 }, T_PHONE, 5);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), ts = clockAt('06:58:12', q);
    vis(ent, shot === 'door'); vis(chk, shot === 'counter'); vis(ctr, shot === 'her' || shot === 'over'); vis(gridG, shot === 'cam4'); vis(view, shot === 'view'); vis(night, shot === 'phone');
    // the real Dani, on camera four: hammering on the air in front of her, screaming without a sound
    const bang = Math.sin(q * 9), rd = { x: 400, y: hipOn(430, .62), s: .62, head: 'F', turn: 0 };
    const rr = frontReach(rd, 'R', [rd.x + 34, rd.y - 205 * rd.s + 26 * bang]), rl = frontReach(rd, 'L', [rd.x - 34, rd.y - 205 * rd.s - 26 * bang]);
    const rpose = { ...rd, rua: rr.rua, rfa: rr.rfa, lua: rl.lua, lfa: rl.lfa, brow: 1, mouth: 'D', nod: 3 * bang, x: rd.x + 6 * Math.sin(q * 2.3) };
    real4.pose(rpose, f); realBig.pose(rpose, f); K.tv.pose({ t: ts }); grid.pose({ t: ts });
    const smile = (o, x, gy, s, extra = {}, raw = false) => o.pose({ x, y: raw ? gy : hipOn(gy, s), s, head: 'F', turn: 0, rua: 4, lua: -4, look: 0, brow: 0, mouth: 'X', shut: (q % 5.3) < .1, ...extra }, f);
    if (shot === 'door') {
      E.cam.apply(q, f);
      const k = span(q, T_IN + .3, T_HI - .1), mv = k > 0 && k < 1, step = mv ? Math.sin((q - T_IN) / .55 * Math.PI) : 0;
      const x = 600 + 140 * k, gy = 610 + 170 * k, s = .5 + .35 * k, c = frontReach({ x, y: 0, s }, 'R', [x + 30 * s, -140 * s]);
      okE.pose({ x, y: hipOn(gy, s) - (mv ? 4 * Math.abs(step) * s : 0), s, head: 'F', turn: 0, stepF: step, rua: c.rua, rfa: c.rfa, hold: 'coffee', lua: -4, look: .2, mouth: 'X' }, f);
      vis(okE.g, q > T_IN + .2);
    }
    if (shot === 'counter') {
      C.cam.apply(q, f);
      okC.pose({ x: 1085, y: hipOn(745, .8), s: .8, head: 'F', turn: 0, back: true, rua: 4, lua: -4, nod: 4 }, f);
      smile(herC, CHK.behind[0] + 20, CHK.behind[1], .7);
    }
    if (shot === 'her' || shot === 'over') {
      K.cam.apply(q, f);
      smile(her, CTR.dani[0], CTR.dani[1], 1.9, { mouth: q > T_SO && q < T_TOLD ? lips(q, 'scene1', PRE1, 'od4') : 'X', nod: shot === 'her' ? 3 : 0, look: shot === 'over' ? .5 : 0 }, true);
      vis(okK.g, shot === 'over');
      tf(K.tv.g, shot === 'over' ? K.tv.zoomTo(4, span(q, T_TOLD + 1.2, T_TOLD + 2.0)) : '');   // the monitor switches to camera four
      okK.pose({ x: 1150, y: 1010, s: 2.0, head: 'F', turn: 0, back: true, lua: -4, rua: 4, nod: 3 + 2 * Math.sin(q * 1.3) }, f);
    }
    if (shot === 'cam4') tf(gridG, grid.zoomTo(4, span(q, T_CAM, T_CAM + 1.4)));
    if (shot === 'view') { V.cam.apply(q, f); smile(herV, CHK.behind[0] + 20, CHK.behind[1], .7, { look: q > T_HER ? 0 : .3 }); }
    if (shot === 'phone') N.cam.apply(q, f);
    cap(q);
  });
}
