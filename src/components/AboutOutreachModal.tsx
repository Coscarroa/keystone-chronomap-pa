import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Landmark,
  Compass,
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface AboutOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateTeacherMode: () => void;
  onOpenCountyCatalog: () => void;
}

const DEFAULT_OFFICIAL_URL =
  'https://ais-pre-fhpafyrqoimr2pemggvzum-162502178501.us-east5.run.app/';

export const AboutOutreachModal: React.FC<AboutOutreachModalProps> = ({
  isOpen,
  onClose,
  onActivateTeacherMode,
  onOpenCountyCatalog,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [copiedPitch, setCopiedPitch] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin + window.location.pathname
      : DEFAULT_OFFICIAL_URL;

  const fullPitchMessage = `${t.outreach.outreachPitchText} ${shareUrl}`;

  const linkedInShareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;
  const facebookShareHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}&quote=${encodeURIComponent(t.outreach.outreachPitchText)}`;
  const whatsAppShareHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    fullPitchMessage
  )}`;

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(fullPitchMessage);
      setCopiedPitch(true);
      window.setTimeout(() => setCopiedPitch(false), 2600);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullPitchMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedPitch(true);
      window.setTimeout(() => setCopiedPitch(false), 2600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09111E]/85 backdrop-blur-md no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-outreach-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0F1C30]/95 backdrop-blur-2xl border border-[#D4AF37]/65 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.88)] text-[#F8FAFC] divide-y divide-slate-800/90">
        {/* Top Institutional Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#09111E] via-[#0F1C30] to-[#1E3A8A]/40 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1E3A8A]/70 border border-[#D4AF37]/60 text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              <Landmark className="w-3 h-3" />
              <span>{t.outreach.modalKicker}</span>
            </div>
            <h2
              id="about-outreach-title"
              className="font-serif text-xl sm:text-2xl font-bold text-[#F8FAFC] leading-tight"
            >
              {t.outreach.modalTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              {t.outreach.modalSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.outreach.closeBtn}
            className="p-2 rounded-xl bg-[#09111E]/90 hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: 4 Scannable Sector Value-Proposition Cards */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
            {t.outreach.pillarsSectionTitle}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Card 1: K-12 Schools & PDE Educators */}
            <div className="bg-[#09111E]/85 border border-slate-700/75 hover:border-[#D4AF37]/70 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#1E3A8A]/75 border border-[#1D4ED8] font-mono text-[10px] font-semibold text-[#D4AF37]">
                    {t.outreach.pillar1Badge}
                  </span>
                  <GraduationCap className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#F8FAFC]">
                  {t.outreach.pillar1Title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t.outreach.pillar1Desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onActivateTeacherMode();
                  onClose();
                }}
                className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
              >
                <span>{t.outreach.pillar1Action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: County Historical Societies & Museums */}
            <div className="bg-[#09111E]/85 border border-slate-700/75 hover:border-[#D4AF37]/70 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#B22234]/80 border border-[#D4AF37]/60 font-mono text-[10px] font-semibold text-[#F8FAFC]">
                    {t.outreach.pillar2Badge}
                  </span>
                  <Landmark className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#F8FAFC]">
                  {t.outreach.pillar2Title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t.outreach.pillar2Desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenCountyCatalog();
                  onClose();
                }}
                className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
              >
                <span>{t.outreach.pillar2Action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Cultural Tourism & Heritage Areas */}
            <div className="bg-[#09111E]/85 border border-slate-700/75 hover:border-[#D4AF37]/70 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#1E3A8A]/75 border border-[#1D4ED8] font-mono text-[10px] font-semibold text-[#D4AF37]">
                    {t.outreach.pillar3Badge}
                  </span>
                  <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#F8FAFC]">
                  {t.outreach.pillar3Title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t.outreach.pillar3Desc}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
              >
                <span>{t.outreach.pillar3Action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Bilingual & Hispanic Communities (EN / ES) */}
            <div className="bg-[#09111E]/85 border border-slate-700/75 hover:border-[#D4AF37]/70 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#B22234]/80 border border-[#D4AF37]/60 font-mono text-[10px] font-semibold text-[#F8FAFC]">
                    {t.outreach.pillar4Badge}
                  </span>
                  <Globe className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#F8FAFC]">
                  {t.outreach.pillar4Title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {t.outreach.pillar4Desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
              >
                <span>
                  {t.outreach.pillar4Action} ({language.toUpperCase()} →{' '}
                  {language === 'en' ? 'ES' : 'EN'})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PWA / Chromebook Readiness Banner */}
          <div className="bg-[#09111E]/90 border border-slate-700/70 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-[#94A3B8]">
            <Laptop className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>{t.outreach.pwaInstallHint}</span>
          </div>
        </div>

        {/* Section 2: Quick Outreach & Community Sharing Kit */}
        <div className="p-5 sm:p-6 bg-[#09111E]/60 space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.outreach.shareSectionTitle}</span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              {t.outreach.shareSectionDesc}
            </p>
          </div>

          {/* 3 Social Outreach Links (LinkedIn, Facebook, WhatsApp) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href={linkedInShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/70 border border-slate-700 hover:border-[#D4AF37] transition-all flex items-center justify-between gap-2 group"
            >
              <div>
                <div className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37]">
                  {t.outreach.shareLinkedInBtn}
                </div>
                <div className="text-[10px] text-[#94A3B8]">
                  {t.outreach.shareLinkedInSub}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            </a>

            <a
              href={facebookShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/70 border border-slate-700 hover:border-[#D4AF37] transition-all flex items-center justify-between gap-2 group"
            >
              <div>
                <div className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37]">
                  {t.outreach.shareFacebookBtn}
                </div>
                <div className="text-[10px] text-[#94A3B8]">
                  {t.outreach.shareFacebookSub}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            </a>

            <a
              href={whatsAppShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/70 border border-slate-700 hover:border-[#D4AF37] transition-all flex items-center justify-between gap-2 group"
            >
              <div>
                <div className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37]">
                  {t.outreach.shareWhatsAppBtn}
                </div>
                <div className="text-[10px] text-[#94A3B8]">
                  {t.outreach.shareWhatsAppSub}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            </a>
          </div>

          {/* 1-Click Copy Official Link & Presentation Pitch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyPitch}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copiedPitch
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                  : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] border-[#D4AF37] text-[#F8FAFC] shadow-[0_0_20px_rgba(29,78,216,0.4)]'
              }`}
            >
              {copiedPitch ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{t.outreach.copiedOutreachBadge}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t.outreach.copyOutreachBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#09111E] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              {t.outreach.closeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOutreachModal;
