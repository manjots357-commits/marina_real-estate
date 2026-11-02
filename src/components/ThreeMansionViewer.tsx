import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Layers, Eye, Sun, Compass, Maximize2 } from 'lucide-react';

interface ThreeMansionViewerProps {
  currentLevelIndex?: number;
  onSelectLevel?: (index: number) => void;
  className?: string;
  showBadge?: boolean;
}

// Pre-allocated scratch objects for zero GC in render loop
const _vec3 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3(28, 22, 35);
const _targetLookAt = new THREE.Vector3(0, 10, 0);
const _currentLookAt = new THREE.Vector3(0, 10, 0);

export const ThreeMansionViewer: React.FC<ThreeMansionViewerProps> = ({
  currentLevelIndex = 0,
  onSelectLevel,
  className = '',
  showBadge = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0);
  const [lightingMode, setLightingMode] = useState<'cyber' | 'neon' | 'twilight'>('cyber');
  const [autoRotate, setAutoRotate] = useState(true);
  const [activePreset, setActivePreset] = useState<'tower' | 'level36' | 'level48' | 'level64' | 'helipad'>('tower');

  // References to keep animation loop intact across re-renders
  const stateRef = useRef({
    explodedAmount: 0,
    lightingMode: 'cyber',
    autoRotate: true,
    activePreset: 'tower',
    isPointerDown: false,
    pointerX: 0,
    pointerY: 0,
    orbitTheta: 0.6,
    orbitPhi: 1.1,
    orbitRadius: 45,
  });

  useEffect(() => {
    stateRef.current.explodedAmount = explodedAmount;
    stateRef.current.lightingMode = lightingMode;
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.activePreset = activePreset;
  }, [explodedAmount, lightingMode, autoRotate, activePreset]);

  // Sync with prop when parent updates level
  useEffect(() => {
    if (currentLevelIndex === 0) setPreset('level36');
    else if (currentLevelIndex === 1) setPreset('level48');
    else if (currentLevelIndex === 2) setPreset('level64');
    else if (currentLevelIndex === 3) setPreset('tower');
  }, [currentLevelIndex]);

  const setPreset = (preset: 'tower' | 'level36' | 'level48' | 'level64' | 'helipad') => {
    setActivePreset(preset);
    stateRef.current.activePreset = preset;

    if (preset === 'tower') {
      _targetCamPos.set(30, 20, 36);
      _targetLookAt.set(0, 10, 0);
    } else if (preset === 'level36') {
      _targetCamPos.set(16, 12, 18);
      _targetLookAt.set(0, 8, 0);
      onSelectLevel?.(0);
    } else if (preset === 'level48') {
      _targetCamPos.set(14, 18, 16);
      _targetLookAt.set(2, 14, 0);
      onSelectLevel?.(1);
    } else if (preset === 'level64') {
      _targetCamPos.set(12, 25, 14);
      _targetLookAt.set(0, 22, 0);
      onSelectLevel?.(2);
    } else if (preset === 'helipad') {
      _targetCamPos.set(0, 32, 12);
      _targetLookAt.set(0, 25, 0);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Scene and Camera with Deep Dark Navy Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040914, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(30, 22, 38);

    // Procedural RoomEnvironment for Studio PBR Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Cyber Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x09152b, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x040914, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xe0f7ff, 2.5);
    keyLight.position.set(25, 45, 20);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 120;
      keyLight.shadow.camera.left = -25;
      keyLight.shadow.camera.right = 25;
      keyLight.shadow.camera.top = 25;
      keyLight.shadow.camera.bottom = -25;
    }
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    cyanRimLight.position.set(-25, 20, -25);
    scene.add(cyanRimLight);

    const accentPointLight = new THREE.PointLight(0x00f0ff, 2.8, 35);
    accentPointLight.position.set(0, 18, 5);
    scene.add(accentPointLight);

    // --- PROCEDURAL ARCHITECTURAL MANSION MODEL ---
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    // PBR Materials: Neon Cyan Titanium Trim, Deep Obsidian Basalt, Cyber Glass
    const cyanTrimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
    });

    const darkBasaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x091020,
      metalness: 0.35,
      roughness: 0.8,
    });

    const architecturalGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x70f3ff,
      metalness: 0.15,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75,
      transmission: isSoftwareGl ? 0 : 0.85,
      ior: 1.52,
    });

    const warmInteriorMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0088cc,
      metalness: 0.1,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.8,
      transparent: true,
      opacity: 0.85,
    });

    // Part 1: Ground Water Basin & Mirror Pedestal
    const groundBasinGeo = new THREE.CylinderGeometry(18, 19, 0.6, 48);
    const groundBasin = new THREE.Mesh(groundBasinGeo, darkBasaltMaterial);
    groundBasin.position.y = -0.3;
    groundBasin.receiveShadow = !isSoftwareGl;
    towerGroup.add(groundBasin);

    const waterPlazaGeo = new THREE.CircleGeometry(17.5, 48);
    const waterPlaza = new THREE.Mesh(waterPlazaGeo, waterMaterial);
    waterPlaza.rotation.x = -Math.PI / 2;
    waterPlaza.position.y = 0.02;
    towerGroup.add(waterPlaza);

    // Part 2: Podium Grand Entrance with Cantilevered Louvers
    const podiumGroup = new THREE.Group();
    const podiumBaseGeo = new THREE.BoxGeometry(14, 3, 14);
    const podiumBase = new THREE.Mesh(podiumBaseGeo, darkBasaltMaterial);
    podiumBase.position.y = 1.5;
    podiumBase.castShadow = !isSoftwareGl;
    podiumGroup.add(podiumBase);

    // Decorative Neon Louvers along Podium
    for (let i = -6; i <= 6; i += 2) {
      const louverGeo = new THREE.BoxGeometry(0.12, 3.2, 14.4);
      const louver = new THREE.Mesh(louverGeo, cyanTrimMaterial);
      louver.position.set(i, 1.6, 0);
      podiumGroup.add(louver);
    }
    towerGroup.add(podiumGroup);

    // Part 3: Level 36 Lower Tier (The Vista Sky Lounge)
    const level36Group = new THREE.Group();
    level36Group.position.y = 3.5;

    const floorPlate36Geo = new THREE.BoxGeometry(11, 0.4, 11);
    const floorPlate36 = new THREE.Mesh(floorPlate36Geo, cyanTrimMaterial);
    level36Group.add(floorPlate36);

    const glassAtrium36Geo = new THREE.BoxGeometry(10, 4.5, 10);
    const glassAtrium36 = new THREE.Mesh(glassAtrium36Geo, architecturalGlassMaterial);
    glassAtrium36.position.y = 2.25;
    level36Group.add(glassAtrium36);

    // Glowing interior core
    const core36Geo = new THREE.BoxGeometry(5, 4.3, 5);
    const core36 = new THREE.Mesh(core36Geo, warmInteriorMaterial);
    core36.position.y = 2.25;
    level36Group.add(core36);

    // Cantilevered outdoor living deck on Level 36
    const deck36Geo = new THREE.BoxGeometry(4.5, 0.25, 4);
    const deck36 = new THREE.Mesh(deck36Geo, darkBasaltMaterial);
    deck36.position.set(6, 0.5, 2);
    level36Group.add(deck36);

    towerGroup.add(level36Group);

    // Part 4: Level 48 Middle Tier with Cantilevered Infinity Pool
    const level48Group = new THREE.Group();
    level48Group.position.y = 8.5;

    const floorPlate48Geo = new THREE.BoxGeometry(9.5, 0.4, 9.5);
    const floorPlate48 = new THREE.Mesh(floorPlate48Geo, cyanTrimMaterial);
    level48Group.add(floorPlate48);

    const glassAtrium48Geo = new THREE.BoxGeometry(8.5, 5, 8.5);
    const glassAtrium48 = new THREE.Mesh(glassAtrium48Geo, architecturalGlassMaterial);
    glassAtrium48.position.y = 2.5;
    level48Group.add(glassAtrium48);

    const core48Geo = new THREE.BoxGeometry(4.2, 4.8, 4.2);
    const core48 = new THREE.Mesh(core48Geo, warmInteriorMaterial);
    core48.position.y = 2.5;
    level48Group.add(core48);

    // Cantilevered Infinity Pool
    const poolExtGeo = new THREE.BoxGeometry(6.5, 0.9, 3.2);
    const poolTrough = new THREE.Mesh(poolExtGeo, darkBasaltMaterial);
    poolTrough.position.set(5.5, 1.2, -1.5);
    poolTrough.castShadow = !isSoftwareGl;
    level48Group.add(poolTrough);

    const poolWaterGeo = new THREE.BoxGeometry(6.2, 0.15, 2.9);
    const poolWater = new THREE.Mesh(poolWaterGeo, waterMaterial);
    poolWater.position.set(5.5, 1.6, -1.5);
    level48Group.add(poolWater);

    // Glass safety rim
    const poolGlassGeo = new THREE.BoxGeometry(6.4, 0.8, 0.1);
    const poolGlassFront = new THREE.Mesh(poolGlassGeo, architecturalGlassMaterial);
    poolGlassFront.position.set(5.5, 2.0, 0.1);
    level48Group.add(poolGlassFront);

    towerGroup.add(level48Group);

    // Part 5: Level 64 Crown Penthouse & Triplex Observatory
    const level64Group = new THREE.Group();
    level64Group.position.y = 14.5;

    const floorPlate64Geo = new THREE.BoxGeometry(8, 0.4, 8);
    const floorPlate64 = new THREE.Mesh(floorPlate64Geo, cyanTrimMaterial);
    level64Group.add(floorPlate64);

    const glassPenthouseGeo = new THREE.CylinderGeometry(3.6, 4.2, 5.5, 24);
    const glassPenthouse = new THREE.Mesh(glassPenthouseGeo, architecturalGlassMaterial);
    glassPenthouse.position.y = 2.75;
    level64Group.add(glassPenthouse);

    const penthouseCoreGeo = new THREE.CylinderGeometry(1.8, 2.2, 5.2, 16);
    const penthouseCore = new THREE.Mesh(penthouseCoreGeo, warmInteriorMaterial);
    penthouseCore.position.y = 2.75;
    level64Group.add(penthouseCore);

    // Sculptural Crown Arches in Neon Cyan
    for (let a = 0; a < 4; a++) {
      const archGeo = new THREE.BoxGeometry(0.2, 6.2, 8.4);
      const arch = new THREE.Mesh(archGeo, cyanTrimMaterial);
      arch.rotation.y = (a * Math.PI) / 4;
      arch.position.y = 3;
      level64Group.add(arch);
    }

    towerGroup.add(level64Group);

    // Part 6: Rooftop Helipad & Illuminated Beacon
    const helipadGroup = new THREE.Group();
    helipadGroup.position.y = 21;

    const helipadBaseGeo = new THREE.CylinderGeometry(4.5, 4.2, 0.4, 32);
    const helipadBase = new THREE.Mesh(helipadBaseGeo, darkBasaltMaterial);
    helipadGroup.add(helipadBase);

    // Helipad Cyan Marking Ring
    const ringGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    const ring = new THREE.Mesh(ringGeo, cyanTrimMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.22;
    helipadGroup.add(ring);

    // Cyan "H" Marker
    const hBar1Geo = new THREE.PlaneGeometry(0.3, 2.4);
    const hBar1 = new THREE.Mesh(hBar1Geo, cyanTrimMaterial);
    hBar1.rotation.x = -Math.PI / 2;
    hBar1.position.set(-0.7, 0.22, 0);
    helipadGroup.add(hBar1);

    const hBar2 = new THREE.Mesh(hBar1Geo, cyanTrimMaterial);
    hBar2.rotation.x = -Math.PI / 2;
    hBar2.position.set(0.7, 0.22, 0);
    helipadGroup.add(hBar2);

    const hCrossGeo = new THREE.PlaneGeometry(1.4, 0.3);
    const hCross = new THREE.Mesh(hCrossGeo, cyanTrimMaterial);
    hCross.rotation.x = -Math.PI / 2;
    hCross.position.set(0, 0.22, 0);
    helipadGroup.add(hCross);

    // Beacon Spire
    const spireGeo = new THREE.ConeGeometry(0.4, 4, 16);
    const spire = new THREE.Mesh(spireGeo, cyanTrimMaterial);
    spire.position.y = 2.4;
    helipadGroup.add(spire);

    towerGroup.add(helipadGroup);

    // Soft Radial Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(42, 42);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020610,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.32;
    scene.add(shadowPlane);

    // Pointer Interaction Handling for Damped Orbital View
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      stateRef.current.isPointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      stateRef.current.pointerX = clientX;
      stateRef.current.pointerY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!stateRef.current.isPointerDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - stateRef.current.pointerX;
      const deltaY = clientY - stateRef.current.pointerY;
      stateRef.current.pointerX = clientX;
      stateRef.current.pointerY = clientY;

      stateRef.current.orbitTheta -= deltaX * 0.006;
      stateRef.current.orbitPhi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, stateRef.current.orbitPhi + deltaY * 0.005));
    };

    const handlePointerUp = () => {
      stateRef.current.isPointerDown = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop with Exponential Damping & Zero GC
    let frameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const state = stateRef.current;

      // Auto rotation when not interacting
      if (state.autoRotate && !state.isPointerDown) {
        state.orbitTheta += delta * 0.12;
      }

      // Smooth camera position damping
      if (state.activePreset === 'tower') {
        const x = state.orbitRadius * Math.sin(state.orbitPhi) * Math.sin(state.orbitTheta);
        const y = state.orbitRadius * Math.cos(state.orbitPhi) + 8;
        const z = state.orbitRadius * Math.sin(state.orbitPhi) * Math.cos(state.orbitTheta);
        _targetCamPos.set(x, y, z);
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 3.5, delta);

      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 4.0, delta);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 4.0, delta);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 4.0, delta);
      camera.lookAt(_currentLookAt);

      // Smooth Exploded View Layer Separation
      const explodeY = state.explodedAmount * 5;
      level36Group.position.y = THREE.MathUtils.damp(level36Group.position.y, 3.5 + explodeY * 0.4, 4.5, delta);
      level48Group.position.y = THREE.MathUtils.damp(level48Group.position.y, 8.5 + explodeY * 1.0, 4.5, delta);
      level64Group.position.y = THREE.MathUtils.damp(level64Group.position.y, 14.5 + explodeY * 1.8, 4.5, delta);
      helipadGroup.position.y = THREE.MathUtils.damp(helipadGroup.position.y, 21.0 + explodeY * 2.6, 4.5, delta);

      // Subtle water shimmer
      waterPlaza.rotation.z += delta * 0.05;
      poolWater.position.y = 1.6 + Math.sin(clock.getElapsedTime() * 2) * 0.02;

      // Adjust lighting environment
      if (state.lightingMode === 'cyber') {
        keyLight.color.setHex(0xe0f7ff);
        cyanRimLight.color.setHex(0x00f0ff);
        renderer.toneMappingExposure = 1.25;
      } else if (state.lightingMode === 'neon') {
        keyLight.color.setHex(0x38bdf8);
        cyanRimLight.color.setHex(0x70f3ff);
        renderer.toneMappingExposure = 1.4;
      } else if (state.lightingMode === 'twilight') {
        keyLight.color.setHex(0x93c5fd);
        cyanRimLight.color.setHex(0x0284c7);
        renderer.toneMappingExposure = 1.15;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

      {/* Top Left Spec Badge */}
      {showBadge && (
        <div className="absolute top-24 left-6 z-10 pointer-events-none">
          <div className="bg-[#0B172E]/90 border border-[#00F0FF]/40 px-4 py-2.5 rounded-sm shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <p className="text-[10px] tracking-[0.25em] text-[#00F0FF] uppercase font-semibold">
              Interactive 3D Architectural Model (Demo Concept)
            </p>
            <h4 className="text-sm font-serif-luxury text-[#F0F6FC] tracking-wider mt-0.5">
              Contemporary Architectural Estate Model
            </h4>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock */}
      <div
        className="absolute z-20 transition-all duration-300 ease-out"
        style={{
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'min(940px, 94vw)',
          width: '100%',
        }}
      >
        {/* Toggle Collapse Button */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0B172E] hover:bg-[#102242] text-[#00F0FF] border border-[#00F0FF]/40 rounded-t-sm text-[11px] tracking-wider uppercase font-medium shadow-lg transition-colors cursor-pointer"
          >
            {isHudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Floating Glassmorphic Dock Container */}
        {!isHudCollapsed && (
          <div className="bg-[#0B172E]/95 border border-[#00F0FF]/35 rounded-sm p-3.5 shadow-[0_0_30px_rgba(0,240,255,0.15)] text-xs backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              {/* Camera Perspective Preset Buttons */}
              <div className="md:col-span-2">
                <span className="text-[10px] text-[#00F0FF]/90 tracking-widest uppercase block mb-1.5 font-semibold">
                  Architectural Perspectives
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: 'tower', label: 'Exterior' },
                    { id: 'level36', label: 'Lvl 36' },
                    { id: 'level48', label: 'Lvl 48' },
                    { id: 'level64', label: 'Lvl 64' },
                    { id: 'helipad', label: 'Helipad' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreset(p.id as any)}
                      className={`px-1.5 py-1.5 text-center font-medium tracking-wider rounded-xs border transition-all cursor-pointer ${
                        activePreset === p.id
                          ? 'bg-[#00F0FF] text-[#040914] border-[#00F0FF] font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'bg-[#060D1E] text-[#F0F6FC] border-[#00F0FF]/25 hover:border-[#00F0FF]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exploded View Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-[#00F0FF]/90 tracking-widest uppercase flex items-center gap-1 font-semibold">
                    <Layers className="w-3 h-3 text-[#00F0FF]" /> Floor Explode
                  </span>
                  <span className="text-[10px] text-[#00F0FF] font-mono">{Math.round(explodedAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedAmount}
                  onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#060D1E] accent-[#00F0FF] cursor-pointer rounded-lg"
                />
              </div>

              {/* Lighting Mode & Auto-Orbit Toggle */}
              <div>
                <span className="text-[10px] text-[#00F0FF]/90 tracking-widest uppercase block mb-1.5 font-semibold">
                  Lighting & Orbit
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLightingMode(lightingMode === 'cyber' ? 'neon' : lightingMode === 'neon' ? 'twilight' : 'cyber')}
                    className="flex-1 py-1.5 px-2 bg-[#060D1E] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-[#F0F6FC] rounded-xs text-[10px] flex items-center justify-center gap-1 tracking-wider uppercase cursor-pointer"
                  >
                    <Sun className="w-3 h-3 text-[#00F0FF]" />
                    {lightingMode}
                  </button>

                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`py-1.5 px-2.5 border rounded-xs text-[10px] flex items-center gap-1 tracking-wider uppercase cursor-pointer transition-colors ${
                      autoRotate
                        ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-[#060D1E] border-[#00F0FF]/30 text-slate-400'
                    }`}
                  >
                    <Compass className="w-3 h-3 text-[#00F0FF]" />
                    Orbit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
