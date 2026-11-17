import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  AlertTriangle,
  Building2,
  ScrollText,
  MapPin,
  ExternalLink,
  ZoomIn,
  Users,
} from 'lucide-react';
import {
  PA_LEADERS_DATA,
  PALeaderRecord,
  WikiLeaderEnrichment,
} from '../services/paLeadersService';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import AudioNarratorWidget from './AudioNarratorWidget';
import { buildLeaderNarrationScript } from '../services/speechService';

interface LeaderDetailModalProps {
  isOpen: boolean;
  initialLeader: PALeaderRecord | null;
  wikiMap: Record<string, WikiLeaderEnrichment>;
  activeEraId: string;
  onClose: () => void;
  onSelectCounty: (county: CountyRecord) => void;
}

export const LeaderPortraitAvatar: React.FC<{
  leader: PALeaderRecord;
  wikiInfo?: WikiLeaderEnrichment;
  sizeClass?: string;
}> = ({ leader, wikiInfo, sizeClass = 'w-12 h-12' }) => {
  const [imgError, setImgError] = useState(false);
  const src = wikiInfo?.portraitUrl || leader.defaultPortraitUrl;

  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (imgError) {
    const initials = leader.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-[#1D3557] to-[#0D0F12] border border-[#D4AF37]/60 flex items-center justify-center font-serif font-bold text-[#D4AF37] shrink-0`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Retrato de ${leader.name}`}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`${sizeClass} rounded-full object-cover object-top border border-[#D4AF37]/60 shrink-0 bg-[#0D0F12]`}
    />
  );
};

export const LeaderDetailModal: React.FC<LeaderDetailModalProps> = ({
  isOpen,
  initialLeader,
  wikiMap,
  activeEraId,
  onClose,
  onSelectCounty,
}) => {
  const [selectedLeader, setSelectedLeader] = useState<PALeaderRecord>(
    initialLeader || PA_LEADERS_DATA[0]
  );
  const [isPortraitZoomed, setIsPortraitZoomed] = useState<boolean>(false);
  const [portraitLoadFailed, setPortraitLoadFailed] = useState<boolean>(false);

  useEffect(() => {
    if (initialLeader) {
      setSelectedLeader(initialLeader);
    }
  }, [initialLeader]);

  useEffect(() => {
    setIsPortraitZoomed(false);
    setPortraitLoadFailed(false);
  }, [selectedLeader]);

  if (!isOpen) return null;

  const wikiInfo = wikiMap[selectedLeader.id];
  const portraitSrc =
    wikiInfo?.portraitUrl || selectedLeader.defaultPortraitUrl;
  const leaderNarrationScript = buildLeaderNarrationScript(
    selectedLeader,
    wikiInfo?.wikiExtract
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-label={`Biografía e historial de ${selectedLeader.name}`}
    >
      <div className="w-full max-w-6xl max-h-[90vh] bg-[#161920]/95 border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12]/60 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>
                GALERÍA DE FIGURAS HISTÓRICAS Y GOBERNADORES · MEDIAWIKI ARCHIVE
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
              Líderes, Estadistas y Gobernadores de Pensilvania (1681–Presente)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería de líderes"
            className="p-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Portrait Selector Bar for all 11 Figures */}
        <div className="px-6 py-3 border-b border-[#C5A059]/20 bg-[#161920] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {PA_LEADERS_DATA.map((leader) => {
            const isSelected = selectedLeader.id === leader.id;
            const matchesEra =
              activeEraId !== 'present' && leader.eraIds.includes(activeEraId);
            return (
              <button
                key={leader.id}
                type="button"
                onClick={() => setSelectedLeader(leader)}
                className={`px-3 py-1.5 rounded-xl text-left transition-all flex items-center gap-2.5 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1D3557]/85 border-[#D4AF37] text-[#F4F1EA] shadow-md'
                    : matchesEra
                      ? 'bg-[#0D0F12]/80 border-[#D4AF37]/40 text-[#F4F1EA]'
                      : 'bg-[#0D0F12]/50 border-[#C5A059]/15 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <LeaderPortraitAvatar
                  leader={leader}
                  wikiInfo={wikiMap[leader.id]}
                  sizeClass="w-8 h-8"
                />
                <div>
                  <div className="font-serif text-xs font-bold whitespace-nowrap">
                    {leader.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#D4AF37] tabular-nums whitespace-nowrap">
                    {leader.lifespanOrTerm.split(' · ')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 cols: Portrait Card, Zoom & Linked Counties */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0D0F12]/80 border border-[#C5A059]/30 rounded-xl p-4 flex flex-col items-center text-center relative">
              {/* Clickable Portrait to Enlarge */}
              <div
                onClick={() => setIsPortraitZoomed((z) => !z)}
                title="Haga clic para ampliar o reducir el retrato"
                className="relative group cursor-zoom-in overflow-hidden rounded-xl border border-[#D4AF37]/50 bg-[#090B0E] w-full flex items-center justify-center"
              >
                {!portraitLoadFailed ? (
                  <img
                    src={portraitSrc}
                    alt={selectedLeader.name}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitLoadFailed(true)}
                    className={`w-full object-cover object-top transition-all duration-300 ${
                      isPortraitZoomed ? 'max-h-[460px] scale-105' : 'h-64'
                    }`}
                  />
                ) : (
                  <div className="h-64 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#1D3557]/40 to-[#0D0F12]">
                    <span className="font-serif text-4xl font-bold text-[#D4AF37]">
                      {selectedLeader.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                    <span className="mt-2 text-xs text-[#A39E93]">
                      {selectedLeader.name}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-[#161920]/90 border border-[#C5A059]/40 text-[10px] text-[#D4AF37] flex items-center gap-1 opacity-85 group-hover:opacity-100">
                  <ZoomIn className="w-3 h-3" />
                  <span>{isPortraitZoomed ? 'Reducir' : 'Ampliar retrato'}</span>
                </div>
              </div>

              <h3 className="mt-3 font-serif text-2xl font-bold text-[#F4F1EA]">
                {selectedLeader.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#D4AF37]">
                {selectedLeader.roleTitle}
              </p>
              <p className="mt-1 font-mono text-xs text-[#A39E93] tabular-nums">
                {selectedLeader.lifespanOrTerm}
              </p>

              {/* Linked Counties in PA */}
              <div className="mt-4 pt-3 border-t border-[#C5A059]/20 w-full text-left">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] mb-2">
                  Condados Vinculados en el Mapa:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedLeader.linkedCounties.map((cName) => {
                    const county = PA_COUNTIES_DATA[cName];
                    if (!county) return null;
                    return (
                      <button
                        key={cName}
                        type="button"
                        onClick={() => {
                          onSelectCounty(county);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#161920] hover:bg-[#1D3557] border border-[#C5A059]/30 hover:border-[#D4AF37] text-xs text-[#F4F1EA] hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>{cName} County</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {wikiInfo?.wikiUrl && (
                <a
                  href={wikiInfo.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full py-2 px-3 rounded-lg bg-[#161920] border border-[#C5A059]/25 text-xs text-[#A39E93] hover:text-[#F4F1EA] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Consultar fuente en Wikipedia (MediaWiki)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Right 8 cols: Audio-Guide + Neutral Historical Balance (4 Required Sections) */}
          <div className="lg:col-span-8 space-y-4">
            <AudioNarratorWidget
              script={leaderNarrationScript}
              contextKey={`leader-${selectedLeader.id}`}
              label={`Audio-Biografía: ${selectedLeader.name}`}
            />

            {/* 1. Resumen de Gestión */}
            <section className="bg-[#0D0F12]/65 border border-[#C5A059]/25 rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-2">
                <ScrollText className="w-4 h-4" />
                <span>01. Resumen de Gestión y Contexto Histórico</span>
              </h4>
              <p className="text-sm text-[#F4F1EA]/90 leading-relaxed">
                {selectedLeader.managementSummary}
              </p>

              {wikiInfo?.wikiExtract && (
                <div className="mt-3 pt-3 border-t border-[#C5A059]/15 text-xs text-[#A39E93] italic leading-relaxed">
                  <span className="not-italic font-mono text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] block mb-1">
                    Extracto en vivo vía MediaWiki API (Wikipedia):
                  </span>
                  &ldquo;{wikiInfo.wikiExtract}&rdquo;
                </div>
              )}
            </section>

            {/* 2. Aportes y Logros */}
            <section className="bg-[#0D0F12]/65 border border-[#C5A059]/25 rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#52B788] font-semibold flex items-center gap-2 mb-2.5">
                <Award className="w-4 h-4" />
                <span>02. Aportes y Logros Principales</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13.5px] text-[#F4F1EA]/90 leading-relaxed">
                {selectedLeader.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#D4AF37] tabular-nums mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Controversias y Crisis */}
            <section className="bg-[#0D0F12]/65 border border-[#C5A059]/25 rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#E07A5F] font-semibold flex items-center gap-2 mb-2.5">
                <AlertTriangle className="w-4 h-4" />
                <span>03. Controversias, Contradicciones y Crisis</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13.5px] text-[#F4F1EA]/90 leading-relaxed">
                {selectedLeader.controversiesAndCrises.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#E07A5F] tabular-nums mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Instituciones u Obras Fundadas */}
            <section className="bg-[#0D0F12]/65 border border-[#C5A059]/25 rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-semibold flex items-center gap-2 mb-2.5">
                <Building2 className="w-4 h-4" />
                <span>04. Instituciones, Leyes u Obras Fundadas</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13.5px] text-[#F4F1EA]/90 leading-relaxed">
                {selectedLeader.institutionsFounded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#D4AF37] tabular-nums mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDetailModal;
