/* scene2.js — the knock (shots 5–8). The door, the hall light under it and the shadows of two feet: three knocks;
   Jess frozen in bed: "Jess! It's me, I forgot my key. Let me in?" (Mia, through the door); close on Jess: "You just
   called me."; the door, the shadow under it shifting: "What? My phone died hours ago. Jess… something's out here." */
'use strict';
const PRE2 = .2;

function scene2(p, D, m) {
  const R = dormRoom(p, { x: 450, y: 840, z: 1.5 }), { cam } = R;
  const at = (clip, t = 0) => clipAt('scene2', PRE2, clip, t);
  const T_FROZEN = at('m3', 1.25), T_CLOSE = at('j2') - .05, T_DOOR2 = at('m4') - .05, T_SHIFT = at('m4', 3.6);
  const SHOTS = [[0, 'door'], [T_FROZEN, 'jess'], [T_CLOSE, 'close'], [T_DOOR2, 'door2']];
  cam.cut({ x: 450, y: 900, z: 1.75 }, 0).to({ z: 1.9 }, 0, 1.4)
    .cut({ x: 230, y: 1290, z: 1.6 }, T_FROZEN).to({ z: 1.75 }, T_FROZEN, 3.8)
    .cut({ x: 140, y: 1320, z: 3.3 }, T_CLOSE)
    .cut({ x: 450, y: 990, z: 2.1 }, T_DOOR2).to({ y: 1010, z: 2.5 }, T_DOOR2, 5);
  const cap = hsCaptions(p, 'scene2', PRE2);
  [.25, .55, .85].forEach(t => sfx('scene2', t, 'knock', 1.6));

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    cam.apply(q, f);
    // the feet under the door shuffle when the voice turns scared
    R.door.pose({ lock: 0, feet: 1, light: 1, shift: tween(q, T_SHIFT, .5, 0, 26) }, f);
    R.mia.pose({ x: SPOT.miaInBed[0], y: MIA_HID, s: 1.15, head: 'F', turn: 0, shut: true }, f);
    R.miaBed.pose({ lump: .16 + .02 * Math.sin(q * 1.7) });
    const jo = { x: SPOT.jessInBed[0], y: SPOT.jessInBed[1], s: .9, head: 'F', turn: 0 };
    const low = frontReach(jo, 'R', [jo.x + 14, jo.y - 60 * jo.s]);   // the phone lowered to her chest
    R.jess.pose({ ...jo, rua: low.rua, rfa: low.rfa, hold: 'phone', lua: -10, lfa: 6, nod: 2, brow: .8,
      look: shot === 'close' ? .2 : .55, headR: shot === 'close' ? 0 : 4, mouth: worried(lips(q, 'scene2', PRE2, 'j2')),
      shut: q > T_FROZEN + 2.6 && q < T_FROZEN + 2.77 }, f);
    R.jessBed.pose({ lump: 0 });
    R.light(...inBed(JESS_BED, [jo.x + 14 * jo.s, jo.y - 60 * jo.s]), .9);
    cap(q);
  });
}
