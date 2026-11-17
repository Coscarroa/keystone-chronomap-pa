import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@vis.gl/react-google-maps';
import {
  X,
  Plus,
  Check,
  MapPin,
  Award,
} from 'lucide-react';
import {
  PHMC_CATEGORIES,
  PHMC_MARKERS_DATA,
  PhmcCategory,
  PhmcMarkerRecord,
} from '../data/phmcMarkersData';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import {
  FieldTripStop,
  MAX_FIELD_TRIP_STOPS,
} from './FieldTripBuilder';
import { useTranslation } from '../context/LanguageContext';
import { PHMC_CATEGORY_TRANSLATIONS_EN } from '../i18n/translations';

interface PhmcMarkersLayerProps {
  visible: boolean;
  selectedCategory: PhmcCategory | 'all';
  selectedMarker: PhmcMarkerRecord | null;
  onSelectMarker: (marker: PhmcMarkerRecord | null) => void;
  onSelectCounty: (county: CountyRecord) => void;
  fieldTripStops: FieldTripStop[];
  onAddFieldTripStop: (stop: FieldTripStop) => void;
}

const PhmcHtmlOverlayPin: React.FC<{
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  zIndex?: number;
  children: React.ReactNode;
}> = ({ map, position, zIndex = 48, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const [mounted, setMounted] = useState(false);
  const posRef = useRef(position);
  posRef.current = position;

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = String(zIndex);
    containerRef.current = div;

    class PhmcOverlay extends google.maps.OverlayView {
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

    const instance = new PhmcOverlay();
    instance.setMap(map);
    overlayRef.current = instance;

    return () => {
      instance.setMap(null);
      overlayRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.zIndex = String(zIndex);
    }
  }, [zIndex]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.draw();
    }
  }, [position.lat, position.lng]);

  if (!mounted || !containerRef.current) return null;
  return createPortal(children, containerRef.current);
};

