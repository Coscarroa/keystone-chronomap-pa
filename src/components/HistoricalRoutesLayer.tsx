import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@vis.gl/react-google-maps';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Compass,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import {
  HistoricalRouteItem,
  RouteWaypoint,
} from '../data/historicalRoutesData';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';

interface HistoricalRoutesLayerProps {
  activeRoute: HistoricalRouteItem | null;
  onCloseRoute: () => void;
  onSelectCounty: (county: CountyRecord) => void;
}

const WaypointOverlayPin: React.FC<{
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  index: number;
  isActive: boolean;
  isReached: boolean;
  waypoint: RouteWaypoint;
  onClick: () => void;
}> = ({ map, position, index, isActive, isReached, waypoint, onClick }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const [mounted, setMounted] = useState(false);
  const posRef = useRef(position);
  posRef.current = position;

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = isActive ? '75' : '50';
    containerRef.current = div;

    class WaypointOverlay extends google.maps.OverlayView {
      onAdd() {
        const panes = this.getPanes();
        if (panes?.overlayMouseTarget) {
          panes.overlayMouseTarget.appendChild(div);
          setMounted(true);
        }
      }
      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        const pt = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(posRef.current.lat, posRef.current.lng)
        );
        if (pt) {
          div.style.left = `${pt.x}px`;
          div.style.top = `${pt.y}px`;
        }
      }
      onRemove() {
        setMounted(false);
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      }
    }

    const instance = new WaypointOverlay();
    instance.setMap(map);
    overlayRef.current = instance;

    return () => {
      instance.setMap(null);
      overlayRef.current = null;
    };
  }, [map, isActive]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.draw();
    }
  }, [position.lat, position.lng]);

  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div className="relative -translate-x-1/2 -translate-y-1/2 group">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shadow-xl transition-transform cursor-pointer border-2 ${
          isActive
            ? 'scale-125 bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA]'
            : isReached
              ? 'bg-[#161920] text-[#D4AF37] border-[#D4AF37]'
              : 'bg-[#0D0F12]/90 text-[#A39E93] border-[#C5A059]/40'
        }`}
      >
        {index + 1}
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-md bg-[#161920]/95 border border-[#D4AF37]/60 shadow-xl whitespace-nowrap pointer-events-none transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <div className="font-serif text-xs font-bold text-[#F4F1EA]">
          {index + 1}. {waypoint.name}
        </div>
        <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums">
          {waypoint.dateOrStep}
        </div>
      </div>
    </div>,
    containerRef.current
  );
};

export const HistoricalRoutesLayer: React.FC<HistoricalRoutesLayerProps> = ({
  activeRoute,
  onCloseRoute,
  onSelectCounty,
}) => {
  const map = useMap();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [selectedWaypointIdx, setSelectedWaypointIdx] = useState<number>(0);

  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const bgPolylineRef = useRef<google.maps.Polyline | null>(null);

  // Fit bounds and initialize polyline when activeRoute changes
  useEffect(() => {
    if (!map || !activeRoute || typeof google === 'undefined') return;

    setProgress(0);
    setSelectedWaypointIdx(0);
    setIsPlaying(true);

    const path = activeRoute.waypoints.map((w) => w.position);

    // Fit camera bounds around all route waypoints
    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, {
      top: 120,
      bottom: 240,
      left: 80,
      right: 80,
    });

    // Subtle background dashed path
    const bgLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#C5A059',
      strokeOpacity: 0.35,
      strokeWeight: 3,
      zIndex: 35,
      map,
    });
    bgPolylineRef.current = bgLine;

    // Animated foreground polyline with golden FORWARD_CLOSED_ARROW symbols
    const fgLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: activeRoute.strokeColor || '#D4AF37',
      strokeOpacity: 0.92,
      strokeWeight: 4.5,
      zIndex: 38,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4.2,
            strokeColor: '#D4AF37',
            strokeWeight: 1.5,
            fillColor: '#D4AF37',
            fillOpacity: 1,
          },
          offset: '0%',
        },
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2.8,
            strokeColor: '#F4F1EA',
            fillColor: '#D4AF37',
            fillOpacity: 0.75,
          },
          offset: '0%',
          repeat: '90px',
        },
      ],
      map,
    });
    polylineRef.current = fgLine;

    return () => {
      bgLine.setMap(null);
      fgLine.setMap(null);
      bgPolylineRef.current = null;
      polylineRef.current = null;
    };
  }, [map, activeRoute]);

  // Animate arrow offset along the polyline
  useEffect(() => {
    if (!activeRoute || !isPlaying) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev >= 100 ? 0 : prev + 0.8;
        return Number(next.toFixed(1));
      });
    }, 35);

    return () => window.clearInterval(timer);
  }, [activeRoute, isPlaying]);

  // Sync progress state to polyline icon offset and active waypoint index
  useEffect(() => {
    if (!polylineRef.current || !activeRoute) return;

    const icons = polylineRef.current.get('icons');
    if (icons && icons.length > 0) {
      icons[0].offset = `${progress}%`;
      if (icons[1]) {
        icons[1].offset = `${(progress % 25) * 4}%`;
      }
      polylineRef.current.set('icons', icons);
    }

    const totalStops = activeRoute.waypoints.length;
    if (totalStops > 1) {
      const approxIdx = Math.min(
        totalStops - 1,
        Math.floor((progress / 100) * totalStops)
      );
      setSelectedWaypointIdx(approxIdx);
    }
  }, [progress, activeRoute]);

  if (!map || !activeRoute) return null;

  const currentWaypoint =
    activeRoute.waypoints[selectedWaypointIdx] || activeRoute.waypoints[0];

  const handleRestart = () => {
    setProgress(0);
    setSelectedWaypointIdx(0);
    setIsPlaying(true);
  };

  const handleJumpToWaypoint = (idx: number) => {
    setIsPlaying(false);
    setSelectedWaypointIdx(idx);
    const total = Math.max(1, activeRoute.waypoints.length - 1);
    setProgress(Math.round((idx / total) * 100));
    const wp = activeRoute.waypoints[idx];
    if (wp && map) {
      map.panTo(wp.position);
    }
  };

  return (
    <>
      {/* Waypoint Pins along the route */}
      {activeRoute.waypoints.map((wp, idx) => {
        const total = Math.max(1, activeRoute.waypoints.length - 1);
        const wpThreshold = (idx / total) * 100;
        const isReached = progress >= wpThreshold;
        const isActive = idx === selectedWaypointIdx;

        return (
          <WaypointOverlayPin
            key={`${activeRoute.id}-wp-${idx}`}
            map={map}
            position={wp.position}
            index={idx}
            isActive={isActive}
            isReached={isReached}
            waypoint={wp}
            onClick={() => handleJumpToWaypoint(idx)}
          />
        );
      })}

      {/* Floating Route Player Controller */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-1.5rem)] max-w-2xl pointer-events-auto">
        <div className="bg-[#161920]/95 backdrop-blur-2xl border border-[#D4AF37]/60 rounded-xl p-4 shadow-2xl">
          {/* Top Bar: Title + Controls (Play/Pause, Restart, Close) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>RUTA HISTÓRICA ANIMADA · {activeRoute.eraLabel}</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#F4F1EA] truncate">
                {activeRoute.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0D0F12] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#e3be42] transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausa</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                title="Reiniciar animación de ruta"
                className="px-2.5 py-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/35 text-xs text-[#F4F1EA] hover:border-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>

              <button
                type="button"
                onClick={onCloseRoute}
                title="Cerrar ruta histórica"
                aria-label="Cerrar ruta histórica"
                className="p-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/35 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Timeline Scrubber for Route Progress */}
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(progress)}
              onChange={(e) => {
                setIsPlaying(false);
                setProgress(Number(e.target.value));
              }}
              aria-label="Progreso de la ruta histórica"
              className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#0D0F12] rounded-lg"
            />
            <span className="font-mono text-xs text-[#D4AF37] tabular-nums w-11 text-right shrink-0">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Clickable Waypoint Stops */}
          <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {activeRoute.waypoints.map((wp, idx) => {
              const isCurrent = idx === selectedWaypointIdx;
              return (
                <React.Fragment key={wp.name}>
                  <button
                    type="button"
                    onClick={() => handleJumpToWaypoint(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#1D3557] text-[#F4F1EA] border-[#D4AF37] font-semibold'
                        : 'bg-[#0D0F12]/70 text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#D4AF37] tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{wp.name.split(' (')[0]}</span>
                  </button>
                  {idx < activeRoute.waypoints.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]/40 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Waypoint Narrative Box */}
          {currentWaypoint && (
            <div className="mt-2.5 pt-2.5 border-t border-[#C5A059]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="font-serif font-semibold text-[#D4AF37] flex items-center gap-2">
                  <span>
                    Estación 0{selectedWaypointIdx + 1}: {currentWaypoint.name}
                  </span>
                  <span className="font-mono text-[11px] text-[#A39E93] font-normal">
                    ({currentWaypoint.dateOrStep})
                  </span>
                </div>
                <p className="text-[#F4F1EA]/90 leading-relaxed">
                  {currentWaypoint.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const county = PA_COUNTIES_DATA[currentWaypoint.countyName];
                  if (county) onSelectCounty(county);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#D4AF37] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
              >
                <MapPin className="w-3 h-3" />
                <span>{currentWaypoint.countyName} County</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoricalRoutesLayer;
