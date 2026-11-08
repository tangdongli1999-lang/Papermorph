/* scene1.js — Night Three. June in the open front door with the carrier, the flat dark; searching: under the bed, the
   closet, the living room; the carrier in the hall, purring; June kneels to it; it is empty, still warm; June frozen,
   the purring behind her; the oven clock, 3:07; the dark kitchen doorway, "June?"; Biscuit in it, taller; "Don't
   move."; June frozen; he walks up to her, reaches up; his paw on her cheek; "Almost."; he walks away into the kitchen;
   her phone: Ana, "Why did you post that?"; her face. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch04/narration.en.words.txt)
  const grp = () => mk('g', {}, p);
  const FONT = 'Helvetica Neue, Arial';
  // Biscuit tonight: 20% taller than his one size (the story's "he was taller"), in the kitchen doorway's scale
  const U_DOOR = 200, TALL = 1.2;

  const frontG = grp(), FD = paperCam(frontG, 'frontDoorInsideDark', { x: 700, y: 470, z: 1.1 }), juneDoor = sprite(FD.stage, 'june_work_scared_front');
  const bedG = grp(), UB = paperCam(bedG, 'searchUnderBed', { x: 800, y: 500, z: 1.1 });
  const closetG = grp(), CL = paperCam(closetG, 'searchCloset', { x: 1100, y: 470, z: 1.3 });
  const livG = grp(), LN = paperCam(livG, 'livingRoomNight', { x: 500, y: 520, z: 1.3 });
  const carG = grp(), CA = paperCam(carG, 'hallwayCarrierNight', { x: 800, y: 520, z: 1.0 }), juneKneel = sprite(CA.stage, 'june_kneel_carrier');
  const openG = grp(), CO = paperCam(openG, 'carrierOpenEmpty', { x: 560, y: 560, z: 1.2 });
  const hallG = grp(), HJ = paperCam(hallG, 'hallwayJuneNight', { x: 800, y: 450, z: 1.0 }), juneFrozen = sprite(HJ.stage, 'june_frozen_front');
  const bWalk = sprite(HJ.stage, 'biscuit_tall_walk_front'), bReach = sprite(HJ.stage, 'biscuit_tall_reach_up');
  const ovenG = grp(), OV = paperCam(ovenG, 'ovenClock307', { x: 800, y: 450, z: 1.0 });
  const kdG = grp(), KD = paperCam(kdG, 'kitchenDoorwayDark', { x: 800, y: 450, z: 1.0 }), bDoor = sprite(KD.stage, 'biscuit_tall_doorway_front'), bAway = sprite(KD.stage, 'biscuit_walk_away_back');
  // the close-ups, over the dark (their cream backgrounds are cut away)
  const closeG = grp(), cv = mk('g', {}, closeG);
  cv.innerHTML = `<defs><radialGradient id="c4dark" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#26304f"/><stop offset="1" stop-color="#0c1022"/></radialGradient></defs><rect x="-400" y="-300" width="2400" height="1600" fill="url(#c4dark)"/>`;
  const paw = sprite(cv, 'june_face_paw_closeup'), face = sprite(cv, 'june_phone_text_closeup'), eyes = sprite(cv, 'biscuit_tall_doorway_front');
  const tint = mk('rect', { x: -400, y: -300, width: 2400, height: 1600, fill: '#6f7fbf', style: 'mix-blend-mode:multiply' }, cv);
  closeG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  // the phone in the dark: Ana's message
  const phG = grp(), PH = paperCam(phG, 'phoneHand', { x: 800, y: 380, z: 1.1 });
  PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="scr4"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath></defs>`);
  mk('rect', { x: -400, y: -300, width: 2400, height: 1600, fill: '#3b4677', style: 'mix-blend-mode:multiply' }, PH.stage);
  const msg = mk('g', { 'clip-path': 'url(#scr4)' }, PH.stage);
  msg.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#0f1218"/>
    <rect x="620" y="50" width="360" height="96" fill="#1b2029"/><circle cx="799" cy="92" r="20" fill="#e8c9a8"/><text x="799" y="98" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="16" fill="#5a3b24">A</text>
    <text x="799" y="132" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="14" fill="#e8edf2">Ana 💛</text>
    <text x="799" y="182" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#7d8792">Yesterday 21:14</text>
    <rect x="644" y="196" width="190" height="40" rx="18" fill="#2a303a"/><text x="660" y="221" font-family="${FONT}" font-size="15" fill="#e8edf2">movie on saturday? 🍿</text>
    <rect x="770" y="246" width="176" height="40" rx="18" fill="#3b82f6"/><text x="786" y="271" font-family="${FONT}" font-size="15" fill="#fff">yesss obviously</text>
    <text x="799" y="318" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#7d8792">Today 03:09</text>
    <g data-n><rect x="644" y="332" width="236" height="40" rx="18" fill="#2a303a"/><text x="660" y="357" font-family="${FONT}" font-size="15" fill="#e8edf2">?? why did you post that</text></g>`;
  const newMsg = msg.querySelector('[data-n]');
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // when things happen (aligned word times)
  const T_HOME = sc(5.3), T_GONE = sc(9.2), T_BED = sc(11.05), T_CLOSET = sc(12.33), T_SOFA = sc(12.95), T_CARRIER = sc(14.15), T_KNEEL = sc(19.2), T_EMPTY = sc(23.9),
    T_BEHIND = sc(26.7), T_OVEN = sc(31.4), T_KITCHEN = sc(33.05), T_JUNE = sc(36.5), T_HIM = sc(39.15), T_SAID = sc(44.85), T_DONT = sc(47.85), T_FROZE = sc(49.45),
    T_WALK = sc(56.55), T_REACH = sc(58.35), T_PAW = sc(59.25), T_ALMOST = sc(65.5), T_AWAY = sc(67.35), T_PHONE = sc(69.5), T_ANA = sc(74.0), T_FACE = sc(75.8), T_BLACK = sc(79.2);
  const SHOTS = [[0, 'door'], [T_BED, 'bed'], [T_CLOSET, 'closet'], [T_SOFA, 'sofa'], [T_CARRIER, 'carrier'], [T_KNEEL, 'kneel'], [T_EMPTY, 'empty'], [T_BEHIND, 'frozen'],
    [T_OVEN, 'oven'], [T_KITCHEN, 'kitchen'], [T_HIM, 'him'], [T_DONT, 'dont'], [T_FROZE, 'frozen2'], [T_WALK, 'walk'], [T_REACH, 'reach'], [T_PAW, 'paw'],
    [T_ALMOST, 'almost'], [T_AWAY, 'away'], [T_PHONE, 'phone'], [T_FACE, 'face'], [T_BLACK, 'black']];
  const groups = { door: frontG, bed: bedG, closet: closetG, sofa: livG, carrier: carG, kneel: carG, empty: openG, frozen: hallG, frozen2: hallG, walk: hallG, reach: hallG,
    oven: ovenG, kitchen: kdG, him: kdG, dont: kdG, away: kdG, paw: closeG, almost: closeG, face: closeG, phone: phG };

  // cameras
  FD.to({ x: 760, y: 480, z: 1.15 }, 0, T_HOME).to({ x: 1000, y: 430, z: 1.7 }, T_HOME, T_BED - T_HOME);
  UB.to({ x: 900, y: 560, z: 1.4 }, T_BED, 1.3); CL.to({ x: 1150, y: 480, z: 1.6 }, T_CLOSET, .7); LN.to({ x: 420, y: 560, z: 1.6 }, T_SOFA, 1.2);
  CA.cut({ x: 800, y: 520, z: 1.0 }, T_CARRIER).to({ x: 800, y: 560, z: 1.35 }, T_CARRIER, T_KNEEL - T_CARRIER).cut({ x: 640, y: 540, z: 1.1 }, T_KNEEL).to({ x: 700, y: 560, z: 1.25 }, T_KNEEL, 4.6);
  CO.to({ x: 560, y: 600, z: 1.55 }, T_EMPTY, 2.6);
  HJ.cut({ x: 800, y: 420, z: 1.05 }, T_BEHIND).to({ x: 800, y: 380, z: 1.3 }, T_BEHIND, T_OVEN - T_BEHIND)
    .cut({ x: 800, y: 400, z: 1.15 }, T_FROZE).to({ x: 800, y: 330, z: 1.6 }, T_FROZE, T_WALK - T_FROZE)
    .cut({ x: 800, y: 470, z: 1.0 }, T_WALK).to({ x: 800, y: 500, z: 1.1 }, T_WALK, T_REACH - T_WALK).cut({ x: 800, y: 560, z: 1.25 }, T_REACH).to({ x: 800, y: 540, z: 1.35 }, T_REACH, .9);
  OV.to({ x: 800, y: 380, z: 1.6 }, T_OVEN, T_KITCHEN - T_OVEN);
  KD.cut({ x: 800, y: 450, z: 1.0 }, T_KITCHEN).to({ x: 800, y: 470, z: 1.25 }, T_KITCHEN, T_HIM - T_KITCHEN)
    .cut({ x: 800, y: 560, z: 1.4 }, T_HIM).to({ x: 800, y: 560, z: 1.7 }, T_HIM, T_SAID - T_HIM).to({ x: 800, y: 680, z: 3.0 }, T_SAID, T_DONT - T_SAID).to({ x: 800, y: 680, z: 3.6 }, T_DONT, 1.5)
    .cut({ x: 800, y: 620, z: 1.2 }, T_AWAY);
  PH.to({ x: 800, y: 300, z: 1.6 }, T_PHONE, T_FACE - T_PHONE);

  // sound
  sfx('scene1', .2, 'door', .6); sfx('scene1', T_GONE, 'hit', .6);
  sfx('scene1', T_BED, 'swipe', .5); sfx('scene1', T_CLOSET, 'swipe', .5); sfx('scene1', T_SOFA, 'swipe', .5);
  sfx('scene1', sc(15.85), 'purr', .9); sfx('scene1', sc(19.9), 'purr', .6);
  sfx('scene1', sc(23.0), 'latch', .7); sfx('scene1', T_EMPTY + .05, 'hit', .8);
  sfx('scene1', sc(26.95), 'purr', 1.0); sfx('scene1', sc(29.5), 'purr', .7);
  sfx('scene1', T_OVEN, 'tick', .6); sfx('scene1', T_KITCHEN + .5, 'riser', .7); sfx('scene1', T_JUNE - .05, 'hit', .7);
  sfx('scene1', T_HIM, 'hit', .9); sfx('scene1', T_DONT - .05, 'hit', .8);
  for (let t = T_FROZE; t < T_PAW + 6; t += .62) sfx('scene1', t, 'heart', .9);
  for (let k = 0; k < 4; k++) sfx('scene1', T_WALK + .2 + k * .45, 'barestep', .7);
  sfx('scene1', T_ALMOST - .1, 'hit', .7); sfx('scene1', T_AWAY + .2, 'pad', .8);
  sfx('scene1', sc(69.6), 'buzz', 1.0); sfx('scene1', T_ANA, 'tick', .5); sfx('scene1', T_FACE + .4, 'riser', .6);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const g of Object.values(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black');
    const breathe = Math.sin(q * 2.2), dt = (a) => q - a;

    if (shot === 'door') { FD.apply(q, f); juneDoor.pose({ x: 470, y: 900, h: 700, sy: 1 + .005 * breathe, o: 1 - span(q, T_HOME, T_HOME + .8) }); }
    if (shot === 'bed') UB.apply(q, f);
    if (shot === 'closet') CL.apply(q, f);
    if (shot === 'sofa') LN.apply(q, f);
    if (shot === 'carrier' || shot === 'kneel') {
      CA.apply(q, f); vis(juneKneel.g, shot === 'kneel');
      juneKneel.pose({ x: 330 + 30 * span(q, T_KNEEL, T_KNEEL + .6), y: 1010, h: 920, sy: 1 + .006 * breathe });
    }
    if (shot === 'empty') CO.apply(q, f);
    if (hallG._v === 'inherit') {
      HJ.apply(q, f);
      const juneOn = shot === 'frozen' || shot === 'frozen2';
      vis(juneFrozen.g, juneOn); vis(bWalk.g, shot === 'walk'); vis(bReach.g, shot === 'reach');
      juneFrozen.pose({ x: 800, y: 1040, h: 1000, sy: 1 + .004 * Math.sin(q * 6), rot: .25 * jit(Math.floor(f / 2), 2) });
      // he comes up the hall at us, getting nearer (bigger) step by step
      const u = span(q, T_WALK, T_REACH), ph = dt(T_WALK) * 4.4;
      bWalk.pose({ x: 800 + 10 * Math.sin(ph), y: lerp(640, 960, u) - 6 * Math.abs(Math.sin(ph)), h: lerp(180, 520, u) * TALL });
      bReach.pose({ x: 820, y: 1000, h: 560 * TALL, rot: -3 * span(q, T_REACH, T_REACH + .6) });
    }
    if (shot === 'oven') OV.apply(q, f);
    if (kdG._v === 'inherit') {
      KD.apply(q, f);
      vis(bDoor.g, shot === 'him' || shot === 'dont'); vis(bAway.g, shot === 'away');
      bDoor.pose({ x: 800, y: 862, h: U_DOOR * TALL, sy: 1 + .003 * breathe, o: shot === 'him' ? span(q, T_HIM, T_HIM + .35) : 1 });
      const u = span(q, T_AWAY + .1, T_PHONE - .2), ph = dt(T_AWAY) * 5;
      bAway.pose({ x: lerp(760, 820, u), y: lerp(1000, 862, u) - 4 * Math.abs(Math.sin(ph)), h: lerp(330, catH(U_DOOR, 'walk') * 1.05, u), rot: 1.5 * Math.sin(ph) });
    }
    if (closeG._v === 'inherit') {
      vis(paw.g, shot === 'paw'); vis(eyes.g, shot === 'almost'); vis(face.g, shot === 'face');
      const t0 = shot === 'paw' ? T_PAW : shot === 'almost' ? T_ALMOST : T_FACE, z = lerp(1, shot === 'almost' ? 1.25 : 1.2, span(q, t0, t0 + 4));
      tf(cv, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,-450)`);
      paw.pose({ x: 800, y: 1300, h: 1400, sy: 1 + .006 * Math.sin(q * 5), rot: .3 * jit(Math.floor(f / 2), 7) });
      eyes.pose({ x: 800, y: 3270, h: 3200 });   // his face only, filling the frame
      face.pose({ x: 800, y: 1300, h: 1400, sy: 1 + .005 * breathe });
      tint.setAttribute('opacity', shot === 'face' ? '.35' : '.55');
    }
    if (shot === 'phone') { PH.apply(q, f); vis(newMsg, q > T_ANA - .1); }
    cap(q);
  });
}
