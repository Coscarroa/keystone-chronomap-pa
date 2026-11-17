import React, { useEffect, useRef } from 'react';
import {
  CharacterExpression,
  ComicCharacterId,
  ComicCharacterSlot,
  ComicPanelData,
  ComicPanelSceneId,
} from '../data/encyclopediaComicsData';
import { AppLanguage } from '../i18n/translations';

const COLORED_INK = '#1E293B';
const DARK_NAVY = '#09111E';
const ARCHIVE_CARD = '#0F1C30';
const COMIC_PAPER = '#FFFDF5';
const KEYSTONE_GOLD = '#D4AF37';
const FEDERAL_BLUE = '#1D4ED8';
const PATRIOTIC_CRIMSON = '#B22234';

export const COMIC_CANVAS_WIDTH = 1200;
export const COMIC_CANVAS_HEIGHT = 680;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Casts diagonal volumetric sunbeams ("God Rays") using screen blending
 */
function drawGodRays(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sourceX: number,
  colorRgb = '253, 224, 71',
  alpha = 0.16
) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const rayOffsets = [-220, -60, 110, 280];
  rayOffsets.forEach((offset, idx) => {
    const rayW = 90 + (idx % 2) * 55;
    const grad = ctx.createLinearGradient(sourceX, 0, sourceX + offset, h);
    grad.addColorStop(0, `rgba(${colorRgb}, ${alpha})`);
    grad.addColorStop(0.65, `rgba(${colorRgb}, ${alpha * 0.45})`);
    grad.addColorStop(1, `rgba(${colorRgb}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(sourceX - 30, 0);
    ctx.lineTo(sourceX + 30, 0);
    ctx.lineTo(sourceX + offset + rayW, h);
    ctx.lineTo(sourceX + offset - rayW, h);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

/**
 * Renders floating atmospheric light motes / fireflies / embers
 */
function drawFloatingLightMotes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color = 'rgba(254, 240, 138, 0.55)',
  count = 22
) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const x = ((i * 173 + 95) % (w - 120)) + 60;
    const y = ((i * 97 + 140) % (h - 220)) + 90;
    const r = 1.8 + (i % 3) * 1.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Helper to paint layered atmospheric mountain ridges
 */
function drawMountainLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseY: number,
  amp: number,
  freq: number,
  phase: number,
  topColor: string,
  bottomColor: string
) {
  const grad = ctx.createLinearGradient(0, baseY - amp, 0, h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 24) {
    const y =
      baseY -
      Math.sin(x * freq + phase) * amp -
      Math.cos(x * freq * 2.1 - phase) * (amp * 0.38);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to paint stylized pine/deciduous trees
 */
function drawPineTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  scale: number,
  foliageColor: string,
  snowTip = false
) {
  ctx.save();
  ctx.translate(x, baseY);
  ctx.scale(scale, scale);

  // Trunk
  ctx.fillStyle = '#451A03';
  ctx.fillRect(-6, -28, 12, 28);

  // 3 layered foliage tiers
  const tiers = [
    { y: -24, w: 46, h: 48 },
    { y: -54, w: 38, h: 44 },
    { y: -82, w: 28, h: 40 },
  ];
  tiers.forEach((t) => {
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.moveTo(0, t.y - t.h);
    ctx.lineTo(t.w, t.y);
    ctx.lineTo(-t.w, t.y);
    ctx.closePath();
    ctx.fill();

    if (snowTip) {
      ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, t.y - t.h);
      ctx.lineTo(t.w * 0.45, t.y - t.h * 0.52);
      ctx.lineTo(-t.w * 0.45, t.y - t.h * 0.52);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.restore();
}

/**
 * Renders 24 unique historical 2D concept-art scenes (zero repetition across all 24 panels)
 */
export function drawPainterlyScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sceneId: ComicPanelSceneId
) {
  ctx.save();

  switch (sceneId) {
    // =========================================================================
    // CHAPTER 1: 1681–1682 (PENN'S WOODS)
    // =========================================================================
    case 'cap1_1': {
      // Lenape Canoe navigating the sunlit Susquehanna River valley
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0, '#0284C7');
      sky.addColorStop(0.55, '#7DD3FC');
      sky.addColorStop(1, '#FEF08A');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Sun orb
      const sun = ctx.createRadialGradient(w * 0.5, 190, 15, w * 0.5, 190, 190);
      sun.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      sun.addColorStop(0.4, 'rgba(253, 224, 71, 0.45)');
      sun.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      drawMountainLayer(ctx, w, h, 350, 55, 0.004, 0.5, '#0F766E', '#115E59');
      drawMountainLayer(ctx, w, h, 410, 40, 0.006, 2.1, '#15803D', '#14532D');

      // Shimmering Susquehanna River
      const river = ctx.createLinearGradient(0, 415, 0, h);
      river.addColorStop(0, '#38BDF8');
      river.addColorStop(0.4, '#0284C7');
      river.addColorStop(1, '#0369A1');
      ctx.fillStyle = river;
      ctx.fillRect(0, 415, w, h - 415);

      // Birch & Pine trees along riverbanks
      [90, 175, 260, 930, 1020, 1110].forEach((tx, idx) => {
        drawPineTree(ctx, tx, 430, 0.95 + (idx % 2) * 0.2, '#065F46');
      });

      // Lenape Birchbark Canoe in center river
      ctx.save();
      ctx.translate(w * 0.5, 470);
      ctx.fillStyle = '#92400E';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-115, -8);
      ctx.quadraticCurveTo(-130, -34, -95, -24);
      ctx.quadraticCurveTo(0, -6, 95, -24);
      ctx.quadraticCurveTo(130, -34, 115, -8);
      ctx.quadraticCurveTo(0, 26, -115, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Water ripples under canoe
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = 2.5;
      [-70, 0, 70].forEach((rx) => {
        ctx.beginPath();
        ctx.moveTo(rx - 35, 22);
        ctx.lineTo(rx + 35, 22);
        ctx.stroke();
      });
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '254, 240, 138', 0.2);
      drawFloatingLightMotes(ctx, w, h);
      break;
    }

    case 'cap1_2': {
      // Royal Throne Hall with Stained-Glass Windows & 1681 Charter
      const wall = ctx.createLinearGradient(0, 0, 0, h);
      wall.addColorStop(0, '#1E1B4B');
      wall.addColorStop(0.6, '#312E81');
      wall.addColorStop(1, '#451A03');
      ctx.fillStyle = wall;
      ctx.fillRect(0, 0, w, h);

      // Tall arched stained-glass windows
      [380, 600, 820].forEach((wx) => {
        const winGrad = ctx.createLinearGradient(wx, 90, wx, 420);
        winGrad.addColorStop(0, '#FEF08A');
        winGrad.addColorStop(0.5, '#38BDF8');
        winGrad.addColorStop(1, '#F59E0B');
        ctx.fillStyle = winGrad;
        drawRoundedRect(ctx, wx - 58, 95, 116, 305, 58);
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = KEYSTONE_GOLD;
        ctx.stroke();
      });

      // Crimson velvet royal drapes on flanks
      ctx.fillStyle = '#881337';
      ctx.fillRect(0, 0, 140, h);
      ctx.fillRect(w - 140, 0, 140, h);

      // Center pedestal with glowing 1681 Royal Charter & Great Seal
      ctx.save();
      ctx.translate(w * 0.5, 455);
      ctx.fillStyle = '#FEF3C7';
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 3.5;
      drawRoundedRect(ctx, -75, -90, 150, 105, 8);
      ctx.fill();
      ctx.stroke();

      // Red Wax Great Seal dangling
      ctx.fillStyle = PATRIOTIC_CRIMSON;
      ctx.beginPath();
      ctx.arc(45, 5, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '253, 224, 71', 0.22);
      break;
    }

    case 'cap1_3': {
      // Great Elm of Shackamaxon on the Delaware River at Sunset
      const sunset = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      sunset.addColorStop(0, '#581C87');
      sunset.addColorStop(0.4, '#C2410C');
      sunset.addColorStop(0.8, '#F59E0B');
      sunset.addColorStop(1, '#FEF08A');
      ctx.fillStyle = sunset;
      ctx.fillRect(0, 0, w, h);

      // Delaware River reflecting sunset
      const delaware = ctx.createLinearGradient(0, 420, 0, h);
      delaware.addColorStop(0, '#F59E0B');
      delaware.addColorStop(0.5, '#B45309');
      delaware.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = delaware;
      ctx.fillRect(0, 420, w, h - 420);

      // Monumental Great Elm Tree in center
      ctx.save();
      ctx.translate(w * 0.5, 445);
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.quadraticCurveTo(-28, -95, -35, -185);
      ctx.lineTo(35, -185);
      ctx.quadraticCurveTo(28, -95, 45, 0);
      ctx.closePath();
      ctx.fill();

      // Golden-autumn Elm canopy clouds
      const canopySpots = [
        { x: 0, y: -235, r: 105, c: '#B45309' },
        { x: -95, y: -200, r: 85, c: '#D97706' },
        { x: 95, y: -200, r: 85, c: '#D97706' },
        { x: 0, y: -195, r: 90, c: '#F59E0B' },
      ];
      canopySpots.forEach((sp) => {
        ctx.fillStyle = sp.c;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '251, 191, 36', 0.18);
      drawFloatingLightMotes(ctx, w, h);
      break;
    }

    case 'cap1_4': {
      // Perspective View of Philadelphia's 1682 Orthogonal Grid & 5 Green Squares
      const sky = ctx.createLinearGradient(0, 0, 0, 320);
      sky.addColorStop(0, '#1D4ED8');
      sky.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 320);

      // Green peninsula between Delaware & Schuylkill rivers
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, 320, w, h - 320);

      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.moveTo(140, h);
      ctx.lineTo(310, 320);
      ctx.lineTo(w - 310, 320);
      ctx.lineTo(w - 140, h);
      ctx.closePath();
      ctx.fill();

      // Perspective grid streets
      ctx.strokeStyle = '#FEF3C7';
      ctx.lineWidth = 4;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + i * 48, 320);
        ctx.lineTo(w * 0.5 + i * 115, h);
        ctx.stroke();
      }
      [365, 420, 485, 560].forEach((gy) => {
        ctx.beginPath();
        ctx.moveTo(220, gy);
        ctx.lineTo(w - 220, gy);
        ctx.stroke();
      });

      // Five wooded public squares (Center Square + 4 quadrants)
      const squares = [
        { x: w * 0.5, y: 450, s: 56 },
        { x: w * 0.5 - 125, y: 390, s: 40 },
        { x: w * 0.5 + 125, y: 390, s: 40 },
        { x: w * 0.5 - 155, y: 515, s: 44 },
        { x: w * 0.5 + 155, y: 515, s: 44 },
      ];
      squares.forEach((sq) => {
        ctx.fillStyle = '#22C55E';
        ctx.strokeStyle = KEYSTONE_GOLD;
        ctx.lineWidth = 2.5;
        ctx.fillRect(sq.x - sq.s / 2, sq.y - sq.s / 2, sq.s, sq.s);
        ctx.strokeRect(sq.x - sq.s / 2, sq.y - sq.s / 2, sq.s, sq.s);
      });
      break;
    }

    // =========================================================================
    // CHAPTER 2: 1776–1787 (LIBERTY FACTORY)
    // =========================================================================
    case 'cap2_1': {
      // Warm Georgian Interior of Independence Hall & Liberty Bell
      const room = ctx.createLinearGradient(0, 0, 0, h);
      room.addColorStop(0, '#7C2D12');
      room.addColorStop(0.65, '#9A3412');
      room.addColorStop(1, '#451A03');
      ctx.fillStyle = room;
      ctx.fillRect(0, 0, w, h);

      // Tall Georgian multi-pane arched windows
      [340, 860].forEach((wx) => {
        ctx.fillStyle = '#FEF9C3';
        drawRoundedRect(ctx, wx - 65, 110, 130, 290, 65);
        ctx.fill();
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 6;
        ctx.stroke();
      });

      // Iconic Bronze Liberty Bell in center
      ctx.save();
      ctx.translate(w * 0.5, 340);
      const bellGrad = ctx.createLinearGradient(-75, 0, 75, 0);
      bellGrad.addColorStop(0, '#92400E');
      bellGrad.addColorStop(0.5, '#FDE047');
      bellGrad.addColorStop(1, '#78350F');
      ctx.fillStyle = bellGrad;
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-48, -65);
      ctx.lineTo(48, -65);
      ctx.quadraticCurveTo(62, 15, 92, 65);
      ctx.lineTo(-92, 65);
      ctx.quadraticCurveTo(-62, 15, -48, -65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Famous crack line
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(8, -20);
      ctx.lineTo(18, 12);
      ctx.lineTo(10, 42);
      ctx.lineTo(22, 64);
      ctx.stroke();
      ctx.restore();

      drawGodRays(ctx, w, h, 340, '254, 240, 138', 0.22);
      break;
    }

    case 'cap2_2': {
      // Candlelit Zion Church in Allentown hiding the Liberty Bell under the floor
      const crypt = ctx.createLinearGradient(0, 0, 0, h);
      crypt.addColorStop(0, '#0F172A');
      crypt.addColorStop(0.7, '#334155');
      crypt.addColorStop(1, '#451A03');
      ctx.fillStyle = crypt;
      ctx.fillRect(0, 0, w, h);

      // Warm candlelight halo in center
      const candle = ctx.createRadialGradient(w * 0.5, 360, 20, w * 0.5, 360, 320);
      candle.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
      candle.addColorStop(0.5, 'rgba(217, 119, 6, 0.35)');
      candle.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = candle;
      ctx.fillRect(0, 0, w, h);

      // Open floorboards & Liberty Bell being lowered by ropes
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 35, 120);
      ctx.lineTo(w * 0.5 - 35, 340);
      ctx.moveTo(w * 0.5 + 35, 120);
      ctx.lineTo(w * 0.5 + 35, 340);
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(w * 0.5, 375, 58, Math.PI, 0);
      ctx.lineTo(w * 0.5 + 75, 430);
      ctx.lineTo(w * 0.5 - 75, 430);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'cap2_3': {
      // Snowy Valley Forge Encampment at Twilight with Warm Campfires
      const winterSky = ctx.createLinearGradient(0, 0, 0, 380);
      winterSky.addColorStop(0, '#0F172A');
      winterSky.addColorStop(0.6, '#1E3A8A');
      winterSky.addColorStop(1, '#93C5FD');
      ctx.fillStyle = winterSky;
      ctx.fillRect(0, 0, w, 380);

      // Snowdrifts
      const snow = ctx.createLinearGradient(0, 360, 0, h);
      snow.addColorStop(0, '#F8FAFC');
      snow.addColorStop(1, '#CBD5E1');
      ctx.fillStyle = snow;
      ctx.fillRect(0, 360, w, h - 360);

      // Snow-covered pines & Continental log huts / tents
      [140, 290, 910, 1050].forEach((tx) => {
        drawPineTree(ctx, tx, 385, 1.05, '#1E3A8A', true);
      });

      // White canvas tents
      [430, 770].forEach((tx) => {
        ctx.fillStyle = '#E2E8F0';
        ctx.strokeStyle = COLORED_INK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tx, 295);
        ctx.lineTo(tx + 75, 395);
        ctx.lineTo(tx - 75, 395);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Glowing campfire in center snow
      const fireGlow = ctx.createRadialGradient(w * 0.5, 445, 10, w * 0.5, 445, 175);
      fireGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      fireGlow.addColorStop(0.4, 'rgba(249, 115, 22, 0.55)');
      fireGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(w * 0.5, 445, 175, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 35, 460);
      ctx.quadraticCurveTo(w * 0.5, 375, w * 0.5 + 35, 460);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'cap2_4': {
      // Washington's Rising Sun Chair at the 1787 Constitutional Convention
      const hall = ctx.createLinearGradient(0, 0, 0, h);
      hall.addColorStop(0, '#1E3A8A');
      hall.addColorStop(0.6, '#172554');
      hall.addColorStop(1, '#451A03');
      ctx.fillStyle = hall;
      ctx.fillRect(0, 0, w, h);

      // Golden Rising Sun Chair back in center
      ctx.save();
      ctx.translate(w * 0.5, 430);
      ctx.fillStyle = '#78350F';
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, -70, -195, 140, 195, 45);
      ctx.fill();
      ctx.stroke();

      // Carved Golden Rising Sun motif on top of chair
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(0, -145, 38, Math.PI, 0);
      ctx.fill();
      for (let a = -Math.PI; a <= 0; a += Math.PI / 8) {
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 42, -145 + Math.sin(a) * 42);
        ctx.lineTo(Math.cos(a) * 64, -145 + Math.sin(a) * 64);
        ctx.stroke();
      }
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '253, 224, 71', 0.22);
      break;
    }

    // =========================================================================
    // CHAPTER 3: 1790–1860 (BORDERS, CANALS & SECRET ROUTES)
    // =========================================================================
    case 'cap3_1': {
      // Starry Night on the Mason-Dixon Line with Brass Telescope & Boundary Stone
      const night = ctx.createLinearGradient(0, 0, 0, h);
      night.addColorStop(0, '#090D16');
      night.addColorStop(0.65, '#1E1B4B');
      night.addColorStop(1, '#064E3B');
      ctx.fillStyle = night;
      ctx.fillRect(0, 0, w, h);

      drawFloatingLightMotes(ctx, w, h, 'rgba(255, 255, 255, 0.85)', 45);

      // Mason-Dixon Limestone Marker ("P") & Brass Telescope in center
      ctx.save();
      ctx.translate(w * 0.5, 455);
      ctx.fillStyle = '#CBD5E1';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, -38, -95, 76, 95, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 42px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('P', 0, -35);

      // Brass telescope on tripod beside stone
      ctx.translate(85, -55);
      ctx.rotate(-0.45);
      ctx.fillStyle = KEYSTONE_GOLD;
      ctx.fillRect(-55, -12, 110, 24);
      ctx.strokeRect(-55, -12, 110, 24);
      ctx.restore();
      break;
    }

    case 'cap3_2': {
      // Lake Erie Port with Tall Ships at Presque Isle & Harrisburg Capitol Dome
      const sky = ctx.createLinearGradient(0, 0, 0, 410);
      sky.addColorStop(0, '#0284C7');
      sky.addColorStop(1, '#E0F2FE');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 410);

      // Lake Erie waters
      ctx.fillStyle = '#0369A1';
      ctx.fillRect(0, 410, w, h - 410);

      // Tall ship sails in center-left
      ctx.save();
      ctx.translate(w * 0.44, 395);
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.moveTo(-75, 0);
      ctx.lineTo(75, 0);
      ctx.lineTo(52, 32);
      ctx.lineTo(-52, 32);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFDF5';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 2.5;
      ctx.fillRect(-45, -115, 90, 95);
      ctx.strokeRect(-45, -115, 90, 95);
      ctx.restore();

      // Capitol dome silhouette on right horizon
      ctx.save();
      ctx.translate(w * 0.62, 410);
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(0, -55, 48, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-58, -55, 116, 55);
      ctx.restore();
      break;
    }

    case 'cap3_3': {
      // Starry Night with Glowing North Star & Underground Railroad Safe House Lantern
      const night = ctx.createLinearGradient(0, 0, 0, h);
      night.addColorStop(0, '#020617');
      night.addColorStop(0.65, '#1E1B4B');
      night.addColorStop(1, '#1E293B');
      ctx.fillStyle = night;
      ctx.fillRect(0, 0, w, h);

      drawFloatingLightMotes(ctx, w, h, 'rgba(255, 255, 255, 0.8)', 40);

      // Brilliant North Star (Polaris) at top center
      ctx.save();
      ctx.translate(w * 0.5, 145);
      const starGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 85);
      starGlow.addColorStop(0, 'rgba(254, 240, 138, 1)');
      starGlow.addColorStop(0.4, 'rgba(56, 189, 248, 0.45)');
      starGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = starGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-42, 0);
      ctx.lineTo(42, 0);
      ctx.moveTo(0, -42);
      ctx.lineTo(0, 42);
      ctx.stroke();
      ctx.restore();

      // Stone Safe House Barn with warm glowing window in center
      ctx.save();
      ctx.translate(w * 0.5, 445);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-85, 0);
      ctx.lineTo(-85, -95);
      ctx.lineTo(0, -155);
      ctx.lineTo(85, -95);
      ctx.lineTo(85, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FDE047';
      ctx.fillRect(-24, -85, 48, 48);
      ctx.restore();
      break;
    }

    case 'cap3_4': {
      // White-Canvas Conestoga Wagon Crossing the Allegheny Mountains
      const sky = ctx.createLinearGradient(0, 0, 0, 390);
      sky.addColorStop(0, '#2563EB');
      sky.addColorStop(1, '#FDE68A');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 390);

      drawMountainLayer(ctx, w, h, 355, 65, 0.004, 1.1, '#1E3A8A', '#0F172A');
      drawMountainLayer(ctx, w, h, 425, 45, 0.006, 2.5, '#15803D', '#14532D');

      // Conestoga Wagon in center
      ctx.save();
      ctx.translate(w * 0.5, 425);
      // Curved white canvas bonnet
      ctx.fillStyle = '#FFFDF5';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-95, -25);
      ctx.lineTo(-110, -110);
      ctx.quadraticCurveTo(0, -135, 110, -110);
      ctx.lineTo(95, -25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Blue wagon bed
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(-95, -25, 190, 32);
      ctx.strokeRect(-95, -25, 190, 32);

      // Red spoked wheels
      [-62, 62].forEach((wx) => {
        ctx.fillStyle = '#B22234';
        ctx.beginPath();
        ctx.arc(wx, 12, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
      break;
    }

    // =========================================================================
    // CHAPTER 4: 1861–1865 (GETTYSBURG)
    // =========================================================================
    case 'cap4_1': {
      // Steam Locomotive Mobilizing Troops & Supplies at Camp Curtin (Harrisburg)
      const sky = ctx.createLinearGradient(0, 0, 0, 410);
      sky.addColorStop(0, '#1E3A8A');
      sky.addColorStop(1, '#FDBA74');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 410);

      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 410, w, h - 410);

      // Civil War Steam Locomotive in center
      ctx.save();
      ctx.translate(w * 0.5, 415);
      // Smoke plumes
      ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
      [
        { x: -55, y: -155, r: 28 },
        { x: -20, y: -180, r: 36 },
        { x: 25, y: -200, r: 42 },
      ].forEach((sm) => {
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Boiler & Smokestack
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 3;
      ctx.fillRect(-95, -75, 165, 55);
      ctx.strokeRect(-95, -75, 165, 55);

      // Funnel stack
      ctx.beginPath();
      ctx.moveTo(-75, -75);
      ctx.lineTo(-90, -130);
      ctx.lineTo(-45, -130);
      ctx.lineTo(-55, -75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red drive wheels
      [-55, 0, 55].forEach((wx) => {
        ctx.fillStyle = PATRIOTIC_CRIMSON;
        ctx.beginPath();
        ctx.arc(wx, -12, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
      break;
    }

    case 'cap4_2': {
      // Wrightsville Covered Bridge over the Susquehanna River at Sunset
      const sunset = ctx.createLinearGradient(0, 0, 0, 410);
      sunset.addColorStop(0, '#7F1D1D');
      sunset.addColorStop(0.5, '#EA580C');
      sunset.addColorStop(1, '#FDE047');
      ctx.fillStyle = sunset;
      ctx.fillRect(0, 0, w, 410);

      // Susquehanna River
      const river = ctx.createLinearGradient(0, 410, 0, h);
      river.addColorStop(0, '#F59E0B');
      river.addColorStop(1, '#1E293B');
      ctx.fillStyle = river;
      ctx.fillRect(0, 410, w, h - 410);

      // Stone piers & Wooden Covered Bridge spanning across center
      ctx.fillStyle = '#78350F';
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3.5;
      ctx.fillRect(210, 325, w - 420, 62);
      ctx.strokeRect(210, 325, w - 420, 62);

      // Stone arches beneath bridge
      [330, 500, 670, 840].forEach((px) => {
        ctx.fillStyle = '#64748B';
        ctx.fillRect(px - 22, 387, 44, 55);
      });
      break;
    }

    case 'cap4_3': {
      // Cemetery Ridge at Gettysburg under Dramatic July 1863 Sky
      const sky = ctx.createLinearGradient(0, 0, 0, 385);
      sky.addColorStop(0, '#1E293B');
      sky.addColorStop(0.55, '#475569');
      sky.addColorStop(1, '#FDE68A');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 385);

      drawMountainLayer(ctx, w, h, 390, 45, 0.005, 0.8, '#15803D', '#14532D');

      // Stone wall & Union Napoleon Cannon on Cemetery Ridge
      ctx.save();
      ctx.translate(w * 0.5, 430);
      ctx.fillStyle = '#64748B';
      for (let sx = -140; sx <= 120; sx += 38) {
        drawRoundedRect(ctx, sx, 0, 36, 26, 6);
        ctx.fill();
      }

      // Bronze cannon barrel & wheel
      ctx.fillStyle = KEYSTONE_GOLD;
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 3;
      ctx.save();
      ctx.rotate(-0.15);
      ctx.fillRect(-55, -48, 115, 22);
      ctx.strokeRect(-55, -48, 115, 22);
      ctx.restore();

      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -22, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '253, 224, 71', 0.18);
      break;
    }

    case 'cap4_4': {
      // Solemn Rostrum at Soldiers' National Cemetery in Gettysburg (Nov 19, 1863)
      const autumnSky = ctx.createLinearGradient(0, 0, 0, 410);
      autumnSky.addColorStop(0, '#1D4ED8');
      autumnSky.addColorStop(0.6, '#93C5FD');
      autumnSky.addColorStop(1, '#FEF3C7');
      ctx.fillStyle = autumnSky;
      ctx.fillRect(0, 0, w, 410);

      ctx.fillStyle = '#166534';
      ctx.fillRect(0, 410, w, h - 410);

      // Presidential Speaker's Platform draped with Union bunting in center
      ctx.save();
      ctx.translate(w * 0.5, 430);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(-135, -65, 270, 65);

      // Patriotic Red-White-Blue swags
      [-90, 0, 90].forEach((bx) => {
        ctx.fillStyle = PATRIOTIC_CRIMSON;
        ctx.beginPath();
        ctx.arc(bx, -65, 44, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = FEDERAL_BLUE;
        ctx.beginPath();
        ctx.arc(bx, -65, 26, 0, Math.PI);
        ctx.fill();
      });
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '254, 240, 138', 0.24);
      break;
    }

    // =========================================================================
    // CHAPTER 5: 1859–1930 (COAL, STEEL & OIL)
    // =========================================================================
    case 'cap5_1': {
      // Edwin Drake's 1859 Wooden Oil Derrick in Titusville Forest
      const sky = ctx.createLinearGradient(0, 0, 0, 400);
      sky.addColorStop(0, '#0369A1');
      sky.addColorStop(1, '#FDE68A');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 400);

      drawMountainLayer(ctx, w, h, 395, 50, 0.005, 1.4, '#065F46', '#064E3B');

      // 1859 Drake Wooden Derrick Tower in center
      ctx.save();
      ctx.translate(w * 0.5, 445);
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-55, 0);
      ctx.lineTo(-22, -210);
      ctx.lineTo(22, -210);
      ctx.lineTo(55, 0);
      ctx.stroke();

      // Cross-braces
      for (let y = -40; y >= -180; y -= 45) {
        const halfW = 55 - Math.abs(y) * 0.16;
        ctx.beginPath();
        ctx.moveTo(-halfW, y);
        ctx.lineTo(halfW, y);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case 'cap5_2': {
      // Scranton Anthracite Breaker & First Electric Streetcar (1886)
      const dusk = ctx.createLinearGradient(0, 0, 0, h);
      dusk.addColorStop(0, '#0F172A');
      dusk.addColorStop(0.6, '#1E3A8A');
      dusk.addColorStop(1, '#334155');
      ctx.fillStyle = dusk;
      ctx.fillRect(0, 0, w, h);

      // Electric Streetcar in center with overhead trolley wire & golden sparks
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(200, 250);
      ctx.lineTo(w - 200, 250);
      ctx.stroke();

      ctx.save();
      ctx.translate(w * 0.5, 425);
      ctx.fillStyle = '#B22234';
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 3.5;
      drawRoundedRect(ctx, -105, -95, 210, 82, 12);
      ctx.fill();
      ctx.stroke();

      // Glowing yellow streetcar windows
      [-65, 0, 65].forEach((wx) => {
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(wx - 22, -75, 44, 36);
      });

      // Trolley pole & electric spark at wire
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -95);
      ctx.lineTo(28, -175);
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(28, -175, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'cap5_3': {
      // Glowing Pittsburgh Blast Furnaces at Night & Horseshoe Curve
      const steelNight = ctx.createLinearGradient(0, 0, 0, h);
      steelNight.addColorStop(0, '#090D16');
      steelNight.addColorStop(0.55, '#1E1B4B');
      steelNight.addColorStop(1, '#9A3412');
      ctx.fillStyle = steelNight;
      ctx.fillRect(0, 0, w, h);

      // Molten orange blast furnace glow
      const furnaceGlow = ctx.createRadialGradient(w * 0.5, 420, 20, w * 0.5, 420, 280);
      furnaceGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      furnaceGlow.addColorStop(0.45, 'rgba(249, 115, 22, 0.65)');
      furnaceGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = furnaceGlow;
      ctx.fillRect(0, 0, w, h);

      // Towering Bessemer blast furnace stacks in center
      [-75, 0, 75].forEach((fx) => {
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 2.5;
        ctx.fillRect(w * 0.5 + fx - 24, 215, 48, 225);
        ctx.strokeRect(w * 0.5 + fx - 24, 215, 48, 225);
      });

      drawFloatingLightMotes(ctx, w, h, 'rgba(251, 146, 60, 0.85)', 36);
      break;
    }

    case 'cap5_4': {
      // The Bronze Justice Bell Touring a Festive Women's Suffrage Plaza (1915–1920)
      const sky = ctx.createLinearGradient(0, 0, 0, 410);
      sky.addColorStop(0, '#4C1D95');
      sky.addColorStop(0.5, '#7C3AED');
      sky.addColorStop(1, '#FDE047');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, 410);

      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 410, w, h - 410);

      // Justice Bell in center with "VOTES FOR WOMEN" banner
      ctx.save();
      ctx.translate(w * 0.5, 385);
      ctx.fillStyle = KEYSTONE_GOLD;
      ctx.strokeStyle = COLORED_INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-45, -85);
      ctx.lineTo(45, -85);
      ctx.lineTo(78, 15);
      ctx.lineTo(-78, 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-115, 18, 230, 32);
      ctx.strokeRect(-115, 18, 230, 32);
      ctx.fillStyle = '#4C1D95';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VOTES FOR WOMEN · 1920', 0, 39);
      ctx.restore();
      break;
    }

    // =========================================================================
    // CHAPTER 6: 1930–PRESENT (MODERN PENNSYLVANIA)
    // =========================================================================
    case 'cap6_1': {
      // 1946 ENIAC Computer Room at UPenn with Vacuum Tubes & Indicator Lights
      const lab = ctx.createLinearGradient(0, 0, 0, h);
      lab.addColorStop(0, '#09111E');
      lab.addColorStop(1, '#1E293B');
      ctx.fillStyle = lab;
      ctx.fillRect(0, 0, w, h);

      // ENIAC Mainframe Cabinets across center
      for (let cx = 310; cx <= 830; cx += 110) {
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.fillRect(cx, 175, 96, 265);
        ctx.strokeRect(cx, 175, 96, 265);

        // Glowing vacuum tube grid
        for (let ty = 195; ty <= 395; ty += 28) {
          for (let tx = cx + 16; tx <= cx + 80; tx += 22) {
            ctx.fillStyle = (tx + ty) % 3 === 0 ? '#F59E0B' : '#38BDF8';
            ctx.beginPath();
            ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      break;
    }

    case 'cap6_2': {
      // Crystal Waterfall & Hemlock Forest in a Pennsylvania State Park
      const parkSky = ctx.createLinearGradient(0, 0, 0, 380);
      parkSky.addColorStop(0, '#0284C7');
      parkSky.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = parkSky;
      ctx.fillRect(0, 0, w, 380);

      drawMountainLayer(ctx, w, h, 360, 50, 0.005, 0.4, '#047857', '#064E3B');

      // Cascading turquoise waterfall in center
      const fallGrad = ctx.createLinearGradient(w * 0.5, 250, w * 0.5, h);
      fallGrad.addColorStop(0, '#E0F2FE');
      fallGrad.addColorStop(0.5, '#38BDF8');
      fallGrad.addColorStop(1, '#0284C7');
      ctx.fillStyle = fallGrad;
      ctx.fillRect(w * 0.5 - 65, 260, 130, h - 260);

      [290, 380, 820, 910].forEach((tx) => {
        drawPineTree(ctx, tx, 430, 1.1, '#065F46');
      });

      drawGodRays(ctx, w, h, w * 0.5, '254, 240, 138', 0.18);
      break;
    }

    case 'cap6_3': {
      // Luminous Modern Skyline Blending Philadelphia, Pittsburgh & Bilingual Schools
      const modernSky = ctx.createLinearGradient(0, 0, 0, 420);
      modernSky.addColorStop(0, '#1E3A8A');
      modernSky.addColorStop(0.6, '#3B82F6');
      modernSky.addColorStop(1, '#FDE047');
      ctx.fillStyle = modernSky;
      ctx.fillRect(0, 0, w, 420);

      // Modern glass skyscrapers & Golden Pittsburgh bridge arch in center
      const towers = [
        { x: 380, w: 58, h: 210 },
        { x: 455, w: 66, h: 265 },
        { x: 540, w: 72, h: 240 },
        { x: 630, w: 64, h: 275 },
        { x: 715, w: 58, h: 195 },
      ];
      towers.forEach((tw) => {
        ctx.fillStyle = '#0F1C30';
        ctx.strokeStyle = '#60A5FA';
        ctx.lineWidth = 2.5;
        ctx.fillRect(tw.x, 420 - tw.h, tw.w, tw.h);
        ctx.strokeRect(tw.x, 420 - tw.h, tw.w, tw.h);
      });

      // Golden Bridge Arch across foreground
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(w * 0.5, 455, 165, Math.PI, 0);
      ctx.stroke();
      break;
    }

    case 'cap6_4':
    default: {
      // Official Blue-and-Gold PHMC Plaque & Glowing 67-County Map
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#09111E');
      sky.addColorStop(0.55, '#1E3A8A');
      sky.addColorStop(1, '#0F1C30');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Official PHMC Blue-and-Gold Plaque on post in center
      ctx.save();
      ctx.translate(w * 0.5, 365);
      ctx.fillStyle = KEYSTONE_GOLD;
      ctx.fillRect(-8, 40, 16, 140);

      ctx.fillStyle = '#1E3A8A';
      ctx.strokeStyle = KEYSTONE_GOLD;
      ctx.lineWidth = 6;
      drawRoundedRect(ctx, -125, -85, 250, 135, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = KEYSTONE_GOLD;
      ctx.font = 'bold 20px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('PENNSYLVANIA', 0, -45);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('67 COUNTIES · 1681–PRESENT', 0, -12);
      ctx.fillText('KEYSTONE CHRONOMAP', 0, 18);
      ctx.restore();

      drawGodRays(ctx, w, h, w * 0.5, '212, 175, 55', 0.2);
      drawFloatingLightMotes(ctx, w, h);
      break;
    }
  }

  ctx.restore();
}

interface CharacterVisualTheme {
  skinLight: string;
  skinShadow: string;
  irisTop: string;
  irisBottom: string;
  hairMain: string;
  hairHighlight: string;
  coatMain: string;
  coatTrim: string;
}

const CHARACTER_THEMES: Record<ComicCharacterId, CharacterVisualTheme> = {
  keystone_kid: {
    skinLight: '#FDE2CE',
    skinShadow: '#E5B293',
    irisTop: '#1D4ED8',
    irisBottom: '#60A5FA',
    hairMain: '#5C3A21',
    hairHighlight: '#A16207',
    coatMain: '#1D4ED8',
    coatTrim: '#D4AF37',
  },
  william_penn: {
    skinLight: '#FCE5D2',
    skinShadow: '#DFB092',
    irisTop: '#0F766E',
    irisBottom: '#5EEAD4',
    hairMain: '#3E2723',
    hairHighlight: '#78350F',
    coatMain: '#1E293B',
    coatTrim: '#D4AF37',
  },
  lenape_chief: {
    skinLight: '#D99B72',
    skinShadow: '#A86A43',
    irisTop: '#451A03',
    irisBottom: '#B45309',
    hairMain: '#0F172A',
    hairHighlight: '#334155',
    coatMain: '#92400E',
    coatTrim: '#38BDF8',
  },
  ben_franklin: {
    skinLight: '#FCE5D2',
    skinShadow: '#DFB092',
    irisTop: '#0369A1',
    irisBottom: '#7DD3FC',
    hairMain: '#CBD5E1',
    hairHighlight: '#F8FAFC',
    coatMain: '#5C2D16',
    coatTrim: '#D4AF37',
  },
  harriet_conductor: {
    skinLight: '#8D5524',
    skinShadow: '#5C3310',
    irisTop: '#451A03',
    irisBottom: '#92400E',
    hairMain: '#18181B',
    hairHighlight: '#3F3F46',
    coatMain: '#312E81',
    coatTrim: '#F59E0B',
  },
  abe_lincoln: {
    skinLight: '#F7D7C0',
    skinShadow: '#D4A587',
    irisTop: '#334155',
    irisBottom: '#94A3B8',
    hairMain: '#18181B',
    hairHighlight: '#3F3F46',
    coatMain: '#0F172A',
    coatTrim: '#D4AF37',
  },
  coal_steel_pioneer: {
    skinLight: '#F5D0B5',
    skinShadow: '#CFA07E',
    irisTop: '#78350F',
    irisBottom: '#F59E0B',
    hairMain: '#27272A',
    hairHighlight: '#52525B',
    coatMain: '#334155',
    coatTrim: '#F59E0B',
  },
  eniac_scientist: {
    skinLight: '#FDE2CE',
    skinShadow: '#E5B293',
    irisTop: '#047857',
    irisBottom: '#6EE7B7',
    hairMain: '#7C2D12',
    hairHighlight: '#EA580C',
    coatMain: '#0F766E',
    coatTrim: '#D4AF37',
  },
};

/**
 * Draws a stylized 2D animated-feature character in bust/medium shot with volumetric shading,
 * gradient irises with dual specular catchlights, sculpted hair, and gesturing prop hand.
 */
export function drawExpressiveCharacter2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bottomY: number,
  slot: ComicCharacterSlot,
  facingRight: boolean,
  scale = 1
) {
  const theme = CHARACTER_THEMES[slot.id] || CHARACTER_THEMES.keystone_kid;
  const dir = facingRight ? 1 : -1;

  ctx.save();
  ctx.translate(cx, bottomY);
  ctx.scale(scale, scale);

  // 1. Torso / Tailored Period Coat with volumetric gradient
  const coatGrad = ctx.createLinearGradient(-85, -175, 85, 0);
  coatGrad.addColorStop(0, theme.coatMain);
  coatGrad.addColorStop(1, '#09111E');
  ctx.fillStyle = coatGrad;
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 3.5;

  ctx.beginPath();
  ctx.moveTo(-92, 0);
  ctx.quadraticCurveTo(-84, -125, -45, -148);
  ctx.lineTo(45, -148);
  ctx.quadraticCurveTo(84, -125, 92, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Collar / Cravat / Lapel Trim
  ctx.fillStyle = '#FFFDF5';
  ctx.beginPath();
  ctx.moveTo(-26, -148);
  ctx.lineTo(26, -148);
  ctx.lineTo(0, -96);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Golden lapel trim buttons
  ctx.fillStyle = theme.coatTrim;
  [-32, 32].forEach((bx) => {
    ctx.beginPath();
    ctx.arc(bx, -112, 5, 0, Math.PI * 2);
    ctx.arc(bx * 1.1, -82, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Neck with soft cast shadow
  ctx.fillStyle = theme.skinShadow;
  drawRoundedRect(ctx, -18, -175, 36, 36, 10);
  ctx.fill();
  ctx.stroke();

  // 3. Back Hair Volume (for characters with long/shoulder hair)
  if (
    slot.id === 'ben_franklin' ||
    slot.id === 'william_penn' ||
    slot.id === 'lenape_chief' ||
    slot.id === 'eniac_scientist'
  ) {
    ctx.fillStyle = theme.hairMain;
    ctx.beginPath();
    ctx.ellipse(0, -210, 68, 56, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 4. Sculpted Head with Soft Radial Volumetric Skin Shading
  const headY = -222;
  const skinGrad = ctx.createRadialGradient(
    dir * 14,
    headY - 12,
    10,
    0,
    headY,
    64
  );
  skinGrad.addColorStop(0, theme.skinLight);
  skinGrad.addColorStop(1, theme.skinShadow);
  ctx.fillStyle = skinGrad;
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 3.5;

  ctx.beginPath();
  ctx.moveTo(-52, headY - 10);
  ctx.bezierCurveTo(-54, headY - 62, 54, headY - 62, 52, headY - 10);
  ctx.bezierCurveTo(50, headY + 34, 24, headY + 54, 0, headY + 56);
  ctx.bezierCurveTo(-24, headY + 54, -50, headY + 34, -52, headY - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Warm cheek blush
  ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
  ctx.beginPath();
  ctx.ellipse(-28, headY + 14, 12, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(28, headY + 14, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Large Expressive Animated-Style Eyes with Gradient Irises & Dual Specular Highlights
  [-21, 21].forEach((ex) => {
    const eyeX = ex + dir * 3;
    const eyeY = headY - 4;

    // Sclera
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 13.5, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = COLORED_INK;
    ctx.stroke();

    // Iris vertical gradient
    const irisGrad = ctx.createLinearGradient(eyeX, eyeY - 11, eyeX, eyeY + 11);
    irisGrad.addColorStop(0, theme.irisTop);
    irisGrad.addColorStop(1, theme.irisBottom);
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(eyeX + dir * 2, eyeY, 9.2, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark pupil
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.arc(eyeX + dir * 2, eyeY + 1, 5, 0, Math.PI * 2);
    ctx.fill();

    // Dual crisp white specular catchlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeX + dir * 2 - 3.2, eyeY - 4.2, 3.2, 0, Math.PI * 2);
    ctx.arc(eyeX + dir * 2 + 3.2, eyeY + 3.5, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Upper eyelid contour
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY - 1, 13.5, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
  });

  // 6. Expressive Eyebrows based on CharacterExpression
  const drawBrow = (bx: number, isLeft: boolean) => {
    ctx.save();
    ctx.translate(bx + dir * 3, headY - 24);
    if (slot.expression === 'determined') {
      ctx.rotate(isLeft ? 0.18 : -0.18);
    } else if (slot.expression === 'excited' || slot.expression === 'heroic') {
      ctx.translate(0, -3);
    }
    ctx.fillStyle = theme.hairMain;
    drawRoundedRect(ctx, -14, -3.5, 28, 6.5, 3);
    ctx.fill();
    ctx.restore();
  };
  drawBrow(-22, true);
  drawBrow(22, false);

  // 7. Sculpted Nose Bridge & Expressive Mouth
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(dir * 3, headY + 2);
  ctx.lineTo(dir * 7, headY + 13);
  ctx.lineTo(dir * 1, headY + 15);
  ctx.stroke();

  // Lincoln's signature sculpted chin beard
  if (slot.id === 'abe_lincoln') {
    ctx.fillStyle = theme.hairMain;
    ctx.beginPath();
    ctx.moveTo(-46, headY + 12);
    ctx.quadraticCurveTo(0, headY + 75, 46, headY + 12);
    ctx.quadraticCurveTo(0, headY + 46, -46, headY + 12);
    ctx.closePath();
    ctx.fill();
  }

  // Expressive Mouth
  ctx.save();
  ctx.translate(dir * 3, headY + 30);
  if (slot.expression === 'excited' || slot.expression === 'happy' || slot.expression === 'heroic') {
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Upper teeth shine
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-9, 0, 18, 4.5);
  } else {
    ctx.strokeStyle = COLORED_INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-11, 2);
    ctx.quadraticCurveTo(0, 8, 11, 1);
    ctx.stroke();
  }
  ctx.restore();

  // 8. Franklin's Bifocal Spectacles
  if (slot.id === 'ben_franklin') {
    ctx.strokeStyle = KEYSTONE_GOLD;
    ctx.lineWidth = 3;
    [-21, 21].forEach((sx) => {
      ctx.beginPath();
      ctx.arc(sx + dir * 3, headY - 4, 16, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(-5 + dir * 3, headY - 5);
    ctx.lineTo(5 + dir * 3, headY - 5);
    ctx.stroke();
  }

  // 9. Sculpted Front Hair Locks & Period Headgear
  ctx.fillStyle = theme.hairMain;
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-52, headY - 18);
  ctx.quadraticCurveTo(0, headY - 68, 52, headY - 18);
  ctx.quadraticCurveTo(18, headY - 42, -52, headY - 18);
  ctx.closePath();
  ctx.fill();

  if (slot.id === 'keystone_kid') {
    // Blue & Gold Keystone Explorer Cap
    ctx.fillStyle = FEDERAL_BLUE;
    ctx.beginPath();
    ctx.arc(0, headY - 26, 52, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = KEYSTONE_GOLD;
    drawRoundedRect(ctx, dir > 0 ? -15 : -58, headY - 32, 72, 12, 6);
    ctx.fill();
    ctx.stroke();
  } else if (slot.id === 'william_penn') {
    // Wide-brimmed Quaker Hat with Gold Buckle
    ctx.fillStyle = '#0F172A';
    drawRoundedRect(ctx, -78, headY - 46, 156, 14, 7);
    ctx.fill();
    ctx.stroke();
    drawRoundedRect(ctx, -44, headY - 88, 88, 44, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = KEYSTONE_GOLD;
    ctx.strokeRect(-12, headY - 58, 24, 12);
  } else if (slot.id === 'abe_lincoln') {
    // Tall Presidential Stovepipe Silk Top Hat
    ctx.fillStyle = '#090D16';
    drawRoundedRect(ctx, -64, headY - 44, 128, 12, 6);
    ctx.fill();
    ctx.stroke();
    drawRoundedRect(ctx, -42, headY - 120, 84, 78, 8);
    ctx.fill();
    ctx.stroke();
  } else if (slot.id === 'lenape_chief') {
    // Wampum Headband & Dual Eagle Feathers
    ctx.fillStyle = '#0284C7';
    drawRoundedRect(ctx, -52, headY - 38, 104, 12, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.ellipse(-dir * 38, headY - 68, 9, 28, -dir * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (slot.id === 'coal_steel_pioneer') {
    // Miner Carbide Helmet with Glowing Lamp
    ctx.fillStyle = '#451A03';
    ctx.beginPath();
    ctx.arc(0, headY - 28, 52, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(0, headY - 52, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 10. Gesturing Foreground Hand Holding Character Historical Prop
  ctx.save();
  ctx.translate(dir * 72, -62);
  ctx.fillStyle = theme.skinLight;
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (slot.id === 'keystone_kid') {
    // Golden Magnifying Glass / Compass
    ctx.strokeStyle = KEYSTONE_GOLD;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(dir * 12, -22, 16, 0, Math.PI * 2);
    ctx.stroke();
  } else if (slot.id === 'william_penn' || slot.id === 'abe_lincoln') {
    // Historical Parchment Scroll
    ctx.fillStyle = '#FEF3C7';
    drawRoundedRect(ctx, -10, -42, 26, 38, 4);
    ctx.fill();
    ctx.stroke();
  } else if (slot.id === 'harriet_conductor') {
    // Glowing Lantern
    ctx.fillStyle = '#FEF08A';
    drawRoundedRect(ctx, -12, -38, 24, 30, 6);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 11. Character Name Ribbon Pill at Base
  const charName = slot.nameEn; // Overridden by caller if needed, or we draw in panel
  void charName;

  ctx.restore();
}

/**
 * Draws an auto-fitted, dynamically-sized rounded comic speech bubble in the upper corners with soft shadow
 */
function drawEditorialSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  minH: number,
  tailTargetX: number,
  tailTargetY: number,
  speakerName: string,
  speechText: string,
  accentColor: string
) {
  ctx.save();

  // 1. Pre-calculate wrapped lines and auto-fit font size so 100% of text fits without clipping
  const padX = 20;
  const topBadgeReserve = 18;
  const bottomPad = 14;
  const maxTextW = w - padX * 2;
  const targetTextH = minH - topBadgeReserve - bottomPad;

  let fontSize = 18;
  let lineHeight = fontSize * 1.26;
  let lines: string[] = [];

  while (fontSize >= 11.5) {
    ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    lines = wrapTextLines(ctx, speechText, maxTextW);
    lineHeight = fontSize * 1.25;
    if (lines.length * lineHeight <= targetTextH) {
      break;
    }
    fontSize -= 0.75;
  }

  const totalBlockH = lines.length * lineHeight;
  // Dynamically expand bubble height if the wrapped paragraph needs more vertical space
  const actualH = Math.max(minH, totalBlockH + topBadgeReserve + bottomPad);

  // 2. Soft drop shadow + Speech bubble body
  ctx.shadowColor = 'rgba(9, 17, 30, 0.38)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = 'rgba(255, 253, 245, 0.96)';
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 3.2;

  drawRoundedRect(ctx, x, y, w, actualH, 20);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.stroke();

  // 3. Pointer triangle toward character
  const tailBaseX = Math.min(Math.max(tailTargetX, x + 42), x + w - 42);
  ctx.fillStyle = 'rgba(255, 253, 245, 0.96)';
  ctx.beginPath();
  ctx.moveTo(tailBaseX - 14, y + actualH - 2);
  ctx.lineTo(tailTargetX, Math.max(tailTargetY, y + actualH + 22));
  ctx.lineTo(tailBaseX + 14, y + actualH - 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 4. Speaker Name Pill Badge on top edge of bubble
  ctx.font = '800 13.5px "Plus Jakarta Sans", sans-serif';
  const badgeW = Math.min(
    ctx.measureText(speakerName.toUpperCase()).width + 26,
    w - 24
  );
  ctx.fillStyle = accentColor;
  drawRoundedRect(ctx, x + 16, y - 13, badgeW, 25, 12);
  ctx.fill();
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(speakerName.toUpperCase(), x + 29, y - 0.5);

  // 5. Render 100% of wrapped speech lines centered inside the bubble body
  ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const usableH = actualH - topBadgeReserve - bottomPad;
  const startY =
    y + topBadgeReserve + (usableH - totalBlockH) / 2 + lineHeight / 2;

  lines.forEach((line, idx) => {
    ctx.fillText(line, x + w / 2, startY + idx * lineHeight);
  });

  ctx.restore();
}

/**
 * Paints a complete Ultra-HD 2D Comic Panel (`1200 x 680`) onto the target canvas
 */
export function paintComicPanelOnCanvas(
  canvas: HTMLCanvasElement,
  panel: ComicPanelData,
  language: AppLanguage,
  logicalW = COMIC_CANVAS_WIDTH,
  logicalH = COMIC_CANVAS_HEIGHT
) {
  const dpr = 1.5; // High-density crisp output (1800 x 1020 internal pixels)
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(dpr, dpr);

  // 1. Unique Painterly 2D Historical Scene (`cap1_1` .. `cap6_4`)
  drawPainterlyScene(ctx, logicalW, logicalH, panel.sceneId);

  // Subtle lower vignette so foreground characters pop cinematically
  const vignette = ctx.createLinearGradient(0, logicalH * 0.55, 0, logicalH);
  vignette.addColorStop(0, 'rgba(9, 17, 30, 0)');
  vignette.addColorStop(1, 'rgba(9, 17, 30, 0.48)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, logicalH * 0.55, logicalW, logicalH * 0.45);

  // 2. Left & Right Expressive 2D Characters in Bust/Medium Shot
  drawExpressiveCharacter2D(
    ctx,
    225,
    logicalH - 6,
    panel.leftCharacter,
    true,
    1.12
  );
  drawExpressiveCharacter2D(
    ctx,
    logicalW - 225,
    logicalH - 6,
    panel.rightCharacter,
    false,
    1.12
  );

  // 3. Translucent Dark-Parchment Narrator Cartouche at Top (`rgba(15, 28, 48, 0.92)`)
  const narratorText =
    language === 'en' ? panel.narratorCaptionEn : panel.narratorCaptionEs;
  ctx.save();

  let narratorFontSize = 17.5;
  ctx.font = `800 ${narratorFontSize}px "JetBrains Mono", monospace`;
  while (
    narratorFontSize > 12.5 &&
    ctx.measureText(narratorText).width > logicalW - 148
  ) {
    narratorFontSize -= 0.5;
    ctx.font = `800 ${narratorFontSize}px "JetBrains Mono", monospace`;
  }
  const narratorLines = wrapTextLines(ctx, narratorText, logicalW - 148);
  const cartoucheH = Math.max(52, narratorLines.length * 22 + 24);

  drawRoundedRect(ctx, 22, 16, logicalW - 44, cartoucheH, 12);
  ctx.fillStyle = 'rgba(15, 28, 48, 0.92)';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.stroke();

  // Panel number gold medallion inside cartouche
  ctx.fillStyle = PATRIOTIC_CRIMSON;
  drawRoundedRect(ctx, 32, 16 + (cartoucheH - 36) / 2, 54, 36, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 17px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#0${panel.panelNumber}`, 59, 16 + cartoucheH / 2);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = `800 ${narratorFontSize}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  const narratorStartY =
    16 +
    (cartoucheH - narratorLines.length * (narratorFontSize * 1.25)) / 2 +
    (narratorFontSize * 1.25) / 2;
  narratorLines.forEach((nLine, idx) => {
    ctx.fillText(
      nLine,
      102,
      narratorStartY + idx * (narratorFontSize * 1.25)
    );
  });
  ctx.restore();

  // 4. Upper-Corner Auto-Fitted Speech Bubbles (leaving center scenery & faces clear)
  const leftName =
    language === 'en'
      ? panel.leftCharacter.nameEn
      : panel.leftCharacter.nameEs;
  const rightName =
    language === 'en'
      ? panel.rightCharacter.nameEn
      : panel.rightCharacter.nameEs;
  const leftSpeech =
    language === 'en' ? panel.leftSpeechEn : panel.leftSpeechEs;
  const rightSpeech =
    language === 'en' ? panel.rightSpeechEn : panel.rightSpeechEs;

  const bubbleTopY = 16 + cartoucheH + 20;

  drawEditorialSpeechBubble(
    ctx,
    28,
    bubbleTopY,
    515,
    154,
    220,
    320,
    leftName,
    leftSpeech,
    FEDERAL_BLUE
  );

  drawEditorialSpeechBubble(
    ctx,
    logicalW - 543,
    bubbleTopY + 6,
    515,
    154,
    logicalW - 220,
    320,
    rightName,
    rightSpeech,
    PATRIOTIC_CRIMSON
  );

  // 5. Outer Editorial Frame
  ctx.strokeStyle = COLORED_INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, logicalW - 6, logicalH - 6);
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.lineWidth = 2;
  ctx.strokeRect(9, 9, logicalW - 18, logicalH - 18);

  ctx.restore();
}

/**
 * Generates an Ultra-HD PNG DataURL for a single comic panel (`1200 x 680`)
 */
export function renderComicPanelToDataUrl(
  panel: ComicPanelData,
  language: AppLanguage
): string {
  const offscreen = document.createElement('canvas');
  paintComicPanelOnCanvas(
    offscreen,
    panel,
    language,
    COMIC_CANVAS_WIDTH,
    COMIC_CANVAS_HEIGHT
  );
  return offscreen.toDataURL('image/png', 1.0);
}

/**
 * Generates the Collector's Panoramic 2D Illustrated Cover Page PNG DataURL (`1200 x 680`)
 */
export function renderComicCoverToDataUrl(language: AppLanguage): string {
  const offscreen = document.createElement('canvas');
  const w = COMIC_CANVAS_WIDTH;
  const h = COMIC_CANVAS_HEIGHT;
  const dpr = 1.5;
  offscreen.width = w * dpr;
  offscreen.height = h * dpr;

  const ctx = offscreen.getContext('2d');
  if (!ctx) return '';

  ctx.save();
  ctx.scale(dpr, dpr);

  // 1. Epic Golden Sunrise Sky over Pennsylvania
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, '#09111E');
  sky.addColorStop(0.32, '#1E3A8A');
  sky.addColorStop(0.68, '#D97706');
  sky.addColorStop(1, '#FEF08A');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Rising Sun behind Independence Hall & Alleghenies
  const sunGlow = ctx.createRadialGradient(w * 0.5, 340, 20, w * 0.5, 340, 340);
  sunGlow.addColorStop(0, 'rgba(255, 255, 245, 0.98)');
  sunGlow.addColorStop(0.45, 'rgba(253, 224, 71, 0.55)');
  sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);

  // Allegheny Mountain Ridges
  drawMountainLayer(ctx, w, h, 385, 58, 0.004, 0.7, '#1E3A8A', '#0F172A');
  drawMountainLayer(ctx, w, h, 435, 38, 0.006, 1.9, '#065F46', '#064E3B');

  // Independence Hall Steeple in center horizon + Pittsburgh Golden Bridge arches
  ctx.save();
  ctx.translate(w * 0.5, 395);
  ctx.fillStyle = '#9A3412';
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.lineWidth = 2.5;
  ctx.fillRect(-110, -65, 220, 65);
  ctx.strokeRect(-110, -65, 220, 65);
  ctx.fillStyle = '#FFFDF5';
  ctx.fillRect(-28, -145, 56, 80);
  ctx.beginPath();
  ctx.moveTo(-32, -145);
  ctx.lineTo(0, -210);
  ctx.lineTo(32, -145);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawGodRays(ctx, w, h, w * 0.5, '254, 240, 138', 0.24);
  drawFloatingLightMotes(ctx, w, h, 'rgba(254, 240, 138, 0.75)', 32);

  // 2. Top Editorial Collector's Banner
  drawRoundedRect(ctx, 40, 24, w - 80, 152, 18);
  ctx.fillStyle = 'rgba(9, 17, 30, 0.93)';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.stroke();

  ctx.fillStyle = KEYSTONE_GOLD;
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'en'
      ? 'KEYSTONE CHRONOMAP · OFFICIAL ILLUSTRATED EDITION (1681–PRESENT)'
      : 'KEYSTONE CHRONOMAP · EDICIÓN ILUSTRADA OFICIAL (1681–PRESENTE)',
    w / 2,
    60
  );

  ctx.fillStyle = COMIC_PAPER;
  ctx.font = '900 32px "Playfair Display", Georgia, serif';
  ctx.fillText('THE ADVENTURES OF KEYSTONE CHRONOMAP:', w / 2, 106);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    language === 'en'
      ? 'PENNSYLVANIA HISTORY IN CARTOONS (ALL 67 COUNTIES)'
      : 'LA HISTORIA DE PENSILVANIA EN CARICATURAS (LOS 67 CONDADOS)',
    w / 2,
    146
  );

  // 3. Foreground Hero Lineup: William Penn, Ben Franklin, Keystone Kid, Abraham Lincoln
  const coverCast: {
    slot: ComicCharacterSlot;
    x: number;
    facingRight: boolean;
  }[] = [
    {
      slot: {
        id: 'william_penn',
        nameEn: 'William Penn',
        nameEs: 'William Penn',
        expression: 'wise',
      },
      x: 195,
      facingRight: true,
    },
    {
      slot: {
        id: 'ben_franklin',
        nameEn: 'Benjamin Franklin',
        nameEs: 'Benjamin Franklin',
        expression: 'excited',
      },
      x: 455,
      facingRight: true,
    },
    {
      slot: {
        id: 'keystone_kid',
        nameEn: 'Keystone Kid',
        nameEs: 'Keystone Kid',
        expression: 'heroic',
      },
      x: 745,
      facingRight: false,
    },
    {
      slot: {
        id: 'abe_lincoln',
        nameEn: 'Abraham Lincoln',
        nameEs: 'Abraham Lincoln',
        expression: 'happy',
      },
      x: 1005,
      facingRight: false,
    },
  ];

  coverCast.forEach((hero) => {
    drawExpressiveCharacter2D(
      ctx,
      hero.x,
      h - 8,
      hero.slot,
      hero.facingRight,
      1.15
    );
  });

  // Outer frame
  ctx.strokeStyle = ARCHIVE_CARD;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.strokeStyle = KEYSTONE_GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.restore();
  return offscreen.toDataURL('image/png', 1.0);
}

interface CartoonComicCanvasProps {
  panel: ComicPanelData;
  language: AppLanguage;
}

export const CartoonComicCanvas: React.FC<CartoonComicCanvasProps> = ({
  panel,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    paintComicPanelOnCanvas(
      canvasRef.current,
      panel,
      language,
      COMIC_CANVAS_WIDTH,
      COMIC_CANVAS_HEIGHT
    );
  }, [panel, language]);

  return (
    <div className="relative w-full aspect-[1200/680] bg-[#09111E] rounded-t-xl overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-label={
          language === 'en' ? panel.narratorCaptionEn : panel.narratorCaptionEs
        }
      />
    </div>
  );
};

export default CartoonComicCanvas;
