import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@vis.gl/react-google-maps';
import { X, Scroll, Swords, MapPin, Calendar, Users, Plus, Check } from 'lucide-react';
import {
  HistoricalEventItem,
  HISTORICAL_EVENTS_DATA,
} from '../data/historicalEventsData';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import { FieldTripStop, MAX_FIELD_TRIP_STOPS } from './FieldTripBuilder';

interface HistoricalMarkersLayerProps {
  visible: boolean;
  activeEraId: string;
  selectedEvent: HistoricalEventItem | null;
  onSelectEvent: (event: HistoricalEventItem | null) => void;
  onSelectCounty: (county: CountyRecord) => void;
  fieldTripStops?: FieldTripStop[];
  onAddFieldTripStop?: (stop: FieldTripStop) => void;
}

/**
 * Custom HTML OverlayView pin anchored to LatLng coordinates
 */
const CustomMapHtmlOverlay: React.FC<{
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  zIndex?: number;
  children: React.ReactNode;
}> = ({ map, position, zIndex = 40, children }) => {
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

    class CustomOverlay extends google.maps.OverlayView {
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
        const point = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(posRef.current.lat, posRef.current.lng)
        );
        if (point) {
          div.style.left = `${point.x}px`;
          div.style.top = `${point.y}px`;
        }
      }
      onRemove() {
        setMounted(false);
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      }
    }

    const instance = new CustomOverlay();
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

