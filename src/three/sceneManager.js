import * as THREE from 'three';
import { campusData, campusFeatures, getBuilding, getFloor, getRoom } from '../data/campusData.js';

export const FLOOR_H = 2.4;
const GAP_BASE = 0.14;
const GAP_EXTRA = 1.7;

function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeFacadeTexture(wallColor, windowColor, cols, rows, seed) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = rows > 1 ? 384 : 96;
  const ctx = c.getContext('2d');
  ctx.fillStyle = wallColor;
  ctx.fillRect(0, 0, c.width, c.height);
  const rnd = makeRng(seed || 5);
  const cellW = c.width / cols;
  const cellH = c.height / (rows || 1);
  for (let r = 0; r < (rows || 1); r++) {
    for (let i = 0; i < cols; i++) {
      const lit = rnd() > 0.3;
      ctx.fillStyle = lit ? windowColor : 'rgba(8,12,14,0.5)';
      if (rows > 1) {
        ctx.fillRect(i * cellW + cellW * 0.12, r * cellH + cellH * 0.2, cellW * 0.76, cellH * 0.55);
      } else {
        ctx.fillRect(i * cellW + cellW * 0.18, c.height * 0.28, cellW * 0.64, c.height * 0.46);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function addPath(scene, targetX, targetZ, factor = 0.72) {
  const dist = Math.sqrt(targetX * targetX + targetZ * targetZ) * factor;
  const angle = Math.atan2(targetX, targetZ);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.06, dist),
    new THREE.MeshStandardMaterial({ color: 0xb9af97, roughness: 1 }),
  );
  mesh.position.set((targetX * factor) / 2, 0.04, (targetZ * factor) / 2);
  mesh.rotation.y = angle;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function createTree(scene, x, z, scale, hueSeed = 0) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.2, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: '#4A3826', roughness: 1 }),
  );
  trunk.position.y = 0.6 * scale;
  trunk.castShadow = true;
  const greens = ['#4C7A5E', '#436C54', '#568569'];
  const foliage = new THREE.Mesh(
    new THREE.ConeGeometry(1.05, 2.1, 8),
    new THREE.MeshStandardMaterial({ color: greens[hueSeed % greens.length], roughness: 1 }),
  );
  foliage.position.y = 1.7 * scale;
  foliage.castShadow = true;
  g.add(trunk, foliage);
  g.scale.setScalar(scale);
  g.position.set(x, 0, z);
  scene.add(g);
}

