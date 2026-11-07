/* scene2.js — Rule Eight. The wall clock behind the counter turns from 4:43 to 4:44; the list, Rule Eight; the lights
   start to flicker, Dani behind the counter; then the store goes dark and comes back three times, the girl closer each
   time ("Please... please... please"), smiling wider; "PLEASE" — her face, huge, grinning, and black; Dani gripping
   the counter, eyes shut; flashes: closer, the smile bigger, the feet wetter; the lights stop: the doors, nobody,
   wet prints; the checkout: the bare wall, the prints running up to it, and no door. */
'use strict';
const PRE2 = .3;

function scene2(p, D, m) {
  const sc = t => PRE2 + t;
  const LI = listInsert(p);
  // the counter: the clock on the wall above it, Dani behind it
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 440, y: 200, z: 3.2 });
  const clock = wallClock(K.cam.layer('bg'), 440, 200, .9); nightGrade(ctr, .9);
  // the doors: the girl closer each time the lights come back; a puddle under her
  const ent = mk('g', {}, p), E = entrance(ent, { x: 800, y: 450, z: 1.05 });
  const rain = rainGlass(E.cam.layer('bg'), 446, 302, 300, 276);
  const ENT_TRAIL = printTrail([610, 610], [800, 900], 12, 16);
  const prints = footprints(mk('g', {}, E.cam.stage), ENT_TRAIL, y => .45 + .9 * (y - 585) / 315);
  const poolG = mk('g', {}, E.cam.stage), pool = puddle(poolG, 0, 0, 220), girl = girlPuppet(E.cam.stage); nightGrade(ent, .95);
  // the checkout's bare wall again, the prints running up to it
  const chk = mk('g', {}, p), C = checkout(chk, { x: 905, y: 480, z: 2.2 });
  footprints(mk('g', {}, C.cam.layer('bg')), printTrail([905, 900], [905, 640], 11, 14), y => .55 + .75 * (y - 627) / 273).pose(11);
  nightGrade(chk, .9);
  // the lights: a black sheet over the picture (under the captions)
  const dark = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#020304', opacity: 0, 'pointer-events': 'none' }, p);
  const cap = hsCaptions(p, 'scene2', PRE2);

  const T_444 = sc(1.7), T_LIST = sc(2.6), T_FLICK = sc(6.0), T_G04 = sc(10.07), PL = [sc(11.32), sc(13.38), sc(15.38)], T_G05 = sc(17.32),
    T_BLACK = sc(18.45), T_HELD = sc(20.3), T_CLOSER = sc(25.45), T_SMILE = sc(26.7), T_FEET = sc(28.5), T_WHEN = sc(29.6), T_STOP = sc(31.76),
    T_GONE = sc(31.9), T_NODOOR = sc(33.05);
  // when the lights are on (the rest of the time, black): flickering under Rule Eight, a window for each "please",
  // the face, Dani holding on, three flashes, a stutter, then steady
  const ON = [[0, T_FLICK + .5], [T_FLICK + .62, T_FLICK + 1.1], [T_FLICK + 1.2, T_FLICK + 1.25], [T_FLICK + 1.4, T_FLICK + 2.6], [T_FLICK + 2.7, T_FLICK + 3.3],
    [T_FLICK + 3.45, T_G04 + .2], ...PL.map(t => [t - .25, t + 1.1]), [T_G05 - .05, T_BLACK], [T_HELD - .1, T_HELD + 1.1], [T_HELD + 1.25, T_HELD + 2.1],
    [T_CLOSER, T_CLOSER + .9], [T_SMILE, T_SMILE + 1.3], [T_FEET, T_FEET + 1.0], [T_WHEN + .2, T_WHEN + .45], [T_WHEN + .7, T_WHEN + 1.4],
    [T_WHEN + 1.55, T_WHEN + 1.65], [T_WHEN + 1.8, 99]];
  const lit = q => ON.some(([a, b]) => q >= a && q < b);
  ON.forEach(([a], i) => { if (i && a > T_FLICK) sfx('scene2', a, 'flicker', .45); });
  sfx('scene2', T_444 - .05, 'tick', .8); sfx('scene2', T_G05 + .02, 'boom', .9); sfx('scene2', T_FLICK - .4, 'rain', .25);
  sfx('scene2', T_STOP + .1, 'rain', .3);
  const SHOTS = [[0, 'clock'], [T_LIST, 'list'], [T_FLICK - .2, 'dani'], [T_G04, 'girl'], [T_G05 - .05, 'face'], [T_BLACK, 'dani'],
    [T_CLOSER, 'girl'], [T_SMILE, 'face'], [T_FEET, 'feet'], [T_WHEN, 'empty'], [T_NODOOR, 'wall']];
  K.cam.to({ z: 3.45 }, 0, T_LIST).cut({ x: 800, y: 420, z: 2.1 }, T_FLICK - .2).to({ z: 2.3 }, T_FLICK, 4)
    .cut({ x: 800, y: 520, z: 1.55 }, T_BLACK).to({ y: 500, z: 1.75 }, T_HELD, 6);
  E.cam.cut({ x: 800, y: 450, z: 1.05 }, T_G04).cut({ x: 760, y: 410, z: 2.3 }, T_G05 - .05).to({ z: 2.6 }, T_G05, 1.1)
    .cut({ x: 790, y: 470, z: 1.5 }, T_CLOSER).cut({ x: 760, y: 410, z: 2.6 }, T_SMILE).to({ z: 2.75 }, T_SMILE, 1.3)
    .cut({ x: 790, y: 900, z: 2.6 }, T_FEET).cut({ x: 760, y: 560, z: 1.25 }, T_WHEN).to({ x: 740, y: 540, z: 1.15 }, T_GONE, 3.4);
  C.cam.cut({ x: 905, y: 560, z: 1.9 }, T_NODOOR).to({ x: 905, y: 500, z: 2.4 }, T_NODOOR, 4);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list'); vis(ctr, shot === 'clock' || shot === 'dani'); vis(ent, ['girl', 'face', 'feet', 'empty'].includes(shot)); vis(chk, shot === 'wall');
    dark.setAttribute('opacity', lit(q) ? 0 : .96);
    if (shot === 'list') { LI.view(300, LI.L.ruleY[7] + 20, 1.7 + .25 * span(q, T_LIST, T_FLICK)); LI.L.pose({}); }
    if (shot === 'clock' || shot === 'dani') {
      K.cam.apply(q, f); clock.pose(q < T_444 ? '4:43' : '4:44'); K.tv.pose({ t: q < T_444 ? clockAt('04:43:57', q) : clockAt('04:44:00', q - T_444) });
      // holding the counter with both hands, eyes shut, after the face
      const dj = { x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0 }, held = q > T_BLACK;
      const r = frontReach(dj, 'R', [dj.x + 120, CTR.top + 6]), l = frontReach(dj, 'L', [dj.x - 120, CTR.top + 6]);
      K.dani.pose({ ...dj, rua: held ? r.rua : 4, rfa: held ? r.rfa : 0, lua: held ? l.lua : -4, lfa: held ? l.lfa : 0,
        look: held ? 0 : -.4, brow: q > T_FLICK ? 1 : .3, nod: held ? 8 : 0, shut: held || (q % 3.3) < .12,
        mouth: held ? worried('X') : worried(lips(q, 'scene2', PRE2, 'd25')) }, f);
    }
    if (['girl', 'face', 'feet', 'empty'].includes(shot)) {
      E.cam.apply(q, f); rain.pose(q);
      // where she stands each time the lights come back (feet on the floor, scale), and how wide the smile is
      const k = q < PL[1] - .3 ? 0 : q < PL[2] - .3 ? 1 : 2;
      const STAND = [[620, 610, .5, .15], [700, 720, .82, .35], [790, 860, 1.2, .6]];
      let [x, gy, s, grin] = STAND[k];
      if (shot === 'girl' && q > T_CLOSER) [x, gy, s, grin] = [790, 990, 1.65, .8];
      if (shot === 'face') [x, gy, s, grin] = [760, 400 + 196 * 3.1, 3.1, 1];   // her hip set so the face fills the frame
      if (shot === 'feet') [x, gy, s, grin] = [790, 960, 1.2, .9];
      const y = shot === 'face' ? gy : hipOn(gy, s);
      girl.pose({ x, y, s, head: 'F', turn: 0, rua: 6, lua: -6, look: 0, brow: -.3, nod: shot === 'face' ? 4 : 0,
        mouth: shot === 'face' ? 'X' : lips(q, 'scene2', PRE2, 'g04'), shut: false }, f);
      girl.grin(grin); vis(girl.g, shot !== 'empty');
      // the wet: a puddle under her feet that grows each time; afterwards, the prints from the doors to the counter
      pool.pose(shot === 'empty' ? 0 : shot === 'feet' ? .7 + .5 * span(q, T_FEET, T_FEET + 1) : .2 + .25 * k);
      tf(poolG, `translate(${x},${gy}) scale(${s.toFixed(3)})`);
      prints.pose(shot === 'empty' ? ENT_TRAIL.length : 0);
    }
    if (shot === 'wall') C.cam.apply(q, f);
    cap(q);
  });
}
