/* dong.js: Dong as a jointed paper puppet in three.js (r128+, global THREE).

   const dong = await Dong.load('rig/');          // folder with rig.json, cards/, front/, side/, face/, heads/
   scene.add(dong.root);
   dong.play('walk');                              // idle talk wave point shrug scared walk run sit stand walkToward walkAway
   dong.setFacing(-1);                             // side view: 1 faces right, -1 faces left
   dong.turn('side', 1);                           // turns smoothly (through the 3/4 drawings) to 'front', 'side' or 'back'
   dong.say(0.6);                                  // mouth open 0..1 (call every frame from audio loudness), or dong.talking = true
   dong.setExpression('shock');                    // front: any head card in heads/; null = the live face (talk + blink)
   dong.showCard('phone_hold');                    // one of the drawn poses in cards/ (sitting, phone, scared, asleep, ...)
   in your loop: dong.update(dt)

   1 unit = 1 metre; Dong is 1.70 m tall; his feet stand on y = 0 at dong.root.position. Moving clips (walk, run, walkToward,
   walkAway, sit, stand) move dong.root themselves: the foot on the ground is pinned, so it never slides. */
(function () {
  const H = 1.70, K = H / 1400, D2R = Math.PI / 180;
  const loader = new THREE.TextureLoader();
  const loadTex = src => new Promise((ok, no) => loader.load(src, t => { t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; ok(t); }, undefined, () => no(new Error('could not load ' + src))));
  const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('could not load ' + src)); i.src = src; });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k, ease = x => x * x * (3 - 2 * x);

  /* Every piece is flat paper: unlit (MeshBasicMaterial), so a limb tilting towards the camera never changes shade.
     dong.setTint(color) darkens or colours the whole puppet for night scenes, coloured light and so on. */
  function cardMesh(tex, wpx, hpx, tint = 1) {
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, color: new THREE.Color(tint, tint, tint) });
    mat.userData.tint = tint;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * K, hpx * K), mat);
    m.castShadow = true; m.receiveShadow = false;
    m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
    return m;
  }

  /* ---------- the live faces: canvases redrawn only when the face changes ---------- */
  function frontFace(blank, P) {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; let key = '';
    const put = (img, cx, cy, w, h) => { h = h || img.height * w / img.width; g.drawImage(img, cx - w / 2, cy - h / 2, w, h); };
    const stroke = (pts, w = 7, col = '#2e2925') => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
    const EY = 299, EL = 207, ER = 307, MX = 256.5, MY = 373;
    return {
      tex, draw(f) {
        const k = JSON.stringify(f); if (k === key) return; key = k;
        g.clearRect(0, 0, 512, 512); g.drawImage(blank, 0, 0);
        // eyes
        if (f.eyes === 'closed' || f.blink > 0.5) { stroke([[EL - 15, EY + 2], [EL, EY + 8], [EL + 15, EY + 2]]); stroke([[ER - 15, EY + 2], [ER, EY + 8], [ER + 15, EY + 2]]); }
        else if (f.eyes === 'happy') { stroke([[EL - 15, EY + 6], [EL, EY - 6], [EL + 15, EY + 6]]); stroke([[ER - 15, EY + 6], [ER, EY - 6], [ER + 15, EY + 6]]); }
        else if (f.eyes === 'wide') { put(P.p02, EL, EY, 46); put(P.p03, ER, EY, 46); }
        else if (f.eyes === 'angry') { put(P.p04, EL, EY + 2, 34); put(P.p05, ER, EY + 2, 34); }
        else if (f.eyes === 'creepy') { put(P.p07, EL, EY, 48); put(P.p08, ER, EY, 48); }
        else if (f.eyes === 'cry') { put(P.p00, EL, EY, 30); put(P.p06, ER + 6, EY + 12, 40); }
        else { put(P.p00, EL + (f.look || 0) * 6, EY, 30); put(P.p01, ER + (f.look || 0) * 6, EY, 30); }
        if (f.brows === 'angry') { stroke([[EL - 22, EY - 44], [EL + 16, EY - 32]], 9); stroke([[ER + 22, EY - 44], [ER - 16, EY - 32]], 9); }
        if (f.brows === 'worried') { stroke([[EL - 20, EY - 32], [EL + 16, EY - 44]], 9); stroke([[ER + 20, EY - 32], [ER - 16, EY - 44]], 9); }
        if (f.brows === 'up') { stroke([[EL - 18, EY - 46], [EL + 18, EY - 46]], 9); stroke([[ER - 18, EY - 46], [ER + 18, EY - 46]], 9); }
        // mouth: open 0..1 talks; named shapes override
        const o = f.open || 0;
        if (f.mouth === 'grin') put(P.p11, MX, MY + 4, 82);
        else if (f.mouth === 'laugh') put(P.p14, MX, MY + 8, 96);
        else if (f.mouth === 'O') put(P.p16, MX, MY + 8, 40);
        else if (f.mouth === 'scream') put(P.p17, MX, MY + 10, 70);
        else if (f.mouth === 'tongue') put(P.p13, MX, MY + 12, 64);
        else if (f.mouth === 'flat') stroke([[MX - 22, MY], [MX + 22, MY]], 7, '#8d3b33');
        else if (o > 0.12) put(P.p10, MX, MY + 4 + o * 6, 30 + o * 18, 8 + o * 36);
        else put(P.p09, MX, MY, 70);
        tex.needsUpdate = true;
      }
    };
  }
  function sideFace(headImg) {
    const c = document.createElement('canvas'); c.width = headImg.width; c.height = headImg.height; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; let key = '';
    // a patch of plain skin felt, to paint over the drawn eye and mouth
    const skin = document.createElement('canvas'); skin.width = skin.height = 48; skin.getContext('2d').drawImage(headImg, 600, 404, 48, 48, 0, 0, 48, 48);
    const patch = (cx, cy, rx, ry) => { g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.clip(); g.globalCompositeOperation = 'source-atop';
      for (let x = cx - rx; x < cx + rx; x += 46) for (let y = cy - ry; y < cy + ry; y += 46) g.drawImage(skin, x, y); g.restore(); };
    return {
      tex, draw(f) {
        const k = JSON.stringify(f); if (k === key) return; key = k;
        g.clearRect(0, 0, c.width, c.height); g.drawImage(headImg, 0, 0);
        if (f.blink > 0.5 || f.eyes === 'closed') { patch(678, 285, 15, 21); g.strokeStyle = '#2e2925'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(668, 290); g.quadraticCurveTo(678, 298, 690, 288); g.stroke(); }
        const o = f.open || 0;
        if (o > 0.12 || f.mouth) {
          patch(694, 372, 20, 22);
          g.fillStyle = '#7f2f2a'; g.beginPath();
          const h = f.mouth === 'scream' || f.mouth === 'O' ? 22 : 3 + o * 17;
          g.ellipse(698, 372, 9 + o * 3, h / 2, 0.15, 0, Math.PI * 2); g.fill();
        }
        tex.needsUpdate = true;
      }
    };
  }

  class Dong {
    static async load(base = '') {
      const R = await (await fetch(base + 'rig.json')).json(), C = await (await fetch(base + 'cards/cards.json')).json();
      const files = new Set();
      for (const v of Object.values(R.views)) for (const p of Object.values(v.pieces)) if (!p.file.startsWith('heads/')) files.add(p.file);
      for (const n of ['turn_three_q', 'turn_three_q_back']) files.add(C[n].file);
      const T = {}; await Promise.all([...files].map(async f => { T[f] = await loadTex(base + f); }));
      const P = {}; await Promise.all(['p00', 'p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10', 'p11', 'p13', 'p14', 'p16', 'p17'].map(async n => { P[n] = await loadImg(base + 'face/' + n + '.png'); }));
      const blank = await loadImg(base + 'face/blank_front.png'), sideHead = await loadImg(base + 'side/head.png');
      return new Dong(base, R, C, T, P, blank, sideHead);
    }
    constructor(base, R, C, T, P, blank, sideHead) {
      this.base = base; this.R = R; this.C = C; this.T = T;
      this.root = new THREE.Group(); this.root.name = 'Dong';
      this.views = {}; this.joints = {}; this.markers = {}; this.facing = 1;
      this.face = { eyes: 'open', mouth: null, open: 0, blink: 0, brows: null, look: 0 };
      this.front = frontFace(blank, P); this.side = sideFace(sideHead);
      for (const [vn, V] of Object.entries(R.views)) this._build(vn, V);
      // the drawn poses: one card, feet on the floor
      this.card = new THREE.Group(); this.root.add(this.card); this.cardMesh = null; this.cardCache = {};
      // the three-quarter drawings a turn passes through
      this.tcard = new THREE.Group(); this.root.add(this.tcard); this.tmesh = {};
      for (const n of ['turn_three_q', 'turn_three_q_back']) { const c = C[n], m = cardMesh(T[c.file], c.w, c.h); m.position.y = c.h * K / 2; m.visible = false; this.tcard.add(m); this.tmesh[n] = m; }
      const th = R.views.side.pieces.thigh_near; this.thighLen = th.len * K;
      this.expression = null; this.headCache = {};
      this.time = 0; this.clip = null; this.clipT = 0; this.from = null; this.talking = false; this._nextBlink = 2; this._lock = null; this._v = 0;
      this.setView('front'); this.play('idle');
    }
    _build(vn, V) {
      const g = new THREE.Group(); this.root.add(g); this.views[vn] = g; const J = this.joints[vn] = {}; this.markers[vn] = [];
      const order = V.order, P = V.pieces;
      const make = name => {
        if (J[name]) return J[name];
        const p = P[name], joint = new THREE.Object3D(); joint.name = name; J[name] = joint;
        if (p.parent) { const par = P[p.parent]; make(p.parent).add(joint); joint.position.set((p.at[0] - par.pivot[0]) * K, -(p.at[1] - par.pivot[1]) * K, 0); }
        else { g.add(joint); joint.position.set(0, V.hip_from_floor_px * K, 0); }
        let tex, w, h, s = p.scale || 1;
        if (p.file.startsWith('heads/')) { tex = this.front.tex; w = h = 512; }
        else if (vn === 'side' && name === 'head') { tex = this.side.tex; [w, h] = p.size; }
        else { tex = this.T[p.file]; [w, h] = p.size; }
        const m = cardMesh(tex, w * s, h * s, p.tint || 1);
        m.position.set((w / 2 - p.pivot[0]) * s * K, -(h / 2 - p.pivot[1]) * s * K, order.indexOf(name) * 0.004);
        m.renderOrder = order.indexOf(name); joint.add(m); joint.userData.mesh = m;
        if (p.sole) {   // two points on the sole of each shoe, to keep the feet on the floor
          const pts = p.sole.map(([x, y]) => { const mk = new THREE.Object3D(); mk.position.set((x - p.pivot[0]) * K, -(y - p.pivot[1]) * K, 0); joint.add(mk); return mk; });
          this.markers[vn].push(pts); pts.foot = name;
        }
        return joint;
      };
      order.forEach(make);
    }
    setView(v) {
      if (v !== this.view) { this._lock = null; this._v = 0; }
      this.view = v;
      for (const [n, g] of Object.entries(this.views)) { g.visible = n === v; g.scale.x = n === 'side' ? this.facing : 1; }
      this.card.visible = v === 'card'; this.tcard.visible = false;
    }
    setFacing(f) { this._v = 0; this.facing = f >= 0 ? 1 : -1; this.views.side.scale.x = this.facing; if (this.cardMesh && this.cardFlip) this.cardMesh.scale.x = this.facing; this._lock = null; }
    /* where his hips end up after play('sit') from where he stands now: put the chair seat there */
    sitHipX() { return this.root.position.x - this.facing * this.thighLen * Math.sin(88 * D2R); }
    async setExpression(name) {
      this.expression = name;
      const m = this.joints.front.head.userData.mesh;
      if (!name) { m.material.map = m.customDepthMaterial.map = this.front.tex; m.material.needsUpdate = true; return; }
      const t = this.headCache[name] || (this.headCache[name] = await loadTex(this.base + 'heads/' + name + '.webp'));
      if (this.expression !== name) return;
      m.material.map = m.customDepthMaterial.map = t; m.material.needsUpdate = m.customDepthMaterial.needsUpdate = true;
    }
    async showCard(name, { flip = false } = {}) {
      const c = this.C[name]; if (!c) throw new Error('no card ' + name);
      const t = this.cardCache[name] || (this.cardCache[name] = await loadTex(this.base + c.file));
      if (this.cardMesh) this.card.remove(this.cardMesh);
      this.cardMesh = cardMesh(t, c.w, c.h); this.cardMesh.position.y = c.h * K / 2; this.card.add(this.cardMesh); if (this.tint) this.cardMesh.material.color.copy(this.tint);
      this.cardFlip = flip; if (flip) this.cardMesh.scale.x = this.facing;
      this.cardName = name; this._turn = null; this.setView('card'); this.play('cardIdle');
    }
    say(open) { this.face.open = clamp(open); }
    setTint(color) {
      this.tint = new THREE.Color(color);
      this.root.traverse(o => { if (o.isMesh && o.material.userData.tint != null) o.material.color.copy(this.tint).multiplyScalar(o.material.userData.tint); });
    }
    /* turn to 'front', 'side' or 'back' (facing 1 = right, -1 = left for the side), passing through the 3/4 drawings; then play `then` */
    turn(to, facing = this.facing, then = 'idle', step = 0.13) {
      const ring = ['front', 'turn_three_q', 'side', 'turn_three_q_back', 'back'];
      const from = ring.indexOf(this.view === 'card' ? 'front' : this.view), goal = ring.indexOf(to);
      if (to === 'side' && this.view === 'side' && facing !== this.facing) {          // side to side: round through the front
        this.turn('front', this.facing, null, step); this._turn.next = [to, facing, then]; return;
      }
      const stops = []; for (let i = from; ; i += Math.sign(goal - from) || 1) { stops.push(ring[i]); if (i === goal) break; }
      this.setFacing(facing);
      this._turn = { stops, t: 0, step, then, next: null };
      if (this.clip !== 'idle') this.play('idle');
    }
    pose(view, a) {
      for (const [n, j] of Object.entries(this.joints[view])) { j.rotation.z = (a[n] || 0) * D2R; j.rotation.x = (a[n + '.x'] || 0) * D2R; }
    }
    play(name, opts = {}) {
      if (!CLIPS[name]) throw new Error('no clip ' + name);
      this.from = this.current ? { ...this.current } : null; this.clip = name; this.clipT = 0; this.opts = opts;
      const c = CLIPS[name]; if (c.view && c.view !== this.view) { this._turn = null; this.setView(c.view); }
    }
    _turnStep(dt) {
      const T = this._turn; T.t += dt;
      const n = T.stops.length, u = T.t / T.step;                     // stop i is fully shown at u = i; between stops it squeezes and swaps
      const i = Math.min(n - 1, Math.round(u)), d = Math.abs(u - i), sx = n > 1 ? lerp(1, 0.55, ease(clamp(d * 2))) : 1;
      const stop = T.stops[i];
      for (const m of Object.values(this.tmesh)) m.visible = false;
      if (stop.startsWith('turn_')) {
        if (this.view !== 'turncard') { for (const g of Object.values(this.views)) g.visible = false; this.view = 'turncard'; this._lock = null; }
        this.tcard.visible = true; this.tmesh[stop].visible = true; this.tmesh[stop].scale.x = sx * this.facing;
        this.tcard.scale.y = 1 + 0.006 * Math.sin(this.time * 2.2);
      } else {
        if (this.view !== stop) this.setView(stop);
        this.views[stop].scale.x = sx * (stop === 'side' ? this.facing : 1);
      }
      if (u >= n - 1) {
        this._turn = null; this.setView(T.stops[n - 1]);
        if (T.next) this.turn(...T.next); else if (T.then) this.play(T.then);
      }
    }
    update(dt) {
      this.time += dt; this.clipT += dt;
      if (this._turn) this._turnStep(dt);
      const c = CLIPS[this.clip], rig = !!this.joints[this.view];
      const out = c.fn(this.clipT, this.opts || {}, this) || {};
      // blend in from the previous pose over 0.25 s
      const k = this.from ? ease(clamp(this.clipT / (c.blend ?? 0.25))) : 1;
      const prev = this.from && this.from.view === this.view ? this.from.angles : {}, now = out.angles || {}, ang = {};
      for (const n of new Set([...Object.keys(prev), ...Object.keys(now)])) ang[n] = lerp(prev[n] || 0, now[n] || 0, k);
      this.current = { view: this.view, angles: ang };
      const vg = this.view === 'card' ? this.card : this.view === 'turncard' ? this.tcard : this.views[this.view];
      if (rig) {
        // a lean bends at the hips: the torso tips, the legs stay where they are
        const lean = (out.lean || 0) * (this.view === 'side' ? -1 : 1), J = this.joints[this.view];
        const a2 = { ...ang, torso: (ang.torso || 0) + lean };
        for (const n of Object.keys(J)) if (n.startsWith('thigh')) a2[n] = (ang[n] || 0) - lean;
        // feet: a clip gives each foot's angle to the floor (0 = flat); the ankle takes up whatever the leg does
        for (const n of Object.keys(J)) if (n.startsWith('foot')) {
          const sfx = n.slice(4), th = 'thigh' + sfx, sh = 'shin' + sfx;
          a2[n] = (ang[n] || 0) - ((a2.torso || 0) + (a2[th] || 0) + (a2[sh] || 0));
          a2[n + '.x'] = (ang[n + '.x'] || 0) - ((a2[th + '.x'] || 0) + (a2[sh + '.x'] || 0));
        }
        this.pose(this.view, a2);
        // feet on the floor: raise or lower the puppet so its lowest sole touches y = 0
        vg.position.set(0, 0, 0); this.root.updateMatrixWorld(true);
        const feet = this.markers[this.view].map(f => f.map(mk => mk.getWorldPosition(new THREE.Vector3())));
        let lo = Infinity, li = 0; feet.forEach((f, i) => { const y = Math.min(...f.map(p => p.y)); if (y < lo) { lo = y; li = i; } });
        vg.position.y = this.root.position.y - lo + (out.lift || 0);
        // the planted foot does not slide: move the whole puppet so it stays where it was last frame
        const ax = out.lock, at = (f, a) => f.reduce((s, p) => s + p[a], 0) / f.length;
        if (ax) {
          if (out.stance) li = feet.findIndex((f, i) => this.markers[this.view][i].foot === out.stance);
          const mean = out.lockMode === 'mean', key = mean ? 'mean' : li, cur = mean ? feet.reduce((s, f) => s + at(f, ax), 0) / feet.length : at(feet[li], ax);
          if (out.lift > 0.004) this.root.position[ax] += this._v * dt;         // in the air (running): keep going
          else if (this._lock && this._lock.ax === ax && this._lock.key === key) {
            const d = this._lock.at - cur; this.root.position[ax] += d; if (dt > 0) this._v = lerp(this._v, d / dt, 0.2);
          }
          this.root.updateMatrixWorld(true);
          const again = this.markers[this.view].map(f => f.map(mk => mk.getWorldPosition(new THREE.Vector3())));
          this._lock = { ax, key, at: mean ? again.reduce((s, f) => s + at(f, ax), 0) / again.length : at(again[li], ax) };
        } else this._lock = null;
      } else {
        vg.position.y = out.lift || 0;
        if (this.view === 'card') this.card.scale.y = 1 + 0.006 * Math.sin(this.time * 2.2);
      }
      if (out.speed) this.root.position.z += out.speed * dt;
      // the face: blinks every 2-5 s, talking
      if (this.time > this._nextBlink) { this._blinkAt = this.time; this._nextBlink = this.time + 2 + Math.random() * 3; }
      const f = { ...this.face, ...(out.face || {}) };
      f.blink = this._blinkAt && this.time - this._blinkAt < 0.13 ? 1 : 0;
      if (this.talking) { f.open = Math.abs(Math.sin(this.time * 9.5) * Math.sin(this.time * 3.1)); if (!['laugh', 'scream'].includes(f.mouth)) f.mouth = null; }
      if (this.view === 'front' && !this.expression) this.front.draw(f);
      if (this.view === 'side') this.side.draw(f);
    }
  }

  /* ---------- clips: each returns joint angles in degrees for clip time t ('name.x' = tilt towards or away from the camera) ---------- */
  const S = Math.sin, C = Math.cos, pos = x => Math.max(0, x);
  const CLIPS = {
    idle: { fn(t, o, d) {
      const b = S(t * 2.2), v = d.view;
      if (v === 'side') return { angles: { upperarm_near: 3 + b * 1.5, forearm_near: 8, upperarm_far: -3, forearm_far: 8 } };
      if (v === 'back') return { angles: { upperarmL: -3 - b, upperarmR: 3 + b, forearmL: 2, forearmR: -2 } };
      return { angles: { upperarmL: -3 - b, upperarmR: 3 + b, forearmL: 2, forearmR: -2 } };
    } },
    walk: { view: 'side', fn(t, o) {
      const p = 2 * Math.PI * 0.9 * (o.pace || 1) * t, A = 24, th = S(p), cs = C(p);
      return { lock: 'x', lean: 3, stance: cs < 0 ? 'foot_near' : 'foot_far', angles: {
        thigh_near: A * th, shin_near: -6 - 36 * pos(C(p + 0.5)) ** 1.6,
        thigh_far: -A * th, shin_far: -6 - 36 * pos(-C(p + 0.5)) ** 1.6,
        upperarm_near: -18 * th, forearm_near: 14 + 10 * pos(-th),
        upperarm_far: 18 * th, forearm_far: 14 + 10 * pos(th) } };
    } },
    run: { view: 'side', fn(t, o) {
      const p = 2 * Math.PI * 1.45 * t, th = S(p), cs = C(p);
      return { lock: 'x', lean: 12, stance: cs < 0 ? 'foot_near' : 'foot_far', lift: pos(S(2 * p - 0.6)) ** 1.5 * 0.06, angles: {
        thigh_near: 42 * th + 8, shin_near: -15 - 85 * pos(C(p + 0.4)) ** 1.2,
        thigh_far: -42 * th + 8, shin_far: -15 - 85 * pos(-C(p + 0.4)) ** 1.2,
        upperarm_near: -45 * th, forearm_near: 85, upperarm_far: 45 * th, forearm_far: 85 } };
    } },
    // sitting: the feet stay put and the hips go back and down onto the seat (see sitHipX); shins stay upright the whole way
    sit: { view: 'side', fn(t, o) {
      const u = clamp(t / 1.0), k = ease(u);
      return { lock: 'x', lockMode: 'mean', lean: 22 * S(Math.PI * u) ** 1.2 + 4 * k, angles: {
        thigh_near: 88 * k, shin_near: -88 * k, thigh_far: 86 * k, shin_far: -86 * k,
        upperarm_near: lerp(3, 12, k) + 20 * S(Math.PI * u), forearm_near: lerp(8, 58, k), upperarm_far: lerp(-3, 10, k) + 20 * S(Math.PI * u), forearm_far: lerp(8, 58, k) } };
    } },
    stand: { view: 'side', blend: 0.05, fn(t, o) {
      const u = clamp(t / 1.0), k = 1 - ease(u);
      return { lock: 'x', lockMode: 'mean', lean: 26 * S(Math.PI * u) ** 1.2 + 4 * k, angles: {
        thigh_near: 88 * k, shin_near: -88 * k, thigh_far: 86 * k, shin_far: -86 * k,
        upperarm_near: lerp(3, 12, k) + 22 * S(Math.PI * u), forearm_near: lerp(8, 58, k), upperarm_far: lerp(-3, 10, k) + 22 * S(Math.PI * u), forearm_far: lerp(8, 58, k) } };
    } },
    wave: { view: 'front', fn(t) {
      const b = S(t * 2.2);
      return { face: { eyes: 'happy', mouth: 'grin' }, angles: { upperarmR: 145, forearmR: 20 + 25 * S(t * 9), upperarmL: -3 - b, forearmL: 2 } };
    } },
    point: { view: 'front', fn() { return { face: { brows: 'up' }, angles: { upperarmR: 92, forearmR: 0, upperarmL: -4, forearmL: 2 } }; } },
    shrug: { view: 'front', fn(t) { const k = ease(clamp(t / 0.3)); return { face: { brows: 'up', mouth: 'flat' }, angles: { upperarmL: -22 * k, forearmL: 80 * k, upperarmR: 22 * k, forearmR: -80 * k } }; } },
    scared: { view: 'front', fn(t) {
      const sh = S(t * 40) * 1.2;
      return { face: { eyes: 'wide', mouth: 'O', brows: 'worried' }, angles: { upperarmL: -150 + sh, forearmL: -140, upperarmR: 150 - sh, forearmR: 140, thighL: -3, thighR: 3 } };
    } },
    talk: { fn(t, o, d) { d.talking = true; return CLIPS.idle.fn(t, o, d); } },
    // to and from the camera: the legs tilt towards and away from the lens, the knee lifts on the swing, the planted foot is pinned
    walkToward: { view: 'front', fn(t, o) {
      const p = 2 * Math.PI * 0.9 * (o.pace || 1) * t, s = S(p), c = C(p), A = 22, B = 48;
      return { lock: 'z', lean: 1.5 * s, stance: c < 0 ? 'footL' : 'footR', angles: {
        'thighL.x': -A * s, 'thighR.x': A * s, 'shinL.x': B * pos(C(p + 0.5)) ** 1.5, 'shinR.x': B * pos(-C(p + 0.5)) ** 1.5,
        upperarmL: -4, upperarmR: 4, forearmL: 3, forearmR: -3,
        'upperarmL.x': 16 * s, 'upperarmR.x': -16 * s, 'forearmL.x': -12, 'forearmR.x': -12 } };
    } },
    walkAway: { view: 'back', fn(t, o) {
      const p = 2 * Math.PI * 0.9 * (o.pace || 1) * t, s = S(p), c = C(p), A = 22, B = 48;
      return { lock: 'z', lean: 1.5 * s, stance: c < 0 ? 'footL' : 'footR', angles: {
        'thighL.x': A * s, 'thighR.x': -A * s, 'shinL.x': -B * pos(C(p + 0.5)) ** 1.5, 'shinR.x': -B * pos(-C(p + 0.5)) ** 1.5,
        upperarmL: -4, upperarmR: 4, forearmL: 3, forearmR: -3,
        'upperarmL.x': -16 * s, 'upperarmR.x': 16 * s, 'forearmL.x': 12, 'forearmR.x': 12 } };
    } },
    // a jump in place (or forward with {forward: 1.2} m/s in the side view): crouch, spring, tuck, land, recover
    jump: { fn(t, o, d) {
      const u = clamp(t / 1.15), crouch = u < 0.22 ? ease(u / 0.22) : u < 0.3 ? 1 - (u - 0.22) / 0.08 : u > 0.7 && u < 0.92 ? S(Math.PI * (u - 0.7) / 0.22) : 0;
      const air = u >= 0.3 && u <= 0.7 ? (u - 0.3) / 0.4 : -1, lift = air >= 0 ? 0.38 * 4 * air * (1 - air) : 0, tuck = air >= 0 ? S(Math.PI * air) : 0;
      if (d.view === 'side') {
        if (o.forward && air >= 0) d.root.position.x += o.forward * d.facing / 60;
        return { lean: 14 * crouch + 6 * tuck, lift, angles: {
          thigh_near: 55 * crouch + 45 * tuck, shin_near: -95 * crouch - 70 * tuck, thigh_far: 50 * crouch + 35 * tuck, shin_far: -90 * crouch - 60 * tuck,
          upperarm_near: -40 * crouch + 85 * tuck, forearm_near: 20 + 30 * tuck, upperarm_far: -40 * crouch + 75 * tuck, forearm_far: 20 + 30 * tuck } };
      }
      const sgn = d.view === 'back' ? -1 : 1;
      return { lift, face: { eyes: tuck > 0.3 ? 'wide' : 'open', mouth: tuck > 0.3 ? 'O' : null }, angles: {
        'thighL.x': -sgn * (50 * crouch + 40 * tuck), 'thighR.x': -sgn * (50 * crouch + 40 * tuck), 'shinL.x': sgn * (90 * crouch + 60 * tuck), 'shinR.x': sgn * (90 * crouch + 60 * tuck),
        thighL: -4 * tuck, thighR: 4 * tuck, upperarmL: -20 * crouch - 150 * tuck, upperarmR: 20 * crouch + 150 * tuck, forearmL: -10 * tuck, forearmR: 10 * tuck } };
    } },
    cardIdle: { view: 'card', fn() { return {}; } },
  };
  Dong.CLIPS = CLIPS;
  window.Dong = Dong;
})();
