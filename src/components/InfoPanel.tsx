import React, { useState, Suspense, useMemo } from 'react';
import {
  X,
  Landmark,
  Calendar,
  MapPin,
  ScrollText,
  TrendingUp,
  Compass,
  Feather,
  ChevronRight,
  Users,
  Swords,
  ExternalLink,
  BookOpen,
  BarChart3,
  Radio,
  Box,
} from 'lucide-react';
import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HistoricalEra,
  PA_REGIONS,
} from '../data/paCountiesData';
import {
  PA_LEADERS_DATA,
  PALeaderRecord,
  WikiLeaderEnrichment,
} from '../services/paLeadersService';
import {
  HISTORICAL_EVENTS_DATA,
  HistoricalEventItem,
} from '../data/historicalEventsData';
import {
  PHMC_CATEGORIES,
  PHMC_MARKERS_DATA,
  PhmcMarkerRecord,
} from '../data/phmcMarkersData';
import {
  FieldTripStop,
  MAX_FIELD_TRIP_STOPS,
} from './FieldTripBuilder';
import { PRIMARY_SOURCES_DATA } from '../data/primarySourcesData';
import { LeaderPortraitAvatar } from './LeaderDetailModal';
import AudioNarratorWidget from './AudioNarratorWidget';
import { buildCountyNarrationScript } from '../services/speechService';
import { useTranslation } from '../context/LanguageContext';
import {
  getLocalizedCountyDossier,
  getLocalizedEra,
  getLocalizedEvent,
  getLocalizedRegion,
} from '../i18n/translations';

import LiveCountyWidget from './LiveCountyWidget';

const LazyDemographicsModule = React.lazy(
  () => import('./DemographicsModule')
);

interface InfoPanelProps {
  county: CountyRecord | null;
  activeEra: HistoricalEra;
  onClose: () => void;
  onSelectCounty: (county: CountyRecord) => void;
  onSelectRegion: (region: CountyRecord['region']) => void;
  wikiLeadersMap: Record<string, WikiLeaderEnrichment>;
  onSelectLeader: (leader: PALeaderRecord) => void;
  onSelectEvent: (event: HistoricalEventItem) => void;
  onSelectPhmcMarker: (marker: PhmcMarkerRecord) => void;
  fieldTripStops: FieldTripStop[];
  onAddFieldTripStop: (stop: FieldTripStop) => void;
  onOpen3DStage?: (countyName: string) => void;
}

const GoldenChartSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-20 rounded-xl bg-[#0D0F12]/80 border border-[#D4AF37]/30 p-3.5 space-y-2">
      <div className="h-2.5 w-36 bg-[#D4AF37]/30 rounded" />
      <div className="h-4 w-64 bg-[#C5A059]/20 rounded" />
    </div>
    <div className="h-[245px] rounded-xl bg-[#0D0F12]/80 border border-[#C5A059]/25 p-4 flex flex-col justify-between">
      <div className="h-3 w-48 bg-[#D4AF37]/25 rounded" />
      <div className="h-[165px] w-full bg-gradient-to-t from-[#D4AF37]/15 to-transparent rounded-lg border-b border-[#D4AF37]/40" />
    </div>
    <div className="h-28 rounded-xl bg-[#0D0F12]/80 border border-[#C5A059]/25 p-3.5" />
  </div>
);

