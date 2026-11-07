/* scene2.js — The new guy. Night again: Theo behind the counter; he finds the list under the register; the list: under
   Rule Eight, in a different pen, Rule Nine — "If Dani is working with you… she isn't."; the wall phone rings; Theo
   stares at it; camera four: Dani in aisle four, a receiver at her ear, looking up into the camera ("I'm going to call
   him tonight."); the ringing phone, closer ("I just haven't decided what to tell him."); smash to black, the phone
   still ringing; the title. */
'use strict';
const PRE2 = .3;

function scene2(p, D, m) {
  const sc = t => PRE2 + t;
  // the checkout at night, Theo behind the counter
  const chk = mk('g', {}, p), C = checkout(chk, { x: 1110, y: 520, z: 1.9 }), theoC = theoPuppet(C.cam.stage); nightGrade(chk, .9);
  // the counter close-up: Theo, the wall phone (drawn over the painted one, so it can shake)
  const ctr = mk('g', {}, p), K = counterShot(ctr, { x: 900, y: 420, z: 2.0 }); vis(K.dani.g, false);
  const phone = wallPhone(mk('g', { transform: 'translate(1193,382) scale(1.18)' }, K.cam.layer('bg')));
  const theo = theoPuppet(K.cam.stage); nightGrade(ctr, .9);
  const dani4 = daniPuppet(K.tv.slot4);
  const LI = listInsert(p);
  // camera four, full: Dani with the receiver
  const gridG = mk('g', {}, p), grid = cctv(gridG), daniBig = daniPuppet(grid.slot4);
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p), title = hsTitle(p);
  const cap = hsCaptions(p, 'scene2', PRE2);

  const T_LIST = sc(2.85), T_NINE = sc(7.1), T_RING = sc(12.3), T_CALL = sc(14.5), T_TELL = sc(17.0), T_BLACK = sc(20.95), T_TITLE = sc(21.9);
  const SHOTS = [[0, 'theo'], [T_LIST, 'found'], [T_NINE, 'list'], [T_RING, 'ring'], [T_CALL, 'cam4'], [T_TELL, 'ring'], [T_BLACK, 'black']];
  for (let t = T_RING; t < sc(25.2); t += 3.0) sfx('scene2', t, 'ring', t > T_BLACK ? 1.0 : .8);
  sfx('scene2', T_BLACK, 'boom', .7);
  C.cam.to({ x: 1120, y: 500, z: 2.1 }, 0, T_LIST);
  K.cam.cut({ x: 780, y: 560, z: 2.2 }, T_LIST).to({ z: 2.4 }, T_LIST, 4)
    .cut({ x: 1000, y: 400, z: 1.9 }, T_RING).to({ x: 1030, z: 2.05 }, T_RING, 2.2).cut({ x: 1170, y: 370, z: 2.6 }, T_TELL).to({ z: 3.4 }, T_TELL, 4);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), ts = clockAt('23:52:40', q);
    vis(chk, shot === 'theo'); vis(ctr, shot === 'found' || shot === 'ring'); vis(LI.g, shot === 'list'); vis(gridG, shot === 'cam4');
    vis(black, shot === 'black'); vis(title.g, shot === 'black'); title.pose({ o: span(q, T_TITLE, T_TITLE + 1.2) });
    // Dani in aisle four, a receiver at her ear; she lifts her face to the camera when she says she'll call him
    const dd = { x: 400, y: hipOn(430, .62), s: .62, head: 'F', turn: 0 }, ear = frontReach(dd, 'R', [dd.x + 40 * dd.s, dd.y - 150 * dd.s]);
    const up = span(q, T_CALL + .4, T_CALL + 1.6);
    const dpose = { ...dd, rua: ear.rua, rfa: ear.rfa, rFront: true, hold: 'receiver', lua: -4, look: 0, brow: .4 - .8 * up, nod: 14 - 22 * up, mouth: 'X', shut: (q % 4.4) < .1 };
    dani4.pose(dpose, f); daniBig.pose(dpose, f); K.tv.pose({ t: ts }); grid.pose({ t: ts });
    if (shot === 'theo') {
      C.cam.apply(q, f);
      theoC.pose({ x: CHK.behind[0] + 20, y: hipOn(CHK.behind[1], .7), s: .7, head: 'F', turn: 0, rua: 4, lua: -4, look: -.3, nod: 6, mouth: 'X', shut: (q % 3.3) < .12 }, f);
    }
    if (shot === 'found' || shot === 'ring') {
      K.cam.apply(q, f);
      const ringing = shot === 'ring', shake = ringing && ((q - T_RING) % 3.0) < 1.6;
      phone.pose({ off: 0, shake }, f);
      const tj = { x: 820, y: CTR.dani[1], s: 1.85, head: 'F', turn: 0 }, hl = frontReach(tj, 'R', [tj.x + 30, tj.y - 130 * tj.s]);
      const reading = shot === 'found';
      theo.pose({ ...tj, rua: reading ? hl.rua : 4, rfa: reading ? hl.rfa : 0, hold: reading ? 'list' : null, lua: -4,
        look: ringing ? .9 : .1, nod: reading ? 12 : 0, brow: ringing ? .9 : .2, mouth: ringing ? 'A' : 'X', shut: !ringing && (q % 3.1) < .12 }, f);
    }
    if (shot === 'list') {   // down past Rule Eight to the new line in a different pen, the ink coming
      LI.view(300, LI.L.h - 74 - 24 * span(q, T_NINE, T_NINE + 4), 1.7 + .5 * span(q, T_NINE, T_RING));
      LI.L.pose({ faint: 1, nine: span(q, T_NINE + .3, T_NINE + 1.3) });
    }
    if (shot === 'cam4') tf(gridG, grid.zoomTo(4, 1));
    cap(q);
  });
}
