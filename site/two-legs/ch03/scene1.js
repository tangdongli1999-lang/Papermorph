/* scene1.js — Day Three. June on the phone to the vet in the morning kitchen; Biscuit asleep on the sofa, normal;
   Clara's page on the phone; her photos before (messy, laughing) and after (perfect, the same smile, never blinking);
   thin Mochi in the corner of each, staring at the camera; the deleted comment typing out and cutting off; June at her
   office desk, the phone buzzing; the pet-camera alert; the living room on the camera: Biscuit at her laptop; his paws
   on the keys; the screen: her name, messy and small, then capitals, neater and neater; June's face. */
'use strict';
const PRE1 = .3;

function scene1(p, D, m) {
  const sc = t => PRE1 + t;   // a time in the joined scene clip (content/two-legs/ch03/narration.en.words.txt)
  const grp = () => mk('g', {}, p);
  const FONT = 'Helvetica Neue, Arial';

  // the morning kitchen: June on the phone to the vet (June's height in the kitchen sets: Biscuit's 196 / 0.306)
  const kitG = grp(), KD = paperCam(kitG, 'kitchenDay', { x: 700, y: 520, z: 1.25 }), juneCall = sprite(KD.stage, 'june_phone_call');
  // the living room by day: Biscuit asleep on the sofa (sofa 1.7 m = 550 px, so he stands 160 here)
  const livG = grp(), LV = paperCam(livG, 'living', { x: 500, y: 520, z: 1.3 }), curled = sprite(LV.stage, 'biscuit_curled_sleeping');
  // the phone: Clara's page; then the deleted comment; then the alert (one screen, three faces)
  const phG = grp(), PH = paperCam(phG, 'phoneHand', { x: 800, y: 380, z: 1.05 });
  PH.stage.insertAdjacentHTML('beforeend', `<defs><clipPath id="scr3"><rect x="632" y="59" width="334" height="639" rx="34"/></clipPath>
    <clipPath id="avC"><circle cx="0" cy="0" r="34"/></clipPath></defs>`);
  const scr = mk('g', { 'clip-path': 'url(#scr3)' }, PH.stage);
  const page = mk('g', {}, scr), comment = mk('g', {}, scr), alertG = mk('g', {}, scr);
  const grid = ['before_1', 'before_2', 'after_1', 'after_2', 'after_3', 'before_1', 'after_1', 'after_3', 'after_2'];
  page.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#ffffff"/>
    <g transform="translate(690,140)"><g clip-path="url(#avC)"><image href="../img/photos/clara_photo_before_1.webp" x="-60" y="-50" width="120" height="120"/></g><circle r="34" fill="none" stroke="#e0a64a" stroke-width="3"/></g>
    <text x="740" y="132" font-family="${FONT}" font-weight="700" font-size="17" fill="#1b2026">clara.and.mochi</text>
    <text x="740" y="154" font-family="${FONT}" font-size="13" fill="#68737e">me + mochi 🐾 · 212 posts</text>
    <rect x="642" y="188" width="314" height="30" rx="8" fill="#eef1f4"/><text x="799" y="208" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="13" fill="#1b2026">Follow</text>
    ${grid.map((n, i) => `<image href="../img/photos/clara_photo_${n}.webp" x="${633 + (i % 3) * 112}" y="${232 + Math.floor(i / 3) * 112}" width="110" height="110"/>`).join('')}`;
  comment.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#ffffff"/>
    <text x="652" y="120" font-family="${FONT}" font-weight="700" font-size="15" fill="#68737e">Comments</text>
    <rect x="644" y="140" width="310" height="62" rx="10" fill="#f4f5f7"/><circle cx="668" cy="162" r="11" fill="#c9d3e8"/>
    <text x="686" y="166" font-family="${FONT}" font-weight="700" font-size="13" fill="#39424c">catmum_lou</text><text x="686" y="188" font-family="${FONT}" font-size="14" fill="#1b2026">Mine did it too.</text>
    <rect x="644" y="214" width="310" height="200" rx="10" fill="#eceef1" stroke="#c6ccd3" stroke-dasharray="5 4"/>
    <text x="660" y="242" font-family="${FONT}" font-style="italic" font-size="14" fill="#8b949e">This comment was deleted</text>
    <g data-l></g>`;
  const cLines = comment.querySelector('[data-l]');
  alertG.innerHTML = `<rect x="620" y="50" width="360" height="660" fill="#2b3a52"/><rect x="620" y="50" width="360" height="660" fill="url(#vignette)"/>
    <text x="799" y="170" text-anchor="middle" font-family="${FONT}" font-weight="200" font-size="66" fill="#f1f4f8">2:04</text>
    <text x="799" y="200" text-anchor="middle" font-family="${FONT}" font-size="15" fill="#c9d3e0">Wednesday</text>
    <g data-b><rect x="646" y="236" width="306" height="84" rx="16" fill="#f4f6f8" opacity=".96"/>
      <rect x="660" y="252" width="22" height="22" rx="6" fill="#3b82f6"/><text x="692" y="268" font-family="${FONT}" font-weight="700" font-size="13" fill="#39424c">PawCam · now</text>
      <text x="660" y="294" font-family="${FONT}" font-weight="700" font-size="15" fill="#1b2026">Motion detected</text>
      <text x="660" y="312" font-family="${FONT}" font-size="14" fill="#39424c">Living room</text></g>`;
  const banner = alertG.querySelector('[data-b]');
  // the photos, full frame: a sharp square over a blurred copy of itself
  const phoG = grp(), pz = mk('g', {}, phoG);
  phoG.insertAdjacentHTML('afterbegin', `<defs><filter id="phBlur"><feGaussianBlur stdDeviation="28"/></filter></defs>`);
  const photo = n => { const g = mk('g', {}, pz); g.innerHTML = `<image href="../img/photos/clara_photo_${n}-blur.webp" x="-200" y="-350" width="2000" height="2000" opacity=".75"/>
      <rect x="-200" y="-350" width="2000" height="2000" fill="#000" opacity=".35"/><rect x="342" y="-8" width="916" height="916" fill="#fbfaf6"/><image href="../img/photos/clara_photo_${n}.webp" x="350" y="0" width="900" height="900"/>`; return g; };
  const PHOTOS = { b1: photo('before_1'), b2: photo('before_2'), a1: photo('after_1'), a2: photo('after_2'), a3: photo('after_3') };
  phoG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/>');
  // thin Mochi, alone, close
  const moG = grp(), mv = mk('g', {}, moG);
  mv.innerHTML = `<rect x="-400" y="-300" width="2400" height="1600" fill="#e9e1cf"/>`;
  const mochi = sprite(mv, 'mochi_thin_stare');
  moG.insertAdjacentHTML('beforeend', '<rect width="1600" height="900" fill="url(#vignette)"/><rect width="1600" height="900" fill="url(#vignette)"/>');
  // the office: June behind her desk (the desk's front is the set's own front layer)
  const ofG = grp(), OF = paperCam(ofG, 'office', { x: 800, y: 480, z: 1.1 }, { after: 'bg' }), juneDesk = sprite(OF.stage, 'june_desk_sitting');
  const glow = mk('ellipse', { cx: 855, cy: 610, rx: 70, ry: 40, fill: '#cfe3ff', opacity: 0 }, OF.stage);
  // the living room on the pet camera: Biscuit at her laptop (the finished picture), then his paws
  const lcG = grp(), LC = paperCam(lcG, 'livingCam', { x: 800, y: 450, z: 1 }), ov = camOverlay(lcG, 'LIVING ROOM');
  const pwG = grp(), PW = paperCam(pwG, 'paws', { x: 800, y: 450, z: 1.05 });
  // the laptop screen: her name, typed
  const lpG = grp(), LP = paperCam(lpG, 'laptop', { x: 800, y: 400, z: 1.0 }), typed = mk('g', { 'font-family': "'Courier New', monospace", 'font-weight': 700 }, LP.stage);
  const caret = mk('rect', { width: 6, height: 54, fill: '#1b2026' }, LP.stage);
  // June's face at her desk, lit by the phone
  const faceG = grp(), OF2 = paperCam(faceG, 'office', { x: 800, y: 420, z: 1.6 }, { after: 'bg' });
  OF2.soft(0, 'all'); OF2.show('front', false);
  const shock = sprite(faceG, 'june_desk_shock_closeup');
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000' }, p);
  const cap = legCaptions(p, 'scene1', PRE1);

  // the typed words: june (small, messy) … June … JUNE (neat), each with its time
  const WORDS = [];
  const add = (w, n, t0, t1) => { for (let i = 0; i < n; i++) WORDS.push({ w, t: lerp(t0, t1, i / n) }); };
  add('june', 7, sc(56.15), sc(59.25)); add('June', 6, sc(59.27), sc(60.8)); add('JUNE', 14, sc(60.85), sc(65.0));
  let x = 0, y = 0; const els = WORDS.map((o, i) => {
    const neat = i / (WORDS.length - 1), size = o.w === 'june' ? 46 : o.w === 'June' ? 54 : 62, w = size * .62 * 4 + 26;
    if (x + w > 1080) { x = 0; y += 84; }
    const mess = (1 - neat) ** 1.5, rot = mess * 14 * jit(i, 7), dy = mess * 16 * jit(i, 8);
    const e = mk('text', { x: 260 + x, y: 160 + y + dy, 'font-size': size, fill: '#1b2026', transform: `rotate(${rot.toFixed(1)} ${260 + x} ${160 + y})`, 'letter-spacing': (mess * 8 * jit(i, 9)).toFixed(1) }, typed);
    e.textContent = o.w; o.el = e; o.x = 260 + x + w - 20; o.y = 160 + y; x += w; return e;
  });

  // when things happen (aligned word times)
  const T_TEN = sc(4.3), T_FOUND = sc(6.9), T_BEFORE = sc(13.55), T_B2 = sc(16.2), T_AFTER = sc(19.05), T_A2 = sc(21.5), T_A3 = sc(22.4), T_A1b = sc(22.9),
    T_BLINK = sc(23.75), T_CORNER = sc(26.1), T_THIN = sc(29.0), T_STARE = sc(30.3), T_MOCHI = sc(32.1), T_DEL = sc(34.15), T_TYPE = sc(38.65), T_CUT = sc(42.7),
    T_DESK = sc(45.1), T_BUZZ = sc(47.4), T_ALERT = sc(48.55), T_CAM = sc(51.6), T_PAWS = sc(54.85), T_SCREEN = sc(56.05), T_FACE = sc(63.7), T_BLACK = sc(66.6);
  const SHOTS = [[0, 'call'], [T_TEN, 'sleep'], [T_FOUND, 'page'], [T_BEFORE, 'b1'], [T_B2, 'b2'], [T_AFTER, 'a1'], [T_A2, 'a2'], [T_A3, 'a3'], [T_A1b, 'eyes'],
    [T_CORNER, 'm1'], [T_THIN, 'm2'], [T_STARE, 'm3'], [T_MOCHI, 'mochi'], [T_DEL, 'comment'], [T_DESK, 'desk'], [T_ALERT, 'alert'], [T_CAM, 'cam'], [T_PAWS, 'paws'],
    [T_SCREEN, 'screen'], [T_FACE, 'face'], [T_BLACK, 'black']];
  const groups = { call: kitG, sleep: livG, page: phG, comment: phG, alert: phG, b1: phoG, b2: phoG, a1: phoG, a2: phoG, a3: phoG, eyes: phoG, m1: phoG, m2: phoG, m3: phoG,
    mochi: moG, desk: ofG, cam: lcG, paws: pwG, screen: lpG, face: faceG };
  // which photo, and the point of it (photo px, 0…1024) at the frame's centre with what zoom, from…to over the shot
  const PV = { b1: ['b1', [512, 512, 1.0], [512, 470, 1.12]], b2: ['b2', [512, 512, 1.0], [470, 470, 1.12]], a1: ['a1', [512, 512, 1.0], [512, 480, 1.08]],
    a2: ['a2', [512, 512, 1.04], [512, 480, 1.1]], a3: ['a3', [512, 512, 1.06], [512, 470, 1.12]], eyes: ['a1', [512, 300, 2.0], [512, 268, 3.3]],
    m1: ['a1', [760, 800, 1.6], [920, 900, 2.7]], m2: ['a2', [760, 620, 1.7], [850, 650, 2.8]], m3: ['a3', [800, 760, 1.6], [880, 770, 2.3]] };

  // cameras
  KD.to({ x: 640, y: 520, z: 1.4 }, 0, T_TEN);
  LV.to({ x: 380, y: 560, z: 1.9 }, T_TEN, T_FOUND - T_TEN);
  PH.cut({ x: 800, y: 380, z: 1.05 }, T_FOUND).to({ x: 800, y: 330, z: 1.45 }, T_FOUND + .3, 6)
    .cut({ x: 800, y: 300, z: 1.4 }, T_DEL).to({ x: 800, y: 280, z: 1.8 }, T_DEL + 1, 9).cut({ x: 800, y: 300, z: 1.5 }, T_ALERT).to({ z: 1.75 }, T_ALERT, 3);
  OF.to({ x: 830, y: 470, z: 1.3 }, T_DESK, T_ALERT - T_DESK);
  LC.to({ x: 980, y: 520, z: 1.7 }, T_CAM + .4, T_PAWS - T_CAM);
  PW.to({ z: 1.2 }, T_PAWS, 1.2);
  LP.to({ x: 800, y: 330, z: 1.12 }, T_SCREEN, T_FACE - T_SCREEN);
  OF2.to({ z: 1.8 }, T_FACE, 3);

  // sound
  sfx('scene1', T_FOUND + .2, 'swipe', .6);
  sfx('scene1', T_AFTER, 'hit', .8); sfx('scene1', T_A2, 'tick', .5); sfx('scene1', T_A3, 'tick', .5); sfx('scene1', T_A1b, 'tick', .5);
  sfx('scene1', T_BLINK, 'riser', .5);
  for (let t = T_CORNER; t < T_DEL; t += .9) sfx('scene1', t, 'heart', .7);
  sfx('scene1', T_MOCHI, 'hit', .6);
  for (let t = T_TYPE; t < T_CUT - .2; t += .55) sfx('scene1', t, 'tick', .25);
  sfx('scene1', T_CUT - .2, 'glitch', 1.0);
  sfx('scene1', T_BUZZ, 'buzz', .9); sfx('scene1', T_ALERT + .2, 'buzz', .6);
  sfx('scene1', T_CAM + 1.0, 'hit', .7);
  sfx('scene1', T_PAWS, 'keys', .9); sfx('scene1', T_SCREEN + .1, 'keys', .8); sfx('scene1', T_SCREEN + 3.0, 'keys', .8); sfx('scene1', T_SCREEN + 5.9, 'keys', .9);
  sfx('scene1', T_FACE + .05, 'hit', .9);

  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    for (const g of Object.values(groups)) vis(g, false);
    if (groups[shot]) vis(groups[shot], true);
    vis(black, shot === 'black');
    const breathe = Math.sin(q * 2.2);

    if (shot === 'call') { KD.apply(q, f); juneCall.pose({ x: 600, y: 900, h: 640, sy: 1 + .004 * breathe, rot: .6 * Math.sin(q * 1.3) }); }
    if (shot === 'sleep') { LV.apply(q, f); curled.pose({ x: 360, y: 602, h: catH(160, 'curl'), sy: 1 + .03 * Math.max(0, Math.sin(q * 3.4)) }); }
    if (phG._v === 'inherit') {
      PH.apply(q, f); vis(page, shot === 'page'); vis(comment, shot === 'comment'); vis(alertG, shot === 'alert');
      if (shot === 'page') tf(page, `translate(0,${(-60 * span(q, T_FOUND + 3.5, T_BEFORE - .3)).toFixed(1)})`);
      if (shot === 'comment') {   // the deleted comment's preview, typing out letter by letter, then cut
        const TEXT = "Don't listen to the rule. It's not checking if you're awake. It's learning wh—";
        const n = Math.floor(TEXT.length * span(q, T_TYPE, T_CUT - .25)), shown = TEXT.slice(0, n), ls = wrapText(shown, 34);
        const key = shown + (q > T_CUT - .2 ? '|' : '');
        if (cLines._k !== key) {
          cLines._k = key;
          cLines.innerHTML = ls.map((l, i) => `<text x="660" y="${276 + i * 24}" font-family="${FONT}" font-size="16" fill="#5a636d">${esc(l)}</text>`).join('') +
            (q > T_CUT - .2 ? `<rect x="644" y="214" width="310" height="200" rx="10" fill="#eceef1"/><text x="660" y="242" font-family="${FONT}" font-style="italic" font-size="14" fill="#8b949e">This comment was deleted</text>` : '');
        }
        const g = q > T_CUT - .25 && q < T_CUT + .45;   // the glitch
        tf(comment, g ? `translate(${(14 * jit(f, 21)).toFixed(1)},${(6 * jit(f, 22)).toFixed(1)})` : '');
      }
      if (shot === 'alert') tf(banner, `translate(0,${(-120 * (1 - span(q, T_ALERT, T_ALERT + .35))).toFixed(1)})`);
    }
    if (PV[shot]) {
      const [n, a, b] = PV[shot], t0 = SHOTS.find(s => s[1] === shot)[0], t1 = SHOTS[SHOTS.findIndex(s => s[1] === shot) + 1][0], u = span(q, t0, t1);
      for (const [k, g] of Object.entries(PHOTOS)) vis(g, k === n);
      const px = lerp(a[0], b[0], u), py = lerp(a[1], b[1], u), z = lerp(a[2], b[2], u);
      tf(pz, `translate(800,450) scale(${z.toFixed(4)}) translate(${(-(350 + px * 900 / 1024)).toFixed(1)},${(-(py * 900 / 1024)).toFixed(1)})`);
    }
    if (shot === 'mochi') {
      const z = lerp(1, 1.3, span(q, T_MOCHI, T_DEL));
      mochi.pose({ x: 800, y: 960, h: 900, sy: 1 + .006 * Math.sin(q * 4) });
      tf(mv, `translate(800,450) scale(${z.toFixed(4)}) translate(-800,-330)`);
    }
    if (shot === 'desk') {
      OF.apply(q, f);
      juneDesk.pose({ x: 855, y: 760, h: 560, sy: 1 + .004 * breathe, rot: q > T_BUZZ ? 1.2 * span(q, T_BUZZ, T_BUZZ + .3) : 0 });
      glow.setAttribute('opacity', (q > T_BUZZ ? .55 * (.6 + .4 * Math.sin(q * 20)) : 0).toFixed(2));
      if (q > T_BUZZ && q < T_BUZZ + .7) OF.apply(q, f, q);
    }
    if (shot === 'cam') { LC.apply(q, f); ov.pose({ t: clockAdd('14:02:31', q - T_CAM), rec: Math.floor(q * 1.2) % 2 === 0, level: .25, q }); }
    if (shot === 'paws') { PW.apply(q, f); tf(PW.root, `translate(${(3 * jit(f, 31)).toFixed(1)},${(3 * jit(f, 32)).toFixed(1)})`); }
    if (shot === 'screen') {
      LP.apply(q, f);
      let last = null; WORDS.forEach(o => { const on = q >= o.t; vis(o.el, on); if (on) last = o; });
      vis(caret, Math.floor(q * 2.5) % 2 === 0);
      if (last) tf(caret, `translate(${last.x + 8},${last.y - 46})`); else tf(caret, 'translate(256,114)');
    }
    if (shot === 'face') { OF2.apply(q, f); shock.pose({ x: 800, y: 1010 + 30 * (1 - span(q, T_FACE, T_FACE + .4)), h: 1050, sy: 1 + .006 * Math.sin(q * 4.5), rot: .3 * jit(Math.floor(f / 2), 6) }); }
    cap(q);
  });
}
