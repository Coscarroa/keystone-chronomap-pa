import React, { useEffect, useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Mountain,
  Compass,
  MapPin,
  ExternalLink,
  Wind,
  Droplets,
  Sparkles,
} from 'lucide-react';
import { CountyRecord, PA_REGIONS } from '../data/paCountiesData';
import {
  describeWeatherCode,
  fetchLiveCountySnapshot,
  LiveCountySnapshotData,
} from '../services/liveCountyDataService';
import { useTranslation } from '../context/LanguageContext';
import {
  getLocalizedCountyDossier,
  getLocalizedRegion,
} from '../i18n/translations';

interface LiveCountyWidgetProps {
  county: CountyRecord;
}

const LiveCountySkeleton: React.FC = () => (
  <div className="bg-[#0F1C30] border border-blue-500/30 rounded-2xl overflow-hidden shadow-xl animate-pulse space-y-4 p-4">
    <div className="h-44 w-full rounded-xl bg-slate-800/80 border border-slate-700/60" />
    <div className="grid grid-cols-2 gap-2.5">
      <div className="h-20 rounded-xl bg-slate-800/70 border border-slate-700/50 p-3" />
      <div className="h-20 rounded-xl bg-slate-800/70 border border-slate-700/50 p-3" />
      <div className="h-20 rounded-xl bg-slate-800/70 border border-slate-700/50 p-3" />
      <div className="h-20 rounded-xl bg-slate-800/70 border border-slate-700/50 p-3" />
    </div>
    <div className="space-y-2 pt-1">
      <div className="h-3 w-48 bg-slate-700 rounded" />
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="h-3 w-11/12 bg-slate-800 rounded" />
      <div className="h-3 w-4/5 bg-slate-800 rounded" />
    </div>
  </div>
);

const WeatherDynamicIcon: React.FC<{
  iconType: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog';
}> = ({ iconType }) => {
  switch (iconType) {
    case 'sun':
      return <Sun className="w-4 h-4 text-[#D4AF37]" />;
    case 'rain':
      return <CloudRain className="w-4 h-4 text-sky-400" />;
    case 'snow':
      return <CloudSnow className="w-4 h-4 text-sky-200" />;
    case 'storm':
      return <CloudLightning className="w-4 h-4 text-amber-400" />;
    case 'fog':
      return <CloudFog className="w-4 h-4 text-slate-300" />;
    default:
      return <Cloud className="w-4 h-4 text-sky-300" />;
  }
};

