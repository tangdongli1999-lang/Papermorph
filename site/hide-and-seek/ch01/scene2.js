/* scene2.js — the count (storyboard shots 7–12). Sam faces the wall, hands over her eyes, "One… two… three…"; behind
   her Leo hops off the bed and slides under it; close on Sam's face (the reverse angle, from the wall) as a second
   voice counts along half a beat late, its caption in faint red under hers; wide, the wardrobe door drifts open a
   finger's width under the count; close on Sam, still counting; "TEN! Ready or not!" alone: the other voice is silent.
   The Other's numbers are mixed into Sam's clips (voice_post.py, 0.30 s late); OTHER_COUNT is their caption. */
'use strict';
const PRE2 = .3;
const NUM_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
// When Sam says number k (beat clock): her clip's start, plus the hole before four and seven, plus the word's own lead.
const samSays = k => clipAt('scene2', PRE2, 'n' + k, (k === 4 || k === 7 ? 1.1 : 0) + .06);   // each number's clip starts 0.06 s before the word
const OTHER_COUNT = [4, 5, 6, 7, 8, 9].map(k => [samSays(k) + .30, NUM_WORDS[k] + '…', samSays(k) + 1.15]);

function scene2(p, D, m) {
  const R = bedroom(p, { x: 480, y: 860, z: 2 }), { cam } = R;
  // the reverse angle: from the wall, Sam's face, the room dark and soft behind her
  const rev = paperCam(p, 'reverse', { x: 450, y: 800, z: 1 });
  const samR = samPuppet(rev.stage), revNight = nightLight(rev.stage, [160, 1650]);
  rev.soft(0, true);

  const T_DIVE = clipAt('scene2', PRE2, 'n4') - .05, T_FACE = samSays(4) - .25, T_WIDE = clipAt('scene2', PRE2, 'n7') - .1,
    T_FACE2 = samSays(7) - .2, T_TEN = clipAt('scene2', PRE2, 'c4') + .15, T_TENW = T_TEN + .72;
  const SHOTS = [[0, 'back'], [T_DIVE, 'dive'], [T_FACE, 'face'], [T_WIDE, 'wide'], [T_FACE2, 'face'], [T_TEN, 'ten']];
  cam.cut({ x: 480, y: 770, z: 2.3 }, 0).to({ z: 2.45 }, .1, 3.2)
    .cut({ x: 380, y: 1120, z: 1.22 }, T_DIVE)
    .cut({ x: 610, y: 780, z: 1.25 }, T_WIDE).to({ x: 680, y: 740, z: 1.6 }, T_WIDE + .1, 1.4);
  rev.cut({ x: 450, y: 720, z: 1.5 }, 0).to({ z: 1.68 }, T_FACE, 4).cut({ x: 450, y: 712, z: 1.62 }, T_FACE2).to({ z: 1.9 }, T_FACE2, 4.2)
    .cut({ x: 450, y: 1000, z: 1.12 }, T_TEN).to({ z: 1.2 }, T_TEN, 2.5);

  const cap = hsCaptions(p, 'scene2', PRE2, { extra: OTHER_COUNT });
  sfx('scene2', 0, 'rain', .22, { loop: true });
  sfx('scene2', 0, 'hum', .12, { loop: true });
  sfx('scene2', T_DIVE + .02, 'springs', .22);
  sfx('scene2', T_DIVE + .1, 'patter', .5);
  sfx('scene2', T_DIVE + .42, 'thud', .35);
  sfx('scene2', T_WIDE + .15, 'creak', .55);

  // Leo's dive (beat clock): crouched at the bed's foot, a hop down to the floor, tipped flat, slid under the cover
  const L0 = T_DIVE, hopA = L0 + .12, hopB = L0 + .4, tip = L0 + .5, slide = L0 + .68, gone = L0 + 1.15;
  const [lx0, ly0] = [404, SPOT.leoBed[1]], [lx1, ly1] = SPOT.leoFloor;

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS), inRoom = !['face', 'ten'].includes(shot);
    vis(cam.root, inRoom); vis(rev.root, !inRoom);
    if (inRoom) cam.apply(q, f); else rev.apply(q, f);
    R.rain.pose(q); R.curt.pose({ sway: .5 * Math.sin(q * 1.3) }, f); R.bedF.pose({ lift: 0 }); vis(R.footG, false);
    R.lamp.pose({ x: NIGHTSTAND.lamp[0], y: NIGHTSTAND.lamp[1], s: .9, on: 1 }, f); R.night.pose({ dark: 0 }); revNight.pose({ dark: 0 });
    // the door: a finger's width during the wide, quietly shut again before she turns (off screen)
    R.ward.pose({ gap: q < T_WIDE + .2 ? 0 : q < T_FACE2 + 2 ? tween(q, T_WIDE + .2, .9, 0, 14) : tween(q, T_FACE2 + 2, .6, 14, 0) }, f);

    // Sam at the wall, from behind: arms up, hands over her eyes, a small nod on every number
    const nodK = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((a, k) => a + Math.max(0, 1 - Math.abs(q - samSays(k) - .1) / .25), 0);
    const sw = { x: SPOT.samWall[0], y: hipOn(SPOT.samWall[1], SAM_S.wall), s: SAM_S.wall, head: 'F', turn: 0, back: true };
    R.sam.pose({ ...sw, rua: -151, rfa: -98, lua: 151, lfa: 98, nod: 3 * nodK, tail: 4 * Math.sin(q * 2.1) }, f);

    // Leo: on the bed, then the dive; hidden under the cover after it
    const w = R.leoW, lo = { s: LEO_S, head: 'F', turn: 0 };
    if (q < hopA) { R.leo.pose({ ...lo, x: lx0, y: hipOn(ly0, LEO_S), crouch: .35, look: .6, rua: 30, lua: -30, shut: false }, f); tf(w, ''); }
    else if (q < tip) {
      const u = span(q, hopA, hopB), x = lx0 + (lx1 - lx0) * u, gy = ly0 + (ly1 - ly0) * u - 90 * Math.sin(Math.PI * Math.min(1, (q - hopA) / (hopB - hopA)));
      R.leo.pose({ ...lo, x, y: hipOn(gy, LEO_S), crouch: q > hopB ? .7 : .2, rua: -60, lua: 60, look: 1 }, f); tf(w, '');
    } else {
      const lie = span(q, tip, slide), sl = span(q, slide, gone), x = lx1 - 250 * sl;
      R.leo.pose({ ...lo, x: lx1, y: hipOn(ly1, LEO_S), crouch: .5 * (1 - lie), rua: -150 * lie, lua: 150 * lie, look: -1 }, f);
      // lying flat, he slides left and back into the dark under the bed (up the frame, behind the cover's hem)
      tf(w, `translate(${(x - lx1).toFixed(1)},${(-48 * lie - 120 * sl).toFixed(1)}) rotate(${(-88 * lie).toFixed(2)},${lx1},${ly1})`);
    }
    slotIn(R.leoW, q >= hopA && q < slide + .1 ? R.leoFront : R.leoBack);
    vis(R.leo.g, shot !== 'back' && q < gone + .1);

    // the reverse: her face, hands over her eyes, counting; at "Ten!" the hands come down and she grins
    const so = { x: 450, y: shot === 'ten' ? 1800 : 1484, s: 4, head: 'F', turn: 0 };
    const eyeR = [so.x + 11.8 * so.s, so.y - 190 * so.s], eyeL = [so.x - 11.8 * so.s, so.y - 190 * so.s];
    const drop = span(q, T_TEN + .05, T_TEN + .4);
    const hR = frontReach(so, 'R', eyeR), hL = frontReach(so, 'L', eyeL);
    samR.pose({ ...so, rua: hR.rua * (1 - drop) + 8 * drop, rfa: hR.rfa * (1 - drop) - 6 * drop, lua: hL.lua * (1 - drop) - 8 * drop, lfa: hL.lfa * (1 - drop) + 4 * drop,
      rFront: drop < .6, lFront: drop < .6, nod: 2 * nodK + breath(q, 1, .8), headR: drop ? 0 : 1.5 * Math.sin(q * .9),
      look: drop ? .3 : 0, brow: 0, mouth: lips(q, 'scene2', PRE2, 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'c4'),
      shut: blinking(q, [T_TENW + 1.1]), tail: 2 * Math.sin(q * 1.6) }, f);
    cap(q);
  });
}