function createDecorativeBuilding(scene, pickables, cfg) {
  const facade = makeFacadeTexture(cfg.wallColor, cfg.windowColor || '#F2C879', cfg.cols, cfg.rows, cfg.seed);
  const sideMat = new THREE.MeshStandardMaterial({ map: facade, roughness: 0.88 });
  const topMat = new THREE.MeshStandardMaterial({ color: cfg.roofColor, roughness: 0.55 });
  const botMat = new THREE.MeshStandardMaterial({ color: cfg.wallColor, roughness: 0.95 });
  const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
  const mesh = new THREE.Mesh(geo, [sideMat, sideMat, topMat, botMat, sideMat, sideMat]);
  mesh.position.set(cfg.x, cfg.h / 2, cfg.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { kind: 'feature', featureId: cfg.featureId };
  scene.add(mesh);
  pickables.push(mesh);
  addPath(scene, cfg.x, cfg.z);
  return mesh;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} hotspotLayer
 * @param {{ onFeatureClick?: (id: string) => void, onBuildingClick?: (id: string) => void, onFloorClick?: (buildingId: string, floorId: string) => void }} callbacks
 */
export function createSceneManager(canvas, hotspotLayer, callbacks = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const gradCanvas = document.createElement('canvas');
  gradCanvas.width = 8;
  gradCanvas.height = 256;
  const gctx = gradCanvas.getContext('2d');
  const grad = gctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#0A171C');
  grad.addColorStop(0.55, '#173038');
  grad.addColorStop(1, '#3E4A3F');
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 8, 256);
  scene.background = new THREE.CanvasTexture(gradCanvas);
  scene.fog = new THREE.Fog(0x16303a, 40, 120);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);

  const hemi = new THREE.HemisphereLight(0x9fc4c9, 0x2a2418, 0.78);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffd9a0, 1.05);
  sun.position.set(22, 32, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  sun.shadow.bias = -0.0012;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x6fa0c9, 0.28);
  fill.position.set(-16, 12, -10);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(75, 48),
    new THREE.MeshStandardMaterial({ color: 0x35553f, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const pickables = [];
  const slabMeshes = [];
  const roomMarkers = new THREE.Group();
  scene.add(roomMarkers);

  /** @type {Map<string, { explode: number, slabs: THREE.Mesh[], baseTotalHeight: number, crown?: THREE.Group }>} */
  const buildingRuntime = new Map();

  campusData.buildings.forEach((b, bi) => {
    const slabs = [];
    b.floors.forEach((f, fi) => {
      const cols = Math.max(3, f.rooms.length);
      const facade = makeFacadeTexture(b.wallColor, '#F2C879', cols, 1, bi * 10 + fi);
      const sideMat = new THREE.MeshStandardMaterial({ map: facade, roughness: 0.88 });
      const topMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.55 });
      const geo = new THREE.BoxGeometry(b.w, FLOOR_H - 0.15, b.d);
      const mesh = new THREE.Mesh(geo, [sideMat, sideMat, topMat, topMat, sideMat, sideMat]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { kind: 'slab', buildingId: b.id, floorId: f.id, index: fi };
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xe8a33d }),
      );
      outline.visible = false;
      mesh.add(outline);
      mesh.userData.outline = outline;
      scene.add(mesh);
      slabs.push(mesh);
      slabMeshes.push(mesh);
      pickables.push(mesh);
    });

    let crown;
    if (b.id === 'B001') {
      crown = new THREE.Group();
      const topMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.55 });
      const upperMat = new THREE.MeshStandardMaterial({
        map: makeFacadeTexture('#C2B18F', '#F2C879', 6, 3, 23),
        roughness: 0.88,
      });
      const upper = new THREE.Mesh(
        new THREE.BoxGeometry(9, 3.5, 6),
        [upperMat, upperMat, topMat, topMat, upperMat, upperMat],
      );
      upper.position.y = 1.75;
      upper.castShadow = true;
      crown.add(upper);
      crown.userData.isCrown = true;
      scene.add(crown);
    }

    const baseTotalHeight = b.floors.length * (FLOOR_H + GAP_BASE);
    buildingRuntime.set(b.id, { explode: 0, slabs, baseTotalHeight, crown });
    addPath(scene, b.x, b.z);
  });

  // Decorative campus from tour prototype
  createDecorativeBuilding(scene, pickables, {
    featureId: 'auditorium',
    x: -12,
    z: -2,
    w: 10,
    h: 5,
    d: 8,
    wallColor: '#2F5D62',
    roofColor: '#1E4448',
    cols: 6,
    rows: 2,
    seed: 47,
  });
  for (let i = -1; i <= 1; i += 2) {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 4.6, 8),
      new THREE.MeshStandardMaterial({ color: '#DDD3BC', roughness: 0.8 }),
    );
    col.position.set(-12 + i * 3.2, 2.3, 0.4);
    col.castShadow = true;
    scene.add(col);
  }

  createDecorativeBuilding(scene, pickables, {
    featureId: 'mithila',
    x: 11,
    z: 11,
    w: 7,
    h: 12,
    d: 7,
    wallColor: '#C98B84',
    roofColor: '#8C5450',
    cols: 4,
    rows: 7,
    seed: 59,
  });
  createDecorativeBuilding(scene, pickables, {
    featureId: 'nalanda',
    x: -11,
    z: 11,
    w: 7,
    h: 12,
    d: 7,
    wallColor: '#6C87A1',
    roofColor: '#3F5468',
    cols: 4,
    rows: 7,
    seed: 67,
  });
  createDecorativeBuilding(scene, pickables, {
    featureId: 'cafeteria',
    x: 16,
    z: 5,
    w: 5,
    h: 3,
    d: 5,
    wallColor: '#A9714F',
    roofColor: '#6E4A34',
    cols: 3,
    rows: 1,
    seed: 71,
  });

  const libDome = new THREE.Mesh(
    new THREE.ConeGeometry(4, 3, 16),
    new THREE.MeshStandardMaterial({ color: '#7A4636', roughness: 0.5 }),
  );
  libDome.position.set(14, 8.5, -2);
  libDome.castShadow = true;
  scene.add(libDome);

  const track = new THREE.Mesh(
    new THREE.RingGeometry(4.2, 6, 40),
    new THREE.MeshStandardMaterial({ color: '#8B4A3D', roughness: 1, side: THREE.DoubleSide }),
  );
  track.rotation.x = -Math.PI / 2;
  track.position.set(0, 0.03, 18);
  track.receiveShadow = true;
  scene.add(track);
  const infield = new THREE.Mesh(
    new THREE.CircleGeometry(4.2, 40),
    new THREE.MeshStandardMaterial({ color: '#3E6B4C', roughness: 1 }),
  );
  infield.rotation.x = -Math.PI / 2;
  infield.position.set(0, 0.02, 18);
  scene.add(infield);
  addPath(scene, 0, 18);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 0.3, 28),
    new THREE.MeshStandardMaterial({ color: '#C9C0A6', roughness: 0.9 }),
  );
  platform.position.set(0, 0.15, 2);
  platform.receiveShadow = true;
  scene.add(platform);
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, 3, 10),
    new THREE.MeshStandardMaterial({ color: '#3B3226', roughness: 0.6 }),
  );
  pillar.position.set(0, 1.8, 2);
  pillar.castShadow = true;
  scene.add(pillar);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.75, 0.13, 10, 28),
    new THREE.MeshStandardMaterial({ color: '#E8A33D', roughness: 0.3, metalness: 0.2 }),
  );
  ring.position.set(0, 3.3, 2);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  const keepOut = campusData.buildings.map((b) => [b.x, b.z, Math.max(b.w, b.d) * 0.85]);
  keepOut.push([-12, -2, 7], [11, 11, 6], [-11, 11, 6], [16, 5, 4.5], [0, 18, 8], [0, 2, 5]);
  const rnd = makeRng(101);
  let placed = 0;
  let tries = 0;
  while (placed < 28 && tries < 400) {
    tries++;
    const ang = rnd() * Math.PI * 2;
    const rad = 22 + rnd() * 20;
    const x = Math.sin(ang) * rad;
    const z = Math.cos(ang) * rad;
    if (keepOut.some((k) => Math.hypot(x - k[0], z - k[1]) < k[2])) continue;
    createTree(scene, x, z, 0.85 + rnd() * 0.45, placed);
    placed++;
  }

  const target = new THREE.Vector3(0, 3, 0);
  let theta = Math.PI * 0.62;
  let phi = 1.02;
  let radius = 48;
  const desired = { theta, phi, radius, target: target.clone() };
  const minRadius = 10;
  const maxRadius = 72;
  const minPhi = 0.42;
  const maxPhi = 1.35;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let downX = 0;
  let downY = 0;
  let lastInteraction = 0;
  let transitioning = false;
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let appState = {
    buildingId: null,
    floorId: null,
    roomId: null,
    explodeFloors: false,
    viewMode: '3d',
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function setDesiredForState() {
    if (!appState.buildingId) {
      desired.theta = Math.PI * 0.62;
      desired.phi = 1.02;
      desired.radius = 48;
      desired.target.set(0, 3, 0);
    } else {
      const b = getBuilding(appState.buildingId);
      const rt = buildingRuntime.get(b.id);
      desired.theta = Math.atan2(b.x, b.z) + 0.65;
      desired.phi = 0.92;
      if (appState.roomId && appState.floorId) {
        const fi = b.floors.findIndex((f) => f.id === appState.floorId);
        const slab = rt.slabs[fi];
        if (slab) {
          desired.radius = 16;
          desired.target.set(slab.position.x, slab.position.y, slab.position.z);
          desired.phi = 1.05;
        }
      } else if (appState.floorId) {
        const fi = b.floors.findIndex((f) => f.id === appState.floorId);
        const slab = rt.slabs[fi];
        if (slab) {
          desired.radius = Math.max(18, b.floors.length * 3.2);
          desired.target.set(b.x, slab.position.y, b.z);
        }
      } else {
        desired.radius = Math.max(20, rt.baseTotalHeight * 1.8);
        desired.target.set(b.x, Math.min(8, rt.baseTotalHeight / 2), b.z);
      }
    }
    transitioning = true;
  }

  function updateCameraPosition() {
    camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    camera.position.y = target.y + radius * Math.cos(phi);
    camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(target);
  }

  function layoutBuildings() {
    campusData.buildings.forEach((b) => {
      const rt = buildingRuntime.get(b.id);
      const shouldExplode =
        appState.explodeFloors && appState.buildingId === b.id && appState.buildingId;
      const targetExplode = shouldExplode ? 1 : 0;
      rt.explode += (targetExplode - rt.explode) * 0.09;
      let cumulative = 0;
      const gap = GAP_BASE + rt.explode * GAP_EXTRA;
      rt.slabs.forEach((mesh, idx) => {
        const y = cumulative + (FLOOR_H - 0.15) / 2;
        mesh.position.set(b.x, y, b.z);
        cumulative += FLOOR_H + gap;
        const selectedBuilding = appState.buildingId === b.id;
        const selectedFloor = selectedBuilding && appState.floorId === mesh.userData.floorId;
        mesh.userData.outline.visible = selectedFloor;
        const mats = mesh.material;
        if (Array.isArray(mats)) {
          mats.forEach((m) => {
            if (!m.userData.baseEmissive) m.userData.baseEmissive = m.emissive?.clone() || new THREE.Color(0);
            if (selectedBuilding && !appState.floorId) {
              m.emissive.set(0x332208);
            } else if (selectedFloor) {
              m.emissive.set(0x443310);
            } else {
              m.emissive.copy(m.userData.baseEmissive);
            }
          });
        }
      });
      if (rt.crown) {
        const topSlab = rt.slabs[rt.slabs.length - 1];
        rt.crown.position.set(b.x, topSlab.position.y + (FLOOR_H - 0.15) / 2 + 1.8, b.z);
        rt.crown.visible = rt.explode < 0.15 && b.id === 'B001';
      }
    });
    updateRoomMarker();
  }

  function updateRoomMarker() {
    roomMarkers.clear();
    if (!appState.buildingId || !appState.floorId || !appState.roomId) return;
    const b = getBuilding(appState.buildingId);
    const f = getFloor(b, appState.floorId);
    const r = getRoom(b, f, appState.roomId);
    if (!r) return;
    const rt = buildingRuntime.get(b.id);
    const fi = b.floors.findIndex((fl) => fl.id === f.id);
    const slab = rt.slabs[fi];
    if (!slab) return;
    const ri = f.rooms.findIndex((rm) => rm.id === r.id);
    const cols = f.rooms.length;
    const cellW = b.w / cols;
    const ox = -b.w / 2 + cellW * (ri + 0.5);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(cellW * 0.75, b.d * 0.55),
      new THREE.MeshStandardMaterial({
        color: 0xe8a33d,
        emissive: 0xe8a33d,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(slab.position.x + ox, slab.position.y + (FLOOR_H - 0.15) / 2 + 0.02, slab.position.z);
    roomMarkers.add(plane);
  }

  const buildingMarkerEls = campusData.buildings.map((b) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'hotspot building-marker';
    el.textContent = b.name;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onBuildingClick?.(b.id);
    });
    hotspotLayer.appendChild(el);
    const rt = buildingRuntime.get(b.id);
    return {
      el,
      getPos: () => new THREE.Vector3(b.x, rt.baseTotalHeight + 1.2, b.z),
    };
  });

  const floorMarkerEls = [];
  campusData.buildings.forEach((b) => {
    const rt = buildingRuntime.get(b.id);
    b.floors.forEach((f, idx) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hotspot';
      el.textContent = f.label;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onFloorClick?.(b.id, f.id);
      });
      hotspotLayer.appendChild(el);
      floorMarkerEls.push({ el, buildingId: b.id, floorId: f.id, mesh: rt.slabs[idx], w: b.w });
    });
  });

  const tmpVec = new THREE.Vector3();
  function updateMarkers() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    buildingMarkerEls.forEach((m) => {
      if (appState.buildingId) {
        m.el.style.display = 'none';
        return;
      }
      tmpVec.copy(m.getPos());
      tmpVec.project(camera);
      if (tmpVec.z > 1 || Math.abs(tmpVec.x) > 1.15 || Math.abs(tmpVec.y) > 1.15) {
        m.el.style.display = 'none';
        return;
      }
      m.el.style.display = 'block';
      m.el.style.left = `${(tmpVec.x * 0.5 + 0.5) * w}px`;
      m.el.style.top = `${(-tmpVec.y * 0.5 + 0.5) * h}px`;
    });
    floorMarkerEls.forEach((m) => {
      if (!appState.explodeFloors || appState.buildingId !== m.buildingId) {
        m.el.style.display = 'none';
        return;
      }
      tmpVec.set(m.mesh.position.x + m.w / 2 + 0.9, m.mesh.position.y, m.mesh.position.z);
      tmpVec.project(camera);
      if (tmpVec.z > 1 || Math.abs(tmpVec.x) > 1.2 || Math.abs(tmpVec.y) > 1.2) {
        m.el.style.display = 'none';
        return;
      }
      m.el.style.display = 'block';
      m.el.style.left = `${(tmpVec.x * 0.5 + 0.5) * w}px`;
      m.el.style.top = `${(-tmpVec.y * 0.5 + 0.5) * h}px`;
    });
  }

  function onPointerDown(e) {
    isDragging = true;
    transitioning = false;
    lastX = e.clientX;
    lastY = e.clientY;
    downX = e.clientX;
    downY = e.clientY;
    lastInteraction = performance.now();
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    theta -= dx * 0.0055;
    phi -= dy * 0.0045;
    phi = Math.max(minPhi, Math.min(maxPhi, phi));
    lastInteraction = performance.now();
  }
  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    if (Math.hypot(dx, dy) < 6) handleClick(e);
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (!hits.length) return;
    const ud = hits[0].object.userData;
    if (ud.kind === 'slab') {
      if (!appState.buildingId || appState.buildingId !== ud.buildingId) {
        callbacks.onBuildingClick?.(ud.buildingId);
      } else if (appState.explodeFloors) {
        callbacks.onFloorClick?.(ud.buildingId, ud.floorId);
      }
    } else if (ud.kind === 'feature') {
      callbacks.onFeatureClick?.(ud.featureId);
    }
  }

  function onWheel(e) {
    e.preventDefault();
    transitioning = false;
    radius += e.deltaY * 0.028;
    radius = Math.max(minRadius, Math.min(maxRadius, radius));
    lastInteraction = performance.now();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  let raf = 0;
  let firstFrame = true;
  function animate(now) {
    raf = requestAnimationFrame(animate);
    if (transitioning) {
      theta += (desired.theta - theta) * 0.07;
      phi += (desired.phi - phi) * 0.07;
      radius += (desired.radius - radius) * 0.07;
      target.lerp(desired.target, 0.07);
      if (
        Math.abs(desired.theta - theta) < 0.003 &&
        Math.abs(desired.radius - radius) < 0.05
      ) {
        transitioning = false;
      }
    } else if (
      !isDragging &&
      !appState.buildingId &&
      now - lastInteraction > 2600 &&
      !reduceMotion
    ) {
      theta += 0.00035;
    }
    layoutBuildings();
    updateCameraPosition();
    renderer.render(scene, camera);
    if (appState.viewMode === '3d') updateMarkers();
    if (firstFrame) {
      firstFrame = false;
      canvas.classList.add('ready');
    }
  }

  function resize(width, height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function applyState(next) {
    appState = { ...appState, ...next };
    setDesiredForState();
  }

  function resetCameraCampus() {
    appState = {
      buildingId: null,
      floorId: null,
      roomId: null,
      explodeFloors: false,
      viewMode: appState.viewMode,
    };
    setDesiredForState();
  }

  raf = requestAnimationFrame(animate);

  return {
    resize,
    applyState,
    resetCameraCampus,
    getState: () => ({ ...appState }),
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
    },
  };
}

export function getFeatureById(id) {
  return campusFeatures.find((f) => f.id === id);
}
