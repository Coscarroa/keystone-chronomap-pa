import React, { useState, useEffect } from 'react';
import {
  X,
  Map,
  Layers,
  Box,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompareMode: () => void;
  onOpenMapsGallery: () => void;
  onActivateTeacherMode: () => void;
  onOpenEncyclopedia?: () => void;
  onOpenAIGuide?: () => void;
}

interface GuideStep {
  stepNumber: string;
  badge: { en: string; es: string };
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
  highlights: { en: string[]; es: string[] };
  actionLabel?: { en: string; es: string };
  actionType?: 'compare' | 'encyclopedia' | 'ai' | 'teacher';
  icon: React.ReactNode;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    stepNumber: '01',
    badge: {
      en: 'STEP 1 OF 5 · WELCOME & 67 COUNTIES EXPLORATION',
      es: 'PASO 1 DE 5 · BIENVENIDA Y EXPLORACIÓN DE LOS 67 CONDADOS',
    },
    title: {
      en: "1. Explore Pennsylvania's 67 Counties",
      es: '1. Explora los 67 Condados de Pensilvania',
    },
    subtitle: {
      en: 'Interactive GIS boundaries, live weather telemetry, 1790–Present census & bilingual audio guide',
      es: 'Fronteras GIS interactivas, clima en vivo, censo 1790–Presente y audio-guía bilingüe',
    },
    description: {
      en: 'Click any county on the map or use the top universal search bar. On the right, its historical dossier will open with live weather telemetry, static and dynamic census demographics (since 1790), and a bilingual audio guide.',
      es: 'Haz clic sobre cualquier condado en el mapa o usa el buscador superior. A la derecha se desplegará su ficha histórica, datos climáticos en vivo, demografía estática y dinámica (desde 1790) y audio-guía bilingüe.',
    },
    highlights: {
      en: [
        'Use the top universal search bar ("Search county or site...") to jump to any of the 67 counties, county seats, or PHMC plaques.',
        'Explore the 3 tabs inside the right-hand County Dossier: Historical Narrative, Census Demographics (1790–Present), and Live Weather/Elevation.',
        'Switch between EN (English) and ES (Spanish) anytime using the language toggle in the top header.',
      ],
      es: [
        'Usa el buscador superior ("Buscar condado o sitio...") para saltar al instante a cualquiera de los 67 condados, sedes condales o placas PHMC.',
        'Recorre las 3 pestañas del expediente derecho: Ficha Histórica, Demografía Censal (1790–Presente) y Clima/Altitud en Vivo.',
        'Alterna entre EN (Inglés) y ES (Español) en cualquier momento desde el selector de la barra superior.',
      ],
    },
    icon: <Map className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '02',
    badge: {
      en: 'STEP 2 OF 5 · LEFT CARTOGRAPHIC CONTROL RAIL',
      es: 'PASO 2 DE 5 · RIEL IZQUIERDO DE HERRAMIENTAS CARTOGRÁFICAS',
    },
    title: {
      en: '2. Time Travel & Compare Borders',
      es: '2. Viaja en el Tiempo y Compara Fronteras',
    },
    subtitle: {
      en: "1682 Penn's 3 Counties, 1787 Constitutional Union, Before vs. Today Slider & PHMC Plaques",
      es: '3 Condados de William Penn (1682), División de 1787, Cortina Antes vs. Hoy y Placas PHMC',
    },
    description: {
      en: "Use the vertical left control rail to switch between all 67 modern counties, William Penn's 3 original counties (1682), the 1787 Constitutional division, or slide the 'Before vs. Today' curtain. You can also toggle the official Blue-and-Gold PHMC plaques.",
      es: "Usa el riel vertical de la izquierda para alternar entre los 67 condados actuales, los 3 condados originales de William Penn (1682), la división de 1787 o deslizar la cortina 'Antes vs. Hoy'. También puedes activar las placas históricas Azul y Oro de la PHMC.",
    },
    highlights: {
      en: [
        '🗺️ Territories & Borders: Merge polygons with Turf.js into 1682 (3 Original Counties + Native Lands) or 1787 (18 Counties), or launch the Before vs. Today Split-Curtain.',
        '📍 Layers & PHMC Plaques: Toggle the 25 official Blue-and-Gold PHMC markers, historical battlefields, and animated campaign routes.',
        'Use the elevated bottom Timeline Bar to travel across 1681, 1776, 1861, 1870, 1950, and Present.',
      ],
      es: [
        '🗺️ Territorios y Fronteras: Fusiona polígonos con Turf.js hacia 1682 (3 Condados Originales + Tierras Indígenas) o 1787 (18 Condados), o abre la cortina Antes vs. Hoy.',
        '📍 Capas y Placas PHMC: Activa o filtra las 25 placas oficiales Azul y Oro de la PHMC, batallas e hitos con rutas animadas.',
        'Usa la barra cronológica inferior para viajar entre 1681, 1776, 1861, 1870, 1950 y Presente.',
      ],
    },
    actionLabel: {
      en: 'Try Before vs. Today Comparator',
      es: 'Probar Comparador Antes vs. Hoy',
    },
    actionType: 'compare',
    icon: <Layers className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '03',
    badge: {
      en: 'STEP 3 OF 5 · 2D ILLUSTRATED ENCYCLOPEDIA & 3D DIORAMAS',
      es: 'PASO 3 DE 5 · ENCICLOPEDIA ILUSTRADA 2D Y DIORAMAS 3D',
    },
    title: {
      en: '3. 3D Historical Figures & Comic PDFs',
      es: '3. Personajes en 3D e Historietas Descargables',
    },
    subtitle: {
      en: '360° WebGL museum dioramas for all 67 counties & 6-chapter downloadable comic book in PDF',
      es: 'Dioramas WebGL en 360° para los 67 condados y libro de historietas de 6 capítulos en PDF',
    },
    description: {
      en: "Click '2D/3D Encyclopedia' in the top bar to rotate 360° 3D historical figures matched to the selected county (such as Benjamin Franklin, Abraham Lincoln, or Scranton pioneers) and download illustrated comic books in PDF.",
      es: "Pulsa 'Enciclopedia 2D/3D' en la barra superior para rotar en 360° a figuras históricas según el condado seleccionado (como Benjamin Franklin, Abraham Lincoln o pioneros de Scranton) y descargar libros de historietas ilustradas en PDF.",
    },
    highlights: {
      en: [
        '🎨 2D Comic Strips: Read and listen to 6 illustrated chapters covering Pennsylvania history from 1681 to today.',
        '🏛️ 3D Historical Stage: Inspect sculpted 3D protagonists in 360° with studio lighting and verified archival citations.',
        'Export individual chapters or the complete bilingual illustrated encyclopedia as a high-resolution PDF book.',
      ],
      es: [
        '🎨 Historietas 2D: Lee y escucha 6 capítulos ilustrados sobre la historia de Pensilvania desde 1681 hasta la actualidad.',
        '🏛️ Escenario 3D: Inspecciona en 360° a personajes históricos esculpidos en 3D con iluminación de estudio y fuentes oficiales.',
        'Descarga capítulos individuales o el libro completo ilustrado en formato PDF de alta resolución.',
      ],
    },
    actionLabel: {
      en: 'Open 2D/3D Encyclopedia',
      es: 'Abrir Enciclopedia 2D/3D',
    },
    actionType: 'encyclopedia',
    icon: <Box className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '04',
    badge: {
      en: 'STEP 4 OF 5 · VOICE AI GUIDE & GPS FIELD TRIPS',
      es: 'PASO 4 DE 5 · ASISTENTE IA POR VOZ Y EXCURSIONES GPS',
    },
    title: {
      en: '4. Ask the Voice AI & Plan Road Trips',
      es: '4. Pregunta a la IA por Voz y Planifica Rutas',
    },
    subtitle: {
      en: 'Spoken map commands, conversational historian & multi-stop Google Maps Field Trip Builder',
      es: 'Comandos de mapa por voz, historiador conversacional y rutas multiparada en Google Maps',
    },
    description: {
      en: 'Tap the ✨ AI Guide icon on the left rail to ask questions by voice or text and navigate the map with spoken commands. Use the 🚌 My Field Trips icon to build real multi-stop itineraries ready to launch in Google Maps.',
      es: 'Toca el ícono ✨ Asistente IA en el riel izquierdo para hacer preguntas por voz o texto y navegar por el mapa con comandos. Usa el ícono 🚌 Mi Excursión para armar itinerarios reales listos para abrir en Google Maps.',
    },
    highlights: {
      en: [
        '✨ AI Guide: Use the microphone (🎤) or text chat to ask about any county or say commands like "Fly to Gettysburg" or "Show 3D Stage".',
        '🚌 My Field Trips: Add up to 5 stops from counties, battles, or PHMC plaques; the golden badge counter on the left rail tracks your stops.',
        'Calculate road mileage and export your multi-stop route directly to Google Maps.',
      ],
      es: [
        '✨ Asistente IA: Usa el micrófono (🎤) o el chat de texto para consultar sobre cualquier condado o dar comandos como "Vuela a Gettysburg".',
        '🚌 Mi Excursión: Añade hasta 5 paradas desde condados, batallas o placas PHMC; el contador dorado en el riel izquierdo mostrará tus paradas.',
        'Calcula la distancia vial estimada y abre la ruta multiparada directamente en Google Maps.',
      ],
    },
    actionLabel: {
      en: 'Launch ✨ Voice AI Guide',
      es: 'Abrir ✨ Asistente IA por Voz',
    },
    actionType: 'ai',
    icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '05',
    badge: {
      en: 'STEP 5 OF 5 · SMARTBOARD TEACHER MODE & FULL MENU',
      es: 'PASO 5 DE 5 · MODO DOCENTE PARA PIZARRAS Y MENÚ COMPLETO',
    },
    title: {
      en: '5. Smartboard Teacher Mode & Resources',
      es: '5. Herramientas de Aula (Modo Docente) y Recursos',
    },
    subtitle: {
      en: 'Touch whiteboard over map, printable PDE 8.2 PDF worksheets, classroom trivia & Atlas Index',
      es: 'Pizarra táctil sobre el mapa, guías PDF imprimibles PDE 8.2, trivia de clase e Índice del Atlas',
    },
    description: {
      en: 'If you are an educator, activate the 🎓 Teacher Mode icon on the left rail to draw directly over the map, generate printable PDF worksheets, and project classroom trivia. Inside the ☰ Menu you will find the full Atlas Index, official sources, and community resources.',
      es: 'Si eres docente, activa el ícono 🎓 Modo Docente en el riel izquierdo para dibujar sobre el mapa, generar guías imprimibles en PDF y proyectar trivias de clase. En el ☰ Menú encontrarás el Índice completo, fuentes oficiales y el Video Demo.',
    },
    highlights: {
      en: [
        '🎓 Teacher Mode: Includes Smartboard projection (+18% font scale), touch whiteboard, verbatim Primary Source Capsules, printable PDF worksheets, and 20-question Trivia.',
        '📑 Atlas Index & Sources (in ☰ Menu): Interactive site map with direct deep-links (?county= & ?module=) and verified links to PHMC, National Archives, LOC, and U.S. Census.',
        'Reopen this Welcome Guide anytime from ☰ Menu → "🧭 Atlas Guide".',
      ],
      es: [
        '🎓 Modo Docente: Incluye proyección Smartboard (+18% escala tipográfica), pizarra táctil, Cápsulas de Fuentes Primarias, guías PDF imprimibles y Trivia de 20 preguntas.',
        '📑 Índice del Atlas y Fuentes (en ☰ Menú): Mapa del sitio interactivo con enlaces directos (?county= y ?module=) y directorio oficial (PHMC, Archivos Nacionales, LOC y Censo).',
        'Vuelve a abrir este manual cuando quieras desde ☰ Menú → "🧭 Guía del Atlas".',
      ],
    },
    actionLabel: {
      en: 'Activate 🎓 Teacher Mode now',
      es: 'Activar 🎓 Modo Docente ahora',
    },
    actionType: 'teacher',
    icon: <GraduationCap className="w-6 h-6 text-[#D4AF37]" />,
  },
];

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenCompareMode,
  onActivateTeacherMode,
  onOpenEncyclopedia,
  onOpenAIGuide,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Reset to Step 1 (index 0) every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to switch steps
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentStep((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;
  const isEn = language === 'en';

  const handleActionClick = () => {
    if (step.actionType === 'compare') {
      onClose();
      onOpenCompareMode();
    } else if (step.actionType === 'encyclopedia' && onOpenEncyclopedia) {
      onClose();
      onOpenEncyclopedia();
    } else if (step.actionType === 'ai' && onOpenAIGuide) {
      onClose();
      onOpenAIGuide();
    } else if (step.actionType === 'teacher') {
      onClose();
      onActivateTeacherMode();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#09111E]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-label={t.welcomeGuide.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#0F1C30]/96 border border-[#D4AF37]/55 rounded-2xl shadow-[0_25px_75px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
      >
        {/* Top Archival Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-800/90 bg-[#09111E]/85 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo-keystone-chronomap.png"
              alt="Keystone ChronoMap Official Seal"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D4AF37]/80 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37] font-semibold truncate">
                {isEn
                  ? `STEP ${currentStep + 1} OF ${GUIDE_STEPS.length} · INTERACTIVE ATLAS GUIDE`
                  : `PASO ${currentStep + 1} DE ${GUIDE_STEPS.length} · GUÍA INTERACTIVA DEL ATLAS`}
              </div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#F8FAFC] truncate">
                {t.welcomeGuide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick EN | ES Toggle inside the Guide */}
            <div className="rounded-full bg-[#0F1C30] border border-slate-700/80 p-0.5 flex items-center text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#1D4ED8] text-[#F8FAFC] font-bold border border-[#D4AF37]/70'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  language === 'es'
                    ? 'bg-[#1D4ED8] text-[#F8FAFC] font-bold border border-[#D4AF37]/70'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                ES
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? 'Close guide' : 'Cerrar guía'}
              className="p-2 rounded-xl bg-[#0F1C30] border border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#B22234] hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Step Progress Indicator Tabs */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#09111E]/55 border-b border-slate-800/80 grid grid-cols-5 gap-1.5 sm:gap-2">
          {GUIDE_STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const cleanTitle = s.title[language].replace(/^\d+\.\s*/, '');
            return (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`py-2 px-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#1D4ED8]/85 border-[#D4AF37] text-[#F8FAFC] shadow-sm'
                    : isCompleted
                      ? 'bg-[#09111E]/85 border-[#D4AF37]/45 text-[#D4AF37]'
                      : 'bg-[#09111E]/45 border-slate-800 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[10px] font-bold flex items-center justify-between">
                  <span>{t.welcomeGuide.stepLabel(s.stepNumber)}</span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                  )}
                </div>
                <div className="text-[11px] font-medium truncate mt-0.5 hidden sm:block">
                  {cleanTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Step Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[64vh]">
          {/* Official Brand Emblem Cover on Step 1 */}
          {currentStep === 0 && (
            <div className="text-center pb-3 border-b border-slate-800/80">
              <img
                src="/logo-keystone-chronomap.png"
                alt="Keystone ChronoMap — Atlas Cartográfico Histórico de Pensilvania"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] mx-auto mb-3"
              />
              <h3 className="font-serif text-2xl font-bold text-[#F8FAFC]">
                Keystone ChronoMap
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
                {isEn
                  ? 'Historical Cartographic Atlas of Pennsylvania'
                  : 'Atlas Cartográfico Histórico de Pensilvania'}
              </p>
            </div>
          )}

          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#09111E] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-inner">
              {step.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                {step.badge[language]}
              </div>
              <h4 className="mt-0.5 font-serif text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                {step.title[language]}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {step.subtitle[language]}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F8FAFC]/95 leading-relaxed bg-[#09111E]/80 border border-[#D4AF37]/30 rounded-xl p-4">
            {step.description[language]}
          </p>

          {/* Key Highlights List */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              {t.welcomeGuide.highlightsHeader}
            </div>
            <ul className="space-y-2">
              {step.highlights[language].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#F8FAFC]/90 leading-relaxed bg-[#09111E]/55 border border-slate-800 rounded-xl px-3.5 py-2.5"
                >
                  <span className="font-mono text-xs text-[#D4AF37] font-bold tabular-nums mt-0.5 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {step.actionLabel && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleActionClick}
                className="px-4 py-2 rounded-xl bg-[#1E3A8A]/80 hover:bg-[#1D4ED8] border border-[#D4AF37]/80 text-xs font-semibold text-[#F8FAFC] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>{step.actionLabel[language]}</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800/90 bg-[#09111E]/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] underline cursor-pointer"
            >
              {t.welcomeGuide.skipBtn}
            </button>
            <span className="hidden md:inline text-[11px] font-mono text-slate-500">
              {isEn
                ? `Step ${currentStep + 1} of ${GUIDE_STEPS.length} (←/→)`
                : `Paso ${currentStep + 1} de ${GUIDE_STEPS.length} (←/→)`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-2 rounded-xl bg-[#0F1C30] border border-slate-700 text-xs font-medium text-[#F8FAFC] hover:border-[#D4AF37] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.welcomeGuide.prevBtn}</span>
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) =>
                    Math.min(GUIDE_STEPS.length - 1, prev + 1)
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-[#09111E] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span>{t.welcomeGuide.nextBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-[#09111E] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.welcomeGuide.startBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuideModal;
