/* shared.js — what every scene of Hide and Seek uses: timing helpers and the bedroom, built the same way in every
   scene so the staging matches across cuts. */
'use strict';
// Beat-clock time of `t` seconds into clip `clip` of a joined scene whose speech starts `pre` s in (join.py's `parts`).
const clipAt = (scene, pre, clip, t = 0) => pre + TIMINGS[scene].parts[clip] + t;
const onTwos = q => Math.floor(q * FPS / 2) % 2 ? 1 : -1;
const between = (q, a, b) => q >= a && q < b;
const tween = (q, t0, d, a, b) => a + (b - a) * span(q, t0, t0 + d);
// Who is speaking: the mouth for this frame from the listed clips of a joined scene, or 'X' (rest).
const lips = (q, scene, pre, ...clips) => { for (const c of clips) { const m = mouthAt(c, q - clipAt(scene, pre, c)); if (m !== 'X') return m; } return 'X'; };
// Which shot is on: shots = [[t0, name], …] in order; the last one whose t0 has passed.
const shotAt = (q, shots) => { let s = shots[0][1]; for (const [t0, n] of shots) if (q >= t0) s = n; return s; };
// A gentle breath for a figure standing still: a slow nod of a unit or two.
const breath = (q, ph = 0, a = 1.2) => a * Math.sin((q + ph) * 2.4);

// Where people stand in the room (world px of the 'room' set; feet y)
const SPOT = {
  // Leo hopping down lands on the rug in front of the bed's foot, clear of the nightstand
  samWall: [480, 1086], samFront: [640, 1446], samCurtain: [478, 1100], samBed: [330, 1540],
  leoBed: [262, 1230], leoFloor: [452, 1530], foot: [236, 1428],
};
const SAM_S = { wall: 1.02, front: 1.22, bed: 1.18 }, LEO_S = .8;

/* The bedroom, everything in its place: the set on a paper camera, the rain window and curtain on the wall's plane,
   then back to front on the puppets' plane: the wardrobe, the bed's back, the slot Leo hides in (leoW, a wrapper the
   scene may rotate to lay him down), the bed's cover, the nightstand and lamp, Sam, and the night over all of it. */
function bedroom(p, v0 = {}) {
  const cam = paperCam(p, 'room', v0, { stages: ['wall'] });
  const rain = rainGlass(cam.stageAt.wall), curt = curtain(cam.stageAt.wall);
  const ward = wardrobe(cam.stage), bedB = bedBack(cam.stage);
  const leoBack = mk('g', {}, cam.stage), leoW = mk('g', {}, leoBack), leo = leoPuppet(leoW);
  const footG = mk('g', {}, cam.stage), foot = dinoFoot(footG);
  const bedF = bedFront(cam.stage), stand = nightstand(cam.stage), lamp = moonLamp(cam.stage);
  const leoFront = mk('g', {}, cam.stage);   // a slot in front of the bed and nightstand, for Leo out on the floor
  const sam = samPuppet(cam.stage);
  const night = nightLight(cam.stage);
  return { cam, rain, curt, ward, bedB, leoBack, leoW, leo, leoFront, footG, foot, bedF, stand, lamp, sam, night };
}
// Put a puppet's group in a slot (a layer of the room) if it is not there already: draw order follows the action.
const slotIn = (g, slot) => { if (g.parentNode !== slot) slot.appendChild(g); };
// Leo lying flat under the bed, as scene 2 leaves him (head to screen left, in the dark behind the cover).
const LEO_UNDER = { dx: -250, dy: -168, rot: -88 };
function leoUnderBed(R, q, f) {
  const [x1, y1] = SPOT.leoFloor;
  slotIn(R.leoW, R.leoBack);
  R.leo.pose({ x: x1, y: hipOn(y1, LEO_S), s: LEO_S, head: 'F', turn: 0, rua: -150, lua: 150, look: -1, shut: blinking(q, [1.7, 5.2]) }, f);
  tf(R.leoW, `translate(${LEO_UNDER.dx},${LEO_UNDER.dy}) rotate(${LEO_UNDER.rot},${x1},${y1})`);
  vis(R.leo.g, true);
}
