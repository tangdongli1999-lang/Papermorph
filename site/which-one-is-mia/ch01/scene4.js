/* scene4.js — the bed (shots 12–16). Wide, the dark room behind Jess at the door: "Don't." (the bed Mia, calm, very
   close; red caption); Jess freezes and slowly turns, her phone's light swinging across the room; Mia's bed: the duvet
   moves and she sits up, "It's me, Jess. I've been here the whole time." (red); the door shakes: "JESS!"; wide, Jess
   between the door and the bed, held. */
'use strict';
const PRE4 = .2;

function scene4(p, D, m) {
  const R = dormRoom(p, { x: 520, y: 980, z: 1.05 }), { cam } = R;
  const at = (clip, t = 0) => clipAt('scene4', PRE4, clip, t);
  const T_TURN = at('m7') - .05, T_BED = at('m7', 1.55), T_SHAKE = at('m8') - .05, T_WIDE = at('hush4') - .05;
  const SHOTS = [[0, 'wide'], [T_TURN, 'turn'], [T_BED, 'bed'], [T_SHAKE, 'door'], [T_WIDE, 'held']];
  cam.cut({ x: 560, y: 960, z: 1.05 }, 0)
    .cut({ x: LOCK[0] + 60, y: 820, z: 2.7 }, T_TURN)
    .cut({ x: 760, y: 1000, z: 2.4 }, T_BED).to({ x: 770, y: 985, z: 3.1 }, T_BED, 3.2)
    .cut({ x: 450, y: 900, z: 1.8 }, T_SHAKE)
    .cut({ x: 560, y: 980, z: 1.05 }, T_WIDE).to({ z: 1.12 }, T_WIDE, 2.4);
  const cap = hsCaptions(p, 'scene4', PRE4, { red: ['m6', 'm7'] });
  sfx('scene4', T_BED - .1, 'creak', .5);
  const wrap = mk('g', {}, R.floorSlot), jessW = jessPuppet(wrap);
  const J = [LOCK[0] + 60, DOOR.y + 8], s = .9;
  // the turn: from her back to her front, a card flipped over in four frames on twos
  const T_FLIP = T_TURN + .9;

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    cam.apply(q, f);
    vis(R.jess.g, false); R.jessBed.pose({ lump: 0 });
    const flip = q < T_FLIP ? 0 : Math.min(1, Math.floor((q - T_FLIP) * 6) / 2), back = flip < .5;
    const sx = Math.max(.15, Math.abs(1 - 2 * flip));
    tf(wrap, `translate(${J[0]},0) scale(${sx.toFixed(2)},1) translate(${-J[0]},0)`);
    const jo = { x: J[0], y: hipOn(J[1], s), s, head: 'F', turn: 0, back };
    const hand = frontReach(jo, 'L', [LOCK[0] + 2, LOCK[1] + 8]);
    const freeze = span(q, at('m6') + .1, at('m6') + .6);
    jessW.pose({ ...jo, ...(back ? { lua: hand.lua * (1 - freeze * .3), lfa: hand.lfa } : { lua: -20, lfa: 10 }),
      ...(back ? { rua: 10, rfa: -10 } : frontReach(jo, 'R', [jo.x + 10, jo.y - 100 * s])), hold: 'phone',
      brow: back ? 0 : .9, look: back ? 0 : .9, headR: back ? 0 : 5, mouth: 'A', shut: false }, f);
    // the phone's light: low at her side, then raised and swung across the room at the bed
    if (back) R.light(jo.x + 30 * s, jo.y - 30 * s, .75);
    else R.light(tween(q, T_FLIP + .3, .9, jo.x + 10, 760), tween(q, T_FLIP + .3, .9, jo.y - 100 * s, 960), 1);
    // Mia: under the duvet until the turn, then she sits up into the light (her eyes catch it)
    const rise = span(q, T_BED + .1, T_BED + 1.3);
    R.mia.pose({ x: SPOT.miaInBed[0], y: MIA_HID - 132 * rise, s: 1.15, head: 'F', turn: 0, look: rise > .9 ? -.2 : 0,
      shut: rise < .7, mouth: lips(q, 'scene4', PRE4, 'm7'), brow: 0 }, f);
    R.miaBed.pose({ lump: .16 + .84 * rise });
    R.door.pose({ lock: .32, feet: 1, light: 1, shift: 26 + (q > T_SHAKE ? 10 * Math.sin(q * 9) : 0), shake: q > T_SHAKE && q < T_SHAKE + 1.4 ? 7 : 0 }, f);
    if (q > T_SHAKE && q < T_SHAKE + 1.4) cam.shake?.(0, 0);
    cap(q);
  });
}
