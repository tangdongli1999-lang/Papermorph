/* scene1.js — Night Two. The bedroom door locked; the pet camera set up in the hall; June awake in bed, staring at the
   door; the alarm clock, 2:00, 3:00, 3:07; her face on the pillow; the light under the door, the shadows of two feet
   crossing it and stopping; the lever handle, going down; the door open, Biscuit walking in upright to the end of the
   bed; from her pillow, him standing there, staring; "don't move"; his head tilts like hers; he limps round the bed
   on his right leg; morning, curled on her pillow, purring; June with her phone; the pet camera at 3:07: he stands
   up, walks to her door, the humming; he looks up into the camera. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch02/narration.en.words.txt)
  const grp = () => mk('g', {}, p);
  // Biscuit's standing height in each set (one cat, one size: the door in bedSide is 660 tall; June would be 490)
  const U_SIDE = 152, U_BED = 290;

  // the door, close (the lever is its own piece; the light under the door and the feet's shadows are drawn)
  const doorG = grp(), DR = paperCam(doorG, 'door', { x: 800, y: 450, z: 1 });
  const under = mk('g', {}, DR.stage);
  under.innerHTML = `<rect x="574" y="817" width="458" height="9" fill="#c9d6e8" opacity=".55"/><g data-s></g>`;
  const feetSh = under.querySelector('[data-s]'), sh = [0, 1].map(() => mk('ellipse', { rx: 34, ry: 6, fill: '#05070d', opacity: .85 }, feetSh));
  const lever = mk('g', {}, DR.stage);
  mk('image', { href: '../img/cast/door_lever.webp', x: -1330, y: -466, width: 1802, height: 988 }, lever);
  // the hall, the pet camera set down on the floor
  const hallG = grp(), HL = paperCam(hallG, 'hallway', { x: 800, y: 450, z: 1 }), cam = sprite(HL.stage, 'petcam_device');
  // the bedroom from the side: June in bed; the door open; Biscuit walking in, then limping round the bed
  const sideG = grp(), BS = paperCam(sideG, 'bedSide', { x: 800, y: 450, z: 1 });
  const juneBed = sprite(BS.stage, 'june_bed_awake'), bWalk = sprite(BS.stage, 'biscuit_stand_side_walk'), bLimp = sprite(BS.stage, 'biscuit_stand_side_limp');
  // the alarm clock (Chapter 1's bedroom)
  const clkG = grp(), BR = paperCam(clkG, 'bedroom', { x: 205, y: 612, z: 3.0 }), alarm = alarmClock(BR.stage, 205, 642, 96);
  // her face on the pillow, in the dark
  const pilG = grp(), PL = paperCam(pilG, 'pillow', { x: 800, y: 450, z: 1 }), pv = mk('g', {}, pilG);
  pv.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#7383c4" style="mix-blend-mode:multiply"/>`;
  pv.insertAdjacentHTML('beforeend', `<defs><linearGradient id="moonL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fb8ff" stop-opacity=".22"/><stop offset=".6" stop-color="#0b1030" stop-opacity=".35"/></linearGradient></defs><rect x="-400" y="-300" width="2400" height="1600" fill="url(#moonL)"/>`);
  pilG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  // from her pillow: the end of the bed, Biscuit standing behind the footboard
  const fbG = grp(), FB = paperCam(fbG, 'fromBed', { x: 800, y: 450, z: 1 }), bStare = sprite(FB.stage, 'biscuit_stand_front_stare'), bTilt = sprite(FB.stage, 'biscuit_stand_front_tilt');
  // the morning: him curled on her pillow; June sitting up with her phone
  const mornG = grp(), BM = paperCam(mornG, 'bedMorning', { x: 800, y: 450, z: 1 }), curled = sprite(BM.stage, 'biscuit_curled_sleeping');
  const sitG = grp(), BM2 = paperCam(sitG, 'bedMorning', { x: 420, y: 520, z: 1.6 }), juneSit = sprite(BM2.stage, 'june_sit_phone_morning');
  BM2.soft(0, 'all');
  const sitFront = mk('g', {}, sitG); sitG.appendChild(sitFront); const juneSitF = sprite(sitFront, 'june_sit_phone_morning');
  // the phone with the camera app open
  const appG = grp(), PH = paperCam(appG, 'phoneHand', { x: 800, y: 380, z: 1.05 });
  PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="scr2"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath></defs>`);
  const appScr = mk('g', { 'clip-path': 'url(#scr2)' }, PH.stage);
  appScr.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#11151c"/>
    <text x="799" y="128" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="20" fill="#e8edf2">PawCam</text>
    <text x="799" y="152" text-anchor="middle" font-family="Helvetica Neue, Arial" font-size="13" fill="#8e99a5">Hallway · last night</text>
    <g transform="translate(642,190) scale(.20)"><image href="../img/sets/petcam/bg.webp" x="-60" y="-34" width="1720" height="968" filter="url(#nv)"/></g>
    <rect x="642" y="190" width="314" height="177" fill="none" stroke="#2f3a46" stroke-width="2"/>
    <circle cx="799" cy="278" r="26" fill="#000" opacity=".5"/><path d="M790,264 L814,278 L790,292 Z" fill="#fff"/>
    <text x="652" y="394" font-family="Helvetica Neue, Arial" font-size="15" font-weight="700" fill="#e8edf2">Motion detected</text>
    <text x="652" y="416" font-family="Helvetica Neue, Arial" font-size="14" fill="#8e99a5">03:07 AM · Hallway</text>
    <rect x="652" y="440" width="294" height="1" fill="#2f3a46"/>
    <text x="652" y="472" font-family="Helvetica Neue, Arial" font-size="14" fill="#8e99a5">02:12 AM · no motion</text>
    <text x="652" y="500" font-family="Helvetica Neue, Arial" font-size="14" fill="#8e99a5">01:40 AM · no motion</text>`;
  // the pet camera, full frame, night vision: Biscuit gets up and walks to her door
  const pcG = grp(), PC = paperCam(pcG, 'petcam', { x: 800, y: 450, z: 1 });
  const nvBody = mk('g', { filter: 'url(#nv)' }, PC.stage), bFour = sprite(nvBody, 'biscuit_side_walk'), bHall = sprite(nvBody, 'biscuit_stand_back_hall');
  const grain = mk('g', { 'pointer-events': 'none' }, pcG);
  grain.innerHTML = `<defs><filter id="grainF"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="3"/><feColorMatrix values="0 0 0 0 .7  0 0 0 0 .85  0 0 0 0 .7  0 0 0 .14 0"/></filter></defs><rect width="1600" height="900" filter="url(#grainF)"/>`;
  // the last shot: he looks up into the camera (the finished picture)
  const stG = grp(), ST = paperCam(stG, 'stare', { x: 800, y: 470, z: 1 });
  const ov = camOverlay(p, 'HALLWAY CAM');
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // when things happen (aligned word times)
  const T_HALL = sc(2.1), T_BED = sc(4.0), T_CLOCK = sc(7.6), T_2 = sc(7.72), T_3 = sc(9.06), T_307 = sc(10.63), T_PIL = sc(11.95), T_DOOR = sc(14.9),
    T_STOP = sc(21.1), T_LEVER = sc(23.25), T_DOWN = sc(28.55), T_OPEN = sc(30.4), T_END = sc(35.9), T_DONT = sc(37.95), T_TILT = sc(40.5),
    T_LIMP = sc(44.6), T_ANKLE = sc(47.8), T_RIGHT = sc(51.7), T_MORN = sc(54.6), T_SIT = sc(57.6), T_APP = sc(64.55), T_CAM = sc(66.3),
    T_UP = sc(67.98), T_WALK = sc(69.55), T_SOUND = sc(71.1), T_HUM = sc(73.0), T_VOICE = sc(80.1), T_BLACK = sc(83.2);
  const SHOTS = [[0, 'door0'], [T_HALL, 'hall'], [T_BED, 'bed'], [T_CLOCK, 'clock'], [T_PIL, 'pillow'], [T_DOOR, 'door'], [T_LEVER, 'lever'], [T_OPEN, 'walkin'],
    [T_END, 'end'], [T_DONT, 'pillow2'], [T_TILT, 'tilt'], [T_LIMP, 'limp'], [T_ANKLE, 'leg'], [T_MORN, 'morning'], [T_SIT, 'sit'], [T_APP, 'app'],
    [T_CAM, 'cam'], [T_VOICE, 'stare'], [T_BLACK, 'black']];
  const groups = { door0: doorG, door: doorG, lever: doorG, hall: hallG, bed: sideG, walkin: sideG, limp: sideG, leg: sideG, clock: clkG, pillow: pilG, pillow2: pilG,
    end: fbG, tilt: fbG, morning: mornG, sit: sitG, app: appG, cam: pcG, stare: stG };

  // cameras
  DR.cut({ x: 800, y: 470, z: 1.05 }, 0).to({ z: 1.12 }, 0, T_HALL).cut({ x: 800, y: 560, z: 1.25 }, T_DOOR).to({ x: 800, y: 700, z: 1.7 }, T_DOOR + 1, 5)
    .cut({ x: 820, y: 470, z: 1.5 }, T_LEVER).to({ x: 930, y: 460, z: 2.6 }, T_LEVER + .3, 4.2);
  HL.to({ x: 700, y: 620, z: 1.35 }, T_HALL, 2);
  BS.cut({ x: 620, y: 520, z: 1.25 }, T_BED).to({ x: 820, y: 500, z: 1.45 }, T_BED, 3.6)
    .cut({ x: 1000, y: 520, z: 1.15 }, T_OPEN).to({ x: 900, y: 540, z: 1.3 }, T_OPEN + 1, 4)
    .cut({ x: 650, y: 600, z: 1.3 }, T_LIMP).to({ x: 520, y: 620, z: 1.4 }, T_LIMP, 3.2)
    .cut({ x: 400, y: 760, z: 2.6 }, T_ANKLE).to({ x: 330, y: 780, z: 3.0 }, T_ANKLE, 3.9).to({ x: 300, y: 790, z: 3.6 }, T_RIGHT, 1.2);
  BR.to({ z: 3.4 }, T_CLOCK, 4);
  PL.cut({ x: 800, y: 450, z: 1.05 }, T_PIL).to({ z: 1.25 }, T_PIL, 3).cut({ x: 820, y: 430, z: 1.1 }, T_DONT).to({ z: 1.5 }, T_DONT, 3).shake(T_DONT, T_TILT - T_DONT, 2.5);
  FB.cut({ x: 800, y: 470, z: 1.05 }, T_END).to({ x: 800, y: 440, z: 1.35 }, T_END, 2).cut({ x: 800, y: 430, z: 1.5 }, T_TILT).to({ x: 800, y: 400, z: 1.9 }, T_TILT, 4);
  BM.cut({ x: 340, y: 520, z: 1.5 }, T_MORN).to({ x: 340, y: 500, z: 2.2 }, T_MORN, 3);
  PH.to({ x: 800, y: 300, z: 1.6 }, T_APP + .2, T_CAM - T_APP);
  PC.cut({ x: 800, y: 450, z: 1.0 }, T_CAM).to({ x: 960, y: 380, z: 1.3 }, T_WALK, 2.2).to({ x: 1000, y: 340, z: 1.6 }, T_HUM, T_VOICE - T_HUM);
  ST.to({ x: 800, y: 560, z: 1.9 }, T_VOICE, T_BLACK - T_VOICE);

  // sound
  sfx('scene1', .7, 'latch', .8);
  for (const [t, v] of [[sc(12.0), .6], [sc(14.98), .9], [sc(15.63), .7], [sc(16.28), .9], [sc(16.78), .7], [sc(17.7), .8], [sc(18.5), .7], [sc(19.3), .8], [sc(20.1), .7], [sc(20.95), .9]]) sfx('scene1', t, 'barestep', v);
  for (let t = T_STOP + .3; t < T_LEVER; t += .9) sfx('scene1', t, 'heart', .9);
  sfx('scene1', T_DOWN + .1, 'lever', 1.0); sfx('scene1', T_OPEN, 'door', .8); sfx('scene1', T_OPEN + .05, 'hit', .7);
  for (let k = 0; k < 6; k++) sfx('scene1', T_OPEN + 1.2 + k * .62, 'barestep', .5);
  for (let t = T_DONT; t < T_TILT + 1; t += .62) sfx('scene1', t, 'heart', 1.0);
  sfx('scene1', T_TILT + .15, 'creak', .6);
  for (let k = 0; k < 5; k++) sfx('scene1', T_LIMP + .4 + k * .78, 'barestep', k % 2 ? .35 : .65);
  sfx('scene1', T_RIGHT + .1, 'hit', .7);
  sfx('scene1', T_MORN + .2, 'purr', .9); sfx('scene1', T_MORN + 3.6, 'purr', .7);
  sfx('scene1', T_APP + .1, 'tick', .4);
  sfx('scene1', T_UP + .2, 'riser', .5);
  sfx('scene1', T_HUM - .4, 'hum', .9);
  sfx('scene1', T_VOICE, 'hit', .9);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const g of Object.values(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black'); vis(ov.g, shot === 'cam' || shot === 'stare');
    const breathe = Math.sin(q * 2.2);

    if (doorG._v === 'inherit') {
      DR.apply(q, f);
      // the lever: down slowly on "go down, slowly", held there
      const down = span(q, T_DOWN, T_DOWN + 1.6);
      tf(lever, `translate(960,458) rotate(${(-38 * down).toFixed(2)}) scale(.0928)`);
      // two feet's shadows in the light under the door: crossing, then stopping in the middle
      const walking = shot === 'door' || shot === 'lever';
      vis(feetSh, walking && q > sc(14.8));
      const u = span(q, sc(14.8), T_STOP), xs = lerp(560, 790, u), step = Math.floor((q - sc(14.8)) / .65) % 2;
      sh[0].setAttribute('cx', (xs - 18 + (step && u < 1 ? 26 : 0)).toFixed(1)); sh[0].setAttribute('cy', 821);
      sh[1].setAttribute('cx', (xs + 30 - (!step && u < 1 ? 26 : 0)).toFixed(1)); sh[1].setAttribute('cy', 821);
    }
    if (shot === 'hall') { HL.apply(q, f); cam.pose({ x: 640, y: 830, h: 150 }); }
    if (sideG._v === 'inherit') {
      BS.apply(q, f);
      juneBed.pose({ x: 474, y: 642, h: 270, sy: 1 + .006 * breathe });
      vis(bWalk.g, shot === 'walkin'); vis(bLimp.g, shot === 'limp' || shot === 'leg');
      if (shot === 'walkin') {   // in through the door, upright, to the end of the bed (facing left: the picture flipped)
        const u = span(q, T_OPEN + .9, T_END - .3), mv = u > 0 && u < 1, ph = (q - T_OPEN) * 5.1;
        bWalk.pose({ x: lerp(1330, 960, u), y: 800 - (mv ? 5 * Math.abs(Math.sin(ph)) : 0), h: U_SIDE, sx: -1, rot: mv ? 2 * Math.sin(ph) : 0 });
      }
      if (shot === 'limp' || shot === 'leg') {   // round the front of the bed, dipping on every other step
        const u = span(q, T_LIMP + .2, T_MORN - .3), ph = (q - T_LIMP) * 4.0, dip = Math.max(0, Math.sin(ph)) ** 2;
        bLimp.pose({ x: lerp(950, 230, u), y: 840 + 7 * dip, h: U_SIDE, sx: -1, rot: 4 * dip - 1 });
      }
    }
    if (shot === 'clock') { BR.apply(q, f); alarm.set(q < T_3 ? '2:00' : q < T_307 ? '3:00' : '3:07'); }
    if (shot === 'pillow' || shot === 'pillow2') {
      PL.apply(q, f);
    }
    if (shot === 'end' || shot === 'tilt') {
      FB.apply(q, f);
      const tilting = shot === 'tilt' && q > T_TILT + .25;
      vis(bStare.g, !tilting); vis(bTilt.g, tilting);
      const lean = shot === 'tilt' ? span(q, T_TILT, T_TILT + .25) * 6 : 0;
      bStare.pose({ x: 800, y: 700, h: U_BED, rot: lean, sy: 1 + .004 * breathe });
      bTilt.pose({ x: 800, y: 700, h: U_BED, sy: 1 + .004 * breathe });
    }
    if (shot === 'morning') { BM.apply(q, f); curled.pose({ x: 228, y: 512, h: catH(U_SIDE, 'curl'), sy: 1 + .02 * Math.max(0, Math.sin(q * 3.4)) }); }
    if (shot === 'sit') {
      BM2.apply(q, f); vis(juneSit.g, false);
      const z = lerp(1, 1.15, span(q, T_SIT, T_APP));
      juneSitF.pose({ x: 800, y: 980, h: 980 * z, sy: 1 + .005 * breathe });
    }
    if (shot === 'app') PH.apply(q, f);
    if (shot === 'cam') {
      PC.apply(q, f);
      const standing = q > T_UP + .35;
      vis(bFour.g, !standing); vis(bHall.g, standing);
      bFour.pose({ x: 700, y: 820, h: 150, rot: q > T_UP ? -10 * span(q, T_UP, T_UP + .35) : 0 });
      const u = span(q, T_WALK, T_SOUND + .6), mv = u > 0 && u < 1, ph = (q - T_WALK) * 5;
      bHall.pose({ x: lerp(720, 1010, u), y: lerp(840, 560, u) - (mv ? 4 * Math.abs(Math.sin(ph)) : 0), h: lerp(230, 165, u), rot: mv ? 1.5 * Math.sin(ph) : 0 });
    }
    if (shot === 'stare') ST.apply(q, f);
    if (shot === 'cam' || shot === 'stare') ov.pose({ t: clockAdd('03:07:02', q - T_CAM), rec: Math.floor(q * 1.2) % 2 === 0, level: q > T_HUM - .3 ? .9 : q > T_SOUND ? .25 : 0, q });
    cap(q);
  });
}
