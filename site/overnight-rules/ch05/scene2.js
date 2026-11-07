/* scene2.js — Rule Six, broken. Aisle four from behind Dani, running on and on into the dark: far down it, the other
   Dani with her back turned; "Hello?"; "You came. Marcus said you would." (red); Dani, close: "Who are you?"; "I'm the
   one who works the overnight shift."; she turns — Dani's face, black eyes, the smile too wide: "Thanks for covering
   for me."; she walks past Dani towards the counter; Dani runs after her, and the counter slides away down the aisle
   however fast she runs, the other Dani behind it; black. */
'use strict';
const PRE2 = .3;
// aisle four in perspective (as in chapter three): eye at VP, focal F; x across (±W the shelf faces), y down, z away
const AV = { VP: [816, 500], F: 560, W: .923, D: .28, FLOOR: .441, TOP: -.64, CEIL: -.893 };
const BOARDS = [-.64, -.47, -.3, -.13, .04, .21, .38];
const P3 = (x, y, z) => `${(AV.VP[0] + AV.F * x / z).toFixed(1)},${(AV.VP[1] + AV.F * y / z).toFixed(1)}`;
const Q4 = (a, b, c, d, fill, more = '') => `<path d="M${a} L${b} L${c} L${d} Z" fill="${fill}"${more}/>`;
// a figure standing in the aisle at depth z, across xw: where its feet are and its scale
const inAisle = (xw, z) => ({ x: AV.VP[0] + AV.F * xw / z, gy: AV.VP[1] + AV.F * AV.FLOOR / z, s: .837 / z });
// the aisle from z0 to zF (floor and ceiling from fz0), the posts, tile lines and lights shifted by `run` (moving past)
function aisle5(z0, zF, fz0 = 1, run = 0) {
  let s = '';
  const from = (a, step) => a + ((((-run) % step) + step) % step);
  s += Q4(P3(-AV.W, AV.FLOOR, fz0), P3(AV.W, AV.FLOOR, fz0), P3(AV.W, AV.FLOOR, zF), P3(-AV.W, AV.FLOOR, zF), '#c3bfb5');
  for (let z = from(fz0, .25); z < zF; z += .25) s += `<path d="M${P3(-AV.W, AV.FLOOR, z)} L${P3(AV.W, AV.FLOOR, z)}" stroke="#a9a59b" stroke-width="${(3 / z).toFixed(2)}"/>`;
  for (const x of [-.6, -.3, 0, .3, .6]) s += `<path d="M${P3(x, AV.FLOOR, fz0)} L${P3(x, AV.FLOOR, zF)}" stroke="#a9a59b" stroke-width="2"/>`;
  s += Q4(P3(-AV.W, AV.CEIL, fz0), P3(AV.W, AV.CEIL, fz0), P3(AV.W, AV.CEIL, zF), P3(-AV.W, AV.CEIL, zF), '#97a087');
  for (let z = from(fz0 + .3, .7); z < zF - .2; z += .7) s += Q4(P3(-.35, AV.CEIL, z), P3(.35, AV.CEIL, z), P3(.35, AV.CEIL, z + .22), P3(-.35, AV.CEIL, z + .22), '#f4f1e0');
  for (const sd of [-1, 1]) s += Q4(P3(sd * AV.W, AV.CEIL, fz0), P3(sd * AV.W, AV.CEIL, zF), P3(sd * AV.W, AV.TOP, zF), P3(sd * AV.W, AV.TOP, fz0), '#a6b297');
  for (const sd of [-1, 1]) {
    const face = sd * AV.W, back = sd * (AV.W + AV.D);
    s += Q4(P3(back, AV.TOP, z0), P3(back, AV.TOP, zF), P3(back, AV.FLOOR, zF), P3(back, AV.FLOOR, z0), '#ddd5c4');
    s += Q4(P3(back, AV.TOP, z0), P3(face, AV.TOP, z0), P3(face, AV.TOP, zF), P3(back, AV.TOP, zF), '#f1ece0');
    for (const y of BOARDS) {
      s += Q4(P3(back, y, z0), P3(face, y, z0), P3(face, y, zF), P3(back, y, zF), y < 0 ? '#cfc6b3' : '#f4efe4');
      s += Q4(P3(face, y, z0), P3(face, y, zF), P3(face, y + .03, zF), P3(face, y + .03, z0), '#f7f3ea');
      s += Q4(P3(face, y + .03, z0), P3(face, y + .03, zF), P3(face, y + .036, zF), P3(face, y + .036, z0), '#b9b0a0');
    }
    for (let z = from(z0, .5); z < zF; z += .5) s += Q4(P3(face, AV.TOP, z), P3(face, AV.TOP, z + .03), P3(face, AV.FLOOR, z + .03), P3(face, AV.FLOOR, z), '#efe8da');
  }
  return s;
}

