/* scene1.js — the voicemail (shots 1–4). The phone buzzing in the dark: Mia's voicemail, "Jess. It's Mia. Don't open
   the door."; Jess in bed, lit blue by the phone, "…Mia?"; the voicemail again, "Whatever sounds like me tonight… it
   isn't me."; an insert of Mia's bed across the room, dark, rumpled, held one beat too long (it isn't empty). */
'use strict';
const PRE1 = .2;

function scene1(p, D, m) {
  const R = dormRoom(p, { x: 450, y: 800, z: 1 }), { cam } = R;
  const vm = voicemailScreen(p);
  const at = (clip, t = 0) => clipAt('scene1', PRE1, clip, t);
  const T_JESS = at('j1') - .1, T_VM2 = at('m2') - .1, T_BED = at('hush1') - .05;
  const SHOTS = [[0, 'vm'], [T_JESS, 'jess'], [T_VM2, 'vm'], [T_BED, 'bed']];
  cam.cut({ x: 170, y: 1330, z: 2.5 }, T_JESS).to({ z: 2.7 }, T_JESS, 1.6)
    .cut({ x: 750, y: 1040, z: 2.5 }, T_BED).to({ z: 2.75 }, T_BED, 2.2);
  const cap = hsCaptions(p, 'scene1', PRE1);
  sfx('scene1', 0, 'buzz', 1.0);
  // the voicemail's progress bar: it plays from the first word to the end of the second line
  const vmA = at('m1'), vmB = at('m2', TIMINGS.m2.dur);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), room = shot !== 'vm';
    vis(cam.root, room); vis(vm.g, !room);
    if (room) cam.apply(q, f);
    vm.pose({ q, progress: span(q, vmA, vmB) * .999, buzz: q < .9 ? 1 : 0 }, f);
    R.door.pose({ lock: 0, feet: 0, light: .55 }, f);
    // Mia's bed: a shape under the duvet that breathes (the setup; nobody looks at it yet)
    R.mia.pose({ x: SPOT.miaInBed[0], y: MIA_HID, s: 1.15, head: 'F', turn: 0, shut: true }, f);
    R.miaBed.pose({ lump: .16 + .02 * Math.sin(q * 1.7) });
    // Jess: woken, sitting up against the wall, the phone at her face
    const jo = { x: SPOT.jessInBed[0], y: SPOT.jessInBed[1], s: .9, head: 'F', turn: 0 };
    const ph = frontReach(jo, 'R', [jo.x + 6, jo.y - 112 * jo.s]);
    R.jess.pose({ ...jo, rua: ph.rua, rfa: ph.rfa, hold: 'phone', lua: -10, lfa: 6, nod: 9 + breath(q, 0, 1), brow: .55, look: .1,
      mouth: worried(lips(q, 'scene1', PRE1, 'j1')), shut: q > T_JESS + 1.1 && q < T_JESS + 1.27 }, f);
    R.jessBed.pose({ lump: 0 });
    R.light(...inBed(JESS_BED, [jo.x + 6 * jo.s, jo.y - 112 * jo.s]), 1);
    cap(q);
  });
}
