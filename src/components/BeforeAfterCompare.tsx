import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Map as GoogleMap,
  useMap,
  MapCameraProps,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
  X,
} from 'lucide-react';
import {
  PA_COUNTIES_DATA,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';
import {
  HISTORICAL_SCENARIOS,
  HistoricalScenarioId,
  HistoricalTerritoryDefinition,
} from '../data/historicalTerritoriesConfig';
import {
  ARCHIVAL_DARK_MAP_STYLES,
  buildHistoricalMergedGeoJSON,
  HistoricalMergedGeoJSON,
  PACountiesGeoJSON,
  PA_CENTER,
  PA_DEFAULT_ZOOM,
} from '../utils/geoUtils';
import { useTranslation } from '../context/LanguageContext';

interface BeforeAfterCompareProps {
  geoData: PACountiesGeoJSON | null;
  onCloseCompare: () => void;
  initialScenario?: HistoricalScenarioId;
}

const INITIAL_CAMERA: MapCameraProps = {
  center: PA_CENTER,
  zoom: PA_DEFAULT_ZOOM,
  heading: 0,
  tilt: 0,
};

/**
 * Data layer for the LEFT ("ANTES" / "BEFORE") map using Turf.js unified polygons
 */
const HistoricalMergedLayer: React.FC<{
  mergedGeo: HistoricalMergedGeoJSON | null;
  selectedTerritoryId: string | null;
  onSelectTerritory: (territory: HistoricalTerritoryDefinition) => void;
  onHoverTerritory: (territory: HistoricalTerritoryDefinition | null) => void;
}> = ({
  mergedGeo,
  selectedTerritoryId,
  onSelectTerritory,
  onHoverTerritory,
}) => {
  const map = useMap('compare-map-historical');

  useEffect(() => {
    if (!map || !mergedGeo) return;

    map.data.forEach((f) => map.data.remove(f));
    map.data.addGeoJson(mergedGeo as any);

    const clickListener = map.data.addListener(
      'click',
      (event: google.maps.Data.MouseEvent) => {
        const f = event.feature;
        const id = String(f.getProperty('id') || '');
        const scenario = HISTORICAL_SCENARIOS[mergedGeo.scenarioId];
        const found = scenario.territories.find((t) => t.id === id);
        if (found) {
          onSelectTerritory(found);
        }
      }
    );

    const overListener = map.data.addListener(
      'mouseover',
      (event: google.maps.Data.MouseEvent) => {
        const f = event.feature;
        const id = String(f.getProperty('id') || '');
        const scenario = HISTORICAL_SCENARIOS[mergedGeo.scenarioId];
        const found = scenario.territories.find((t) => t.id === id);
        if (found) {
          onHoverTerritory(found);
        }
        map.data.overrideStyle(f, {
          strokeColor: '#F4F1EA',
          strokeWeight: 3,
          fillOpacity: 0.78,
          zIndex: 30,
        });
      }
    );

    const outListener = map.data.addListener('mouseout', () => {
      onHoverTerritory(null);
      map.data.revertStyle();
    });

    return () => {
      clickListener.remove();
      overListener.remove();
      outListener.remove();
      map.data.forEach((f) => map.data.remove(f));
    };
  }, [map, mergedGeo, onSelectTerritory, onHoverTerritory]);

  useEffect(() => {
    if (!map) return;

    map.data.setStyle((feature) => {
      const id = String(feature.getProperty('id') || '');
      const fillColor = String(feature.getProperty('fillColor') || '#1D3557');
      const hoverFillColor = String(
        feature.getProperty('hoverFillColor') || '#2B4C7E'
      );
      const strokeColor = String(
        feature.getProperty('strokeColor') || '#D4AF37'
      );
      const isSelected = selectedTerritoryId === id;

      return {
        fillColor: isSelected ? hoverFillColor : fillColor,
        fillOpacity: isSelected ? 0.78 : 0.62,
        strokeColor: isSelected ? '#F4F1EA' : strokeColor,
        strokeWeight: isSelected ? 3.0 : 2.2,
        strokeOpacity: 0.95,
        zIndex: isSelected ? 25 : 10,
      };
    });
  }, [map, selectedTerritoryId, mergedGeo]);

  return null;
};

/**
 * Data layer for the RIGHT ("HOY" / "TODAY") map showing all 67 modern counties,
 * highlighting counties that belong to the selected historical territory.
 */
const ModernCountiesCompareLayer: React.FC<{
  geoData: PACountiesGeoJSON | null;
  highlightedCounties: string[];
  onHoverModernCounty: (name: string | null) => void;
}> = ({ geoData, highlightedCounties, onHoverModernCounty }) => {
  const map = useMap('compare-map-modern');

  useEffect(() => {
    if (!map || !geoData) return;

    map.data.forEach((f) => map.data.remove(f));
    map.data.addGeoJson(geoData as any);

    const overListener = map.data.addListener(
      'mouseover',
      (event: google.maps.Data.MouseEvent) => {
        const f = event.feature;
        const name = String(f.getProperty('name') || f.getProperty('NAME') || '');
        onHoverModernCounty(name || null);
        map.data.overrideStyle(f, {
          strokeColor: '#F4F1EA',
          strokeWeight: 2.4,
          fillOpacity: 0.78,
          zIndex: 30,
        });
      }
    );

    const outListener = map.data.addListener('mouseout', () => {
      onHoverModernCounty(null);
      map.data.revertStyle();
    });

    return () => {
      overListener.remove();
      outListener.remove();
      map.data.forEach((f) => map.data.remove(f));
    };
  }, [map, geoData, onHoverModernCounty]);

  useEffect(() => {
    if (!map) return;

    map.data.setStyle((feature) => {
      const name = String(
        feature.getProperty('name') || feature.getProperty('NAME') || ''
      );
      const regionId = (feature.getProperty('region') ||
        'southcentral') as RegionId;
      const regionMeta = PA_REGIONS[regionId] || PA_REGIONS.southcentral;
      const isHighlighted =
        highlightedCounties.length > 0 && highlightedCounties.includes(name);

      if (highlightedCounties.length > 0 && !isHighlighted) {
        return {
          fillColor: '#12151B',
          fillOpacity: 0.25,
          strokeColor: '#C5A059',
          strokeWeight: 0.6,
          strokeOpacity: 0.35,
          zIndex: 2,
        };
      }

      return {
        fillColor: isHighlighted
          ? regionMeta.hoverFillColor
          : regionMeta.fillColor,
        fillOpacity: isHighlighted ? 0.72 : 0.5,
        strokeColor: isHighlighted ? '#D4AF37' : '#C5A059',
        strokeWeight: isHighlighted ? 1.8 : 1.0,
        strokeOpacity: isHighlighted ? 0.95 : 0.75,
        zIndex: isHighlighted ? 15 : 5,
      };
    });
  }, [map, highlightedCounties]);

  return null;
};

export const BeforeAfterCompare: React.FC<BeforeAfterCompareProps> = ({
  geoData,
  onCloseCompare,
  initialScenario = '1682',
}) => {
  const { language } = useTranslation();
  const [scenarioId, setScenarioId] =
    useState<HistoricalScenarioId>(initialScenario);
  const [sliderPercent, setSliderPercent] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [cameraState, setCameraState] =
    useState<MapCameraProps>(INITIAL_CAMERA);
  const [activeSide, setActiveSide] = useState<'historical' | 'modern'>(
    'historical'
  );
  const [selectedTerritory, setSelectedTerritory] =
    useState<HistoricalTerritoryDefinition | null>(null);
  const [hoveredTerritory, setHoveredTerritory] =
    useState<HistoricalTerritoryDefinition | null>(null);
  const [hoveredModernCounty, setHoveredModernCounty] = useState<string | null>(
    null
  );
  const [isCardExpanded, setIsCardExpanded] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Build Turf.js merged GeoJSON for the active historical scenario
  const mergedHistoricalGeo = useMemo(() => {
    if (!geoData) return null;
    return buildHistoricalMergedGeoJSON(geoData, scenarioId);
  }, [geoData, scenarioId]);

  const currentScenarioConfig = HISTORICAL_SCENARIOS[scenarioId];

  // Reset selected territory when scenario changes
  useEffect(() => {
    setSelectedTerritory(currentScenarioConfig.territories[0] || null);
  }, [scenarioId, currentScenarioConfig]);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraState(ev.detail);
  }, []);

  const handleResetCamera = useCallback(() => {
    setCameraState(INITIAL_CAMERA);
  }, []);

  // Slider drag handlers for mouse and touch
  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const pct = Math.max(8, Math.min(92, (relX / rect.width) * 100));
    setSliderPercent(pct);
  }, []);

  useEffect(() => {
    if (!isDraggingSlider) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateSliderFromClientX(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateSliderFromClientX(e.touches[0].clientX);
      }
    };
    const handleStop = () => {
      setIsDraggingSlider(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleStop);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleStop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStop);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleStop);
    };
  }, [isDraggingSlider, updateSliderFromClientX]);

  const activeTerritory = hoveredTerritory || selectedTerritory;
  const highlightedModernCounties = useMemo(() => {
    return activeTerritory ? activeTerritory.modernCounties : [];
  }, [activeTerritory]);

  const modernCountyRecord = hoveredModernCounty
    ? PA_COUNTIES_DATA[hoveredModernCounty]
    : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0D0F12] overflow-hidden select-none no-print"
    >
      {/* RIGHT LAYER ("HOY" / "TODAY" — 67 Modern Counties, full viewport underneath) */}
      <div
        className="absolute inset-0 w-full h-full"
        onMouseEnter={() => setActiveSide('modern')}
        onTouchStart={() => setActiveSide('modern')}
      >
        <GoogleMap
          id="compare-map-modern"
          {...cameraState}
          onCameraChanged={
            activeSide === 'modern' ? handleCameraChange : undefined
          }
          minZoom={6}
          maxZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={true}
          styles={ARCHIVAL_DARK_MAP_STYLES}
          backgroundColor="#0D0F12"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          <ModernCountiesCompareLayer
            geoData={geoData}
            highlightedCounties={highlightedModernCounties}
            onHoverModernCounty={setHoveredModernCounty}
          />
        </GoogleMap>
      </div>

      {/* LEFT LAYER ("ANTES" / "BEFORE" — Turf.js Unified Historical Territories, clipped via clip-path: inset) */}
      <div
        className="absolute inset-0 w-full h-full transition-[filter] duration-700"
        style={{
          clipPath: `inset(0 ${100 - sliderPercent}% 0 0)`,
          filter: 'sepia(0.24) saturate(0.95) contrast(1.05)',
        }}
        onMouseEnter={() => setActiveSide('historical')}
        onTouchStart={() => setActiveSide('historical')}
      >
        <GoogleMap
          id="compare-map-historical"
          {...cameraState}
          onCameraChanged={
            activeSide === 'historical' ? handleCameraChange : undefined
          }
          minZoom={6}
          maxZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={true}
          styles={ARCHIVAL_DARK_MAP_STYLES}
          backgroundColor="#0D0F12"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          <HistoricalMergedLayer
            mergedGeo={mergedHistoricalGeo}
            selectedTerritoryId={selectedTerritory?.id || null}
            onSelectTerritory={(t) => setSelectedTerritory(t)}
            onHoverTerritory={(t) => setHoveredTerritory(t)}
          />
        </GoogleMap>
      </div>

      {/* DRAGGABLE VERTICAL SLIDER CURTAIN */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={
          language === 'en'
            ? 'Historical vs modern map comparison curtain'
            : 'Cortina de comparación histórica Antes y Hoy'
        }
        aria-valuemin={8}
        aria-valuemax={92}
        aria-valuenow={Math.round(sliderPercent)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setSliderPercent((p) => Math.max(8, p - 4));
          } else if (e.key === 'ArrowRight') {
            setSliderPercent((p) => Math.min(92, p + 4));
          }
        }}
        onMouseDown={() => setIsDraggingSlider(true)}
        onTouchStart={() => setIsDraggingSlider(true)}
        style={{ left: `${sliderPercent}%` }}
        className="absolute top-0 bottom-0 z-30 -translate-x-1/2 w-10 cursor-ew-resize flex flex-col items-center justify-center group focus:outline-none touch-none"
      >
        {/* Full-height golden hairline divider */}
        <div className="w-0.5 h-full bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.65)]" />

        {/* Central Archival Drag Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#161920]/95 border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
          <ArrowLeftRight className="w-5 h-5" />
        </div>

        {/* Side Labels Attached to Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 right-13 px-2.5 py-1 rounded-md bg-[#161920]/90 border border-[#C5A059]/40 text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] whitespace-nowrap pointer-events-none shadow-lg">
          {language === 'en'
            ? `BEFORE (${currentScenarioConfig.year})`
            : `ANTES (${currentScenarioConfig.year})`}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-13 px-2.5 py-1 rounded-md bg-[#161920]/90 border border-[#C5A059]/40 text-[10px] font-mono uppercase tracking-[0.18em] text-[#F4F1EA] whitespace-nowrap pointer-events-none shadow-lg">
          {language === 'en' ? 'TODAY (67 Counties)' : 'HOY (67 Condados)'}
        </div>
      </div>

      {/* TOP FLOATING CONTROLS FOR BEFORE ("ANTES") & AFTER ("HOY") */}
      <div className="fixed top-24 sm:top-20 left-3 right-3 z-30 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Left Panel: "ANTES" Scenario Selector */}
          <div className="bg-[#161920]/90 backdrop-blur-xl border border-[#D4AF37]/50 rounded-xl px-4 py-2.5 shadow-2xl pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {language === 'en' ? 'LEFT · BEFORE:' : 'IZQUIERDA · ANTES:'}
              </span>
            </div>

            <select
              value={scenarioId}
              onChange={(e) =>
                setScenarioId(e.target.value as HistoricalScenarioId)
              }
              aria-label={
                language === 'en'
                  ? 'Select historical scenario to compare'
                  : 'Seleccionar escenario histórico para comparar'
              }
              className="bg-[#0D0F12] border border-[#C5A059]/40 rounded-lg px-3 py-1.5 text-xs font-medium text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="1682">
                {language === 'en'
                  ? 'William Penn’s 3 Original Counties (1682)'
                  : '3 Condados Originales de William Penn (1682)'}
              </option>
              <option value="1787">
                {language === 'en'
                  ? 'Constitutional Era Pennsylvania (1787 — 18 Counties)'
                  : 'Pensilvania en la Constitución (1787 — 18 Condados)'}
              </option>
            </select>
          </div>

          {/* Right Panel: "HOY" Info + Reset & Exit Compare */}
          <div className="bg-[#161920]/90 backdrop-blur-xl border border-[#C5A059]/35 rounded-xl px-4 py-2.5 shadow-2xl pointer-events-auto flex items-center justify-between sm:justify-end gap-3">
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A39E93]">
                {language === 'en' ? 'RIGHT · TODAY:' : 'DERECHA · HOY:'}
              </div>
              <div className="font-serif text-xs sm:text-sm font-semibold text-[#F4F1EA]">
                {language === 'en'
                  ? 'Modern Political Subdivision (67 Counties)'
                  : 'División Política Actual (67 Condados)'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetCamera}
              title={
                language === 'en'
                  ? 'Reset synchronized camera'
                  : 'Restablecer cámara sincronizada'
              }
              className="p-2 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCloseCompare}
              className="px-3 py-1.5 rounded-lg bg-[#9B2226]/80 hover:bg-[#9B2226] border border-[#D4AF37]/40 text-xs font-medium text-[#F4F1EA] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>
                {language === 'en' ? 'Exit Compare' : 'Salir de Comparación'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE HOVER MODERN COUNTY PILL ON RIGHT SIDE */}
      {modernCountyRecord && (
        <div className="fixed top-40 right-6 z-30 pointer-events-none hidden md:block">
          <div className="bg-[#161920]/92 backdrop-blur-xl border border-[#C5A059]/50 rounded-xl px-4 py-2.5 shadow-2xl">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
              {language === 'en'
                ? 'Modern County (Today)'
                : 'Condado Moderno (Hoy)'}
            </div>
            <div className="font-serif text-base font-bold text-[#F4F1EA]">
              {modernCountyRecord.name} County ({modernCountyRecord.founded})
            </div>
            <div className="text-xs text-[#A39E93]">
              {language === 'en' ? 'Seat' : 'Sede'}:{' '}
              {modernCountyRecord.countySeat} ·{' '}
              {PA_REGIONS[modernCountyRecord.region].shortName}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM EXPLANATORY & INTERACTIVE SUBDIVISION CARD */}
      <div className="fixed bottom-8 left-3 right-3 z-30 pointer-events-none">
        <div className="max-w-[1220px] mx-auto bg-[#161920]/90 backdrop-blur-xl border border-[#C5A059]/35 rounded-xl px-5 py-4 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? 'Turf.js Geospatial Union (turf.union) · From 3 Original Counties (1682) to 18 (1787) and 67 Today'
                  : 'Fusión Geoespacial Turf.js (turf.union) · De 3 Condados Originales (1682) a 18 (1787) y 67 Actuales'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCardExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer"
              aria-label={
                isCardExpanded
                  ? language === 'en'
                    ? 'Collapse historical explanation'
                    : 'Contraer explicación histórica'
                  : language === 'en'
                    ? 'Expand historical explanation'
                    : 'Expandir explicación histórica'
              }
            >
              {isCardExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {isCardExpanded && (
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left 5 cols: General Subdivision Synthesis */}
              <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 pb-3 lg:pb-0 lg:pr-4">
                <h3 className="font-serif text-base font-bold text-[#F4F1EA]">
                  {language === 'en'
                    ? 'How did Pennsylvania subdivide from 3 to 67 counties?'
                    : '¿Cómo se subdividió Pensilvania de 3 a 67 condados?'}
                </h3>
                {language === 'en' ? (
                  <p className="text-xs text-[#F4F1EA]/85 leading-relaxed">
                    Successive <strong>migratory waves</strong> (English and
                    Welsh Quakers in the Delaware Valley,{' '}
                    <em>Pennsylvania Dutch</em> German farmers in the
                    Susquehanna Valley, and Scots-Irish pioneers across the
                    Alleghenies) demanded local courthouses and county seats
                    within a single day’s horseback ride. By{' '}
                    <strong>1787</strong> there were already{' '}
                    <strong>18 counties</strong>; in <strong>1800</strong> a
                    state act erected 10 new counties across the western
                    frontier at once, and during the 19th century the rise of{' '}
                    <strong>anthracite coal, railroads, oil, and steel</strong>{' '}
                    culminated with the 67th county (
                    <strong>Lackawanna</strong>, 1878).
                  </p>
                ) : (
                  <p className="text-xs text-[#F4F1EA]/85 leading-relaxed">
                    Las sucesivas <strong>oleadas migratorias</strong> (cuáqueros
                    ingleses y galeses en el Delaware, granjeros alemanes{' '}
                    <em>Pennsylvania Dutch</em> en el valle del Susquehanna y
                    pioneros escoceses-irlandeses en los Alleghenies) exigieron
                    tribunales y sedes de condado a menos de un día a caballo. En{' '}
                    <strong>1787</strong> existían ya <strong>18 condados</strong>;
                    en <strong>1800</strong> una ley estatal creó de golpe 10
                    nuevos condados en la frontera occidental, y durante el siglo
                    XIX el auge del <strong>carbón antracita, el ferrocarril, el
                    petróleo y el acero</strong> culminó la fragmentación con la
                    creación del condado número 67 (<strong>Lackawanna</strong>,
                    1878).
                  </p>
                )}
              </div>

              {/* Right 7 cols: Interactive Territory Selector & Subdivision Breakdown */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#A39E93] shrink-0 mr-1">
                    {language === 'en'
                      ? `Jurisdictions (${currentScenarioConfig.year}):`
                      : `Jurisdicciones (${currentScenarioConfig.year}):`}
                  </span>
                  {currentScenarioConfig.territories.map((terr) => {
                    const isSelected = activeTerritory?.id === terr.id;
                    return (
                      <button
                        key={terr.id}
                        type="button"
                        onClick={() => setSelectedTerritory(terr)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#1D3557]/85 text-[#F4F1EA] border-[#D4AF37]'
                            : 'bg-[#0D0F12]/70 text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: terr.fillColor }}
                        />
                        <span>{terr.name.replace(/\s*\(.*?\)/, '')}</span>
                        <span className="font-mono text-[10px] text-[#D4AF37] tabular-nums">
                          ({terr.modernCounties.length})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeTerritory && (
                  <div className="bg-[#0D0F12]/65 border border-[#C5A059]/25 rounded-lg p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#D4AF37]">
                        {activeTerritory.historicalTitle}
                      </h4>
                      <span className="text-[11px] font-mono text-[#A39E93] tabular-nums">
                        {language === 'en'
                          ? 'Historical Seat'
                          : 'Centro histórico'}
                        : {activeTerritory.seatOrCenter} ·{' '}
                        {language === 'en' ? 'Encompasses' : 'Engloba'}{' '}
                        <strong className="text-[#F4F1EA]">
                          {activeTerritory.modernCounties.length}
                        </strong>{' '}
                        {language === 'en'
                          ? 'modern counties'
                          : 'condados actuales'}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#F4F1EA]/90 leading-relaxed">
                      {activeTerritory.historicalSummary}{' '}
                      <span className="text-[#D4AF37]">
                        {activeTerritory.subdivisionStory}
                      </span>
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#C5A059]/15 flex items-center gap-1.5 flex-wrap text-[11px] text-[#A39E93]">
                      <span className="text-[#F4F1EA] font-medium">
                        {language === 'en'
                          ? 'Modern counties merged inside this polygon:'
                          : 'Condados actuales fusionados en este polígono:'}
                      </span>
                      <span>{activeTerritory.modernCounties.join(' · ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterCompare;
