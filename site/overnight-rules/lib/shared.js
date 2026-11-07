/* shared.js — what every scene of the book uses: timing helpers and painted props. Put the book's
   recurring places and props here too (a classroom or a street built the same way whenever it appears, so the staging
   matches across cuts): a function like `function room(p) { const cam = paperCam(p, 'room'); … return { cam, … }; }`. */
'use strict';
// Beat-clock time of `t` seconds into clip `clip` of a joined scene whose speech starts `pre` s in (join.py's `parts`).
const clipAt = (scene, pre, clip, t = 0) => pre + TIMINGS[scene].parts[clip] + t;
// Beat-clock time of the n-th caption cue (one per sentence) of a joined scene: for cutting on sentences.
const cueAt = (scene, pre, n) => pre + TIMINGS[scene].cues[n][0];
const onTwos = q => Math.floor(q * FPS / 2) % 2 ? 1 : -1;
const between = (q, a, b) => q >= a && q < b;
const tween = (q, t0, d, a, b) => a + (b - a) * span(q, t0, t0 + d);
// Who is speaking: the mouth for this frame from the listed clips of a joined scene, or 'X' (rest).
const lips = (q, scene, pre, ...clips) => { for (const c of clips) { const m = mouthAt(c, q - clipAt(scene, pre, c)); if (m !== 'X') return m; } return 'X'; };
// Chewing on twos: the mouth alternates between two shapes.
const chew = q => onTwos(q) > 0 ? 'chew' : 'A';

/* ---------- painted props (img/props/<name>.webp, from painted.py) ---------- */
// A picture at (x, y), w by h, to hold in a puppet's hand (holds: { key: svg }) or drop into prop().
const artSVG = (name, x, y, w, h) => `<image href="../img/props/${name}.webp" x="${x}" y="${y}" width="${w}" height="${h}"/>`;

/* ---------- The Overnight Rules: places and helpers ---------- */
const shotAt = (q, shots) => { let s = shots[0][1]; for (const [t0, n] of shots) if (q >= t0) s = n; return s; };
const breath = (q, ph = 0, a = 1.2) => a * Math.sin((q + ph) * 2.4);
const worried = m => m === 'X' ? 'A' : m;   // lips shut between lines, not the rest shape's smile
// The night: a cold green-blue wash and a darker edge over a set (the painted store is lit like day); k 0…1.
function nightGrade(p, k = 1) {
  const g = mk('g', { 'pointer-events': 'none' }, p);
  g.innerHTML = `<defs><radialGradient id="ngV" cx="50%" cy="48%" r="70%"><stop offset=".55" stop-color="#05080a" stop-opacity="0"/><stop offset="1" stop-color="#05080a" stop-opacity=".7"/></radialGradient></defs>
    <rect x="-200" y="-200" width="2000" height="1300" fill="#0b1d22" opacity="${(.3 * k).toFixed(2)}"/><rect width="1600" height="900" fill="url(#ngV)" opacity="${k}"/>`;
  return g;
}
// The counter close-up (counter set): Dani behind it between the monitor and the register; the monitor's screen
// shows the cameras (a cctv() scaled onto it). World px of the painted picture (1600 x 900).
const CTR = { top: 675, screen: [188, 507, 200, 125], phone: [1193, 368], dani: [800, 700] };
function counterShot(p, v0 = {}) {
  const cam = paperCam(p, 'counter', v0);
  const scr = mk('g', { transform: `translate(${CTR.screen[0]},${CTR.screen[1]}) scale(${CTR.screen[2] / 1600},${CTR.screen[3] / 900})` }, cam.layer('bg'));
  const tv = cctv(scr);
  const dani = daniPuppet(cam.stage);
  return { cam, tv, dani };
}
// The checkout view (checkout set): the fridges, the bare wall, the counter. Puppets behind the counter in cam.stage,
// in front of it (customers) in cam.stageAt.counter.
const CHK = { counterTop: 488, floorBack: 627, wall: [813, 993], behind: [1150, 640], front: [1080, 760] };
function checkout(p, v0 = {}) {
  const cam = paperCam(p, 'checkout', v0, { stages: ['counter'] });
  return { cam, front: cam.stageAt.counter };
}
function entrance(p, v0 = {}, dawn = false) { return { cam: paperCam(p, dawn ? 'dawn' : 'entrance', v0) }; }
