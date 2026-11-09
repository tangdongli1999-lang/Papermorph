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
  const D2R = Math.PI / 180;
  const loader = new THREE.TextureLoader();
  const loadTex = src => new Promise((ok, no) => loader.load(src, t => { t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; ok(t); }, undefined, () => no(new Error('could not load ' + src))));
  const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('could not load ' + src)); i.src = src; });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k, ease = x => x * x * (3 - 2 * x);

  /* Every piece is flat paper: unlit (MeshBasicMaterial), so a limb tilting towards the camera never changes shade.
     dong.setTint(color) darkens or colours the whole puppet for night scenes, coloured light and so on. */
  function cardMesh(tex, wpx, hpx, tint = 1, K = 1.70 / 1400) {
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, color: new THREE.Color(tint, tint, tint) });
    mat.userData.tint = tint;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * K, hpx * K), mat);
    m.castShadow = true; m.receiveShadow = false;
    m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
    return m;
  }

  /* ---------- the live faces: canvases redrawn only when the face changes ---------- */
  function frontFace(blank, P, A = {}) {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; let key = '';
    const put = (img, cx, cy, w, h) => { h = h || img.height * w / img.width; g.drawImage(img, cx - w / 2, cy - h / 2, w, h); };
    const stroke = (pts, w = 7, col = '#2e2925') => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
    const EY = A.EY ?? 299, EL = A.EL ?? 207, ER = A.ER ?? 307, MX = A.MX ?? 256.5, MY = A.MY ?? 373, es = (A.eye ?? 30) / 30, ms = (A.mouthW ?? 70) / 70;
    const put0 = put; const putE = (img, cx, cy, w, h) => put0(img, cx, cy, w * es, h && h * es), putM = (img, cx, cy, w, h) => put0(img, cx, cy, w * ms, h && h * ms);
    return {
      tex, draw(f) {
        const k = JSON.stringify(f); if (k === key) return; key = k;
        g.clearRect(0, 0, 512, 512); g.drawImage(blank, 0, 0);
        // eyes
        if (f.eyes === 'closed' || f.blink > 0.5) { stroke([[EL - 15, EY + 2], [EL, EY + 8], [EL + 15, EY + 2]]); stroke([[ER - 15, EY + 2], [ER, EY + 8], [ER + 15, EY + 2]]); }
        else if (f.eyes === 'happy') { stroke([[EL - 15, EY + 6], [EL, EY - 6], [EL + 15, EY + 6]]); stroke([[ER - 15, EY + 6], [ER, EY - 6], [ER + 15, EY + 6]]); }
        else if (f.eyes === 'wide') { putE(P.p02, EL, EY, 46); putE(P.p03, ER, EY, 46); }
        else if (f.eyes === 'angry') { putE(P.p04, EL, EY + 2, 34); putE(P.p05, ER, EY + 2, 34); }
        else if (f.eyes === 'creepy') { putE(P.p07, EL, EY, 48); putE(P.p08, ER, EY, 48); }
        else if (f.eyes === 'cry') { putE(P.p00, EL, EY, 30); putE(P.p06, ER + 6, EY + 12, 40); }
        else { putE(P.p00, EL + (f.look || 0) * 6, EY, 30); putE(P.p01, ER + (f.look || 0) * 6, EY, 30); }
        if (f.brows === 'angry') { stroke([[EL - 22, EY - 44], [EL + 16, EY - 32]], 9); stroke([[ER + 22, EY - 44], [ER - 16, EY - 32]], 9); }
        if (f.brows === 'worried') { stroke([[EL - 20, EY - 32], [EL + 16, EY - 44]], 9); stroke([[ER + 20, EY - 32], [ER - 16, EY - 44]], 9); }
        if (f.brows === 'up') { stroke([[EL - 18, EY - 46], [EL + 18, EY - 46]], 9); stroke([[ER - 18, EY - 46], [ER + 18, EY - 46]], 9); }
        // mouth: open 0..1 talks; named shapes override
        const o = f.open || 0;
        if (f.mouth === 'grin') putM(P.p11, MX, MY + 4, 82);
        else if (f.mouth === 'laugh') putM(P.p14, MX, MY + 8, 96);
        else if (f.mouth === 'O') putM(P.p16, MX, MY + 8, 40);
        else if (f.mouth === 'scream') putM(P.p17, MX, MY + 10, 70);
        else if (f.mouth === 'tongue') putM(P.p13, MX, MY + 12, 64);
        else if (f.mouth === 'flat') stroke([[MX - 22, MY], [MX + 22, MY]], 7, '#8d3b33');
        else if (o > 0.12) putM(P.p10, MX, MY + 4 + o * 6, 30 + o * 18, 8 + o * 36);
        else putM(P.p09, MX, MY, 70);
        if (f.tears) {   // streams of tears down both cheeks; f.tearT moves the drops
          g.strokeStyle = 'rgba(120,185,235,0.9)'; g.fillStyle = 'rgba(120,185,235,0.95)'; g.lineCap = 'round';
          for (const ex of [EL, ER]) {
            g.lineWidth = 7 * es; g.beginPath(); g.moveTo(ex - 4 * es, EY + 14 * es); g.quadraticCurveTo(ex - 10 * es, EY + 45 * es, ex - 6 * es, EY + 70 * es * f.tears); g.stroke();
            const dy = ((f.tearT || 0) % 4) * 14 * es; g.beginPath(); g.ellipse(ex - 7 * es, EY + 40 * es + dy, 5 * es, 7 * es, 0, 0, Math.PI * 2); g.fill();
          }
        }
        if (f.sweat) { g.fillStyle = 'rgba(150,200,240,0.95)'; g.beginPath(); g.ellipse(ER + 52 * es, EY - 30 * es, 8 * es, 12 * es, 0, 0, Math.PI * 2); g.fill(); }
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
    /* base: a character folder (rig.json, front/, side/, back/, face/, cards.json or cards/cards.json).
       shared: the folder with the face pieces (face/p00..) and Dong's heads/; defaults to base. */
    static async load(base = '', { shared = base } = {}) {
      const R = await (await fetch(base + 'rig.json')).json();
      let C = {}; for (const u of [base + 'cards.json', base + 'cards/cards.json']) { try { const r = await fetch(u); if (r.ok) { C = await r.json(); break; } } catch (e) {} }
      const files = new Set();
      for (const v of Object.values(R.views)) for (const p of Object.values(v.pieces)) if (!p.file.startsWith('heads/')) files.add(p.file);
      for (const n of ['turn_three_q', 'turn_three_q_back']) if (C[n]) files.add(C[n].file);
      const T = {}; await Promise.all([...files].map(async f => { T[f] = await loadTex(base + f); }));
      const P = {}; await Promise.all(['p00', 'p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10', 'p11', 'p13', 'p14', 'p16', 'p17'].map(async n => { P[n] = await loadImg(shared + 'face/' + n + '.png'); }));
      const usesHeads = Object.values(R.views.front.pieces).some(p => p.file.startsWith('heads/'));
      const blank = usesHeads ? await loadImg(shared + 'face/blank_front.png') : R.face ? await loadImg(base + R.face.blank) : null;
      const sideHead = R.sideFace !== false && usesHeads && R.views.side && R.views.side.pieces.head.file === 'side/head.png' && !R.name ? await loadImg(base + 'side/head.png') : null;
      const d = new Dong(base, R, C, T, P, blank, sideHead); d.shared = shared; return d;
    }
    constructor(base, R, C, T, P, blank, sideHead) {
      this.base = base; this.R = R; this.C = C; this.T = T; this.k = (R.height_m || 1.70) / 1400; this.name = R.name || 'dong';
      this.root = new THREE.Group(); this.root.name = 'Dong';
      this.views = {}; this.joints = {}; this.markers = {}; this.facing = 1;
      this.face = { eyes: 'open', mouth: null, open: 0, blink: 0, brows: null, look: 0 };
      this.front = blank ? frontFace(blank, P, R.face || {}) : null; this.side = sideHead ? sideFace(sideHead) : null;
      for (const [vn, V] of Object.entries(R.views)) this._build(vn, V);
      // the drawn poses: one card, feet on the floor
      this.card = new THREE.Group(); this.root.add(this.card); this.cardMesh = null; this.cardCache = {};
      // the three-quarter drawings a turn passes through
      this.tcard = new THREE.Group(); this.root.add(this.tcard); this.tmesh = {};
      for (const n of ['turn_three_q', 'turn_three_q_back']) { const c = C[n]; if (!c) continue; const m = cardMesh(T[c.file], c.w, c.h, 1, this.k); m.position.y = c.h * this.k / 2; m.visible = false; this.tcard.add(m); this.tmesh[n] = m; }
      const th = R.views.side && R.views.side.pieces.thigh_near; this.thighLen = th ? th.len * this.k : 0.4;
      this.expression = null; this.headCache = {};
      this.phase = Math.random() * 20; this.time = 0; this.clip = null; this.clipT = 0; this.from = null; this.talking = false; this._nextBlink = 1 + Math.random() * 3; this._lock = null; this._v = 0;
      this.setView('front'); this.play('idle');
    }
    _build(vn, V) {
      const g = new THREE.Group(); this.root.add(g); this.views[vn] = g; const J = this.joints[vn] = {}; this.markers[vn] = [];
      const order = V.order, P = V.pieces, K = this.k;
      const make = name => {
        if (J[name]) return J[name];
        const p = P[name], joint = new THREE.Object3D(); joint.name = name; J[name] = joint;
        if (p.parent) { const par = P[p.parent]; make(p.parent).add(joint); joint.position.set((p.at[0] - par.pivot[0]) * K, -(p.at[1] - par.pivot[1]) * K, 0); }
        else { g.add(joint); joint.position.set(0, V.hip_from_floor_px * K, 0); }
        let tex, w, h, s = p.scale || 1;
        if (p.file.startsWith('heads/') || (vn === 'front' && name === 'head' && this.front)) { tex = this.front.tex; w = h = 512; }
        else if (vn === 'side' && name === 'head' && this.side) { tex = this.side.tex; [w, h] = p.size; }
        else { tex = this.T[p.file]; [w, h] = p.size; }
        const m = cardMesh(tex, w * s, h * s, p.tint || 1, K);
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
    // swap the side-view head for another drawing of the same head (e.g. 'scared': wide eyes, open mouth); null = the normal one
    async setSideHead(v) {
      const J = this.joints.side; if (!J || !J.head || this.side) return;
      const file = v ? `side/head_${v}.png` : this.R.views.side.pieces.head.file;
      if (!this.T[file]) { try { this.T[file] = await loadTex(this.base + file); } catch (e) { return; } }
      const m = J.head.userData.mesh; m.material.map = this.T[file]; m.material.needsUpdate = true;
    }
    setView(v) {
      if (v !== this.view) { this._lock = null; this._v = 0; }
      this.view = v;
      for (const [n, g] of Object.entries(this.views)) { g.visible = n === v; g.scale.x = n === 'side' ? this.facing : 1; }
      this.card.visible = v === 'card'; this.tcard.visible = false;
    }
    setFacing(f) { this._v = 0; this.facing = f >= 0 ? 1 : -1; if (this.views.side) this.views.side.scale.x = this.facing; if (this.cardMesh && this.cardFlip) this.cardMesh.scale.x = this.facing; this._lock = null; }
    /* where his hips end up after play('sit') from where he stands now: put the chair seat there */
    sitHipX() { return this.root.position.x - this.facing * this.thighLen * Math.sin(88 * D2R); }
    async setExpression(name) {
      this.expression = name;
      const m = this.joints.front.head.userData.mesh;
      if (!name) { m.material.map = m.customDepthMaterial.map = this.front.tex; m.material.needsUpdate = true; return; }
      const t = this.headCache[name] || (this.headCache[name] = await loadTex((this.shared || this.base) + 'heads/' + name + '.webp'));
      if (this.expression !== name) return;
      m.material.map = m.customDepthMaterial.map = t; m.material.needsUpdate = m.customDepthMaterial.needsUpdate = true;
    }
    async showCard(name, { flip = false } = {}) {
      const c = this.C[name]; if (!c) throw new Error('no card ' + name);
      const t = this.cardCache[name] || (this.cardCache[name] = await loadTex(this.base + c.file));
      if (this.cardMesh) this.card.remove(this.cardMesh);
      if (this.cardBody) this.card.remove(this.cardBody);
      const k = this.k; this.cardBody = new THREE.Group(); this.card.add(this.cardBody);   // pivots at the card's bottom centre, so it can rock and heave
      this.cardMesh = cardMesh(t, c.w, c.h, 1, k); this.cardMesh.position.y = c.h * k / 2; this.cardBody.add(this.cardMesh); if (this.tint) this.cardMesh.material.color.copy(this.tint);
      this.cardHead = null;
      if (c.head && this.front) {   // a headless pose: the live head goes back on at the collar, so the face can still act
        const s = 370 / 380, pv = new THREE.Object3D(); pv.position.set((c.head.at[0] - c.w / 2) * k, (c.h - c.head.at[1]) * k, 0.006);
        const hm = cardMesh(this.front.tex, 512 * s, 512 * s, 1, k); hm.position.set(0, (452 - 256) * s * k, 0); pv.add(hm); this.cardBody.add(pv); this.cardHead = pv;
        pv.userData.x0 = pv.position.x; pv.userData.y0 = pv.position.y;
        if (this.tint) hm.material.color.copy(this.tint);
      }
      this.cardFlip = flip; if (flip) this.cardBody.scale.x = this.facing;
      this.cardName = name; this._turn = null; this.setView('card'); this.play('cardIdle');
    }
    say(open) { this.face.open = clamp(open); }
    /* jolt at a sound; delay lets a room of puppets react one after another, intensity 0..2 */
    flinch(delay = 0, intensity = 1) { this._flinchAt = this.time + delay; this._flinchI = intensity; }
    /* a soft dark ellipse on the floor under the puppet (darkness 0..1) */
    addShadow(darkness = 0.45) {
      if (this.shadow) return this.shadow;
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, `rgba(0,0,0,${darkness})`); gr.addColorStop(0.6, `rgba(0,0,0,${darkness * 0.45})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
      m.rotation.x = -Math.PI / 2; m.position.y = 0.003; m.renderOrder = -1; this.root.add(m); this.shadow = m; return m;
    }
    setTint(color) {
      this.tint = new THREE.Color(color);
      this.root.traverse(o => { if (o.isMesh && o.material.userData.tint != null) o.material.color.copy(this.tint).multiplyScalar(o.material.userData.tint); });
    }
    /* turn to 'front', 'side' or 'back' (facing 1 = right, -1 = left for the side), passing through the 3/4 drawings; then play `then` */
    turn(to, facing = this.facing, then = 'idle', step = 0.13) {
      const ring = ['front', 'turn_three_q', 'side', 'turn_three_q_back', 'back'].filter(v => this.views[v] || this.tmesh[v]);
      if (!this.views[to]) return;
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
      const out = c.fn(this.clipT + (c.phased ? ((this.opts && this.opts.phase != null) ? this.opts.phase : this.phase) : 0), this.opts || {}, this) || {};   // opts.phase pins the cycle, so several puppets can step in exact unison
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
        if (this.view === 'card' && this.cardBody) {
          const b = out.body || {}, h = out.head || {}, br = 1 + 0.006 * Math.sin((this.time + this.phase) * (b.breath || 2.2));
          this.cardBody.position.set(b.x || 0, b.y || 0, 0); this.cardBody.rotation.z = (b.rz || 0) * D2R; this.cardBody.scale.y = br * (b.sy || 1);
          if (this.cardHead) { const u = this.cardHead.userData; this.cardHead.rotation.z = (h.rz || 0) * D2R; this.cardHead.position.x = u.x0 + (h.x || 0); this.cardHead.position.y = u.y0 + (h.y || 0); }
        }
      }
      if (out.speed) this.root.position.z += out.speed * dt;
      // a flinch (a knock, a bang): a quick jolt that fades, on top of whatever the clip is doing
      if (this._flinchAt != null && this.time >= this._flinchAt) {
        const e = Math.exp(-(this.time - this._flinchAt) * 7) * (this.time - this._flinchAt < 1.2 ? 1 : 0);
        const g = this.view === 'card' ? this.cardBody : vg;
        if (g) { g.position.y += 0.035 * e * this._flinchI; g.rotation.z += 0.04 * e * this._flinchI * S(this.time * 60); }
        if (e > 0.25) out.face = { ...(out.face || {}), eyes: 'wide', brows: 'up' };
      }
      // a soft contact shadow under the puppet, so it sits on the floor instead of floating
      if (this.shadow) {
        const w = this.view === 'card' && this.cardMesh ? this.cardMesh.geometry.parameters.width * 1.05 : this.view === 'side' ? 0.55 : 0.5;
        this.shadow.scale.set(w, 1, this.view === 'card' ? 0.45 : 0.32); this.shadow.position.x = this.view === 'card' && this.cardBody ? this.cardBody.position.x : 0;
      }
      // the face: blinks every 2-5 s, talking
      if (this.time > this._nextBlink) { this._blinkAt = this.time; this._nextBlink = this.time + 2 + Math.random() * 3; }
      const f = { ...this.face, ...(out.face || {}) };
      f.blink = this._blinkAt && this.time - this._blinkAt < 0.13 ? 1 : 0;
      if (this.talking) { f.open = Math.abs(Math.sin(this.time * 9.5) * Math.sin(this.time * 3.1)); if (!['laugh', 'scream'].includes(f.mouth)) f.mouth = null; }
      if (this.lip != null) { f.open = this.lip; if (this.lip > 0.08) { if (!['laugh', 'scream'].includes(f.mouth)) f.mouth = null; } else if (!f.mouth) f.mouth = 'flat'; }   // between words: a closed, flat mouth (never the default smile)   // lip sync: set .lip every frame from the voice track's loudness (null = off)
      if ((this.view === 'front' || (this.view === 'card' && this.cardHead)) && !this.expression && this.front) this.front.draw(f);
      if (this.view === 'side' && this.side) this.side.draw(f);
    }
  }

  /* ---------- clips: each returns joint angles in degrees for clip time t ('name.x' = tilt towards or away from the camera) ---------- */
  const S = Math.sin, C = Math.cos, pos = x => Math.max(0, x);
  /* how each character moves. pace: steps per second x0.9; stride/arms/knee: swing sizes; lean: forward tilt; armOut: arms held out (deg);
     elbow: how bent the elbows are; bounce: up-down in the step; head: head tilt (deg). Add a character here to give them a walk of their own. */
  const STYLE = {
    default: { pace: 1, stride: 1, arms: 1, knee: 1, lean: 1, armOut: 0, elbow: 1, bounce: 0, head: 0 },
    dong: {}, dong_home: {},
    tyler:   { pace: 1.12, stride: 1.05, arms: 1.35, knee: 1.25, lean: 0.4, bounce: 1, elbow: 1.3, head: 3 },     // loose and bouncy
    priya:   { pace: 1.08, stride: 0.85, arms: 0.6, knee: 0.8, lean: 1.4, elbow: 0.6 },                              // brisk, neat, purposeful
    marcus:  { pace: 0.84, stride: 1.15, arms: 0.8, knee: 0.85, lean: 0.6, armOut: 4, elbow: 0.7 },                  // big, slow, heavy
    kid_a:   { pace: 1.15, stride: 0.8, arms: 1.1, knee: 1.1, lean: 2, bounce: 0.6, head: -4 },                     // small quick steps, head down
    kid_b:   { pace: 0.95, stride: 0.95, arms: 0.45, knee: 0.9, lean: 0.8, elbow: 0.5 },                             // stiff, hands still
    harlow:  { pace: 0.98, stride: 0.9, arms: 0.7, knee: 0.8, lean: 0.2, elbow: 0.9, head: 1 },                      // upright, teacherly
    mom:     { pace: 1.05, stride: 0.88, arms: 0.9, knee: 0.9, lean: 1.6, elbow: 1.2, head: -2 },                    // hurried, worried
    deputy:  { pace: 0.9, stride: 1.1, arms: 0.55, knee: 0.75, lean: 0.3, armOut: 6, elbow: 0.8 },                   // measured, arms off the belt
    dawes:   { pace: 0.85, stride: 0.9, arms: 0.6, lean: 1.2, head: -2 },
    district:{ pace: 0.9, stride: 0.8, arms: 0.4, lean: 0.2, elbow: 0.6 },
  };
  const CLIPS = {
    idle: { phased: true, fn(t, o, d) {
      const b = S(t * 2.2), v = d.view;
      if (v === 'side') return { angles: { upperarm_near: 3 + b * 1.5, forearm_near: 8, upperarm_far: -3, forearm_far: 8 } };
      if (v === 'back') return { angles: { upperarmL: -3 - b, upperarmR: 3 + b, forearmL: 2, forearmR: -2 } };
      return { angles: { upperarmL: -3 - b, upperarmR: 3 + b, forearmL: 2, forearmR: -2 } };
    } },
    /* walking and running take each character's own style (STYLE below, or opts): pace, stride, arm swing, lean, knee lift, bounce, stiffness.
       They start at a random point in the step, so a line of people never steps in unison. */
    walk: { view: 'side', phased: true, fn(t, o, d) {
      const st = { ...STYLE.default, ...(STYLE[d.name] || {}), ...o }, pace = st.pace;
      const p = 2 * Math.PI * 0.9 * pace * t, A = 24 * st.stride, th = S(p), cs = C(p), kn = 36 * st.knee, ar = 18 * st.arms;
      return { lock: 'x', lean: 3 * st.lean + st.bounce * 1.5 * S(2 * p), stance: cs < 0 ? 'foot_near' : 'foot_far', angles: {
        thigh_near: A * th, shin_near: -6 - kn * pos(C(p + 0.5)) ** 1.6,
        thigh_far: -A * th, shin_far: -6 - kn * pos(-C(p + 0.5)) ** 1.6,
        upperarm_near: -ar * th + st.armOut, forearm_near: (14 + 10 * pos(-th)) * st.elbow,
        upperarm_far: ar * th + st.armOut, forearm_far: (14 + 10 * pos(th)) * st.elbow, head: st.head } };
    } },
    run: { view: 'side', phased: true, fn(t, o, d) {
      const st = { ...STYLE.default, ...(STYLE[d.name] || {}), ...o };
      const p = 2 * Math.PI * 1.45 * st.pace * t, th = S(p), cs = C(p), A = 42 * st.stride;
      return { lock: 'x', lean: 12 * st.lean, stance: cs < 0 ? 'foot_near' : 'foot_far', lift: pos(S(2 * p - 0.6)) ** 1.5 * 0.06 * st.bounce, angles: {
        thigh_near: A * th + 8, shin_near: -15 - 85 * st.knee * pos(C(p + 0.4)) ** 1.2,
        thigh_far: -A * th + 8, shin_far: -15 - 85 * st.knee * pos(-C(p + 0.4)) ** 1.2,
        upperarm_near: -45 * st.arms * th, forearm_near: 85 * st.elbow, upperarm_far: 45 * st.arms * th, forearm_far: 85 * st.elbow, head: st.head } };
    } },
    // sitting: the feet stay put and the hips go back and down onto the seat (see sitHipX); shins stay upright the whole way
    sit: { view: 'side', fn(t, o) {
      const u = clamp(t / (o.dur || 1.0)), k = ease(u);
      return { lock: 'x', lockMode: 'mean', lean: 22 * S(Math.PI * u) ** 1.2 + 4 * k, angles: {
        thigh_near: 88 * k, shin_near: -88 * k, thigh_far: 86 * k, shin_far: -86 * k,
        upperarm_near: lerp(3, 12, k) + 20 * S(Math.PI * u), forearm_near: lerp(8, 58, k), upperarm_far: lerp(-3, 10, k) + 20 * S(Math.PI * u), forearm_far: lerp(8, 58, k) } };
    } },
    // side view: lower all the way down to the floor, slowly, one hand reaching for the floor (o.dur); ends in a low crouch, hips on the heels
    crouchdown: { view: 'side', fn(t, o) {
      const k0 = ease(clamp(t / (o.dur || 2.5))), k = o.up ? 1 - k0 : k0;   // o.up: the same move backwards, standing up from the floor
      return { lock: 'x', lockMode: 'mean', lean: 34 * k, angles: {
        thigh_near: 128 * k, shin_near: -158 * k, thigh_far: 122 * k, shin_far: -150 * k,
        upperarm_near: lerp(3, 38, k), forearm_near: lerp(8, 18, k), upperarm_far: lerp(-3, 22, k), forearm_far: lerp(8, 40, k), head: -8 * k } };
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
    point: { view: 'front', fn(t, o) { return o.left ? { face: { brows: 'up' }, angles: { upperarmL: -92, forearmL: 0, upperarmR: 4, forearmR: -2 } } : { face: { brows: 'up' }, angles: { upperarmR: 92, forearmR: 0, upperarmL: -4, forearmL: 2 } }; } },   // o.left: point with the other hand (towards screen right)
    shrug: { view: 'front', fn(t) { const k = ease(clamp(t / 0.3)); return { face: { brows: 'up', mouth: 'flat' }, angles: { upperarmL: -22 * k, forearmL: 80 * k, upperarmR: 22 * k, forearmR: -80 * k } }; } },
    scared: { view: 'front', fn(t) {
      const sh = S(t * 40) * 1.2;
      return { face: { eyes: 'wide', mouth: 'O', brows: 'worried' }, angles: { upperarmL: -150 + sh, forearmL: -140, upperarmR: 150 - sh, forearmR: 140, thighL: -3, thighR: 3 } };
    } },
    // front: smooth the skirt down with both hands, two strokes from hip to thigh (o.dur = whole gesture)
    smooth: { view: 'front', fn(t, o) {
      const D = o.dur || 1.1, u = clamp(t / D), k = ease(clamp(t / 0.2)) * (1 - ease(clamp((t - D + 0.2) / 0.2))), st = pos(S(u * 2 * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5);
      return { face: { eyes: 'open', brows: 'worried', mouth: 'flat' }, angles: { upperarmL: lerp(-3, -20 + 12 * st, k), forearmL: lerp(2, -48 + 22 * st, k), upperarmR: lerp(3, 20 - 12 * st, k), forearmR: lerp(-2, 48 - 22 * st, k) } };
    } },
    talk: { fn(t, o, d) { d.talking = true; return CLIPS.idle.fn(t, o, d); } },
    // side view: knock on a door in front of them, three raps then a pause (o.rate = taps per second)
    knock: { view: 'side', fn(t, o) {
      const k = ease(clamp(t / 0.3)), r = o.rate || 4.2, c = (t - 0.3) % (o.cycle || 1.6), hit = t > 0.3 && c < 3 / r ? pos(S(c * r * 2 * Math.PI)) : 0;
      return { lean: -2, angles: { upperarm_near: 72 * k, forearm_near: (62 - 50 * hit) * k, upperarm_far: -3, forearm_far: 8, head: 4 * k } };
    } },
    // side view: reach out to a switch, a handle or a lock and hold there (o.up = arm angle, o.bend = forearm, o.dur = time to get there, o.twist adds a small turn at the end)
    reach: { view: 'side', fn(t, o) {
      const k = ease(clamp(t / (o.dur || 0.45))), tw = o.twist ? 8 * pos(S(clamp((t - (o.dur || 0.45)) / 0.3) * Math.PI)) : 0;
      return { lean: -3 * k, angles: { upperarm_near: lerp(3, o.up ?? 92, k), forearm_near: lerp(8, o.bend ?? 12, k) + tw, upperarm_far: -3, forearm_far: 8, head: (o.head ?? 6) * k } };
    } },
    // side view: slap something flat onto a window above (fast arm up, a jolt on contact, then hold)
    slap: { view: 'side', fn(t) {
      const k = ease(clamp(t / 0.16)), j = t > 0.16 && t < 0.3 ? S((t - 0.16) / 0.14 * Math.PI) : 0;
      return { lean: -4 * k + 2 * j, angles: { upperarm_near: 140 * k - 6 * j, forearm_near: 10, upperarm_far: 40 * k, forearm_far: 30 * k, head: 10 * k } };
    } },
    // front: the principal's cheerful 'Go Hawks!' fist pump
    cheer: { view: 'front', fn(t) {
      const k = ease(clamp(t / 0.25)), pump = pos(S(t * 7.5)) * 18;
      return { face: { eyes: 'happy', mouth: 'grin', brows: 'up' }, angles: { upperarmR: (150 - pump) * k + 3 * (1 - k), forearmR: (35 + pump) * k, upperarmL: -6, forearmL: 4 } };
    } },
    // to and from the camera: the legs tilt towards and away from the lens, the knee lifts on the swing, the planted foot is pinned
    walkToward: { view: 'front', phased: true, fn(t, o, d) {
      const st = { ...STYLE.default, ...(STYLE[d.name] || {}), ...o };
      const p = 2 * Math.PI * 0.9 * st.pace * t, s = S(p), c = C(p), A = 22, B = 48;
      return { lock: 'z', lean: 1.5 * s, stance: c < 0 ? 'footL' : 'footR', angles: {
        'thighL.x': -A * s, 'thighR.x': A * s, 'shinL.x': B * pos(C(p + 0.5)) ** 1.5, 'shinR.x': B * pos(-C(p + 0.5)) ** 1.5,
        upperarmL: -4, upperarmR: 4, forearmL: 3, forearmR: -3,
        'upperarmL.x': 16 * s, 'upperarmR.x': -16 * s, 'forearmL.x': -12, 'forearmR.x': -12 } };
    } },
    walkAway: { view: 'back', phased: true, fn(t, o, d) {
      const st = { ...STYLE.default, ...(STYLE[d.name] || {}), ...o };
      const p = 2 * Math.PI * 0.9 * st.pace * t, s = S(p), c = C(p), A = 22, B = 48;
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
    /* the huddle: a floor pose with a live head. mood: shake | sob | shock | rock | glance | headshake | whisper | terror | asleep | still.
       Each puppet has its own phase, so a room full of them never moves in step. */
    huddle: { view: 'card', phased: true, fn(t, o) {
      const m = o.mood || 'still', I = o.intensity ?? 1, j = (a, f) => a * I * S(t * f), tear = Math.floor(t * 5);
      const sob = Math.pow(pos(S(t * 2.3)), 3);
      const nz = (f) => (S(t * f) + 0.6 * S(t * f * 1.73 + 1.3) + 0.35 * S(t * f * 2.91 + 2.1)) / 1.95;   // irregular, never a clean sine
      switch (m) {
        case 'shiver': return { body: { x: 0.009 * I * nz(53), rz: 2.2 * I * nz(41), sy: 1 - 0.01 * I * Math.abs(nz(29)) }, head: { rz: 3.5 * I * nz(47), y: 0.003 * I * nz(37) },
                                face: { eyes: 'wide', brows: 'worried', mouth: 'flat', sweat: 1 } };
        case 'lookaround': { const ph = (t * 0.55) % 4, tgt = [0, 1, 0, -1][Math.floor(ph)], k = ease(clamp((ph % 1) * 3));
          const prev = [-1, 0, 1, 0][Math.floor(ph)], look = lerp(prev, tgt, k), up = S(t * 0.37) > 0.85 ? 1 : 0;
          return { body: { x: 0.0015 * nz(40) }, head: { rz: -7 * look, x: 0.008 * look, y: 0.006 * up }, face: { eyes: up ? 'wide' : 'open', brows: 'worried', mouth: 'flat', look } }; }
        case 'shake': return { body: { x: j(0.004, 47) + j(0.002, 31), rz: j(0.8, 39) }, head: { rz: j(1.6, 43) }, face: { eyes: 'wide', brows: 'worried', mouth: 'flat', sweat: 1 } };
        case 'sob': return { body: { sy: 1 - 0.025 * sob * I, y: -0.008 * sob }, head: { rz: 3 * S(t * 0.7), y: -0.012 * sob }, face: { eyes: 'closed', brows: 'worried', mouth: sob > 0.3 ? 'scream' : 'O', tears: 1, tearT: tear } };
        case 'terror': return { body: { x: j(0.005, 51), rz: j(1.2, 37), sy: 1 - 0.02 * sob }, head: { rz: j(2.5, 41) }, face: { eyes: 'wide', brows: 'worried', mouth: 'scream', tears: 1, tearT: tear } };
        case 'shock': { const snap = S(t * 0.4) > 0.6 ? 7 : 0; return { body: { x: j(0.0015, 60) }, head: { rz: snap }, face: { eyes: 'wide', brows: 'up', mouth: 'O', look: snap ? 1 : 0 } }; }
        case 'rock': return { body: { rz: 3.5 * I * S(t * 2.6) }, head: { rz: 2 * S(t * 2.6 + 0.4) }, face: { eyes: 'closed', brows: 'worried', mouth: 'flat' } };
        case 'glance': { const look = S(t * 0.9) > 0.3 ? 1 : S(t * 0.9) < -0.3 ? -1 : 0; return { head: { rz: -5 * look, x: 0.006 * look }, body: { x: j(0.001, 50) }, face: { eyes: 'open', brows: 'worried', mouth: 'flat', look } }; }
        case 'headshake': return { body: { x: j(0.003, 44) }, head: { rz: 10 * I * S(t * 9) }, face: { eyes: 'cry', brows: 'worried', mouth: 'scream', tears: 1, tearT: tear } };
        case 'giggle': { const g = Math.pow(pos(S(t * 3.1)), 2); return { body: { y: 0.006 * g, sy: 1 + 0.012 * g, rz: 1.2 * S(t * 6.2) * g }, head: { rz: 4 * S(t * 1.3) }, face: { eyes: 'happy', mouth: g > 0.25 ? 'laugh' : 'grin' } }; }
        case 'relief': { const h = Math.pow(pos(S(t * 2.6)), 2); return { body: { sy: 1 - 0.018 * h, y: -0.004 * h, rz: 1.5 * S(t * 5.2) * h }, head: { rz: 4 * S(t * 0.8) }, face: { eyes: 'happy', brows: 'worried', mouth: h > 0.3 ? 'laugh' : 'grin', tears: 1, tearT: tear } }; }
        case 'exhale': {   // holds her breath (o.at s into the clip), then lets it all out over o.dur s: eyes shut, lips pursed and blowing, shoulders sink; then soft relief
          const at = o.at ?? 1, u = clamp((t - at) / (o.dur ?? 1.8)), e = ease(u);
          if (t < at) return { body: { sy: 1.012, x: j(0.0012, 55) }, head: { rz: 0 }, face: { eyes: 'wide', brows: 'worried', mouth: 'flat' } };
          if (u < 1) return { body: { sy: 1.012 - 0.045 * e, y: -0.012 * e }, head: { rz: 7 * e, y: -0.006 * e }, face: { eyes: 'closed', brows: 'worried', mouth: 'O', open: 0.45 * (1 - e) + 0.12 } };
          return { body: { sy: 0.967 + 0.006 * S(t * 1.4), y: -0.012 }, head: { rz: 7 - 3 * clamp(t - at - (o.dur ?? 1.8)) }, face: { eyes: 'open', brows: 'worried', mouth: 'grin' } }; }
        case 'count': {    // eyes stepping along the row, face by face, lips moving on each number
          const n = 7, st = Math.floor(t / (o.step ?? 0.32)) % (2 * n - 2), i = st < n ? st : 2 * n - 2 - st, look = -1 + 2 * i / (n - 1);
          return { body: { x: j(0.0008, 40) }, head: { rz: -5 * look }, face: { eyes: 'open', brows: 'worried', mouth: null, look, open: 0.1 + 0.32 * Math.abs(S(t * 10) * S(t * 2.7)) } }; }
        case 'calm': return { body: { sy: 1 + 0.008 * S(t * 1.6) }, head: { rz: 2 * S(t * 0.5) }, face: { eyes: 'open', mouth: null, look: 0.4 * S(t * 0.3) } };
        case 'spooky': return { body: { rz: 2 * S(t * 1.4) }, head: { rz: -6 }, face: { eyes: 'creepy', brows: 'up', mouth: 'grin', open: 0.2 + 0.3 * Math.abs(S(t * 9)) } };
        case 'stare': { const lk = o.look ?? -1; return { body: { x: 0.0008 * S(t * 50) }, head: { rz: 4 * lk }, face: { eyes: o.blank ? 'open' : 'angry', brows: o.blank ? 'worried' : 'angry', mouth: 'flat', look: lk } }; }
        case 'lookup': return { body: { x: j(0.0015, 60) }, head: { rz: 2 * S(t * 0.7), y: 0.012 }, face: { eyes: 'wide', brows: 'up', mouth: 'O' } };
        case 'whisper': return { body: { rz: 1.5 * S(t * 1.8) }, face: { eyes: 'closed', brows: 'worried', mouth: null, open: 0.15 + 0.3 * Math.abs(S(t * 11) * S(t * 3.1)) } };
        case 'asleep': return { body: { sy: 1 + 0.012 * S(t * 1.4), breath: 0.1 }, head: { rz: 8, y: -0.01 }, face: { eyes: 'closed', mouth: 'flat' } };
        default: return { face: { brows: 'worried', mouth: 'flat' } };
      }
    } },
    /* standing, scared, each in their own way (front rig). mood: shake | hug | mouth | frozen | backaway */
    standScared: { view: 'front', phased: true, fn(t, o) {
      const m = o.mood || 'shake', I = o.intensity ?? 1, j = (a, f) => a * I * S(t * f);
      if (m === 'hug') return { lean: j(1, 40), face: { eyes: 'wide', brows: 'worried', mouth: 'flat' }, angles: { upperarmL: -25, forearmL: 120 + j(4, 37), upperarmR: 25, forearmR: -120 - j(4, 33) } };
      if (m === 'mouth') return { lean: j(0.8, 44), face: { eyes: 'wide', brows: 'worried', mouth: 'flat' }, angles: { upperarmL: -12, forearmL: 150, upperarmR: 12, forearmR: -150 } };
      if (m === 'frozen') return { face: { eyes: 'wide', brows: 'up', mouth: 'O' }, angles: { upperarmL: -6, upperarmR: 6, forearmL: 4, forearmR: -4 } };
      if (m === 'backaway') return { lean: -3 + j(1, 30), face: { eyes: 'wide', mouth: 'scream', brows: 'worried' }, angles: { upperarmL: -40, forearmL: -20, upperarmR: 40, forearmR: 20 } };
      return { lean: j(1.5, 45), face: { eyes: 'wide', brows: 'worried', mouth: 'flat', sweat: 1 }, angles: { upperarmL: -6 + j(3, 41), upperarmR: 6 - j(3, 39), forearmL: 10, forearmR: -10 } };
    } },
  };
  Dong.CLIPS = CLIPS;
  window.Dong = Dong;
})();
