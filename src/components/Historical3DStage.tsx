import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Camera,
  Sparkles,
  ExternalLink,
  MapPin,
  UserCheck,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sun,
  Eye,
} from 'lucide-react';
import {
  PA_HISTORICAL_3D_STAGES,
  DEFAULT_COMMONWEALTH_3D_STAGE,
  County3DStageConfig,
  Historical3DCharacter,
  StageThemeType,
  getHistorical3DStageForCounty,
} from '../data/paHistorical3DCharacters';
import { ALL_COUNTIES_LIST, CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import AudioNarratorWidget from './AudioNarratorWidget';
import { useTranslation } from '../context/LanguageContext';

interface Historical3DStageProps {
  selectedCountyName?: string | null;
  onSelectCounty?: (county: CountyRecord) => void;
  onCaptureSnapshotForPdf?: (dataUrl: string, caption: string) => void;
  compactMode?: boolean;
}

interface ProjectedCalloutPos {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  label: string;
  detail: string;
}

/**
 * Generates a procedural canvas texture for marble, stone, steel, or portrait fallback
 */
function createProceduralSurfaceTexture(
  kind: 'marble_cream' | 'marble_black' | 'battlefield_turf' | 'bessemer_steel'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (kind === 'marble_cream') {
    ctx.fillStyle = '#EAE4D7';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(180, 165, 140, 0.32)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * 31) % 512);
      ctx.bezierCurveTo(
        170,
        ((i * 53) % 512) + 30,
        340,
        ((i * 29) % 512) - 30,
        512,
        (i * 41) % 512
      );
      ctx.stroke();
    }
  } else if (kind === 'marble_black') {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * 37) % 512);
      ctx.bezierCurveTo(
        160,
        ((i * 61) % 512) - 25,
        350,
        ((i * 43) % 512) + 25,
        512,
        (i * 29) % 512
      );
      ctx.stroke();
    }
  } else if (kind === 'battlefield_turf') {
    ctx.fillStyle = '#2E4028';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(65,92,52,0.35)' : 'rgba(32,45,26,0.35)';
      ctx.fillRect((i * 73) % 512, (i * 41) % 512, 6, 6);
    }
  } else {
    // bessemer_steel
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 512; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, x);
      ctx.lineTo(512, x);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

/**
 * Creates a metallic brass nameplate texture for each character's pedestal
 */
