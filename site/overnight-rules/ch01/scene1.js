/* scene1.js — the cameras. The CCTV grid, each camera named as Dani lists them (register, doors, freezers, aisle
   four); 4:51 a.m., camera four: a girl in a green vest appears in aisle four; cut to Dani behind the counter, staring
   at the monitor; camera four: the other Dani lifts a hand and waves; Dani's face: "This is the night I broke Rule
   Six."; black, a low hit, the title. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene1', PRE1, clip, t);
  // the counter close-up (Dani and the monitor), under the night's grade
  const room = mk('g', {}, p), R = counterShot(room, { x: 560, y: 470, z: 1.45 }), { cam } = R;
  nightGrade(room, .9);
  const other4 = daniPuppet(R.tv.slot4, { other: true });   // the small other Dani on the monitor in the room
  // the cameras, full frame
  const gridG = mk('g', {}, p), grid = cctv(gridG), otherBig = daniPuppet(grid.slot4, { other: true });
  const black = mk('rect', { width: 1600, height: 900, fill: '#000' }, p), title = hsTitle(p);
  const cap = hsCaptions(p, 'scene1', PRE1);

  const T_REG = at('d01', 3.75), T_DOOR = at('d01', 4.45), T_FRZ = at('d01', 5.5), T_AISLE = at('d01', 7.3), T_GRID = at('d01', 8.7);
  const T_SHOWS = at('d01', 12.4), T_DANI = at('d01', 16.7), T_WAVE = at('d02') - .05, T_FACE = at('d02', 1.15), T_TITLE = at('hush1');
  const SHOTS = [[0, 'grid'], [T_REG, 1], [T_DOOR, 2], [T_FRZ, 3], [T_AISLE, 4], [T_GRID, 'push'], [T_DANI, 'dani'], [T_WAVE, 'wave'], [T_FACE, 'face'], [T_TITLE, 'title']];
  cam.cut({ x: 560, y: 470, z: 1.45 }, T_DANI).to({ x: 600, z: 1.6 }, T_DANI, 2)
    .cut({ x: 790, y: 380, z: 2.3 }, T_FACE).to({ z: 2.75, y: 370 }, T_FACE, 3.2);
  sfx('scene1', T_TITLE + .15, 'boom', 1.1);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), inRoom = shot === 'dani' || shot === 'face', ts = clockAt('04:50:52', q);
    vis(room, inRoom); vis(gridG, !inRoom && shot !== 'title'); vis(black, shot === 'title'); vis(title.g, shot === 'title');
    title.pose({ o: span(q, T_TITLE + .3, T_TITLE + 1.1) });
    // the grid: whole, a named camera filling the frame, then the slow push into camera four
    let tfm = grid.zoomTo(1, 0);
    if (typeof shot === 'number') tfm = grid.zoomTo(shot, span(q, shotStart(shot), shotStart(shot) + .15));
    else if (shot === 'grid') tfm = `translate(800,450) scale(${(1 + .04 * span(q, 0, T_REG)).toFixed(4)}) translate(-800,-450)`;
    else if (shot === 'push') tfm = grid.zoomTo(4, span(q, T_GRID + 1.6, T_DANI - .4) ** 1.4);
    else if (shot === 'wave') tfm = grid.zoomTo(4, 1);
    tf(gridG, tfm);
    grid.pose({ t: ts, hi: typeof shot === 'number' ? shot : 0 });
    R.tv.pose({ t: ts });
    // the other Dani in aisle four: not there, then there (a dropped frame), then waving
    const here = q >= T_SHOWS, wave = span(q, T_WAVE + .15, T_WAVE + .9), wag = q > T_WAVE + .9 ? 10 * Math.sin((q - T_WAVE) * 7) : 0;
    const od = { x: 330, y: hipOn(408, .4), s: .4, head: 'F', turn: 0, lua: -6, rua: 6 + (-96 + wag * .5) * wave, rfa: (-78 + wag) * wave };
    vis(grid.slot4, here && !(q > T_SHOWS && q < T_SHOWS + .09)); vis(R.tv.slot4, here);
    otherBig.pose(od, f); other4.pose(od, f);
    // Dani behind the counter: staring left at the monitor, not breathing much
    if (inRoom) {
      cam.apply(q, f);
      R.dani.pose({ x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0, lua: -4, rua: 4, look: -.85, headR: -6, brow: .85,
        nod: 2 + breath(q, 0, .6), mouth: 'A', shut: q > T_FACE + 1.6 && q < T_FACE + 1.75 }, f);
    }
    cap(q);
  });
  function shotStart(n) { return [T_REG, T_DOOR, T_FRZ, T_AISLE][n - 1]; }
}
