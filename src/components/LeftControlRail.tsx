import React from 'react';
import {
  Map as MapIcon,
  MapPin,
  Sparkles,
  Bus,
  GraduationCap,
  X,
  ArrowLeftRight,
  RotateCcw,
  Layers,
  Check,
} from 'lucide-react';
import {
  PA_REGIONS,
  RegionId,
  HistoricalEra,
} from '../data/paCountiesData';
import {
  HISTORICAL_SCENARIOS,
  HistoricalScenarioId,
  HistoricalTerritoryDefinition,
} from '../data/historicalTerritoriesConfig';
import {
  HISTORICAL_EVENTS_DATA,
  HistoricalEventItem,
} from '../data/historicalEventsData';
import {
  HISTORICAL_ROUTES_DATA,
  HistoricalRouteItem,
} from '../data/historicalRoutesData';
import {
  PHMC_CATEGORIES,
  PHMC_MARKERS_DATA,
  PhmcCategory,
  PhmcMarkerRecord,
} from '../data/phmcMarkersData';
import { useTranslation } from '../context/LanguageContext';
import {
  getLocalizedEvent,
  getLocalizedRegion,
  PHMC_CATEGORY_TRANSLATIONS_EN,
} from '../i18n/translations';

export type LeftDrawerType =
  | 'territories'
  | 'layers'
  | 'ai'
  | 'trips'
  | 'teacher'
  | null;

interface LeftControlRailProps {
  activeDrawer: LeftDrawerType;
  onSelectDrawer: (drawer: Exclude<LeftDrawerType, null>) => void;
  onCloseDrawer: () => void;
  // 1. Territories & Comparison
  turfScenario: HistoricalScenarioId | 'none';
  onSelectTurfScenario: (scenario: HistoricalScenarioId | 'none') => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  // 2. Layers & PHMC Plaques
  showPhmcLayer: boolean;
  onTogglePhmcLayer: () => void;
  selectedPhmcCategory: PhmcCategory | 'all';
  onSelectPhmcCategory: (cat: PhmcCategory | 'all') => void;
  selectedPhmcMarker: PhmcMarkerRecord | null;
  onSelectPhmcMarker: (marker: PhmcMarkerRecord) => void;
  showEventsLayer: boolean;
  onToggleEventsLayer: () => void;
  selectedEvent: HistoricalEventItem | null;
  onSelectEvent: (event: HistoricalEventItem) => void;
  activeRoute: HistoricalRouteItem | null;
  onSelectRoute: (route: HistoricalRouteItem | null) => void;
  isLegendOpen: boolean;
  onToggleLegendOpen: () => void;
  selectedRegion: RegionId | 'all';
  onSelectRegion: (region: RegionId | 'all') => void;
  activeEra: HistoricalEra;
  highlightEraFrontier: boolean;
  onResetView: () => void;
  // 4. My Field Trips Badge Count
  fieldTripStopsCount: number;
  // 5. Teacher Mode
  isTeacherMode: boolean;
}

