/* film.js: plays a shot list (film/<chapter>.json) one frame at a time, for rendering.
   Shot: { t0, t1, room: 'rooms/x.json' | {plate,...}, who: [overrides by index], cam: {a, b, ease, shake}, events: [...], overlays: [...], filter, fade }
   cam keys: aim [u,v] (screen point of the painting to centre), zoom (1 = the painting's framing), dx, dz (metres, dolly)
   event keys (t = absolute film time): i (actor index) + play/opts | card | mood/intensity | face | view/facing | runTo [u,v] | flinch | plate (swap the painting) | tint | lip off */
(function () {
  const W = 1920, H = 1080, FPS = 30;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(W, H); r.outputEncoding = THREE.sRGBEncoding;
  document.getElementById('stage').appendChild(r.domElement);
  const loader = new THREE.TextureLoader(), texP = u => new Promise((res, rej) => loader.load(u, t => { t.encoding = THREE.sRGBEncoding; res(t); }, undefined, () => rej(new Error('missing picture ' + u))));
  const lerp = (a, b, k) => a + (b - a) * k, ease = { inout: k => k * k * (3 - 2 * k), linear: k => k, out: k => 1 - (1 - k) * (1 - k), in: k => k * k };
  let FILM, AMP, LINES, cur = null;
  window.filmLoad = async (url) => {
    FILM = await (await fetch(url)).json(); AMP = await (await fetch('amp.json')).json(); LINES = {}; for (const l of await (await fetch('lines_t.json')).json()) LINES[l.id] = l;
    return { frames: Math.round((FILM.t1 - FILM.t0) * FPS), shots: FILM.shots.length };
  };
  const amp = t => { const i = Math.floor(t * FPS); return AMP[i] || 0; };
  async function build(si) {
    const sh = FILM.shots[si];
    if (cur) { cur.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
    const room = typeof sh.room === 'string' ? await (await fetch(sh.room)).json() : JSON.parse(JSON.stringify(sh.room));
    (sh.who || []).forEach((w, i) => { if (w && i < (room.who || []).length) room.who[i] = { ...room.who[i], ...w }; });
    if (sh.add) room.who = (room.who || []).concat(sh.add);
    if (sh.tint != null) room.tint = sh.tint;
    if (sh.plateTint != null) room.plate.tint = sh.plateTint;
    const scene = new THREE.Scene(), set = buildSet(scene, room.plate), zw = set.zWall;
    const who = room.who || [];
    for (const w of who) { if (w.at) { const f = set.floorAt(...w.at); w.pos = [f.x, w.y || 0, f.z + (w.dz || 0)]; } else if (w.wall != null) { w.pos = w.pos || [0, 0, 0]; w.pos[2] = zw + w.wall; } }
    for (const p of room.props || []) { if (p.at) { const f = set.floorAt(...p.at); p.x = f.x; p.z = f.z; } else if (p.wall != null) p.z = zw + p.wall; addProp(scene, p); }
    const P = await Promise.all(who.map(w => Dong.load('cast/' + w.n + '/', { shared: 'shared/' })));
    for (let i = 0; i < P.length; i++) {
      const p = P[i], w = who[i]; p.root.position.set(...w.pos); scene.add(p.root); p.addShadow(w.shadow ?? 0.5);
      if (w.card) await p.showCard(w.card, { flip: !!w.flip }); if (w.view) p.setView(w.view); if (w.sideHead) await p.setSideHead(w.sideHead); if (w.facing) p.setFacing(w.facing);
      if (w.clip) p.play(w.clip, w.opts || {}); if (w.scale) p.root.scale.setScalar(w.scale); if (room.tint != null) p.setTint(room.tint);
      if (w.face) p.face = { ...p.face, ...w.face };
      if (w.hidden) p.root.visible = false;
    }
    // never draw a shot before its painting, masks and props have loaded (a cut must not flash black)
    const texReady = () => { let ok = true; scene.traverse(o => { const m = o.material; if (!m) return; for (const k of ['map', 'alphaMap']) if (m[k] && !(m[k].image && (m[k].image.complete ?? true) && (m[k].image.width || m[k].image.naturalWidth))) ok = false; }); return ok; };
    for (let n = 0; n < 200 && !texReady(); n++) await new Promise(res => setTimeout(res, 25));
    const plates = {}; for (const e of sh.events || []) if (e.plate) plates[e.plate] = await texP(e.plate);
    const ev = (sh.events || []).slice().sort((a, b) => a.t - b.t);
    cur = { si, sh, scene, set, P, who, ev, T: sh.t0 - (sh.warm ?? 0.8), plates, run: {}, slides: [] }; window.__cur = cur;
    // warm up so nobody starts from a dead stop
    while (cur.T < sh.t0) await stepTo(cur.T + 1 / FPS);
    await new Promise(res => setTimeout(res, 50));
  }
  const _va = new THREE.Vector3(), _vb = new THREE.Vector3();
  function feetX(q) { const J = q.joints && q.joints.side; if (!J || !J.foot_near || !J.foot_far) return q.root.position.x; J.foot_near.getWorldPosition(_va); J.foot_far.getWorldPosition(_vb); return (_va.x + _vb.x) / 2; }
  async function stepTo(t) {
    const c = cur, dt = 1 / FPS;
    while (c.T < t - 1e-6) {
      c.T += dt;
      while (c.ev.length && c.ev[0].t <= c.T) {
        const e = c.ev.shift(), p = e.i != null ? c.P[e.i] : null;
        if (e.card && p) await p.showCard(e.card, { flip: !!e.flip });
        if (e.view && p) p.setView(e.view);
        if (e.sideHead !== undefined && p) await p.setSideHead(e.sideHead);
        if (e.facing && p) p.setFacing(e.facing);
        if (e.play && p) p.play(e.play, e.opts || {});
        if (e.mood && p) p.play('huddle', { mood: e.mood, intensity: e.intensity ?? 1 });
        if (e.face && p) p.face = { ...p.face, ...e.face };
        if (e.runTo && p) { const f = c.set.floorAt(...e.runTo); c.run[e.i] = { x: f.x, then: e.then || 'idle', thenOpts: e.thenOpts || {} }; }
        if (e.slide && p) c.slides.push({ p, from: p.root.position.clone(), d: e.slide, t0: c.T, dur: e.dur || 1 });
        if (e.lean != null && p) c.slides.push({ p, from: p.root.position.clone(), d: [0, 0, 0], t0: c.T, dur: e.dur || 0.5, rz0: p.root.rotation.z, rz: -e.lean * Math.PI / 180 });
        if (e.hide && p) p.root.visible = false;
        if (e.show && p) p.root.visible = true;
        if (e.flinch) c.P.forEach(q => q.flinch(Math.random() * 0.35, e.flinch * (0.6 + Math.random() * 0.8)));
        if (e.plate) { c.set.material.map = c.plates[e.plate]; c.set.material.needsUpdate = true; c.set.holdouts.forEach(h => { h.material.map = c.plates[e.plate]; h.material.needsUpdate = true; }); }
        if (e.plateTint != null) c.set.material.color.set(e.plateTint);
        if (e.tint != null) c.P.forEach(q => q.setTint(e.tint));
      }
      for (const sl of c.slides) { const k = Math.min(1, (c.T - sl.t0) / sl.dur); const e = k * k * (3 - 2 * k); if (sl.rz != null) { sl.p.root.rotation.z = sl.rz0 + (sl.rz - sl.rz0) * e; continue; } sl.p.root.position.set(sl.from.x + sl.d[0] * e, sl.from.y + (sl.d[2] || 0) * e, sl.from.z + (sl.d[1] || 0) * e); }
      c.P.forEach((p, i) => {
        const w = c.who[i];
        if (w.lip) { const L = LINES[w.lip]; let on = L && c.T >= L.start && c.T <= L.end; if (on && w.lipSpans) on = w.lipSpans.some(([a, b]) => c.T >= a && c.T <= b); p.lip = on ? Math.min(1, amp(c.T) * (w.lipGain || 1.4)) : 0; }
        const rn = c.run[i]; if (rn && (p.root.position.x - rn.x) * p.facing >= 0) { p.play(rn.then, rn.thenOpts); delete c.run[i]; }
        p.update(dt);
        if (w.tie != null && c.P[w.tie]) p.root.position.x += feetX(c.P[w.tie]) - feetX(p);   // stacked walkers: line their FEET up with the leader's, so swapping them never jumps
      });
    }
  }
  function camera(t) {
    const c = cur, sh = c.sh, base = c.set.camera, cam = base.clone(), cm = sh.cam || {};
    const k = (ease[cm.ease || 'inout'])(Math.min(1, Math.max(0, (t - sh.t0) / Math.max(0.001, sh.t1 - sh.t0))));
    let A = { aim: [0.5, 0.5], zoom: 1, dx: 0, dz: 0, dy: 0, ...(cm.a || {}) }, B = { ...A, ...(cm.b || {}) };
    if (cm.keys) {   // several stops in one move: keys [[t, {aim, zoom}], ...], eased between each pair
      const K = cm.keys; let i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++;
      A = { ...A, ...K[i][1] }; B = { ...A, ...K[i + 1][1] }; const kk = Math.min(1, Math.max(0, (t - K[i][0]) / Math.max(0.001, K[i + 1][0] - K[i][0])));
      return finish(A, B, ease.inout(kk));
    }
    return finish(A, B, k);
  }
  function finish(A, B, k) {
    const c = cur, sh = c.sh, base = c.set.camera, cam = base.clone(), cm = sh.cam || {}, t = c.T;
    const zoom = lerp(A.zoom, B.zoom, k), m = 0.5 / Math.max(1, zoom) + 0.004;   // never look past the painting's edge
    let ax = lerp(A.aim[0], B.aim[0], k);
    if (cm.follow != null && c.P[cm.follow]) {   // keep a walker in the middle of the frame: aim at where they are on the painting
      const v = c.P[cm.follow].root.position.clone(); v.y += cm.followY ?? 0.4; v.project(base); ax = (v.x + 1) / 2 + (cm.followDx || 0);
      c.fx = c.fx == null ? ax : c.fx + (ax - c.fx) * 0.25; ax = c.fx;   // a little smoothing, like a camera operator
    }
    const aim = [Math.min(1 - m, Math.max(m, ax)), Math.min(1 - m, Math.max(m, lerp(A.aim[1], B.aim[1], k)))];
    const tv = Math.tan(base.fov * Math.PI / 360), th = tv * base.aspect;
    let yaw = -Math.atan((aim[0] - 0.5) * 2 * th), pitch = base.rotation.x + Math.atan((0.5 - aim[1]) * 2 * tv);
    if (cm.shake) { const s = cm.shake; yaw += s * 0.004 * (Math.sin(t * 1.3) + 0.5 * Math.sin(t * 3.7)); pitch += s * 0.003 * (Math.sin(t * 1.7 + 1) + 0.5 * Math.sin(t * 4.3)); }
    for (const kt of cm.kicks || []) { const d = t - kt; if (d >= 0 && d < 0.6) { const e = Math.exp(-d * 9) * (cm.kick || 1); yaw += 0.006 * e * Math.sin(d * 70); pitch += 0.01 * e * Math.cos(d * 55); } }
    cam.position.set(base.position.x + lerp(A.dx, B.dx, k), base.position.y + lerp(A.dy, B.dy, k), base.position.z - lerp(A.dz, B.dz, k));
    cur.view = { aim, zoom };
    cam.rotation.set(pitch, yaw, 0, 'YXZ'); cam.fov = 2 * Math.atan(tv / zoom) * 180 / Math.PI; cam.updateProjectionMatrix();
    return cam;
  }
  function overlays(t) {
    const sh = cur.sh, ov = document.getElementById('ov'); let html = '';
    for (let o of (FILM.overlays || []).concat(sh.overlays || [])) {
      if (t < o.t0 || t > o.t1) continue;
      const a = Math.min(1, (t - o.t0) / (o.fadeIn ?? 0.4), (o.t1 - t) / (o.fadeOut ?? 0.4));
      if (o.type === 'title') html += `<div class="title" style="opacity:${a}">${o.text}</div>`;
      if (o.type === 'type') { const n = Math.floor((t - o.t0) * (o.cps || 14)); html += `<div class="typed" style="opacity:${a}">${o.text.slice(0, n)}<span class="cur">${n < o.text.length || Math.floor(t * 2) % 2 ? '▌' : ''}</span></div>`; }
      if (o.type === 'phone') { const on = t > (o.flip ?? o.t0); html += `<div class="phone" style="opacity:${a}"><div class="ph-time">${o.time || '10:14'}</div><div class="ph-toggle ${on ? 'on' : ''}"><span>🔕</span> ${on ? 'Silent mode on' : 'Ring'}</div></div>`; }
      const X = v => (v * 1920).toFixed(0) + 'px', Y = v => (v * 1080).toFixed(0) + 'px';
      if (o.follow && cur.view) { const z = cur.view.zoom; o = { ...o, x: 0.5 + ((o.x ?? 0.5) - cur.view.aim[0]) * z, y: 0.5 + ((o.y ?? 0.5) - cur.view.aim[1]) * z, size: (o.size || 64) * z, rx: o.rx != null ? o.rx * z : o.rx, ry: o.ry != null ? o.ry * z : o.ry }; }
      if (o.type === 'text') html += `<div class="otext ${o.cls || ''}" style="opacity:${a * (o.alpha ?? 1)};left:${X(o.x ?? 0.5)};top:${Y(o.y ?? 0.5)};font-size:${o.size || 64}px;color:${o.color || '#fff'};transform:translate(-50%,-50%) ${o.rot ? 'rotate(' + o.rot + 'deg)' : ''}">${o.text}</div>`;
      if (o.type === 'flicker') { const h = x => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }; const q = h(Math.floor(t * (o.rate || 14))); const dark = q > (o.on ?? 0.62) ? (0.55 + 0.4 * h(q * 9)) : 0.05 * q; html += `<div class="black" style="opacity:${(a * dark * (o.alpha ?? 1)).toFixed(3)}"></div>`; }
      if (o.type === 'cctv') { const ts = new Date(Date.UTC(2026, 9, 12, 0, 0, 0) + ((o.clock ?? 37800) + (t - o.t0)) * 1000).toISOString().slice(11, 19); html += `<div class="scan" style="opacity:${a}"></div><div class="cctv" style="opacity:${a}"><span class="rec">● REC</span> ${o.cam || 'CAM 07 · 2F HALLWAY'}<br>10/12/2026 ${ts}</div>`; }
      if (o.type === 'glow') for (const g of o.spots) { const f = 0.8 + 0.2 * Math.sin(t * 3 + g[0] * 20); html += `<div class="glow" style="opacity:${(a * f).toFixed(2)};left:${X(g[0])};top:${Y(g[1])};width:${g[2] || 260}px;height:${g[2] || 260}px"></div>`; }
      if (o.type === 'shoes') { let sh2 = o.kind; for (const [kt, kk] of o.seq || []) if (t >= kt) sh2 = kk; const off = o.slide ? Math.max(0, 1 - (t - o.t0) / o.slide) * (o.slideFrom || -400) : 0; const out2 = o.leave ? Math.max(0, (t - o.leave)) * 260 : 0;
        html += `<svg class="shoes" style="opacity:${a * (o.alpha ?? 0.75)};left:${(o.x * 1920 + off + out2 - 260).toFixed(0)}px;top:${(o.y * 1080 - 90).toFixed(0)}px;transform:scale(${o.scale || 1})" viewBox="0 0 520 180" width="520" height="180">${SHOES[sh2]}</svg>`; }
      if (o.type === 'clock') { const k2 = o.t2 ? Math.min(1, Math.max(0, (t - o.t2) / (o.dur || 0.7))) : 0, mins = lerp(o.h * 60 + o.m, (o.h2 ?? o.h) * 60 + (o.m2 ?? o.m), k2 * k2 * (3 - 2 * k2));
        html += `<div class="clockbg" style="opacity:${a}${o.dark ? ';background:#2a2d36;filter:brightness(0.62) saturate(0.7)' : ''}">${clockSVG(mins)}${o.label ? `<div class="clocklabel">${o.label}</div>` : ''}</div>`; }
      if (o.type === 'chat') html += chatHTML(o, t, a);
      if (o.type === 'rotor') { const k = Math.min(1, Math.max(0, (t - o.t2) / (o.dur || 0.25))), ang = (o.from || 0) + ((o.to ?? 90) - (o.from || 0)) * k * k * (3 - 2 * k);
        html += `<div class="rotor" style="left:${X(o.x)};top:${Y(o.y)};width:${o.w}px;height:${o.h}px;transform:translate(-50%,-50%) rotate(${ang}deg)"></div>`; }
      if (o.type === 'strobe') { const on = Math.floor((t - o.t0) * (o.rate || 3)) % 2 === 0; html += `<div class="black" style="background:${o.color || '#ff1e1e'};mix-blend-mode:screen;opacity:${on ? a * (o.alpha ?? 0.35) : 0}"></div>`; }
      // --- ambience lighting (screen-space light layers, they drift slowly so the room feels alive) ---
      if (o.type === 'rays') {   // sunbeams through blinds: soft slanted bars, screen-blended, drifting
        const sh = (t * (o.drift ?? 6)) % 200, ang = o.angle ?? 62, col = o.color || '255,236,190';
        html += `<div class="lite" style="opacity:${a * (o.alpha ?? 0.35)};background:repeating-linear-gradient(${ang}deg, rgba(${col},0) ${sh}px, rgba(${col},.55) ${sh + 40}px, rgba(${col},.15) ${sh + 70}px, rgba(${col},0) ${sh + 110}px, rgba(${col},0) ${sh + 200}px);-webkit-mask-image:linear-gradient(${ang - 90}deg, #000 ${o.from ?? 0}%, transparent ${o.to ?? 70}%);mask-image:linear-gradient(${ang - 90}deg, #000 ${o.from ?? 0}%, transparent ${o.to ?? 70}%)"></div>`; }
      if (o.type === 'dust') {   // dust motes floating in the light
        let d = ''; for (let i = 0; i < (o.n || 40); i++) { const hx = ((Math.sin(i * 91.7) * 43758.5) % 1 + 1) % 1, hy = ((Math.sin(i * 12.9 + 4) * 24634.6) % 1 + 1) % 1;
          const x = ((o.x0 ?? 0) + hx * (o.w ?? 1) + 0.01 * Math.sin(t * 0.7 + i)) * 1920, y = (((hy - t * 0.012 * (0.5 + hx)) % 1 + 1) % 1 * (o.h ?? 1) + (o.y0 ?? 0)) * 1080, r = 2 + 3 * hx;
          d += `<i style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${r}px;height:${r}px;opacity:${(0.3 + 0.6 * Math.abs(Math.sin(t * 1.3 + i))).toFixed(2)}"></i>`; }
        html += `<div class="dust" style="opacity:${a * (o.alpha ?? 0.8)}">${d}</div>`; }
      if (o.type === 'pool') {   // a pool of light (door window, phone, lamp) with the rest of the frame falling into darkness
        const f = o.flicker ? 0.92 + 0.08 * Math.sin(t * 23) * Math.sin(t * 7.1) : 1, c = o.color || '255,226,170';
        html += `<div class="lite" style="opacity:${a * f};background:radial-gradient(ellipse ${o.rx ?? 40}% ${o.ry ?? 55}% at ${(o.x ?? 0.5) * 100}% ${(o.y ?? 0.5) * 100}%, rgba(${c},${o.glow ?? 0.28}), rgba(${c},0) 70%)"></div>`;
        if (o.dark) html += `<div class="black" style="opacity:${a};background:radial-gradient(ellipse ${(o.rx ?? 40) * 1.6}% ${(o.ry ?? 55) * 1.6}% at ${(o.x ?? 0.5) * 100}% ${(o.y ?? 0.5) * 100}%, rgba(0,0,0,0), rgba(0,0,${o.blue ?? 20},${o.dark}) 75%)"></div>`; }
      if (o.type === 'tube') {   // a fluorescent tube that buzzes and dips now and then
        const hh = x => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }, q = hh(Math.floor(t * 18)), dip = q > (o.stable ?? 0.9) ? 0.5 + 0.4 * hh(q * 7) : 0;
        html += `<div class="black" style="opacity:${(a * dip * (o.alpha ?? 0.35)).toFixed(3)}"></div><div class="lite" style="opacity:${a * (1 - dip) * (o.glow ?? 0.18)};background:linear-gradient(180deg, rgba(220,240,255,.9), rgba(220,240,255,0) 45%)"></div>`; }
      if (o.type === 'grade') html += `<div class="lite" style="opacity:${a};background:linear-gradient(180deg, ${o.top || 'rgba(0,0,0,0)'}, ${o.bottom || 'rgba(0,0,0,0)'})${o.blend ? ';mix-blend-mode:' + o.blend : ''}"></div>`;
      if (o.type === 'words') {   // spoken words appear one by one as they are said (o.words: [[t, word], ...]); a new line every o.max words or after . ? ,
        const said = o.words.filter(w => t >= w[0]); if (said.length) {
          const groups = []; let g = [];
          for (const w of o.words) { g.push(w); if (g.length >= (o.max || 5) || /[.?!]$/.test(w[1])) { groups.push(g); g = []; } } if (g.length) groups.push(g);
          const cur = groups.find(gr => gr.includes(said[said.length - 1]));
          const html2 = cur.map(w => t >= w[0] ? `<span style="opacity:${Math.min(1, (t - w[0]) / 0.08)};${w === said[said.length - 1] ? 'color:' + (o.hot || '#ff2a2a') + ';text-shadow:0 0 18px rgba(255,0,0,.75),0 3px 0 #000' : ''}">${w[1]}</span>` : '').join(' ');
          html += `<div class="words" style="opacity:${a};left:${X(o.x ?? 0.5)};top:${Y(o.y ?? 0.5)};font-size:${o.size || 84}px;color:${o.color || '#c4161c'}">${html2}</div>`;
        } }
      if (o.type === 'call') {   // a phone held up: 'Calling <name>…', then a running call timer once answered (o.answer), 'Call ended' after o.end
        const st = o.end && t >= o.end ? 'Call ended' : o.answer && t >= o.answer ? (() => { const s2 = Math.floor(t - o.answer); return `0:${String(s2).padStart(2, '0')}`; })() : 'Calling' + '.'.repeat(1 + Math.floor(t * 2) % 3);
        html += `<div class="call" style="opacity:${a}"><div class="call-av">${o.initial || 'M'}</div><div class="call-name">${o.name || 'Mom'}</div><div class="call-st">${st}</div><div class="call-red"></div></div>`; }
      if (o.type === 'black') html += `<div class="black" style="opacity:${a * (o.alpha ?? 1)}"></div>`;
      if (o.type === 'flash') html += `<div class="flash" style="opacity:${a * (o.alpha ?? 0.8)}"></div>`;
    }
    ov.innerHTML = html;
    r.domElement.style.filter = sh.filter || '';
    document.getElementById('stage').style.clipPath = sh.clip || 'none';
  }

  // shoe-print shadows seen in the light under a door: two feet, three kinds of shoe
  const foot = (x, w, h, heel) => `<ellipse cx="${x}" cy="90" rx="${w}" ry="${h}"/>` + (heel ? `<rect x="${x - w - 8}" y="${90 - h * 0.35}" width="14" height="${h * 0.7}" rx="3"/>` : '');
  const SHOES = {
    sneaker: `<g filter="url(#b)">${foot(170, 95, 34)}${foot(350, 95, 34)}</g>`,
    heel: `<g filter="url(#b)"><path d="M90 90 Q150 62 250 82 Q262 90 250 98 Q150 118 90 90Z"/><rect x="72" y="80" width="12" height="20"/><path d="M290 90 Q350 62 450 82 Q462 90 450 98 Q350 118 290 90Z"/><rect x="272" y="80" width="12" height="20"/></g>`,
    boot: `<g filter="url(#b)"><rect x="60" y="48" width="220" height="84" rx="30"/><rect x="290" y="48" width="220" height="84" rx="30"/></g>`,
    still: `<g filter="url(#b)">${foot(185, 90, 36)}${foot(335, 90, 36)}</g>`,
  };
  for (const k in SHOES) SHOES[k] = `<defs><filter id="b"><feGaussianBlur stdDeviation="9"/></filter></defs><g fill="#000">${SHOES[k]}</g>`;
  function clockSVG(mins) {
    const hA = (mins / 720) * 360, mA = (mins % 60) * 6; let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; ticks += `<text x="${300 + 205 * Math.sin(a)}" y="${318 - 205 * Math.cos(a)}" font-size="56" text-anchor="middle" fill="#2b2b2b" font-family="DejaVu Sans" font-weight="700">${i || 12}</text>`; }
    return `<svg viewBox="0 0 600 600" width="760" height="760" class="clock"><circle cx="300" cy="300" r="280" fill="#f4efe4" stroke="#2b2b2b" stroke-width="26"/>${ticks}
      <line x1="300" y1="300" x2="${300 + 130 * Math.sin(hA * Math.PI / 180)}" y2="${300 - 130 * Math.cos(hA * Math.PI / 180)}" stroke="#222" stroke-width="20" stroke-linecap="round"/>
      <line x1="300" y1="300" x2="${300 + 200 * Math.sin(mA * Math.PI / 180)}" y2="${300 - 200 * Math.cos(mA * Math.PI / 180)}" stroke="#222" stroke-width="11" stroke-linecap="round"/><circle cx="300" cy="300" r="18" fill="#222"/></svg>`;
  }
  // a phone held up to camera: a group chat or texts, each message appearing at its time
  function chatHTML(o, t, a) {
    const shown = o.msgs.filter(m => t >= m.t), last = shown.slice(-(o.keep || 6));
    const b = last.map(m => `<div class="msg ${m.me ? 'me' : ''} ${m.alert ? 'alert' : ''}" style="animation:none;opacity:${Math.min(1, (t - m.t) / 0.15)}">${m.name ? `<b style="color:${m.color || '#8ab4ff'}">${m.name}</b>` : ''}${m.text}${m.seen && t > m.seen ? '<i>Seen</i>' : ''}</div>`).join('');
    return `<div class="chat" style="opacity:${a};${o.x ? 'left:' + (o.x * 1920 - 300) + 'px;margin:-480px 0 0 0;' : ''}"><div class="chathead">${o.title || 'Room 214 🦅'}</div><div class="chatbody">${b}</div>${o.typing && t < o.typing ? '' : ''}</div>`;
  }
  window.filmFrame = async (f) => {
    const t = FILM.t0 + f / FPS, si = FILM.shots.findIndex(s => t >= s.t0 && t < s.t1);
    if (si < 0) return 'none';
    if (!cur || cur.si !== si) await build(si);
    await stepTo(t);
    const cam = camera(t); r.render(cur.scene, cam); overlays(t);
    return si;
  };
  window.filmShotOf = (f) => { const t = FILM.t0 + f / FPS; return FILM.shots.findIndex(s => t >= s.t0 && t < s.t1); };
})();