function createNameplateTexture(name: string, years: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#09111E';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 256, 50);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(years, 256, 92);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates a procedural portrait medallion fallback texture with initials & colonial frame
 */
function createMedallionFallbackTexture(char: Historical3DCharacter): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#1E3A8A');
  grad.addColorStop(1, '#09111E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 128, 116, 0, Math.PI * 2);
  ctx.stroke();

  const initials = char.name
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 68px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 128, 118);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(char.years, 128, 182);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates the 13-Star Betsy Ross American Flag texture
 */
function createBetsyRossFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  const stripeH = 320 / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#B22234' : '#F8FAFC';
    ctx.fillRect(0, i * stripeH, 512, stripeH + 1);
  }

  // Blue canton
  const cantonW = 210;
  const cantonH = stripeH * 7;
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(0, 0, cantonW, cantonH);

  // 13 stars in a circle
  const cx = cantonW / 2;
  const cy = cantonH / 2;
  const radius = 58;
  ctx.fillStyle = '#F8FAFC';
  for (let i = 0; i < 13; i++) {
    const angle = (i / 13) * Math.PI * 2 - Math.PI / 2;
    const sx = cx + Math.cos(angle) * radius;
    const sy = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(sx, sy, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds the 3D Environmental Stage Pedestal based on town/county theme
 */
function buildStageEnvironment(
  theme: StageThemeType,
  textures: THREE.Texture[],
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[]
): { group: THREE.Group; embersMesh: THREE.InstancedMesh | null } {
  const group = new THREE.Group();
  let embersMesh: THREE.InstancedMesh | null = null;

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  // Base circular museum platform
  const surfaceKind =
    theme === 'philadelphia_marble'
      ? 'marble_cream'
      : theme === 'gettysburg_stone'
      ? 'battlefield_turf'
      : theme === 'industrial_steel'
      ? 'bessemer_steel'
      : 'marble_black';

  const topTex = trackTex(createProceduralSurfaceTexture(surfaceKind));
  const plinthMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: topTex,
      roughness: theme === 'gettysburg_stone' ? 0.85 : 0.32,
      metalness: theme === 'industrial_steel' ? 0.65 : 0.12,
    })
  );

  const goldTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      roughness: 0.25,
      metalness: 0.88,
    })
  );

  const darkRimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#09111E',
      roughness: 0.45,
      metalness: 0.35,
    })
  );

  // Main upper stage disc
  const upperDisc = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.4, 4.6, 0.28, 64)),
    plinthMat
  );
  upperDisc.position.y = -0.14;
  upperDisc.receiveShadow = true;
  group.add(upperDisc);

  // Lower step disc
  const lowerDisc = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.9, 5.1, 0.22, 64)),
    darkRimMat
  );
  lowerDisc.position.y = -0.38;
  lowerDisc.receiveShadow = true;
  group.add(lowerDisc);

  // Golden perimeter ring
  const goldRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(4.45, 0.045, 16, 96)),
    goldTrimMat
  );
  goldRing.rotation.x = Math.PI / 2;
  goldRing.position.y = 0.01;
  group.add(goldRing);

  if (theme === 'philadelphia_marble') {
    // 4 Neoclassical Georgian Columns in a back colonnade arc
    const colMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#F4F1EA',
        roughness: 0.38,
        metalness: 0.05,
      })
    );
    const colAngles = [-0.95, -0.35, 0.35, 0.95];
    colAngles.forEach((ang) => {
      const colGroup = new THREE.Group();
      const radius = 3.65;
      colGroup.position.set(Math.sin(ang) * radius, 0, -Math.cos(ang) * radius);

      const pedestal = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.55, 0.45, 0.55)),
        colMat
      );
      pedestal.position.y = 0.225;
      colGroup.add(pedestal);

      const shaft = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.19, 0.22, 2.7, 24)),
        colMat
      );
      shaft.position.y = 1.8;
      shaft.castShadow = true;
      colGroup.add(shaft);

      const capital = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.52, 0.18, 0.52)),
        goldTrimMat
      );
      capital.position.y = 3.2;
      colGroup.add(capital);

      group.add(colGroup);
    });
  } else if (theme === 'gettysburg_stone') {
    // Cemetery Ridge stacked stone wall + Union bronze cannon
    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#64748B',
        roughness: 0.88,
        metalness: 0.08,
      })
    );
    for (let i = -5; i <= 5; i++) {
      const ang = i * 0.18;
      const r = 3.55;
      const stoneBlock = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.62, 0.48, 0.36)),
        stoneMat
      );
      stoneBlock.position.set(Math.sin(ang) * r, 0.24, -Math.cos(ang) * r);
      stoneBlock.rotation.y = -ang;
      stoneBlock.castShadow = true;
      group.add(stoneBlock);
    }

    // 1863 Napoleon Bronze Cannon on the flank
    const cannonGroup = new THREE.Group();
    cannonGroup.position.set(-2.35, 0, -1.65);
    cannonGroup.rotation.y = 0.45;

    const bronzeCannonMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#B48327',
        roughness: 0.32,
        metalness: 0.82,
      })
    );
    const woodCarriageMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#5C3A21',
        roughness: 0.75,
        metalness: 0.1,
      })
    );

    const barrel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.09, 0.14, 1.25, 20)),
      bronzeCannonMat
    );
    barrel.rotation.x = Math.PI / 2 - 0.12;
    barrel.position.set(0, 0.46, 0.1);
    cannonGroup.add(barrel);

    [-0.32, 0.32].forEach((wx) => {
      const wheel = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.36, 0.04, 12, 24)),
        woodCarriageMat
      );
      wheel.rotation.y = Math.PI / 2;
      wheel.position.set(wx, 0.38, 0);
      cannonGroup.add(wheel);
    });
    group.add(cannonGroup);
  } else if (theme === 'industrial_steel') {
    // Scranton / Pittsburgh Iron Rail Track & Steel Arch + Floating Golden Embers
    const ironMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#475569',
        roughness: 0.35,
        metalness: 0.85,
      })
    );
    const tieMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#451A03',
        roughness: 0.85,
        metalness: 0.08,
      })
    );

    // Parallel iron rails across front/back of stage
    [-0.35, 0.35].forEach((rz) => {
      const rail = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(6.4, 0.06, 0.05)),
        ironMat
      );
      rail.position.set(0, 0.03, 1.55 + rz);
      group.add(rail);
    });
    for (let x = -2.8; x <= 2.8; x += 0.45) {
      const tie = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.14, 0.03, 0.95)),
        tieMat
      );
      tie.position.set(x, 0.015, 1.55);
      group.add(tie);
    }

    // Background steel truss columns
    [-2.8, 0, 2.8].forEach((px) => {
      const beam = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.24, 3.1, 0.24)),
        ironMat
      );
      beam.position.set(px, 1.55, -3.2);
      beam.castShadow = true;
      group.add(beam);
    });
    const topGirder = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(6.2, 0.26, 0.28)),
      ironMat
    );
    topGirder.position.set(0, 3.05, -3.2);
    group.add(topGirder);

    // Floating Golden Furnace Embers (InstancedMesh)
    const emberCount = 36;
    const emberGeo = trackGeo(new THREE.SphereGeometry(0.032, 8, 8));
    const emberMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: '#F59E0B',
      })
    );
    embersMesh = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < emberCount; i++) {
      const angle = (i / emberCount) * Math.PI * 2;
      const rad = 1.6 + (i % 5) * 0.45;
      dummy.position.set(
        Math.cos(angle) * rad,
        0.3 + (i % 7) * 0.38,
        Math.sin(angle) * rad - 0.5
      );
      dummy.updateMatrix();
      embersMesh.setMatrixAt(i, dummy.matrix);
    }
    group.add(embersMesh);
  } else {
    // keystone_rotunda: Extruded 3D Golden Keystone Emblem at Back Center
    const keystoneShape = new THREE.Shape();
    keystoneShape.moveTo(-0.55, -0.7);
    keystoneShape.lineTo(0.55, -0.7);
    keystoneShape.lineTo(0.75, 0.35);
    keystoneShape.lineTo(0.45, 0.35);
    keystoneShape.lineTo(0.58, 0.72);
    keystoneShape.lineTo(-0.58, 0.72);
    keystoneShape.lineTo(-0.45, 0.35);
    keystoneShape.lineTo(-0.75, 0.35);
    keystoneShape.closePath();

    const keystoneGeo = trackGeo(
      new THREE.ExtrudeGeometry(keystoneShape, {
        depth: 0.18,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 3,
      })
    );
    const keystoneMesh = new THREE.Mesh(keystoneGeo, goldTrimMat);
    keystoneMesh.position.set(0, 2.15, -3.25);
    keystoneMesh.castShadow = true;
    group.add(keystoneMesh);

    // Backing dark marble arch pillar
    const archPillar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.2, 3.1, 0.25)),
      darkRimMat
    );
    archPillar.position.set(0, 1.55, -3.45);
    group.add(archPillar);
  }

  return { group, embersMesh };
}

/**
 * Builds a multi-part 3D Historical Character Sculpture + Illuminated Portrait Medallion
 */
