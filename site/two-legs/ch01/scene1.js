/* scene1.js — Night One. The post glowing on the duvet ("don't move"); at lunch, scrolled past; 3:07 on the bedside
   phone; black, the title; June gets up, the kitchen light under the door; the hall; Biscuit standing on the counter
   (a flash of him by day, fat and lazy); closer, facing the wall; June frozen in the doorway; his head turns all the
   way round; his eyes, up and down; forty-one breaths; he drops and hops down; past her ankle; the morning kitchen;
   the mug, handle to the left; the comments, down to "What happens on night three?". */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch01/narration.en.words.txt)
  const grp = () => mk('g', {}, p);

  // 1. the post on the glowing phone (the screen is a slanted quad in the picture)
  const bedG = grp(), PB = paperCam(bedG, 'phoneBed', { x: 800, y: 450, z: 1 });
  const scr = mk('g', { transform: 'matrix(1,.287,-.742,.666,907,247)' }, PB.stage), post1 = postCard(scr, 300, 620, { y0: 40 });
  // 2. the phone in her hand (the screen is world 630…968 x 57…700), used at lunch and for the comments
  const handG = grp(), PH = paperCam(handG, 'phoneHand', { x: 800, y: 380, z: 1 });
  const clipId = 'scrHand'; PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="${clipId}"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath></defs>`);
  const screen = mk('g', { 'clip-path': `url(#${clipId})` }, PH.stage);
  mk('rect', { x: 620, y: 50, width: 360, height: 660, fill: '#f7f8fa' }, screen);
  const feed = mk('g', {}, screen), SW = 334;
  mk('rect', { x: 0, y: 0, width: SW, height: 46, fill: '#ffffff' }, feed);
  const post2 = postCard(feed, SW, 700, { y0: 50 });
  const rows = mk('g', {}, feed); let ry = 50 + post2.h + 30;
  mk('text', { x: SW * .07, y: ry - 8, 'font-family': 'Helvetica Neue, Arial', 'font-size': 15, 'font-weight': 700, fill: '#68737e' }, rows).textContent = 'Comments';
  ry += 22;
  const COMMENTS = [['catmum_lou', 'Mine did it too.', 'c1'], ['r.okafor', 'Night one, it stands.', 'c2'], ['deb_in_leeds', 'Night two, it walks.', 'c3'],
    ['m0ss', 'ok this is fake right??', ''], ['jj_harper', 'my cat stood up last night and i laughed. should i not have laughed', ''], ['velvetpaws', 'just did what it said. froze. it went away', ''],
    ['anon_4471', 'night two was worse', ''], ['sophie.b', 'why does it look at you like that', ''], ['tomasz', 'did anyone get to night three', ''],
    ['kit_kat_kel', 'It walked past my bed on two legs.', ''], ['ellie_r', "don't move. that's all you have to do", ''], ['night_owl', 'it hummed. why did it hum', ''],
    ['clara.and.mochi', 'just stay still. it works.', ''], ['user99812', 'What happens on night three?', 'last']];
  const crow = {}; for (const [n, w, id] of COMMENTS) { const r = commentRow(rows, SW, ry, n, w, { hi: id === 'last', colour: id === 'last' ? '#d9d4ca' : ['#bfd3c6', '#e8c9a8', '#c9d3e8', '#e3c1c9'][ry % 4 | 0] }); if (id) crow[id] = { r, y: ry }; ry += r.h; }
  mk('text', { x: SW * .18, y: crow.last.y + crow.last.r.h - 4, 'font-family': 'Helvetica Neue, Arial', 'font-size': 14, fill: '#9aa3ad' }, rows).textContent = '0 replies';
  // 3. 3:07 on the bedside phone, and June getting up
  const bedrG = grp(), BR = paperCam(bedrG, 'bedroom', { x: 800, y: 450, z: 1 });
  const clock = mk('g', {}, BR.stage);
  clock.innerHTML = `<ellipse cx="186" cy="634" rx="60" ry="18" fill="#bfe6ff" opacity=".45"/><path d="M160,628 L210,626 L216,640 L156,642 Z" fill="#dff2ff"/>
    <text x="186" y="637" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="600" font-size="11" fill="#1d2b3a" transform="translate(186,635) scale(1,.55) translate(-186,-635)">3:07</text>
    <text x="186" y="606" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="300" font-size="30" fill="#e8f4ff" stroke="#0b1020" stroke-width="4" paint-order="stroke" opacity=".95">3:07 AM</text>`;
  const juneB = sprite(BR.stage, 'june_pyjamas_front');
  // the title in the dark
  const title = legTitle(p);
  // 4. the hallway, the kitchen light at its end
  const hallG = grp(), HL = paperCam(hallG, 'hallway', { x: 800, y: 450, z: 1 });
  // 5. the kitchen at night: Biscuit on the counter, from behind; by day (a flash): sitting, normal
  const kitG = grp(), K = paperCam(kitG, 'kitchen', { x: 800, y: 450, z: 1 });
  const bStand = sprite(K.stage, 'biscuit_stand_back'), bWalkK = sprite(K.stage, 'biscuit_side_walk');
  const dayG = grp(), KD = paperCam(dayG, 'kitchenDay', { x: 900, y: 430, z: 1.25 }), bSit = sprite(KD.stage, 'biscuit_sit_front');
  // 6. the counter, close: the head that turns
  const ctrG = grp(), CT = paperCam(ctrG, 'counter', { x: 800, y: 450, z: 1 }), turner = biscuitTurner(CT.stage);
  // 7. June in the doorway (drawn: the dark hall behind her, the kitchen's warm light on her)
  const doorG = grp(), DW = mk('g', {}, doorG), dv = mk('g', {}, DW);
  dv.innerHTML = `<defs><radialGradient id="warmOn" cx="50%" cy="80%" r="75%"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".38"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
      <linearGradient id="hallDk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1426"/><stop offset="1" stop-color="#1c2340"/></linearGradient></defs>
    <rect x="-400" y="-300" width="2400" height="1600" fill="url(#hallDk)"/>
    <rect x="560" y="120" width="480" height="760" fill="#0a0d1a"/><rect x="640" y="180" width="320" height="560" fill="#11172c"/>
    <rect x="470" y="-60" width="48" height="1100" fill="#b8b2a3"/><rect x="1082" y="-60" width="48" height="1100" fill="#9e9889"/><rect x="470" y="-60" width="660" height="40" fill="#c9c3b2"/>
    <rect x="-400" y="860" width="2400" height="400" fill="#3a2b25"/>`;
  const juneG = sprite(dv, 'june_pyjamas_glass'), juneH = sprite(dv, 'june_head_closeup');
  mk('rect', { x: -400, y: -300, width: 2400, height: 1600, fill: 'url(#warmOn)', style: 'mix-blend-mode:screen' }, dv);
  doorG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  // 8. the floor: her bare feet at the right, Biscuit walking past
  const flG = grp(), FL = paperCam(flG, 'floor', { x: 800, y: 450, z: 1 });
  const feet = sprite(FL.stage, 'june_pyjamas_front'), bWalkF = sprite(FL.stage, 'biscuit_side_walk');
  // 9. the morning: the kitchen, then the mug
  const mornG = grp(), KM = paperCam(mornG, 'kitchenDay', { x: 800, y: 450, z: 1 });
  const mugG = grp(), MG = paperCam(mugG, 'mug', { x: 800, y: 450, z: 1 });
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const flash = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#fff7e6', opacity: 0, 'pointer-events': 'none' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // when things happen (word times from the words file)
  const T_LUNCH = sc(7.0), T_SWIPE = sc(10.7), T_307 = sc(11.5), T_BLACK = sc(15.2), T_TITLE = sc(16.0), T_WAKE = sc(19.55), T_HALL = sc(25.85),
    T_BIS = sc(27.9), T_DAY = sc(28.65), T_NIGHT = sc(31.85), T_CLOSE = sc(34.05), T_JUNE = sc(39.15), T_GLASS = sc(43.95), T_TURN = sc(47.2),
    T_ME = sc(53.6), T_UP = sc(57.85), T_BREATH = sc(61.6), T_DROP = sc(63.4), T_FLOOR = sc(65.55), T_MORN = sc(68.25), T_MUG = sc(71.35),
    T_LEFT = sc(74.85), T_NOBODY = sc(76.75), T_POST = sc(78.4), T_C1 = sc(83.15), T_C2 = sc(84.35), T_C3 = sc(85.8), T_SCROLL = sc(87.15), T_LAST = sc(91.0), T_END = sc(94.3);
  const SHOTS = [[0, 'bed'], [T_LUNCH, 'lunch'], [T_307, '307'], [T_BLACK, 'title'], [T_WAKE, 'wake'], [T_HALL, 'hall'], [T_BIS, 'kitchen'], [T_DAY, 'day'],
    [T_NIGHT, 'kitchen'], [T_CLOSE, 'close'], [T_JUNE, 'face'], [T_GLASS, 'glass'], [T_TURN, 'turn'], [T_ME, 'stare'], [T_UP, 'eyes'], [T_BREATH, 'face2'],
    [T_DROP, 'drop'], [T_FLOOR, 'floor'], [T_MORN, 'morning'], [T_MUG, 'mug'], [T_POST, 'comments'], [T_END, 'black']];
  const groups = { bed: bedG, lunch: handG, '307': bedrG, wake: bedrG, hall: hallG, kitchen: kitG, drop: kitG, day: dayG, close: ctrG, turn: ctrG, stare: ctrG, eyes: ctrG,
    face: doorG, glass: doorG, face2: doorG, floor: flG, morning: mornG, mug: mugG, comments: handG };

  // cameras
  PB.to({ x: 830, y: 470, z: 1.35 }, 0, T_LUNCH);
  PH.cut({ x: 800, y: 380, z: 1.05 }, T_LUNCH).to({ z: 1.15 }, T_LUNCH, 4).cut({ x: 800, y: 380, z: 1.12 }, T_POST).to({ x: 800, y: 380, z: 1.32 }, T_POST, T_END - T_POST);
  BR.cut({ x: 230, y: 610, z: 2.6 }, T_307).to({ z: 3.0 }, T_307, 3.6).cut({ x: 800, y: 450, z: 1.04 }, T_WAKE).to({ x: 1000, y: 430, z: 1.18 }, T_WAKE + 2, 4);
  HL.to({ x: 780, y: 360, z: 2.1 }, T_HALL, T_BIS - T_HALL + .3);
  K.cut({ x: 980, y: 430, z: 1.05 }, T_BIS).to({ x: 1020, y: 440, z: 1.35 }, T_BIS, 1.0).cut({ x: 1030, y: 430, z: 1.4 }, T_NIGHT).to({ x: 1030, y: 420, z: 1.9 }, T_NIGHT, 2.2)
    .cut({ x: 1000, y: 480, z: 1.25 }, T_DROP);
  KD.to({ z: 1.4 }, T_DAY, 3.2);
  CT.cut({ x: 800, y: 470, z: 1.0 }, T_CLOSE).to({ z: 1.12 }, T_CLOSE, 5).cut({ x: 800, y: 380, z: 1.15 }, T_TURN).to({ x: 800, y: 300, z: 1.55 }, T_TURN + 3.5, 3)
    .cut({ x: 800, y: 260, z: 2.2 }, T_ME).to({ z: 2.5 }, T_ME, 4).cut({ x: 800, y: 222, z: 4.0 }, T_UP).to({ z: 4.4 }, T_UP, 3.6);
  FL.to({ x: 820, y: 470, z: 1.05 }, T_FLOOR, 2.6);
  KM.cut({ x: 800, y: 450, z: 1.0 }, T_MORN).to({ x: 930, y: 470, z: 1.45 }, T_MORN + .4, 2.9);
  MG.to({ x: 760, y: 520, z: 1.35 }, T_MUG, 3.6).to({ x: 640, y: 480, z: 1.9 }, T_LEFT - .2, 1.0).to({ x: 760, y: 520, z: 1.25 }, T_NOBODY, .9);

  // sound
  sfx('scene1', .2, 'buzz', .5);
  for (let i = 0; i < 6; i++) sfx('scene1', T_LUNCH + .4 + i * .18, 'tick', .12);
  sfx('scene1', T_SWIPE, 'swipe', .7); sfx('scene1', T_307 + .1, 'buzz', .45);
  sfx('scene1', T_TITLE, 'hit', 1.0);
  sfx('scene1', T_NIGHT - .05, 'hit', .55);
  for (let t = T_CLOSE + .2; t < T_TURN; t += .92) sfx('scene1', t, 'heart', .9);
  sfx('scene1', T_TURN, 'riser', .8); sfx('scene1', T_TURN + 1.6, 'creak', .7); sfx('scene1', T_TURN + 3.2, 'creak', .6);
  sfx('scene1', T_ME - .15, 'hit', .9);
  for (let t = T_BREATH; t < T_DROP + 1.4; t += .62) sfx('scene1', t, 'heart', 1.0);
  sfx('scene1', T_DROP + 1.75, 'hop', 1.0);
  sfx('scene1', T_FLOOR + .3, 'pad', .9); sfx('scene1', T_FLOOR + 1.8, 'pad', .7);
  sfx('scene1', T_LEFT, 'hit', .45); sfx('scene1', T_NOBODY + .1, 'riser', .5);
  sfx('scene1', T_SCROLL, 'swipe', .7); sfx('scene1', T_SCROLL + .5, 'swipe', .6); sfx('scene1', T_LAST - .1, 'hit', .8);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const [k, g] of Object.entries(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black'); vis(title.g, shot === 'title');
    // a white blink into and out of the daytime memory
    flash.setAttribute('opacity', (Math.max(0, 1 - Math.abs(q - T_DAY) / .18) * .85 + Math.max(0, 1 - Math.abs(q - T_NIGHT) / .12) * .5).toFixed(3));
    const breathe = Math.sin(q * 2.2);

    if (shot === 'bed') { PB.apply(q, f); post1.shares(Math.round(399000 * span(q, sc(6.2), sc(8.0)) ** .5 + 1000 * (q > 1))); }
    if (shot === 'lunch' || shot === 'comments') {
      PH.apply(q, f);
      if (shot === 'lunch') {   // the post, then flicked away as she laughs
        post2.shares(400000); tf(feed, `translate(632,${(59 - 760 * span(q, T_SWIPE, T_SWIPE + .45)).toFixed(1)})`);
        vis(rows, false);
      } else {   // the post at the top, then each comment as she says it, then a fast scroll to the last one
        vis(rows, true);
        const base = -(50 + post2.h - 40), lastY = -(crow.last.y - 420);
        const y = q < T_SCROLL ? lerp(0, base, span(q, T_POST + .5, T_POST + 2.4)) : lerp(base, lastY, span(q, T_SCROLL, T_SCROLL + 1.6) ** .8);
        tf(feed, `translate(632,${(59 + y).toFixed(1)})`);
        for (const [id, t] of [['c1', T_C1], ['c2', T_C2], ['c3', T_C3]]) crow[id].r.g.setAttribute('opacity', q < T_SCROLL ? span(q, t - .25, t).toFixed(2) : '1');
      }
    }
    if (shot === '307' || shot === 'wake') {
      BR.apply(q, f); vis(clock, shot === '307'); vis(juneB.g, shot === 'wake');
      if (shot === 'wake') {   // out of bed and across to the door, a small bob on each step
        const u = span(q, T_WAKE + 2.9, T_HALL - .2), mv = u > 0 && u < 1, step = Math.abs(Math.sin((q - T_WAKE) * 5.2));
        juneB.pose({ x: lerp(560, 1230, u), y: 812 - (mv ? 7 * step : 0), h: 470, rot: mv ? 1.6 * Math.sin((q - T_WAKE) * 5.2) : 0, sy: 1 + .006 * breathe });
      }
    }
    if (shot === 'title') title.pose({ o: span(q, T_TITLE + .05, T_TITLE + .9), k: span(q, T_TITLE, T_WAKE) });
    if (shot === 'hall') HL.apply(q, f);
    if (shot === 'kitchen' || shot === 'drop') {
      K.apply(q, f);
      if (shot === 'kitchen') { vis(bStand.g, true); vis(bWalkK.g, false); bStand.pose({ x: 1030, y: 514, h: 196, sy: 1 + .004 * breathe }); }
      else {   // he drops onto four legs, walks to the edge and hops down
        const down = q > T_DROP + .25, u = span(q, T_DROP + 1.3, T_DROP + 1.75);
        vis(bStand.g, !down); vis(bWalkK.g, down);
        bStand.pose({ x: 1030, y: 514, h: 196 - 30 * span(q, T_DROP, T_DROP + .25) });
        const xw = lerp(1030, 1250, span(q, T_DROP + .3, T_DROP + 1.3)), hopY = u > 0 ? lerp(514, 878, u) - 140 * Math.sin(Math.PI * u) : 514;
        bWalkK.pose({ x: u > 0 ? lerp(1250, 1360, u) : xw, y: hopY - (u === 0 && q > T_DROP + .3 ? 3 * Math.abs(Math.sin(q * 9)) : 0), h: 120, rot: u > 0 && u < 1 ? lerp(-12, 18, u) : 0 });
      }
    }
    if (shot === 'day') { KD.apply(q, f); bSit.pose({ x: 1030, y: 520, h: 150, sy: 1 + .01 * breathe }); }
    if (shot === 'close' || shot === 'turn' || shot === 'stare' || shot === 'eyes') {
      CT.apply(q, f);
      const turn = shot === 'close' ? 0 : span(q, T_TURN + .9, T_ME - .5);
      const shake = turn > .05 && turn < .95 ? 1.2 * jit(f, 5) : 0;
      turner.pose({ x: 800, y: 786, h: 660, turn, tilt: shot === 'close' ? 0 : lerp(0, -9, Math.sin(Math.PI * turn)) + shake, bob: 0 });
      // the eyes: still, then up … and down (the way a person looks you over)
      const dy = shot === 'eyes' ? (q < sc(59.1) ? -span(q, T_UP, T_UP + .5) : lerp(-1, 1, span(q, sc(59.1), sc(59.9)))) : 0;
      turner.eyes.look(0, dy);
    }
    if (shot === 'face' || shot === 'glass' || shot === 'face2') {
      vis(juneG.g, shot === 'glass'); vis(juneH.g, shot !== 'glass');
      let z = 1, cy = 450;
      if (shot === 'glass') { juneG.pose({ x: 800, y: 1010, h: 940, sy: 1 + .005 * breathe }); z = lerp(1, 1.25, span(q, T_GLASS, T_TURN)); cy = lerp(450, 360, span(q, T_GLASS, T_TURN)); }
      else {
        const t0 = shot === 'face' ? T_JUNE : T_BREATH, deep = shot === 'face2' ? .018 : .008;
        juneH.pose({ x: 800, y: 980, h: 900, sy: 1 + deep * Math.sin(q * (shot === 'face2' ? 5 : 2.2)), rot: .4 * jit(Math.floor(f / 3), 3) });
        z = lerp(1, shot === 'face' ? 1.22 : 1.35, span(q, t0, t0 + 4.5)); cy = lerp(450, 420, span(q, t0, t0 + 4.5));
      }
      tf(DW, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,${-cy})`);
    }
    if (shot === 'floor') {
      FL.apply(q, f);
      feet.pose({ x: 1270, y: 925, h: 2400, sy: 1 + .003 * breathe });
      const u = span(q, T_FLOOR + .1, T_MORN - .2), step = Math.abs(Math.sin((q - T_FLOOR) * 7));
      bWalkF.pose({ x: lerp(-260, 1820, u), y: 905 - 6 * step, h: 360, rot: 1.5 * Math.sin((q - T_FLOOR) * 7) });
    }
    if (shot === 'morning') KM.apply(q, f);
    if (shot === 'mug') MG.apply(q, f);
    cap(q, shot !== 'title' || q > T_TITLE + 1.4);
  });
}
