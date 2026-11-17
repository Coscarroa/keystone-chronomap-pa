import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Heart,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SupportTab = 'fiat' | 'crypto';

interface CryptoWalletItem {
  id: 'btc' | 'eth' | 'ada' | 'sol';
  name: string;
  ticker: string;
  network: string;
  address: string;
  accentColor: string;
}

const ZELLE_EMAIL = 'Cesil.Roa@gmail.com';
const CASH_APP_TAG = '$CesilRoa';
const CASH_APP_URL = 'https://cash.app';

const CRYPTO_WALLETS: CryptoWalletItem[] = [
  {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    ticker: 'BTC',
    network: 'Bitcoin Network',
    address: '3DhKBMsYeUC5ZEmtRZLSS9aBRtu1kgenQR',
    accentColor: '#F7931A',
  },
  {
    id: 'eth',
    name: 'Ethereum (ETH)',
    ticker: 'ETH',
    network: 'Ethereum (ERC-20)',
    address: '0xe1355E5C3d9938979BdEecA3eED040BA78B4b1ED',
    accentColor: '#627EEA',
  },
  {
    id: 'ada',
    name: 'Cardano (ADA)',
    ticker: 'ADA',
    network: 'Cardano Mainnet',
    address: 'addr1vypxplfll5xmxz3hpazz5wahqslpq3ef92gukkklrwq632qyt84hd',
    accentColor: '#3CC8C8',
  },
  {
    id: 'sol',
    name: 'Solana (SOL)',
    ticker: 'SOL',
    network: 'Solana Network',
    address: '8LJQYiMyKtQnnwnBDgm3xfJSktDJzNZ5ErsCukWNui4u',
    accentColor: '#14F195',
  },
];

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<SupportTab>('fiat');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [expandedQrId, setExpandedQrId] = useState<string | null>(null);

  // Close on Escape key
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

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      window.setTimeout(() => {
        setCopiedLabel((prev) => (prev === label ? null : prev));
      }, 2500);
    } catch {
      // Fallback for restricted clipboard environments
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedLabel(label);
        window.setTimeout(() => {
          setCopiedLabel((prev) => (prev === label ? null : prev));
        }, 2500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-fadeIn no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#161920] border border-[#C5A059]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Ornamental Gold Rule */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1D3557] via-[#D4AF37] to-[#9B2226]" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#C5A059]/25 flex items-start justify-between gap-4 bg-[#0D0F12]/60">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.support.modalKicker}</span>
            </div>

            <h2
              id="support-modal-title"
              className="font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA] tracking-tight flex items-center gap-2.5"
            >
              <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/20 shrink-0" />
              <span>{t.support.modalTitle}</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
              {t.support.impactMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Tab Navigation Bar */}
        <div className="px-6 pt-3.5 bg-[#0D0F12]/40 border-b border-[#C5A059]/20">
          <div
            role="tablist"
            aria-label="Donation Methods"
            className="grid grid-cols-2 gap-2.5 pb-3.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'fiat'}
              onClick={() => setActiveTab('fiat')}
              className={`px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between gap-2 ${
                activeTab === 'fiat'
                  ? 'bg-[#1D3557]/80 border-[#D4AF37] text-[#F4F1EA] shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                  : 'bg-[#0D0F12]/70 border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#C5A059]/50'
              }`}
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#F4F1EA]">
                  {t.support.tabZelleCashApp}
                </div>
                <div className="text-[11px] text-[#D4AF37] font-medium">
                  {t.support.tabZelleSubtitle}
                </div>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeTab === 'fiat' ? 'bg-[#D4AF37]' : 'bg-[#A39E93]/30'
                }`}
              />
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'crypto'}
              onClick={() => setActiveTab('crypto')}
              className={`px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between gap-2 ${
                activeTab === 'crypto'
                  ? 'bg-[#1D3557]/80 border-[#D4AF37] text-[#F4F1EA] shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                  : 'bg-[#0D0F12]/70 border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#C5A059]/50'
              }`}
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#F4F1EA]">
                  {t.support.tabCrypto}
                </div>
                <div className="text-[11px] text-[#D4AF37] font-mono">
                  {t.support.tabCryptoSubtitle}
                </div>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeTab === 'crypto' ? 'bg-[#D4AF37]' : 'bg-[#A39E93]/30'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'fiat' ? (
            /* TAB 1: ZELLE & CASH APP (Side-by-Side Cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Zelle */}
              <div className="bg-[#0D0F12]/90 border border-[#C5A059]/35 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-[#D4AF37]/70 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#6D1ED4]/25 border border-[#6D1ED4]/60 flex items-center justify-center font-serif font-bold text-sm text-[#D4AF37]">
                        Z
                      </span>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#F4F1EA]">
                          {t.support.zelleTitle}
                        </h3>
                        <p className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                          {t.support.zelleBadge}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161920] border border-[#C5A059]/25 rounded-lg p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A39E93]">
                      {t.support.zelleEmailLabel}
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-semibold text-[#F4F1EA] select-all break-all">
                      {ZELLE_EMAIL}
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  {copiedLabel === 'zelle' ? (
                    <div className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.support.copiedBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ZELLE_EMAIL, 'zelle')}
                      className="w-full py-2 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.support.copyEmailBtn}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Cash App */}
              <div className="bg-[#0D0F12]/90 border border-[#C5A059]/35 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-[#D4AF37]/70 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#00D632]/20 border border-[#00D632]/60 flex items-center justify-center font-mono font-bold text-sm text-[#00D632]">
                        $
                      </span>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#F4F1EA]">
                          {t.support.cashAppTitle}
                        </h3>
                        <p className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                          {t.support.cashAppBadge}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161920] border border-[#C5A059]/25 rounded-lg p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A39E93]">
                      {t.support.cashtagLabel}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-[#D4AF37] select-all">
                      {CASH_APP_TAG}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={CASH_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{t.support.openCashAppBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {copiedLabel === 'cashtag' ? (
                    <div className="w-full py-1.5 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.support.copiedBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(CASH_APP_TAG, 'cashtag')}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#161920] hover:bg-[#1D3557]/50 border border-[#C5A059]/35 text-[#F4F1EA] hover:text-[#D4AF37] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t.support.copyCashtagBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CRYPTOCURRENCIES (BTC, ETH, ADA, SOL) */
            <div className="space-y-3">
              {CRYPTO_WALLETS.map((wallet) => {
                const isCopied = copiedLabel === wallet.id;
                const isQrOpen = expandedQrId === wallet.id;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(
                  wallet.address
                )}`;

                return (
                  <div
                    key={wallet.id}
                    className="bg-[#0D0F12]/90 border border-[#C5A059]/30 hover:border-[#C5A059]/60 rounded-xl p-3.5 transition-colors space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: wallet.accentColor }}
                        />
                        <span className="font-serif text-sm font-bold text-[#F4F1EA]">
                          {wallet.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#161920] border border-[#C5A059]/30 font-mono text-[10px] text-[#D4AF37]">
                          {wallet.network}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Optional View QR Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedQrId((prev) =>
                              prev === wallet.id ? null : wallet.id
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                            isQrOpen
                              ? 'bg-[#1D3557] border-[#D4AF37] text-[#D4AF37]'
                              : 'bg-[#161920] border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37]'
                          }`}
                        >
                          <QrCode className="w-3 h-3" />
                          <span>
                            {isQrOpen
                              ? t.support.hideQrBtn
                              : t.support.viewQrBtn}
                          </span>
                        </button>

                        {/* 1-Click Safe Copy Button */}
                        {isCopied ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/85 border border-emerald-500/60 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{t.support.copiedBadge}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(wallet.address, wallet.id)
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{t.support.copyAddressBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Exact Monospace Address Box */}
                    <div className="bg-[#161920] border border-[#C5A059]/20 rounded-lg px-3 py-2 font-mono text-xs text-[#F4F1EA] break-all select-all">
                      {wallet.address}
                    </div>

                    {/* Expandable Dynamic QR Code */}
                    {isQrOpen && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 bg-[#161920]/80 border border-[#C5A059]/25 rounded-lg p-3">
                        <img
                          src={qrUrl}
                          alt={`${wallet.name} QR Code`}
                          width={128}
                          height={128}
                          loading="lazy"
                          className="w-28 h-28 rounded-lg bg-white p-1.5 border border-[#D4AF37]/50 shrink-0"
                        />
                        <div className="space-y-1 text-center sm:text-left">
                          <div className="text-xs font-serif font-semibold text-[#D4AF37]">
                            {wallet.name} · {wallet.network}
                          </div>
                          <div className="text-[11px] text-[#A39E93]">
                            {t.support.qrScanHint}
                          </div>
                          <div className="font-mono text-[10px] text-[#F4F1EA]/80 break-all">
                            {wallet.address}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Security Footnote */}
              <div className="pt-2 flex items-start gap-2 text-xs text-[#A39E93] bg-[#0D0F12]/60 border border-[#C5A059]/20 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{t.support.securityNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0D0F12]/80 border-t border-[#C5A059]/25 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#A39E93] truncate">
            {t.support.footerCopyright}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#161920] hover:bg-[#1D3557]/60 border border-[#C5A059]/40 text-xs font-medium text-[#F4F1EA] hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
          >
            {t.support.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
