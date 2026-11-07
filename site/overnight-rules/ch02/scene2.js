/* scene2.js — Rule Two. The list, Rule Two; the freezer door standing open, cold mist rolling across the floor;
   Dani beside it, eyes shut, pushing it closed; the door shut, then knocked open a crack from inside and slammed back
   (a thud); Dani's face, eyes still shut, opening a little: "Like it was testing me." */
'use strict';
const PRE2 = .3;

function scene2(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene2', PRE2, clip, t);
  const LI = listInsert(p);
  const open = mk('g', {}, p), O = paperCam(open, 'fridgeOpen', { x: 800, y: 450, z: 1 });
  const mist = fridgeMist(O.stage, 1000, 860); nightGrade(open, .55);
  const shut = mk('g', {}, p), S = paperCam(shut, 'fridge', { x: 800, y: 450, z: 1 }), daniS = daniPuppet(S.stage); nightGrade(shut, .55);
  const daniO = daniPuppet(O.stage);
  const cap = hsCaptions(p, 'scene2', PRE2);
  const T_OPEN = at('d08', 6.6), T_CLOSE = at('d08', 11.5), T_SHUT = at('d08', 13.3), T_PUSH = at('d08', 16.25), T_FACE = at('d08', 17.1);
  const SHOTS = [[0, 'list'], [T_OPEN, 'open'], [T_CLOSE, 'closing'], [T_SHUT, 'shut']];
  O.cam = O; S.cam = S;
  O.to({ x: 820, y: 470, z: 1.12 }, T_OPEN, 5).cut({ x: 1000, y: 470, z: 1.25 }, T_CLOSE);
  S.cut({ x: 1000, y: 470, z: 1.25 }, T_SHUT).cut({ x: 1150, y: 360, z: 2.4 }, T_FACE).to({ z: 2.75 }, T_FACE, 4);
  sfx('scene2', T_SHUT, 'knock', .7); sfx('scene2', T_PUSH, 'knock', 1.4); sfx('scene2', T_PUSH + .22, 'knock', 1.0);

  stopClock(D, (q, f) => {
    let shot = shotAt(q, SHOTS);
    const crack = q > T_PUSH && q < T_PUSH + .2;   // the door knocked open from inside for a moment
    if (shot === 'shut' && crack) shot = 'closing';
    vis(LI.g, shot === 'list'); vis(open, shot === 'open' || shot === 'closing'); vis(shut, shot === 'shut');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[1] + 20, 1.7 + .25 * span(q, 0, T_OPEN)); LI.L.pose({}); }
    // Dani to the right of the door, eyes shut, her near arm out to its edge
    const dj = { x: 1260, y: hipOn(1010, 1.6), s: 1.6, head: 'F', turn: 0 };
    const reach = frontReach(dj, 'L', [1060, 560]), jolt = q > T_PUSH && q < T_PUSH + .5 ? 8 * Math.sin((q - T_PUSH) * 40) : 0;
    const dpose = (on) => ({ ...dj, x: dj.x + jolt * .6, lua: on ? reach.lua + jolt : -8, lfa: on ? reach.lfa : 6, rua: 8, shut: q < T_FACE + 2.6, brow: .9,
      mouth: 'A', look: -.3, nod: 4 });
    if (shot === 'open' || shot === 'closing') {
      O.apply(q, f); mist.pose(q, shot === 'open' ? span(q, T_OPEN, T_OPEN + 3) : 1); vis(daniO.g, shot === 'closing'); daniO.pose(dpose(true), f);
    }
    if (shot === 'shut') { S.apply(q, f); daniS.pose(dpose(q < T_PUSH + 1.2), f); }
    cap(q);
  });
}
