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
  }, [map, zIndex]);

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
  const tripPolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    setPlaqueLang(language);
  }, [language]);

  const filteredMarkers = useMemo(() => {
    if (!visible) return [];
    if (selectedCategory === 'all') return PHMC_MARKERS_DATA;
    return PHMC_MARKERS_DATA.filter((m) => m.category === selectedCategory);
  }, [visible, selectedCategory]);

  // Pan and zoom smoothly when a PHMC marker is selected
  useEffect(() => {
    if (!map || !selectedMarker) return;
    map.panTo(selectedMarker.position);
    const currentZoom = map.getZoom() || 7;
    if (currentZoom < 9) {
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
          const inTripIdx = fieldTripStops.findIndex(
            (s) => s.id === marker.id
          );
          const isInTrip = inTripIdx !== -1;

          return (
            <PhmcHtmlOverlayPin
              key={marker.id}
              map={map}
              position={marker.position}
              zIndex={isSelected ? 85 : isInTrip ? 65 : 48}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2 group">
                {/* Official PHMC Blue & Gold Shield/Plaque Medallion Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMarker(marker);
                  }}
                  title={`Placa PHMC: ${marker.title} (${marker.cityOrTown}, ${marker.countyName})`}
                  className={`relative px-2 py-1 rounded-md bg-[#1D3557] text-[#D4AF37] border-2 shadow-2xl flex items-center gap-1 transition-transform cursor-pointer ${
                    isSelected
                      ? 'scale-125 border-[#F4F1EA] ring-2 ring-[#D4AF37]'
                      : 'border-[#D4AF37] group-hover:scale-115'
                  }`}
                >
                  {/* Keystone Crest Mini SVG */}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6 3H18L20 9L16.5 21H7.5L4 9L6 3Z" />
                  </svg>
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#F4F1EA]">
                    PHMC
                  </span>

                  {isInTrip && (
                    <span className="ml-0.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0D0F12] font-mono text-[9px] font-extrabold flex items-center justify-center">
                      {inTripIdx + 1}
                    </span>
                  )}
                </button>

                {/* Little Bottom Post of the Roadside Marker */}
                <div className="w-0.5 h-2 bg-[#D4AF37] mx-auto pointer-events-none" />

                {/* Hover Label Pill */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-md bg-[#1D3557]/95 border border-[#D4AF37] shadow-xl whitespace-nowrap pointer-events-none transition-opacity ${
                    isSelected
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="font-serif text-xs font-bold text-[#D4AF37]">
                    {marker.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#F4F1EA] tabular-nums">
                    {marker.cityOrTown}, {marker.countyName} County ({marker.eventYear})
                  </div>
                </div>
              </div>
            </PhmcHtmlOverlayPin>
          );
        })}

      {/* Authentic Pennsylvania Historical Marker Cast-Metal Plaque Modal Card */}
      {selectedMarker && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-45 w-[calc(100vw-1.5rem)] max-w-xl pointer-events-auto no-print">
          <div className="bg-[#1D3557] border-[3px] border-[#D4AF37] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            {/* Inner Cast-Metal Gold Frame */}
            <div className="border border-[#D4AF37]/65 rounded-xl p-4 sm:p-5 bg-gradient-to-b from-[#1D3557] via-[#172B47] to-[#122238] relative">
              {/* Top Crest Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#D4AF37]/35 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#0D0F12]/50 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                        {t.phmcModal.commissionHeader}
                      </span>
                      {selectedCategoryMeta && (
                        <span
                          className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase font-bold text-[#0D0F12]"
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
                    <h3 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#D4AF37] leading-snug">
                      {selectedMarker.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMarker(null)}
                  aria-label="Close PHMC Plaque"
                  className="p-1.5 rounded-lg bg-[#0D0F12]/50 border border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#F4F1EA] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Location, County Link & Language Switcher */}
              <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2 text-[#F4F1EA]/90 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const county = PA_COUNTIES_DATA[selectedMarker.countyName];
                      if (county) onSelectCounty(county);
                    }}
                    className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold hover:underline cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {selectedMarker.cityOrTown}, {selectedMarker.countyName} County
                    </span>
                  </button>
                  <span className="text-[#D4AF37]/50">·</span>
                  <span className="font-mono text-[11px] text-[#F4F1EA]/80 tabular-nums">
                    {t.phmcModal.eventYear} {selectedMarker.eventYear} ·{' '}
                    {t.phmcModal.dedicatedIn} {selectedMarker.dedicatedYear}
                  </span>
                </div>

                {/* EN / ES Plaque Inscription Toggle */}
                <div className="inline-flex rounded-md bg-[#0D0F12]/60 p-0.5 border border-[#D4AF37]/40">
                  <button
                    type="button"
                    onClick={() => setPlaqueLang('en')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      plaqueLang === 'en'
                        ? 'bg-[#D4AF37] text-[#0D0F12]'
                        : 'text-[#D4AF37]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaqueLang('es')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      plaqueLang === 'es'
                        ? 'bg-[#D4AF37] text-[#0D0F12]'
                        : 'text-[#D4AF37]'
                    }`}
                  >
                    ES
                  </button>
                </div>
              </div>

              {/* Cast-Metal Plaque Inscription Body */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#0D0F12]/40 border border-[#D4AF37]/35">
                <p className="font-serif text-sm sm:text-[15px] text-[#F4F1EA] leading-relaxed tracking-wide">
                  {plaqueLang === 'es'
                    ? selectedMarker.plaqueTextEs
                    : selectedMarker.plaqueTextEn}
                </p>
              </div>

              {/* Historical Significance Footer + Add to My Field Trip CTA */}
              <div className="mt-3 pt-3 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-[#F4F1EA]/80 leading-snug flex-1">
                  <strong className="text-[#D4AF37]">
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
                      ? 'bg-[#2D6A4F] text-[#F4F1EA] border-[#52B788] cursor-default'
                      : isTripFull
                        ? 'bg-[#0D0F12]/60 text-[#A39E93] border-[#C5A059]/30 cursor-not-allowed'
                        : 'bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] border-[#F4F1EA]'
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
