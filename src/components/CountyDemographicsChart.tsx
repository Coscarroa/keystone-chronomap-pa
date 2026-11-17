import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Factory, TrendingUp, Users, Layers } from 'lucide-react';
import { CountyRecord } from '../data/paCountiesData';
import {
  CensusDecadePoint,
  getCountyCensusProfile,
} from '../data/paCensusData';
import { useTranslation } from '../context/LanguageContext';

interface CountyDemographicsChartProps {
  county: CountyRecord;
}

function formatPopulationAxis(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }
  return String(value);
}

const CustomArchivalTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ payload: CensusDecadePoint; value: number }>;
  label?: string;
}> = ({ active, payload, label }) => {
  const { locale, t } = useTranslation();
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="bg-[#161920]/96 border border-[#C5A059] rounded-xl p-3 shadow-2xl max-w-[235px]">
      <div className="flex items-center justify-between gap-3 border-b border-[#C5A059]/25 pb-1.5">
        <span className="font-mono text-xs font-bold text-[#D4AF37]">
          {t.census.tooltipCensus} {label}
        </span>
        <span className="font-mono text-xs font-semibold text-[#F4F1EA] tabular-nums">
          {point.population.toLocaleString(locale)} {t.census.tooltipPopSuffix}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-[#A39E93] leading-snug">
        {point.eraContext}
      </p>
    </div>
  );
};

export const CountyDemographicsChart: React.FC<
  CountyDemographicsChartProps
> = ({ county }) => {
  const { locale, t } = useTranslation();

  const profile = React.useMemo(
    () => getCountyCensusProfile(county),
    [county]
  );

  const peakPoint = React.useMemo(() => {
    return profile.series.reduce(
      (max, item) => (item.population > max.population ? item : max),
      profile.series[0]
    );
  }, [profile.series]);

  const currentPop =
    profile.series[profile.series.length - 1]?.population || 0;

  return (
    <div className="space-y-4">
      {/* 1. Industrial Milestone Badge Card */}
      <div className="bg-[#0D0F12]/80 border border-[#D4AF37]/45 rounded-xl p-3.5 space-y-1.5 shadow-inner">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
          <Factory className="w-3.5 h-3.5 shrink-0" />
          <span>{t.census.badgeHeader}</span>
        </div>
        <div className="font-serif text-sm font-bold text-[#F4F1EA] leading-snug">
          {profile.industrialMilestoneBadge}
        </div>
        <div className="text-[11px] text-[#A39E93]">
          <strong className="text-[#D4AF37]">{t.census.dominantSector}</strong>{' '}
          {profile.dominantHistoricalSector}
        </div>
      </div>

      {/* 2. Recharts Historical Population AreaChart (1790–Present) */}
      <div className="bg-[#0D0F12]/70 border border-[#C5A059]/25 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{t.census.demographicsTitle}</span>
            </div>
            <div className="text-[11px] text-[#A39E93] mt-0.5">
              {t.census.currentPopLabel}{' '}
              <span className="font-mono text-[#F4F1EA] font-semibold tabular-nums">
                {currentPop.toLocaleString(locale)}
              </span>{' '}
              · {t.census.peakInLabel(peakPoint.year)}{' '}
              <span className="font-mono text-[#D4AF37] tabular-nums">
                {peakPoint.population.toLocaleString(locale)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-[210px] pt-1">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={profile.series}
              margin={{ top: 8, right: 10, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="keystoneGoldGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(197, 160, 89, 0.14)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: '#A39E93', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(197, 160, 89, 0.25)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatPopulationAxis}
                tick={{ fill: '#A39E93', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomArchivalTooltip />} />
              <Area
                type="monotone"
                dataKey="population"
                stroke="#D4AF37"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#keystoneGoldGradient)"
                activeDot={{
                  r: 5,
                  fill: '#D4AF37',
                  stroke: '#F4F1EA',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Economic Sector Composition Bar (Agriculture, Heavy Industry/Mining, Services/Tech) */}
      <div className="bg-[#0D0F12]/70 border border-[#C5A059]/25 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.census.compositionTitle}</span>
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#161920] border border-[#C5A059]/30">
          <div
            style={{ width: `${profile.composition.agriculturePct}%` }}
            title={`${t.census.agriLabel}: ${profile.composition.agriculturePct}%`}
            className="bg-[#52B788] h-full transition-all duration-500"
          />
          <div
            style={{ width: `${profile.composition.industryMiningPct}%` }}
            title={`${t.census.indLabel}: ${profile.composition.industryMiningPct}%`}
            className="bg-[#D4AF37] h-full transition-all duration-500"
          />
          <div
            style={{ width: `${profile.composition.servicesTechPct}%` }}
            title={`${t.census.servLabel}: ${profile.composition.servicesTechPct}%`}
            className="bg-[#3A7CA5] h-full transition-all duration-500"
          />
        </div>

        {/* Legend Pills */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
          <div className="bg-[#161920]/80 border border-[#C5A059]/15 rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-[#A39E93]">
              <span className="w-2 h-2 rounded-xs bg-[#52B788] shrink-0" />
              <span className="truncate">{t.census.agriLabel}</span>
            </div>
            <div className="font-mono text-xs font-bold text-[#F4F1EA] mt-0.5 tabular-nums">
              {profile.composition.agriculturePct}%
            </div>
          </div>

          <div className="bg-[#161920]/80 border border-[#C5A059]/15 rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-[#A39E93]">
              <span className="w-2 h-2 rounded-xs bg-[#D4AF37] shrink-0" />
              <span className="truncate">{t.census.indLabel}</span>
            </div>
            <div className="font-mono text-xs font-bold text-[#D4AF37] mt-0.5 tabular-nums">
              {profile.composition.industryMiningPct}%
            </div>
          </div>

          <div className="bg-[#161920]/80 border border-[#C5A059]/15 rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-[#A39E93]">
              <span className="w-2 h-2 rounded-xs bg-[#3A7CA5] shrink-0" />
              <span className="truncate">{t.census.servLabel}</span>
            </div>
            <div className="font-mono text-xs font-bold text-[#F4F1EA] mt-0.5 tabular-nums">
              {profile.composition.servicesTechPct}%
            </div>
          </div>
        </div>

        {/* Analytical Transition Note */}
        <div className="pt-2 border-t border-[#C5A059]/15 flex items-start gap-2 text-xs text-[#F4F1EA]/85 leading-relaxed">
          <TrendingUp className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p>{profile.modernTransitionNote}</p>
        </div>
      </div>
    </div>
  );
};

export default CountyDemographicsChart;
