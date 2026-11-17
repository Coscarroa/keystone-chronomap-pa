/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import InfoPanel from './components/InfoPanel';
import Timeline from './components/Timeline';
import CompassRose from './components/CompassRose';
import CountyCatalogModal from './components/CountyCatalogModal';
import TimelineTransitionOverlay from './components/TimelineTransitionOverlay';
import BeforeAfterCompare from './components/BeforeAfterCompare';
import HistoricalMapsGallery from './components/HistoricalMapsGallery';
import LeaderDetailModal from './components/LeaderDetailModal';
import WelcomeGuideModal from './components/WelcomeGuideModal';
import WhiteboardCanvasOverlay, {
  WhiteboardColor,
  WhiteboardTool,
} from './components/WhiteboardCanvasOverlay';
import WorksheetGeneratorModal from './components/WorksheetGeneratorModal';
import ClassroomTriviaModal from './components/ClassroomTriviaModal';
import FieldTripBuilder, {
  FIELD_TRIP_STORAGE_KEY,
  FieldTripStop,
  MAX_FIELD_TRIP_STOPS,
} from './components/FieldTripBuilder';
import SupportModal from './components/SupportModal';
import AboutOutreachModal from './components/AboutOutreachModal';
import KeystoneAIAssistant from './components/KeystoneAIAssistant';
import {
  LegalFooter,
  LegalModal,
  LegalModalType,
} from './components/LegalFooterModals';
import { AIUIAction } from './services/aiAgentBrain';
import { MapChronologyFocusPayload } from './components/ChronologyDrawer';
import { HistoricalScenarioId } from './data/historicalTerritoriesConfig';
import { LanguageProvider } from './context/LanguageContext';
import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HISTORICAL_ERAS,
  HistoricalEra,
  PA_COUNTIES_DATA,
  RegionId,
} from './data/paCountiesData';
import {
  HISTORICAL_EVENTS_DATA,
  HistoricalEventItem,
} from './data/historicalEventsData';
import { HistoricalRouteItem } from './data/historicalRoutesData';
import { VintageMapRecord } from './data/vintageMapsData';
import { PrimarySourceCapsule } from './data/primarySourcesData';
import {
  PHMC_MARKERS_DATA,
  PhmcCategory,
  PhmcMarkerRecord,
} from './data/phmcMarkersData';
import {
  fetchLeadersWikiData,
  PALeaderRecord,
  PA_LEADERS_DATA,
  WikiLeaderEnrichment,
} from './services/paLeadersService';
import {
  loadPACountiesGeoJSON,
  PACountiesGeoJSON,
} from './utils/geoUtils';

