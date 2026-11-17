import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Map as GoogleMap,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  Plus,
  Minus,
  Compass as CompassIcon,
} from 'lucide-react';
import {
  CountyRecord,
  HistoricalEra,
  PA_COUNTIES_DATA,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';
import {
  HistoricalScenarioId,
} from '../data/historicalTerritoriesConfig';
import MapOverlayControls from './MapOverlayControls';
import { HistoricalEventItem } from '../data/historicalEventsData';
import { HistoricalRouteItem } from '../data/historicalRoutesData';
import { VintageMapRecord } from '../data/vintageMapsData';
import {
  ARCHIVAL_DARK_MAP_STYLES,
  buildHistoricalMergedGeoJSON,
  getDataFeatureBounds,
  getGeoJsonFeatureBounds,
  PACountiesGeoJSON,
  PA_CENTER,
  PA_DEFAULT_ZOOM,
} from '../utils/geoUtils';
import { getEraMapFilterStyle } from './TimelineTransitionOverlay';
import HistoricalMarkersLayer from './HistoricalMarkersLayer';
import HistoricalRoutesLayer from './HistoricalRoutesLayer';
import { VintageGroundOverlayController } from './HistoricalMapsGallery';
import PhmcMarkersLayer from './PhmcMarkersLayer';
import {
  PhmcCategory,
  PhmcMarkerRecord,
} from '../data/phmcMarkersData';
import { FieldTripStop } from './FieldTripBuilder';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedRegion } from '../i18n/translations';

interface MapContainerProps {
  geoData: PACountiesGeoJSON | null;
  isLoadingGeo: boolean;
  geoError: string | null;
  selectedRegion: RegionId | 'all';
  onSelectRegion: (region: RegionId | 'all') => void;
  selectedCounty: CountyRecord | null;
  onSelectCounty: (county: CountyRecord | null) => void;
  activeEra: HistoricalEra;
  highlightEraFrontier: boolean;
  resetTrigger: number;
  // Module 1: Historical Milestones & Battles
  showEventsLayer: boolean;
  selectedEvent: HistoricalEventItem | null;
  onSelectEvent: (event: HistoricalEventItem | null) => void;
  // Module 2: Animated Historical Routes
  activeRoute: HistoricalRouteItem | null;
  onCloseRoute: () => void;
  // Module 3: Vintage Maps GroundOverlay
  activeOverlayMap: VintageMapRecord | null;
  overlayOpacity: number;
  onChangeOverlayOpacity: (opacity: number) => void;
  onRemoveOverlayMap: () => void;
  onOpenMapsGallery: () => void;
  // Phase 6: PHMC Historical Markers & Field Trip Builder
  showPhmcLayer: boolean;
  selectedPhmcCategory: PhmcCategory | 'all';
  selectedPhmcMarker: PhmcMarkerRecord | null;
  onSelectPhmcMarker: (marker: PhmcMarkerRecord | null) => void;
  fieldTripStops: FieldTripStop[];
  onAddFieldTripStop: (stop: FieldTripStop) => void;
  // Phase 8: Regions Legend visibility controlled from Header or MapOverlayControls
  isLegendOpen: boolean;
  onToggleLegendOpen: () => void;
  // Phase 11: Chronology Map Focus Target ("Locate on Map")
  chronologyFocusTarget?: {
    lat: number;
    lng: number;
    zoom?: number;
    turfScenario?: HistoricalScenarioId | 'none';
    timestamp: number;
  } | null;
}

interface HoveredCountyState {
  name: string;
  founded: number;
  countySeat: string;
  region: RegionId;
  areaSqMi: number;
  mergedSubtitle?: string;
}

