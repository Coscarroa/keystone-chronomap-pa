import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Briefcase,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export interface CreatorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupportModal: () => void;
}

const CREATOR_EMAIL = 'cesil.roa@gmail.com';
const CREATOR_LINKEDIN_URL = 'https://www.linkedin.com/in/cesilroa/';

export const CreatorContactModal: React.FC<CreatorContactModalProps> = ({
  isOpen,
  onClose,
  onOpenSupportModal,
}) => {
  const { t } = useTranslation();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Allow closing with the Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_EMAIL);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = CREATOR_EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md bg-black/80 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-contact-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0F1C30]/96 backdrop-blur-2xl border border-[#D4AF37]/65 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-[#F8FAFC]"
      >
        {/* Top Archival Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1D4ED8] via-[#D4AF37] to-[#B22234]" />

        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.creatorContact.closeAria}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#09111E]/90 hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-5">
          {/* Header with Professional Identity (CR Serif Monogram + Emblem + Name + Headline + Location + Availability) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#09111E] ring-2 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center">
                <span className="font-serif text-2xl font-bold tracking-wider text-[#D4AF37]">
                  CR
                </span>
              </div>
              <img
                src="/logo-keystone-chronomap.png"
                alt="Keystone ChronoMap Official Emblem"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full object-cover ring-2 ring-[#D4AF37] shadow-md"
              />
            </div>

            <div className="space-y-1.5 min-w-0 pr-0 sm:pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#09111E] border border-[#D4AF37]/50 text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                <Briefcase className="w-3 h-3" />
                <span>{t.creatorContact.kicker}</span>
              </div>

              <h2
                id="creator-contact-modal-title"
                className="font-serif text-2xl font-bold text-[#F8FAFC] tracking-tight"
              >
                Cesil Roa
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-[#D4AF37] leading-snug">
                {t.creatorContact.headline}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5 text-xs text-[#94A3B8]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{t.creatorContact.location}</span>
                </span>
                <span className="hidden sm:inline text-slate-600">·</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/75 border border-emerald-500/40 text-[11px] font-medium text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.creatorContact.availabilityBadge}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Concise Creator Biography Card (Focused on Analysis, Documentation & Technology) */}
          <div className="bg-[#09111E]/90 border border-[#D4AF37]/30 rounded-xl p-4 space-y-2 shadow-inner">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              {t.creatorContact.bioHeader}
            </div>
            <p className="text-xs sm:text-[13px] text-[#F8FAFC]/90 leading-relaxed">
              {t.creatorContact.bioSummary}
            </p>
          </div>

          {/* Core Skills Badges */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#94A3B8] font-semibold">
              {t.creatorContact.skillsHeader}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {t.creatorContact.coreSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-[#09111E] border border-[#D4AF37]/40 text-[11px] font-mono font-medium text-[#F8FAFC]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Contact & Action Buttons */}
          <div className="space-y-3 pt-1">
            {/* 1. Primary Button — Official LinkedIn Profile */}
            <a
              href={CREATOR_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#004182] border border-[#D4AF37]/50 text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(10,102,194,0.45)] cursor-pointer"
            >
              <svg
                className="w-4 h-4 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>{t.creatorContact.linkedinBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-85" />
            </a>

            {/* 2. Secondary Row — Direct Email + Copy Button + Mailto */}
            <div className="bg-[#09111E]/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <a
                href={`mailto:${CREATOR_EMAIL}`}
                className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-[#0F1C30] transition-colors min-w-0 group"
                title={t.creatorContact.sendEmailTitle}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0F1C30] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                    {t.creatorContact.directEmailLabel}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-[#F8FAFC] group-hover:text-[#D4AF37] truncate">
                    {CREATOR_EMAIL}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedEmail
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                      : 'bg-[#0F1C30] hover:bg-[#1E3A8A] border-[#D4AF37]/50 text-[#F8FAFC]'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{t.creatorContact.copiedBadge}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t.creatorContact.copyEmailBtn}</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${CREATOR_EMAIL}`}
                  className="px-3 py-2 rounded-lg bg-[#1D4ED8]/85 hover:bg-[#1D4ED8] border border-[#D4AF37]/60 text-xs font-semibold text-[#F8FAFC] transition-colors flex items-center justify-center gap-1"
                  title={t.creatorContact.sendEmailTitle}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.creatorContact.emailActionBtn}</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3. Subtle Footer Link to Community Support Modal */}
          <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSupportModal();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D4AF37] hover:text-[#F8FAFC] hover:underline transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/25" />
              <span>{t.creatorContact.supportLink}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#09111E] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              {t.creatorContact.closeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorContactModal;
