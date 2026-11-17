import React from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import {
  HistoricalEra,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';
import {
  HISTORICAL_SCENARIOS,
  HistoricalScenarioId,
  HistoricalTerritoryDefinition,
} from '../data/historicalTerritoriesConfig';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedRegion } from '../i18n/translations';

interface MapOverlayControlsProps {
  turfScenario: HistoricalScenarioId | 'none';
  onSelectTurfScenario: (scenario: HistoricalScenarioId | 'none') => void;
  selectedRegion: RegionId | 'all';
  onSelectRegion: (region: RegionId | 'all') => void;
  activeEra: HistoricalEra;
  highlightEraFrontier: boolean;
  isLegendOpen: boolean;
  onToggleLegendOpen: () => void;
}

export const MapOverlayControls: React.FC<MapOverlayControlsProps> = ({
  turfScenario,
  onSelectTurfScenario,
  selectedRegion,
  onSelectRegion,
  activeEra,
  highlightEraFrontier,
  isLegendOpen,
  onToggleLegendOpen,
}) => {
  const { language, t } = useTranslation();

  return (
    <div className="fixed top-20 left-4 z-20 flex flex-col items-start gap-2 pointer-events-none no-print max-w-[calc(100vw-2rem)]">
      {/* Compact Floating Territorial View Pill Bar */}
      <div
        role="group"
        aria-label={t.map.turfUnionTitle}
        className="pointer-events-auto bg-[#0F1C30]/85 backdrop-blur-xl border border-slate-700/60 rounded-full p-1 shadow-[0_12px_32px_rgba(0,0,0,0.65)] flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full"
      >
        <button
          type="button"
          onClick={() => onSelectTurfScenario('none')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            turfScenario === 'none'
              ? 'bg-[#1D4ED8] text-[#F8FAFC] font-semibold border border-[#D4AF37]/80 shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/60'
          }`}
        >
          {t.map.pill67Counties}
        </button>

        <span className="text-slate-700 select-none">|</span>

        <button
          type="button"
          onClick={() => onSelectTurfScenario('1682')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            turfScenario === '1682'
              ? 'bg-[#1D4ED8] text-[#F8FAFC] font-semibold border border-[#D4AF37]/80 shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/60'
          }`}
        >
          {t.map.pill1682Penn}
        </button>

        <span className="text-slate-700 select-none">|</span>

        <button
          type="button"
          onClick={() => onSelectTurfScenario('1787')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            turfScenario === '1787'
              ? 'bg-[#1D4ED8] text-[#F8FAFC] font-semibold border border-[#D4AF37]/80 shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/60'
          }`}
        >
          {t.map.pill1787Constitution}
        </button>
      </div>

      {/* Collapsible Compact Regions Legend Card */}
      <div className="pointer-events-auto bg-[#0F1C30]/85 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.65)] overflow-hidden transition-all w-56 sm:w-64">
        <button
          type="button"
          onClick={onToggleLegendOpen}
          title={isLegendOpen ? t.map.collapseLegend : t.map.expandLegend}
          className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#F8FAFC] font-semibold truncate">
              {turfScenario === 'none'
                ? t.map.regionsLegendCardTitle
                : t.map.mergedLegendTitle(turfScenario)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {selectedRegion !== 'all' && turfScenario === 'none' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRegion('all');
                }}
                className="px-1.5 py-0.5 rounded bg-[#1D4ED8]/40 border border-[#D4AF37]/50 text-[10px] text-[#D4AF37] hover:bg-[#1D4ED8]/70"
              >
                {t.header.allRegionsBtn}
              </span>
            )}
            {isLegendOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            )}
          </div>
        </button>

        {isLegendOpen && turfScenario === 'none' && (
          <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-700/50 space-y-1">
            {Object.values(PA_REGIONS).map((reg) => {
              const isActive = selectedRegion === reg.id;
              const locReg = getLocalizedRegion(reg.id, language);
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => onSelectRegion(isActive ? 'all' : reg.id)}
                  className={`w-full text-left px-2 py-1 rounded-lg transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A8A]/85 text-[#F8FAFC] border border-[#D4AF37]/70 font-semibold'
                      : 'hover:bg-[#09111E]/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0 border border-[#D4AF37]/60"
                      style={{ backgroundColor: reg.fillColor }}
                    />
                    <span className="truncate">{locReg.shortName}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                  )}
                </button>
              );
            })}

            {highlightEraFrontier && activeEra.id !== 'present' && (
              <div className="pt-1.5 mt-1 border-t border-slate-700/50 flex items-center gap-2 text-[10px] text-[#94A3B8] px-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#09111E] border border-slate-600 shrink-0" />
                <span className="truncate">
                  {t.map.notEstablishedIn(activeEra.yearLabel)}
                </span>
              </div>
            )}
          </div>
        )}

        {isLegendOpen && turfScenario !== 'none' && (
          <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-700/50 space-y-1 max-h-40 overflow-y-auto">
            {HISTORICAL_SCENARIOS[turfScenario].territories.map(
              (tItem: HistoricalTerritoryDefinition) => (
                <div
                  key={tItem.id}
                  className="px-2 py-1 rounded-md flex items-center justify-between gap-2 text-xs text-[#F8FAFC]/90"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0 border border-[#D4AF37]/60"
                      style={{ backgroundColor: tItem.fillColor }}
                    />
                    <span className="truncate">{tItem.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#D4AF37] tabular-nums shrink-0">
                    {tItem.modernCounties.length}c
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapOverlayControls;
