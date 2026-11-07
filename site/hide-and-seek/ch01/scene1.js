/* scene1.js — Leo's bedroom, night (storyboard shots 1–6): the wide room in the rain; Leo bouncing on the bed, "One more
   game! Hide and seek!"; Sam with her phone (9:58), "One game. Then bed."; Leo, suddenly serious, glances at the
   wardrobe, "Can my friend play too?"; Sam plays along, "Sure. The more the merrier."; the wardrobe door, held a beat
   too long. Times are on the beat clock (PRE1 + the joined clip's times, words from narration.en.words.txt). */
'use strict';
const PRE1 = 1.5;

function scene1(p, D, m) {
  const R = bedroom(p, { x: 450, y: 800, z: 1 }), { cam } = R;
  const at = (clip, t = 0) => clipAt('scene1', PRE1, clip, t);
  const T_SAM = at('l02') - .25, T_PHONE = at('l02', 1.0), T_LEO2 = at('l02', 2.0), T_GLANCE = at('l03') + .05,
    T_ASK = at('l03', .82), T_SAM2 = at('l04') - .2, T_WARD = at('hush1') - .3;
  const SHOTS = [[0, 'wide'], [1.4, 'leo'], [T_SAM, 'sam'], [T_PHONE, 'phone'], [T_LEO2, 'leo2'], [T_SAM2, 'sam2'], [T_WARD, 'ward']];
  cam.cut({ x: 450, y: 800, z: 1 }, 0)
    .cut({ x: 268, y: 1040, z: 2.05 }, 1.4)
    .cut({ x: 640, y: 1110, z: 2.3 }, T_SAM)
    .cut({ x: 262, y: 1010, z: 2.7 }, T_LEO2).to({ x: 268, y: 990, z: 3.0 }, T_GLANCE, 2.6)
    .cut({ x: 640, y: 1080, z: 2.6 }, T_SAM2)
    .cut({ x: 725, y: 730, z: 1.85 }, T_WARD).to({ z: 2.15 }, T_WARD + .1, 2.4);

  // the phone insert: Sam's hand and the lit screen, 9:58 PM, drawn on the screen (not in the room)
  const ins = mk('g', {}, p);
  ins.innerHTML = `<rect width="900" height="1600" fill="#05070d"/>
    <ellipse cx="540" cy="1120" rx="250" ry="200" fill="#c9a588"/><rect x="250" y="390" width="400" height="760" rx="44" fill="#0f1116"/>
    <rect x="272" y="414" width="356" height="712" rx="30" fill="#152544"/><rect x="272" y="414" width="356" height="712" rx="30" fill="#5d86c9" opacity=".18"/>
    <text x="450" y="640" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="128" font-weight="300" fill="#eef3ff">9:58</text>
    <text x="450" y="700" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="34" fill="#c3d2f0">Friday · PM</text>
    <rect x="350" y="1070" width="200" height="8" rx="4" fill="#c3d2f0" opacity=".7"/>
    ${[[170, 1010], [205, 1060], [230, 1110]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="44" rx="22" fill="#c9a588"/>`).join('')}`;
  const cap = hsCaptions(p, 'scene1', PRE1);

  sfx('scene1', 0, 'rain', .32, { loop: true });
  sfx('scene1', 0, 'hum', .16, { loop: true });
  [1.15, 2.8, 4.45, 6.1].forEach(t => sfx('scene1', t, 'springs', .42));
  sfx('scene1', T_GLANCE - .3, 'thud', .25);   // he lands and stops

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    cam.apply(q, f);
    vis(ins, shot === 'phone');
    R.rain.pose(q); R.curt.pose({ sway: .6 * Math.sin(q * 1.3) }, f); R.ward.pose({ gap: 0 }, f); R.bedF.pose({ lift: 0 });
    R.lamp.pose({ x: NIGHTSTAND.lamp[0], y: NIGHTSTAND.lamp[1], s: .9, on: 1 }, f); R.night.pose({ dark: 0 });
    vis(R.footG, false);

    // Leo bounces on the bed, arms up, until he lands and goes still (the glance)
    const stop = T_GLANCE - .3, bouncing = q < stop, ph = (Math.floor(q * 6) / 6 - 1.15) / .55;
    const hop = bouncing && q > 1.0 ? -46 * Math.abs(Math.sin(Math.PI * ph)) : 0;
    const arms = bouncing ? tween(q, .9, .3, 0, 1) : 1 - span(q, stop, stop + .4);
    const lo = { x: SPOT.leoBed[0], y: hipOn(SPOT.leoBed[1], LEO_S) + hop * LEO_S, s: LEO_S, head: 'F', turn: 0 };
    const look = q < T_GLANCE ? -.2 : q < T_ASK - .2 ? 1 : .8;
    R.leo.pose({ ...lo, rua: 6 - 141 * arms, rfa: -4 - 16 * arms, lua: -6 + 141 * arms, lfa: 4 + 16 * arms,
      look, brow: q > T_GLANCE ? .55 : 0, headR: q > T_GLANCE ? tween(q, T_GLANCE, .5, 0, 5) : 2 * Math.sin(q * 5),
      mouth: q > T_GLANCE && lips(q, 'scene1', PRE1, 'l03') === 'X' ? 'A' : lips(q, 'scene1', PRE1, 'l01', 'l03'), crouch: hop < -30 ? 0 : bouncing && q > 1 ? .12 : 0,
      shut: blinking(q, [1.3, 4.9, T_ASK + 1.4]) }, f);

    // Sam: tired, a smile for Leo; checks her phone; rolls her eyes and plays along
    const so = { x: SPOT.samFront[0], y: hipOn(SPOT.samFront[1], SAM_S.front) + breath(q, 0, 1.2), s: SAM_S.front, head: 'F', turn: 0 };
    const phoneUp = q > T_SAM - .4 && q < T_LEO2 + .2;
    const reach = frontReach(so, 'R', [so.x + 4 * so.s, so.y - 104 * so.s]);
    const rollEyes = q > T_SAM2 + .1 && q < T_SAM2 + 1.0;
    R.sam.pose({ ...so, ...(phoneUp ? { rua: reach.rua, rfa: reach.rfa, hold: 'phone' } : { rua: 8, rfa: -6 }), lua: -8, lfa: 4,
      nod: phoneUp ? 9 : 0, look: phoneUp ? .2 : rollEyes ? tween(q, T_SAM2 + .1, .8, 1, -1) : -.9,
      headR: rollEyes ? -6 * Math.sin(Math.PI * (q - T_SAM2 - .1) / .9) : q > T_SAM2 ? -3 : 0,
      tail: 3 * Math.sin(q * 1.7), mouth: lips(q, 'scene1', PRE1, 'l02', 'l04'),
      shut: blinking(q, [2.1, T_SAM + .9, T_SAM2 + 1.6]) || (rollEyes && q > T_SAM2 + .35 && q < T_SAM2 + .55) }, f);
    vis(R.sam.g, shot !== 'ward');   // the insert is the wardrobe alone
    cap(q);
  });
}
