import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  ChevronDown,
  Layers,
  Wrench,
  BookOpen,
  ArrowLeftRight,
  MapPin,
  Shield,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HistoricalEra,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';
import {
  HISTORICAL_EVENTS_DATA,
  HistoricalEventItem,
} from '../data/historicalEventsData';
import {
  HISTORICAL_ROUTES_DATA,
  HistoricalRouteItem,
} from '../data/historicalRoutesData';
import { VintageMapRecord } from '../data/vintageMapsData';
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

interface HeaderProps {
  selectedRegion: RegionId | 'all';
  onSelectRegion: (region: RegionId | 'all') => void;
  selectedCounty: CountyRecord | null;
  onSelectCounty: (county: CountyRecord) => void;
  onResetView: () => void;
  activeEra: HistoricalEra;
  activeEraCount: number;
  activeEraLabel: string;
  onToggleCatalog: () => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  // Module 1: Historical Milestones & Battles
  showEventsLayer: boolean;
  onToggleEventsLayer: () => void;
  selectedEvent: HistoricalEventItem | null;
  onSelectEvent: (event: HistoricalEventItem) => void;
  // Module 2: Animated Historical Routes
  activeRoute: HistoricalRouteItem | null;
  onSelectRoute: (route: HistoricalRouteItem | null) => void;
  // Module 3: Vintage Maps Gallery & GroundOverlay
  activeOverlayMap: VintageMapRecord | null;
  onOpenMapsGallery: () => void;
  // Module 4: Historical Figures & Governors via MediaWiki API
  onOpenLeadersModal: () => void;
  // Phase 4: Welcome Guide & Classroom Mode
  onOpenWelcomeGuide: () => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
  // Phase 6: PHMC Historical Markers & Category Filter
  showPhmcLayer: boolean;
  onTogglePhmcLayer: () => void;
  selectedPhmcCategory: PhmcCategory | 'all';
  onSelectPhmcCategory: (cat: PhmcCategory | 'all') => void;
  selectedPhmcMarker: PhmcMarkerRecord | null;
  onSelectPhmcMarker: (marker: PhmcMarkerRecord) => void;
  // Phase 7/8: Support Modal & Regions Legend Toggle
  onOpenSupportModal: () => void;
  onOpenAboutOutreachModal: () => void;
  onOpenComicEncyclopedia: () => void;
  isLegendOpen: boolean;
  onToggleLegendOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedCounty,
  onSelectCounty,
  onResetView,
  onToggleCatalog,
  isCompareMode,
  onToggleCompareMode,
  showEventsLayer,
  onToggleEventsLayer,
  selectedEvent,
  onSelectEvent,
  activeRoute,
  onSelectRoute,
  activeOverlayMap,
  onOpenMapsGallery,
  onOpenLeadersModal,
  onOpenWelcomeGuide,
  isTeacherMode,
  onToggleTeacherMode,
  showPhmcLayer,
  onTogglePhmcLayer,
  selectedPhmcCategory,
  onSelectPhmcCategory,
  selectedPhmcMarker,
  onSelectPhmcMarker,
  onOpenSupportModal,
  onOpenAboutOutreachModal,
  onOpenComicEncyclopedia,
  isLegendOpen,
  onToggleLegendOpen,
}) => {
  const { language, setLanguage, t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const layersMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const filteredPhmcMarkers = useMemo(() => {
    if (selectedPhmcCategory === 'all') return PHMC_MARKERS_DATA;
    return PHMC_MARKERS_DATA.filter((m) => m.category === selectedPhmcCategory);
  }, [selectedPhmcCategory]);

  // Universal Search: Filters Counties, Seats, Historical Milestones & PHMC Plaques
  const filteredCounties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list =
      selectedRegion === 'all'
        ? ALL_COUNTIES_LIST
        : ALL_COUNTIES_LIST.filter((c) => c.region === selectedRegion);

    if (!q) return list.slice(0, 8);
    return ALL_COUNTIES_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.countySeat.toLowerCase().includes(q) ||
        String(c.founded).includes(q)
    ).slice(0, 10);
  }, [searchQuery, selectedRegion]);

  const matchingSites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { events: [], plaques: [] };

    const events = HISTORICAL_EVENTS_DATA.filter((ev) => {
      const loc = getLocalizedEvent(ev, language);
      return (
        loc.title.toLowerCase().includes(q) ||
        loc.shortTitle.toLowerCase().includes(q) ||
        ev.countyName.toLowerCase().includes(q) ||
        String(ev.year).includes(q)
      );
    }).slice(0, 4);

    const plaques = PHMC_MARKERS_DATA.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.cityOrTown.toLowerCase().includes(q) ||
        m.countyName.toLowerCase().includes(q) ||
        String(m.eventYear).includes(q)
    ).slice(0, 5);

    return { events, plaques };
  }, [searchQuery, language]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCounties]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
      if (
        layersMenuRef.current &&
        !layersMenuRef.current.contains(target)
      ) {
        setIsLayersMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsSearchOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredCounties.length > 0 ? (prev + 1) % filteredCounties.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredCounties.length > 0
          ? (prev - 1 + filteredCounties.length) % filteredCounties.length
          : 0
      );
    } else if (e.key === 'Enter' && filteredCounties[highlightedIndex]) {
      e.preventDefault();
      const target = filteredCounties[highlightedIndex];
      onSelectCounty(target);
      setSearchQuery(target.name);
      setIsSearchOpen(false);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const getPhmcCatLabel = (catId: PhmcCategory | 'all') => {
    if (language === 'en') {
      return PHMC_CATEGORY_TRANSLATIONS_EN[catId].shortLabel;
    }
    return (
      PHMC_CATEGORIES.find((c) => c.id === catId)?.shortLabel || 'Categoría'
    );
  };

  const activeLayersCount =
    (showEventsLayer ? 1 : 0) +
    (showPhmcLayer ? 1 : 0) +
    (activeRoute ? 1 : 0) +
    (isLegendOpen ? 1 : 0);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#0F1C30]/85 backdrop-blur-xl border-b border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.65)] px-3 sm:px-5 flex items-center justify-between gap-3 no-print">
      {/* ZONE 1 (LEFT): Circular Brand Emblem + Title & Commonwealth Subtitle */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            onResetView();
          }}
          title={t.header.resetViewTitle}
          className="w-10 h-10 rounded-full bg-[#09111E] border-2 border-[#D4AF37]/80 flex items-center justify-center text-[#D4AF37] hover:bg-[#1E3A8A]/60 hover:border-[#F8FAFC] transition-all shrink-0 cursor-pointer shadow-md"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 3H18L20 9L16.5 21H7.5L4 9L6 3Z"
              stroke="currentColor"
              strokeWidth="1.7"
              fill="rgba(29, 78, 216, 0.35)"
            />
            <polygon
              points="12,7.5 13.2,10.2 16,10.5 13.9,12.4 14.5,15.2 12,13.7 9.5,15.2 10.1,12.4 8,10.5 10.8,10.2"
              fill="#D4AF37"
            />
          </svg>
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC] truncate">
              Keystone ChronoMap
            </h1>
            <Shield className="w-3.5 h-3.5 text-[#D4AF37] hidden sm:inline shrink-0" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37] truncate">
            {t.header.commonwealthSubtitle}
          </p>
        </div>
      </div>

      {/* ZONE 2 (CENTER): Clean Universal Search Input (County, Seat, or Historical Site) */}
      <div
        ref={searchContainerRef}
        className="relative w-44 sm:w-72 md:w-96 shrink-1"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.header.searchPlaceholder}
            aria-label={t.header.searchAriaLabel}
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-[#09111E]/90 border border-slate-700/70 rounded-full text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              aria-label={t.header.clearSearchAria}
              className="absolute right-3 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Universal Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-[#0F1C30]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-h-80 overflow-y-auto z-50 divide-y divide-slate-800/80">
            {filteredCounties.length === 0 &&
            matchingSites.events.length === 0 &&
            matchingSites.plaques.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#94A3B8]">
                {t.header.noCountiesFound(searchQuery)}
              </div>
            ) : (
              <>
                {filteredCounties.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-[#09111E]/80 text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                      {t.header.countiesGroupHeader}
                    </div>
                    {filteredCounties.map((county, idx) => {
                      const reg = PA_REGIONS[county.region];
                      const locReg = getLocalizedRegion(
                        county.region,
                        language
                      );
                      const isSelected = selectedCounty?.name === county.name;
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <button
                          key={county.fips}
                          type="button"
                          onClick={() => {
                            onSelectCounty(county);
                            setSearchQuery(county.name);
                            setIsSearchOpen(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full text-left px-3.5 py-2 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isHighlighted || isSelected
                              ? 'bg-[#1E3A8A]/65 text-[#F8FAFC]'
                              : 'hover:bg-[#09111E]/60 text-[#F8FAFC]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-serif text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                              <span className="truncate">
                                {county.name} County
                              </span>
                              <span
                                className="w-2 h-2 rounded-xs shrink-0"
                                style={{ backgroundColor: reg.badgeColor }}
                              />
                            </div>
                            <div className="text-[11px] text-[#94A3B8] truncate">
                              {t.header.seatLabel} {county.countySeat} ·{' '}
                              {locReg.shortName}
                            </div>
                          </div>
                          <span className="font-mono text-xs text-[#D4AF37] tabular-nums shrink-0">
                            {county.founded}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {(matchingSites.events.length > 0 ||
                  matchingSites.plaques.length > 0) && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-[#09111E]/80 text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                      {t.header.sitesGroupHeader}
                    </div>
                    {matchingSites.events.map((ev) => {
                      const locEv = getLocalizedEvent(ev, language);
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => {
                            onSelectEvent(ev);
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-[#1E3A8A]/50 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#F8FAFC] truncate flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#B22234] shrink-0" />
                              <span className="truncate">{locEv.title}</span>
                            </div>
                            <div className="text-[11px] text-[#94A3B8] truncate">
                              {ev.countyName} County · {locEv.dateLabel}
                            </div>
                          </div>
                          <span className="font-mono text-xs text-[#D4AF37] shrink-0">
                            {ev.year}
                          </span>
                        </button>
                      );
                    })}
                    {matchingSites.plaques.map((plaque) => (
                      <button
                        key={plaque.id}
                        type="button"
                        onClick={() => {
                          onSelectPhmcMarker(plaque);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#1E3A8A]/50 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#F8FAFC] truncate flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] border border-[#D4AF37] shrink-0" />
                            <span className="truncate">{plaque.title}</span>
                          </div>
                          <div className="text-[11px] text-[#94A3B8] truncate">
                            {plaque.cityOrTown} ({plaque.countyName} County)
                          </div>
                        </div>
                        <span className="font-mono text-xs text-[#D4AF37] shrink-0">
                          {plaque.eventYear}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ZONE 3 (RIGHT): Grouped Dropdowns ("Explore Layers ▾", "Archive & Tools ▾"), "🎓 Teacher Mode", "EN | ES" & "♥ Support" */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 1. Grouped Dropdown: "Explore Layers ▾" */}
        <div ref={layersMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLayersMenuOpen((prev) => !prev);
              setIsToolsMenuOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              isLayersMenuOpen
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37]'
                : 'bg-[#09111E]/85 text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/70 hover:border-[#D4AF37]/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden lg:inline">
              {t.header.exploreLayersBtn}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#1E3A8A] border border-[#D4AF37]/50 text-[10px] font-mono text-[#D4AF37]">
              {activeLayersCount}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {isLayersMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F1C30]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden z-50 divide-y divide-slate-800/80 max-h-[82vh] overflow-y-auto">
              <div className="px-4 py-2.5 bg-[#09111E]/90 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                  {t.header.layersMenuHeader}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetView();
                    setIsLayersMenuOpen(false);
                  }}
                  className="text-[11px] text-[#94A3B8] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Layer A: Milestones & Battles Toggle + Selector */}
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
                      setIsLayersMenuOpen(false);
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

              {/* Layer B: Animated Historical Routes */}
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
                          setIsLayersMenuOpen(false);
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

              {/* Layer C: Official PHMC Blue Plaques + Category Subfilter */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    {t.header.phmcToggle} (
                    {filteredPhmcMarkers.length}/{PHMC_MARKERS_DATA.length})
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
                      setIsLayersMenuOpen(false);
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

              {/* Layer D: Historical Regions Legend & Filter */}
              <div className="p-3.5 space-y-2">
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
              </div>
            </div>
          )}
        </div>

        {/* 2. Grouped Dropdown: "Archive & Tools ▾" */}
        <div ref={toolsMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsToolsMenuOpen((prev) => !prev);
              setIsLayersMenuOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              isToolsMenuOpen || isCompareMode || activeOverlayMap
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37]'
                : 'bg-[#09111E]/85 text-[#F8FAFC] hover:bg-[#1E3A8A]/60 border-slate-700/70 hover:border-[#D4AF37]/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden lg:inline">
              {t.header.archiveToolsBtn}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {isToolsMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0F1C30]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden z-50 divide-y divide-slate-800/80">
              <div className="px-4 py-2.5 bg-[#09111E]/90 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.header.toolsMenuHeader}
              </div>

              <div className="p-2 space-y-1">
                {/* Tool 1: Vintage Maps (Overlays) */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenMapsGallery();
                    setIsToolsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1E3A8A]/60 transition-colors flex items-center justify-between gap-2 text-xs font-medium text-[#F8FAFC] cursor-pointer"
                >
                  <span>{t.header.vintageMapsBtn}</span>
                  {activeOverlayMap && (
                    <span className="px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#09111E] font-mono text-[10px] font-bold">
                      {t.header.overlayActiveBadge}
                    </span>
                  )}
                </button>

                {/* Tool 2: Leaders & Governors */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenLeadersModal();
                    setIsToolsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1E3A8A]/60 transition-colors flex items-center justify-between gap-2 text-xs font-medium text-[#F8FAFC] cursor-pointer"
                >
                  <span>{t.header.leadersBtn}</span>
                </button>

                {/* Tool 3: Compare: Before vs. Today */}
                <button
                  type="button"
                  onClick={() => {
                    onToggleCompareMode();
                    setIsToolsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between gap-2 text-xs font-semibold cursor-pointer ${
                    isCompareMode
                      ? 'bg-[#B22234] text-[#F8FAFC] border border-[#D4AF37]'
                      : 'hover:bg-[#1E3A8A]/60 text-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{t.header.compareBtn}</span>
                  </div>
                  {isCompareMode && <Check className="w-3.5 h-3.5" />}
                </button>

                {/* Tool 4: 67-County Archive Index */}
                <button
                  type="button"
                  onClick={() => {
                    onToggleCatalog();
                    setIsToolsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1E3A8A]/60 transition-colors flex items-center gap-2 text-xs font-medium text-[#F8FAFC] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.header.archiveBtn}</span>
                </button>

                {/* Tool 5: Interactive Atlas Guide */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenWelcomeGuide();
                    setIsToolsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1E3A8A]/60 transition-colors flex items-center justify-between gap-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <span>{t.header.atlasGuideBtn}</span>
                </button>

                {/* Tool 6: Comic Encyclopedia (Phase 13) */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenComicEncyclopedia();
                    setIsToolsMenuOpen(false);
                  }}
                  title={t.header.comicEncyclopediaTitle}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-[#B22234]/25 hover:bg-[#B22234]/75 border border-[#D4AF37]/60 transition-colors flex items-center justify-between gap-2 text-xs font-bold text-[#F8FAFC] cursor-pointer"
                >
                  <span>{t.header.comicEncyclopediaBtn}</span>
                </button>

                {/* Tool 7: About & PA Community (Outreach) */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenAboutOutreachModal();
                    setIsToolsMenuOpen(false);
                  }}
                  title={t.header.aboutOutreachTitle}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-[#1E3A8A]/35 hover:bg-[#1E3A8A]/75 border border-[#D4AF37]/40 transition-colors flex items-center justify-between gap-2 text-xs font-semibold text-[#D4AF37] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <span>{t.header.aboutOutreachBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2b. Youthful Top-Bar Button: "🦸‍♂️ Comic Encyclopedia" */}
        <button
          type="button"
          onClick={onOpenComicEncyclopedia}
          title={t.header.comicEncyclopediaTitle}
          className="hidden xl:flex px-3 py-1.5 rounded-xl text-xs font-bold transition-all items-center gap-1.5 whitespace-nowrap cursor-pointer border bg-[#B22234]/85 hover:bg-[#B22234] text-[#F8FAFC] border-[#D4AF37]/80 shadow-sm"
        >
          <span>{t.header.comicEncyclopediaBtn}</span>
        </button>

        {/* 3. Featured Button: "🎓 Teacher Mode" (Federal Blue / Gold) */}
        <button
          type="button"
          onClick={onToggleTeacherMode}
          title={t.header.teacherModeTitle}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border shadow-sm ${
            isTeacherMode
              ? 'bg-[#D4AF37] text-[#09111E] border-[#F8FAFC] shadow-[0_0_16px_rgba(212,175,55,0.45)]'
              : 'bg-[#1E3A8A]/90 hover:bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37]/70'
          }`}
        >
          <span>{t.header.teacherModeBtn}</span>
        </button>

        {/* 4. Segmented Language Switcher: EN | ES */}
        <div
          role="group"
          aria-label={t.header.languageSwitcherLabel}
          className="rounded-full bg-[#09111E]/95 border border-slate-700/80 p-0.5 flex items-center text-xs font-mono shrink-0"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            title="English (United States)"
            aria-pressed={language === 'en'}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] font-bold border border-[#D4AF37]/80'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            title="Español (Estados Unidos)"
            aria-pressed={language === 'es'}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              language === 'es'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] font-bold border border-[#D4AF37]/80'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            ES
          </button>
        </div>

        {/* 5. Compact "♥ Support" Button */}
        <button
          type="button"
          onClick={onOpenSupportModal}
          title={t.support.headerBtnTitle}
          className="px-2.5 py-1.5 rounded-xl border border-[#D4AF37]/55 bg-[#B22234]/20 hover:bg-[#B22234]/40 text-[#F8FAFC] text-xs font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="text-[#D4AF37]">{t.header.supportCompactBtn}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