const DataLayerController: React.FC<{
  geoData: PACountiesGeoJSON | null;
  turfScenario: HistoricalScenarioId | 'none';
  selectedRegion: RegionId | 'all';
  selectedCounty: CountyRecord | null;
  onSelectCounty: (county: CountyRecord | null) => void;
  activeEra: HistoricalEra;
  highlightEraFrontier: boolean;
  resetTrigger: number;
  onHoverCounty: (county: HoveredCountyState | null) => void;
  chronologyFocusTarget?: {
    lat: number;
    lng: number;
    zoom?: number;
    turfScenario?: HistoricalScenarioId | 'none';
    timestamp: number;
  } | null;
}> = ({
  geoData,
  turfScenario,
  selectedRegion,
  selectedCounty,
  onSelectCounty,
  activeEra,
  highlightEraFrontier,
  resetTrigger,
  onHoverCounty,
  chronologyFocusTarget,
}) => {
  const map = useMap();
  const { language } = useTranslation();
  const featuresMapRef = useRef<Record<string, google.maps.Data.Feature>>({});

  const activeGeoCollection = useMemo(() => {
    if (!geoData) return null;
    if (turfScenario === '1682' || turfScenario === '1787') {
      return buildHistoricalMergedGeoJSON(geoData, turfScenario);
    }
    return geoData;
  }, [geoData, turfScenario]);

  // Load GeoJSON features into map.data when collection or turfScenario changes
  useEffect(() => {
    if (!map || !activeGeoCollection) return;

    map.data.forEach((f) => map.data.remove(f));
    featuresMapRef.current = {};

    const addedFeatures = map.data.addGeoJson(activeGeoCollection as any);
    addedFeatures.forEach((feature) => {
      const name = String(
        feature.getProperty('name') || feature.getProperty('NAME') || ''
      );
      if (name) {
        featuresMapRef.current[name] = feature;
      }
    });

    const clickListener = map.data.addListener(
      'click',
      (event: google.maps.Data.MouseEvent) => {
        const f = event.feature;
        if (turfScenario !== 'none') {
          const modernCounties = f.getProperty('modernCounties') as
            | string[]
            | undefined;
          const primaryCountyName =
            modernCounties && modernCounties.length > 0
              ? modernCounties[0]
              : '';
          const record = PA_COUNTIES_DATA[primaryCountyName];
          if (record) {
            onSelectCounty(record);
          }
          return;
        }

        const countyName = String(
          f.getProperty('name') || f.getProperty('NAME') || ''
        );
        const record = PA_COUNTIES_DATA[countyName];
        if (record) {
          onSelectCounty(record);
        }
      }
    );

    const mouseoverListener = map.data.addListener(
      'mouseover',
      (event: google.maps.Data.MouseEvent) => {
        const f = event.feature;

        if (turfScenario !== 'none') {
          const histTitle = String(
            f.getProperty('historicalTitle') || f.getProperty('name') || ''
          );
          const seat = String(f.getProperty('seatOrCenter') || '');
          const totalArea = Number(f.getProperty('totalAreaSqMi') || 0);
          const modernList =
            (f.getProperty('modernCounties') as string[]) || [];
          onHoverCounty({
            name: histTitle,
            founded: turfScenario === '1682' ? 1682 : 1787,
            countySeat: seat,
            region: 'southeast',
            areaSqMi: totalArea,
            mergedSubtitle:
              language === 'en'
                ? `Turf.js merge of ${modernList.length} modern counties`
                : `Fusión Turf.js de ${modernList.length} condados actuales`,
          });
        } else {
          const countyName = String(
            f.getProperty('name') || f.getProperty('NAME') || ''
          );
          const record = PA_COUNTIES_DATA[countyName];
          if (record) {
            onHoverCounty({
              name: `${record.name} County`,
              founded: record.founded,
              countySeat: record.countySeat,
              region: record.region,
              areaSqMi: record.areaSqMi,
            });
          }
        }

        map.data.overrideStyle(f, {
          strokeColor: '#F4F1EA',
          strokeWeight: 2.6,
          fillOpacity: 0.74,
          zIndex: 30,
        });
      }
    );

    const mouseoutListener = map.data.addListener('mouseout', () => {
      onHoverCounty(null);
      map.data.revertStyle();
    });

    return () => {
      clickListener.remove();
      mouseoverListener.remove();
      mouseoutListener.remove();
      map.data.forEach((f) => map.data.remove(f));
    };
  }, [
    map,
    activeGeoCollection,
    turfScenario,
    onSelectCounty,
    onHoverCounty,
    language,
  ]);

  // Dynamic styling of features
  useEffect(() => {
    if (!map) return;

    map.data.setStyle((feature) => {
      if (turfScenario !== 'none') {
        const fillColor = String(feature.getProperty('fillColor') || '#1D3557');
        const strokeColor = String(
          feature.getProperty('strokeColor') || '#D4AF37'
        );
        return {
          fillColor,
          fillOpacity: 0.62,
          strokeColor,
          strokeWeight: 2.2,
          strokeOpacity: 0.95,
          zIndex: 10,
        };
      }

      const countyName = String(
        feature.getProperty('name') || feature.getProperty('NAME') || ''
      );
      const regionId = (feature.getProperty('region') ||
        'southcentral') as RegionId;
      const founded = Number(feature.getProperty('founded') || 1800);

      const regionMeta = PA_REGIONS[regionId] || PA_REGIONS.southcentral;
      const isSelected = selectedCounty?.name === countyName;
      const isInSelectedRegion =
        selectedRegion === 'all' || selectedRegion === regionId;
      const isFoundedInEra = founded <= activeEra.cutoffYear;
      const isEraProtagonist =
        activeEra.featuredCounties.includes(countyName);

      if (isSelected) {
        return {
          fillColor: regionMeta.hoverFillColor,
          fillOpacity: 0.78,
          strokeColor: '#D4AF37',
          strokeWeight: 3,
          strokeOpacity: 1,
          zIndex: 25,
        };
      }

      if (!isInSelectedRegion) {
        return {
          fillColor: '#12151B',
          fillOpacity: 0.22,
          strokeColor: '#C5A059',
          strokeWeight: 0.5,
          strokeOpacity: 0.25,
          zIndex: 1,
        };
      }

      if (highlightEraFrontier && !isFoundedInEra) {
        return {
          fillColor: '#141820',
          fillOpacity: 0.24,
          strokeColor: '#A39E93',
          strokeWeight: 0.6,
          strokeOpacity: 0.3,
          zIndex: 2,
        };
      }

      if (isEraProtagonist && activeEra.id !== 'present') {
        return {
          fillColor: regionMeta.hoverFillColor,
          fillOpacity: 0.62,
          strokeColor: '#D4AF37',
          strokeWeight: 1.9,
          strokeOpacity: 0.95,
          zIndex: 12,
        };
      }

      return {
        fillColor: regionMeta.fillColor,
        fillOpacity: selectedRegion === regionId ? 0.58 : 0.46,
        strokeColor: '#C5A059',
        strokeWeight: selectedRegion === regionId ? 1.4 : 1.0,
        strokeOpacity: 0.72,
        zIndex: 5,
      };
    });
  }, [
    map,
    turfScenario,
    selectedRegion,
    selectedCounty,
    activeEra,
    highlightEraFrontier,
  ]);

  // Smooth camera fitBounds when a county is selected
  useEffect(() => {
    if (!map || !selectedCounty) return;

    const dataFeature = featuresMapRef.current[selectedCounty.name];
    let bounds: google.maps.LatLngBounds | null = null;

    if (dataFeature && turfScenario === 'none') {
      bounds = getDataFeatureBounds(dataFeature);
    } else if (geoData) {
      const rawFeature = geoData.features.find(
        (f) => f.properties.name === selectedCounty.name
      );
      if (rawFeature) {
        bounds = getGeoJsonFeatureBounds(rawFeature);
      }
    }

    if (bounds) {
      const isDesktop = window.innerWidth >= 640;
      map.fitBounds(bounds, {
        top: 130,
        bottom: 190,
        left: 60,
        right: isDesktop ? 450 : 60,
      });
    }
  }, [map, selectedCounty, geoData, turfScenario]);

  // Smooth camera fitBounds when region filter changes
  useEffect(() => {
    if (!map || !geoData || selectedCounty) return;

    if (selectedRegion === 'all') {
      map.panTo(PA_CENTER);
      map.setZoom(PA_DEFAULT_ZOOM);
      return;
    }

    const regionFeatures = geoData.features.filter(
      (f) => f.properties.region === selectedRegion
    );
    if (regionFeatures.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    regionFeatures.forEach((rf) => {
      const b = getGeoJsonFeatureBounds(rf);
      if (b) {
        bounds.extend(b.getNorthEast());
        bounds.extend(b.getSouthWest());
      }
    });

    map.fitBounds(bounds, {
      top: 130,
      bottom: 190,
      left: 60,
      right: 60,
    });
  }, [map, selectedRegion, geoData, selectedCounty]);

  useEffect(() => {
    if (!map || resetTrigger === 0) return;
    map.panTo(PA_CENTER);
    map.setZoom(PA_DEFAULT_ZOOM);
  }, [map, resetTrigger]);

  useEffect(() => {
    if (!map || !chronologyFocusTarget) return;
    map.panTo({
      lat: chronologyFocusTarget.lat,
      lng: chronologyFocusTarget.lng,
    });
    if (chronologyFocusTarget.zoom) {
      map.setZoom(chronologyFocusTarget.zoom);
    }
  }, [map, chronologyFocusTarget]);

  return null;
};

const MapControlsOverlay: React.FC<{
  onResetCamera: () => void;
}> = ({ onResetCamera }) => {
  const map = useMap();

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    map.setZoom((map.getZoom() || PA_DEFAULT_ZOOM) + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    map.setZoom(Math.max(5, (map.getZoom() || PA_DEFAULT_ZOOM) - 1));
  }, [map]);

  return (
    <div className="fixed right-4 top-20 z-20 flex flex-col gap-1.5">
      <div className="bg-[#0F1C30]/85 backdrop-blur-xl border border-slate-700/60 rounded-xl p-1 shadow-xl flex flex-col gap-1">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className="w-8 h-8 rounded-lg bg-[#09111E]/75 hover:bg-[#1E3A8A]/70 text-[#F8FAFC] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="border-t border-slate-700/50" />
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          className="w-8 h-8 rounded-lg bg-[#09111E]/75 hover:bg-[#1E3A8A]/70 text-[#F8FAFC] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="border-t border-slate-700/50" />
        <button
          type="button"
          onClick={onResetCamera}
          title="Center on Pennsylvania (40.9699°N, 77.7278°W)"
          aria-label="Center on Pennsylvania"
          className="w-8 h-8 rounded-lg bg-[#09111E]/75 hover:bg-[#1E3A8A]/70 text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
        >
          <CompassIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const MapContainer: React.FC<MapContainerProps> = ({
  geoData,
  isLoadingGeo,
  geoError,
  selectedRegion,
  onSelectRegion,
  selectedCounty,
  onSelectCounty,
  activeEra,
  highlightEraFrontier,
  resetTrigger,
  showEventsLayer,
  selectedEvent,
  onSelectEvent,
  activeRoute,
  onCloseRoute,
  activeOverlayMap,
  overlayOpacity,
  onChangeOverlayOpacity,
  onRemoveOverlayMap,
  onOpenMapsGallery,
  showPhmcLayer,
  selectedPhmcCategory,
  selectedPhmcMarker,
  onSelectPhmcMarker,
  fieldTripStops,
  onAddFieldTripStop,
  isLegendOpen,
  onToggleLegendOpen,
  chronologyFocusTarget,
}) => {
  const [hoveredCounty, setHoveredCounty] = useState<HoveredCountyState | null>(
    null
  );
  const [turfScenario, setTurfScenario] = useState<
    HistoricalScenarioId | 'none'
  >('none');

  const { language, locale, t } = useTranslation();
  const apiLoadingStatus = useApiLoadingStatus();

  useEffect(() => {
    if (chronologyFocusTarget?.turfScenario !== undefined) {
      setTurfScenario(chronologyFocusTarget.turfScenario);
    }
  }, [chronologyFocusTarget]);

  const handleSelectTurfScenario = (mode: HistoricalScenarioId | 'none') => {
    setTurfScenario(mode);
    if (mode !== 'none') {
      onSelectCounty(null);
    }
  };

  return (
    <main className="relative w-full h-screen bg-[#09111E] overflow-hidden select-none no-print">
      {/* Map Wrapper with smooth duration-700 atmospheric CSS filter */}
      <div
        className="w-full h-full transition-[filter] duration-700 ease-out"
        style={{ filter: getEraMapFilterStyle(activeEra.id) }}
      >
        <GoogleMap
          defaultCenter={PA_CENTER}
          defaultZoom={PA_DEFAULT_ZOOM}
          minZoom={6}
          maxZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
          keyboardShortcuts={true}
          styles={ARCHIVAL_DARK_MAP_STYLES}
          backgroundColor="#09111E"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          <DataLayerController
            geoData={geoData}
            turfScenario={turfScenario}
            selectedRegion={selectedRegion}
            selectedCounty={selectedCounty}
            onSelectCounty={onSelectCounty}
            activeEra={activeEra}
            highlightEraFrontier={highlightEraFrontier}
            resetTrigger={resetTrigger}
            onHoverCounty={setHoveredCounty}
            chronologyFocusTarget={chronologyFocusTarget}
          />

          {/* Module 1: Pulsing Historical Milestones & Battles Markers Layer */}
          <HistoricalMarkersLayer
            visible={showEventsLayer}
            activeEraId={activeEra.id}
            selectedEvent={selectedEvent}
            onSelectEvent={onSelectEvent}
            onSelectCounty={(county) => onSelectCounty(county)}
            fieldTripStops={fieldTripStops}
            onAddFieldTripStop={onAddFieldTripStop}
          />

          {/* Phase 6 Module 1: Official Blue-and-Gold PHMC Historical Plaques Layer */}
          <PhmcMarkersLayer
            visible={showPhmcLayer}
            selectedCategory={selectedPhmcCategory}
            selectedMarker={selectedPhmcMarker}
            onSelectMarker={onSelectPhmcMarker}
            onSelectCounty={(county) => onSelectCounty(county)}
            fieldTripStops={fieldTripStops}
            onAddFieldTripStop={onAddFieldTripStop}
          />

          {/* Module 2: Animated Historical Routes Layer with Golden Arrowhead Player */}
          <HistoricalRoutesLayer
            activeRoute={activeRoute}
            onCloseRoute={onCloseRoute}
            onSelectCounty={(county) => onSelectCounty(county)}
          />

          {/* Module 3: Public Domain Vintage Map GroundOverlay Controller */}
          <VintageGroundOverlayController
            activeMap={activeOverlayMap}
            opacity={overlayOpacity}
            onChangeOpacity={onChangeOverlayOpacity}
            onRemoveOverlay={onRemoveOverlayMap}
            onOpenGallery={onOpenMapsGallery}
          />

          {!selectedCounty && (
            <MapControlsOverlay
              onResetCamera={() => {
                onSelectCounty(null);
                onSelectRegion('all');
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Subtle Radial Vignette for Civic Archive Depth */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 60%, rgba(9, 17, 30, 0.65) 100%)',
        }}
      />

      {/* Phase 8: Clean Top-Left Floating Territorial Pill Bar & Collapsible Regions Legend */}
      <MapOverlayControls
        turfScenario={turfScenario}
        onSelectTurfScenario={handleSelectTurfScenario}
        selectedRegion={selectedRegion}
        onSelectRegion={onSelectRegion}
        activeEra={activeEra}
        highlightEraFrontier={highlightEraFrontier}
        isLegendOpen={isLegendOpen}
        onToggleLegendOpen={onToggleLegendOpen}
      />

      {/* Live Hover County Inspector Pill (Top Center below Header) */}
      {hoveredCounty && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-[#0F1C30]/92 backdrop-blur-xl border border-[#D4AF37]/70 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-xs shrink-0"
              style={{
                backgroundColor: PA_REGIONS[hoveredCounty.region].badgeColor,
              }}
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-base font-bold text-[#F8FAFC]">
                  {hoveredCounty.name}
                </span>
                <span className="font-mono text-xs text-[#D4AF37] tabular-nums">
                  ({hoveredCounty.founded})
                </span>
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                {t.map.centerOrSeat}{' '}
                <span className="text-[#F8FAFC]">
                  {hoveredCounty.countySeat}
                </span>
                {' · '}
                {hoveredCounty.mergedSubtitle ||
                  getLocalizedRegion(hoveredCounty.region, language).shortName}
                {' · '}
                <span className="font-mono tabular-nums">
                  {hoveredCounty.areaSqMi.toLocaleString(locale)} mi²
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading or Error States */}
      {(isLoadingGeo || apiLoadingStatus === APILoadingStatus.LOADING) && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-[#0F1C30]/92 backdrop-blur-xl border border-slate-700/60 rounded-xl px-6 py-4 shadow-2xl text-center">
            <div className="font-serif text-lg text-[#D4AF37] font-semibold">
              {t.map.loadingTitle}
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              {t.map.loadingSubtitle}
            </div>
          </div>
        </div>
      )}

      {geoError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-[#B22234]/95 border border-[#D4AF37]/50 text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs shadow-xl">
          {geoError}
        </div>
      )}
    </main>
  );
};

export default MapContainer;