const LazyTeacherToolbar = React.lazy(
  () => import('./components/TeacherToolbar')
);
const LazyDigitalEncyclopediaModal = React.lazy(
  () => import('./components/DigitalEncyclopediaModal')
);

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const GUIDE_SEEN_STORAGE_KEY = 'keystone_guide_seen';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [geoData, setGeoData] = useState<PACountiesGeoJSON | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<RegionId | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<CountyRecord | null>(
    PA_COUNTIES_DATA['Philadelphia'] || null
  );
  const [activeEra, setActiveEra] = useState<HistoricalEra>(
    HISTORICAL_ERAS[5] // Default to 'Actualidad' (67 Counties)
  );
  const [highlightEraFrontier, setHighlightEraFrontier] =
    useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  // Module 1: Historical Milestones & Battles
  const [showEventsLayer, setShowEventsLayer] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] =
    useState<HistoricalEventItem | null>(null);

  // Module 2: Animated Historical Routes
  const [activeRoute, setActiveRoute] =
    useState<HistoricalRouteItem | null>(null);

  // Module 3: Vintage Maps Gallery & GroundOverlay
  const [isMapsGalleryOpen, setIsMapsGalleryOpen] = useState<boolean>(false);
  const [activeOverlayMap, setActiveOverlayMap] =
    useState<VintageMapRecord | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75);

  // Module 4: Historical Figures & Governors via Wikipedia MediaWiki API
  const [wikiLeadersMap, setWikiLeadersMap] = useState<
    Record<string, WikiLeaderEnrichment>
  >({});
  const [isLeadersModalOpen, setIsLeadersModalOpen] = useState<boolean>(false);
  const [selectedLeader, setSelectedLeader] = useState<PALeaderRecord | null>(
    PA_LEADERS_DATA[0]
  );

  // Phase 4: Welcome Guide & Classroom Mode (EdTech)
  const [isWelcomeGuideOpen, setIsWelcomeGuideOpen] = useState<boolean>(false);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isSmartboardScale, setIsSmartboardScale] = useState<boolean>(false);

  // Whiteboard Canvas State
  const [whiteboardTool, setWhiteboardTool] =
    useState<WhiteboardTool>('navigate');
  const [whiteboardColor, setWhiteboardColor] =
    useState<WhiteboardColor>('#D4AF37');
  const [whiteboardStrokeWidth, setWhiteboardStrokeWidth] =
    useState<number>(5);
  const [whiteboardStrokeCount, setWhiteboardStrokeCount] =
    useState<number>(0);
  const [whiteboardClearTrigger, setWhiteboardClearTrigger] =
    useState<number>(0);
  const [whiteboardUndoTrigger, setWhiteboardUndoTrigger] =
    useState<number>(0);

  // PDE Worksheet & Classroom Trivia Modals
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] =
    useState<boolean>(false);
  const [worksheetInitialSource, setWorksheetInitialSource] =
    useState<PrimarySourceCapsule | null>(null);
  const [isTriviaModalOpen, setIsTriviaModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isAboutOutreachOpen, setIsAboutOutreachOpen] =
    useState<boolean>(false);
  const [isComicEncyclopediaOpen, setIsComicEncyclopediaOpen] =
    useState<boolean>(false);
  const [encyclopediaInitialMode, setEncyclopediaInitialMode] = useState<
    '2d_comics' | '3d_stage'
  >('2d_comics');
  const [activeLegalModal, setActiveLegalModal] =
    useState<LegalModalType>(null);

  // Phase 6: PHMC Official Blue-and-Gold Markers & Field Trip Builder
  const [showPhmcLayer, setShowPhmcLayer] = useState<boolean>(true);
  const [selectedPhmcCategory, setSelectedPhmcCategory] = useState<
    PhmcCategory | 'all'
  >('all');
  const [selectedPhmcMarker, setSelectedPhmcMarker] =
    useState<PhmcMarkerRecord | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [chronologyFocusTarget, setChronologyFocusTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    turfScenario?: HistoricalScenarioId | 'none';
    timestamp: number;
  } | null>(null);

  const [fieldTripStops, setFieldTripStops] = useState<FieldTripStop[]>(() => {
    try {
      const saved = localStorage.getItem(FIELD_TRIP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_FIELD_TRIP_STOPS);
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return [];
  });

  // Sync Field Trip stops to localStorage ('keystone_field_trip')
  useEffect(() => {
    try {
      localStorage.setItem(
        FIELD_TRIP_STORAGE_KEY,
        JSON.stringify(fieldTripStops)
      );
    } catch {
      // Ignore storage write errors
    }
  }, [fieldTripStops]);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () =>
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Auto-open Welcome Guide after 900ms only on first visit
  useEffect(() => {
    let timer: number | undefined;
    try {
      const seen = localStorage.getItem(GUIDE_SEEN_STORAGE_KEY);
      if (!seen) {
        timer = window.setTimeout(() => {
          setIsWelcomeGuideOpen(true);
        }, 900);
      }
    } catch {
      // Ignore storage access errors
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const handleCloseWelcomeGuide = useCallback(() => {
    setIsWelcomeGuideOpen(false);
    try {
      localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage write errors
    }
  }, []);

  // Apply or remove +18% Smartboard projection typography scale on root <html>
  useEffect(() => {
    const rootEl = document.documentElement;
    if (isSmartboardScale && isTeacherMode) {
      rootEl.classList.add('smartboard-scale');
    } else {
      rootEl.classList.remove('smartboard-scale');
    }
    return () => {
      rootEl.classList.remove('smartboard-scale');
    };
  }, [isSmartboardScale, isTeacherMode]);

  // Load Pennsylvania 67 Counties GeoJSON
  useEffect(() => {
    let mounted = true;
    setIsLoadingGeo(true);
    loadPACountiesGeoJSON()
      .then((data) => {
        if (!mounted) return;
        setGeoData(data);
        setIsLoadingGeo(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setGeoError(
          err instanceof Error
            ? err.message
            : 'Error al cargar las fronteras GeoJSON de Pensilvania.'
        );
        setIsLoadingGeo(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load Wikipedia MediaWiki portraits & summaries (cached in localStorage)
  useEffect(() => {
    let mounted = true;
    fetchLeadersWikiData()
      .then((data) => {
        if (mounted) {
          setWikiLeadersMap(data);
        }
      })
      .catch(() => {
        // Resilient fallback handled inside LeaderPortraitAvatar
      });
    return () => {
      mounted = false;
    };
  }, []);

  const foundedCountInEra = useMemo(() => {
    return ALL_COUNTIES_LIST.filter((c) => c.founded <= activeEra.cutoffYear)
      .length;
  }, [activeEra]);

  const handleSelectRegion = useCallback((region: RegionId | 'all') => {
    setSelectedRegion(region);
    setSelectedCounty(null);
  }, []);

  const handleSelectCounty = useCallback((county: CountyRecord | null) => {
    setSelectedCounty(county);
  }, []);

  const handleSelectEra = useCallback((era: HistoricalEra) => {
    setActiveEra(era);
    setHighlightEraFrontier(true);
  }, []);

  const handleSelectEvent = useCallback(
    (event: HistoricalEventItem | null) => {
      if (!event) {
        setSelectedEvent(null);
        return;
      }
      setShowEventsLayer(true);
      setSelectedPhmcMarker(null);
      setSelectedEvent(event);
      if (
        activeEra.id !== 'present' &&
        !event.eraIds.includes(activeEra.id) &&
        event.eraIds.length > 0
      ) {
        const targetEra = HISTORICAL_ERAS.find((e) => e.id === event.eraIds[0]);
        if (targetEra) {
          setActiveEra(targetEra);
        }
      }
    },
    [activeEra]
  );

  const handleSelectPhmcMarker = useCallback(
    (marker: PhmcMarkerRecord | null) => {
      if (!marker) {
        setSelectedPhmcMarker(null);
        return;
      }
      setShowPhmcLayer(true);
      setSelectedEvent(null);
      if (
        selectedPhmcCategory !== 'all' &&
        selectedPhmcCategory !== marker.category
      ) {
        setSelectedPhmcCategory('all');
      }
      setSelectedPhmcMarker(marker);
    },
    [selectedPhmcCategory]
  );

  const handleAddFieldTripStop = useCallback((stop: FieldTripStop) => {
    setFieldTripStops((prev) => {
      if (prev.some((s) => s.id === stop.id)) return prev;
      if (prev.length >= MAX_FIELD_TRIP_STOPS) return prev;
      return [...prev, stop];
    });
  }, []);

  const handleRemoveFieldTripStop = useCallback((stopId: string) => {
    setFieldTripStops((prev) => prev.filter((s) => s.id !== stopId));
  }, []);

  const handleMoveFieldTripStop = useCallback(
    (index: number, direction: 'up' | 'down') => {
      setFieldTripStops((prev) => {
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const temp = copy[index];
        copy[index] = copy[targetIdx];
        copy[targetIdx] = temp;
        return copy;
      });
    },
    []
  );

  const handleClearFieldTripStops = useCallback(() => {
    setFieldTripStops([]);
  }, []);

  const handleFocusStopOnMap = useCallback(
    (stop: FieldTripStop) => {
      if (stop.sourceType === 'phmc') {
        const rawId = stop.id.replace(/^phmc-/, '');
        const found = PHMC_MARKERS_DATA.find((m) => m.id === rawId);
        if (found) {
          handleSelectPhmcMarker(found);
          return;
        }
      }
      if (stop.sourceType === 'event') {
        const rawId = stop.id.replace(/^event-/, '');
        const foundEv = HISTORICAL_EVENTS_DATA.find((e) => e.id === rawId);
        if (foundEv) {
          handleSelectEvent(foundEv);
          return;
        }
      }
      const countyRec = PA_COUNTIES_DATA[stop.countyName];
      if (countyRec) {
        handleSelectCounty(countyRec);
      }
    },
    [handleSelectPhmcMarker, handleSelectEvent, handleSelectCounty]
  );

  const handleOpenLeaderDetail = useCallback((leader: PALeaderRecord) => {
    setSelectedLeader(leader);
    setIsLeadersModalOpen(true);
  }, []);

  const handleApplyVintageOverlay = useCallback((vmap: VintageMapRecord) => {
    setActiveOverlayMap(vmap);
    setIsMapsGalleryOpen(false);
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedCounty(null);
    setSelectedEvent(null);
    setSelectedPhmcMarker(null);
    setSelectedRegion('all');
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <LanguageProvider>
      <div className="app-root-shell relative w-full h-screen overflow-hidden print:h-auto print:overflow-visible bg-[#09111E] text-[#F8FAFC]">
        {/* GMP Demo Key Quota Banner */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm no-print">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          language="en"
          region="US"
        >
          {/* Floating Header with Region Filter, Quick County Search, Compare Mode, Historical Modules, Classroom Mode & EN/ES Switcher */}
          <Header
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            selectedCounty={selectedCounty}
            onSelectCounty={(county) => handleSelectCounty(county)}
            onResetView={handleResetView}
            activeEra={activeEra}
            activeEraCount={foundedCountInEra}
            activeEraLabel={activeEra.yearLabel}
            onToggleCatalog={() => setIsCatalogOpen(true)}
            isCompareMode={isCompareMode}
            onToggleCompareMode={() => setIsCompareMode((prev) => !prev)}
            showEventsLayer={showEventsLayer}
            onToggleEventsLayer={() => setShowEventsLayer((prev) => !prev)}
            selectedEvent={selectedEvent}
            onSelectEvent={(ev) => handleSelectEvent(ev)}
            activeRoute={activeRoute}
            onSelectRoute={(route) => setActiveRoute(route)}
            activeOverlayMap={activeOverlayMap}
            onOpenMapsGallery={() => setIsMapsGalleryOpen(true)}
            onOpenLeadersModal={() => setIsLeadersModalOpen(true)}
            onOpenWelcomeGuide={() => setIsWelcomeGuideOpen(true)}
            isTeacherMode={isTeacherMode}
            onToggleTeacherMode={() => setIsTeacherMode((prev) => !prev)}
            showPhmcLayer={showPhmcLayer}
            onTogglePhmcLayer={() => setShowPhmcLayer((prev) => !prev)}
            selectedPhmcCategory={selectedPhmcCategory}
            onSelectPhmcCategory={(cat) => {
              setShowPhmcLayer(true);
              setSelectedPhmcCategory(cat);
            }}
            selectedPhmcMarker={selectedPhmcMarker}
            onSelectPhmcMarker={(marker) => handleSelectPhmcMarker(marker)}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
            onOpenAboutOutreachModal={() => setIsAboutOutreachOpen(true)}
            onOpenComicEncyclopedia={() => {
              setEncyclopediaInitialMode('2d_comics');
              setIsComicEncyclopediaOpen(true);
            }}
            isLegendOpen={isLegendOpen}
            onToggleLegendOpen={() => setIsLegendOpen((prev) => !prev)}
          />

          {isCompareMode ? (
            /* Interactive Before vs. Today Split-Curtain Comparison Mode */
            <BeforeAfterCompare
              geoData={geoData}
              onCloseCompare={() => setIsCompareMode(false)}
              initialScenario={activeEra.id === '1776' ? '1787' : '1682'}
            />
          ) : (
            <>
              {/* Main Interactive Cartography Canvas */}
              <MapContainer
                geoData={geoData}
                isLoadingGeo={isLoadingGeo}
                geoError={geoError}
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
                selectedCounty={selectedCounty}
                onSelectCounty={handleSelectCounty}
                activeEra={activeEra}
                highlightEraFrontier={highlightEraFrontier}
                resetTrigger={resetTrigger}
                showEventsLayer={showEventsLayer}
                selectedEvent={selectedEvent}
                onSelectEvent={handleSelectEvent}
                activeRoute={activeRoute}
                onCloseRoute={() => setActiveRoute(null)}
                activeOverlayMap={activeOverlayMap}
                overlayOpacity={overlayOpacity}
                onChangeOverlayOpacity={setOverlayOpacity}
                onRemoveOverlayMap={() => setActiveOverlayMap(null)}
                onOpenMapsGallery={() => setIsMapsGalleryOpen(true)}
                showPhmcLayer={showPhmcLayer}
                selectedPhmcCategory={selectedPhmcCategory}
                selectedPhmcMarker={selectedPhmcMarker}
                onSelectPhmcMarker={handleSelectPhmcMarker}
                fieldTripStops={fieldTripStops}
                onAddFieldTripStop={handleAddFieldTripStop}
                isLegendOpen={isLegendOpen}
                onToggleLegendOpen={() => setIsLegendOpen((prev) => !prev)}
                chronologyFocusTarget={chronologyFocusTarget}
              />

              {/* Touch/Mouse Interactive Whiteboard Canvas Overlay (active in Classroom Mode) */}
              <WhiteboardCanvasOverlay
                isActive={isTeacherMode}
                activeTool={whiteboardTool}
                activeColor={whiteboardColor}
                strokeWidth={whiteboardStrokeWidth}
                clearTrigger={whiteboardClearTrigger}
                undoTrigger={whiteboardUndoTrigger}
                onStrokeCountChange={setWhiteboardStrokeCount}
              />

              {/* Lazy-Loaded Teacher Toolbar (Classroom Mode) */}
              {isTeacherMode && (
                <Suspense fallback={null}>
                  <LazyTeacherToolbar
                    isSmartboardScale={isSmartboardScale}
                    onToggleSmartboardScale={() =>
                      setIsSmartboardScale((prev) => !prev)
                    }
                    activeTool={whiteboardTool}
                    onSelectTool={setWhiteboardTool}
                    activeColor={whiteboardColor}
                    onSelectColor={setWhiteboardColor}
                    strokeWidth={whiteboardStrokeWidth}
                    onChangeStrokeWidth={setWhiteboardStrokeWidth}
                    strokeCount={whiteboardStrokeCount}
                    onUndoStroke={() =>
                      setWhiteboardUndoTrigger((prev) => prev + 1)
                    }
                    onClearWhiteboard={() =>
                      setWhiteboardClearTrigger((prev) => prev + 1)
                    }
                    onOpenWorksheetModal={(initialSource) => {
                      if (initialSource) {
                        setWorksheetInitialSource(initialSource);
                      }
                      setIsWorksheetModalOpen(true);
                    }}
                    onOpenTriviaModal={() => setIsTriviaModalOpen(true)}
                    onSelectCounty={(county) => handleSelectCounty(county)}
                    onCloseTeacherMode={() => {
                      setIsTeacherMode(false);
                      setWhiteboardTool('navigate');
                    }}
                  />
                </Suspense>
              )}

              {/* Atmospheric Transition Glaze & 900ms Typographic Era Seal */}
              <TimelineTransitionOverlay activeEra={activeEra} />

              {/* Minimalist Archival SVG Compass Rose */}
              <CompassRose />

              {/* County Historical & Economic Dossier Panel with MediaWiki Portraits, Milestones, PHMC Plaques & Primary Sources */}
              <InfoPanel
                county={selectedCounty}
                activeEra={activeEra}
                onClose={() => setSelectedCounty(null)}
                onSelectCounty={(county) => handleSelectCounty(county)}
                onSelectRegion={(region) => {
                  setSelectedRegion(region);
                }}
                wikiLeadersMap={wikiLeadersMap}
                onSelectLeader={handleOpenLeaderDetail}
                onSelectEvent={(ev) => handleSelectEvent(ev)}
                onSelectPhmcMarker={(marker) => handleSelectPhmcMarker(marker)}
                fieldTripStops={fieldTripStops}
                onAddFieldTripStop={handleAddFieldTripStop}
                onOpen3DStage={(countyName) => {
                  if (PA_COUNTIES_DATA[countyName]) {
                    setSelectedCounty(PA_COUNTIES_DATA[countyName]);
                  }
                  setEncyclopediaInitialMode('3d_stage');
                  setIsComicEncyclopediaOpen(true);
                }}
              />

              {/* Phase 6 Module 2: Floating Field Trip Itinerary Builder & Google Maps Multi-Stop Route Launcher */}
              <FieldTripBuilder
                stops={fieldTripStops}
                onAddStop={handleAddFieldTripStop}
                onRemoveStop={handleRemoveFieldTripStop}
                onMoveStop={handleMoveFieldTripStop}
                onClearStops={handleClearFieldTripStops}
                onFocusStopOnMap={handleFocusStopOnMap}
              />

              {/* Floating Bottom Chronological Bar (Taxonomic Selector + 6 Historical Eras) & Subtle Footer */}
              <Timeline
                activeEra={activeEra}
                onSelectEra={handleSelectEra}
                onSelectCounty={(county) => handleSelectCounty(county)}
                highlightEraFrontier={highlightEraFrontier}
                onToggleEraFrontier={() =>
                  setHighlightEraFrontier((prev) => !prev)
                }
                foundedCountInEra={foundedCountInEra}
                onOpenSupportModal={() => setIsSupportModalOpen(true)}
                onOpenAboutOutreachModal={() => setIsAboutOutreachOpen(true)}
                onLocateChronologyItem={(payload: MapChronologyFocusPayload) => {
                  if (
                    payload.countyName &&
                    PA_COUNTIES_DATA[payload.countyName] &&
                    !payload.turfScenario
                  ) {
                    setSelectedCounty(PA_COUNTIES_DATA[payload.countyName]);
                  } else if (payload.turfScenario && payload.turfScenario !== 'none') {
                    setSelectedCounty(null);
                  }
                  setChronologyFocusTarget({
                    lat: payload.lat,
                    lng: payload.lng,
                    zoom: payload.zoom,
                    turfScenario: payload.turfScenario,
                    timestamp: Date.now(),
                  });
                }}
              />
            </>
          )}

          {/* Complete 67-County Archival Index Modal */}
          <CountyCatalogModal
            isOpen={isCatalogOpen}
            onClose={() => setIsCatalogOpen(false)}
            onSelectCounty={(county) => handleSelectCounty(county)}
            activeEra={activeEra}
          />

          {/* Module 3: Public Domain Vintage Maps Gallery & Viewer Modal */}
          <HistoricalMapsGallery
            isOpen={isMapsGalleryOpen}
            onClose={() => setIsMapsGalleryOpen(false)}
            activeOverlayMap={activeOverlayMap}
            onActivateOverlay={handleApplyVintageOverlay}
          />

          {/* Module 4: Historical Figures & Governors MediaWiki Biographies Modal */}
          <LeaderDetailModal
            isOpen={isLeadersModalOpen}
            initialLeader={selectedLeader}
            wikiMap={wikiLeadersMap}
            activeEraId={activeEra.id}
            onClose={() => setIsLeadersModalOpen(false)}
            onSelectCounty={(county) => {
              setIsCompareMode(false);
              handleSelectCounty(county);
            }}
          />

          {/* Phase 4.1: 5-Step Interactive Welcome Guide Modal */}
          <WelcomeGuideModal
            isOpen={isWelcomeGuideOpen}
            onClose={handleCloseWelcomeGuide}
            onOpenCompareMode={() => setIsCompareMode(true)}
            onOpenMapsGallery={() => setIsMapsGalleryOpen(true)}
            onActivateTeacherMode={() => setIsTeacherMode(true)}
          />

          {/* Phase 4.4: Printable PDE 8.2 Academic Standards Worksheet Generator Modal */}
          <WorksheetGeneratorModal
            isOpen={isWorksheetModalOpen}
            onClose={() => setIsWorksheetModalOpen(false)}
            selectedCounty={selectedCounty}
            activeEra={activeEra}
            initialPrimarySource={worksheetInitialSource}
          />

          {/* Phase 4.5: Classroom Trivia Challenge Modal (Solo & Team Duel Modes) */}
          <ClassroomTriviaModal
            isOpen={isTriviaModalOpen}
            onClose={() => setIsTriviaModalOpen(false)}
            onSelectCounty={(county) => {
              setIsCompareMode(false);
              handleSelectCounty(county);
            }}
          />

          {/* Donations & Patronage Support Modal (Zelle, Cash App & Crypto) */}
          <SupportModal
            isOpen={isSupportModalOpen}
            onClose={() => setIsSupportModalOpen(false)}
          />

          {/* Phase 12: Institutional Presentation & Pennsylvania Outreach Modal */}
          <AboutOutreachModal
            isOpen={isAboutOutreachOpen}
            onClose={() => setIsAboutOutreachOpen(false)}
            onActivateTeacherMode={() => setIsTeacherMode(true)}
            onOpenCountyCatalog={() => setIsCatalogOpen(true)}
          />

          {/* Phase 13 & 14: Lazy-Loaded Illustrated Cartoon Encyclopedia, 3D Historical Figures Stage & PDF Exporter */}
          {isComicEncyclopediaOpen && (
            <Suspense fallback={null}>
              <LazyDigitalEncyclopediaModal
                isOpen={isComicEncyclopediaOpen}
                onClose={() => setIsComicEncyclopediaOpen(false)}
                onSelectRegion={(region) => handleSelectRegion(region)}
                onSelectEra={(era) => handleSelectEra(era)}
                onSelectCounty={(county) => {
                  setIsCompareMode(false);
                  handleSelectCounty(county);
                }}
                selectedCountyName={selectedCounty?.name || null}
                initialViewMode={encyclopediaInitialMode}
              />
            </Suspense>
          )}

          {/* Phase 15: Floating Voice & Text AI Guide with Map & Module Action Dispatcher */}
          <KeystoneAIAssistant
            selectedCounty={selectedCounty}
            activeEra={activeEra}
            isTeacherMode={isTeacherMode}
            isCompareMode={isCompareMode}
            onExecuteAction={(action: AIUIAction) => {
              switch (action.type) {
                case 'FLY_TO_COUNTY':
                  setIsCompareMode(false);
                  handleSelectCounty(action.county);
                  if (action.lat !== undefined && action.lng !== undefined) {
                    setChronologyFocusTarget({
                      lat: action.lat,
                      lng: action.lng,
                      zoom: action.zoom || 10,
                      timestamp: Date.now(),
                    });
                  }
                  break;
                case 'SELECT_ERA':
                  setIsCompareMode(false);
                  handleSelectEra(action.era);
                  break;
                case 'OPEN_COMPARE_MODE':
                  setIsCompareMode(true);
                  break;
                case 'OPEN_3D_STAGE':
                  if (
                    action.countyName &&
                    PA_COUNTIES_DATA[action.countyName]
                  ) {
                    setSelectedCounty(PA_COUNTIES_DATA[action.countyName]);
                  }
                  setEncyclopediaInitialMode('3d_stage');
                  setIsComicEncyclopediaOpen(true);
                  break;
                case 'OPEN_COMIC_ENCYCLOPEDIA':
                  setEncyclopediaInitialMode('2d_comics');
                  setIsComicEncyclopediaOpen(true);
                  break;
                case 'TOGGLE_TEACHER_MODE':
                  setIsTeacherMode(action.enable);
                  break;
                case 'OPEN_TRIVIA':
                  setIsTriviaModalOpen(true);
                  break;
                case 'OPEN_WORKSHEET':
                  setIsWorksheetModalOpen(true);
                  break;
                case 'OPEN_VINTAGE_MAPS':
                  setIsMapsGalleryOpen(true);
                  break;
                case 'OPEN_LEADERS_MODAL':
                  if (action.leader) {
                    setSelectedLeader(action.leader);
                  }
                  setIsLeadersModalOpen(true);
                  break;
                case 'OPEN_WELCOME_GUIDE':
                  setIsWelcomeGuideOpen(true);
                  break;
                case 'OPEN_CATALOG':
                  setIsCatalogOpen(true);
                  break;
                case 'SELECT_REGION':
                  setIsCompareMode(false);
                  handleSelectRegion(action.region);
                  break;
              }
            }}
          />

          {/* Discreet & Responsive Institutional Footer Bar */}
          <LegalFooter
            onOpenLegalModal={(type) => setActiveLegalModal(type)}
          />

          {/* Legal Modals: Terms of Use & Official Disclaimer + Privacy Policy */}
          <LegalModal
            activeModal={activeLegalModal}
            onClose={() => setActiveLegalModal(null)}
            onSwitchModal={(type) => setActiveLegalModal(type)}
          />
        </APIProvider>
      </div>
    </LanguageProvider>
  );
}
