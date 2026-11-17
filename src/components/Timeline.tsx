import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Clock,
  Layers,
  MapPin,
  Heart,
} from 'lucide-react';
import {
  CountyRecord,
  HISTORICAL_ERAS,
  HistoricalEra,
  PA_COUNTIES_DATA,
} from '../data/paCountiesData';
import {
  CHRONOLOGY_MILESTONES_DATA,
  CHRONOLOGY_SUBCATEGORIES,
  ChronologyCategoryId,
  ChronologyMilestoneItem,
  ChronologySubcategoryId,
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
  onOpenSupportModal,
  onOpenAboutOutreachModal,
  onLocateChronologyItem,
}) => {
  const { language, t } = useTranslation();

  // Taxonomic Category State ('political' | 'geographic' | 'statistical')
  const [activeCategory, setActiveCategory] =
    useState<ChronologyCategoryId>('political');
  const [activeSubcategory, setActiveSubcategory] = useState<
    ChronologySubcategoryId | 'all'
  >('all');
  const [selectedMilestone, setSelectedMilestone] =
    useState<ChronologyMilestoneItem | null>(null);
  const [isChronicleExpanded, setIsChronicleExpanded] = useState(false);

  const locActiveEra = useMemo(
    () => getLocalizedEra(activeEra, language),
    [activeEra, language]
  );

  // Subcategories belonging to the active main category
  const availableSubcategories = useMemo(() => {
    return CHRONOLOGY_SUBCATEGORIES.filter(
      (sub) => sub.category === activeCategory
    );
  }, [activeCategory]);

  // Milestones filtered by active category & subcategory
  const filteredMilestones = useMemo(() => {
    return CHRONOLOGY_MILESTONES_DATA.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (
        activeSubcategory !== 'all' &&
        item.subcategory !== activeSubcategory
      ) {
        return false;
      }
      return true;
    });
  }, [activeCategory, activeSubcategory]);

  const handleSelectCategory = (cat: ChronologyCategoryId) => {
    setActiveCategory(cat);
    setActiveSubcategory('all');
  };

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
    <div className="fixed bottom-9 sm:bottom-7 left-4 right-4 xl:right-64 z-30 pointer-events-none no-print">
      <div className="max-w-[1080px] mx-auto flex flex-col gap-2">
        {/* 1. Expandable Chronological Milestone Dossier Drawer */}
        {selectedMilestone && (
          <ChronologyDrawer
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
            onLocateOnMap={handleLocateFromDrawer}
            onSelectCounty={onSelectCounty}
          />
        )}

        {/* 2. Collapsible Historical Era Chronicle Card (when toggled via chevron) */}
        {isChronicleExpanded && !selectedMilestone && (
          <div className="bg-[#0F1C30]/92 backdrop-blur-xl border border-slate-700/70 rounded-2xl px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto transition-all duration-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
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

                <h2 className="font-serif text-base sm:text-lg font-bold text-[#F8FAFC]">
                  {locActiveEra.title}
                </h2>

                <p className="text-xs sm:text-[13px] text-[#F8FAFC]/85 leading-relaxed">
                  {locActiveEra.summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700/50">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">
                    {t.timeline.territorialEvolution}
                  </div>
                  <div className="font-serif text-sm font-bold text-[#D4AF37] tabular-nums">
                    {t.timeline.countiesEstablished(foundedCountInEra)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleEraFrontier}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    highlightEraFrontier
                      ? 'bg-[#1E3A8A]/80 border-[#D4AF37] text-[#F8FAFC]'
                      : 'bg-[#09111E]/80 border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {highlightEraFrontier
                      ? t.timeline.chronoFilterActive
                      : t.timeline.showingAllCounties}
                  </span>
                </button>
              </div>
            </div>

            {/* Protagonist Counties of this Era */}
            <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#94A3B8] flex items-center gap-1 shrink-0">
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
                    className="px-2.5 py-1 rounded-lg bg-[#09111E]/80 hover:bg-[#1E3A8A]/70 border border-slate-700/70 hover:border-[#D4AF37] text-xs text-[#F8FAFC] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
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

        {/* 3. Main Taxonomic Chronological Control Bar */}
        <div className="bg-[#0F1C30]/90 backdrop-blur-xl border border-slate-700/65 rounded-2xl px-3 py-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.78)] pointer-events-auto space-y-2">
          {/* Row A: 3-Category Segmented Selector + Subcategory Filter Pills + Map Era Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-1.5 border-b border-slate-800/90">
            {/* 3 Main Taxonomic Categories */}
            <div
              role="tablist"
              aria-label="Chronological Data Taxonomy"
              className="flex items-center gap-1 bg-[#09111E]/90 p-1 rounded-xl border border-slate-700/60 overflow-x-auto no-scrollbar shrink-0"
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
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1D4ED8] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-[0_0_12px_rgba(29,78,216,0.5)]'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Subcategory Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveSubcategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  activeSubcategory === 'all'
                    ? 'bg-[#B22234]/90 border-[#D4AF37] text-[#F8FAFC]'
                    : 'bg-[#09111E]/70 border-slate-700/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {t.timeline.subAll}
              </button>
              {availableSubcategories.map((sub) => {
                const isSubActive = activeSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      setActiveSubcategory(sub.id as ChronologySubcategoryId)
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                      isSubActive
                        ? 'bg-[#B22234]/90 border-[#D4AF37] text-[#F8FAFC]'
                        : 'bg-[#09111E]/70 border-slate-700/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {language === 'en' ? sub.labelEn : sub.labelEs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row B: Horizontally Scrollable Chronological Milestone Track with Golden Markers */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 pl-1 pr-2.5 border-r border-slate-700/60 shrink-0">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#94A3B8] leading-tight">
                <div>{t.timeline.chronologyHeader}</div>
                <div className="text-[#D4AF37] font-semibold">
                  {t.timeline.chronologyRange}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {filteredMilestones.map((item) => {
                const isSelected = selectedMilestone?.id === item.id;
                const shortTitle =
                  language === 'en' ? item.shortTitleEn : item.shortTitleEs;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClickMilestone(item)}
                    className={`group px-3 py-1.5 rounded-xl text-left transition-all cursor-pointer border shrink-0 flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#B22234] border-[#D4AF37] shadow-[0_0_15px_rgba(178,34,52,0.55)]'
                        : 'bg-[#09111E]/80 hover:bg-[#1E3A8A]/50 border-slate-700/60 hover:border-[#D4AF37]/60'
                    }`}
                  >
                    {/* Golden Year Node */}
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected
                              ? 'bg-[#D4AF37] ring-2 ring-[#F8FAFC]/60'
                              : 'bg-[#D4AF37]/80 group-hover:bg-[#D4AF37]'
                          }`}
                        />
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#F8FAFC] tabular-nums">
                          {item.year === 1600 ? 'Pre-1681' : item.year}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] whitespace-nowrap mt-0.5 ${
                          isSelected
                            ? 'text-[#F8FAFC] font-medium'
                            : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                        }`}
                      >
                        {shortTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expand/Collapse Era Chronicle Toggle */}
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
              aria-label={
                isChronicleExpanded
                  ? t.timeline.hideChronicle
                  : t.timeline.showChronicle
              }
              className="p-2 rounded-xl bg-[#09111E]/85 border border-slate-700/70 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#1E3A8A]/50 transition-colors shrink-0 cursor-pointer"
            >
              {isChronicleExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Row C: Compact 6-Era Map Boundary Filter + Civic Archive Footer */}
          <footer className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#94A3B8]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="uppercase tracking-wider text-[#94A3B8] font-semibold shrink-0">
                {t.timeline.eraFilterPrefix}
              </span>
              {HISTORICAL_ERAS.map((era) => {
                const isEraSelected = activeEra.id === era.id;
                return (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => onSelectEra(era)}
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-colors cursor-pointer shrink-0 ${
                      isEraSelected
                        ? 'bg-[#B22234] text-[#F8FAFC] border border-[#D4AF37]/70 font-bold'
                        : 'bg-[#09111E]/70 text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800'
                    }`}
                  >
                    {era.yearLabel}
                  </button>
                );
              })}
            </div>

            {(onOpenSupportModal || onOpenAboutOutreachModal) && (
              <div className="flex items-center gap-3 ml-auto">
                <span className="hidden lg:inline truncate">
                  {t.support.footerCopyright}
                </span>
                {onOpenAboutOutreachModal && (
                  <button
                    type="button"
                    onClick={onOpenAboutOutreachModal}
                    className="inline-flex items-center gap-1 text-[#F8FAFC]/90 hover:text-[#D4AF37] hover:underline transition-colors shrink-0 cursor-pointer font-medium"
                  >
                    <span>{t.outreach.footerLink}</span>
                  </button>
                )}
                {onOpenSupportModal && (
                  <button
                    type="button"
                    onClick={onOpenSupportModal}
                    className="inline-flex items-center gap-1 text-[#D4AF37]/90 hover:text-[#D4AF37] hover:underline transition-colors shrink-0 cursor-pointer font-medium"
                  >
                    <Heart className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]/25" />
                    <span>{t.support.footerLink}</span>
                  </button>
                )}
              </div>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
