/* scene2.js — three weeks earlier. Early morning, the store's front: Dani walks in, Mr. Okafor hires her (a handshake
   on "four minutes"); a two-shot as he tells her about the list; Dani: "What happened to Marcus?"; Okafor looks away:
   "He stopped coming in." */
'use strict';
const PRE2 = .3;

function scene2(p, D, m) {
  const at = (clip, t = 0) => clipAt('scene2', PRE2, clip, t);
  const { cam } = entrance(p, { x: 800, y: 450, z: 1 }, true);
  const dani = daniPuppet(cam.stage), ok = okaforPuppet(cam.stage);
  const card = mk('text', { x: 800, y: 120, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 46, 'letter-spacing': 8, fill: '#f6efe2',
    stroke: '#1d1a17', 'stroke-width': 6, 'paint-order': 'stroke' }, p);
  card.textContent = 'THREE WEEKS EARLIER';
  const cap = hsCaptions(p, 'scene2', PRE2);
  const T_TWO = at('o01') - .1, T_DANI = at('d04') - .05, T_OK = at('o02') - .05, T_SHAKE = at('d03', 7.1);
  cam.cut({ x: 800, y: 450, z: 1 }, 0).to({ x: 820, y: 470, z: 1.12 }, 1, 8)
    .cut({ x: 830, y: 500, z: 1.6 }, T_TWO).to({ z: 1.72 }, T_TWO, 8)
    .cut({ x: 690, y: 430, z: 2.5 }, T_DANI)
    .cut({ x: 965, y: 420, z: 2.5 }, T_OK).to({ z: 2.75 }, T_OK, 3.5);
  sfx('scene2', .6, 'chime', .8);

  stopClock(D, (q, f) => {
    cam.apply(q, f);
    card.setAttribute('opacity', (span(q, .2, .8) * (1 - span(q, 2.6, 3.3))).toFixed(2));
    // Dani comes in from the doors to the middle of the floor, growing with the nearness; then stands
    const u = span(q, .5, 5.4), gy = 610 + (800 - 610) * u, s = .55 + (.95 - .55) * u, x = 560 + (700 - 560) * u;
    const bob = u > 0 && u < 1 ? 5 * Math.abs(Math.sin(q * 7.5)) : 0;
    const dj = { x, y: hipOn(gy, s) - bob * s, s, head: 'F', turn: 0 };
    const oj = { x: 975, y: hipOn(800, 1.0), s: 1.0, head: 'F', turn: 0 };
    // the handshake, between them
    const sh = span(q, T_SHAKE - .3, T_SHAKE + .2) * (1 - span(q, T_SHAKE + 1.4, T_SHAKE + 1.9)), pump = 4 * Math.sin(q * 14) * sh;
    const mid = [(oj.x + 700) / 2, oj.y - 30 + pump], dr = frontReach(dj, 'R', mid), ol = frontReach(oj, 'L', mid);
    dani.pose({ ...dj, rua: 6 + (dr.rua - 6) * sh, rfa: dr.rfa * sh, lua: -6, look: .7, brow: q > T_DANI ? .5 : .2,
      mouth: lips(q, 'scene2', PRE2, 'd04'), shut: (q % 4.3) < .12 }, f);
    const gest = q > T_TWO && q < T_DANI ? Math.max(0, Math.sin((q - T_TWO) * 1.6)) : 0;
    const away = span(q, T_OK, T_OK + .5) * (1 - span(q, T_OK + 2.4, T_OK + 2.9));
    ok.pose({ ...oj, lua: -6 + (ol.lua + 6) * sh - 40 * gest, lfa: ol.lfa * sh - 50 * gest, rua: 6, look: -.7 + .9 * away, headR: 4 * away,
      brow: away * .4, mouth: lips(q, 'scene2', PRE2, 'o01', 'o02'), shut: ((q + 1.7) % 5.1) < .12 }, f);
    cap(q);
  });
}