export const HistoricalMarkersLayer: React.FC<HistoricalMarkersLayerProps> = ({
  visible,
  activeEraId,
  selectedEvent,
  onSelectEvent,
  onSelectCounty,
  fieldTripStops = [],
  onAddFieldTripStop,
}) => {
  const map = useMap();

  // Filter events by active era (in 'present' show all milestones; otherwise show era-matched)
  const filteredEvents = React.useMemo(() => {
    if (!visible) return [];
    if (activeEraId === 'present') return HISTORICAL_EVENTS_DATA;
    return HISTORICAL_EVENTS_DATA.filter((ev) =>
      ev.eraIds.includes(activeEraId)
    );
  }, [visible, activeEraId]);

  // Smoothly pan/zoom to selected event when chosen from Header dropdown or marker click
  useEffect(() => {
    if (!map || !selectedEvent) return;
    map.panTo(selectedEvent.position);
    const currentZoom = map.getZoom() || 7;
    if (currentZoom < 9) {
      map.setZoom(9.5);
    }
  }, [map, selectedEvent]);

  if (!map || !visible) return null;

  return (
    <>
      {filteredEvents.map((ev) => {
        const isBattle = ev.category === 'battle';
        const isSelected = selectedEvent?.id === ev.id;
        const mainColor = isBattle ? '#9B2226' : '#D4AF37';

        return (
          <CustomMapHtmlOverlay
            key={ev.id}
            map={map}
            position={ev.position}
            zIndex={isSelected ? 80 : 45}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 group">
              {/* Animated Radial Pulse Ring */}
              <span
                className="absolute -inset-2.5 rounded-full animate-ping pointer-events-none"
                style={{
                  backgroundColor: mainColor,
                  opacity: isSelected ? 0.55 : 0.35,
                  animationDuration: isBattle ? '1.8s' : '2.4s',
                }}
              />

              {/* Marker Pin Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(ev);
                }}
                title={`${ev.title} (${ev.year})`}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-transform cursor-pointer border-2 ${
                  isSelected ? 'scale-125' : 'group-hover:scale-115'
                }`}
                style={{
                  backgroundColor: isBattle ? '#9B2226' : '#161920',
                  borderColor: isSelected ? '#F4F1EA' : '#D4AF37',
                  color: isBattle ? '#F4F1EA' : '#D4AF37',
                }}
              >
                {isBattle ? (
                  <Swords className="w-3.5 h-3.5" />
                ) : (
                  <Scroll className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Compact Label Pill on Hover or Active */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-md bg-[#161920]/95 border border-[#D4AF37]/60 shadow-xl whitespace-nowrap pointer-events-none transition-opacity ${
                  isSelected
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <div className="font-serif text-xs font-bold text-[#F4F1EA]">
                  {ev.shortTitle}
                </div>
                <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums">
                  {ev.dateLabel} · {ev.countyName} County
                </div>
              </div>
            </div>
          </CustomMapHtmlOverlay>
        );
      })}

      {/* Floating Milestone / Battle Dossier Card when an event is selected */}
      {selectedEvent && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-1.5rem)] max-w-lg pointer-events-auto">
          <div className="bg-[#161920]/95 backdrop-blur-2xl border border-[#D4AF37]/60 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold">
                  <span
                    className={
                      selectedEvent.category === 'battle'
                        ? 'text-[#E63946]'
                        : 'text-[#D4AF37]'
                    }
                  >
                    {selectedEvent.category === 'battle'
                      ? '⚔️ BATALLA / CONFLICTO HISTÓRICO'
                      : '📜 PROCLAMACIÓN / HITO FUNDACIONAL'}
                  </span>
                  <span className="text-[#C5A059]/40">·</span>
                  <span className="font-mono text-[#A39E93] tabular-nums">
                    {selectedEvent.year}
                  </span>
                </div>

                <h3 className="mt-1 font-serif text-lg font-bold text-[#F4F1EA]">
                  {selectedEvent.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onSelectEvent(null)}
                aria-label="Cerrar detalle del hito"
                className="p-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-[#A39E93] flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{selectedEvent.dateLabel}</span>
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  const county = PA_COUNTIES_DATA[selectedEvent.countyName];
                  if (county) onSelectCounty(county);
                }}
                className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Condado de {selectedEvent.countyName}</span>
              </button>
            </div>

            <p className="mt-2.5 text-xs text-[#F4F1EA]/90 leading-relaxed">
              {selectedEvent.summary}
            </p>

            <div className="mt-2.5 pt-2.5 border-t border-[#C5A059]/20 text-xs text-[#A39E93] leading-relaxed">
              <strong className="text-[#D4AF37]">Trascendencia:</strong>{' '}
              {selectedEvent.historicalImpact}
            </div>

            <div className="mt-2 pt-2 border-t border-[#C5A059]/15 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A39E93] flex-wrap">
                <Users className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[#F4F1EA] font-medium">Protagonistas:</span>
                <span>{selectedEvent.protagonists.join(' · ')}</span>
              </div>

              {onAddFieldTripStop && (
                <button
                  type="button"
                  disabled={
                    fieldTripStops.some((s) => s.id === selectedEvent.id) ||
                    fieldTripStops.length >= MAX_FIELD_TRIP_STOPS
                  }
                  onClick={() =>
                    onAddFieldTripStop({
                      id: selectedEvent.id,
                      title: selectedEvent.shortTitle,
                      subtitle: `${
                        selectedEvent.category === 'battle'
                          ? 'Batalla Histórica'
                          : 'Hito Fundacional'
                      } (${selectedEvent.year})`,
                      countyName: selectedEvent.countyName,
                      sourceType: 'event',
                      position: selectedEvent.position,
                      description: selectedEvent.summary,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    fieldTripStops.some((s) => s.id === selectedEvent.id)
                      ? 'bg-[#2D6A4F] text-[#F4F1EA] border-[#52B788]'
                      : fieldTripStops.length >= MAX_FIELD_TRIP_STOPS
                        ? 'bg-[#0D0F12]/60 text-[#A39E93] border-[#C5A059]/25'
                        : 'bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] border-[#F4F1EA]'
                  }`}
                >
                  {fieldTripStops.some((s) => s.id === selectedEvent.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>En mi Excursión</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>➕ Añadir a mi Excursión</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoricalMarkersLayer;
