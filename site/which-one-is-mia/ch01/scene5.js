/* scene5.js — which one (shots 17–18), no voice. The phone's light dies: black; three slow knocks; the title in the
   dark, WHICH ONE IS MIA?, with a low hit. The knocks match scene 2's, so the end loops into the start. */
'use strict';
const SCENE5_DUR = 4.6;
const PHONE_DIES5 = .35;   // when the phone's light goes out (scene clock): the room's tone goes with it

function scene5(p, D, m) {
  const R = dormRoom(p, { x: 560, y: 980, z: 1.12 }), { cam } = R;
  const black = mk('rect', { width: 900, height: 1600, fill: '#000' }, p), title = hsTitle(p, 450, 780, undefined, 60);
  const T_TITLE = 2.3;
  [.95, 1.5, 2.05].forEach(t => sfx('scene5', t, 'knock', 1.3));
  sfx('scene5', T_TITLE, 'boom', 1.2);
  const wrap = mk('g', {}, R.floorSlot), jessW = jessPuppet(wrap);

  stopClock(D, (q, f) => {
    cam.apply(q, f);
    vis(R.jess.g, false);
    const jo = { x: LOCK[0] + 60, y: hipOn(DOOR.y + 8, .9), s: .9, head: 'F', turn: 0 };
    jessW.pose({ ...jo, lua: -20, lfa: 10, ...frontReach(jo, 'R', [jo.x + 10, jo.y - 90]), hold: 'phone', brow: .9, look: .9, mouth: 'A' }, f);
    R.mia.pose({ x: SPOT.miaInBed[0], y: -40, s: 1.15, head: 'F', turn: 0, look: -.2 }, f);
    R.miaBed.pose({ lump: 1 }); R.jessBed.pose({ lump: 0 });
    R.door.pose({ lock: .32, feet: 1, light: 1, shift: 26 }, f);
    R.light(760, 960, 1);
    vis(black, q >= PHONE_DIES5); vis(title.g, q >= T_TITLE);
    title.pose({ o: span(q, T_TITLE, T_TITLE + .5) });
  });
}
