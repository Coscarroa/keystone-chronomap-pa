import { AppLanguage } from '../i18n/translations';

// Web Speech API SpeechRecognition TypeScript definitions
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onend: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: BrowserSpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((
        this: BrowserSpeechRecognition,
        ev: SpeechRecognitionErrorEvent
      ) => void)
    | null;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

/**
 * Checks whether the current browser supports Web Speech API SpeechRecognition.
 */
export function isVoiceRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

export interface VoiceRecognitionCallbacks {
  language: AppLanguage;
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onListeningChange: (isListening: boolean) => void;
  onError: (errorCode: string) => void;
}

export class VoiceRecognitionController {
  private recognition: BrowserSpeechRecognition | null = null;
  private isListening = false;

  public start(callbacks: VoiceRecognitionCallbacks): boolean {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      callbacks.onError('unsupported');
      return false;
    }

    this.stop();

    try {
      const rec = new Ctor();
      this.recognition = rec;
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = callbacks.language === 'en' ? 'en-US' : 'es-US';

      let finalCaptured = '';

      rec.onstart = () => {
        this.isListening = true;
        callbacks.onListeningChange(true);
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        if (interimTranscript.trim()) {
          callbacks.onInterimTranscript(interimTranscript.trim());
        }

        if (finalTranscript.trim()) {
          finalCaptured = finalTranscript.trim();
          callbacks.onFinalTranscript(finalCaptured);
        }
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false;
        callbacks.onListeningChange(false);
        if (event.error !== 'aborted') {
          callbacks.onError(event.error || 'unknown');
        }
      };

      rec.onend = () => {
        this.isListening = false;
        callbacks.onListeningChange(false);
      };

      rec.start();
      return true;
    } catch {
      this.isListening = false;
      callbacks.onListeningChange(false);
      callbacks.onError('start_failed');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        if (this.isListening) {
          this.recognition.stop();
        } else {
          this.recognition.abort();
        }
      } catch {
        // Ignore stop errors
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}