function buildCharacterSculpture(
  char: Historical3DCharacter,
  xPos: number,
  zPos: number,
  rotY: number,
  isSelected: boolean,
  textures: THREE.Texture[],
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[]
): {
  rootGroup: THREE.Group;
  medallionMesh: THREE.Mesh;
  selectionRing: THREE.Mesh;
} {
  const rootGroup = new THREE.Group();
  rootGroup.position.set(xPos, 0, zPos);
  rootGroup.rotation.y = rotY;
  rootGroup.userData = { characterId: char.id };

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  const { appearance } = char;

  // Materials
  const coatMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.coatColor,
      roughness: appearance.coatRoughness,
      metalness: appearance.coatMetalness,
    })
  );
  const vestMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.vestColor,
      roughness: 0.55,
      metalness: 0.1,
    })
  );
  const goldMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.trimColor,
      roughness: 0.22,
      metalness: 0.9,
    })
  );
  const skinMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.skinTone,
      roughness: 0.58,
      metalness: 0.02,
    })
  );
  const hairMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.hairColor,
      roughness: 0.75,
      metalness: 0.05,
    })
  );
  const bootMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#18181B',
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.65,
    })
  );

  // 1. Individual Character Pedestal Plinth + Engraved Nameplate
  const charPlinthMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#0F1C30',
      roughness: 0.35,
      metalness: 0.4,
    })
  );
  const baseCylinder = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.62, 0.68, 0.22, 36)),
    charPlinthMat
  );
  baseCylinder.position.y = 0.11;
  baseCylinder.castShadow = true;
  baseCylinder.receiveShadow = true;
  rootGroup.add(baseCylinder);

  // Selection highlight ring around the character's plinth
  const selectionRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: isSelected ? '#D4AF37' : '#475569',
    })
  );
  const selectionRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.66, 0.028, 12, 48)),
    selectionRingMat
  );
  selectionRing.rotation.x = Math.PI / 2;
  selectionRing.position.y = 0.22;
  rootGroup.add(selectionRing);

  // Engraved Nameplate on front of plinth
  const nameplateTex = trackTex(createNameplateTexture(char.name, char.years));
  const nameplateMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(0.76, 0.19)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: nameplateTex,
      })
    )
  );
  nameplateMesh.position.set(0, 0.12, 0.67);
  nameplateMesh.rotation.x = -0.15;
  rootGroup.add(nameplateMesh);

  // Character Figure Group scaled by heightScale
  const figureGroup = new THREE.Group();
  figureGroup.position.y = 0.22;
  figureGroup.scale.setScalar(appearance.heightScale);
  rootGroup.add(figureGroup);

  // 2. Lower Body: Colonial Gown or Trousers & Polished Boots
  if (appearance.isDress) {
    const skirtPoints = [
      new THREE.Vector2(0.01, 0),
      new THREE.Vector2(0.38, 0),
      new THREE.Vector2(0.33, 0.35),
      new THREE.Vector2(0.22, 0.72),
    ];
    const skirtMesh = new THREE.Mesh(
      trackGeo(new THREE.LatheGeometry(skirtPoints, 28)),
      coatMat
    );
    skirtMesh.castShadow = true;
    figureGroup.add(skirtMesh);

    // White colonial apron front
    const apron = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.21, 0.34, 0.68, 16, 1, false, -0.7, 1.4)),
      vestMat
    );
    apron.position.set(0, 0.35, 0.02);
    figureGroup.add(apron);
  } else {
    [-0.12, 0.12].forEach((lx) => {
      const boot = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.085, 0.095, 0.38, 16)),
        bootMat
      );
      boot.position.set(lx, 0.19, 0);
      boot.castShadow = true;
      figureGroup.add(boot);

      const foot = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.14, 0.09, 0.26)),
        bootMat
      );
      foot.position.set(lx, 0.045, 0.05);
      figureGroup.add(foot);

      const leg = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.095, 0.085, 0.38, 16)),
        vestMat
      );
      leg.position.set(lx, 0.54, 0);
      leg.castShadow = true;
      figureGroup.add(leg);
    });
  }

  // 3. Torso, Tailored Coat & Brass Buttons
  const coatPoints = [
    new THREE.Vector2(0.28, 0.55),
    new THREE.Vector2(0.23, 0.85),
    new THREE.Vector2(0.26, 1.22),
    new THREE.Vector2(0.16, 1.32),
  ];
  const coatLathe = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(coatPoints, 28)),
    coatMat
  );
  coatLathe.castShadow = true;
  figureGroup.add(coatLathe);

  // Inner waistcoat chest panel
  const vestPanel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.2, 0.52, 18)),
    vestMat
  );
  vestPanel.position.set(0, 1.02, 0.035);
  figureGroup.add(vestPanel);

  // White cravat / collar at neck
  const cravat = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.13, 0.035, 12, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.4 }))
  );
  cravat.rotation.x = Math.PI / 2;
  cravat.position.set(0, 1.31, 0.02);
  figureGroup.add(cravat);

  // Twin vertical rows of polished brass buttons
  [-0.08, 0.08].forEach((bx) => {
    [0.88, 0.99, 1.1, 1.21].forEach((by) => {
      const btn = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.018, 10, 10)),
        goldMat
      );
      btn.position.set(bx, by, 0.245);
      figureGroup.add(btn);
    });
  });

  // 4. Sculpted Head, Eyes, Nose, Beard, Mustache & Spectacles
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.49, 0.02);
  figureGroup.add(headGroup);

  const cranium = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.165, 28, 28)),
    skinMat
  );
  cranium.scale.set(0.94, 1.08, 0.96);
  cranium.castShadow = true;
  headGroup.add(cranium);

  // Sculpted nose
  const nose = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.028, 0.075, 12)),
    skinMat
  );
  nose.rotation.x = Math.PI / 2 - 0.25;
  nose.position.set(0, 0.01, 0.165);
  headGroup.add(nose);

  // Eyes & Pupils
  const eyeWhiteMat = trackMat(new THREE.MeshBasicMaterial({ color: '#F8FAFC' }));
  const pupilMat = trackMat(new THREE.MeshBasicMaterial({ color: '#0F172A' }));
  [-0.055, 0.055].forEach((ex) => {
    const eye = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.022, 12, 12)),
      eyeWhiteMat
    );
    eye.position.set(ex, 0.035, 0.142);
    headGroup.add(eye);

    const pupil = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.011, 10, 10)),
      pupilMat
    );
    pupil.position.set(ex, 0.035, 0.16);
    headGroup.add(pupil);

    const brow = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.045, 0.012, 0.015)),
      hairMat
    );
    brow.position.set(ex, 0.068, 0.15);
    headGroup.add(brow);
  });

  // Hair back cap
  const hairCap = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.172, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65)),
    hairMat
  );
  hairCap.rotation.x = -0.35;
  hairCap.position.set(0, 0.02, -0.015);
  headGroup.add(hairCap);

  if (appearance.hatStyle === 'none_long_hair' || appearance.hatStyle === 'naturalist_bob') {
    [-0.14, 0.14].forEach((hx) => {
      const locks = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.045, 0.055, 0.24, 12)),
        hairMat
      );
      locks.position.set(hx, -0.06, -0.03);
      headGroup.add(locks);
    });
  }

  // Beard & Mustache
  if (appearance.hasBeard) {
    const beard = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.145, 20, 20)),
      hairMat
    );
    beard.scale.set(0.95, 0.85, 0.85);
    beard.position.set(0, -0.075, 0.045);
    headGroup.add(beard);
  }
  if (appearance.hasMustache) {
    const mustache = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.11, 0.026, 0.035)),
      hairMat
    );
    mustache.position.set(0, -0.032, 0.155);
    headGroup.add(mustache);
  }

  // Bifocal Spectacles (Franklin, Powderly)
  if (appearance.hasSpectacles) {
    [-0.055, 0.055].forEach((sx) => {
      const rim = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.032, 0.0045, 10, 24)),
        goldMat
      );
      rim.position.set(sx, 0.035, 0.165);
      headGroup.add(rim);
    });
    const bridge = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.004, 0.004, 0.045, 8)),
      goldMat
    );
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.038, 0.165);
    headGroup.add(bridge);
  }

  // 5. Period Hat (`hatStyle`)
  const hatMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: appearance.hatColor,
      roughness: 0.45,
      metalness: 0.15,
    })
  );

  if (appearance.hatStyle === 'quaker_wide_brim') {
    const brim = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 0.022, 32)),
      hatMat
    );
    brim.position.set(0, 0.13, 0);
    headGroup.add(brim);

    const crown = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.15, 0.18, 0.18, 24)),
      hatMat
    );
    crown.position.set(0, 0.22, 0);
    headGroup.add(crown);
  } else if (
    appearance.hatStyle === 'stovepipe_top_hat' ||
    appearance.hatStyle === 'victorian_top_hat'
  ) {
    const isTall = appearance.hatStyle === 'stovepipe_top_hat';
    const brim = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 28)),
      hatMat
    );
    brim.position.set(0, 0.13, 0);
    headGroup.add(brim);

    const crownH = isTall ? 0.34 : 0.24;
    const crown = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.165, 0.155, crownH, 28)),
      hatMat
    );
    crown.position.set(0, 0.13 + crownH / 2, 0);
    crown.castShadow = true;
    headGroup.add(crown);
  } else if (appearance.hatStyle === 'colonial_cap') {
    const puff = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.19, 20, 20)),
      hatMat
    );
    puff.scale.set(1.05, 0.75, 1.05);
    puff.position.set(0, 0.11, -0.02);
    headGroup.add(puff);
  } else if (appearance.hatStyle === 'union_kepi') {
    const crown = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.155, 0.175, 0.13, 24)),
      hatMat
    );
    crown.rotation.x = 0.18;
    crown.position.set(0, 0.16, 0.01);
    headGroup.add(crown);

    const visor = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.015, 0.12)),
      bootMat
    );
    visor.position.set(0, 0.11, 0.15);
    visor.rotation.x = 0.25;
    headGroup.add(visor);
  } else if (appearance.hatStyle === 'miner_carbide_helmet') {
    const dome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.185, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2)),
      hatMat
    );
    dome.position.set(0, 0.08, 0);
    headGroup.add(dome);

    // Brass Carbide Reflector Cup + Active Glowing PointLight
    const reflector = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.055, 0.025, 0.06, 16)),
      goldMat
    );
    reflector.rotation.x = Math.PI / 2;
    reflector.position.set(0, 0.18, 0.18);
    headGroup.add(reflector);

    const bulb = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.026, 12, 12)),
      trackMat(new THREE.MeshBasicMaterial({ color: '#FEF08A' }))
    );
    bulb.position.set(0, 0.18, 0.205);
    headGroup.add(bulb);

    const minerLight = new THREE.PointLight('#FDE047', 1.8, 3.5);
    minerLight.position.set(0, 0.18, 0.26);
    headGroup.add(minerLight);
  } else if (appearance.hatStyle === 'fedora_19th') {
    const brim = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.26, 0.26, 0.018, 28)),
      hatMat
    );
    brim.position.set(0, 0.13, 0);
    headGroup.add(brim);

    const crown = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.165, 20, 16)),
      hatMat
    );
    crown.scale.set(1, 0.75, 1.1);
    crown.position.set(0, 0.18, 0);
    headGroup.add(crown);
  }

  // 6. Articulated Left & Right Arms + Hands
  const leftArm = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.065, 0.058, 0.48, 16)),
    coatMat
  );
  leftArm.position.set(-0.29, 1.06, 0.02);
  leftArm.rotation.z = 0.18;
  leftArm.castShadow = true;
  figureGroup.add(leftArm);

  const leftHand = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.052, 14, 14)),
    skinMat
  );
  leftHand.position.set(-0.34, 0.81, 0.05);
  figureGroup.add(leftHand);

  const rightArm = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.065, 0.058, 0.46, 16)),
    coatMat
  );
  rightArm.position.set(0.29, 1.08, 0.08);
  rightArm.rotation.z = -0.32;
  rightArm.rotation.x = -0.45;
  rightArm.castShadow = true;
  figureGroup.add(rightArm);

  const rightHand = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.052, 14, 14)),
    skinMat
  );
  rightHand.position.set(0.39, 0.96, 0.22);
  figureGroup.add(rightHand);

  // 7. Signature 3D Historical Prop attached near Right Hand
  const propGroup = new THREE.Group();
  propGroup.position.set(0.42, 0.98, 0.24);
  figureGroup.add(propGroup);

  const parchmentMat = trackMat(
    new THREE.MeshStandardMaterial({ color: '#FEF3C7', roughness: 0.65 })
  );
  const woodMat = trackMat(
    new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.7 })
  );
  const steelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#94A3B8',
      roughness: 0.25,
      metalness: 0.88,
    })
  );

  if (appearance.propStyle === 'kite_and_key') {
    // Franklin's Silk Kite & Brass Key
    const kiteDiamond = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.24, 0.46, 4)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: '#B22234',
          roughness: 0.5,
        })
      )
    );
    kiteDiamond.scale.set(1, 1, 0.15);
    kiteDiamond.position.set(0.05, 0.22, 0);
    propGroup.add(kiteDiamond);

    const keyRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.045, 0.012, 10, 20)),
      goldMat
    );
    keyRing.position.set(0.05, -0.08, 0.04);
    propGroup.add(keyRing);
  } else if (appearance.propStyle === 'betsy_ross_flag') {
    const pole = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 1.35, 12)),
      woodMat
    );
    pole.position.set(0.04, 0.15, 0);
    propGroup.add(pole);

    const flagTex = trackTex(createBetsyRossFlagTexture());
    const flagBanner = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(0.56, 0.35)),
      trackMat(
        new THREE.MeshStandardMaterial({
          map: flagTex,
          side: THREE.DoubleSide,
          roughness: 0.6,
        })
      )
    );
    flagBanner.position.set(0.32, 0.58, 0.02);
    propGroup.add(flagBanner);
  } else if (
    appearance.propStyle === 'royal_charter_scroll' ||
    appearance.propStyle === 'gettysburg_manuscript' ||
    appearance.propStyle === 'presidential_seal_scroll'
  ) {
    const scrollSheet = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.26, 0.34, 0.018)),
      parchmentMat
    );
    scrollSheet.rotation.y = -0.35;
    scrollSheet.position.set(0.04, 0.12, 0.04);
    propGroup.add(scrollSheet);

    const waxSeal = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.025, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: '#B22234', roughness: 0.4 }))
    );
    waxSeal.rotation.x = Math.PI / 2;
    waxSeal.position.set(0.08, -0.01, 0.06);
    propGroup.add(waxSeal);
  } else if (appearance.propStyle === 'union_saber_binoculars') {
    const hilt = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.055, 0.012, 10, 20)),
      goldMat
    );
    hilt.position.set(0.02, 0.02, 0);
    propGroup.add(hilt);

    const blade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.022, 0.72, 0.008)),
      steelMat
    );
    blade.position.set(0.02, -0.36, 0);
    propGroup.add(blade);
  } else if (appearance.propStyle === 'anthracite_pickaxe') {
    const handle = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.018, 0.02, 0.82, 12)),
      woodMat
    );
    handle.position.set(0.04, -0.05, 0);
    propGroup.add(handle);

    const pickHead = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.045, 0.46, 12)),
      steelMat
    );
    pickHead.rotation.z = Math.PI / 2;
    pickHead.position.set(0.04, 0.34, 0);
    propGroup.add(pickHead);
  } else if (appearance.propStyle === 'steel_ibeam') {
    const web = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.03, 0.45, 0.14)),
      steelMat
    );
    web.position.set(0.06, 0.12, 0);
    propGroup.add(web);

    [-0.08, 0.08].forEach((fx) => {
      const flange = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.025, 0.45, 0.18)),
        goldMat
      );
      flange.position.set(0.06 + fx, 0.12, 0);
      propGroup.add(flange);
    });
  } else if (appearance.propStyle === 'oil_derrick_model') {
    const derrickTower = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.15, 0.56, 4, 1, true)),
      woodMat
    );
    derrickTower.position.set(0.08, 0.18, 0);
    propGroup.add(derrickTower);
  } else if (appearance.propStyle === 'silent_spring_binoculars') {
    const book = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.28, 0.05)),
      trackMat(new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.45 }))
    );
    book.position.set(0.04, 0.1, 0.04);
    propGroup.add(book);
  } else if (appearance.propStyle === 'amendment_cane') {
    const caneShaft = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.015, 0.012, 0.92, 12)),
      bootMat
    );
    caneShaft.position.set(0.04, -0.44, 0);
    propGroup.add(caneShaft);

    const pommel = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.032, 14, 14)),
      goldMat
    );
    pommel.position.set(0.04, 0.03, 0);
    propGroup.add(pommel);
  } else {
    // locomotive_blueprint / labor_gavel_lantern
    const blueprintCylinder = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.36, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: '#1D4ED8', roughness: 0.4 }))
    );
    blueprintCylinder.rotation.z = 0.4;
    blueprintCylinder.position.set(0.05, 0.12, 0.04);
    propGroup.add(blueprintCylinder);
  }

  // 8. Illuminated 3D Wikipedia Portrait Medallion Stand beside Character
  const medallionGroup = new THREE.Group();
  medallionGroup.position.set(-0.56, 1.25, 0.15);
  medallionGroup.rotation.y = 0.22;
  figureGroup.add(medallionGroup);

  const frameRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.23, 0.024, 16, 40)),
    goldMat
  );
  medallionGroup.add(frameRing);

  const fallbackPortraitTex = trackTex(createMedallionFallbackTexture(char));
  const medallionMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: fallbackPortraitTex,
    })
  );
  const medallionMesh = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.215, 36)),
    medallionMat
  );
  medallionMesh.position.z = 0.008;
  medallionGroup.add(medallionMesh);

  const medallionBack = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 32)),
    goldMat
  );
  medallionBack.rotation.x = Math.PI / 2;
  medallionBack.position.z = -0.005;
  medallionGroup.add(medallionBack);

  return { rootGroup, medallionMesh, selectionRing };
}

