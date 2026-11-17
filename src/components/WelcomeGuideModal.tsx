import React, { useState } from 'react';
import {
  X,
  Compass,
  Clock,
  Map,
  Swords,
  ArrowLeftRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompareMode: () => void;
  onOpenMapsGallery: () => void;
  onActivateTeacherMode: () => void;
}

interface GuideStep {
  stepNumber: string;
  badge: { en: string; es: string };
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
  highlights: { en: string[]; es: string[] };
  actionLabel?: { en: string; es: string };
  actionType?: 'compare' | 'vintage' | 'teacher';
  icon: React.ReactNode;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    stepNumber: '01',
    badge: {
      en: 'CHRONOLOGY & ATMOSPHERE (1681–PRESENT)',
      es: 'CRONOLOGÍA Y ATMÓSFERA (1681–ACTUALIDAD)',
    },
    title: {
      en: 'Historical Timeline & Cartographic Immersion',
      es: 'Línea de Tiempo Histórica e Inmersión Cartográfica',
    },
    subtitle: {
      en: 'Six defining eras from King Charles II’s Royal Charter to the modern Commonwealth',
      es: 'Seis épocas clave desde la Carta Real de Carlos II hasta la Mancomunidad actual',
    },
    description: {
      en: 'Along the bottom bar you will find Pennsylvania’s 6 chronological milestones (1681, 1776, 1861, 1870, 1950, and Present). Switching eras applies an archival atmospheric glaze, displays the golden typographic era seal, and highlights counties incorporated up to that date.',
      es: 'En la barra inferior encontrarás los 6 hitos cronológicos de Pensilvania (1681, 1776, 1861, 1870, 1950 y Actualidad). Al cambiar de época, el mapa aplica una transición atmosférica de archivo, despliega el sello tipográfico dorado de la era y resalta los condados ya incorporados hasta esa fecha.',
    },
    highlights: {
      en: [
        'Observe how many of the 67 counties existed at each historical cutoff (from the 3 original counties in 1682 to the 67th, Lackawanna, in 1878).',
        'Toggle the chronological filter on the bottom bar to contrast established counties against unorganized frontier lands.',
        'Click any featured county pill in the timeline to fly directly to its jurisdiction.',
      ],
      es: [
        'Observa cuántos de los 67 condados existían en cada corte histórico (de los 3 originales en 1682 hasta el n.º 67, Lackawanna, en 1878).',
        'Activa o desactiva el filtro "Frontera de época" en la barra inferior para contrastar los condados ya fundados frente a las tierras aún no organizadas.',
        'Haz clic en los condados protagonistas sugeridos en cada época para viajar directamente a su jurisdicción.',
      ],
    },
    icon: <Clock className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '02',
    badge: {
      en: 'REAL GIS GEOMETRY, TURF.JS & MEDIAWIKI BIOGRAPHIES',
      es: 'GEOMETRÍA GIS REAL Y BIOGRAFÍAS MEDIAWIKI',
    },
    title: {
      en: 'All 67 Real Counties, Turf.js Union & Historical Leaders',
      es: 'Los 67 Condados Reales, Fusión Turf.js y Líderes',
    },
    subtitle: {
      en: 'Official boundaries (STATEFP 42), 5 historical regions, Census charts & Wikipedia portraits',
      es: 'Polígonos oficiales (STATEFP 42), 5 regiones históricas y retratos de Wikipedia',
    },
    description: {
      en: 'Every county is rendered with its authentic geographic boundaries and color-coded across Pennsylvania’s 5 historical regions. Clicking any county frames the camera and opens the right-hand dossier with its founding year, county seat, etymology, bilingual voice narration, 1790–Present census charts, and historical figures.',
      es: 'Cada condado está trazado con sus fronteras geográficas reales y coloreado según las 5 regiones históricas de Pensilvania. Al hacer clic sobre cualquier condado se encuadra la cámara y se abre el expediente lateral con su año de fundación, sede condal, etimología, economía y figuras históricas vinculadas.',
    },
    highlights: {
      en: [
        'Use the top-left "Territorial Union (Turf.union)" panel to geometrically merge modern polygons into the 3 Original Counties (1682) or the 18 Constitutional Counties (1787).',
        'Explore live portraits and balanced historical biographies of 11 leaders and governors fetched from the Wikipedia MediaWiki API.',
        'Switch between EN (US English) and ES (Spanish) anytime using the pill toggle in the top-right header.',
      ],
      es: [
        'Usa el panel izquierdo "Fusión Territorial (Turf.union)" para fundir geométricamente los polígonos modernos en los 3 Condados Originales (1682) o los 18 de la Constitución (1787).',
        'Explora los retratos reales y biografías con balance histórico neutral de 11 líderes y gobernadores obtenidos en vivo desde la API de Wikipedia.',
        'Alterna entre EN (Inglés EE. UU.) y ES (Español) en cualquier momento desde el selector superior derecho.',
      ],
    },
    icon: <Map className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '03',
    badge: {
      en: 'TACTICAL CHARTS, PHMC PLAQUES & FIELD TRIPS',
      es: 'CARTAS TÁCTICAS, PLACAS PHMC Y EXCURSIONES',
    },
    title: {
      en: 'Milestones, Animated Routes & 25 Official PHMC Plaques',
      es: 'Hitos, Rutas Animadas y 25 Placas Oficiales PHMC',
    },
    subtitle: {
      en: 'Radial pulsing markers, campaign route player, Blue-and-Gold plaques & Field Trip Builder',
      es: 'Marcadores con pulso radial, reproductor de campañas y planificador de excursiones',
    },
    description: {
      en: 'Explore the sites that shaped American history—from Shackamaxon and Independence Hall to Valley Forge, Gettysburg, Drake Oil Well, Homestead, and Flight 93—plus 25 official Blue-and-Gold Pennsylvania Historical and Museum Commission (PHMC) roadside plaques.',
      es: 'Explora los escenarios donde se definió la historia estadounidense: desde el Tratado de Shackamaxon e Independence Hall hasta Valley Forge, Gettysburg, el Pozo de Drake en Titusville, la Huelga de Homestead y Shanksville, junto con 25 placas oficiales Azul y Oro de la PHMC.',
    },
    highlights: {
      en: [
        'Filter the 25 official PHMC Blue-and-Gold plaques by theme (Industry, Civil Rights, Inventions, Pioneering Women, Political History).',
        'Add up to 5 stops to "🚌 My Field Trip" to compute road distance (Haversine 1.25x) and launch a multi-stop route directly in Google Maps.',
        'Use "🧭 Historical Routes" in the Header to animate the March to Valley Forge (1777), Gettysburg Campaign (1863), Underground Railroad, or Main Line Canal.',
      ],
      es: [
        'Filtra las 25 placas oficiales Azul y Oro de la PHMC por categoría temática (Industria, Derechos Civiles, Inventos, Mujeres Pioneras, Historia Política).',
        'Añade hasta 5 paradas a "🚌 Mi Excursión" para calcular millas viales (Haversine 1.25x) y abrir la ruta multiparada en Google Maps.',
        'Usa el selector "🧭 Rutas Históricas" del Header para animar con flechas doradas la Marcha a Valley Forge (1777), la Campaña de Gettysburg (1863), el Ferrocarril Subterráneo o el Canal Principal de PA.',
      ],
    },
    icon: <Swords className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '04',
    badge: {
      en: 'SYNCHRONIZED COMPARATIVE ANALYSIS',
      es: 'ANÁLISIS COMPARATIVO SINCRONIZADO',
    },
    title: {
      en: 'Interactive "Before vs. Today" Split-Curtain Comparator',
      es: 'Comparador Interactivo "Antes vs. Hoy"',
    },
    subtitle: {
      en: 'Sliding curtain between colonial/constitutional Pennsylvania and all 67 modern counties',
      es: 'Cortina deslizante entre la Pensilvania colonial/constitucional y los 67 condados actuales',
    },
    description: {
      en: 'The golden "⏳ Compare: Before vs. Today" button opens a dual-map view synchronized to the millimeter. Dragging the center handle lets you inspect how vast mother counties were subdivided as settlement and industry expanded.',
      es: 'El botón dorado "⏳ Comparar: Antes vs. Hoy" abre una vista dividida sincronizada al milímetro. Al arrastrar la cortina central, podrás contrastar cómo se fragmentaron los grandes condados matrices a medida que avanzó la frontera demográfica e industrial.',
    },
    highlights: {
      en: [
        'Switch the left-hand map ("BEFORE") between Scenario A (1682: 3 Original Counties + Native Lands) and Scenario B (1787: 18 Constitutional Counties).',
        'Both maps automatically synchronize their camera center and zoom level as you pan or zoom either side.',
      ],
      es: [
        'Alterna en el lado izquierdo ("ANTES") entre el Escenario A (1682: 3 Condados Originales + Territorios Indígenas) y el Escenario B (1787: 18 Condados al ratificar la Constitución).',
        'Ambos mapas sincronizan automáticamente su centro y nivel de zoom cuando te desplazas por cualquiera de los dos lados.',
      ],
    },
    actionLabel: {
      en: 'Try Before vs. Today Comparator',
      es: 'Probar Comparador Antes vs. Hoy',
    },
    actionType: 'compare',
    icon: <ArrowLeftRight className="w-6 h-6 text-[#D4AF37]" />,
  },
  {
    stepNumber: '05',
    badge: {
      en: 'CARTOGRAPHIC OVERLAY & CLASSROOM EDTECH',
      es: 'CALCO CARTOGRÁFICO Y AULA INTERACTIVA (EDTECH)',
    },
    title: {
      en: 'Vintage Map GroundOverlay & PDE Teacher Mode',
      es: 'Superposición de Mapas Antiguos y Modo Docente',
    },
    subtitle: {
      en: '1687, 1792 & 1863 plates with GroundOverlay + PDE 8.2 Classroom Tools',
      es: 'Láminas de 1687, 1792 y 1863 con GroundOverlay + Herramientas PDE para el Aula',
    },
    description: {
      en: 'Open "🗺️ Vintage Maps" to inspect public-domain engravings by Thomas Holme (1687), Reading Howell (1792), and Gettysburg (1863) and overlay them onto Google Maps with adjustable opacity. Educators and students can also activate "🎓 Teacher Mode" in the Header.',
      es: 'Abre "🗺️ Mapas Antiguos" para inspeccionar láminas de dominio público de Thomas Holme (1687), Reading Howell (1792) y Gettysburg (1863) y superponerlas sobre Google Maps con opacidad graduable. Además, si eres educador o estudiante, activa el botón "🎓 Modo Docente" en el Header.',
    },
    highlights: {
      en: [
        'GroundOverlay opacity slider (0% to 100%) to trace historical plates directly over modern topography.',
        'Teacher Mode (Classroom Mode): includes Smartboard Projection (+18% font scale), Touch Whiteboard over the map, Primary Source Capsules, Printable PDE 8.2 Worksheets (PDF in EN or ES), and 20-question Classroom Trivia.',
      ],
      es: [
        'Superposición GroundOverlay con deslizador de opacidad de 0% a 100% para calcar mapas históricos sobre la topografía moderna.',
        'Modo Docente (Classroom Mode): incluye Modo Proyección Smartboard (+18% tipografía), Pizarra Táctil sobre el mapa, Cápsulas de Fuentes Primarias oficiales, Generador de Guías Imprimibles PDE (PDF) y Trivia Rápida de Aula.',
      ],
    },
    actionLabel: {
      en: 'Activate 🎓 Teacher Mode now',
      es: 'Activar 🎓 Modo Docente ahora',
    },
    actionType: 'teacher',
    icon: <Layers className="w-6 h-6 text-[#D4AF37]" />,
  },
];

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenCompareMode,
  onOpenMapsGallery,
  onActivateTeacherMode,
}) => {
  const { language, t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;

  const handleActionClick = () => {
    if (step.actionType === 'compare') {
      onClose();
      onOpenCompareMode();
    } else if (step.actionType === 'vintage') {
      onClose();
      onOpenMapsGallery();
    } else if (step.actionType === 'teacher') {
      onClose();
      onActivateTeacherMode();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-label={t.welcomeGuide.title}
    >
      <div className="w-full max-w-3xl bg-[#161920]/95 border border-[#C5A059]/45 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Archival Header */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12]/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-semibold">
                {t.welcomeGuide.kicker(step.stepNumber)}
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F4F1EA]">
                {t.welcomeGuide.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="p-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Tabs */}
        <div className="px-6 py-3 bg-[#0D0F12]/40 border-b border-[#C5A059]/20 grid grid-cols-5 gap-2">
          {GUIDE_STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const stepTitle = s.title[language];
            return (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`py-2 px-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#1D3557]/85 border-[#D4AF37] text-[#F4F1EA] shadow-sm'
                    : isCompleted
                      ? 'bg-[#0D0F12]/70 border-[#D4AF37]/40 text-[#D4AF37]'
                      : 'bg-[#0D0F12]/40 border-[#C5A059]/15 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <div className="font-mono text-[10px] font-bold flex items-center justify-between">
                  <span>{t.welcomeGuide.stepLabel(s.stepNumber)}</span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                  )}
                </div>
                <div className="text-[11px] font-medium truncate mt-0.5 hidden sm:block">
                  {stepTitle.split(' ')[0]} {stepTitle.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Step Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D0F12] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-inner">
              {step.icon}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {step.badge[language]}
              </div>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
                {step.title[language]}
              </h3>
              <p className="text-xs text-[#A39E93] mt-0.5">
                {step.subtitle[language]}
              </p>
            </div>
          </div>

          <p className="text-sm text-[#F4F1EA]/90 leading-relaxed bg-[#0D0F12]/60 border border-[#C5A059]/20 rounded-xl p-4">
            {step.description[language]}
          </p>

          {/* Key Highlights List */}
          <div className="space-y-2.5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              {t.welcomeGuide.highlightsHeader}
            </div>
            <ul className="space-y-2">
              {step.highlights[language].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#F4F1EA]/90 leading-relaxed bg-[#0D0F12]/40 border border-[#C5A059]/15 rounded-lg px-3.5 py-2.5"
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
                className="px-4 py-2.5 rounded-xl bg-[#1D3557] hover:bg-[#25436d] border border-[#D4AF37] text-xs font-semibold text-[#F4F1EA] flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span>{step.actionLabel[language]} →</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-[#C5A059]/25 bg-[#0D0F12]/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#A39E93] hover:text-[#F4F1EA] underline cursor-pointer"
          >
            {t.welcomeGuide.skipBtn}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-2 rounded-xl bg-[#161920] border border-[#C5A059]/30 text-xs font-medium text-[#F4F1EA] hover:border-[#D4AF37] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span>{t.welcomeGuide.nextBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
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
