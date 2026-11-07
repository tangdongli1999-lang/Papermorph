/* scene3.js — the lock (shots 9–11). Jess gets out of bed and crosses to the door; close on her hand at the lock,
   the door crying "Please, Jess. It's really me."; her fingers start to turn it: click. Jess at the door is seen from
   behind (she faces the door), her phone in her right hand, her left on the thumb-turn. */
'use strict';
const PRE3 = .2;
// the lock's thumb-turn (world px)
const LOCK = [DOOR.x + DOOR.w / 2 - 49, DOOR.y - DOOR.h * .58];

function scene3(p, D, m) {
  const R = dormRoom(p, { x: 400, y: 1050, z: 1.15 }), { cam } = R;
  const at = (clip, t = 0) => clipAt('scene3', PRE3, clip, t);
  const T_LOCK = at('m5', 1.8), T_TURN = at('hush3') - .05, T_CLICK = T_TURN + .35;
  const SHOTS = [[0, 'cross'], [T_LOCK, 'lock'], [T_TURN, 'turn']];
  cam.cut({ x: 400, y: 1080, z: 1.1 }, 0).to({ x: 470, y: 1000, z: 1.3 }, 0, 2.1)
    .cut({ x: LOCK[0] - 10, y: LOCK[1] + 30, z: 3.2 }, T_LOCK).to({ z: 3.6 }, T_LOCK, 3.6)
    .cut({ x: LOCK[0], y: LOCK[1] + 6, z: 5.2 }, T_TURN);
  const cap = hsCaptions(p, 'scene3', PRE3);
  [.15, .55, .95, 1.35].forEach((t, i) => sfx('scene3', t, 'step1', .35 - i * .03));
  sfx('scene3', T_CLICK, 'latch', 1.3);
  const wrap = mk('g', {}, R.floorSlot), jessW = jessPuppet(wrap);
  // she walks from her bed (bottom left, near) to the door (back), getting smaller with the distance
  const A = SPOT.jessFloor, B = [LOCK[0] + 60, DOOR.y + 8];

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    cam.apply(q, f);
    vis(R.jess.g, false);
    R.mia.pose({ x: SPOT.miaInBed[0], y: MIA_HID, s: 1.15, head: 'F', turn: 0, shut: true }, f);
    R.miaBed.pose({ lump: .16 + .02 * Math.sin(q * 1.7) });
    R.jessBed.pose({ lump: 0 });
    const u = span(q, .05, 1.85), x = A[0] + (B[0] - A[0]) * u, gy = A[1] + (B[1] - A[1]) * u, s = 1.25 + (.9 - 1.25) * u;
    const step = Math.sin(Math.floor(q * 6) / 6 * Math.PI * 2.5) * (u > 0 && u < 1 ? 1 : 0);
    const jo = { x, y: hipOn(gy, s) - 6 * Math.abs(step) * s, s, head: 'F', turn: 0, back: true };
    const hand = frontReach(jo, 'L', [LOCK[0] + 2, LOCK[1] + 8]);
    const reach = span(q, 1.7, 2.3), turn = span(q, T_TURN + .1, T_TURN + .5);
    jessW.pose({ ...jo, lua: -8 + (hand.lua + 8) * reach, lfa: 4 + (hand.lfa - 4) * reach, rua: 10, rfa: -10, hold: 'phone',
      nod: 3 + 4 * reach, tail: 0, near: 20 * step, far: -20 * step, kNear: 14 * Math.max(0, -step), kFar: 14 * Math.max(0, step) }, f);
    // the phone's light from her right hand, low at her side
    R.light(jo.x + 30 * s, jo.y - 30 * s, .75);
    R.door.pose({ lock: .32 * turn, feet: 1, light: 1, shift: 26 + 3 * Math.sin(q * 3) }, f);
    cap(q);
  });
}
