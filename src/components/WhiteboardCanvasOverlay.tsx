import React, { useRef, useEffect, useState, useCallback } from 'react';

export type WhiteboardTool = 'navigate' | 'pen' | 'arrow' | 'circle';
export type WhiteboardColor = '#D4AF37' | '#9B2226' | '#1D3557';

export interface WhiteboardStroke {
  tool: Exclude<WhiteboardTool, 'navigate'>;
  color: WhiteboardColor;
  lineWidth: number;
  points: { x: number; y: number }[];
}

interface WhiteboardCanvasOverlayProps {
  isActive: boolean;
  activeTool: WhiteboardTool;
  activeColor: WhiteboardColor;
  strokeWidth: number;
  clearTrigger: number;
  undoTrigger: number;
  onStrokeCountChange?: (count: number) => void;
}

function drawTacticalArrow(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  lineWidth: number
) {
  const headLength = Math.max(16, lineWidth * 4.2);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Subtle glow for dark map readability
  ctx.shadowColor = 'rgba(13, 15, 18, 0.85)';
  ctx.shadowBlur = 6;

  // Main shaft
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  // Tactical arrowhead
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headLength * Math.cos(angle - Math.PI / 6),
    to.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - headLength * 0.72 * Math.cos(angle),
    to.y - headLength * 0.72 * Math.sin(angle)
  );
  ctx.lineTo(
    to.x - headLength * Math.cos(angle + Math.PI / 6),
    to.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTacticalCircle(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  lineWidth: number
) {
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;
  const radiusX = Math.max(4, Math.abs(end.x - start.x) / 2);
  const radiusY = Math.max(4, Math.abs(end.y - start.y) / 2);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = 'rgba(13, 15, 18, 0.85)';
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Subtle translucent tactical fill
  ctx.fillStyle =
    color === '#D4AF37'
      ? 'rgba(212, 175, 55, 0.10)'
      : color === '#9B2226'
        ? 'rgba(155, 34, 38, 0.14)'
        : 'rgba(29, 53, 87, 0.16)';
  ctx.fill();
  ctx.restore();
}

function drawFreehandPen(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  color: string,
  lineWidth: number
) {
  if (points.length === 0) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(13, 15, 18, 0.85)';
  ctx.shadowBlur = 5;

  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

export const WhiteboardCanvasOverlay: React.FC<WhiteboardCanvasOverlayProps> = ({
  isActive,
  activeTool,
  activeColor,
  strokeWidth,
  clearTrigger,
  undoTrigger,
  onStrokeCountChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<WhiteboardStroke | null>(
    null
  );
  const isDrawingRef = useRef(false);

  // Notify parent of stroke count
  useEffect(() => {
    onStrokeCountChange?.(strokes.length);
  }, [strokes.length, onStrokeCountChange]);

  // Clear all strokes when clearTrigger increments
  useEffect(() => {
    if (clearTrigger === 0) return;
    setStrokes([]);
    setCurrentStroke(null);
  }, [clearTrigger]);

  // Undo last stroke when undoTrigger increments
  useEffect(() => {
    if (undoTrigger === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
  }, [undoTrigger]);

  const renderAllStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allToRender = currentStroke
      ? [...strokes, currentStroke]
      : strokes;

    for (const s of allToRender) {
      // Enhance visibility of Colonial Blue (#1D3557) and Crimson (#9B2226) on dark map
      const effectiveColor =
        s.color === '#1D3557'
          ? '#3A7CA5'
          : s.color === '#9B2226'
            ? '#E63946'
            : '#D4AF37';

      if (s.tool === 'pen') {
        drawFreehandPen(ctx, s.points, effectiveColor, s.lineWidth);
      } else if (s.tool === 'arrow' && s.points.length >= 2) {
        drawTacticalArrow(
          ctx,
          s.points[0],
          s.points[s.points.length - 1],
          effectiveColor,
          s.lineWidth
        );
      } else if (s.tool === 'circle' && s.points.length >= 2) {
        drawTacticalCircle(
          ctx,
          s.points[0],
          s.points[s.points.length - 1],
          effectiveColor,
          s.lineWidth
        );
      }
    }
  }, [strokes, currentStroke]);

  // Resize canvas to match viewport
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderAllStrokes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderAllStrokes]);

  useEffect(() => {
    renderAllStrokes();
  }, [renderAllStrokes]);

  if (!isActive) return null;

  const isDrawingMode = activeTool !== 'navigate';

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const pt = { x: e.clientX, y: e.clientY };
    setCurrentStroke({
      tool: activeTool,
      color: activeColor,
      lineWidth: strokeWidth,
      points: [pt, pt],
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !isDrawingMode) return;
    e.preventDefault();
    const pt = { x: e.clientX, y: e.clientY };

    setCurrentStroke((prev) => {
      if (!prev) return null;
      if (prev.tool === 'pen') {
        return {
          ...prev,
          points: [...prev.points, pt],
        };
      }
      return {
        ...prev,
        points: [prev.points[0], pt],
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;

    setCurrentStroke((prev) => {
      if (prev && prev.points.length > 0) {
        setStrokes((existing) => [...existing, prev]);
      }
      return null;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        touchAction: isDrawingMode ? 'none' : 'auto',
      }}
      className={`fixed inset-0 z-25 no-print ${
        isDrawingMode
          ? 'pointer-events-auto cursor-crosshair'
          : 'pointer-events-none'
      }`}
    />
  );
};

export default WhiteboardCanvasOverlay;
