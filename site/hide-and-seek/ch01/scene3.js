/* scene3.js — the search (storyboard shots 13–16). Sam turns from the wall: the room is empty, the wardrobe shut again;
   she checks behind the curtain, "Leo-o… I know you're in here…"; an insert: a small dinosaur foot peeking from under
   the bed's cover; she grins, crouches and lifts the cover, "Found you!" */
'use strict';
const PRE3 = .2;

function scene3(p, D, m) {
  const R = bedroom(p, { x: 450, y: 800, z: 1 }), { cam } = R;
  const at = (clip, t = 0) => clipAt('scene3', PRE3, clip, t);
  const T_CURT = 1.45, T_PULL = at('l05', 1.75), T_FOOT = at('l06') - .05, T_BED = at('l06', .95), T_LIFT = at('l06', 1.2);
  const SHOTS = [[0, 'wide'], [T_CURT, 'curtain'], [T_FOOT, 'foot'], [T_BED, 'bed']];
  cam.cut({ x: 450, y: 800, z: 1 }, 0).to({ z: 1.05 }, .2, 1.2)
    .cut({ x: 410, y: 800, z: 1.6 }, T_CURT).to({ x: 390, z: 1.75 }, T_PULL - .3, 1.6)
    .cut({ x: SPOT.foot[0] + 20, y: SPOT.foot[1] - 20, z: 3.6 }, T_FOOT).to({ z: 3.9 }, T_FOOT, 1.2)
    .cut({ x: 320, y: 1300, z: 1.55 }, T_BED);
  const cap = hsCaptions(p, 'scene3', PRE3);
  sfx('scene3', T_PULL, 'sash', .25);
  sfx('scene3', T_BED + .1, 'step1', .4);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    cam.apply(q, f);
    R.rain.pose(q); R.ward.pose({ gap: 0 }, f); R.night.pose({ dark: 0 });
    R.curt.pose({ pull: .55 * span(q, T_PULL, T_PULL + .45), sway: .5 * Math.sin(q * 1.3) }, f);
    R.lamp.pose({ x: NIGHTSTAND.lamp[0], y: NIGHTSTAND.lamp[1], s: .9, on: 1 }, f);
    leoUnderBed(R, q, f);
    // the dinosaur foot under the hem: still, then a tiny twitch of the toes just before she sees it
    vis(R.footG, q < T_LIFT + .15);   // once the cover is up, it is Leo's own foot in the dark
    tf(R.foot, `translate(${SPOT.foot[0]},${SPOT.foot[1]}) rotate(${(q > T_FOOT + .5 && q < T_FOOT + .7 ? -4 : 0) + jit(f, 3) * .3}) scale(.9)`);
    const lift = span(q, T_LIFT, T_LIFT + .45) * .92;
    R.bedF.pose({ lift });

    if (shot === 'wide') {   // she turns round from the wall to the room: back view, then front
      const turned = q > .45;
      const so = { x: SPOT.samWall[0], y: hipOn(SPOT.samWall[1], SAM_S.wall), s: SAM_S.wall, head: 'F', turn: 0, back: !turned };
      R.sam.pose({ ...so, rua: 8, rfa: -6, lua: -8, lfa: 4,   // hands already down, as scene 2 left her
        look: turned ? tween(q, .5, .8, -1, 1) : 0, mouth: 'X', tail: 3 * Math.sin(q * 2) }, f);
    } else if (shot === 'curtain') {   // at the window, her hand on the curtain's edge, peering behind it
      const so = { x: SPOT.samCurtain[0], y: hipOn(SPOT.samCurtain[1], SAM_S.wall), s: SAM_S.wall, head: 'F', turn: 0 };
      const pull = .55 * span(q, T_PULL, T_PULL + .45), edge = [330 + 52 * pull, 860];
      const hand = frontReach(so, 'L', edge);
      R.sam.pose({ ...so, lua: tween(q, T_CURT, .4, -8, hand.lua), lfa: tween(q, T_CURT, .4, 4, hand.lfa), rua: 10, rfa: -10,
        look: -1, headR: -4 - 5 * span(q, T_PULL, T_PULL + .5) + breath(q), lean: 0, brow: 0, mouth: lips(q, 'scene3', PRE3, 'l05'), shut: blinking(q, [T_CURT + .3]), tail: 3 * Math.sin(q * 2) }, f);
    } else {   // crouched at the bed, in profile facing the foot of it: the grin, the hand under the hem, the cover up
      const so = { x: SPOT.samBed[0] + 40, y: hipOn(SPOT.samBed[1], SAM_S.bed), s: SAM_S.bed, turn: -1, crouch: .78, lean: tween(q, T_BED, .3, 10, 34) };
      const up = span(q, T_LIFT, T_LIFT + .45);
      R.sam.pose({ ...so, ua: -58 - 50 * up, fa: -24 + 10 * up, fua: -40 - 30 * up, ffa: -20, look: .4, nod: -4 * up,
        mouth: lips(q, 'scene3', PRE3, 'l06'), shut: blinking(q, [T_BED + .2]), tail: 6 + 3 * Math.sin(q * 2) }, f);
    }
    vis(R.sam.g, shot !== 'foot');
    cap(q);
  });
}
