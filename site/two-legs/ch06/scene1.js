/* scene1.js — Now. Six weeks later: the cat on the windowsill in the rain; the Thing in June's clothes leaving for work;
   laughing on the sofa with Ana; the post at two million shares; Clara's new photo, the cat gone; "I can't type, I can't
   talk": the window again; the meow, and the hand behind her ears; her face, to the viewer: "you can hear me"; the rule
   corrected ("don't" struck out); Biscuit standing in the kitchen; MOVE; the three things to do, in cut-paper type; then a
   different flat, dark, a screen's glow: two ears over the sofa, rising, standing; "Just move." Smash to black; title. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch06/narration.en.words.txt)
  const grp = () => mk('g', {}, p);
  const FONT = 'Helvetica Neue, Arial';

  const winG = grp(), WN = paperCam(winG, 'windowsillRain', { x: 760, y: 470, z: 1.15 });
  const leaveG = grp(), LV = paperCam(leaveG, 'leavingWork', { x: 800, y: 450, z: 1.05 });
  const sofaG = grp(), SA = paperCam(sofaG, 'sofaAnaDay', { x: 800, y: 450, z: 1.0 });
  // the post, two million shares
  const phG = grp(), PH = paperCam(phG, 'phoneHand', { x: 800, y: 400, z: 1.05 });
  PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="scr6"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath></defs>`);
  const scr = mk('g', { 'clip-path': 'url(#scr6)' }, PH.stage);
  scr.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#ffffff"/>
    <circle cx="672" cy="104" r="20" fill="#c9b8dd"/><text x="702" y="100" font-family="${FONT}" font-weight="700" font-size="15" fill="#1b2026">june.k</text>
    <text x="702" y="120" font-family="${FONT}" font-size="12" fill="#68737e">6 weeks ago</text>
    ${wrapText("If your cat ever stands on two legs, don't move.", 28).map((l, i) => `<text x="652" y="${162 + i * 26}" font-family="${FONT}" font-weight="600" font-size="19" fill="#1b2026">${esc(l)}</text>`).join('')}
    <rect x="642" y="246" width="314" height="314" fill="#000"/><image href="../img/photos/june_asleep.webp" x="642" y="246" width="314" height="314"/>
    <text data-l x="652" y="226" font-family="${FONT}" font-weight="800" font-size="22" fill="#d0452f"></text>`;
  const pLikes = scr.querySelector('[data-l]');
  // Clara's new photo: a sharp square over a blurred copy of itself
  const fotoG = grp(), fz = mk('g', {}, fotoG);
  fz.innerHTML = `<image href="../img/photos/clara_photo_after_4-blur.webp" x="-200" y="-350" width="2000" height="2000" opacity=".75"/>
    <rect x="-200" y="-350" width="2000" height="2000" fill="#000" opacity=".35"/><rect x="342" y="-8" width="916" height="916" fill="#fbfaf6"/>
    <image href="../img/photos/clara_photo_after_4.webp" x="350" y="0" width="900" height="900"/>`;
  fotoG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  const meowG = grp(), MW = paperCam(meowG, 'meowScratch', { x: 800, y: 450, z: 1.05 });
  const closeG = grp(), CU = paperCam(closeG, 'catJuneCloseup', { x: 800, y: 430, z: 1.0 });
  // the rule, corrected
  const ruleG = grp(); ruleG.innerHTML = `<rect x="-100" y="-100" width="1800" height="1100" fill="#06070c"/>`;
  const rule = mk('g', {}, ruleG);
  rule.innerHTML = `<text x="800" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#e9dfc9">If your cat ever stands on two legs,</text>
    <text x="800" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="700" fill="#e9dfc9"><tspan data-d>don't</tspan> move.</text>
    <path data-x d="M560,488 L800,488" stroke="#d0452f" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  const strike = rule.querySelector('[data-x]'), dont = rule.querySelector('[data-d]');
  // Biscuit, the first night
  const kG = grp(), KH = paperCam(kG, 'kitchen', { x: 1030, y: 420, z: 3.0 }), bStare = sprite(KH.stage, 'biscuit_stand_front_stare');
  // the cards: MOVE, then the three things
  const cardG = grp(); cardG.innerHTML = `<rect x="-100" y="-100" width="1800" height="1100" fill="#06070c"/>`;
  const card = mk('g', {}, cardG);
  const lines = [['MOVE.', 0], ['THE VERY FIRST NIGHT.', 1], ['TURN ON THE LIGHTS.', 2], ['MAKE NOISE.', 3], ['GET OUT OF THE ROOM.', 4], ['IT CAN\'T LEARN YOU', 5], ['IF YOU DON\'T HOLD STILL.', 6]];
  card.innerHTML = lines.map(([s, i]) => `<text data-i="${i}" x="800" text-anchor="middle" font-family="Georgia, serif" font-weight="700" fill="${i === 0 ? '#d0452f' : '#e9dfc9'}" letter-spacing="6">${s}</text>`).join('');
  const cardEls = [...card.querySelectorAll('text')];
  // a different flat: two ears over the sofa, then it stands
  const darkG = grp(), DE = paperCam(darkG, 'sofaDarkEars', { x: 800, y: 450, z: 1.0 });
  const standG = mk('g', {}, darkG), DS = paperCam(standG, 'sofaDarkStanding', { x: 800, y: 450, z: 1.0 });
  // the cat cut from the standing frame (where it differs from the ears frame), rising from behind the sofa's back (world y 500)
  DE.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="rise6"><rect x="-200" y="-200" width="2000" height="700"/></clipPath></defs>
    <g clip-path="url(#rise6)"><g data-r><image href="../img/cast/cat_june_rise_cut.webp" x="606" y="54" width="385" height="428"/></g></g>`);
  const riseG = DE.stage.querySelector('[data-r]');
  const title = legTitle(p);
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // when things happen (aligned word times)
  const T_WORK = sc(2.27), T_LAUGH = sc(3.86), T_POST = sc(8.97), T_CLARA = sc(11.65), T_PHOTO = sc(14.09), T_MOCHI = sc(15.42), T_TYPE = sc(17.54),
    T_EVERY = sc(20.54), T_MEOW = sc(22.65), T_HEAR = sc(26.59), T_YOU = sc(28.18), T_FORGET = sc(29.18), T_IF = sc(30.71), T_MOVE = sc(32.95),
    T_FIRST = sc(33.78), T_LIGHTS = sc(35.3), T_NOISE = sc(36.15), T_OUT = sc(36.83), T_LEARN = sc(38.32), T_HOLD = sc(39.18), T_DARK = sc(40.86),
    T_TURN = sc(43.55), T_JUST = sc(45.62), T_END = sc(46.3), T_TITLE = sc(47.0);
  const SHOTS = [[0, 'window'], [T_WORK, 'leave'], [T_LAUGH, 'sofa'], [T_POST, 'post'], [T_CLARA, 'photo'], [T_TYPE, 'window2'], [T_EVERY, 'meow'],
    [T_HEAR, 'close'], [T_FORGET, 'rule'], [T_IF, 'stare'], [T_MOVE, 'card'], [T_DARK, 'dark'], [T_END, 'black'], [T_TITLE, 'title']];
  const groups = { window: winG, window2: winG, leave: leaveG, sofa: sofaG, post: phG, photo: fotoG, meow: meowG, close: closeG, rule: ruleG, stare: kG, card: cardG, dark: darkG };
  // which card lines are up, from when
  const CARD = [[T_MOVE, [0]], [T_FIRST, [1]], [T_LIGHTS, [2]], [T_NOISE, [2, 3]], [T_OUT, [2, 3, 4]], [T_LEARN, [5]], [T_HOLD, [5, 6]]];

  // cameras
  WN.to({ x: 740, y: 460, z: 1.3 }, 0, T_WORK).cut({ x: 700, y: 470, z: 1.35 }, T_TYPE).to({ x: 700, y: 440, z: 1.6 }, T_TYPE, T_EVERY - T_TYPE);
  LV.to({ x: 860, y: 440, z: 1.2 }, T_WORK, T_LAUGH - T_WORK);
  SA.to({ x: 560, y: 420, z: 1.35 }, T_LAUGH, 2).to({ x: 1030, y: 520, z: 1.55 }, sc(6.0), T_POST - sc(6.0));
  PH.to({ x: 800, y: 420, z: 1.3 }, T_POST, T_CLARA - T_POST);
  MW.to({ x: 900, y: 470, z: 1.25 }, T_EVERY, T_MEOW - T_EVERY).shake(T_MEOW, .5, 9).to({ x: 600, y: 360, z: 1.35 }, T_MEOW + .6, T_HEAR - T_MEOW - .6);
  CU.to({ x: 800, y: 420, z: 1.35 }, T_HEAR, T_FORGET - T_HEAR);
  KH.to({ x: 1030, y: 410, z: 4.2 }, T_IF, T_MOVE - T_IF);
  DE.to({ x: 800, y: 430, z: 1.12 }, T_DARK, T_JUST - T_DARK).to({ x: 800, y: 380, z: 1.45 }, T_JUST, T_END - T_JUST);
  DS.to({ x: 800, y: 430, z: 1.12 }, T_DARK, T_JUST - T_DARK).to({ x: 800, y: 380, z: 1.45 }, T_JUST, T_END - T_JUST);

  // sound
  sfx('scene1', .2, 'pad', .5);
  sfx('scene1', T_WORK + .3, 'door', .5);
  sfx('scene1', T_POST, 'swipe', .7); sfx('scene1', T_CLARA, 'swipe', .7); sfx('scene1', T_MOCHI - .05, 'hit', .8);
  sfx('scene1', T_MEOW - .05, 'meow', .9); sfx('scene1', T_MEOW + 1.6, 'purr', .45);
  sfx('scene1', T_HEAR, 'riser', .5);
  sfx('scene1', T_FORGET + .1, 'hit', .8); sfx('scene1', T_FORGET + .55, 'swipe', .8);
  for (let t = T_IF; t < T_MOVE; t += .55) sfx('scene1', t, 'heart', .8);
  sfx('scene1', T_MOVE - .03, 'hit', 1.0);
  for (const t of [T_FIRST, T_LIGHTS, T_NOISE, T_OUT, T_LEARN, T_HOLD]) sfx('scene1', t - .02, 'thud', .7);
  sfx('scene1', T_DARK, 'buzz', .5);
  for (let t = T_TURN; t < T_JUST; t += .8) sfx('scene1', t, 'heart', .6);
  sfx('scene1', T_TURN + .3, 'creak', .6); sfx('scene1', T_JUST - .6, 'riser', .7);
  sfx('scene1', T_END - .02, 'hit', 1.0);
  sfx('scene1', T_TITLE, 'pad', .6);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const g of Object.values(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black'); vis(title.g, shot === 'title');

    if (shot === 'window' || shot === 'window2') WN.apply(q, f);
    if (shot === 'leave') LV.apply(q, f);
    if (shot === 'sofa') SA.apply(q, f);
    if (shot === 'post') {
      PH.apply(q, f);
      const n = Math.floor(lerp(1340000, 2004000, span(q, T_POST, T_POST + 2.2) ** .5) / 1000) * 1000;
      const likes = `♥ ${n.toLocaleString('en-US')} shares`; if (pLikes._t !== likes) pLikes.textContent = pLikes._t = likes;
    }
    if (shot === 'photo') {
      // a slow push in, then a faster one toward the empty cushion when her cat's name is said
      const z = lerp(1.0, 1.12, span(q, T_CLARA, T_MOCHI)) + .18 * span(q, T_MOCHI, T_MOCHI + 1.6) ** .5;
      tf(fz, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,-450)`);
    }
    if (shot === 'meow') MW.apply(q, f);
    if (shot === 'close') CU.apply(q, f);
    if (shot === 'rule') {
      const k = span(q, T_FORGET + .5, T_FORGET + .9);
      strike.setAttribute('d', `M560,488 L${(560 + 210 * k).toFixed(1)},488`); dont.setAttribute('opacity', (1 - .55 * k).toFixed(3));
      tf(rule, `translate(800,450) scale(${(1 + .04 * span(q, T_FORGET, T_IF)).toFixed(4)}) translate(-800,-450)`);
    }
    if (shot === 'stare') { KH.apply(q, f); bStare.pose({ x: 1030, y: 514, h: 196 }); }
    if (shot === 'card') {
      let on = []; for (const [t, ids] of CARD) if (q >= t) on = ids;
      cardEls.forEach((el, i) => {
        const at = on.indexOf(i), show = at >= 0;
        if (el._s !== show) { el.setAttribute('opacity', show ? 1 : 0); el._s = show; }
        if (!show) return;
        const big = i === 0, size = big ? 230 : 84, y = big ? 520 : 450 + (at - (on.length - 1) / 2) * 120;
        const since = q - CARD.find(([, ids]) => ids.includes(i))[0];   // since this line first came up
        const pop = 1 + .25 * Math.max(0, 1 - since / .18);   // a slam in
        const sh = big && since < .5 ? 12 * (1 - since / .5) * jit(f, 7) : 0;
        el.setAttribute('font-size', size); el.setAttribute('y', y.toFixed(1));
        tf(el, `translate(${800 + sh},${y}) scale(${pop.toFixed(3)}) translate(-800,${-y})`);
      });
    }
    if (shot === 'dark') {
      DE.apply(q, f); DS.apply(q, f);
      // it rises: the standing frame is uncovered from the sofa's back upward while she says "don't turn around to check"
      const k = span(q, T_TURN + .2, T_JUST - .25), e = k * k * (3 - 2 * k);
      tf(riseG, `translate(${(3 * Math.sin(q * 3) * (1 - e)).toFixed(2)},${(420 * (1 - e)).toFixed(1)})`);
      standG.setAttribute('opacity', span(q, T_JUST - .35, T_JUST - .05).toFixed(3));
    }
    if (shot === 'title') title.pose({ o: span(q, T_TITLE, T_TITLE + .8), k: span(q, T_TITLE, T_TITLE + 3) });
    cap(q, shot !== 'rule' && shot !== 'card' && shot !== 'title');
  });
}