export const PhmcMarkersLayer: React.FC<PhmcMarkersLayerProps> = ({
  visible,
  selectedCategory,
  selectedMarker,
  onSelectMarker,
  onSelectCounty,
  fieldTripStops,
  onAddFieldTripStop,
}) => {
  const map = useMap();
  const { language, t } = useTranslation();
  const [plaqueLang, setPlaqueLang] = useState<'es' | 'en'>(language);
  const [currentZoom, setCurrentZoom] = useState<number>(7);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const tripPolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    setPlaqueLang(language);
  }, [language]);

  // Listen to map zoom changes for dynamic compact shield vs. full plaque rendering
  useEffect(() => {
    if (!map) return;

    const initialZoom = map.getZoom();
    if (typeof initialZoom === 'number') {
      setCurrentZoom(initialZoom);
    }

    const zoomListener = map.addListener('zoom_changed', () => {
      const z = map.getZoom();
      if (typeof z === 'number') {
        setCurrentZoom(z);
      }
    });

    return () => {
      zoomListener.remove();
    };
  }, [map]);

  const filteredMarkers = useMemo(() => {
    if (!visible) return [];
    if (selectedCategory === 'all') return PHMC_MARKERS_DATA;
    return PHMC_MARKERS_DATA.filter((m) => m.category === selectedCategory);
  }, [visible, selectedCategory]);

  /**
   * Subtle radial offset for plaques sharing close coordinates in the same county/city
   * so markers never overlap completely at statewide or regional zoom levels.
   */
  const adjustedPositionsMap = useMemo(() => {
    const result: Record<string, google.maps.LatLngLiteral> = {};
    const PROXIMITY_THRESHOLD = 0.035; // ~2.4 miles
    const radiusScale =
      currentZoom <= 7
        ? 0.022
        : currentZoom === 8
          ? 0.012
          : currentZoom === 9
            ? 0.005
            : 0.0015;

    // Group nearby markers
    const visited = new Set<string>();
    for (let i = 0; i < filteredMarkers.length; i++) {
      const m1 = filteredMarkers[i];
      if (visited.has(m1.id)) continue;

      const cluster: PhmcMarkerRecord[] = [m1];
      visited.add(m1.id);

      for (let j = i + 1; j < filteredMarkers.length; j++) {
        const m2 = filteredMarkers[j];
        if (visited.has(m2.id)) continue;
        const dLat = Math.abs(m1.position.lat - m2.position.lat);
        const dLng = Math.abs(m1.position.lng - m2.position.lng);
        if (dLat < PROXIMITY_THRESHOLD && dLng < PROXIMITY_THRESHOLD) {
          cluster.push(m2);
          visited.add(m2.id);
        }
      }

      if (cluster.length === 1) {
        result[m1.id] = m1.position;
      } else {
        cluster.forEach((member, idx) => {
          const angle = (idx / cluster.length) * Math.PI * 2;
          result[member.id] = {
            lat: member.position.lat + Math.sin(angle) * radiusScale,
            lng: member.position.lng + Math.cos(angle) * radiusScale * 1.25,
          };
        });
      }
    }

    return result;
  }, [filteredMarkers, currentZoom]);

  // Pan and zoom smoothly when a PHMC marker is selected
  useEffect(() => {
    if (!map || !selectedMarker) return;
    map.panTo(selectedMarker.position);
    const z = map.getZoom() || 7;
    if (z < 9) {
      map.setZoom(9.5);
    }
  }, [map, selectedMarker]);

  // Draw dashed Field Trip itinerary connector polyline when 2+ stops exist
  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (tripPolylineRef.current) {
      tripPolylineRef.current.setMap(null);
      tripPolylineRef.current = null;
    }

    if (fieldTripStops.length < 2) return;

    const path = fieldTripStops.map((s) => s.position);
    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeColor: '#D4AF37',
      scale: 3,
    };

    const tripLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '14px',
        },
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3.2,
            strokeColor: '#1D3557',
            strokeWeight: 1,
            fillColor: '#D4AF37',
            fillOpacity: 1,
          },
          offset: '50%',
          repeat: '110px',
        },
      ],
      zIndex: 36,
      map,
    });

    tripPolylineRef.current = tripLine;

    return () => {
      tripLine.setMap(null);
      tripPolylineRef.current = null;
    };
  }, [map, fieldTripStops]);

  if (!map) return null;

  const isCompactZoom = currentZoom <= 8;

  const isSelectedInTrip = selectedMarker
    ? fieldTripStops.some((s) => s.id === selectedMarker.id)
    : false;
  const isTripFull = fieldTripStops.length >= MAX_FIELD_TRIP_STOPS;

  const selectedCategoryMeta = selectedMarker
    ? PHMC_CATEGORIES.find((c) => c.id === selectedMarker.category)
    : null;

  return (
    <>
      {visible &&
        filteredMarkers.map((marker) => {
          const isSelected = selectedMarker?.id === marker.id;
          const isHovered = hoveredMarkerId === marker.id;
          const inTripIdx = fieldTripStops.findIndex(
            (s) => s.id === marker.id
          );
          const isInTrip = inTripIdx !== -1;
          const displayPosition =
            adjustedPositionsMap[marker.id] || marker.position;

          const pinZIndex = isSelected
            ? 999
            : isHovered
              ? 950
              : isInTrip
                ? 75
                : 48;

          return (
            <PhmcHtmlOverlayPin
              key={marker.id}
              map={map}
              position={displayPosition}
              zIndex={pinZIndex}
            >
              <div
                onMouseEnter={() => setHoveredMarkerId(marker.id)}
                onMouseLeave={() =>
                  setHoveredMarkerId((prev) =>
                    prev === marker.id ? null : prev
                  )
                }
                className="relative -translate-x-1/2 -translate-y-1/2 group"
              >
                {isCompactZoom && !isSelected ? (
                  /* STATEWIDE COMPACT MODE (zoom <= 8): 16x16px Royal Blue & Gold Shield Pin */
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMarker(marker);
                    }}
                    aria-label={`PHMC Plaque: ${marker.title}`}
                    className={`w-4 h-4 rounded-full bg-[#1E40AF] border-2 border-[#FBBF24] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:scale-135 hover:bg-[#1D4ED8] ${
                      isInTrip ? 'ring-2 ring-[#FDE68A] scale-115' : ''
                    }`}
                  >
                    {isInTrip ? (
                      <span className="font-mono text-[8px] font-extrabold text-[#FDE68A] leading-none">
                        {inTripIdx + 1}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDE68A]" />
                    )}
                  </button>
                ) : (
                  /* REGIONAL/CITY EXPANDED MODE (zoom >= 9 or selected): Full High-Contrast Blue & Gold Plaque */
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMarker(marker);
                      }}
                      aria-label={`PHMC Plaque: ${marker.title}`}
                      className={`relative px-2 py-1 rounded-md bg-[#0F294A] text-[#FDE68A] border-2 border-[#FBBF24] shadow-[0_6px_18px_rgba(0,0,0,0.88)] flex items-center gap-1 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'scale-125 ring-2 ring-[#FDE68A] bg-[#1E3A8A]'
                          : 'hover:scale-110 hover:bg-[#1E3A8A]'
                      }`}
                    >
                      {/* Keystone Crest Mini SVG */}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="#FBBF24"
                        aria-hidden="true"
                      >
                        <path d="M6 3H18L20 9L16.5 21H7.5L4 9L6 3Z" />
                      </svg>
                      <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#FDE68A]">
                        PHMC
                      </span>

                      {isInTrip && (
                        <span className="ml-0.5 w-4 h-4 rounded-full bg-[#FBBF24] text-[#09111E] font-mono text-[9px] font-extrabold flex items-center justify-center">
                          {inTripIdx + 1}
                        </span>
                      )}
                    </button>

                    {/* Roadside Marker Post */}
                    <div className="w-0.5 h-2 bg-[#FBBF24] mx-auto pointer-events-none" />
                  </>
                )}

                {/* Clean High-Contrast Hover Tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 rounded-lg bg-[#0F294A]/98 border border-[#FBBF24] shadow-[0_10px_28px_rgba(0,0,0,0.9)] whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
                    isSelected || isHovered
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="font-serif text-xs font-bold text-[#FDE68A]">
                    {marker.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#F8FAFC]/90 tabular-nums">
                    {marker.cityOrTown}, {marker.countyName} County ({marker.eventYear})
                  </div>
                </div>
              </div>
            </PhmcHtmlOverlayPin>
          );
        })}

      {/* Authentic Pennsylvania Historical Marker Cast-Metal Plaque Modal Card */}
      {selectedMarker && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-45 w-[calc(100vw-1.5rem)] max-w-xl pointer-events-auto no-print">
          <div className="bg-[#0F294A] border-[3px] border-[#FBBF24] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.88)]">
            {/* Inner Cast-Metal Gold Frame */}
            <div className="border border-[#FBBF24]/65 rounded-xl p-4 sm:p-5 bg-gradient-to-b from-[#0F294A] via-[#132F54] to-[#0B1F3A] relative">
              {/* Top Crest Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#FBBF24]/35 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#09111E]/70 border border-[#FBBF24] flex items-center justify-center text-[#FBBF24] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FDE68A] font-bold">
                        {t.phmcModal.commissionHeader}
                      </span>
                      {selectedCategoryMeta && (
                        <span
                          className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase font-bold text-[#09111E]"
                          style={{
                            backgroundColor: selectedCategoryMeta.badgeColor,
                          }}
                        >
                          {language === 'en'
                            ? PHMC_CATEGORY_TRANSLATIONS_EN[
                                selectedMarker.category
                              ].shortLabel
                            : selectedCategoryMeta.shortLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#FDE68A] leading-snug">
                      {selectedMarker.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMarker(null)}
                  aria-label="Close PHMC Plaque"
                  className="p-1.5 rounded-lg bg-[#09111E]/60 border border-[#FBBF24]/50 text-[#FDE68A] hover:text-[#F8FAFC] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Location, County Link & Language Switcher */}
              <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2 text-[#F8FAFC]/90 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const county = PA_COUNTIES_DATA[selectedMarker.countyName];
                      if (county) onSelectCounty(county);
                    }}
                    className="inline-flex items-center gap-1 text-[#FDE68A] font-semibold hover:underline cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {selectedMarker.cityOrTown}, {selectedMarker.countyName} County
                    </span>
                  </button>
                  <span className="text-[#FBBF24]/50">·</span>
                  <span className="font-mono text-[11px] text-[#F8FAFC]/85 tabular-nums">
                    {t.phmcModal.eventYear} {selectedMarker.eventYear} ·{' '}
                    {t.phmcModal.dedicatedIn} {selectedMarker.dedicatedYear}
                  </span>
                </div>

                {/* EN / ES Plaque Inscription Toggle */}
                <div className="inline-flex rounded-md bg-[#09111E]/70 p-0.5 border border-[#FBBF24]/45">
                  <button
                    type="button"
                    onClick={() => setPlaqueLang('en')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      plaqueLang === 'en'
                        ? 'bg-[#FBBF24] text-[#09111E]'
                        : 'text-[#FDE68A]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaqueLang('es')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      plaqueLang === 'es'
                        ? 'bg-[#FBBF24] text-[#09111E]'
                        : 'text-[#FDE68A]'
                    }`}
                  >
                    ES
                  </button>
                </div>
              </div>

              {/* Cast-Metal Plaque Inscription Body */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#09111E]/50 border border-[#FBBF24]/35">
                <p className="font-serif text-sm sm:text-[15px] text-[#F8FAFC] leading-relaxed tracking-wide">
                  {plaqueLang === 'es'
                    ? selectedMarker.plaqueTextEs
                    : selectedMarker.plaqueTextEn}
                </p>
              </div>

              {/* Historical Significance Footer + Add to My Field Trip CTA */}
              <div className="mt-3 pt-3 border-t border-[#FBBF24]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-[#F8FAFC]/85 leading-snug flex-1">
                  <strong className="text-[#FDE68A]">
                    {t.phmcModal.historicalContextLabel}
                  </strong>{' '}
                  {selectedMarker.historicalSignificance}
                </p>

                <button
                  type="button"
                  disabled={isSelectedInTrip || isTripFull}
                  onClick={() => {
                    onAddFieldTripStop({
                      id: selectedMarker.id,
                      title: selectedMarker.title,
                      subtitle: `PHMC · ${selectedMarker.cityOrTown} (${selectedMarker.eventYear})`,
                      countyName: selectedMarker.countyName,
                      sourceType: 'phmc',
                      position: selectedMarker.position,
                      description:
                        language === 'en'
                          ? selectedMarker.plaqueTextEn
                          : selectedMarker.plaqueTextEs,
                    });
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-lg border ${
                    isSelectedInTrip
                      ? 'bg-[#2D6A4F] text-[#F8FAFC] border-[#52B788] cursor-default'
                      : isTripFull
                        ? 'bg-[#09111E]/60 text-[#94A3B8] border-[#FBBF24]/30 cursor-not-allowed'
                        : 'bg-[#FBBF24] hover:bg-[#FDE68A] text-[#09111E] border-[#F8FAFC]'
                  }`}
                >
                  {isSelectedInTrip ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.infoPanel.inFieldTripBadge}</span>
                    </>
                  ) : isTripFull ? (
                    <span>{t.phmcModal.tripFullBtn}</span>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.phmcModal.addToTripBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhmcMarkersLayer;
