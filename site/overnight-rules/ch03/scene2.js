/* scene2.js — Rule Five. The list, Rule Five; the wall phone behind the counter rings, shaking; Dani lifts the
   receiver: "Brightway Twenty-Four."; Marcus, whispering down the line; close on Dani listening; "When you see
   yourself on the monitor, go" — the monitor's camera four, empty; the line cuts to a dial tone; Dani lowers the
   receiver; the list: Rule Six, and under it, appearing, so faint: "Don't listen to me." */
'use strict';
const PRE2 = .3;

function scene2(p, D, m) {
  const sc = t => PRE2 + t;
  const LI = listInsert(p);
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 1120, y: 360, z: 2.4 }), { cam } = K; nightGrade(ctr, .9);
  // the wall phone (drawn over the painted one so its handset can come off), and the receiver's coiled cord
  const phone = wallPhone(mk('g', { transform: 'translate(1193,382) scale(1.18)' }, cam.layer('bg')));
  const cord = mk('path', { fill: 'none', stroke: '#c8bca2', 'stroke-width': 5, 'stroke-dasharray': '7 4' }, cam.stage);
  cam.stage.appendChild(K.dani.g);
  const gridG = mk('g', {}, p), grid = cctv(gridG);
  const cap = hsCaptions(p, 'scene2', PRE2);

  const T_RING = sc(8.15), T_LIFT = sc(10.35), T_MARCUS = sc(13.36), T_MON = sc(35.5), T_MON_END = sc(37.6), T_DEAD = sc(39.3), T_LIST = sc(41.9), T_FAINT = sc(50.2);
  const SHOTS = [[0, 'list'], [T_RING, 'phone'], [T_MARCUS, 'face'], [T_MON, 'monitor'], [T_MON_END, 'face'], [T_LIST, 'list6']];
  sfx('scene2', T_RING, 'ring', .8); sfx('scene2', T_LIST - 1.9, 'latch', .3);
  sfx('scene2', T_LIFT, 'tick', .9); sfx('scene2', T_DEAD, 'dialtone', .45); sfx('scene2', T_DEAD + 2.3, 'dialtone', .3);
  cam.cut({ x: 1150, y: 400, z: 2.2 }, T_RING).to({ x: 1110, y: 380, z: 2.0 }, T_LIFT, 1.2)
    .cut({ x: 1075, y: 330, z: 2.9 }, T_MARCUS).to({ z: 3.3 }, T_MARCUS, 22).cut({ x: 1080, y: 360, z: 2.4 }, T_DEAD);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(LI.g, shot === 'list' || shot === 'list6'); vis(ctr, shot === 'phone' || shot === 'face'); vis(gridG, shot === 'monitor');
    if (shot === 'list') { LI.view(300, LI.L.ruleY[4] + 15, 1.8 + .2 * span(q, 0, T_RING)); LI.L.pose({}); }
    if (shot === 'list6') {   // Rule Six, then the faint pen line under it, the camera settling on it
      const y6 = LI.L.ruleY[5], k = span(q, T_FAINT, T_FAINT + 3);
      LI.view(300, y6 + 25 + 40 * k, 1.9 + .9 * span(q, T_LIST, T_FAINT + 3.5)); LI.L.pose({ faint: span(q, T_FAINT + .4, T_FAINT + 2.2) });
    }
    if (shot === 'monitor') { tf(gridG, grid.zoomTo(4, span(q, T_MON, T_MON + 1.6))); grid.pose({ t: clockAt('03:31:05', q) }); }
    if (shot === 'phone' || shot === 'face') {
      cam.apply(q, f); K.tv.pose({ t: clockAt('03:30:20', q) });
      const off = q > T_LIFT, lower = span(q, T_DEAD + .6, T_DEAD + 1.8);
      phone.pose({ off: off ? 1 : 0, shake: q > T_RING && q < T_LIFT }, f);
      const dj = { x: 1065, y: CTR.dani[1], s: 1.9, head: 'F', turn: 0 };
      const ear = [dj.x + 40 * dj.s, dj.y - 150 * dj.s + lower * 120], hand = off ? ear : [1193, 330], r = frontReach(dj, 'R', hand);
      const reaching = span(q, T_LIFT - .5, T_LIFT);
      K.dani.pose({ ...dj, rua: off ? r.rua : 4 + (r.rua - 4) * reaching, rfa: off ? r.rfa : r.rfa * reaching, rFront: off && lower < .8, hold: off ? 'receiver' : null,
        lua: -4, look: off ? -.15 : .6, brow: q > T_MARCUS ? .95 : .3, nod: q > T_DEAD ? 6 * lower : 0,
        mouth: worried(lips(q, 'scene2', PRE2, 'd17', 'd19', 'd20')), shut: (q % 3.6) < .12 }, f);
      vis(cord, off);
      if (off) cord.setAttribute('d', `M1193,430 C1180,560 ${hand[0] + 40},${hand[1] + 160} ${hand[0]},${hand[1] + 20}`);
    }
    cap(q);
  });
}
