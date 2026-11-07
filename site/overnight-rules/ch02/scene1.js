/* scene1.js — Rule One. The list, Rule One; Dani bored behind the counter ("Easy."); the doors: a chime, and nobody;
   wet footprints appearing one by one across the floor to the front of the counter; Dani frozen ("I didn't move.");
   the doors again, a chime; morning: the trail of prints, every one pointing at the counter. */
'use strict';
const PRE1 = .3;
// the trail, in the checkout set's floor (world px): from the aisles at the left, round to the front of the counter
const TRAIL = (() => { const pts = [[300, 890], [420, 840], [560, 800], [700, 768], [830, 744], [950, 724], [1050, 708], [1110, 700]], out = [];
  for (let i = 0; i < 15; i++) { const u = i / 14 * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(u)), f = u - k;
    const [x0, y0] = pts[k], [x1, y1] = pts[k + 1], x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f;
    const a = Math.atan2(x1 - x0, -(y1 - y0)) * 180 / Math.PI, side = i % 2 ? 1 : -1, nx = Math.cos(a * Math.PI / 180) * 14 * side;
    out.push([x + nx, y + Math.sin(a * Math.PI / 180) * 14 * side * .4, a, side]); }
  return out; })();
const trailScale = y => .55 + .75 * (y - 627) / 273;

function scene1(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene1', PRE1, clip, t);
  const LI = listInsert(p);
  const chk = mk('g', {}, p), C = checkout(chk, { x: 800, y: 450, z: 1 }), danic = daniPuppet(C.cam.stage);
  const prints = footprints(mk('g', {}, C.cam.layer('bg')), TRAIL, trailScale);
  const chkNight = nightGrade(chk, .9);
  const ent = mk('g', {}, p), E = entrance(ent, { x: 800, y: 450, z: 1.05 }); nightGrade(ent, .95);
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 800, y: 400, z: 2.2 }); nightGrade(ctr, .9);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const sc = t => PRE1 + t;   // a time in the joined scene clip (narration.en.words.txt)
  const T_EASY = sc(5.55), T_DOOR = sc(8.4), T_STEPS = sc(14.3), T_STILL = sc(20.7), T_DOOR2 = sc(22.35), T_MORN = sc(25.6);
  const SHOTS = [[0, 'list'], [T_EASY, 'bored'], [T_DOOR, 'door'], [T_STEPS, 'steps'], [T_STILL, 'still'], [T_DOOR2, 'door'], [T_MORN, 'morning']];
  const STEP_T = TRAIL.map((_, i) => T_STEPS + .2 + i * (5.8 / TRAIL.length));
  STEP_T.forEach((t, i) => sfx('scene1', t, 'squelch', .25 + .02 * i));
  sfx('scene1', sc(10.0), 'chime', .9); sfx('scene1', sc(24.3), 'chime', .9);
  C.cam.cut({ x: 1100, y: 470, z: 1.9 }, T_EASY).to({ z: 2.0 }, T_EASY, 3)
    .cut({ x: 760, y: 560, z: 1.05 }, T_STEPS).to({ x: 880, y: 600, z: 1.3 }, T_STEPS, 6)
    .cut({ x: 760, y: 560, z: 1.05 }, T_MORN).to({ x: 1000, y: 640, z: 1.5 }, T_MORN + 1, 6.5);
  E.cam.cut({ x: 760, y: 470, z: 1.15 }, T_DOOR).to({ z: 1.3 }, T_DOOR, 4).cut({ x: 760, y: 470, z: 1.3 }, T_DOOR2).to({ z: 1.45 }, T_DOOR2, 3.4);
  K.cam.to({ z: 2.45 }, T_STILL, 1.6);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(chk, ['bored', 'steps', 'morning'].includes(shot)); vis(ent, shot === 'door'); vis(ctr, shot === 'still');
    vis(chkNight, shot !== 'morning');
    if (shot === 'list') { const y = LI.L.ruleY[0]; LI.view(300, y + 20, 1.7 + .25 * span(q, 0, T_EASY)); LI.L.pose({}); }
    if (['bored', 'steps', 'morning'].includes(shot)) {
      C.cam.apply(q, f);
      const k = shot === 'bored' ? 0 : shot === 'morning' ? TRAIL.length : STEP_T.filter(t => q >= t).length;
      prints.pose(k);
      const dj = { x: CHK.behind[0], y: hipOn(CHK.behind[1], .7), s: .7, head: 'F', turn: 0 };
      danic.pose({ ...dj, lua: -6, rua: 6, look: shot === 'steps' ? -.6 : .2, brow: shot === 'steps' ? .9 : 0, nod: shot === 'bored' ? 6 : 0,
        mouth: shot === 'steps' ? 'A' : 'X', shut: shot === 'bored' && (q % 2.7) < .14 }, f);
      vis(danic.g, shot !== 'morning');
    }
    if (shot === 'door') E.cam.apply(q, f);
    if (shot === 'still') {
      K.cam.apply(q, f);
      K.dani.pose({ x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0, lua: -4, rua: 4, look: 0, brow: 1, nod: 0, mouth: 'A' }, f);
      K.tv.pose({ t: clockAt('02:06:40', q) });
    }
    cap(q);
  });
}
