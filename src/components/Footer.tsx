import React from 'react';
import { Mail } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export interface FooterProps {
  onOpenLegalModal: (type: 'terms' | 'privacy') => void;
  onOpenContactModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalModal,
  onOpenContactModal,
}) => {
  const { t } = useTranslation();

  return (
    <footer
      role="contentinfo"
      aria-label={t.footer.ariaLabel}
      className="fixed bottom-0 left-0 right-0 z-30 h-9 px-4 bg-[#09111E]/95 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-4 no-print select-none"
    >
      {/* Left: Single-language Copyright & Independent Educational Notice */}
      <div className="truncate font-medium text-slate-300">
        {t.footer.copyrightLine}
      </div>

      {/* Right: Cleanly Spaced Links (Terms of Use | Privacy Policy | Contact) */}
      <nav
        aria-label={t.footer.navAriaLabel}
        className="flex items-center gap-2.5 shrink-0 whitespace-nowrap"
      >
        <button
          type="button"
          onClick={() => onOpenLegalModal('terms')}
          className="text-[#D4AF37]/95 hover:text-[#D4AF37] hover:underline font-medium transition-colors cursor-pointer"
        >
          {t.footer.termsLink}
        </button>

        <span className="text-slate-700" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          onClick={() => onOpenLegalModal('privacy')}
          className="text-[#D4AF37]/95 hover:text-[#D4AF37] hover:underline font-medium transition-colors cursor-pointer"
        >
          {t.footer.privacyLink}
        </button>

        <span className="text-slate-700" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          onClick={onOpenContactModal}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-[#D4AF37] hover:underline font-medium transition-colors cursor-pointer"
        >
          <Mail className="w-3 h-3 text-[#D4AF37]" />
          <span>{t.footer.contactLink}</span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
