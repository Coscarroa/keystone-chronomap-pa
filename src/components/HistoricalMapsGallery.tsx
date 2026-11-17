import React, { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Eye,
  ExternalLink,
} from 'lucide-react';
import {
  VINTAGE_MAPS_DATA,
  VintageMapRecord,
} from '../data/vintageMapsData';

interface HistoricalMapsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  activeOverlayMap: VintageMapRecord | null;
  onActivateOverlay: (mapRecord: VintageMapRecord) => void;
}

/**
 * Component rendered inside <GoogleMap> to manage google.maps.GroundOverlay
 * and a floating 0%–100% opacity slider.
 */
export const VintageGroundOverlayController: React.FC<{
  activeMap: VintageMapRecord | null;
  opacity: number;
  onChangeOpacity: (val: number) => void;
  onRemoveOverlay: () => void;
  onOpenGallery: () => void;
}> = ({
  activeMap,
  opacity,
  onChangeOpacity,
  onRemoveOverlay,
  onOpenGallery,
}) => {
  const map = useMap();
  const overlayRef = useRef<google.maps.GroundOverlay | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

    if (!activeMap) return;

    const groundOverlay = new google.maps.GroundOverlay(
      activeMap.imageUrl,
      activeMap.bounds,
      {
        opacity: opacity / 100,
        clickable: false,
      }
    );

    groundOverlay.setMap(map);
    overlayRef.current = groundOverlay;

    // Frame camera on the historical map's bounding box
    map.fitBounds(activeMap.bounds, {
      top: 110,
      bottom: 210,
      left: 70,
      right: 70,
    });

    return () => {
      groundOverlay.setMap(null);
      overlayRef.current = null;
    };
  }, [map, activeMap]);

  // Update opacity in real time without recreating GroundOverlay
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(opacity / 100);
    }
  }, [opacity]);

  if (!activeMap) return null;

  return (
    <div className="fixed top-28 sm:top-24 left-1/2 -translate-x-1/2 z-30 w-[calc(100vw-1.5rem)] max-w-md pointer-events-auto">
      <div className="bg-[#161920]/95 backdrop-blur-2xl border border-[#D4AF37]/60 rounded-xl px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              <span>SUPERPOSICIÓN CARTOGRÁFICA (GroundOverlay)</span>
            </div>
            <div className="font-serif text-sm font-bold text-[#F4F1EA] truncate">
              {activeMap.shortTitle}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenGallery}
              className="px-2 py-1 rounded-md bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[11px] text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={onRemoveOverlay}
              title="Quitar superposición del mapa"
              aria-label="Quitar superposición"
              className="p-1 rounded-md bg-[#9B2226]/80 hover:bg-[#9B2226] text-[#F4F1EA] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opacity Slider 0% - 100% */}
        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-[11px] text-[#A39E93] flex items-center gap-1 shrink-0">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Opacidad:</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={opacity}
            onChange={(e) => onChangeOpacity(Number(e.target.value))}
            aria-label="Opacidad del mapa histórico superpuesto"
            className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#0D0F12] rounded-lg"
          />
          <span className="font-mono text-xs text-[#D4AF37] tabular-nums w-11 text-right shrink-0">
            {opacity}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const HistoricalMapsGallery: React.FC<HistoricalMapsGalleryProps> = ({
  isOpen,
  onClose,
  activeOverlayMap,
  onActivateOverlay,
}) => {
  const [selectedMap, setSelectedMap] = useState<VintageMapRecord>(
    VINTAGE_MAPS_DATA[0]
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [useFallbackImg, setUseFallbackImg] = useState<boolean>(false);
  const [imgFailedCompletely, setImgFailedCompletely] =
    useState<boolean>(false);

  useEffect(() => {
    if (activeOverlayMap) {
      setSelectedMap(activeOverlayMap);
    }
  }, [activeOverlayMap]);

  useEffect(() => {
    setZoomLevel(1);
    setUseFallbackImg(false);
    setImgFailedCompletely(false);
  }, [selectedMap]);

  if (!isOpen) return null;

  const currentImgSrc = useFallbackImg
    ? selectedMap.fallbackUrl
    : selectedMap.imageUrl;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de Mapas Antiguos de Pensilvania"
    >
      <div className="w-full max-w-6xl max-h-[90vh] bg-[#161920]/95 border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12]/60 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold">
              COLECCIÓN CARTOGRÁFICA DE DOMINIO PÚBLICO · WIKIMEDIA COMMONS / LOC
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
              Galería de Mapas Antiguos de Pensilvania (1687–1863)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería de mapas antiguos"
            className="p-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector Bar for the 3 Historical Maps */}
        <div className="px-6 py-3 border-b border-[#C5A059]/20 bg-[#161920] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {VINTAGE_MAPS_DATA.map((item) => {
            const isSelected = selectedMap.id === item.id;
            const isCurrentlyOverlaid = activeOverlayMap?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedMap(item)}
                className={`px-3.5 py-2 rounded-xl text-left transition-all flex items-center gap-3 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1D3557]/80 border-[#D4AF37] text-[#F4F1EA] shadow-md'
                    : 'bg-[#0D0F12]/60 border-[#C5A059]/20 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <div>
                  <div className="font-serif text-sm font-bold flex items-center gap-2">
                    <span>{item.shortTitle}</span>
                    {isCurrentlyOverlaid && (
                      <span className="text-[10px] font-mono uppercase text-[#D4AF37]">
                        [Activo en Mapa]
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A39E93]">
                    {item.cartographer.split(' (')[0]} ·{' '}
                    <span className="font-mono text-[#D4AF37] tabular-nums">
                      {item.year}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Split: Zoomable Map Plate Viewer + Curatorial Dossier */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
          {/* Left 8 cols: High-Resolution Zoomable Plate */}
          <div className="lg:col-span-8 relative bg-[#090B0E] flex items-center justify-center overflow-auto p-4 min-h-[300px]">
            {/* Zoom Controls */}
            <div className="sticky top-3 left-3 z-20 self-start bg-[#161920]/90 border border-[#C5A059]/40 rounded-xl p-1 flex items-center gap-1 shadow-xl">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.35).toFixed(2)))}
                title="Ampliar lámina cartográfica"
                className="p-1.5 rounded-lg hover:bg-[#1D3557]/60 text-[#F4F1EA] hover:text-[#D4AF37] cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-[#D4AF37] px-2 tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.35).toFixed(2)))}
                title="Reducir lámina cartográfica"
                className="p-1.5 rounded-lg hover:bg-[#1D3557]/60 text-[#F4F1EA] hover:text-[#D4AF37] cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                title="Restablecer zoom"
                className="p-1.5 rounded-lg hover:bg-[#1D3557]/60 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {!imgFailedCompletely ? (
              <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
                <img
                  src={currentImgSrc}
                  alt={selectedMap.title}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (!useFallbackImg) {
                      setUseFallbackImg(true);
                    } else {
                      setImgFailedCompletely(true);
                    }
                  }}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                  className="max-h-[58vh] w-auto object-contain rounded-lg border border-[#C5A059]/40 shadow-2xl transition-transform duration-200"
                />
              </div>
            ) : (
              /* Resilient Archival SVG Fallback Container */
              <div className="w-full max-w-lg p-8 rounded-xl bg-gradient-to-br from-[#161920] to-[#0D0F12] border border-[#D4AF37]/40 text-center space-y-3">
                <Layers className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <div className="font-serif text-lg font-bold text-[#F4F1EA]">
                  {selectedMap.title} ({selectedMap.year})
                </div>
                <p className="text-xs text-[#A39E93]">
                  {selectedMap.cartographer} · {selectedMap.repository}
                </p>
              </div>
            )}
          </div>

          {/* Right 4 cols: Curatorial Metadata & GroundOverlay Action */}
          <div className="lg:col-span-4 p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#C5A059]/25 flex flex-col justify-between gap-5 bg-[#161920]">
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                  FICHA CARTOGRÁFICA · AÑO {selectedMap.year}
                </div>
                <h3 className="mt-1 font-serif text-lg font-bold text-[#F4F1EA] leading-snug">
                  {selectedMap.title}
                </h3>
                <p className="mt-1 text-xs text-[#A39E93]">
                  Autor: <span className="text-[#F4F1EA]">{selectedMap.cartographer}</span>
                </p>
              </div>

              <div className="border-t border-[#C5A059]/20 pt-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] mb-1">
                  Descripción Histórica
                </div>
                <p className="text-xs text-[#F4F1EA]/90 leading-relaxed">
                  {selectedMap.description}
                </p>
              </div>

              <div className="bg-[#0D0F12]/70 border border-[#C5A059]/20 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
                  Cobertura Georreferenciada (LatLngBounds)
                </div>
                <div className="text-[#F4F1EA] font-medium">
                  {selectedMap.regionLabel}
                </div>
                <div className="font-mono text-[11px] text-[#A39E93] tabular-nums">
                  N: {selectedMap.bounds.north}° · S: {selectedMap.bounds.south}°
                  <br />
                  E: {selectedMap.bounds.east}° · W: {selectedMap.bounds.west}°
                </div>
                <p className="text-[11px] text-[#A39E93] pt-1 border-t border-[#C5A059]/15">
                  {selectedMap.cartographicNotes}
                </p>
              </div>
            </div>

            {/* Primary CTA: Superimpose on Google Maps via GroundOverlay */}
            <div className="space-y-2.5 pt-2 border-t border-[#C5A059]/20">
              <button
                type="button"
                onClick={() => {
                  onActivateOverlay(selectedMap);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e2bc3f] text-[#0D0F12] font-semibold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>📍 Superponer sobre el Mapa Actual</span>
              </button>

              <a
                href={`https://commons.wikimedia.org/wiki/${encodeURIComponent(
                  selectedMap.commonsFileTitle
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-[#0D0F12]/70 border border-[#C5A059]/25 text-xs text-[#A39E93] hover:text-[#F4F1EA] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ver archivo original en Wikimedia Commons</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalMapsGallery;
