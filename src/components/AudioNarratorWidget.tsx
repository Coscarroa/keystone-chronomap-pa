import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import {
  BilingualNarrationScript,
  isSpeechSynthesisSupported,
  NarrationLanguage,
  NarrationRate,
  pickBestVoice,
} from '../services/speechService';
import { useTranslation } from '../context/LanguageContext';

interface AudioNarratorWidgetProps {
  script: BilingualNarrationScript;
  contextKey: string;
  compact?: boolean;
  label?: string;
}

export const AudioNarratorWidget: React.FC<AudioNarratorWidgetProps> = ({
  script,
  contextKey,
  compact = false,
  label,
}) => {
  const { language, t } = useTranslation();

  const [supported, setSupported] = useState<boolean>(false);
  const [lang, setLang] = useState<NarrationLanguage>(language);
  const [rate, setRate] = useState<NarrationRate>(1);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const statusRef = useRef<'idle' | 'playing' | 'paused'>('idle');
  statusRef.current = status;
  const rateRef = useRef<NarrationRate>(rate);
  rateRef.current = rate;

  // Check Web Speech API support on mount and warm up voices list
  useEffect(() => {
    const ok = isSpeechSynthesisSupported();
    setSupported(ok);
    if (!ok) return;

    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.(
      'voiceschanged',
      handleVoicesChanged
    );
    return () => {
      window.speechSynthesis.removeEventListener?.(
        'voiceschanged',
        handleVoicesChanged
      );
    };
  }, []);

  const stopNarration = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore browser speech cancel edge cases
    }
    utteranceRef.current = null;
    setStatus('idle');
  }, []);

  // Automatically cancel speech when contextKey changes or unmounts
  useEffect(() => {
    stopNarration();
    return () => {
      stopNarration();
    };
  }, [contextKey, stopNarration]);

  const startNarration = useCallback(
    (targetLang: NarrationLanguage, targetRate: NarrationRate) => {
      if (!isSpeechSynthesisSupported()) return;

      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }

      const textToRead = targetLang === 'en' ? script.en : script.es;
      if (!textToRead) return;

      const utterance = new window.SpeechSynthesisUtterance(textToRead);
      utterance.lang = targetLang === 'en' ? 'en-US' : 'es-US';
      utterance.rate = targetRate;
      utterance.pitch = 1.0;

      const bestVoice = pickBestVoice(targetLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      }

      utterance.onstart = () => setStatus('playing');
      utterance.onend = () => setStatus('idle');
      utterance.onerror = () => setStatus('idle');

      utteranceRef.current = utterance;
      setStatus('playing');
      window.speechSynthesis.speak(utterance);
    },
    [script]
  );

  // Sync automatically when the global application language (Header EN / ES switcher) changes
  useEffect(() => {
    setLang(language);
    if (statusRef.current === 'playing' || statusRef.current === 'paused') {
      startNarration(language, rateRef.current);
    }
  }, [language, startNarration]);

  const handlePlayPause = () => {
    if (!supported) return;

    if (status === 'idle') {
      startNarration(lang, rate);
    } else if (status === 'playing') {
      try {
        window.speechSynthesis.pause();
        setStatus('paused');
      } catch {
        stopNarration();
      }
    } else if (status === 'paused') {
      try {
        window.speechSynthesis.resume();
        setStatus('playing');
      } catch {
        startNarration(lang, rate);
      }
    }
  };

  const handleSelectLanguage = (newLang: NarrationLanguage) => {
    setLang(newLang);
    if (status === 'playing' || status === 'paused') {
      startNarration(newLang, rate);
    }
  };

  const handleToggleRate = () => {
    const nextRate: NarrationRate = rate === 1 ? 1.2 : 1;
    setRate(nextRate);
    if (status === 'playing' || status === 'paused') {
      startNarration(lang, nextRate);
    }
  };

  if (!supported) return null;

  const displayLabel = label || t.infoPanel.audioGuideLabel;

  return (
    <div
      className={`bg-[#0D0F12]/90 border border-[#C5A059]/35 rounded-xl ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
      } flex items-center justify-between gap-2 flex-wrap shadow-inner no-print`}
      role="region"
      aria-label={t.audioNarrator.regionAria}
    >
      {/* Left: Title + Animated Golden Soundwave Indicator */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            status === 'playing'
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
              : 'bg-[#161920] border-[#C5A059]/30 text-[#A39E93]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold text-[#F4F1EA] whitespace-nowrap">
            {displayLabel}
          </span>

          {status === 'playing' && (
            <div
              className="flex items-end gap-0.5 h-3.5 px-1"
              aria-label={t.audioNarrator.activeNarrationAria}
            >
              <span className="w-0.5 bg-[#D4AF37] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
              <span className="w-0.5 bg-[#D4AF37] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3.5" />
              <span className="w-0.5 bg-[#D4AF37] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2.5" />
              <span className="w-0.5 bg-[#D4AF37] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
            </div>
          )}

          {status === 'paused' && (
            <span className="text-[10px] font-mono uppercase text-[#D4AF37]">
              {t.audioNarrator.pausedBadge}
            </span>
          )}
        </div>
      </div>

      {/* Right: Bilingual Selector (🇺🇸 EN / 🇪🇸 ES), Speed (1x / 1.2x), Play/Pause & Stop */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="inline-flex rounded-lg bg-[#161920] p-0.5 border border-[#C5A059]/25">
          <button
            type="button"
            onClick={() => handleSelectLanguage('en')}
            title={t.audioNarrator.narrateEnTitle}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
              lang === 'en'
                ? 'bg-[#D4AF37] text-[#0D0F12]'
                : 'text-[#A39E93] hover:text-[#F4F1EA]'
            }`}
          >
            🇺🇸 EN
          </button>
          <button
            type="button"
            onClick={() => handleSelectLanguage('es')}
            title={t.audioNarrator.narrateEsTitle}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
              lang === 'es'
                ? 'bg-[#D4AF37] text-[#0D0F12]'
                : 'text-[#A39E93] hover:text-[#F4F1EA]'
            }`}
          >
            🇪🇸 ES
          </button>
        </div>

        {/* Playback Rate Selector (1x / 1.2x) */}
        <button
          type="button"
          onClick={handleToggleRate}
          title={t.audioNarrator.speedTitle}
          className="px-1.5 py-1 rounded-lg bg-[#161920] border border-[#C5A059]/25 font-mono text-[10px] text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer tabular-nums"
        >
          {rate}x
        </button>

        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={handlePlayPause}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
            status === 'playing'
              ? 'bg-[#1D3557] text-[#F4F1EA] border-[#D4AF37]'
              : 'bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] border-[#D4AF37]'
          }`}
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-3 h-3" />
              <span>{t.audioNarrator.pauseBtn}</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>
                {status === 'paused'
                  ? t.audioNarrator.resumeBtn
                  : t.audioNarrator.listenBtn}
              </span>
            </>
          )}
        </button>

        {/* Stop Button */}
        {status !== 'idle' && (
          <button
            type="button"
            onClick={stopNarration}
            title={t.audioNarrator.stopTitle}
            aria-label={t.audioNarrator.stopTitle}
            className="p-1 rounded-lg bg-[#9B2226]/85 hover:bg-[#9B2226] text-[#F4F1EA] transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioNarratorWidget;
