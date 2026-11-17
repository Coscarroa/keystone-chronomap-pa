import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Settings,
  RotateCcw,
  Zap,
  Bot,
} from 'lucide-react';
import { CountyRecord, HistoricalEra } from '../data/paCountiesData';
import {
  AIAgentContext,
  AIUIAction,
  getContextualQuickChips,
  processAIAgentQuery,
} from '../services/aiAgentBrain';
import {
  isVoiceRecognitionSupported,
  VoiceRecognitionController,
} from '../services/voiceRecognitionService';
import {
  NarrationRate,
  speakTextDirect,
  stopDirectSpeech,
} from '../services/speechService';
import { useTranslation } from '../context/LanguageContext';

interface ChatMessageItem {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionBadge?: string;
  timestamp: string;
}

interface KeystoneAIAssistantProps {
  selectedCounty: CountyRecord | null;
  activeEra: HistoricalEra;
  isTeacherMode: boolean;
  isCompareMode: boolean;
  onExecuteAction: (action: AIUIAction) => void;
}

/**
 * Renders lightweight bold (**text**) and line breaks cleanly inside chat bubbles
 */
const FormattedChatText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1" />;
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={lIdx}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-[#D4AF37]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={pIdx} className="italic text-[#E2E8F0]">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const KeystoneAIAssistant: React.FC<KeystoneAIAssistantProps> = ({
  selectedCounty,
  activeEra,
  isTeacherMode,
  isCompareMode,
  onExecuteAction,
}) => {
  const { language, t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoSpeakVoiceReplies, setAutoSpeakVoiceReplies] =
    useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<NarrationRate>(1);

  const activeCountyName = selectedCounty?.name || 'Philadelphia';

  const [messages, setMessages] = useState<ChatMessageItem[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: t.aiAssistant.welcomeMessage(activeCountyName),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const [quickChips, setQuickChips] = useState<string[]>(() =>
    getContextualQuickChips({
      selectedCounty,
      activeEra,
      language,
      isTeacherMode,
      isCompareMode,
    })
  );

  const voiceControllerRef = useRef<VoiceRecognitionController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const voiceSupported = isVoiceRecognitionSupported();

  // Keep quick suggestion chips and welcome message synced with county & language
  useEffect(() => {
    const ctx: AIAgentContext = {
      selectedCounty,
      activeEra,
      language,
      isTeacherMode,
      isCompareMode,
    };
    setQuickChips(getContextualQuickChips(ctx));
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [
          {
            ...prev[0],
            text: t.aiAssistant.welcomeMessage(activeCountyName),
          },
        ];
      }
      return prev;
    });
  }, [
    selectedCounty,
    activeEra,
    language,
    isTeacherMode,
    isCompareMode,
    activeCountyName,
    t.aiAssistant,
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Cleanup microphone & TTS on unmount
  useEffect(() => {
    return () => {
      voiceControllerRef.current?.stop();
      stopDirectSpeech();
    };
  }, []);

  const handleSpeakMessage = useCallback(
    (msgId: string, text: string) => {
      if (speakingMessageId === msgId) {
        stopDirectSpeech();
        setSpeakingMessageId(null);
        return;
      }
      setSpeakingMessageId(msgId);
      speakTextDirect(text, language, speechRate, () => {
        setSpeakingMessageId((curr) => (curr === msgId ? null : curr));
      });
    },
    [speakingMessageId, language, speechRate]
  );

  const submitUserQuery = useCallback(
    (rawText: string, triggeredByVoice: boolean) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      const nowStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const userMsg: ChatMessageItem = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: nowStr,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setIsTyping(true);
      setMicError(null);

      window.setTimeout(() => {
        const ctx: AIAgentContext = {
          selectedCounty,
          activeEra,
          language,
          isTeacherMode,
          isCompareMode,
        };

        const aiResult = processAIAgentQuery(trimmed, ctx);
        const aiMsgId = `ai-${Date.now()}`;

        const aiMsg: ChatMessageItem = {
          id: aiMsgId,
          sender: 'ai',
          text: aiResult.replyText,
          actionBadge: aiResult.actionBadge,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [...prev, aiMsg]);
        setQuickChips(aiResult.followUpSuggestions);
        setIsTyping(false);

        if (aiResult.action) {
          onExecuteAction(aiResult.action);
        }

        // Automatically read aloud if triggered via Microphone or if Auto-Voice is enabled
        if (triggeredByVoice || autoSpeakVoiceReplies) {
          setSpeakingMessageId(aiMsgId);
          speakTextDirect(aiResult.replyText, language, speechRate, () => {
            setSpeakingMessageId((curr) => (curr === aiMsgId ? null : curr));
          });
        }
      }, 340);
    },
    [
      selectedCounty,
      activeEra,
      language,
      isTeacherMode,
      isCompareMode,
      onExecuteAction,
      autoSpeakVoiceReplies,
      speechRate,
    ]
  );

  const handleToggleMicrophone = () => {
    if (!voiceSupported) {
      setMicError(t.aiAssistant.micPermissionError);
      return;
    }

    if (isListening) {
      voiceControllerRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Stop any ongoing speech synthesis so microphone doesn't record the AI's own voice
    stopDirectSpeech();
    setSpeakingMessageId(null);
    setMicError(null);

    if (!voiceControllerRef.current) {
      voiceControllerRef.current = new VoiceRecognitionController();
    }

    voiceControllerRef.current.start({
      language,
      onInterimTranscript: (interim) => {
        setInputText(interim);
      },
      onFinalTranscript: (finalText) => {
        setInputText(finalText);
        submitUserQuery(finalText, true);
      },
      onListeningChange: (listening) => {
        setIsListening(listening);
      },
      onError: () => {
        setIsListening(false);
        setMicError(t.aiAssistant.micPermissionError);
      },
    });
  };

  const handleResetConversation = () => {
    stopDirectSpeech();
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'ai',
        text: t.aiAssistant.welcomeMessage(activeCountyName),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-24 left-4 z-40 no-print">
      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t.aiAssistant.headerTitle}
          className="mb-3 w-[calc(100vw-2rem)] sm:w-96 h-[490px] max-h-[74vh] flex flex-col bg-[#0F1C30]/95 backdrop-blur-xl border-2 border-[#D4AF37]/75 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.88)] text-[#F8FAFC] overflow-hidden"
        >
          {/* Chat Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#09111E] via-[#0F1C30] to-[#1E3A8A]/70 border-b border-slate-700/80 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(29,78,216,0.6)]">
                <Bot className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5 truncate">
                  <span>{t.aiAssistant.headerTitle}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#09111E] border border-[#D4AF37]/60 font-mono text-[9px] text-[#D4AF37] uppercase">
                    {language.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#CBD5E1] truncate">
                  {t.aiAssistant.headerSubtitle(activeCountyName)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                title={t.aiAssistant.settingsTitle}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  showSettings
                    ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                    : 'bg-[#09111E]/80 border-slate-700 text-[#94A3B8] hover:text-[#D4AF37]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetConversation}
                title={t.aiAssistant.clearChatTitle}
                className="p-1.5 rounded-lg bg-[#09111E]/80 hover:bg-[#1E3A8A] border border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopDirectSpeech();
                  voiceControllerRef.current?.stop();
                  setIsListening(false);
                  setIsOpen(false);
                }}
                aria-label="Close AI Guide"
                className="p-1.5 rounded-lg bg-[#09111E]/80 hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Voice & Narration Settings Bar */}
          {showSettings && (
            <div className="px-4 py-2.5 bg-[#09111E] border-b border-slate-800 space-y-2 text-xs shrink-0">
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-[#CBD5E1]">
                  {t.aiAssistant.autoVoiceLabel}
                </span>
                <input
                  type="checkbox"
                  checked={autoSpeakVoiceReplies}
                  onChange={(e) => setAutoSpeakVoiceReplies(e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
              </label>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[#CBD5E1]">
                  {t.aiAssistant.speechSpeedLabel}
                </span>
                <div className="flex items-center gap-1">
                  {([1, 1.2] as NarrationRate[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSpeechRate(r)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] border cursor-pointer ${
                        speechRate === r
                          ? 'bg-[#D4AF37] text-[#09111E] border-[#D4AF37] font-bold'
                          : 'bg-[#0F1C30] text-[#94A3B8] border-slate-700'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              const isSpeakingThis = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isAI ? 'items-start' : 'items-end'
                  }`}
                >
                  {/* Golden Action Execution Badge */}
                  {msg.actionBadge && (
                    <div className="mb-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] font-mono text-[10px] font-bold text-[#D4AF37]">
                      <Zap className="w-3 h-3" />
                      <span>{msg.actionBadge}</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs ${
                      isAI
                        ? 'bg-[#09111E]/95 border border-slate-700/90 text-[#F8FAFC]'
                        : 'bg-[#1D4ED8] border border-[#D4AF37]/60 text-[#F8FAFC]'
                    }`}
                  >
                    <FormattedChatText text={msg.text} />

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] text-[#94A3B8]">
                        {msg.timestamp}
                      </span>

                      {isAI && (
                        <button
                          type="button"
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          title={
                            isSpeakingThis
                              ? t.aiAssistant.stopSpeechTitle
                              : t.aiAssistant.listenReplyTitle
                          }
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] flex items-center gap-1 transition-colors cursor-pointer border ${
                            isSpeakingThis
                              ? 'bg-[#B22234] border-[#D4AF37] text-[#F8FAFC]'
                              : 'bg-[#0F1C30] hover:bg-[#1E3A8A] border-slate-700 text-[#D4AF37]'
                          }`}
                        >
                          {isSpeakingThis ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>🔊</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 350ms Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#09111E]/85 border border-slate-800 text-[11px] font-mono text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>{t.aiAssistant.typingIndicator}</span>
              </div>
            )}

            {micError && (
              <div className="p-2.5 rounded-xl bg-[#B22234]/25 border border-[#B22234] text-[11px] text-[#F8FAFC]">
                {micError}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#09111E]/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => submitUserQuery(chip, false)}
                className="px-2.5 py-1 rounded-full bg-[#0F1C30] hover:bg-[#1D4ED8] border border-[#D4AF37]/50 text-[11px] font-medium text-[#F8FAFC] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="px-3.5 py-1.5 bg-[#B22234] text-[#F8FAFC] font-mono text-[11px] font-bold flex items-center justify-between animate-pulse shrink-0">
              <span>{t.aiAssistant.listeningStatus}</span>
              <span className="text-[10px] text-[#D4AF37]">● REC</span>
            </div>
          )}

          {/* Bottom Input & Bidirectional Voice Recognition Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitUserQuery(inputText, false);
            }}
            className="p-2.5 bg-[#09111E] border-t border-slate-800 flex items-center gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.aiAssistant.inputPlaceholder}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#0F1C30] border border-slate-700 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F8FAFC] placeholder-[#94A3B8]"
            />

            {voiceSupported && (
              <button
                type="button"
                onClick={handleToggleMicrophone}
                title={t.aiAssistant.micBtnTitle}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-[#B22234] border-[#D4AF37] text-[#F8FAFC] animate-pulse shadow-[0_0_15px_rgba(178,34,52,0.8)]'
                    : 'bg-[#0F1C30] hover:bg-[#1E3A8A] border-[#D4AF37]/60 text-[#D4AF37]'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              type="submit"
              disabled={!inputText.trim()}
              title={t.aiAssistant.sendBtnTitle}
              className="p-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E3A8A] disabled:opacity-40 border border-[#D4AF37] text-[#F8FAFC] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Launcher Button (Bottom-Left) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            if (prev) {
              stopDirectSpeech();
              voiceControllerRef.current?.stop();
              setIsListening(false);
            }
            return !prev;
          });
        }}
        aria-label={t.aiAssistant.fabAria}
        className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#1D4ED8] via-[#1E3A8A] to-[#0F1C30] hover:from-[#2563EB] hover:to-[#1E3A8A] border-2 border-[#D4AF37] shadow-[0_0_24px_rgba(29,78,216,0.6)] text-[#F8FAFC] flex items-center gap-2 transition-all cursor-pointer group"
      >
        <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
        <span className="font-serif text-xs sm:text-sm font-bold tracking-wide">
          {t.aiAssistant.fabLabel}
        </span>
        <span className="px-1.5 py-0.5 rounded-full bg-[#B22234] border border-[#D4AF37]/80 font-mono text-[9px] font-bold text-[#F8FAFC]">
          🎤 {language.toUpperCase()}
        </span>
      </button>
    </div>
  );
};

export default KeystoneAIAssistant;
