/* scene5.js — the wardrobe (storyboard shots 21–27). Sam freezes and, very slowly, looks over her shoulder; her point
   of view, the wardrobe, a slow push in; a pale hand curls round the edge of the door; the door opens a crack: one red
   eye; extreme close on the crack, the Other: "…ten. Ready or not." (its caption red); the moon lamp snaps off; black;
   the title in the dark. */
'use strict';
const PRE5 = .2;

function scene5(p, D, m) {
  const R = bedroom(p, { x: 725, y: 700, z: 1.3 }), { cam } = R;
  const hand = otherHand(R.ward.slotHand), eye = otherEye(R.ward.slotEye);
  const rev = paperCam(p, 'reverse', { x: 450, y: 720, z: 1.7 }), samR = samPuppet(rev.stage), revN = nightLight(rev.stage, [450, 2100]);
  rev.soft(0, true);
  const peek = mk('g', { 'pointer-events': 'none' }, rev.root); peek.innerHTML = PEEK;
  const black = mk('rect', { width: 900, height: 1600, fill: '#000' }, p), title = hsTitle(p);

  const at = (clip, t = 0) => clipAt('scene5', PRE5, clip, t);
  const T_POV = 2.5, T_HAND = 5.0, T_EYE = 6.5, T_SPEAK = at('o5', 7.5) - .25, T_LAMP = at('hush5') + .05, T_OFF = T_LAMP + .45, T_TITLE = T_OFF + .6;
  const SHOTS = [[0, 'sam'], [T_POV, 'pov'], [T_HAND, 'hand'], [T_EYE, 'eye'], [T_SPEAK, 'xcu'], [T_LAMP, 'lamp'], [T_OFF, 'black']];
  const SEAM = [WARD.x, WARD.y];
  cam.cut({ x: 725, y: 690, z: 1.25 }, T_POV).to({ z: 1.95 }, T_POV, 2.5)
    .cut({ x: SEAM[0] - 30, y: 720, z: 3.1 }, T_HAND).to({ z: 3.3 }, T_HAND, 1.5)
    .cut({ x: SEAM[0] - 30, y: 650, z: 3.0 }, T_EYE).to({ z: 3.4 }, T_EYE, 1.2)
    .cut({ x: SEAM[0] - 25, y: 630, z: 7.2 }, T_SPEAK).to({ z: 8.2 }, T_SPEAK, 3)
    .cut({ x: NIGHTSTAND.lamp[0] + 10, y: NIGHTSTAND.lamp[1] - 80, z: 3.2 }, T_LAMP);
  rev.cut({ x: 450, y: 720, z: 1.7 }, 0).to({ z: 1.9 }, 0, 2.5);
  const cap = hsCaptions(p, 'scene5', PRE5, { red: ['o5'] });
  sfx('scene5', 0, 'rain', .1, { loop: true, to: T_OFF });
  sfx('scene5', 1.1, 'drip', .5);
  sfx('scene5', T_POV + .1, 'rumble', .7);
  sfx('scene5', T_HAND + .05, 'creak', .7);
  sfx('scene5', T_EYE + .02, 'creak', .4);
  sfx('scene5', T_OFF - .02, 'click', .9);
  sfx('scene5', T_TITLE, 'boom', .9);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), room = ['pov', 'hand', 'eye', 'xcu', 'lamp'].includes(shot);
    vis(cam.root, room); vis(rev.root, shot === 'sam'); vis(black, shot === 'black'); vis(title.g, shot === 'black');
    if (room) cam.apply(q, f); else if (shot === 'sam') rev.apply(q, f);
    R.rain.pose(q); R.curt.pose({ pull: .55 }, f); R.bedF.pose({ lift: .92 }); vis(R.footG, false); vis(R.sam.g, false);
    leoUnderBed(R, q, f);
    const off = q >= T_OFF;
    R.lamp.pose({ x: NIGHTSTAND.lamp[0], y: NIGHTSTAND.lamp[1], s: .9, on: off ? 0 : 1 }, f); R.night.pose({ dark: off ? 1 : 0 }); revN.pose({ dark: 0 });

    // the door, the hand, the eye (the wardrobe's own coordinates: the seam at x 0, the floor at y 0)
    const gap = q < T_HAND ? 0 : q < T_EYE ? tween(q, T_HAND + .05, .35, 0, 16) : tween(q, T_EYE, .45, 16, 50);
    R.ward.pose({ gap }, f);
    hand.pose({ x: -gap, y: -380, s: 1, out: span(q, T_HAND + .25, T_HAND + .85), curl: span(q, T_HAND + .8, T_HAND + 1.4),
      tap: q > T_SPEAK + 1 ? .5 + .5 * Math.sin(q * 3) : 0 }, f);
    vis(hand.g, q > T_HAND + .2);
    const blink = q > T_SPEAK + 1.45 && q < T_SPEAK + 1.75 ? .1 : 1;
    eye.pose({ x: -gap / 2, y: -470, s: .52, open: span(q, T_EYE + .4, T_EYE + .8) * blink, look: q < T_SPEAK ? -.5 : tween(q, T_SPEAK, .6, -.5, 0), glow: .9 }, f);
    vis(eye.g, q > T_EYE);

    // Sam, still crouched at the bed, freezes; very slowly her eyes and then her head go over her shoulder
    const so = { x: 450, y: 1500, s: 3.8, head: 'F', turn: 0 }, turn = span(q, .7, 2.4);
    samR.pose({ ...so, rua: 10, rfa: -8, lua: -10, lfa: 6, brow: .8, look: .95 * span(q, .5, 1.3), headR: 9 * turn, nod: 6 - 3 * turn,
      mouth: 'A', shut: false, tail: -4 * turn }, f);
    title.pose({ o: span(q, T_TITLE, T_TITLE + .5) });
    cap(q);
  });
}
