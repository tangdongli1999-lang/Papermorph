/* scene1.js — Rule Seven. The list, Rule Seven; the doors chime and a little girl is standing just inside them,
   rain running down the glass behind her: pyjamas, bare feet, dry; close on her: "Excuse me. Can I use your
   bathroom?"; Dani: "Sorry, sweetie. We don't have one."; the girl: "Yes, you do. It's in the back." — she points:
   "Past the freezers."; Dani; then the checkout: past the freezers, on the bare wall, a door with a little sign, the
   camera pushing in on it ("That door had never been there."); the girl, close, a hand out: "Can you take me?" */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (narration.en.words.txt)
  const LI = listInsert(p);
  // the doors at night, rain on the glass, the girl standing just inside them
  const ent = mk('g', {}, p), E = entrance(ent, { x: 800, y: 450, z: 1.05 });
  const rain = rainGlass(E.cam.layer('bg'), 446, 302, 300, 276);
  const girl = girlPuppet(E.cam.stage), girlC = girlPuppet(E.cam.stage);
  nightGrade(ent, .95);
  // Dani at the counter
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 800, y: 400, z: 2.3 }); nightGrade(ctr, .9);
  // the checkout: past the freezers, the bare wall, and a door
  const chk = mk('g', {}, p), C = checkout(chk, { x: 900, y: 480, z: 1.3 });
  const door = restroomDoor(C.cam.layer('bg'), 846, 627, 118, 262); nightGrade(chk, .9);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const T_DOOR = sc(6.9), T_FEET = sc(12.3), T_RAIN = sc(15.55), T_G01 = sc(17.6), T_D23 = sc(21.75), T_G02 = sc(26.25), T_POINT = sc(29.25),
    T_D24 = sc(31.1), T_WALL = sc(33.85), T_G03 = sc(42.5);
  const SHOTS = [[0, 'list'], [T_DOOR, 'door'], [T_FEET, 'feet'], [T_RAIN, 'door'], [T_G01, 'girl'], [T_D23, 'dani'], [T_G02, 'girl'],
    [T_D24, 'dani'], [T_WALL, 'wall'], [T_G03, 'girl']];
  sfx('scene1', T_DOOR + .1, 'chime', .9);
  sfx('scene1', T_DOOR - .2, 'rain', .35); sfx('scene1', T_DOOR + 7.6, 'rain', .3);
  sfx('scene1', sc(39.7), 'boom', .35);
  E.cam.cut({ x: 600, y: 470, z: 1.15 }, T_DOOR).to({ x: 600, y: 470, z: 1.6 }, T_DOOR, 5.2)
    .cut({ x: 600, y: 568, z: 3.4 }, T_FEET).to({ z: 3.6 }, T_FEET, 3)
    .cut({ x: 600, y: 440, z: 1.45 }, T_RAIN).to({ z: 1.6 }, T_RAIN, 2)
    .cut({ x: 760, y: 420, z: 2.2 }, T_G01).to({ z: 2.4 }, T_G01, 4)
    .cut({ x: 790, y: 440, z: 2.0 }, T_G02).to({ x: 820, z: 2.1 }, T_G02, 4.5)
    .cut({ x: 760, y: 420, z: 2.3 }, T_G03).to({ z: 2.7 }, T_G03, 5.4);
  K.cam.cut({ x: 800, y: 400, z: 2.3 }, T_D23).to({ z: 2.45 }, T_D23, 4.4).cut({ x: 800, y: 390, z: 2.6 }, T_D24);
  C.cam.cut({ x: 820, y: 470, z: 1.35 }, T_WALL).to({ x: 905, y: 480, z: 2.5 }, T_WALL + 1.5, 7);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(ent, ['door', 'feet', 'girl'].includes(shot)); vis(ctr, shot === 'dani'); vis(chk, shot === 'wall');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[6] + 20, 1.7 + .25 * span(q, 0, T_DOOR)); LI.L.pose({}); }
    if (['door', 'feet', 'girl'].includes(shot)) {
      E.cam.apply(q, f); rain.pose(q);
      const close = shot === 'girl', mouth = lips(q, 'scene1', PRE1, 'g01', 'g02', 'g03');
      // wide: small, just inside the doors, quite still; close: big, filling the frame
      const gw = { x: 600, y: hipOn(600, .45), s: .45, head: 'F', turn: 0, rua: 6, lua: -6, look: 0, brow: 0, mouth: 'X', shut: (q % 4.1) < .1 };
      girl.pose(gw, f); vis(girl.g, !close);
      const gc = { x: 760, y: hipOn(990, 1.6), s: 1.6, head: 'F', turn: 0 };
      const pointing = q > T_POINT && q < T_D24, reachOut = q > T_G03 + .8;
      const pt = frontReach(gc, 'R', [gc.x + 190, gc.y - 170 * gc.s]), out = frontReach(gc, 'L', [gc.x - 70, gc.y - 70 * gc.s]);
      const kp = span(q, T_POINT, T_POINT + .35), ko = span(q, T_G03 + .8, T_G03 + 1.6);
      girlC.pose({ ...gc, rua: 6 + (pt.rua - 6) * kp, rfa: pt.rfa * kp, lua: -6 + (out.lua + 6) * ko, lfa: out.lfa * ko,
        look: pointing ? .7 : 0, brow: q > T_G03 + 1.4 ? -.5 : 0, nod: q > T_G03 ? 5 : 2, mouth, shut: (q % 3.9) < .1 }, f);
      girlC.grin(0); girl.grin(0);
      vis(girlC.g, close);
    }
    if (shot === 'dani') {
      K.cam.apply(q, f); K.tv.pose({ t: clockAt('04:40:31', q) });
      K.dani.pose({ x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0, lua: -4, rua: 4, look: q > T_D24 ? .5 : -.1,
        brow: q > T_D24 ? .9 : .4, nod: q < T_D24 ? 6 : 0, mouth: worried(lips(q, 'scene1', PRE1, 'd23', 'd24')), shut: (q % 3.4) < .12 }, f);
    }
    if (shot === 'wall') { C.cam.apply(q, f); door.pose(1); }
    cap(q);
  });
}
