/* scene1.js — Move. Her own account: the rule, posted a minute ago, and a photo of her asleep taken from the end of
   the bed; "it was bait": Biscuit staring; "every night I froze, I gave it another piece": the frozen June, then her
   hand (the mug), her walk (the limp), her song (the pet camera), her face (the paw); she moves; she runs; the light
   switch, dead; the hallway too long, her legs wrong, the floor rising; the door chain under fingers furring orange;
   out into the corridor, down at floor level; orange paws; a woman in the doorway, barefoot, smiling: her; "Good
   girl."; carried back inside. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch05/narration.en.words.txt)
  const grp = () => mk('g', {}, p);
  const FONT = 'Helvetica Neue, Arial';

  // her account on the phone, in the dark: the post and the photo
  const phG = grp(), PH = paperCam(phG, 'phoneHand', { x: 800, y: 380, z: 1.1 });
  PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="scr5"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath></defs>`);
  mk('rect', { x: -400, y: -300, width: 2400, height: 1600, fill: '#3b4677', style: 'mix-blend-mode:multiply' }, PH.stage);
  const scr = mk('g', { 'clip-path': 'url(#scr5)' }, PH.stage);
  scr.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#ffffff"/>
    <circle cx="672" cy="104" r="20" fill="#c9b8dd"/><text x="702" y="100" font-family="${FONT}" font-weight="700" font-size="15" fill="#1b2026">june.k</text>
    <text x="702" y="120" font-family="${FONT}" font-size="12" fill="#68737e">1 min ago</text>
    <g data-t></g><g data-p><rect x="642" y="236" width="314" height="314" fill="#000"/><image href="../img/photos/june_asleep.webp" x="642" y="236" width="314" height="314"/></g>
    <text data-l x="652" y="578" font-family="${FONT}" font-weight="700" font-size="14" fill="#d0452f"></text>`;
  const pText = scr.querySelector('[data-t]'), pPhoto = scr.querySelector('[data-p]'), pLikes = scr.querySelector('[data-l]');
  const POST = "If your cat ever stands on two legs, don't move.";
  // the photo, full frame
  const fotoG = grp(), fz = mk('g', {}, fotoG);
  fz.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#05060a"/><image href="../img/photos/june_asleep.webp" x="350" y="0" width="900" height="900"/>`;
  fotoG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  // Biscuit staring (the hook's kitchen)
  const kG = grp(), KH = paperCam(kG, 'kitchen', { x: 1030, y: 400, z: 2.4 }), bStare = sprite(KH.stage, 'biscuit_stand_front_stare');
  // June frozen in the hall (Chapter 4), then moving
  const hallG = grp(), HJ = paperCam(hallG, 'hallwayJuneNight', { x: 800, y: 400, z: 1.15 }), juneFrozen = sprite(HJ.stage, 'june_frozen_front');
  // the pieces she gave it: her hand (the mug), her walk (the limp), her song (the pet camera), her face (the paw)
  const mugG = grp(), MG = paperCam(mugG, 'mug', { x: 640, y: 480, z: 1.6 });
  const limpG = grp(), BS = paperCam(limpG, 'bedSide', { x: 420, y: 760, z: 2.6 }), limp = sprite(BS.stage, 'biscuit_stand_side_limp');
  const songG = grp(), ST = paperCam(songG, 'stare', { x: 800, y: 560, z: 1.8 });
  const faceG = grp(), fv = mk('g', {}, faceG);
  fv.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#141a30"/>`;
  const paw = sprite(fv, 'june_face_paw_closeup');
  mk('rect', { x: -400, y: -300, width: 2400, height: 1600, fill: '#6f7fbf', opacity: .55, style: 'mix-blend-mode:multiply' }, fv);
  // the run: the impossibly long hall, June running, sinking lower
  const runG = grp(), HL = paperCam(runG, 'hallwayLong', { x: 800, y: 450, z: 1.0 }), run = sprite(runG, 'june_run_side');
  const swG = grp(), SW = paperCam(swG, 'lightSwitchHand', { x: 920, y: 450, z: 1.1 });
  const chainG = grp(), CH = paperCam(chainG, 'doorChainHands', { x: 800, y: 450, z: 1.05 });
  // the corridor at a cat's height; the paws; the woman in the doorway; her face; carried back in
  const corG = grp(), CO = paperCam(corG, 'corridorLow', { x: 800, y: 600, z: 1.1 }), catJune = sprite(CO.stage, 'cat_june_floor_scared');
  const pawsG = grp(), PW = paperCam(pawsG, 'povOrangePaws', { x: 800, y: 450, z: 1.0 });
  const doorG = grp(), DL = paperCam(doorG, 'thingJuneDoorwayLow', { x: 800, y: 470, z: 1.02 });
  const smileG = grp(), sv = mk('g', {}, smileG);
  sv.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#000"/><image href="../img/cast/thing_june_face_closeup_full.webp" x="402" y="-150" width="797" height="1200"/>`;
  smileG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  const carG = grp(), CI = paperCam(carG, 'carriedInside', { x: 800, y: 450, z: 1.0 });
  const flash = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#fff8ea', opacity: 0, 'pointer-events': 'none' }, p);
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // when things happen (aligned word times)
  const T_PIC = sc(7.25), T_LAST = sc(11.3), T_BAIT = sc(16.0), T_FROZE = sc(23.0), T_HAND = sc(26.3), T_WALK = sc(27.3), T_SONG = sc(28.3), T_FACE = sc(29.4),
    T_MOVED = sc(30.7), T_JOLT = sc(33.4), T_RUN = sc(34.55), T_SWITCH = sc(41.3), T_LONG = sc(43.45), T_WRONG = sc(45.5), T_CHAIN = sc(51.7), T_OPEN = sc(56.35),
    T_FLOOR = sc(59.4), T_PAWS = sc(65.35), T_ORANGE = sc(67.2), T_DOOR = sc(69.1), T_ME = sc(78.0), T_GOOD = sc(79.0), T_CARRY = sc(82.65), T_BLACK = sc(88.5);
  const SHOTS = [[0, 'phone'], [T_LAST, 'photo'], [T_BAIT, 'stare'], [T_FROZE, 'frozen'], [T_HAND, 'mug'], [T_WALK, 'limp'], [T_SONG, 'song'], [T_FACE, 'face'],
    [T_MOVED, 'frozen2'], [T_RUN, 'run'], [T_SWITCH, 'switch'], [T_LONG, 'run2'], [T_CHAIN, 'chain'], [T_OPEN, 'corridor'], [T_PAWS, 'paws'], [T_DOOR, 'door'],
    [T_ME, 'catjune'], [T_GOOD, 'smile'], [T_CARRY, 'carry'], [T_BLACK, 'black']];
  const groups = { phone: phG, photo: fotoG, stare: kG, frozen: hallG, frozen2: hallG, mug: mugG, limp: limpG, song: songG, face: faceG, run: runG, run2: runG,
    switch: swG, chain: chainG, corridor: corG, catjune: corG, paws: pawsG, door: doorG, smile: smileG, carry: carG };

  // cameras
  PH.to({ x: 800, y: 300, z: 1.5 }, .3, T_PIC).to({ x: 800, y: 400, z: 1.9 }, T_PIC, T_LAST - T_PIC);
  KH.to({ x: 1030, y: 395, z: 3.4 }, T_BAIT, T_FROZE - T_BAIT);
  HJ.cut({ x: 800, y: 380, z: 1.2 }, T_FROZE).to({ x: 800, y: 330, z: 1.6 }, T_FROZE, T_HAND - T_FROZE).cut({ x: 800, y: 330, z: 1.6 }, T_MOVED).to({ x: 800, y: 300, z: 1.9 }, T_MOVED, T_JOLT - T_MOVED);
  MG.to({ z: 1.9 }, T_HAND, 1); BS.to({ x: 380, z: 2.9 }, T_WALK, 1); ST.to({ z: 2.2 }, T_SONG, 1.1);
  HL.cut({ x: 800, y: 450, z: 1.0 }, T_RUN).to({ x: 800, y: 440, z: 1.9 }, T_RUN, T_SWITCH - T_RUN)
    .cut({ x: 800, y: 450, z: 1.3 }, T_LONG).to({ x: 800, y: 500, z: 1.05 }, T_LONG, T_WRONG - T_LONG).to({ x: 800, y: 640, z: 1.5 }, T_WRONG, T_CHAIN - T_WRONG);
  SW.to({ z: 1.25 }, T_SWITCH, 2).shake(T_SWITCH + .05, .25, 10);
  CH.to({ z: 1.3 }, T_CHAIN, T_OPEN - T_CHAIN).shake(T_CHAIN + 2.9, 1.5, 6);
  CO.cut({ x: 800, y: 540, z: 1.2 }, T_OPEN).to({ x: 800, y: 500, z: 1.1 }, T_OPEN + .8, 1).shake(T_OPEN + 1.1, .35, 14)
    .to({ x: 800, y: 300, z: 1.0 }, T_FLOOR, T_PAWS - T_FLOOR).cut({ x: 800, y: 520, z: 1.1 }, T_ME);
  PW.to({ z: 1.25 }, T_PAWS, 3.5);
  DL.to({ x: 800, y: 380, z: 1.5 }, T_DOOR + .5, T_ME - T_DOOR);
  CI.to({ x: 820, y: 420, z: 1.3 }, T_CARRY, T_BLACK - T_CARRY);

  // sound
  sfx('scene1', .2, 'buzz', .6); sfx('scene1', T_PIC, 'hit', .7); sfx('scene1', T_LAST, 'riser', .5);
  sfx('scene1', T_BAIT, 'hit', 1.0);
  for (let t = T_FROZE; t < T_MOVED; t += .7) sfx('scene1', t, 'heart', .8);
  for (const t of [T_HAND, T_WALK, T_SONG, T_FACE]) sfx('scene1', t, 'tick', .7);
  sfx('scene1', T_SONG + .05, 'humjune', .5);
  sfx('scene1', T_JOLT, 'hit', 1.0);
  for (let t = T_RUN + .1; t < T_SWITCH; t += .3) sfx('scene1', t, 'barestep', .7);
  sfx('scene1', T_SWITCH + .05, 'tick', 1.0); sfx('scene1', T_SWITCH + .4, 'tick', .8);
  for (let t = T_LONG; t < T_CHAIN; t += .24) sfx('scene1', t, 'barestep', .55);
  sfx('scene1', T_WRONG, 'riser', .8);
  sfx('scene1', T_CHAIN + .2, 'latch', .7); sfx('scene1', T_CHAIN + 2.9, 'latch', .9); sfx('scene1', T_CHAIN + 4.0, 'latch', 1.0);
  sfx('scene1', T_OPEN + .2, 'door', 1.0); sfx('scene1', T_OPEN + 1.1, 'thud', 1.0);
  sfx('scene1', T_ORANGE - .05, 'hit', 1.0);
  sfx('scene1', T_DOOR + .4, 'riser', .6); sfx('scene1', T_ME - .05, 'hit', .9);
  sfx('scene1', T_CARRY + .5, 'purr', .6); sfx('scene1', T_BLACK - .3, 'door', .7);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const g of Object.values(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black');
    flash.setAttribute('opacity', (Math.max(0, 1 - Math.abs(q - T_OPEN - .1) / .2) * .9).toFixed(3));
    const breathe = Math.sin(q * 2.2);

    if (shot === 'phone') {
      PH.apply(q, f);
      const n = Math.floor(POST.length * span(q, sc(3.1), sc(6.5))), ls = wrapText(POST.slice(0, n), 28);
      const key = ls.join('|'); if (pText._k !== key) { pText._k = key; pText.innerHTML = ls.map((l, i) => `<text x="652" y="${162 + i * 26}" font-family="${FONT}" font-weight="600" font-size="19" fill="#1b2026">${esc(l)}</text>`).join(''); }
      pPhoto.setAttribute('opacity', span(q, T_PIC - .1, T_PIC + .3).toFixed(2));
      const likes = `♥ ${Math.floor(12 + 3400 * span(q, sc(1), T_LAST))} shares`; if (pLikes._t !== likes) pLikes.textContent = pLikes._t = likes;
    }
    if (shot === 'photo') { const z = lerp(1.0, 1.45, span(q, T_LAST, T_BAIT)); tf(fz, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,-440)`); }
    if (shot === 'stare') { KH.apply(q, f); bStare.pose({ x: 1030, y: 514, h: 196 }); }
    if (shot === 'frozen' || shot === 'frozen2') {
      HJ.apply(q, f);
      const jolt = shot === 'frozen2' && q > T_JOLT ? 1 : 0;
      juneFrozen.pose({ x: 800 + 25 * jolt * jit(f, 4), y: 1040, h: 1000, sy: 1 + .004 * Math.sin(q * 6), rot: shot === 'frozen2' ? 2 * jolt * jit(f, 5) : .25 * jit(Math.floor(f / 2), 2) });
    }
    if (shot === 'mug') MG.apply(q, f);
    if (shot === 'limp') { BS.apply(q, f); const ph = (q - T_WALK) * 4, dip = Math.max(0, Math.sin(ph)) ** 2; limp.pose({ x: lerp(560, 300, span(q, T_WALK, T_SONG)), y: 840 + 7 * dip, h: 152, sx: -1, rot: 4 * dip - 1 }); }
    if (shot === 'song') ST.apply(q, f);
    if (shot === 'face') { paw.pose({ x: 800, y: 1300, h: 1400 }); tf(fv, `translate(800,450) scale(${lerp(1, 1.15, span(q, T_FACE, T_MOVED)).toFixed(4)}) translate(-800,-450)`); }
    if (shot === 'run' || shot === 'run2') {
      HL.apply(q, f);
      const ph = q * 9, low = shot === 'run2' ? span(q, T_WRONG, T_CHAIN - .4) : 0;   // her legs go wrong: she sinks lower and smaller as she runs
      run.pose({ x: 520 + 30 * Math.sin(q * 1.7), y: 1000 - 22 * Math.abs(Math.sin(ph)) + 120 * low, h: 880 * (1 - .45 * low), sy: 1 - .25 * low, rot: 3 * Math.sin(ph) });
    }
    if (shot === 'switch') SW.apply(q, f);
    if (shot === 'chain') CH.apply(q, f);
    if (shot === 'corridor' || shot === 'catjune') {
      CO.apply(q, f); vis(catJune.g, shot === 'catjune');
      catJune.pose({ x: 800, y: 900, h: 560, sy: 1 + .02 * Math.sin(q * 9) });
    }
    if (shot === 'paws') PW.apply(q, f);
    if (shot === 'door') DL.apply(q, f);
    if (shot === 'smile') { const z = lerp(1.0, 1.3, span(q, T_GOOD, T_CARRY)); tf(sv, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,-420)`); }
    if (shot === 'carry') CI.apply(q, f);
    cap(q);
  });
}
