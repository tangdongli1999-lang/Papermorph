/* set.js: turn a painted background plate into a 2.5D room the puppets can sit in.

   The plate is projected from a reference camera onto two real surfaces, a floor (y = 0) and a back wall (z = -zWall),
   so from that camera it looks exactly like the painting, the puppets stand and sit ON the floor (with shadows), and a
   small camera move gives real parallax. Furniture comes in as cut-out cards placed in 3D, in front of or behind people.

   const set = buildSet(scene, { img, fov: 40, h: 1.0, pitch: 18, zWall: 4, horizon: 0.6 });   // horizon: where the wall meets the floor (0 top .. 1 bottom)
   set.camera   -> the reference camera (use it, or copy it and move a little)
   addProp(scene, { img, height: 0.75, x, z, tint })                                                     */
(function () {
  const loader = new THREE.TextureLoader();
  function projected(geo, cam, toWorld) {
    // give each vertex the plate UV it would have when seen through the reference camera
    const pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i); toWorld(v); v.project(cam);
      uv.setXY(i, (v.x + 1) / 2, (v.y + 1) / 2);
    }
    uv.needsUpdate = true;
  }
  window.buildSet = function (scene, o) {
    const W = o.aspect || 16 / 9;
    const cam = new THREE.PerspectiveCamera(o.fov || 40, W, 0.05, 100);
    cam.position.set(o.x || 0, o.h ?? 1.0, o.camZ ?? 0); cam.rotation.set(-(o.pitch ?? 18) * Math.PI / 180, 0, 0, 'YXZ'); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    // put the wall where the painted floor line is: the floor point seen at screen height `horizon`
    const ndcY = 1 - 2 * (o.horizon ?? 0.6), ray = new THREE.Vector3(0, ndcY, 0.5).unproject(cam).sub(cam.position).normalize();
    const zWall = o.zWall ?? (cam.position.z + ray.z * (cam.position.y / -ray.y));
    const tex = loader.load(o.img); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(o.tint ?? 0xffffff) });
    const span = 40;
    const floorGeo = new THREE.PlaneGeometry(span, Math.abs(zWall) + 6, 80, 60);
    const floor = new THREE.Mesh(floorGeo, mat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, (zWall + 6) / 2); floor.updateMatrixWorld();
    projected(floorGeo, cam, v => v.applyMatrix4(floor.matrixWorld));
    const wallGeo = new THREE.PlaneGeometry(span, 12, 80, 40);
    const wall = new THREE.Mesh(wallGeo, mat); wall.position.set(0, 6, zWall); wall.updateMatrixWorld();
    projected(wallGeo, cam, v => v.applyMatrix4(wall.matrixWorld));
    floor.renderOrder = wall.renderOrder = -10; scene.add(floor, wall);
    // floor point under a screen position (u, v from the top-left, 0..1)
    const floorAt = (u, v) => { const r = new THREE.Vector3(u * 2 - 1, 1 - 2 * v, 0.5).unproject(cam).sub(cam.position).normalize(); const k = cam.position.y / -r.y; return new THREE.Vector3(cam.position.x + r.x * k, 0, cam.position.z + r.z * k); };
    // side walls (corridors): `at` is a screen point on the line where that wall meets the floor
    const sides = [];
    for (const sd of o.sides || []) {
      const x = sd.x ?? floorAt(...sd.at).x, len = Math.abs(zWall - cam.position.z) + 4;
      const g = new THREE.PlaneGeometry(len, 12, 60, 40), m = new THREE.Mesh(g, mat);
      m.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; m.position.set(x, 6, (zWall + cam.position.z + 4) / 2); m.updateMatrixWorld();
      projected(g, cam, v => v.applyMatrix4(m.matrixWorld)); m.renderOrder = -10; scene.add(m); sides.push(m);
    }
    // holdouts: pieces of the painting itself (a desk, a bed, a railing) cut out by a mask and stood up at their own depth,
    // so a puppet placed behind them is hidden by them. `base` is the screen v of where the piece touches the floor.
    const holdouts = [];
    for (const hd of o.holdouts || []) {
      const z = hd.z ?? floorAt(hd.u ?? 0.5, hd.base).z - (hd.back || 0);
      const mtex = loader.load(hd.mask); mtex.wrapS = mtex.wrapT = THREE.ClampToEdgeWrapping;
      const hm = new THREE.MeshBasicMaterial({ map: tex, alphaMap: mtex, transparent: true, alphaTest: 0.5, color: mat.color, side: THREE.DoubleSide });
      const g = new THREE.PlaneGeometry(span, 12, 80, 40), m = new THREE.Mesh(g, hm); m.position.set(0, 6, z); m.updateMatrixWorld();
      projected(g, cam, v => v.applyMatrix4(m.matrixWorld)); scene.add(m); holdouts.push(m);
    }
    return { camera: cam, zWall, floor, wall, sides, holdouts, floorAt, material: mat };
  };
  window.addProp = function (scene, o) {
    const t = loader.load(o.img, tx => { const m = mesh; const ar = tx.image.width / tx.image.height; m.scale.set(o.height * ar, o.height, 1); m.position.y = o.height / 2 + (o.y || 0); });
    t.encoding = THREE.sRGBEncoding;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, color: new THREE.Color(o.tint ?? 0xffffff) }));
    mesh.position.set(o.x || 0, o.height / 2, o.z || 0); if (o.flip) mesh.rotation.y = Math.PI; scene.add(mesh); return mesh;
  };
})();