function scene2(p, D, m) {
  const sc = t => PRE2 + t;
  // the deep aisle: drawn whole, running on into the dark (a far wall of black and a fog over the end)
  const deep = mk('g', {}, p), DC = paperCam(deep, 'checkout', { x: 816, y: 520, z: 1 });
  for (const n of ['counter', 'shelfL', 'shelfR']) vis(DC.layer(n), false);
  const dBg = DC.layer('bg');
  mk('rect', { x: -400, y: -300, width: 2400, height: 1500, fill: '#1b201e' }, dBg);
  const dAisle = mk('g', {}, dBg); dAisle.innerHTML = aisle5(.42, 7, .42) + Q4(P3(-1.3, AV.CEIL, 7), P3(1.3, AV.CEIL, 7), P3(1.3, AV.FLOOR, 7), P3(-1.3, AV.FLOOR, 7), '#05080a');
  dBg.insertAdjacentHTML('beforeend', `<defs><radialGradient id="fog5" cx="${AV.VP[0]}" cy="${AV.VP[1]}" r="560" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#05080a" stop-opacity="1"/><stop offset=".22" stop-color="#05080a" stop-opacity=".92"/><stop offset=".5" stop-color="#05080a" stop-opacity=".45"/><stop offset="1" stop-color="#05080a" stop-opacity="0"/></radialGradient></defs>
    <rect x="-400" y="-300" width="2400" height="1500" fill="url(#fog5)"/>`);
  const other = daniPuppet(DC.stage, { other: true }), dani = daniPuppet(DC.stage), otherC = daniPuppet(DC.stage, { other: true });
  nightGrade(deep, 1);
  // the run: the checkout view, its aisle stretching, the counter (the painted far end) sliding away, her behind it
  const run = mk('g', {}, p), R = checkout(run, { x: 816, y: 520, z: 1.25 }), rBg = R.cam.layer('bg');
  const rAisle = mk('g', {}, rBg), farG = mk('g', {}, rBg), uid = 'far5';
  farG.innerHTML = `<defs><clipPath id="${uid}"><rect x="299" y="-40" width="1034" height="787"/></clipPath></defs>
    <image href="../img/sets/checkout/bg.webp" x="-60" y="-34" width="1720" height="968" preserveAspectRatio="none" clip-path="url(#${uid})"/>`;
  const farCounter = mk('g', {}, farG), otherFar = daniPuppet(farCounter, { other: true });
  farG.insertAdjacentHTML('beforeend', `<image href="../img/sets/checkout/counter.webp" x="-60" y="-34" width="1720" height="968" preserveAspectRatio="none" clip-path="url(#${uid})"/>`);
  const runner = daniPuppet(R.cam.stage);
  nightGrade(run, 1);
  const black = mk('rect', { x: -10, y: -10, width: 1620, height: 920, fill: '#000', opacity: 0 }, p);
  const cap = hsCaptions(p, 'scene2', PRE2, { red: ['od1', 'od2', 'od3'] });

  const T_HELLO = sc(2.35), T_OD1 = sc(4.7), T_WHO = sc(8.75), T_OD2 = sc(11.5), T_TURN = sc(15.0), T_FACE = sc(16.2), T_PAST = sc(18.6), T_RAN = sc(19.5),
    T_END = sc(27.3), T_BLACK = sc(28.2);
  const SHOTS = [[0, 'deep'], [T_WHO, 'who'], [T_OD2, 'deep'], [T_FACE, 'face'], [T_PAST, 'deep'], [T_RAN, 'run']];
  for (let i = 0; i < 4; i++) sfx('scene2', .4 + i * .55, 'step1', .32);
  for (let t = T_RAN + .1; t < T_END; t += .27) sfx('scene2', t, 'step1', .45);
  sfx('scene2', T_TURN + .3, 'boom', .45);
  const O = inAisle(.12, 2.3);
  DC.cut({ x: 816, y: 560, z: 1.05 }, 0).to({ x: 830, y: 560, z: 1.12 }, 0, T_HELLO)
    .to({ x: O.x, y: O.gy - 150 * O.s, z: 1.7 }, T_OD1, 3.5)
    .cut({ x: O.x, y: O.gy - 140 * O.s, z: 1.9 }, T_OD2).to({ z: 2.3 }, T_OD2, 3.4)
    .cut({ x: 816, y: 420, z: 1.5 }, T_FACE).to({ z: 1.7 }, T_FACE, 2.4)
    .cut({ x: 830, y: 540, z: 1.1 }, T_PAST);
  R.cam.cut({ x: 816, y: 440, z: 1.9 }, T_WHO).to({ z: 2.05 }, T_WHO, 2.7).cut({ x: 816, y: 560, z: 1.15 }, T_RAN).to({ y: 540, z: 1.3 }, T_RAN, 8);

  let lastZ = -1, lastRun = -1;
  stopClock(D, (q, f) => {
    const shot = shotAt(q, SHOTS);
    vis(deep, shot === 'deep' || shot === 'face'); vis(run, shot === 'who' || shot === 'run');
    black.setAttribute('opacity', span(q, T_BLACK, T_BLACK + 1.1).toFixed(3));
    vis(otherC.g, shot === 'face'); vis(dani.g, shot === 'deep'); vis(other.g, shot === 'deep');
    if (shot === 'face') {   // her face, close: Dani's face, the eyes black, the smile too wide
      DC.apply(q, f);
      otherC.pose({ x: 816, y: hipOn(1080, 1.9), s: 1.9, head: 'F', turn: 0, rua: 4, lua: -4, look: 0, brow: 0, mouth: 'X', nod: -3 + 2 * span(q, T_FACE, T_FACE + 2.4) }, f);
      vis(otherC.g, true);
    }
    if (shot === 'deep') {
      DC.apply(q, f);
      // Dani walking in from behind the camera, then standing; the other far down the aisle, her back to us, then turning
      const k = span(q, .3, T_HELLO - .2), dz = .55 + .22 * k, Dn = inAisle(-.14, dz), mv = k > 0 && k < 1, step = mv ? Math.sin((q - .3) / .55 * Math.PI) : 0;
      dani.pose({ x: Dn.x, y: hipOn(Dn.gy, Dn.s) - (mv ? 5 * Math.abs(step) * Dn.s : 0), s: Dn.s, head: 'F', turn: 0, back: true, stepF: step, rua: 4, lua: -4, mouth: 'A' }, f);
      // the other: still, then the turn (a card flipped), then walking past Dani towards us, towards the counter
      const w = span(q, T_PAST, T_RAN + .2), oz = 2.3 - 1.95 * w, Ox = inAisle(.12 + .3 * w, oz), omv = w > 0 && w < 1, ostep = omv ? Math.sin((q - T_PAST) / .5 * Math.PI) : 0;
      const turned = q > T_TURN + .25, flip = q > T_TURN && q < T_TURN + .5 ? Math.abs(Math.cos((q - T_TURN) / .5 * Math.PI)) : 1;
      tf(other.g, `translate(${Ox.x.toFixed(1)},0) scale(${Math.max(.12, flip).toFixed(2)},1) translate(${(-Ox.x).toFixed(1)},0)`);
      other.pose({ x: Ox.x, y: hipOn(Ox.gy, Ox.s) - (omv ? 5 * Math.abs(ostep) * Ox.s : 0), s: Ox.s, head: 'F', turn: 0, back: !turned, stepF: ostep,
        rua: 4, lua: -4, look: 0, brow: 0, mouth: 'X', nod: turned ? -4 : 0 }, f);
      // whoever is nearer is drawn in front
      if ((oz < dz) !== (other.g.nextSibling === null)) DC.stage.appendChild(oz < dz ? other.g : dani.g);
    }
    if (shot === 'who' || shot === 'run') {
      R.cam.apply(q, f);
      // the aisle: short (the counter just there) while she asks, then stretching as she runs, the posts streaming past
      const u = shot === 'run' ? span(q, T_RAN, T_END) : 0, zF = shot === 'run' ? 1.5 + 5 * (1 - (1 - u) ** 1.6) : 1.25;
      const r = shot === 'run' ? (q - T_RAN) * 1.6 : 0;
      if (Math.abs(zF - lastZ) > 1e-4 || Math.abs(r - lastRun) > 1e-4) { rAisle.innerHTML = aisle5(.3, zF, 1, r); lastZ = zF; lastRun = r; }
      tf(farG, `translate(${AV.VP[0]},${AV.VP[1]}) scale(${(1 / zF).toFixed(4)}) translate(${-AV.VP[0]},${-AV.VP[1]})`);
      vis(R.cam.layer('counter'), false);
      otherFar.pose({ x: CHK.behind[0] - 40, y: hipOn(CHK.behind[1], .7), s: .7, head: 'F', turn: 0, rua: 4, lua: -4, look: 0, mouth: 'X' }, f);
      vis(otherFar.g, shot === 'run');
      if (shot === 'who') {   // Dani, close, facing us, the counter behind her
        runner.pose({ x: 816, y: hipOn(1060, 1.9), s: 1.9, head: 'F', turn: 0, rua: 4, lua: -4, look: .1, brow: .9,
          mouth: worried(lips(q, 'scene2', PRE2, 'd29', 'd30')), shut: (q % 3.2) < .12 }, f);
      } else {                // running away from us, towards the counter, and never getting nearer
        const N = inAisle(-.05, .78), ph = (q - T_RAN) / .27, step = Math.sin(ph * Math.PI);
        runner.pose({ x: N.x, y: hipOn(N.gy, N.s) - 9 * Math.abs(step) * N.s, s: N.s, head: 'F', turn: 0, back: true, stepF: step,
          rua: 4 + 18 * step, lua: -4 + 18 * step, rfa: 0, lfa: 0, mouth: 'A' }, f);
      }
    }
    cap(q);
  });
}
