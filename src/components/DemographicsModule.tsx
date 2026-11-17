import React, { useState, useMemo, Suspense } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Globe2,
  HeartPulse,
  Baby,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CountyRecord } from '../data/paCountiesData';
import { getCountyFullDemographics } from '../data/paDemographicsFullData';
import { useTranslation } from '../context/LanguageContext';

const LazyCountyDemographicsChart = React.lazy(
  () => import('./CountyDemographicsChart')
);

interface DemographicsModuleProps {
  county: CountyRecord;
}

type DemographicsSubTab = 'static' | 'dynamic';

export const DemographicsModule: React.FC<DemographicsModuleProps> = ({
  county,
}) => {
  const { language, locale, t } = useTranslation();
  const [subTab, setSubTab] = useState<DemographicsSubTab>('static');
  const [showHistoricalSeries, setShowHistoricalSeries] =
    useState<boolean>(true);

  const demo = useMemo(() => getCountyFullDemographics(county), [county]);
  const { estatica, dinamica } = demo;

  const isPositiveNaturalGrowth = dinamica.crecimientoVegetativo >= 0;
  const isPositiveNetMigration = dinamica.migracion.saldoNeto >= 0;

  return (
    <div className="space-y-4">
      {/* Top Segmented Control: 1. Structure (Static) vs. 2. Dynamics (Evolution) */}
      <div
        role="tablist"
        aria-label="Demographic Analysis Categories"
        className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#09111E] border border-slate-700/80 shadow-inner"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'static'}
          onClick={() => setSubTab('static')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center truncate ${
            subTab === 'static'
              ? 'bg-[#1D4ED8] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          {t.demographics.subTabStatic}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'dynamic'}
          onClick={() => setSubTab('dynamic')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center truncate ${
            subTab === 'dynamic'
              ? 'bg-[#B22234] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          {t.demographics.subTabDynamic}
        </button>
      </div>

      {subTab === 'static' ? (
        /* =====================================================================
           VIEW 1: POPULATION STRUCTURE (STATIC DEMOGRAPHY)
           ===================================================================== */
        <div className="space-y-3.5">
          {/* 1. Primary Card: Total Population, Density & Urban vs. Rural Split Bar */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#94A3B8] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.demographics.totalPopLabel}</span>
                </div>
                <div className="font-serif text-2xl font-bold text-[#F8FAFC] tabular-nums mt-0.5">
                  {estatica.poblacionTotal.toLocaleString(locale)}
                </div>
              </div>

              <div className="text-right bg-[#0F1C30] border border-slate-700/60 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  {t.demographics.densityLabel}
                </div>
                <div className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums">
                  {estatica.densidadPoblacional.toLocaleString(locale)}{' '}
                  <span className="text-[10px] font-normal text-[#94A3B8]">
                    {t.demographics.densityUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Urban vs. Rural Split Progress Bar */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#F8FAFC] font-medium flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[#3B82F6]" />
                  {t.demographics.urbanLabel}:{' '}
                  <strong className="font-mono text-[#3B82F6]">
                    {estatica.urbanaPct}%
                  </strong>
                </span>
                <span className="text-[#94A3B8] font-medium">
                  {t.demographics.ruralLabel}:{' '}
                  <strong className="font-mono text-[#D4AF37]">
                    {estatica.ruralPct}%
                  </strong>
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-800 flex border border-slate-700/60">
                <div
                  style={{ width: `${estatica.urbanaPct}%` }}
                  className="bg-[#1D4ED8] h-full transition-all duration-500"
                  title={`${t.demographics.urbanLabel}: ${estatica.urbanaPct}%`}
                />
                <div
                  style={{ width: `${estatica.ruralPct}%` }}
                  className="bg-[#D4AF37] h-full transition-all duration-500"
                  title={`${t.demographics.ruralLabel}: ${estatica.ruralPct}%`}
                />
              </div>
            </div>
          </div>

          {/* 2. Demographic Pyramid (Age & Sex Diverging Horizontal BarChart) */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
                  {t.demographics.pyramidTitle}
                </h4>
                <p className="text-[11px] text-[#94A3B8]">
                  {t.demographics.pyramidSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-medium shrink-0">
                <span className="flex items-center gap-1 text-[#3B82F6]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6]" />
                  {t.demographics.menLabel}
                </span>
                <span className="flex items-center gap-1 text-[#E11D48]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#E11D48]" />
                  {t.demographics.womenLabel}
                </span>
              </div>
            </div>

            <div className="w-full h-[185px]">
              <ResponsiveContainer width="100%" height={185}>
                <BarChart
                  data={estatica.piramideEdadSexo}
                  layout="vertical"
                  stackOffset="sign"
                  margin={{ top: 4, right: 12, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.14)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[-22, 22]}
                    tickFormatter={(val: number) => `${Math.abs(val)}%`}
                    tick={{
                      fill: '#94A3B8',
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="ageGroup"
                    tick={{
                      fill: '#F8FAFC',
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${Math.abs(Number(value)).toFixed(1)}%`,
                      name === 'hombresNeg'
                        ? t.demographics.menLabel
                        : t.demographics.womenLabel,
                    ]}
                    contentStyle={{
                      backgroundColor: '#0F1C30',
                      borderColor: '#D4AF37',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <ReferenceLine x={0} stroke="#D4AF37" strokeWidth={1.2} />
                  <Bar
                    dataKey="hombresNeg"
                    stackId="pyramid"
                    fill="#3B82F6"
                    radius={[4, 0, 0, 4]}
                  />
                  <Bar
                    dataKey="mujeres"
                    stackId="pyramid"
                    fill="#E11D48"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Marital Status (4-KPI Grid) */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
              {t.demographics.maritalStatusTitle}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2 text-center">
                <div className="font-mono text-sm font-bold text-[#F8FAFC]">
                  {estatica.estadoCivil.casados}%
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                  {t.demographics.marriedLabel}
                </div>
              </div>
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2 text-center">
                <div className="font-mono text-sm font-bold text-[#3B82F6]">
                  {estatica.estadoCivil.solteros}%
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                  {t.demographics.singleLabel}
                </div>
              </div>
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2 text-center">
                <div className="font-mono text-sm font-bold text-[#D4AF37]">
                  {estatica.estadoCivil.divorciados}%
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                  {t.demographics.divorcedLabel}
                </div>
              </div>
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2 text-center">
                <div className="font-mono text-sm font-bold text-[#94A3B8]">
                  {estatica.estadoCivil.viudos}%
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                  {t.demographics.widowedLabel}
                </div>
              </div>
            </div>
          </div>

          {/* 4A. Social Attributes: Ethnic Origin & Linguistic Distribution */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.demographics.ethnicOriginTitle}</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              {[
                {
                  label: t.demographics.whiteLabel,
                  pct: estatica.atributosSociales.origenEtnico.whitePct,
                  color: '#3B82F6',
                },
                {
                  label: t.demographics.blackLabel,
                  pct: estatica.atributosSociales.origenEtnico.blackPct,
                  color: '#D4AF37',
                },
                {
                  label: t.demographics.hispanicLabel,
                  pct: estatica.atributosSociales.origenEtnico.hispanicPct,
                  color: '#E11D48',
                },
                {
                  label: t.demographics.asianLabel,
                  pct: estatica.atributosSociales.origenEtnico.asianPct,
                  color: '#10B981',
                },
                {
                  label: t.demographics.multiracialLabel,
                  pct: estatica.atributosSociales.origenEtnico.multiracialPct,
                  color: '#A855F7',
                },
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#F8FAFC]">{item.label}</span>
                    <span className="font-mono text-[#94A3B8] tabular-nums">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, item.pct)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Linguistic Distribution */}
            <div className="pt-2.5 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#94A3B8]">
                {t.demographics.languagesTitle}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2">
                  <div className="font-mono text-xs font-bold text-[#F8FAFC]">
                    {estatica.atributosSociales.lenguas.englishOnlyPct}%
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    {t.demographics.englishOnlyLabel}
                  </div>
                </div>
                <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2">
                  <div className="font-mono text-xs font-bold text-[#D4AF37]">
                    {estatica.atributosSociales.lenguas.spanishPct}%
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    {t.demographics.spanishLangLabel}
                  </div>
                </div>
                <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2">
                  <div className="font-mono text-xs font-bold text-[#3B82F6]">
                    {estatica.atributosSociales.lenguas.otherLanguagesPct}%
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    {t.demographics.otherLangLabel}
                  </div>
                </div>
              </div>
              {(estatica.atributosSociales.lenguas.otherLanguageNoteEn ||
                estatica.atributosSociales.lenguas.otherLanguageNoteEs) && (
                <div className="text-[11px] text-[#D4AF37]/90 italic">
                  *{' '}
                  {language === 'en'
                    ? estatica.atributosSociales.lenguas.otherLanguageNoteEn
                    : estatica.atributosSociales.lenguas.otherLanguageNoteEs}
                </div>
              )}
            </div>
          </div>

          {/* 4B. Social Attributes: Education & Labor Profile */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.demographics.eduLaborTitle}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8]">
                  {t.demographics.bachelorPlusLabel}
                </div>
                <div className="font-mono text-base font-bold text-[#F8FAFC] mt-0.5">
                  {estatica.atributosSociales.nivelEducativo.universitarioPct}%
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8]">
                  {t.demographics.highSchoolPlusLabel}
                </div>
                <div className="font-mono text-base font-bold text-[#D4AF37] mt-0.5">
                  {estatica.atributosSociales.nivelEducativo.secundariaPct}%
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#3B82F6]" />
                  <span>
                    {t.demographics.employedRateLabel} /{' '}
                    {t.demographics.unemploymentRateLabel}
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-[#F8FAFC] mt-0.5">
                  {estatica.atributosSociales.situacionLaboral.employedPct}%{' '}
                  <span className="text-xs text-[#94A3B8] font-normal">
                    ({estatica.atributosSociales.situacionLaboral.unemploymentPct}
                    % unemp.)
                  </span>
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8]">
                  {t.demographics.medianIncomeLabel}
                </div>
                <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">
                  $
                  {estatica.atributosSociales.situacionLaboral.medianHouseholdIncome.toLocaleString(
                    locale
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
           VIEW 2: POPULATION DYNAMICS (DYNAMIC DEMOGRAPHY)
           ===================================================================== */
        <div className="space-y-3.5">
          {/* 1. Vital Balance Card (Natality vs. Mortality & Natural Vegetative Growth) */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.demographics.vitalBalanceTitle}</span>
              </h4>
              <span className="font-mono text-[10px] text-[#94A3B8]">
                {t.demographics.perThousandUnit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  {t.demographics.birthRateLabel}
                </div>
                <div className="font-mono text-xl font-bold text-[#3B82F6] mt-0.5 tabular-nums">
                  {dinamica.tasaNatalidad}‰
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  {t.demographics.deathRateLabel}
                </div>
                <div className="font-mono text-xl font-bold text-[#E11D48] mt-0.5 tabular-nums">
                  {dinamica.tasaMortalidad}‰
                </div>
              </div>
            </div>

            {/* Natural / Vegetative Growth Highlight Banner */}
            <div
              className={`rounded-xl p-3 border flex items-center justify-between gap-2 ${
                isPositiveNaturalGrowth
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-[#B22234]/20 border-[#B22234]/60 text-rose-200'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  {isPositiveNaturalGrowth ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{t.demographics.naturalGrowthLabel}</span>
                </div>
                <div className="text-[10px] opacity-85">
                  {isPositiveNaturalGrowth
                    ? t.demographics.positiveGrowthBadge
                    : t.demographics.negativeGrowthBadge}
                </div>
              </div>

              <div className="font-mono text-lg font-bold tabular-nums">
                {dinamica.crecimientoVegetativo > 0 ? '+' : ''}
                {dinamica.crecimientoVegetativo}‰
              </div>
            </div>
          </div>

          {/* 2. Fertility & Public Health Indicators (3 KPI Cards) */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.demographics.healthFertilityTitle}</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-[#94A3B8] truncate">
                  {t.demographics.fertilityRateLabel}
                </div>
                <div className="font-mono text-base font-bold text-[#D4AF37] mt-1 tabular-nums">
                  {dinamica.tasaGlobalFecundidad}
                </div>
                <div className="text-[9px] text-[#94A3B8] truncate">
                  {t.demographics.fertilityUnit}
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-[#94A3B8] truncate">
                  {t.demographics.lifeExpectancyLabel}
                </div>
                <div className="font-mono text-base font-bold text-emerald-400 mt-1 tabular-nums">
                  {dinamica.esperanzaVida}
                </div>
                <div className="text-[9px] text-[#94A3B8] truncate">
                  {t.demographics.lifeExpectancyUnit}
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-[#94A3B8] truncate flex items-center justify-center gap-1">
                  <Baby className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">
                    {t.demographics.infantMortalityLabel}
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-[#F8FAFC] mt-1 tabular-nums">
                  {dinamica.mortalidadInfantil}‰
                </div>
                <div className="text-[9px] text-[#94A3B8] truncate">
                  {t.demographics.infantMortalityUnit}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Migration Flows (Domestic vs. International) */}
          <div className="bg-[#09111E]/85 border border-slate-700/70 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.demographics.migrationTitle}</span>
              </h4>

              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                  isPositiveNetMigration
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                    : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                }`}
              >
                {language === 'en'
                  ? dinamica.migracion.etiquetaSaldoEn
                  : dinamica.migracion.etiquetaSaldoEs}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8]">
                  {t.demographics.domesticMigrationLabel}
                </div>
                <div
                  className={`font-mono text-base font-bold mt-0.5 tabular-nums ${
                    dinamica.migracion.migracionInterna >= 0
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {dinamica.migracion.migracionInterna > 0 ? '+' : ''}
                  {dinamica.migracion.migracionInterna}‰
                </div>
              </div>

              <div className="bg-[#0F1C30] border border-slate-700/60 rounded-lg p-2.5">
                <div className="text-[10px] text-[#94A3B8]">
                  {t.demographics.internationalMigrationLabel}
                </div>
                <div className="font-mono text-base font-bold text-[#3B82F6] mt-0.5 tabular-nums">
                  {dinamica.migracion.inmigracionInternacional > 0 ? '+' : ''}
                  {dinamica.migracion.inmigracionInternacional}‰
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">
                {t.demographics.netMigrationLabel}:
              </span>
              <span className="font-mono font-bold text-[#F8FAFC] tabular-nums">
                {dinamica.migracion.saldoNeto > 0 ? '+' : ''}
                {dinamica.migracion.saldoNeto}‰
              </span>
            </div>
          </div>

          {/* 4. Collapsible Historical Census Evolution (1790–Present) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHistoricalSeries((prev) => !prev)}
              className="w-full py-2 px-3 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/50 border border-slate-700/70 text-xs font-semibold text-[#D4AF37] flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span>{t.demographics.historicalTrendToggle}</span>
              {showHistoricalSeries ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showHistoricalSeries && (
              <div className="mt-3">
                <Suspense fallback={null}>
                  <LazyCountyDemographicsChart county={county} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemographicsModule;
