import React, { useMemo } from 'react';
import {
  X,
  MapPin,
  Landmark,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  CHRONOLOGY_SUBCATEGORIES,
  ChronologyMilestoneItem,
} from '../data/chronologyTaxonomyData';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import { HistoricalScenarioId } from '../data/historicalTerritoriesConfig';
import { useTranslation } from '../context/LanguageContext';
import AudioNarratorWidget from './AudioNarratorWidget';

export interface MapChronologyFocusPayload {
  lat: number;
  lng: number;
  zoom?: number;
  turfScenario?: HistoricalScenarioId | 'none';
  countyName?: string;
}

interface ChronologyDrawerProps {
  milestone: ChronologyMilestoneItem | null;
  onClose: () => void;
  onLocateOnMap: (payload: MapChronologyFocusPayload) => void;
  onSelectCounty: (county: CountyRecord) => void;
}

export const ChronologyDrawer: React.FC<ChronologyDrawerProps> = ({
  milestone,
  onClose,
  onLocateOnMap,
  onSelectCounty,
}) => {
  const { language, locale, t } = useTranslation();

  const subcategoryLabel = useMemo(() => {
    if (!milestone) return '';
    const subMeta = CHRONOLOGY_SUBCATEGORIES.find(
      (s) => s.id === milestone.subcategory
    );
    if (!subMeta) return '';
    return language === 'en' ? subMeta.labelEn : subMeta.labelEs;
  }, [milestone, language]);

  const narrationPayload = useMemo(() => {
    if (!milestone) return { es: '', en: '', title: '' };
    const textEn = `${milestone.dateLabelEn}. ${milestone.titleEn}. ${milestone.summaryEn} Historical significance: ${milestone.impactEn}`;
    const textEs = `${milestone.dateLabelEs}. ${milestone.titleEs}. ${milestone.summaryEs} Trascendencia histórica: ${milestone.impactEs}`;
    return {
      en: textEn,
      es: textEs,
      title: language === 'en' ? milestone.titleEn : milestone.titleEs,
    };
  }, [milestone, language]);

  if (!milestone) return null;

  const title = language === 'en' ? milestone.titleEn : milestone.titleEs;
  const dateLabel =
    language === 'en' ? milestone.dateLabelEn : milestone.dateLabelEs;
  const summary = language === 'en' ? milestone.summaryEn : milestone.summaryEs;
  const impact = language === 'en' ? milestone.impactEn : milestone.impactEs;
  const seriesTitle =
    language === 'en' ? milestone.seriesTitleEn : milestone.seriesTitleEs;
  const seriesUnit =
    language === 'en' ? milestone.seriesUnitEn : milestone.seriesUnitEs;

  const linkedCounty = milestone.countyName
    ? PA_COUNTIES_DATA[milestone.countyName]
    : undefined;

  const hasStatisticalChart =
    milestone.category === 'statistical' &&
    Array.isArray(milestone.seriesData) &&
    milestone.seriesData.length > 0;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="bg-[#0F1C30]/95 backdrop-blur-2xl border border-[#D4AF37]/65 rounded-2xl p-4 shadow-[0_25px_65px_rgba(0,0,0,0.85)] pointer-events-auto transition-all duration-200"
    >
      {/* Top Header Bar: Category/Subcategory Badges + Bilingual Audio-Guide + Close Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md bg-[#B22234] border border-[#D4AF37]/70 font-mono text-xs font-bold text-[#F8FAFC] tabular-nums shadow-sm">
            {dateLabel}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#1E3A8A]/70 border border-[#1D4ED8]/60 text-[11px] font-medium text-[#F8FAFC] flex items-center gap-1">
            {milestone.category === 'political' && (
              <Landmark className="w-3 h-3 text-[#D4AF37]" />
            )}
            {milestone.category === 'geographic' && (
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
            )}
            {milestone.category === 'statistical' && (
              <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
            )}
            <span>{subcategoryLabel}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarratorWidget
            script={{
              en: narrationPayload.en,
              es: narrationPayload.es,
            }}
            contextKey={`chrono-${milestone.id}`}
            compact={true}
          />
          <button
            type="button"
            onClick={onClose}
            title={t.timeline.closeDrawerAria}
            aria-label={t.timeline.closeDrawerAria}
            className="p-1.5 rounded-lg bg-[#09111E]/90 hover:bg-[#B22234]/80 border border-slate-700/70 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Narrative on Left, Chart or Map Action on Right */}
      <div
        className={`mt-3 grid grid-cols-1 ${
          hasStatisticalChart ? 'lg:grid-cols-12' : 'md:grid-cols-12'
        } gap-4 items-start`}
      >
        {/* Left Column: Title, Historical Narrative & Significance */}
        <div
          className={
            hasStatisticalChart ? 'lg:col-span-7 space-y-2' : 'md:col-span-8 space-y-2'
          }
        >
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#F8FAFC] leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#F8FAFC]/90 leading-relaxed">
            {summary}
          </p>

          <div className="bg-[#09111E]/75 border border-slate-700/60 rounded-xl p-2.5 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="text-xs text-[#94A3B8] leading-relaxed">
              <span className="font-semibold text-[#D4AF37] mr-1">
                {t.timeline.historicalImpactLabel}
              </span>
              <span className="text-[#F8FAFC]/85">{impact}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Statistical Mini LineChart (Category 3) OR Interactive Map Locator (Category 1 & 2) */}
        <div
          className={
            hasStatisticalChart
              ? 'lg:col-span-5 bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3'
              : 'md:col-span-4 flex flex-col justify-between gap-2.5 bg-[#09111E]/75 border border-slate-700/60 rounded-xl p-3'
          }
        >
          {hasStatisticalChart && milestone.seriesData ? (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#D4AF37] font-semibold truncate">
                  {seriesTitle || t.timeline.timeSeriesHeader}
                </span>
                {seriesUnit && (
                  <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                    ({seriesUnit})
                  </span>
                )}
              </div>

              <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={milestone.seriesData}
                    margin={{ top: 6, right: 10, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E293B"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#09111E',
                        borderColor: '#D4AF37',
                        borderRadius: '0.65rem',
                        fontSize: '11px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val: any) => {
                        const num = Number(val);
                        return [
                          `${num.toLocaleString(locale)} ${seriesUnit || ''}`,
                          seriesTitle || '',
                        ];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#D4AF37"
                      strokeWidth={2.4}
                      dot={{
                        r: 3.5,
                        fill: '#B22234',
                        stroke: '#D4AF37',
                        strokeWidth: 1.5,
                      }}
                      activeDot={{
                        r: 5,
                        fill: '#D4AF37',
                        stroke: '#F8FAFC',
                        strokeWidth: 1.5,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {linkedCounty && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectCounty(linkedCounty)}
                    className="text-[11px] font-medium text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {t.timeline.inspectCountyBtn(linkedCounty.name)}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#94A3B8] font-semibold">
                {language === 'en'
                  ? 'CARTOGRAPHIC SYNCHRONIZATION'
                  : 'SINCRONIZACIÓN CARTOGRÁFICA'}
              </div>

              {milestone.coordinates && (
                <button
                  type="button"
                  onClick={() =>
                    onLocateOnMap({
                      lat: milestone.coordinates!.lat,
                      lng: milestone.coordinates!.lng,
                      zoom: milestone.coordinates!.zoom || 10,
                      turfScenario: milestone.turfScenario,
                      countyName: milestone.countyName,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E3A8A] border border-[#D4AF37] text-xs font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(29,78,216,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.timeline.locateOnMapBtn}</span>
                </button>
              )}

              {linkedCounty && (
                <button
                  type="button"
                  onClick={() => onSelectCounty(linkedCounty)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/50 border border-slate-700 hover:border-[#D4AF37]/70 text-xs text-[#F8FAFC] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.timeline.inspectCountyBtn(linkedCounty.name)}</span>
                </button>
              )}

              {milestone.coordinates && (
                <div className="text-[10px] font-mono text-[#94A3B8] text-center tabular-nums">
                  {milestone.coordinates.lat.toFixed(4)}°N,{' '}
                  {Math.abs(milestone.coordinates.lng).toFixed(4)}°W
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChronologyDrawer;
