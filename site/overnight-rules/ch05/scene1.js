/* scene1.js — back to 4:51. The cameras again, pushing into camera four: the other Dani in aisle four, waving; the wall
   phone rings and Dani picks up: Marcus ("Dani. You see her? Go.") — camera four, her waving — Dani listening; the line
   cuts; "He sounded so sure. And I was so tired": flashes of the footprints, the open freezer, the girl's grin; the
   list, Rule Six and "don't listen to me", the "— M." under it; Dani between the phone and the monitor; "I went": she
   comes out from behind the counter. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;
  // the cameras, full frame, the other Dani in camera four
  const gridG = mk('g', {}, p), grid = cctv(gridG), otherBig = daniPuppet(grid.slot4, { other: true });
  // the counter: the wall phone and its cord, Dani; the monitor shows the cameras too
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 1150, y: 400, z: 2.2 }), { cam } = K;
  const other4 = daniPuppet(K.tv.slot4, { other: true });
  const phone = wallPhone(mk('g', { transform: 'translate(1193,382) scale(1.18)' }, cam.layer('bg')));
  const cord = mk('path', { fill: 'none', stroke: '#c8bca2', 'stroke-width': 5, 'stroke-dasharray': '7 4' }, cam.stage);
  cam.stage.appendChild(K.dani.g); nightGrade(ctr, .9);
  // the flashes: the footprints, the open freezer, the girl
  const fp = mk('g', {}, p), F = checkout(fp, { x: 760, y: 640, z: 1.35 });
  footprints(mk('g', {}, F.cam.layer('bg')), printTrail([330, 880], [1100, 702], 15, 14), y => .55 + .75 * (y - 627) / 273).pose(15);
  nightGrade(fp, 1.1);
  const fz = mk('g', {}, p), O = paperCam(fz, 'fridgeOpen', { x: 820, y: 470, z: 1.15 }), mist = fridgeMist(O.stage, 1000, 860); nightGrade(fz, .7);
  const gl = mk('g', {}, p), G = entrance(gl, { x: 760, y: 410, z: 2.6 }), girl = girlPuppet(G.cam.stage); nightGrade(gl, 1.1);
  const LI = listInsert(p);
  // "I went": the checkout, Dani coming out from behind the counter
  const chk = mk('g', {}, p), C = checkout(chk, { x: 1000, y: 560, z: 1.5 }), daniW = daniPuppet(C.cam.stage); nightGrade(chk, .9);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const T_CAM4 = sc(3.85), T_WAVE = sc(7.35), T_RING = sc(8.65), T_LIFT = sc(10.45), T_SEE = sc(11.75), T_GO = sc(12.85), T_CUT = sc(17.15),
    T_TIRED = sc(18.4), T_FP = sc(21.65), T_FRZ = sc(23.45), T_GIRL = sc(24.55), T_LIST = sc(25.7), T_M = sc(29.05), T_WHICH = sc(31.3), T_WENT = sc(35.8);
  const SHOTS = [[0, 'grid'], [T_RING, 'phone'], [T_SEE, 'grid'], [T_GO, 'face'], [T_FP, 'prints'], [T_FRZ, 'freezer'], [T_GIRL, 'girl'],
    [T_LIST, 'list'], [T_WHICH, 'face'], [T_WENT, 'went']];
  sfx('scene1', T_RING, 'ring', .8); sfx('scene1', T_LIFT, 'tick', .9); sfx('scene1', T_CUT, 'dialtone', .4);
  sfx('scene1', T_FP - .05, 'wetstep', .6); sfx('scene1', T_FRZ, 'knock', .7); sfx('scene1', T_GIRL, 'flicker', .4);
  for (let i = 0; i < 4; i++) sfx('scene1', T_WENT + .5 + i * .6, 'step1', .3);
  cam.cut({ x: 1150, y: 400, z: 2.2 }, T_RING).to({ x: 1110, y: 380, z: 2.0 }, T_LIFT, 1.2)
    .cut({ x: 1075, y: 330, z: 2.9 }, T_GO).to({ z: 3.2 }, T_GO, 5).cut({ x: 1070, y: 345, z: 2.6 }, T_TIRED).to({ z: 2.9 }, T_TIRED, 3.2)
    .cut({ x: 900, y: 380, z: 1.6 }, T_WHICH).to({ x: 960, z: 1.75 }, T_WHICH, 4.5);
  O.to({ z: 1.25 }, T_FRZ, 1.2); G.cam.to({ z: 2.8 }, T_GIRL, 1.2);
  C.cam.cut({ x: 1000, y: 560, z: 1.4 }, T_WENT).to({ x: 940, y: 580, z: 1.5 }, T_WENT, 2.5);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), ts = clockAt('04:51:02', q);
    vis(gridG, shot === 'grid'); vis(ctr, shot === 'phone' || shot === 'face'); vis(fp, shot === 'prints'); vis(fz, shot === 'freezer');
    vis(gl, shot === 'girl'); vis(LI.g, shot === 'list'); vis(chk, shot === 'went');
    // the other Dani in aisle four, waving (a slow, small wave, the whole time)
    const wave = span(q, T_WAVE, T_WAVE + .8), wag = 10 * Math.sin((q - T_WAVE) * 7) * wave;
    const od = { x: 330, y: hipOn(408, .4), s: .4, head: 'F', turn: 0, lua: -6, rua: 6 + (-96 + wag * .5) * wave, rfa: (-78 + wag) * wave };
    otherBig.pose(od, f); other4.pose(od, f); grid.pose({ t: ts }); K.tv.pose({ t: ts });
    if (shot === 'grid') tf(gridG, q < T_RING ? grid.zoomTo(4, span(q, sc(.6), T_CAM4) ** 1.3) : grid.zoomTo(4, 1));
    if (shot === 'phone' || shot === 'face') {
      cam.apply(q, f);
      const off = q > T_LIFT, lower = span(q, T_TIRED + 1.2, T_TIRED + 2.4), down = q > T_TIRED + 2.4;
      phone.pose({ off: off && !down ? 1 : 0, shake: q > T_RING && q < T_LIFT }, f);
      const dj = { x: 1065, y: CTR.dani[1], s: 1.9, head: 'F', turn: 0 };
      const ear = [dj.x + 40 * dj.s, dj.y - 150 * dj.s + lower * 120], hand = off && !down ? ear : [1193, 330], r = frontReach(dj, 'R', hand);
      const reaching = span(q, T_LIFT - .5, T_LIFT), holding = off && !down;
      // which way she looks: at the phone, then, when it is down, the monitor and the phone in turn
      const look = q > T_WHICH ? (Math.sin((q - T_WHICH) * 1.4) > 0 ? -.85 : .6) : holding ? -.6 : .6;
      K.dani.pose({ ...dj, rua: holding ? r.rua : down ? 4 : 4 + (r.rua - 4) * reaching, rfa: holding ? r.rfa : down ? 0 : r.rfa * reaching,
        rFront: holding && lower < .8, hold: holding ? 'receiver' : null, lua: -4, look, brow: q > T_SEE ? .95 : .4,
        nod: q > T_TIRED ? 7 * lower : 0, mouth: 'A', shut: (q % 3.6) < .12 || (q > T_TIRED + .5 && q < T_TIRED + 1.1) }, f);
      vis(cord, holding);
      if (holding) cord.setAttribute('d', `M1193,430 C1180,560 ${hand[0] + 40},${hand[1] + 160} ${hand[0]},${hand[1] + 20}`);
    }
    if (shot === 'prints') F.cam.apply(q, f);
    if (shot === 'freezer') { O.apply(q, f); mist.pose(q, 1); }
    if (shot === 'girl') {
      G.cam.apply(q, f);
      girl.pose({ x: 760, y: hipOn(990, 1.6), s: 1.6, head: 'F', turn: 0, rua: 6, lua: -6, look: 0, brow: -.3, mouth: 'X' }, f); girl.grin(1);
    }
    if (shot === 'list') {   // Rule Six and the faint line under it, then down to the "— M." at the bottom
      const y6 = LI.L.ruleY[5], k = span(q, T_M - .2, T_M + 1.4);
      LI.view(300 * (1 - k) + 300 * k, (y6 + 60) * (1 - k) + (LI.L.h - 106) * k, 2.2 + .3 * span(q, T_LIST, T_WHICH)); LI.L.pose({ faint: 1 });
    }
    if (shot === 'went') {   // out from behind the counter, along it towards its end
      C.cam.apply(q, f);
      const PATH = [[1150, 640, .7], [985, 646, .71], [930, 676, .76], [900, 712, .82]];
      const u = span(q, T_WENT + .3, T_WENT + 2.6) * (PATH.length - 1), i = Math.min(PATH.length - 2, Math.floor(u)), t = u - i, A = PATH[i], B = PATH[i + 1];
      const k = u / (PATH.length - 1), x = A[0] + (B[0] - A[0]) * t, gy = A[1] + (B[1] - A[1]) * t, s = A[2] + (B[2] - A[2]) * t, mv = k > 0 && k < 1, ph = (q - T_WENT) / .6;
      const step = mv ? Math.sin(ph * Math.PI) : 0;
      daniW.pose({ x, y: hipOn(gy, s) - (mv ? 5 * Math.abs(step) * s : 0), s, head: 'F', turn: 0, stepF: step, rua: 4, lua: -4,
        look: 0, brow: .6, mouth: 'A' }, f);
    }
    cap(q);
  });
}
