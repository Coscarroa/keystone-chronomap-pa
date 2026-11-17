import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Clock,
  Layers,
  MapPin,
  BookOpen,
} from 'lucide-react';
import {
  CountyRecord,
  HISTORICAL_ERAS,
  HistoricalEra,
  PA_COUNTIES_DATA,
} from '../data/paCountiesData';
import {
  CHRONOLOGY_MILESTONES_DATA,
  ChronologyCategoryId,
  ChronologyMilestoneItem,
} from '../data/chronologyTaxonomyData';
import ChronologyDrawer, {
  MapChronologyFocusPayload,
} from './ChronologyDrawer';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedEra } from '../i18n/translations';

interface TimelineProps {
  activeEra: HistoricalEra;
  onSelectEra: (era: HistoricalEra) => void;
  onSelectCounty: (county: CountyRecord) => void;
  highlightEraFrontier: boolean;
  onToggleEraFrontier: () => void;
  foundedCountInEra: number;
  onOpenSupportModal?: () => void;
  onOpenAboutOutreachModal?: () => void;
  onLocateChronologyItem?: (payload: MapChronologyFocusPayload) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  activeEra,
  onSelectEra,
  onSelectCounty,
  highlightEraFrontier,
  onToggleEraFrontier,
  foundedCountInEra,
  onLocateChronologyItem,
}) => {
  const { language, t } = useTranslation();

  // Taxonomic Category State ('political' | 'geographic' | 'statistical')
  const [activeCategory, setActiveCategory] =
    useState<ChronologyCategoryId>('political');
  const [selectedMilestone, setSelectedMilestone] =
    useState<ChronologyMilestoneItem | null>(null);
  const [isChronicleExpanded, setIsChronicleExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const locActiveEra = useMemo(
    () => getLocalizedEra(activeEra, language),
    [activeEra, language]
  );

  // Milestones filtered by active category
  const filteredMilestones = useMemo(() => {
    return CHRONOLOGY_MILESTONES_DATA.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  const handleClickMilestone = (item: ChronologyMilestoneItem) => {
    if (selectedMilestone?.id === item.id) {
      setSelectedMilestone(null);
      return;
    }
    setSelectedMilestone(item);
    setIsChronicleExpanded(false);

    // Sync historical era on the map when clicking a milestone
    const targetEra = HISTORICAL_ERAS.find((e) => e.id === item.eraId);
    if (targetEra && targetEra.id !== activeEra.id) {
      onSelectEra(targetEra);
    }
  };

  const handleLocateFromDrawer = (payload: MapChronologyFocusPayload) => {
    if (onLocateChronologyItem) {
      onLocateChronologyItem(payload);
    } else if (payload.countyName && PA_COUNTIES_DATA[payload.countyName]) {
      onSelectCounty(PA_COUNTIES_DATA[payload.countyName]);
    }
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-30 pointer-events-none no-print">
      <div className="max-w-3xl mx-auto flex flex-col gap-1.5">
        {/* 1. Expandable Chronological Milestone Dossier Drawer */}
        {selectedMilestone && (
          <ChronologyDrawer
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
            onLocateOnMap={handleLocateFromDrawer}
            onSelectCounty={onSelectCounty}
          />
        )}

        {/* 2. Collapsible Historical Era Chronicle Card */}
        {isChronicleExpanded && !selectedMilestone && (
          <div className="bg-[#0F1C30]/94 backdrop-blur-xl border border-slate-700/75 rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-auto transition-all duration-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex-wrap">
                  <span>
                    {t.timeline.eraPrefix} {locActiveEra.yearLabel}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="text-[#94A3B8] font-normal">
                    {locActiveEra.subtitle}
                  </span>
                </div>

                <h2 className="font-serif text-base font-bold text-[#F8FAFC]">
                  {locActiveEra.title}
                </h2>

                <p className="text-xs text-[#F8FAFC]/85 leading-relaxed">
                  {locActiveEra.summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700/50">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">
                    {t.timeline.territorialEvolution}
                  </div>
                  <div className="font-serif text-xs font-bold text-[#D4AF37] tabular-nums">
                    {t.timeline.countiesEstablished(foundedCountInEra)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleEraFrontier}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    highlightEraFrontier
                      ? 'bg-[#1E3A8A]/80 border-[#D4AF37] text-[#F8FAFC]'
                      : 'bg-[#09111E]/80 border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Layers className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {highlightEraFrontier
                      ? t.timeline.chronoFilterActive
                      : t.timeline.showingAllCounties}
                  </span>
                </button>
              </div>
            </div>

            {/* Protagonist Counties of this Era */}
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span>{t.timeline.keyCountiesLabel}</span>
              </span>

              {activeEra.featuredCounties.map((countyName) => {
                const record = PA_COUNTIES_DATA[countyName];
                if (!record) return null;
                return (
                  <button
                    key={countyName}
                    type="button"
                    onClick={() => onSelectCounty(record)}
                    className="px-2 py-0.5 rounded-lg bg-[#09111E]/80 hover:bg-[#1E3A8A]/70 border border-slate-700/70 hover:border-[#D4AF37] text-[11px] text-[#F8FAFC] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <span className="font-serif font-medium">{record.name}</span>
                    <span className="font-mono text-[10px] text-[#94A3B8] tabular-nums">
                      ({record.founded})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Compact 2-Row Chronology Bar (Foldable into 1 thin line) */}
        <div className="bg-[#0F1C30]/92 backdrop-blur-xl border border-slate-700/65 rounded-2xl px-2.5 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] pointer-events-auto space-y-1.5">
          {/* ROW 1: 3-Category Segmented Selector + Active Era Selector Pills + Minimize Button */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: 3 Taxonomic Categories */}
            <div
              role="tablist"
              aria-label="Chronological Data Taxonomy"
              className="flex items-center gap-1 bg-[#09111E]/90 p-0.5 rounded-xl border border-slate-700/60 overflow-x-auto no-scrollbar shrink-0"
            >
              {(
                [
                  { id: 'political', label: t.timeline.catPolitical },
                  { id: 'geographic', label: t.timeline.catGeographic },
                  { id: 'statistical', label: t.timeline.catStatistical },
                ] as const
              ).map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      if (isMinimized) setIsMinimized(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1D4ED8] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-sm'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Compact Era Selector + Chronicle Button + Minimize Toggle */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <div className="hidden sm:flex items-center gap-1 bg-[#09111E]/80 px-1.5 py-0.5 rounded-xl border border-slate-700/60">
                <Clock className="w-3 h-3 text-[#D4AF37] shrink-0" />
                {HISTORICAL_ERAS.map((era) => {
                  const isEraSelected = activeEra.id === era.id;
                  return (
                    <button
                      key={era.id}
                      type="button"
                      onClick={() => onSelectEra(era)}
                      className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] transition-colors cursor-pointer shrink-0 ${
                        isEraSelected
                          ? 'bg-[#B22234] text-[#F8FAFC] border border-[#D4AF37]/80 font-bold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {era.yearLabel}
                    </button>
                  );
                })}
              </div>

              {/* Era Chronicle Info Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMilestone(null);
                  setIsChronicleExpanded((prev) => !prev);
                }}
                title={
                  isChronicleExpanded
                    ? t.timeline.hideChronicle
                    : t.timeline.showChronicle
                }
                className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  isChronicleExpanded
                    ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                    : 'bg-[#09111E]/85 border-slate-700/70 text-[#D4AF37] hover:border-[#D4AF37]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>

              {/* Fold / Minimize Timeline Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMinimized((prev) => !prev);
                  if (!isMinimized) {
                    setSelectedMilestone(null);
                    setIsChronicleExpanded(false);
                  }
                }}
                title={
                  isMinimized
                    ? language === 'en'
                      ? 'Expand chronology bar'
                      : 'Expandir barra de cronología'
                    : language === 'en'
                      ? 'Minimize chronology bar'
                      : 'Minimizar barra de cronología'
                }
                className="px-2 py-1 rounded-lg bg-[#09111E]/85 border border-slate-700/70 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#D4AF37] text-[10px] font-medium flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
              >
                {isMinimized ? (
                  <>
                    <ChevronUp className="w-3 h-3 text-[#D4AF37]" />
                    <span className="hidden md:inline">
                      {language === 'en' ? 'Expand' : 'Expandir'}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
                    <span className="hidden md:inline">
                      {language === 'en' ? 'Minimize' : 'Minimizar'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ROW 2: Slim Horizontal Carousel of Milestones & Years (Hidden when Minimized) */}
          {!isMinimized && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/80">
              {filteredMilestones.map((item) => {
                const isSelected = selectedMilestone?.id === item.id;
                const shortTitle =
                  language === 'en' ? item.shortTitleEn : item.shortTitleEs;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClickMilestone(item)}
                    className={`group px-2.5 py-1 rounded-lg text-left transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#B22234] border-[#D4AF37] shadow-[0_0_12px_rgba(178,34,52,0.5)]'
                        : 'bg-[#09111E]/80 hover:bg-[#1E3A8A]/50 border-slate-700/60 hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-[#D4AF37] ring-2 ring-[#F8FAFC]/60'
                          : 'bg-[#D4AF37]/80 group-hover:bg-[#D4AF37]'
                      }`}
                    />
                    <span className="font-mono text-[11px] font-bold text-[#D4AF37] tabular-nums">
                      {item.year === 1600 ? 'Pre-1681' : item.year}
                    </span>
                    <span
                      className={`text-[11px] whitespace-nowrap ${
                        isSelected
                          ? 'text-[#F8FAFC] font-medium'
                          : 'text-[#CBD5E1] group-hover:text-[#F8FAFC]'
                      }`}
                    >
                      {shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