export const InfoPanel: React.FC<InfoPanelProps> = ({
  county,
  activeEra,
  onClose,
  onSelectCounty,
  onSelectRegion,
  wikiLeadersMap,
  onSelectLeader,
  onSelectEvent,
  onSelectPhmcMarker,
  fieldTripStops,
  onAddFieldTripStop,
  onOpen3DStage,
}) => {
  const { language, locale, t, tData } = useTranslation();
  const [activeTab, setActiveTab] = useState<'narrative' | 'census' | 'live'>(
    'narrative'
  );

  const narrationScript = useMemo(() => {
    if (!county) return { es: '', en: '' };
    return buildCountyNarrationScript(county, activeEra.yearLabel);
  }, [county, activeEra.yearLabel]);

  if (!county) return null;

  const regionMeta = PA_REGIONS[county.region];
  const locRegion = getLocalizedRegion(county.region, language);
  const locEra = getLocalizedEra(activeEra, language);
  const locCounty = getLocalizedCountyDossier(county, language);
  const isFoundedInEra = county.founded <= activeEra.cutoffYear;

  const countyLeaders = PA_LEADERS_DATA.filter((l) =>
    l.linkedCounties.includes(county.name)
  );
  const displayedLeaders =
    countyLeaders.length > 0
      ? countyLeaders
      : PA_LEADERS_DATA.filter((l) => l.eraIds.includes(activeEra.id)).slice(
          0,
          3
        );

  const countyEvents = HISTORICAL_EVENTS_DATA.filter(
    (ev) => ev.countyName === county.name
  );

  const countyPhmcMarkers = PHMC_MARKERS_DATA.filter(
    (m) => m.countyName === county.name
  );

  const matchedCapsule =
    PRIMARY_SOURCES_DATA.find((src) =>
      src.linkedCounties.includes(county.name)
    ) ||
    PRIMARY_SOURCES_DATA.find((src) => src.eraIds.includes(activeEra.id)) ||
    PRIMARY_SOURCES_DATA[0];

  const regionalPeers = ALL_COUNTIES_LIST.filter(
    (c) => c.region === county.region && c.name !== county.name
  ).slice(0, 4);

  return (
    <aside
      aria-label={t.infoPanel.countyTitle(county.name)}
      className="fixed top-20 right-4 bottom-24 w-[calc(100vw-2rem)] sm:w-[410px] z-30 flex flex-col bg-[#0F1C30]/88 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-opacity duration-200 no-print"
    >
      {/* Top Archival Header Bar */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-700/60 bg-[#09111E]/65 shrink-0 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-medium">
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: regionMeta.badgeColor }}
                aria-hidden="true"
              />
              <span className="truncate">{locRegion.title}</span>
              <span aria-hidden="true" className="text-[#C5A059]/50">
                ·
              </span>
              <span className="font-mono tabular-nums text-[#A39E93] shrink-0">
                FIPS {county.fips}
              </span>
            </div>

            <h2 className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
              {t.infoPanel.countyTitle(county.name)}
            </h2>

            <p className="mt-0.5 text-xs text-[#A39E93] flex items-center gap-1.5 flex-wrap">
              <span>{county.name} County, PA</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {county.areaSqMi.toLocaleString(locale)} mi²
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  isFoundedInEra ? 'text-[#D4AF37]' : 'text-[#A39E93] italic'
                }
              >
                {isFoundedInEra
                  ? t.infoPanel.incorporatedInEra(locEra.yearLabel)
                  : t.infoPanel.foundedLater(county.founded)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.infoPanel.closePanelAria}
            className="p-1.5 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Museum Accession Metadata Grid (dl) */}
        <dl className="pt-2 border-t border-[#C5A059]/20 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#D4AF37]" />
              <span>{t.infoPanel.foundedYearLabel}</span>
            </dt>
            <dd className="mt-0.5 font-serif text-lg font-bold text-[#D4AF37] tabular-nums">
              {county.founded}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] flex items-center gap-1.5">
              <Landmark className="w-3 h-3 text-[#D4AF37]" />
              <span>{t.infoPanel.countySeatLabel}</span>
            </dt>
            <dd className="mt-0.5 font-serif text-base font-semibold text-[#F4F1EA] truncate">
              {county.countySeat}
            </dd>
          </div>
        </dl>

        {/* Bilingual Historical Audio-Guide Widget (Web Speech API) */}
        <AudioNarratorWidget
          script={narrationScript}
          contextKey={`county-${county.fips}`}
          compact={true}
          label={t.infoPanel.audioGuideLabel}
        />

        {/* 3-Tab Switcher: 📜 Historical Dossier | 📊 Census & Industry | 📡 Live Overview */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#09111E]/90 border border-slate-700/70">
          <button
            type="button"
            onClick={() => setActiveTab('narrative')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              activeTab === 'narrative'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ScrollText className="w-3 h-3 shrink-0" />
            <span className="truncate">{t.infoPanel.tabNarrative}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('census')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              activeTab === 'census'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border border-[#D4AF37]/80 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <BarChart3 className="w-3 h-3 shrink-0" />
            <span className="truncate">{t.infoPanel.tabCensus}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              activeTab === 'live'
                ? 'bg-[#B22234] text-[#F8FAFC] border border-[#D4AF37]/90 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Radio className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{t.infoPanel.tabLive}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="p-5 overflow-y-auto space-y-4 text-sm leading-relaxed flex-1">
        {activeTab === 'live' ? (
          <LiveCountyWidget county={county} />
        ) : activeTab === 'census' ? (
          <>
            <Suspense fallback={<GoldenChartSkeleton />}>
              <LazyDemographicsModule county={county} />
            </Suspense>

            {/* Quick Regional Comparison in Demographics Mode */}
            <section className="pt-2 border-t border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#A39E93]">
                  {t.infoPanel.compareWithPeer(locRegion.shortName)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {regionalPeers.map((peer) => (
                  <button
                    key={peer.fips}
                    type="button"
                    onClick={() => onSelectCounty(peer)}
                    className="px-2.5 py-2 rounded-lg bg-[#0D0F12]/60 hover:bg-[#1D3557]/50 border border-[#C5A059]/20 hover:border-[#D4AF37] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-serif text-xs font-semibold text-[#F4F1EA] truncate">
                      {peer.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums">
                      {t.infoPanel.foundedAbbr} {peer.founded} · {peer.areaSqMi}{' '}
                      mi²
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Tab 1: Historical Narrative Dossier */
          <>
            {/* Etymology / Origin of Name */}
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-1">
                <ScrollText className="w-3.5 h-3.5" />
                <span>{t.infoPanel.sec01Etymology}</span>
              </h3>
              <p className="text-[#F4F1EA]/90 text-[13px] leading-relaxed">
                {locCounty.etymology}
              </p>
            </section>

            <div className="border-t border-[#C5A059]/15" />

            {/* Historical Importance */}
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{t.infoPanel.sec02Historical}</span>
              </h3>
              <p className="text-[#F4F1EA]/90 text-[13px] leading-relaxed first-letter:font-serif first-letter:text-2xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-1">
                {locCounty.historicalImportance}
              </p>
            </section>

            <div className="border-t border-[#C5A059]/15" />

            {/* Economic Importance */}
            <section>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.infoPanel.sec03Economic}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('census')}
                  className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {t.infoPanel.viewChartLink}
                </button>
              </div>
              <p className="text-[#F4F1EA]/90 text-[13px] leading-relaxed">
                {locCounty.economicProfile}
              </p>
            </section>

            {/* County Historical Events & Battles (if any) */}
            {countyEvents.length > 0 && (
              <>
                <div className="border-t border-[#C5A059]/15" />
                <section>
                  <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-2">
                    <Swords className="w-3.5 h-3.5" />
                    <span>{t.infoPanel.milestonesInCounty(county.name)}</span>
                  </h3>
                  <div className="space-y-1.5">
                    {countyEvents.map((ev) => {
                      const locEv = getLocalizedEvent(ev, language);
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => onSelectEvent(ev)}
                          className="w-full text-left px-3 py-2 rounded-lg bg-[#0D0F12]/70 hover:bg-[#1D3557]/50 border border-[#C5A059]/25 hover:border-[#D4AF37] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="font-serif text-xs font-semibold text-[#F4F1EA] truncate">
                              {locEv.shortTitle}
                            </div>
                            <div className="text-[11px] text-[#A39E93]">
                              {locEv.dateLabel}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* Official PHMC Blue-and-Gold Historical Plaques in this County */}
            {countyPhmcMarkers.length > 0 && (
              <>
                <div className="border-t border-[#C5A059]/15" />
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2">
                      <span>
                        {t.infoPanel.phmcInCounty(countyPhmcMarkers.length)}
                      </span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#A39E93]">
                      {t.infoPanel.blueAndGoldLabel}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {countyPhmcMarkers.map((marker) => {
                      const catMeta = PHMC_CATEGORIES.find(
                        (c) => c.id === marker.category
                      );
                      const stopId = `phmc-${marker.id}`;
                      const isAdded = fieldTripStops.some(
                        (s) => s.id === stopId || s.id === marker.id
                      );
                      const isFull =
                        !isAdded &&
                        fieldTripStops.length >= MAX_FIELD_TRIP_STOPS;

                      return (
                        <div
                          key={marker.id}
                          className="p-2.5 rounded-xl bg-[#1D3557]/35 border border-[#D4AF37]/45 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectPhmcMarker(marker)}
                              className="text-left min-w-0 group cursor-pointer"
                            >
                              <div className="font-serif text-xs font-bold text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-[#D4AF37]"
                                  style={{
                                    backgroundColor:
                                      catMeta?.badgeColor || '#1D3557',
                                  }}
                                />
                                <span className="truncate">{marker.title}</span>
                              </div>
                              <div className="text-[11px] text-[#A39E93] mt-0.5">
                                {marker.cityOrTown} ·{' '}
                                {t.infoPanel.eventYearLabel} {marker.eventYear}{' '}
                                · {t.infoPanel.dedicatedYearLabel}{' '}
                                {marker.dedicatedYear}
                              </div>
                            </button>
                            <button
                              type="button"
                              disabled={isAdded || isFull}
                              onClick={() =>
                                onAddFieldTripStop({
                                  id: stopId,
                                  title: marker.title,
                                  subtitle: `${marker.cityOrTown} (${marker.eventYear}) · PHMC`,
                                  countyName: marker.countyName,
                                  sourceType: 'phmc',
                                  position: marker.position,
                                  description: tData(marker, 'plaqueText'),
                                })
                              }
                              className={`px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 transition-colors cursor-pointer border ${
                                isAdded
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 cursor-default'
                                  : isFull
                                  ? 'bg-[#0D0F12]/50 text-[#A39E93]/50 border-[#C5A059]/15 cursor-not-allowed'
                                  : 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA] hover:bg-[#e3be42]'
                              }`}
                            >
                              {isAdded
                                ? t.infoPanel.inFieldTripBadge
                                : t.infoPanel.addToFieldTripShort}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* Historical Figures & Governors via MediaWiki API + 3D Stage Launcher */}
            <div className="border-t border-[#C5A059]/15" />
            <section>
              {onOpen3DStage && (
                <button
                  type="button"
                  onClick={() => onOpen3DStage(county.name)}
                  className="w-full mb-3 p-3 rounded-xl bg-gradient-to-r from-[#1E3A8A]/85 via-[#0F1C30] to-[#B22234]/75 hover:from-[#1D4ED8] hover:to-[#B22234] border border-[#D4AF37] text-left transition-all flex items-center justify-between gap-3 cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.45)] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#09111E] border border-[#D4AF37] flex items-center justify-center shrink-0">
                      <Box className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors truncate">
                        {t.infoPanel.open3dStageBtn(county.name)}
                      </div>
                      <div className="text-[10px] font-mono text-[#CBD5E1] truncate">
                        {t.infoPanel.open3dStageSub}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </button>
              )}

              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {countyLeaders.length > 0
                    ? t.infoPanel.leadersLinkedTo(county.name)
                    : t.infoPanel.leadersOfEra(locEra.yearLabel)}
                </span>
              </h3>

              <div className="space-y-2">
                {displayedLeaders.map((leader) => (
                  <button
                    key={leader.id}
                    type="button"
                    onClick={() => onSelectLeader(leader)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#0D0F12]/70 hover:bg-[#1D3557]/50 border border-[#C5A059]/25 hover:border-[#D4AF37] transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <LeaderPortraitAvatar
                      leader={leader}
                      wikiInfo={wikiLeadersMap[leader.id]}
                      sizeClass="w-11 h-11"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-sm font-bold text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors truncate">
                        {leader.name}
                      </div>
                      <div className="text-[11px] text-[#A39E93] truncate">
                        {leader.roleTitle}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums mt-0.5">
                        {t.infoPanel.viewBioAndBalance}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Primary Source Capsule & Socratic Question */}
            {matchedCapsule && (
              <>
                <div className="border-t border-[#C5A059]/15" />
                <section className="bg-[#0D0F12]/70 border border-[#D4AF37]/35 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {t.infoPanel.primarySourceCapsule(matchedCapsule.year)}
                      </span>
                    </h3>
                    <span className="font-mono text-[10px] text-[#A39E93]">
                      {matchedCapsule.pdeStandardCode.split(' / ')[0]}
                    </span>
                  </div>

                  <div className="font-serif text-xs font-bold text-[#F4F1EA]">
                    {matchedCapsule.shortTitle}
                  </div>

                  <blockquote className="pl-2.5 border-l-2 border-[#D4AF37] font-serif italic text-xs text-[#F4F1EA]/90 leading-relaxed">
                    {language === 'en'
                      ? matchedCapsule.originalQuoteEn
                      : matchedCapsule.translatedQuoteEs}
                  </blockquote>

                  <div className="p-2.5 rounded-lg bg-[#161920] border border-[#C5A059]/20 text-[11px] text-[#F4F1EA]/90 leading-relaxed">
                    <strong className="text-[#D4AF37] font-mono uppercase text-[10px] block mb-0.5">
                      {t.infoPanel.socraticQuestionLabel}
                    </strong>
                    {matchedCapsule.socraticQuestions[0]}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {matchedCapsule.officialRepositories.map((repo) => (
                      <a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md bg-[#161920] hover:bg-[#1D3557] border border-[#C5A059]/30 text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 transition-colors"
                      >
                        <span>
                          {t.infoPanel.archivePrefix} {repo.domainLabel}
                        </span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Indigenous Heritage & Landmark */}
            <section className="space-y-2.5 bg-[#0D0F12]/60 border border-[#C5A059]/20 rounded-lg p-3.5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] flex items-center gap-1.5">
                  <Feather className="w-3 h-3 text-[#D4AF37]" />
                  <span>{t.infoPanel.indigenousRootsLabel}</span>
                </div>
                <p className="mt-1 text-xs text-[#F4F1EA]/90">
                  {locCounty.indigenousHeritage}
                </p>
              </div>

              <div className="border-t border-[#C5A059]/15 pt-2">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{t.infoPanel.keyLandmarkLabel}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-[#D4AF37]">
                  {locCounty.keyLandmark}
                </p>
              </div>
            </section>

            {/* Regional Navigation */}
            <section className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#A39E93]">
                  {t.infoPanel.otherCountiesIn(locRegion.shortName)}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectRegion(county.region)}
                  className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {t.infoPanel.filterRegionBtn}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {regionalPeers.map((peer) => (
                  <button
                    key={peer.fips}
                    type="button"
                    onClick={() => onSelectCounty(peer)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0D0F12]/50 hover:bg-[#1D3557]/40 border border-[#C5A059]/15 hover:border-[#C5A059]/40 transition-colors flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <span className="font-serif text-xs font-semibold text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors">
                        {peer.name} County
                      </span>
                      <span className="text-[11px] text-[#A39E93] ml-2">
                        · {t.header.seatLabel} {peer.countySeat}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[11px] text-[#D4AF37] tabular-nums">
                        {peer.founded}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#A39E93] group-hover:text-[#D4AF37]" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
};

export default InfoPanel;