export const Historical3DStage: React.FC<Historical3DStageProps> = ({
  selectedCountyName,
  onSelectCounty,
  onCaptureSnapshotForPdf,
  compactMode = false,
}) => {
  const { language, t } = useTranslation();

  // Resolve initial stage from selectedCountyName
  const [activeStageId, setActiveStageId] = useState<string>(() => {
    return getHistorical3DStageForCounty(selectedCountyName).id;
  });
  const [customCountyLabel, setCustomCountyLabel] = useState<string | null>(
    selectedCountyName || null
  );

  // Sync when parent changes selectedCountyName
  useEffect(() => {
    if (selectedCountyName) {
      const matched = getHistorical3DStageForCounty(selectedCountyName);
      setActiveStageId(matched.id);
      setCustomCountyLabel(selectedCountyName);
    }
  }, [selectedCountyName]);

  const activeStage: County3DStageConfig = useMemo(() => {
    const found = PA_HISTORICAL_3D_STAGES.find((s) => s.id === activeStageId);
    if (found) return found;
    if (customCountyLabel) {
      return getHistorical3DStageForCounty(customCountyLabel);
    }
    return DEFAULT_COMMONWEALTH_3D_STAGE;
  }, [activeStageId, customCountyLabel]);

  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  // Reset selectedCharIndex when switching stage
  useEffect(() => {
    setSelectedCharIndex(0);
  }, [activeStage.id]);

  const activeCharacter: Historical3DCharacter =
    activeStage.characters[selectedCharIndex] || activeStage.characters[0];

  // Interactive lighting & HUD controls
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(true);
  const [lightPreset, setLightPreset] = useState<'museum_gold' | 'daylight' | 'dramatic'>('museum_gold');
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<boolean>(false);
  const [projectedCallouts, setProjectedCallouts] = useState<ProjectedCalloutPos[]>([]);

  // Refs for Three.js lifecycle & camera damping
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  const desiredCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.05, 5.2));
  const desiredTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.15, 0));
  const isTransitioningCameraRef = useRef<boolean>(false);

  const selectedCharIndexRef = useRef<number>(selectedCharIndex);
  selectedCharIndexRef.current = selectedCharIndex;

  const autoRotateRef = useRef<boolean>(autoRotate);
  autoRotateRef.current = autoRotate;

  const showCalloutsRef = useRef<boolean>(showCalloutPins);
  showCalloutsRef.current = showCalloutPins;

  // Compute character X positions on stage
  const getCharPositionX = useCallback((idx: number, total: number): number => {
    if (total === 1) return 0;
    if (total === 2) return idx === 0 ? -1.15 : 1.15;
    return (idx - 1) * 1.65;
  }, []);

  // Update camera target whenever selectedCharIndex changes
  useEffect(() => {
    const total = activeStage.characters.length;
    const targetX = getCharPositionX(selectedCharIndex, total);
    desiredTargetRef.current.set(targetX, 1.22, 0);
    desiredCameraPosRef.current.set(targetX * 0.85, 1.85, 3.85);
    isTransitioningCameraRef.current = true;
  }, [selectedCharIndex, activeStage.characters.length, getCharPositionX]);

  // Update lighting preset dynamically
  useEffect(() => {
    const keyLight = keyLightRef.current;
    const rimLight = rimLightRef.current;
    if (!keyLight || !rimLight) return;

    if (lightPreset === 'museum_gold') {
      keyLight.color.set('#FFFBEB');
      keyLight.intensity = 3.2;
      rimLight.color.set('#3B82F6');
      rimLight.intensity = 1.9;
    } else if (lightPreset === 'daylight') {
      keyLight.color.set('#FFFFFF');
      keyLight.intensity = 3.8;
      rimLight.color.set('#93C5FD');
      rimLight.intensity = 2.2;
    } else {
      keyLight.color.set('#F59E0B');
      keyLight.intensity = 4.2;
      rimLight.color.set('#1D4ED8');
      rimLight.intensity = 2.8;
    }
  }, [lightPreset]);

  // Reset camera to full-stage overview
  const handleResetCameraOverview = useCallback(() => {
    desiredTargetRef.current.set(0, 1.15, 0);
    desiredCameraPosRef.current.set(0, 2.15, 5.4);
    isTransitioningCameraRef.current = true;
  }, []);

  // Capture high-res PNG snapshot of WebGL canvas
  const handleCaptureSnapshot = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const stageName =
      language === 'en' ? activeStage.townTitle.en : activeStage.townTitle.es;

    if (onCaptureSnapshotForPdf) {
      onCaptureSnapshotForPdf(dataUrl, `${stageName} — ${activeCharacter.name}`);
    } else {
      const link = document.createElement('a');
      link.download = `keystone-3d-${activeCharacter.id}.png`;
      link.href = dataUrl;
      link.click();
    }

    setSnapshotToast(true);
    window.setTimeout(() => setSnapshotToast(false), 2400);
  }, [activeStage, activeCharacter, language, onCaptureSnapshotForPdf]);

  // Main WebGL Scene & Stage Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const disposedRef = { current: false };
    const trackedGeometries: THREE.BufferGeometry[] = [];
    const trackedMaterials: THREE.Material[] = [];
    const trackedTextures: THREE.Texture[] = [];

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 360);

    // 1. Renderer + Software-WebGL Guard (`isSoftwareGl`)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    rendererRef.current = renderer;

    const gl = renderer.getContext();
    const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const glRendererStr = dbgInfo
      ? String(gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL))
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software/i.test(
      glRendererStr
    );

    renderer.setPixelRatio(
      isSoftwareGl ? 1.0 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Scene & RoomEnvironment IBL
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09111E');
    scene.fog = new THREE.FogExp2('#09111E', 0.055);
    sceneRef.current = scene;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(0, 2.05, 5.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minPolarAngle = 0.25;
    controls.minDistance = 1.9;
    controls.maxDistance = 8.5;
    controls.target.set(0, 1.15, 0);
    controlsRef.current = controls;

    // Cancel camera auto-transition when user drags manually
    const onControlStart = () => {
      isTransitioningCameraRef.current = false;
    };
    controls.addEventListener('start', onControlStart);

    // 4. 3-Point Museum Studio Lighting
    const hemiLight = new THREE.HemisphereLight('#E2E8F0', '#1E293B', 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.SpotLight('#FFFBEB', 3.2);
    keyLight.position.set(4.2, 7.2, 5.2);
    keyLight.angle = Math.PI / 3;
    keyLight.penumbra = 0.65;
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight('#3B82F6', 1.9);
    rimLight.position.set(-4.5, 4.8, -4.5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const plinthUplight = new THREE.PointLight(
      activeStage.ambientAccentColor,
      1.35,
      6.5
    );
    plinthUplight.position.set(0, 0.45, 1.85);
    scene.add(plinthUplight);

    // 5. Build Stage Environment
    const { group: stageEnvGroup, embersMesh } = buildStageEnvironment(
      activeStage.stageTheme,
      trackedTextures,
      trackedGeometries,
      trackedMaterials
    );
    scene.add(stageEnvGroup);

    // 6. Build Characters & Fetch Official Wikipedia Portraits for Medallions
    const characterRoots: THREE.Group[] = [];
    const selectionRings: THREE.Mesh[] = [];
    const totalChars = activeStage.characters.length;

    activeStage.characters.forEach((char, idx) => {
      const xPos = getCharPositionX(idx, totalChars);
      const zPos = totalChars === 3 && idx === 1 ? 0.22 : 0;
      const rotY = totalChars > 1 ? -xPos * 0.14 : 0;

      const { rootGroup, medallionMesh, selectionRing } =
        buildCharacterSculpture(
          char,
          xPos,
          zPos,
          rotY,
          idx === selectedCharIndexRef.current,
          trackedTextures,
          trackedGeometries,
          trackedMaterials
        );

      scene.add(rootGroup);
      characterRoots.push(rootGroup);
      selectionRings.push(selectionRing);

      // Load Wikipedia high-res portrait asynchronously for the 3D Medallion
      fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          char.wikiTitle
        )}`
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (disposedRef.current || !data?.thumbnail?.source) return;
          const loader = new THREE.TextureLoader();
          loader.setCrossOrigin('anonymous');
          loader.load(data.thumbnail.source, (tex) => {
            if (disposedRef.current) {
              tex.dispose();
              return;
            }
            tex.colorSpace = THREE.SRGBColorSpace;
            trackedTextures.push(tex);
            const mat = medallionMesh.material as THREE.MeshBasicMaterial;
            mat.map = tex;
            mat.needsUpdate = true;
          });
        })
        .catch(() => {
          // Keeps procedural archival monogram medallion on offline/error
        });
    });

    // 7. Raycasting for Clicking Characters directly in 3D Stage
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(characterRoots, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.characterId) {
          obj = obj.parent;
        }
        if (obj?.userData?.characterId) {
          const clickedIdx = activeStage.characters.findIndex(
            (c) => c.id === obj!.userData.characterId
          );
          if (clickedIdx >= 0) {
            setSelectedCharIndex(clickedIdx);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // 8. Responsive ResizeObserver
    const handleResize = () => {
      if (!container || disposedRef.current) return;
      const w = Math.max(container.clientWidth, 300);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Paced Render Loop with Software-WebGL `afterDraw` synchronization
    let rafId = 0;
    const syncBuf = new Uint8Array(4);
    const afterDraw = (cb: () => void) => {
      if (disposedRef.current) return;
      if (isSoftwareGl) {
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, syncBuf);
      }
      rafId = requestAnimationFrame(cb);
    };

    const clock = new THREE.Clock();
    const dummyEmber = new THREE.Object3D();
    const projVec = new THREE.Vector3();
    let frameCounter = 0;

    const tick = () => {
      if (disposedRef.current) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Update selection ring colors & subtle character breathing oscillation
      characterRoots.forEach((grp, idx) => {
        const isSel = idx === selectedCharIndexRef.current;
        const ringMat = selectionRings[idx].material as THREE.MeshBasicMaterial;
        ringMat.color.set(isSel ? '#D4AF37' : '#334155');
        grp.position.y = Math.sin(elapsed * 1.8 + idx * 1.3) * 0.014;
      });

      // Animate floating golden furnace embers if in industrial stage
      if (embersMesh) {
        for (let i = 0; i < embersMesh.count; i++) {
          const angle = (i / embersMesh.count) * Math.PI * 2 + elapsed * 0.18;
          const rad = 1.6 + (i % 5) * 0.45;
          const yHeight = ((elapsed * 0.35 + i * 0.27) % 2.6) + 0.15;
          dummyEmber.position.set(
            Math.cos(angle) * rad,
            yHeight,
            Math.sin(angle) * rad - 0.4
          );
          dummyEmber.updateMatrix();
          embersMesh.setMatrixAt(i, dummyEmber.matrix);
        }
        embersMesh.instanceMatrix.needsUpdate = true;
      }

      // Smooth exponential camera transition (`THREE.MathUtils.damp`)
      if (isTransitioningCameraRef.current) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          desiredCameraPosRef.current.x,
          4.5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          desiredCameraPosRef.current.y,
          4.5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          desiredCameraPosRef.current.z,
          4.5,
          delta
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          desiredTargetRef.current.x,
          5.5,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          desiredTargetRef.current.y,
          5.5,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          desiredTargetRef.current.z,
          5.5,
          delta
        );

        if (
          camera.position.distanceTo(desiredCameraPosRef.current) < 0.04 &&
          controls.target.distanceTo(desiredTargetRef.current) < 0.03
        ) {
          isTransitioningCameraRef.current = false;
        }
      }

      controls.autoRotate = autoRotateRef.current;
      controls.autoRotateSpeed = 1.1;
      controls.update();

      renderer.render(scene, camera);

      // Update 2D projected callout pins every 4 frames for active character
      frameCounter++;
      if (frameCounter % 4 === 0 && showCalloutsRef.current) {
        const activeIdx = selectedCharIndexRef.current;
        const activeChar =
          activeStage.characters[activeIdx] || activeStage.characters[0];
        const charRoot = characterRoots[activeIdx];
        if (activeChar && charRoot) {
          const w = renderer.domElement.clientWidth;
          const h = renderer.domElement.clientHeight;
          const nextCallouts: ProjectedCalloutPos[] = activeChar.callouts.map(
            (c) => {
              projVec.set(
                charRoot.position.x + c.anchorOffset[0],
                charRoot.position.y + c.anchorOffset[1],
                charRoot.position.z + c.anchorOffset[2]
              );
              projVec.project(camera);
              const sx = (projVec.x * 0.5 + 0.5) * w;
              const sy = (-(projVec.y * 0.5) + 0.5) * h;
              const inBounds =
                projVec.z < 1 && sx > 24 && sx < w - 24 && sy > 24 && sy < h - 24;
              return {
                id: c.id,
                x: sx,
                y: sy,
                visible: inBounds,
                label: language === 'en' ? c.label.en : c.label.es,
                detail: language === 'en' ? c.detail.en : c.detail.es,
              };
            }
          );
          setProjectedCallouts(nextCallouts);
        }
      }

      afterDraw(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposedRef.current = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);

      trackedGeometries.forEach((g) => g.dispose());
      trackedMaterials.forEach((m) => m.dispose());
      trackedTextures.forEach((tx) => tx.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, [activeStage, getCharPositionX, language]);

  // Build narration script for active character
  const characterNarrationScript = useMemo(() => {
    return {
      en: `${activeCharacter.name} (${activeCharacter.years}). ${activeCharacter.role.en}, ${activeCharacter.townName.en}. ${activeCharacter.biography.en} Famous quote: ${activeCharacter.quote.en}`,
      es: `${activeCharacter.name} (${activeCharacter.years}). ${activeCharacter.role.es}, ${activeCharacter.townName.es}. ${activeCharacter.biography.es} Cita histórica: ${activeCharacter.quote.es}`,
    };
  }, [activeCharacter]);

  const stageTitle =
    language === 'en' ? activeStage.townTitle.en : activeStage.townTitle.es;
  const stageSub =
    language === 'en'
      ? activeStage.stageSubtitle.en
      : activeStage.stageSubtitle.es;

  return (
    <div className="space-y-4">
      {/* Top Town / County & Character Cast Selector Bar */}
      <div className="bg-[#09111E] border border-[#D4AF37]/60 rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-[#B22234] border border-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-widest text-[#F8FAFC]">
              {t.comicEncyclopedia.stage3dBadge}
            </span>
            <span className="text-xs font-mono text-[#D4AF37]">
              {stageSub}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F8FAFC]">
            {stageTitle}
          </h3>
        </div>

        {/* Featured Town Cast Switcher + 67-County Quick Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-[11px] font-mono text-[#94A3B8]">
            {t.comicEncyclopedia.stageSelectTownLabel}
          </label>
          <select
            value={activeStageId}
            onChange={(e) => {
              const val = e.target.value;
              setActiveStageId(val);
              setCustomCountyLabel(null);
              const foundStage = PA_HISTORICAL_3D_STAGES.find(
                (s) => s.id === val
              );
              if (
                foundStage &&
                foundStage.counties[0] &&
                onSelectCounty &&
                PA_COUNTIES_DATA[foundStage.counties[0]]
              ) {
                onSelectCounty(PA_COUNTIES_DATA[foundStage.counties[0]]);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-[#0F1C30] border border-[#D4AF37]/70 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            {PA_HISTORICAL_3D_STAGES.map((stg) => (
              <option key={stg.id} value={stg.id}>
                {language === 'en' ? stg.townTitle.en : stg.townTitle.es}
              </option>
            ))}
            <option value={DEFAULT_COMMONWEALTH_3D_STAGE.id}>
              {language === 'en'
                ? DEFAULT_COMMONWEALTH_3D_STAGE.townTitle.en
                : DEFAULT_COMMONWEALTH_3D_STAGE.townTitle.es}
            </option>
          </select>

          {/* All 67 Counties Selector */}
          <select
            value={customCountyLabel || ''}
            onChange={(e) => {
              const cName = e.target.value;
              if (!cName) return;
              setCustomCountyLabel(cName);
              const matched = getHistorical3DStageForCounty(cName);
              setActiveStageId(matched.id);
              if (onSelectCounty && PA_COUNTIES_DATA[cName]) {
                onSelectCounty(PA_COUNTIES_DATA[cName]);
              }
            }}
            aria-label={t.comicEncyclopedia.stageSelectCountyAria}
            className="px-2.5 py-1.5 rounded-xl bg-[#09111E] border border-slate-700 text-xs text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="">
              {t.comicEncyclopedia.stageJumpAnyCountyPlaceholder}
            </option>
            {ALL_COUNTIES_LIST.map((c) => (
              <option key={c.fips} value={c.name}>
                {c.name} County ({c.founded})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 3D WebGL Stage + Character Dossier Grid */}
      <div
        className={`grid grid-cols-1 ${
          compactMode ? '' : ' lg:grid-cols-12'
        } gap-4`}
      >
        {/* Left / Center: Interactive 3D WebGL Museum Diorama Viewport */}
        <div
          className={`${
            compactMode ? '' : 'lg:col-span-7'
          } relative rounded-2xl border-2 border-[#D4AF37]/80 bg-[#09111E] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col`}
        >
          {/* Character Cast Focus Pills at Top of 3D Stage */}
          <div className="px-3.5 py-2.5 bg-[#09111E] border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeStage.characters.map((char, idx) => {
                const isSelected = idx === selectedCharIndex;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC] shadow-[0_0_14px_rgba(29,78,216,0.5)]'
                        : 'bg-[#0F1C30] hover:bg-[#1E3A8A]/50 border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{char.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleResetCameraOverview}
              title={t.comicEncyclopedia.reset3dCameraBtn}
              className="px-2.5 py-1 rounded-lg bg-[#0F1C30] hover:bg-[#1E3A8A] border border-slate-700 text-[11px] font-semibold text-[#D4AF37] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.comicEncyclopedia.reset3dCameraBtn}</span>
            </button>
          </div>

          {/* WebGL Canvas Container (Zero backdrop-filter over canvas per Three.js skill) */}
          <div className="relative w-full h-[360px] sm:h-[430px] select-none">
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Projected 3D Callout Tags for Active Character's Historical Props */}
            {showCalloutPins &&
              projectedCallouts.map((pin) =>
                pin.visible ? (
                  <div
                    key={pin.id}
                    style={{
                      left: `${Math.min(Math.max(pin.x, 36), 340)}px`,
                      top: `${Math.min(Math.max(pin.y, 24), 310)}px`,
                    }}
                    className="pointer-events-none absolute -translate-y-1/2 z-10 max-w-[205px] px-2.5 py-1.5 rounded-lg bg-[#09111E]/92 border border-[#D4AF37] text-[#F8FAFC] shadow-lg"
                  >
                    <div className="text-[10px] font-mono font-bold text-[#D4AF37] leading-tight">
                      ✦ {pin.label}
                    </div>
                    <div className="text-[10px] text-[#CBD5E1] leading-snug mt-0.5">
                      {pin.detail}
                    </div>
                  </div>
                ) : null
              )}

            {/* Snapshot Saved Notification Toast */}
            {snapshotToast && (
              <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-[#10B981] text-[#09111E] font-mono text-xs font-bold shadow-lg">
                {t.comicEncyclopedia.snapshotCapturedBadge}
              </div>
            )}

            {/* Unified Collapsible Bottom Dock for 3D Stage Controls */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col items-center pointer-events-none">
              <div className="pointer-events-auto w-full max-w-xl rounded-xl bg-[#09111E]/94 border border-slate-700/90 px-3 py-2 shadow-xl">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t.comicEncyclopedia.stage3dInteractHint}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="px-2.5 py-1 rounded-lg bg-[#B22234] hover:bg-[#991B1B] border border-[#D4AF37] text-[11px] font-bold text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3 text-[#D4AF37]" />
                      <span>{t.comicEncyclopedia.capture3dSnapshotBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsControlsExpanded((prev) => !prev)}
                      className="px-2.5 py-1 rounded-lg bg-[#0F1C30] hover:bg-[#1E3A8A] border border-slate-700 text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-[#D4AF37]" />
                      <span>{t.comicEncyclopedia.stageControlsBtn}</span>
                      {isControlsExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronUp className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {isControlsExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAutoRotate((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                          autoRotate
                            ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                            : 'bg-[#0F1C30] border-slate-700 text-[#94A3B8]'
                        }`}
                      >
                        360° Turntable: {autoRotate ? 'ON' : 'OFF'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCalloutPins((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                          showCalloutPins
                            ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                            : 'bg-[#0F1C30] border-slate-700 text-[#94A3B8]'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t.comicEncyclopedia.toggle3dPinsBtn}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {(['museum_gold', 'daylight', 'dramatic'] as const).map(
                        (preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setLightPreset(preset)}
                            className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase cursor-pointer ${
                              lightPreset === preset
                                ? 'bg-[#D4AF37] text-[#09111E] border-[#D4AF37] font-bold'
                                : 'bg-[#0F1C30] text-[#94A3B8] border-slate-700'
                            }`}
                          >
                            {preset.replace('_', ' ')}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected 3D Character Historical Dossier, Callouts & Audio-Guide */}
        <div
          className={`${
            compactMode ? '' : 'lg:col-span-5'
          } bg-[#09111E] border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4`}
        >
          <div className="space-y-3.5">
            {/* Character Header & Years */}
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded bg-[#1E3A8A]/80 border border-[#D4AF37]/70 font-mono text-[11px] font-bold text-[#D4AF37]">
                  {activeCharacter.years}
                </span>
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {language === 'en'
                      ? activeCharacter.townName.en
                      : activeCharacter.townName.es}
                  </span>
                </span>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                {activeCharacter.name}
              </h4>
              <p className="text-xs font-semibold text-[#D4AF37]">
                {language === 'en'
                  ? activeCharacter.role.en
                  : activeCharacter.role.es}
              </p>
            </div>

            {/* Bilingual Audio-Guide for the Selected 3D Figure */}
            <AudioNarratorWidget
              script={characterNarrationScript}
              contextKey={`3d-char-${activeCharacter.id}`}
              label={t.comicEncyclopedia.listen3dBioLabel}
            />

            {/* Historical Biography */}
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              {language === 'en'
                ? activeCharacter.biography.en
                : activeCharacter.biography.es}
            </p>

            {/* Archival Quote */}
            <blockquote className="p-3 rounded-xl bg-[#0F1C30] border-l-4 border-[#D4AF37] font-serif italic text-xs sm:text-sm text-[#F8FAFC]">
              {language === 'en'
                ? activeCharacter.quote.en
                : activeCharacter.quote.es}
            </blockquote>

            {/* 3D Sculpted Artifacts & Accessories Breakdown */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                {t.comicEncyclopedia.sculptedArtifactsHeader}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {activeCharacter.callouts.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-[#0F1C30]/90 border border-slate-700/80"
                  >
                    <div className="text-xs font-bold text-[#D4AF37]">
                      ✦ {language === 'en' ? c.label.en : c.label.es}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">
                      {language === 'en' ? c.detail.en : c.detail.es}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Historical Source Link */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <a
              href={activeCharacter.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1.5"
            >
              <span>{t.comicEncyclopedia.officialCuratorSourceLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historical3DStage;
