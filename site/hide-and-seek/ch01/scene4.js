/* scene4.js — under the bed (storyboard shots 17–20). Close and low: Leo flat under the bed, eyes huge, a finger on his
   lips; Sam's hand comes in and Leo grabs her wrist, "Shh. Don't find the other one."; close on Sam, the smile going,
   "…What other one?"; close on Leo, "The one who was counting with you." — and his eyes slide past her. */
'use strict';
const PRE4 = .2;
// The floor's near edge under the bed, over Leo's body, so only his head and arms show (world px of the 'under' set).
const FLOORBOARD = `<g filter="url(#paperBig)"><rect x="-300" y="960" width="1500" height="900" fill="#1a1310"/><rect x="-300" y="952" width="1500" height="14" fill="#4a3426"/>
  ${[1040, 1150, 1290, 1460].map(y => `<path d="M-300,${y} h1500" stroke="#120d0b" stroke-width="5"/>`).join('')}</g>`;
// The view out from under the bed: the lifted cover's dark hem above, the floor's edge below, the room between.
const PEEK = `<rect x="-50" y="-50" width="1000" height="430" fill="#05060a"/><path d="M-50,380 Q450,420 950,380 L950,430 Q450,470 -50,430 Z" fill="#1f2f52"/>
  <rect x="-50" y="1240" width="1000" height="420" fill="#0c0908"/><rect x="-50" y="1236" width="1000" height="10" fill="#3a2a20"/>`;

function scene4(p, D, m) {
  const und = paperCam(p, 'under', { x: 450, y: 760, z: 1 });
  const leo = leoPuppet(und.stage), arm = samArm(und.stage), board = prop(und.stage, FLOORBOARD), glow = nightLight(und.stage, [470, 760]);
  und.stage.insertBefore(arm.g, leo.g);   // her arm comes in behind his hand
  const rev = paperCam(p, 'reverse', { x: 450, y: 760, z: 1.55 }), samR = samPuppet(rev.stage), revN = nightLight(rev.stage, [450, 2100]);
  rev.soft(0, true);
  const peek = mk('g', { 'pointer-events': 'none' }, rev.root); peek.innerHTML = PEEK;

  const at = (clip, t = 0) => clipAt('scene4', PRE4, clip, t);
  const T_GRAB = at('l07', 1.3), T_SAM = at('l08') - .2, T_LEO = at('l09') + .1, T_PAST = at('l09', 1.65);
  const SHOTS = [[0, 'leo'], [T_GRAB, 'grab'], [T_SAM, 'sam'], [T_LEO, 'leo']];
  und.cut({ x: 450, y: 770, z: 1.05 }, 0).to({ z: 1.12 }, .1, 1.4)
    .cut({ x: 530, y: 820, z: .78 }, T_GRAB)
    .cut({ x: 450, y: 760, z: 1.18 }, T_LEO).to({ z: 1.32 }, T_LEO + .2, 3);
  rev.cut({ x: 450, y: 720, z: 1.55 }, 0).to({ z: 1.7 }, T_SAM, 2.4);
  const cap = hsCaptions(p, 'scene4', PRE4);
  sfx('scene4', T_GRAB + .3, 'thud', .18);

  // where Sam's wrist is (world px of 'under'): in from the top right, down to Leo's reach
  const wrist = q => { const u = span(q, T_GRAB, T_GRAB + .3); return [900 - 240 * u, 420 + 470 * u]; };
  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), under = shot !== 'sam';
    vis(und.root, under); vis(rev.root, !under);
    if (under) und.apply(q, f); else rev.apply(q, f);
    glow.pose({ dark: 0 }); revN.pose({ dark: 0 });

    // Leo flat on the floor, head and arms over the boards' edge
    const lo = { x: 450, y: 1466, s: 3.6, head: 'F', turn: 0 };
    const mouth = [lo.x, lo.y - 167 * lo.s], lipsF = frontReach(lo, 'L', [mouth[0] + 4, mouth[1] + 6]);
    const [wx, wy] = wrist(q), grab = q > T_GRAB + .3, gripR = frontReach(lo, 'R', [wx - 6, wy + 10]);
    const shh = q < T_SAM;   // the finger stays on his lips through the whisper
    leo.pose({ ...lo, lua: shh ? lipsF.lua : -6, lfa: shh ? lipsF.lfa : 4, lFront: shh,
      ...(grab ? { rua: gripR.rua, rfa: gripR.rfa } : { rua: 4, rfa: -2 }),
      brow: .7, look: q > T_PAST ? tween(q, T_PAST, .5, 0, .9) : q > T_GRAB && q < T_GRAB + .4 ? .7 : 0, nod: breath(q, 0, 2),
      mouth: lips(q, 'scene4', PRE4, 'l07', 'l09'), shut: blinking(q, [.9, T_LEO + .6]) }, f);
    arm.pose({ x: wx, y: wy, s: 1.5, r: 38 }, f); vis(arm.g, q > T_GRAB - .05);

    // Sam, seen from under the bed: the grin fades into worry on "What other one?"
    const so = { x: 450, y: 1500, s: 3.8, head: 'F', turn: 0 }, worry = span(q, T_SAM + .2, T_SAM + 1.2);
    samR.pose({ ...so, rua: 10, rfa: -8, lua: -10, lfa: 6, brow: .8 * worry, look: -.15, nod: 6, headR: -3 * worry,
      mouth: lips(q, 'scene4', PRE4, 'l08'), shut: blinking(q, [T_SAM + 1.6]), tail: 2 * Math.sin(q * 1.6) }, f);
    cap(q);
  });
}