export const LiveCountyWidget: React.FC<LiveCountyWidgetProps> = ({
  county,
}) => {
  const { language, locale, t } = useTranslation();
  const [snapshot, setSnapshot] = useState<LiveCountySnapshotData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setImgError(false);

    fetchLiveCountySnapshot(county.name, language)
      .then((data) => {
        if (isMounted) {
          setSnapshot(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [county.name, language]);

  if (isLoading || !snapshot) {
    return <LiveCountySkeleton />;
  }

  const locRegion = getLocalizedRegion(county.region, language);
  const locDossier = getLocalizedCountyDossier(county, language);
  const regionMeta = PA_REGIONS[county.region];

  const weatherMeta = snapshot.weather
    ? describeWeatherCode(snapshot.weather.weatherCode, language)
    : null;

  return (
    <div className="bg-[#0F1C30] border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.65)] space-y-4">
      {/* 1. Automatic Visual Header with Wikipedia County Photo & Pulsing Green LIVE DATA Badge */}
      <div className="relative h-44 w-full bg-[#09111E] overflow-hidden border-b border-blue-500/25">
        {snapshot.wikipedia.imageUrl && !imgError ? (
          <img
            src={snapshot.wikipedia.imageUrl}
            alt={snapshot.wikipedia.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] via-[#0F1C30] to-[#09111E] flex items-center justify-center p-6 text-center">
            <div className="space-y-1">
              <div className="font-serif text-xl font-bold text-[#D4AF37]">
                {county.name} County, PA
              </div>
              <div className="text-xs text-[#94A3B8]">
                {county.countySeat} · Est. {county.founded}
              </div>
            </div>
          </div>
        )}

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C30] via-[#09111E]/35 to-transparent" />

        {/* Pulsing Green LIVE DATA Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#09111E]/90 backdrop-blur-md border border-emerald-500/50 flex items-center gap-1.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-400">
            {t.liveCounty.liveDataBadge}
          </span>
        </div>

        {/* FIPS & County Seat Tag */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#09111E]/85 backdrop-blur-md border border-[#D4AF37]/50 font-mono text-[10px] text-[#D4AF37]">
          FIPS {county.fips} · {county.countySeat}
        </div>

        {/* Bottom Caption inside Image Header */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif text-base font-bold text-[#F8FAFC] truncate drop-shadow">
              {snapshot.wikipedia.title}
            </h3>
            <p className="text-[11px] text-[#94A3B8] truncate">
              {snapshot.wikipedia.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 4-KPI Real-Time Indicator Grid */}
      <div className="px-4 grid grid-cols-2 gap-2.5">
        {/* KPI 1: Current Weather (Open-Meteo Live) */}
        <div className="bg-[#09111E]/80 border border-slate-700/70 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-wider text-[#94A3B8]">
            <span>{t.liveCounty.kpiWeather}</span>
            {weatherMeta && (
              <WeatherDynamicIcon iconType={weatherMeta.iconType} />
            )}
          </div>

          {snapshot.weather && weatherMeta ? (
            <>
              <div className="font-mono text-base font-bold text-[#F8FAFC] tabular-nums">
                {snapshot.weather.tempF}°F{' '}
                <span className="text-xs font-normal text-[#94A3B8]">
                  / {snapshot.weather.tempC}°C
                </span>
              </div>
              <div className="text-[11px] text-[#D4AF37] font-medium truncate">
                {weatherMeta.label}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] pt-0.5">
                <span className="inline-flex items-center gap-0.5">
                  <Wind className="w-2.5 h-2.5 text-sky-400" />
                  {snapshot.weather.windMph} mph
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5 text-sky-400" />
                  {snapshot.weather.humidity}%
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#94A3B8] pt-1">N/A</div>
          )}
        </div>

        {/* KPI 2: Topographic Elevation (ASL) */}
        <div className="bg-[#09111E]/80 border border-slate-700/70 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-wider text-[#94A3B8]">
            <span>{t.liveCounty.kpiElevation}</span>
            <Mountain className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <div className="font-mono text-base font-bold text-[#F8FAFC] tabular-nums">
            {snapshot.weather
              ? `${snapshot.weather.elevationFeet.toLocaleString(locale)} ft`
              : '—'}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono tabular-nums">
            {snapshot.weather
              ? `${snapshot.weather.elevationMeters.toLocaleString(locale)} m ASL`
              : county.countySeat}
          </div>
        </div>

        {/* KPI 3: Exact Geographic Coordinates */}
        <div className="bg-[#09111E]/80 border border-slate-700/70 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-wider text-[#94A3B8]">
            <span>{t.liveCounty.kpiCoordinates}</span>
            <Compass className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="font-mono text-xs font-bold text-[#F8FAFC] tabular-nums">
            {snapshot.coordinates.lat.toFixed(4)}° N
          </div>
          <div className="font-mono text-xs text-[#D4AF37] tabular-nums">
            {Math.abs(snapshot.coordinates.lng).toFixed(4)}° W
          </div>
        </div>

        {/* KPI 4: Area & Region */}
        <div className="bg-[#09111E]/80 border border-slate-700/70 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-wider text-[#94A3B8]">
            <span>{t.liveCounty.kpiAreaRegion}</span>
            <MapPin className="w-3.5 h-3.5 text-[#B22234]" />
          </div>
          <div className="font-mono text-sm font-bold text-[#F8FAFC] tabular-nums">
            {county.areaSqMi.toLocaleString(locale)} mi²
          </div>
          <div className="text-[11px] text-[#D4AF37] truncate flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-xs shrink-0"
              style={{ backgroundColor: regionMeta.badgeColor }}
            />
            <span className="truncate">{locRegion.shortName}</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Facts & Live Encyclopedic Summary from Wikipedia */}
      <div className="px-4 pb-4 space-y-3">
        <div className="bg-[#09111E]/75 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>{t.liveCounty.quickFactsTitle}</span>
            </span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              {t.liveCounty.updatedAtPrefix} {snapshot.fetchedAt}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-[#F8FAFC]/90 leading-relaxed">
            {snapshot.wikipedia.extract || locDossier.historicalImportance}
          </p>

          <div className="pt-1.5">
            <a
              href={snapshot.wikipedia.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-[#1D4ED8] border border-[#D4AF37]/60 text-xs font-semibold text-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{t.liveCounty.readOnWikiBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </a>
          </div>
        </div>

        <div className="text-[10px] text-[#94A3B8] text-center font-mono">
          {t.liveCounty.sourceLabel}
        </div>
      </div>
    </div>
  );
};

export default LiveCountyWidget;