export const LeftControlRail: React.FC<LeftControlRailProps> = ({
  activeDrawer,
  onSelectDrawer,
  onCloseDrawer,
  turfScenario,
  onSelectTurfScenario,
  isCompareMode,
  onToggleCompareMode,
  showPhmcLayer,
  onTogglePhmcLayer,
  selectedPhmcCategory,
  onSelectPhmcCategory,
  selectedPhmcMarker,
  onSelectPhmcMarker,
  showEventsLayer,
  onToggleEventsLayer,
  selectedEvent,
  onSelectEvent,
  activeRoute,
  onSelectRoute,
  isLegendOpen,
  onToggleLegendOpen,
  selectedRegion,
  onSelectRegion,
  activeEra,
  highlightEraFrontier,
  onResetView,
  fieldTripStopsCount,
  isTeacherMode,
}) => {
  const { language, t } = useTranslation();

  const filteredPhmcMarkers =
    selectedPhmcCategory === 'all'
      ? PHMC_MARKERS_DATA
      : PHMC_MARKERS_DATA.filter((m) => m.category === selectedPhmcCategory);

  const activeLayersCount =
    (showPhmcLayer ? 1 : 0) +
    (showEventsLayer ? 1 : 0) +
    (activeRoute ? 1 : 0) +
    (isLegendOpen ? 1 : 0);

  const getPhmcCatLabel = (catId: PhmcCategory | 'all') => {
    if (language === 'en') {
      return PHMC_CATEGORY_TRANSLATIONS_EN[catId].shortLabel;
    }
    return (
      PHMC_CATEGORIES.find((c) => c.id === catId)?.shortLabel || 'Categoría'
    );
  };

  return (
    <>
      {/* Compact Vertical Tactile Rail (w-12) with 5 Primary Modules */}
      <nav
        aria-label={t.leftRail.railAria}
        className="fixed left-4 top-20 z-35 w-12 bg-[#0F1C30]/90 backdrop-blur-xl border border-[#C5A059]/30 rounded-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.78)] flex flex-col items-center gap-2 pointer-events-auto no-print"
      >
        {/* 1. 🗺️ Territories & Borders */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => onSelectDrawer('territories')}
            title={t.leftRail.territoriesTooltip}
            aria-label={t.leftRail.territoriesTooltip}
            aria-expanded={activeDrawer === 'territories'}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              activeDrawer === 'territories' ||
              turfScenario !== 'none' ||
              isCompareMode
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_12px_rgba(29,78,216,0.55)]'
                : 'bg-[#09111E]/80 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/60'
            }`}
          >
            <MapIcon className="w-4 h-4 text-[#D4AF37]" />
            {turfScenario !== 'none' && (
              <span className="absolute -top-1 -right-1 px-1 rounded-full bg-[#D4AF37] text-[#09111E] font-mono text-[8px] font-bold">
                {turfScenario}
              </span>
            )}
          </button>

          {/* Bilingual Hover Tooltip */}
          <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#09111E]/95 border border-[#D4AF37]/70 text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
            {t.leftRail.territoriesTooltip}
          </span>
        </div>

        {/* 2. 📍 Layers & PHMC Plaques */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => onSelectDrawer('layers')}
            title={t.leftRail.layersTooltip}
            aria-label={t.leftRail.layersTooltip}
            aria-expanded={activeDrawer === 'layers'}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              activeDrawer === 'layers'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_12px_rgba(29,78,216,0.55)]'
                : 'bg-[#09111E]/80 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/60'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            {activeLayersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E3A8A] border border-[#D4AF37] text-[#D4AF37] font-mono text-[9px] font-bold flex items-center justify-center tabular-nums">
                {activeLayersCount}
              </span>
            )}
          </button>

          <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#09111E]/95 border border-[#D4AF37]/70 text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
            {t.leftRail.layersTooltip}
          </span>
        </div>

        {/* 3. ✨ AI Guide (Voice & Text Assistant) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => onSelectDrawer('ai')}
            title={t.leftRail.aiGuideTooltip}
            aria-label={t.leftRail.aiGuideTooltip}
            aria-expanded={activeDrawer === 'ai'}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              activeDrawer === 'ai'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_14px_rgba(29,78,216,0.65)]'
                : 'bg-[#09111E]/80 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#09111E]/95 border border-[#D4AF37]/70 text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
            {t.leftRail.aiGuideTooltip}
          </span>
        </div>

        {/* 4. 🚌 My Field Trips (GPS Itinerary Planner with Golden Numeric Badge) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => onSelectDrawer('trips')}
            title={t.leftRail.fieldTripsTooltip(fieldTripStopsCount)}
            aria-label={t.leftRail.fieldTripsTooltip(fieldTripStopsCount)}
            aria-expanded={activeDrawer === 'trips'}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              activeDrawer === 'trips'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_14px_rgba(29,78,216,0.65)]'
                : fieldTripStopsCount > 0
                  ? 'bg-[#1E3A8A]/75 text-[#F8FAFC] border-[#D4AF37]/80 hover:bg-[#1D4ED8]'
                  : 'bg-[#09111E]/80 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/60'
            }`}
          >
            <Bus className="w-4 h-4 text-[#D4AF37]" />
            {fieldTripStopsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#09111E] border border-[#09111E] font-mono text-[9px] font-extrabold flex items-center justify-center tabular-nums shadow-sm">
                {fieldTripStopsCount}
              </span>
            )}
          </button>

          <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#09111E]/95 border border-[#D4AF37]/70 text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
            {t.leftRail.fieldTripsTooltip(fieldTripStopsCount)}
          </span>
        </div>

        <div className="w-6 border-t border-slate-700/60 my-0.5" />

        {/* 5. 🎓 Teacher Mode */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => onSelectDrawer('teacher')}
            title={t.leftRail.teacherModeTooltip}
            aria-label={t.leftRail.teacherModeTooltip}
            aria-pressed={isTeacherMode || activeDrawer === 'teacher'}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isTeacherMode || activeDrawer === 'teacher'
                ? 'bg-[#D4AF37] text-[#09111E] border-[#F8FAFC] shadow-[0_0_16px_rgba(212,175,55,0.55)]'
                : 'bg-[#09111E]/80 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/60'
            }`}
          >
            <GraduationCap
              className={`w-4 h-4 ${
                isTeacherMode || activeDrawer === 'teacher'
                  ? 'text-[#09111E]'
                  : 'text-[#D4AF37]'
              }`}
            />
          </button>

          <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#09111E]/95 border border-[#D4AF37]/70 text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
            {t.leftRail.teacherModeTooltip}
          </span>
        </div>
      </nav>

      {/* DOCKED LEFT DRAWER 1: TERRITORIES & BORDERS */}
      {activeDrawer === 'territories' && (
        <aside
          aria-label={t.leftRail.territoriesDrawerTitle}
          className="fixed left-20 top-20 z-30 w-80 sm:w-96 max-h-[75vh] bg-[#0F1C30]/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F8FAFC] pointer-events-auto no-print"
        >
          <div className="px-4 py-3 bg-[#09111E]/90 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <h3 className="font-serif text-sm font-bold text-[#F8FAFC] truncate">
                {t.leftRail.territoriesDrawerTitle}
              </h3>
            </div>
            <button
              type="button"
              onClick={onCloseDrawer}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg bg-[#09111E]/80 border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1">
            <div className="text-[11px] text-[#94A3B8] leading-snug">
              {t.leftRail.territoriesIntro}
            </div>

            <div className="space-y-1.5">
              {(
                [
                  {
                    id: 'none',
                    title: t.map.pill67Counties,
                    subtitle: t.leftRail.modern67Sub,
                  },
                  {
                    id: '1682',
                    title: t.map.pill1682Penn,
                    subtitle: t.leftRail.penn1682Sub,
                  },
                  {
                    id: '1787',
                    title: t.map.pill1787Constitution,
                    subtitle: t.leftRail.const1787Sub,
                  },
                ] as const
              ).map((item) => {
                const isSelected = !isCompareMode && turfScenario === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isCompareMode) {
                        onToggleCompareMode();
                      }
                      onSelectTurfScenario(item.id);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1D4ED8]/85 text-[#F8FAFC] border-[#D4AF37] shadow-sm'
                        : 'bg-[#09111E]/75 hover:bg-[#1E3A8A]/45 text-[#F8FAFC] border-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#CBD5E1]/80 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Split-Curtain Compare Mode Launcher */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onToggleCompareMode();
                  onCloseDrawer();
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                  isCompareMode
                    ? 'bg-[#B22234] text-[#F8FAFC] border-[#D4AF37]'
                    : 'bg-[#B22234]/25 hover:bg-[#B22234]/80 text-[#D4AF37] hover:text-[#F8FAFC] border-[#D4AF37]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t.header.compareBtn}</span>
                </div>
                {isCompareMode && <Check className="w-4 h-4" />}
              </button>
            </div>

            {/* Merged Territories Breakdown when 1682 or 1787 is active */}
            {turfScenario !== 'none' && (
              <div className="pt-2.5 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                  {t.map.mergedLegendTitle(turfScenario)}
                </div>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {HISTORICAL_SCENARIOS[turfScenario].territories.map(
                    (tItem: HistoricalTerritoryDefinition) => (
                      <div
                        key={tItem.id}
                        className="px-2.5 py-1.5 rounded-lg bg-[#09111E]/75 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-xs shrink-0 border border-[#D4AF37]/60"
                            style={{ backgroundColor: tItem.fillColor }}
                          />
                          <span className="truncate text-[#F8FAFC]">
                            {tItem.name}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#D4AF37] tabular-nums shrink-0">
                          {tItem.modernCounties.length}c
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* DOCKED LEFT DRAWER 2: LAYERS & PHMC PLAQUES */}
      {activeDrawer === 'layers' && (
        <aside
          aria-label={t.leftRail.layersDrawerTitle}
          className="fixed left-20 top-20 z-30 w-80 sm:w-96 max-h-[75vh] bg-[#0F1C30]/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden text-[#F8FAFC] divide-y divide-slate-800/80 flex flex-col pointer-events-auto no-print"
        >
          <div className="px-4 py-3 bg-[#09111E]/90 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <h3 className="font-serif text-sm font-bold text-[#F8FAFC] truncate">
                {t.leftRail.layersDrawerTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onResetView();
                  onCloseDrawer();
                }}
                className="text-[11px] text-[#94A3B8] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onCloseDrawer}
                aria-label="Close drawer"
                className="p-1.5 rounded-lg bg-[#09111E]/80 border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/80 flex-1">
            {/* Section A: Official PHMC Blue Plaques + Category Filter */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {t.header.phmcToggle} ({filteredPhmcMarkers.length}/
                  {PHMC_MARKERS_DATA.length})
                </span>
                <button
                  type="button"
                  onClick={onTogglePhmcLayer}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    showPhmcLayer
                      ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37]'
                      : 'bg-[#09111E] text-[#94A3B8] border-slate-700'
                  }`}
                >
                  {showPhmcLayer ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {PHMC_CATEGORIES.map((catMeta) => {
                  const isSelected = selectedPhmcCategory === catMeta.id;
                  return (
                    <button
                      key={catMeta.id}
                      type="button"
                      onClick={() => onSelectPhmcCategory(catMeta.id)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#1E3A8A] text-[#D4AF37] border-[#D4AF37] font-semibold'
                          : 'bg-[#09111E] text-[#94A3B8] hover:text-[#F8FAFC] border-slate-800'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: catMeta.badgeColor }}
                      />
                      <span>{getPhmcCatLabel(catMeta.id)}</span>
                    </button>
                  );
                })}
              </div>

              <select
                value={selectedPhmcMarker?.id || ''}
                onChange={(e) => {
                  const marker = PHMC_MARKERS_DATA.find(
                    (m) => m.id === e.target.value
                  );
                  if (marker) {
                    onSelectPhmcMarker(marker);
                    onCloseDrawer();
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-[#09111E] border border-slate-700 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">
                  {t.header.allCategoriesLabel(filteredPhmcMarkers.length)}
                </option>
                {filteredPhmcMarkers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.eventYear} · {m.title} ({m.countyName})
                  </option>
                ))}
              </select>
            </div>

            {/* Section B: Milestones & Battles */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {t.header.milestonesToggle}
                </span>
                <button
                  type="button"
                  onClick={onToggleEventsLayer}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    showEventsLayer
                      ? 'bg-[#B22234] text-[#F8FAFC] border-[#D4AF37]'
                      : 'bg-[#09111E] text-[#94A3B8] border-slate-700'
                  }`}
                >
                  {showEventsLayer ? 'ON' : 'OFF'}
                </button>
              </div>

              <select
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const ev = HISTORICAL_EVENTS_DATA.find(
                    (item) => item.id === e.target.value
                  );
                  if (ev) {
                    onSelectEvent(ev);
                    onCloseDrawer();
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-[#09111E] border border-slate-700 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">{t.header.goToMilestone}</option>
                {HISTORICAL_EVENTS_DATA.map((ev) => {
                  const locEv = getLocalizedEvent(ev, language);
                  return (
                    <option key={ev.id} value={ev.id}>
                      {ev.year} · {locEv.shortTitle} ({ev.countyName})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Section C: Animated Historical Routes */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {t.header.routesBtn}
                </span>
                {activeRoute && (
                  <button
                    type="button"
                    onClick={() => onSelectRoute(null)}
                    className="text-[11px] text-[#B22234] hover:underline font-medium cursor-pointer"
                  >
                    {t.header.deactivateRoute}
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {HISTORICAL_ROUTES_DATA.map((route) => {
                  const isSelected = activeRoute?.id === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => {
                        onSelectRoute(isSelected ? null : route);
                        onCloseDrawer();
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#1E3A8A]/80 text-[#F8FAFC] border-[#D4AF37]'
                          : 'bg-[#09111E]/70 text-[#94A3B8] hover:text-[#F8FAFC] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: route.strokeColor }}
                        />
                        <span className="truncate font-medium">
                          {route.shortTitle}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#D4AF37] shrink-0">
                        {route.eraLabel.split(' · ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section D: Historical Regions Legend & Filter */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {t.header.regionsLegendToggle}
                </span>
                <button
                  type="button"
                  onClick={onToggleLegendOpen}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    isLegendOpen
                      ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37]'
                      : 'bg-[#09111E] text-[#94A3B8] border-slate-700'
                  }`}
                >
                  {isLegendOpen ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => onSelectRegion('all')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium cursor-pointer border ${
                    selectedRegion === 'all'
                      ? 'bg-[#D4AF37] text-[#09111E] font-bold border-[#F8FAFC]'
                      : 'bg-[#09111E] text-[#94A3B8] border-slate-800'
                  }`}
                >
                  {t.header.allRegionsBtn}
                </button>
                {Object.values(PA_REGIONS).map((reg) => {
                  const isActive = selectedRegion === reg.id;
                  const locReg = getLocalizedRegion(reg.id, language);
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() =>
                        onSelectRegion(isActive ? 'all' : reg.id)
                      }
                      className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 cursor-pointer border ${
                        isActive
                          ? 'bg-[#1E3A8A] text-[#F8FAFC] border-[#D4AF37]'
                          : 'bg-[#09111E] text-[#94A3B8] hover:text-[#F8FAFC] border-slate-800'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-xs"
                        style={{ backgroundColor: reg.badgeColor }}
                      />
                      <span>{locReg.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {highlightEraFrontier && activeEra.id !== 'present' && (
                <div className="pt-1.5 flex items-center gap-2 text-[10px] text-[#94A3B8]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#09111E] border border-slate-600 shrink-0" />
                  <span className="truncate">
                    {t.map.notEstablishedIn(activeEra.yearLabel)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default LeftControlRail;
