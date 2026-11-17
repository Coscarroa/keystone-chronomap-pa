import React, { useState, useMemo } from 'react';
import {
  Bus,
  ChevronUp,
  ChevronDown,
  Trash2,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  X,
  Plus,
  Route,
  Clock,
} from 'lucide-react';
import { PHMC_MARKERS_DATA } from '../data/phmcMarkersData';
import { useTranslation } from '../context/LanguageContext';

export interface FieldTripStop {
  id: string;
  title: string;
  subtitle: string;
  countyName: string;
  sourceType: 'phmc' | 'event' | 'county';
  position: google.maps.LatLngLiteral;
  description: string;
}

export const FIELD_TRIP_STORAGE_KEY = 'keystone_field_trip';
export const MAX_FIELD_TRIP_STOPS = 5;

/**
 * Haversine formula to compute great-circle distance in miles between two coordinates,
 * multiplied by a 1.25x road-network winding factor for realistic driving distance.
 */
export function calculateRoadMilesHaversine(
  a: google.maps.LatLngLiteral,
  b: google.maps.LatLngLiteral
): number {
  const R_EARTH_MILES = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  const straightMiles = R_EARTH_MILES * c;

  return Number((straightMiles * 1.25).toFixed(1));
}

export function formatDrivingDuration(totalMiles: number): string {
  if (totalMiles <= 0) return '0 min';
  const totalMinutes = Math.max(5, Math.round((totalMiles / 50) * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `~${mins} min`;
  return `~${hours} h ${mins} min`;
}

export function buildGoogleMapsDirectionsUrl(stops: FieldTripStop[]): string {
  if (stops.length === 0) {
    return 'https://www.google.com/maps/@40.9699,-77.7278,7z';
  }
  if (stops.length === 1) {
    const only = stops[0].position;
    return `https://www.google.com/maps/dir/?api=1&destination=${only.lat},${only.lng}&travelmode=driving`;
  }

  const origin = `${stops[0].position.lat},${stops[0].position.lng}`;
  const last = stops[stops.length - 1].position;
  const destination = `${last.lat},${last.lng}`;

  const intermediate = stops.slice(1, -1);
  const waypointsParam =
    intermediate.length > 0
      ? `&waypoints=${encodeURIComponent(
          intermediate
            .map((s) => `${s.position.lat},${s.position.lng}`)
            .join('|')
        )}`
      : '';

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(
    destination
  )}${waypointsParam}&travelmode=driving`;
}

interface FieldTripBuilderProps {
  stops: FieldTripStop[];
  onAddStop: (stop: FieldTripStop) => void;
  onRemoveStop: (stopId: string) => void;
  onMoveStop: (index: number, direction: 'up' | 'down') => void;
  onClearStops: () => void;
  onFocusStopOnMap: (stop: FieldTripStop) => void;
}

export const FieldTripBuilder: React.FC<FieldTripBuilderProps> = ({
  stops,
  onAddStop,
  onRemoveStop,
  onMoveStop,
  onClearStops,
  onFocusStopOnMap,
}) => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [quickPickId, setQuickPickId] = useState<string>('');

  const routeMetrics = useMemo(() => {
    const legMiles: number[] = [];
    let totalMiles = 0;

    for (let i = 0; i < stops.length - 1; i++) {
      const d = calculateRoadMilesHaversine(
        stops[i].position,
        stops[i + 1].position
      );
      legMiles.push(d);
      totalMiles += d;
    }

    totalMiles = Number(totalMiles.toFixed(1));
    const durationLabel = formatDrivingDuration(totalMiles);

    return {
      legMiles,
      totalMiles,
      durationLabel,
    };
  }, [stops]);

  const googleMapsUrl = useMemo(
    () => buildGoogleMapsDirectionsUrl(stops),
    [stops]
  );

  // Generates the exported WhatsApp / Email itinerary in the active language (EN or ES)
  const handleCopyItinerary = async () => {
    if (stops.length === 0) return;

    const lines: string[] = [
      t.fieldTrip.exportHeader,
      t.fieldTrip.exportStopsCount(stops.length, MAX_FIELD_TRIP_STOPS),
      stops.length >= 2
        ? t.fieldTrip.exportDistanceLine(
            routeMetrics.totalMiles,
            routeMetrics.durationLabel
          )
        : '',
      '------------------------------------------------------------',
    ].filter(Boolean);

    stops.forEach((s, idx) => {
      if (idx > 0) {
        lines.push(
          t.fieldTrip.exportLegPrefix(routeMetrics.legMiles[idx - 1])
        );
      }
      lines.push(
        `${idx + 1}. ${s.title} (${s.countyName} County) — [${s.subtitle}]`
      );
      lines.push(
        `${t.fieldTrip.exportCoordsPrefix} ${s.position.lat.toFixed(4)}, ${s.position.lng.toFixed(4)}`
      );
      lines.push(`${t.fieldTrip.exportSummaryPrefix} ${s.description}`);
    });

    lines.push('------------------------------------------------------------');
    lines.push(`${t.fieldTrip.exportMapsLinkHeader}\n${googleMapsUrl}`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSuccess(true);
      window.setTimeout(() => setCopiedSuccess(false), 2600);
    } catch {
      // Fallback if clipboard API restricted
    }
  };

  const handleQuickAddPhmc = (markerId: string) => {
    if (!markerId || stops.length >= MAX_FIELD_TRIP_STOPS) return;
    const found = PHMC_MARKERS_DATA.find((m) => m.id === markerId);
    if (!found) return;

    onAddStop({
      id: `phmc-${found.id}`,
      title: found.title,
      subtitle:
        language === 'en'
          ? `PHMC Plaque · ${found.cityOrTown} (${found.eventYear})`
          : `Placa PHMC · ${found.cityOrTown} (${found.eventYear})`,
      countyName: found.countyName,
      sourceType: 'phmc',
      position: found.position,
      description:
        language === 'en' ? found.plaqueTextEn : found.plaqueTextEs,
    });
    setQuickPickId('');
  };

  return (
    <div className="fixed right-4 bottom-32 xl:bottom-8 z-35 pointer-events-auto no-print">
      {/* Collapsed Floating Badge Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm shadow-[0_14px_35px_rgba(0,0,0,0.75)] flex items-center gap-2.5 transition-all cursor-pointer border-2 ${
            stops.length > 0
              ? 'bg-gradient-to-r from-[#1E3A8A] to-[#0F1C30] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
              : 'bg-[#0F1C30]/92 backdrop-blur-xl text-[#F8FAFC] border-slate-700/80 hover:border-[#D4AF37] hover:bg-[#1E3A8A]/70'
          }`}
        >
          <Bus className="w-4 h-4 text-[#D4AF37]" />
          <span>
            {t.fieldTrip.badgeBtn(stops.length, MAX_FIELD_TRIP_STOPS)}
          </span>
          {stops.length >= 2 && (
            <span className="px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#09111E] font-mono text-[10px] font-bold tabular-nums">
              {routeMetrics.totalMiles} mi
            </span>
          )}
        </button>
      )}

      {/* Expanded Field Trip Planner Drawer */}
      {isOpen && (
        <aside
          aria-label={t.fieldTrip.drawerAria}
          className="w-[calc(100vw-1.5rem)] sm:w-[395px] bg-[#161920]/96 backdrop-blur-2xl border-2 border-[#D4AF37]/65 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[72vh]"
        >
          {/* Drawer Header */}
          <div className="px-4 py-3 border-b border-[#C5A059]/30 bg-[#1D3557]/45 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-[#0D0F12] flex items-center justify-center shrink-0 font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-bold">
                  {t.fieldTrip.headerKicker}
                </div>
                <h3 className="font-serif text-base font-bold text-[#F4F1EA]">
                  {t.fieldTrip.headerTitle(stops.length, MAX_FIELD_TRIP_STOPS)}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {stops.length > 0 && (
                <button
                  type="button"
                  onClick={onClearStops}
                  title={t.fieldTrip.clearTitle}
                  className="px-2 py-1 rounded-lg bg-[#9B2226]/70 hover:bg-[#9B2226] text-[10px] text-[#F4F1EA] font-medium cursor-pointer"
                >
                  {t.fieldTrip.clearBtn}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.fieldTrip.minimizeAria}
                className="p-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Distance & Driving Time Telemetry Bar */}
          {stops.length >= 2 && (
            <div className="px-4 py-2.5 bg-[#0D0F12]/90 border-b border-[#C5A059]/25 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t.fieldTrip.estRoadDist}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums">
                    {routeMetrics.totalMiles} {t.fieldTrip.milesUnit}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t.fieldTrip.drivingTimeLabel}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#F4F1EA] tabular-nums">
                    {routeMetrics.durationLabel}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Add Selector when fewer than 5 stops */}
          {stops.length < MAX_FIELD_TRIP_STOPS && (
            <div className="px-4 py-2.5 bg-[#0D0F12]/55 border-b border-[#C5A059]/20 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <select
                value={quickPickId}
                onChange={(e) => handleQuickAddPhmc(e.target.value)}
                aria-label={t.fieldTrip.quickAddPlaceholder}
                className="w-full bg-[#0D0F12] border border-[#C5A059]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">{t.fieldTrip.quickAddPlaceholder}</option>
                {PHMC_MARKERS_DATA.filter(
                  (m) =>
                    !stops.some(
                      (s) => s.id === m.id || s.id === `phmc-${m.id}`
                    )
                ).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.cityOrTown}, {m.countyName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stops List */}
          <div className="p-3.5 overflow-y-auto space-y-2 flex-1">
            {stops.length === 0 ? (
              <div className="p-5 rounded-xl bg-[#0D0F12]/60 border border-[#C5A059]/20 text-center space-y-2">
                <MapPin className="w-7 h-7 text-[#D4AF37] mx-auto opacity-80" />
                <div className="font-serif text-sm font-bold text-[#F4F1EA]">
                  {t.fieldTrip.emptyTitle}
                </div>
                <p className="text-xs text-[#A39E93] leading-relaxed">
                  {t.fieldTrip.emptyDesc}
                </p>
              </div>
            ) : (
              stops.map((stop, idx) => {
                const legFromPrev =
                  idx > 0 ? routeMetrics.legMiles[idx - 1] : null;
                return (
                  <React.Fragment key={stop.id}>
                    {legFromPrev !== null && (
                      <div className="flex items-center gap-2 pl-4 text-[10px] font-mono text-[#D4AF37]/90">
                        <span>
                          {t.fieldTrip.legEstimate(
                            legFromPrev,
                            formatDrivingDuration(legFromPrev)
                          )}
                        </span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-[#0D0F12]/80 border border-[#C5A059]/30 hover:border-[#D4AF37]/60 transition-colors flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onFocusStopOnMap(stop)}
                        className="flex items-start gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#1D3557] border border-[#D4AF37] font-mono text-xs font-bold text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-serif text-xs sm:text-sm font-bold text-[#F4F1EA] truncate">
                            {stop.title}
                          </div>
                          <div className="text-[11px] text-[#D4AF37] truncate">
                            {stop.subtitle} · {stop.countyName} County
                          </div>
                        </div>
                      </button>

                      {/* Reorder Up/Down & Remove Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onMoveStop(idx, 'up')}
                          title={t.fieldTrip.moveUpTitle}
                          aria-label={t.fieldTrip.moveUpTitle}
                          className="p-1 rounded-md bg-[#161920] border border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === stops.length - 1}
                          onClick={() => onMoveStop(idx, 'down')}
                          title={t.fieldTrip.moveDownTitle}
                          aria-label={t.fieldTrip.moveDownTitle}
                          className="p-1 rounded-md bg-[#161920] border border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveStop(stop.id)}
                          title={t.fieldTrip.removeStopTitle}
                          aria-label={t.fieldTrip.removeStopTitle}
                          className="p-1 rounded-md bg-[#9B2226]/70 hover:bg-[#9B2226] text-[#F4F1EA] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>

          {/* Footer Action Buttons: Export to Google Maps & Copy for WhatsApp/Email */}
          {stops.length > 0 && (
            <div className="p-3.5 border-t border-[#C5A059]/30 bg-[#0D0F12]/90 space-y-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.fieldTrip.openGoogleMapsBtn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyItinerary}
                className="w-full py-2 px-3 rounded-xl bg-[#161920] hover:bg-[#1D3557]/70 border border-[#C5A059]/35 hover:border-[#D4AF37] text-xs font-medium text-[#F4F1EA] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#52B788]" />
                    <span className="text-[#52B788] font-semibold">
                      {t.fieldTrip.copiedSuccessMsg}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t.fieldTrip.copyItineraryBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default FieldTripBuilder;
