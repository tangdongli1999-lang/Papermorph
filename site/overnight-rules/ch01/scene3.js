/* scene3.js — the list. Dani looks down under the register; the laminated list, taped there: the camera reads down it
   (neat at the top, worse at the bottom), then back up to its heading for "Rules for the overnight shift"; Dani,
   amused, holds up her phone and takes a picture (a flash); the list again, the camera settling on Rule Six as her
   smile goes: "Then I read it properly." */
'use strict';
const PRE3 = .3;

function scene3(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene3', PRE3, clip, t);
  const room = mk('g', {}, p), R = counterShot(room, { x: 800, y: 420, z: 2.1 }), { cam } = R;
  nightGrade(room, .9);
  // the list, taped to the dark underside of the counter
  const ins = mk('g', {}, p), insZ = mk('g', {}, ins);
  insZ.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#2c2621"/>${Array.from({ length: 22 }, (_, i) => `<path d="M-400,${-300 + i * 75 + (i % 3) * 9} h2400" stroke="#352e28" stroke-width="${3 + (i % 4)}"/>`).join('')}`;
  const L = theList(mk('g', { transform: 'translate(500,70)' }, insZ));
  mk('rect', { width: 1600, height: 900, fill: 'url(#ngV)' }, ins);   // the dark edge (nightGrade's gradient)
  const flash = mk('rect', { width: 1600, height: 900, fill: '#fff', opacity: 0 }, p);
  const cap = hsCaptions(p, 'scene3', PRE3);
  const T_LIST = at('d05', 3.05), T_QUOTE = at('d05', 7.4), T_PHONE = at('d05', 13.45), T_SNAP = at('d05', 15.05), T_READ = at('d05', 17.0);
  const SHOTS = [[0, 'room'], [T_LIST, 'list'], [T_PHONE, 'room'], [T_READ, 'list6']];
  cam.cut({ x: 800, y: 420, z: 2.1 }, 0).to({ y: 470, z: 2.3 }, 0, 3)
    .cut({ x: 800, y: 400, z: 1.8 }, T_PHONE).to({ z: 1.95 }, T_PHONE, 3.6);
  // the insert's camera: a point of the list (list px) at the frame's centre and a zoom
  const view = q => {
    if (q < T_QUOTE) { const u = span(q, T_LIST + .3, T_QUOTE - .4); return [300, 120 + 520 * u, 1.55]; }
    if (q < T_PHONE) { const u = span(q, T_QUOTE, T_QUOTE + .5); return [300, 640 - 600 * u, 1.55 + .35 * span(q, T_QUOTE + .5, T_PHONE)]; }
    const u = span(q, T_READ, T_READ + 4.2); return [300, 400 + 20 * u, 1.6 + .9 * u];
  };

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), inRoom = shot === 'room';
    vis(room, inRoom); vis(ins, !inRoom);
    if (inRoom) {
      cam.apply(q, f);
      const dj = { x: CTR.dani[0], y: CTR.dani[1], s: 1.9, head: 'F', turn: 0 };
      const up = span(q, T_PHONE + .2, T_PHONE + .9), ph = frontReach(dj, 'R', [dj.x + 40, dj.y - 230]);
      const looking = q < T_LIST ? span(q, .6, 1.6) : 0;
      R.dani.pose({ ...dj, lua: -4, rua: 4 + (ph.rua - 4) * up, rfa: ph.rfa * up, hold: up > .5 ? 'phone' : null, rFront: up > .5,
        nod: 14 * looking, look: q < T_LIST ? 0 : .1, brow: q < T_LIST ? .3 : 0, mouth: q > T_PHONE ? 'X' : 'A',
        shut: (q % 3.9) < .12 }, f);
      R.tv.pose({ t: clockAt('02:47:10', q) });
    } else {
      const [cx, cy, z] = view(q);
      tf(insZ, `translate(800,450) scale(${z.toFixed(3)}) translate(${-(500 + cx)},${-(70 + cy)})`);
      L.pose({ nine: 0, faint: 0 });
    }
    flash.setAttribute('opacity', (q > T_SNAP && q < T_SNAP + .35 ? .85 * (1 - (q - T_SNAP) / .35) : 0).toFixed(2));
    cap(q);
  });
}
