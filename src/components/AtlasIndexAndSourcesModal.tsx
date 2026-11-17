import React, { useState } from 'react';
import {
  X,
  Compass,
  BookOpen,
  Map,
  Layers,
  ArrowLeftRight,
  Palette,
  Box,
  Swords,
  Landmark,
  GraduationCap,
  Sparkles,
  Bus,
  Heart,
  Link2,
  Check,
  ExternalLink,
  Cpu,
  Globe,
  Database,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';

export type DirectAtlasModuleId =
  | 'counties67'
  | 'territories1682'
  | 'territories1787'
  | 'compare'
  | 'vintagemaps'
  | 'encyclopedia'
  | '3dstage'
  | 'milestones'
  | 'phmc'
  | 'leaders'
  | 'teacher'
  | 'ai'
  | 'fieldtrips'
  | 'guide'
  | 'support'
  | 'outreach'
  | 'catalog';

export interface AtlasIndexAndSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchModule: (moduleId: DirectAtlasModuleId) => void;
  onSelectCounty: (county: CountyRecord) => void;
}

interface IndexActionItem {
  id: DirectAtlasModuleId;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  badgeEn: string;
  badgeEs: string;
  icon: React.ReactNode;
}

interface SourceEntry {
  name: string;
  badge: string;
  descEn: string;
  descEs: string;
  url: string;
  domainLabel: string;
}

const FEATURED_DIRECT_COUNTIES = [
  'Philadelphia',
  'Bucks',
  'Chester',
  'Lancaster',
  'Adams',
  'Allegheny',
  'Dauphin',
  'Lackawanna',
  'Erie',
  'Berks',
  'Lehigh',
  'Centre',
] as const;

export const AtlasIndexAndSourcesModal: React.FC<
  AtlasIndexAndSourcesModalProps
> = ({ isOpen, onClose, onLaunchModule, onSelectCounty }) => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'index' | 'sources'>('index');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = language === 'en';

  const getBaseShareOrigin = () => {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin + window.location.pathname;
    }
    return 'https://ais-pre-fhpafyrqoimr2pemggvzum-162502178501.us-east5.run.app/';
  };

  const handleCopyDeepLink = async (
    e: React.MouseEvent,
    queryParam: string,
    keyId: string
  ) => {
    e.stopPropagation();
    const fullUrl = `${getBaseShareOrigin()}?${queryParam}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedKey(keyId);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === keyId ? null : prev));
    }, 2200);
  };

  const cartographyItems: IndexActionItem[] = [
    {
      id: 'counties67',
      titleEn: '67 Modern Counties of Pennsylvania',
      titleEs: '67 Condados Modernos de Pensilvania',
      descEn:
        'Focuses the current statewide GIS map with all 67 county jurisdictions (STATEFP 42) and regional color-coding.',
      descEs:
        'Enfoca el mapa estatal actual con las 67 jurisdicciones condales (STATEFP 42) y codificación por regiones.',
      badgeEn: 'GIS STATE MAP',
      badgeEs: 'MAPA ESTATAL GIS',
      icon: <Map className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'territories1682',
      titleEn: "1682: William Penn's 3 Original Counties",
      titleEs: '1682: Los 3 Condados Originales de William Penn',
      descEn:
        'Activates the Turf.js historical polygon union showing Philadelphia, Bucks, Chester, and Native Indigenous Lands.',
      descEs:
        'Activa la capa histórica fusionada con Turf.js mostrando Philadelphia, Bucks, Chester y Tierras Indígenas.',
      badgeEn: '1682 CHARTER',
      badgeEs: 'CARTA DE 1682',
      icon: <Layers className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'territories1787',
      titleEn: '1787: Pennsylvania at the U.S. Constitution (18 Counties)',
      titleEs: '1787: Pensilvania en la Constitución (18 Condados)',
      descEn:
        'Activates the 1787 territorial configuration when Pennsylvania became the 2nd state to ratify the U.S. Constitution.',
      descEs:
        'Activa la capa histórica de 1787 cuando Pensilvania ratificó la Constitución Federal con 18 condados.',
      badgeEn: '1787 UNION',
      badgeEs: 'UNIÓN 1787',
      icon: <Landmark className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'compare',
      titleEn: 'Split-Curtain Comparator: Before vs. Today',
      titleEs: 'Comparador Deslizante: Antes vs. Hoy',
      descEn:
        'Opens the synchronized dual-map sliding curtain to contrast 1682/1787 mother counties against modern borders.',
      descEs:
        'Abre el comparador de cortina deslizante sincronizada para contrastar fronteras coloniales frente a las actuales.',
      badgeEn: 'DUAL MAP',
      badgeEs: 'MAPA DUAL',
      icon: <ArrowLeftRight className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'vintagemaps',
      titleEn: 'Vintage Maps Gallery & GroundOverlay (1687, 1792, 1863)',
      titleEs: 'Galería de Mapas Antiguos (1687, 1792, 1863)',
      descEn:
        'Inspect and overlay archival engravings by Thomas Holme (1687), Reading Howell (1792), and Gettysburg (1863).',
      descEs:
        'Inspecciona y superpón grabados históricos de Thomas Holme (1687), Reading Howell (1792) y Gettysburg (1863).',
      badgeEn: 'ARCHIVAL PLATES',
      badgeEs: 'LÁMINAS DE ARCHIVO',
      icon: <Compass className="w-4 h-4 text-[#D4AF37]" />,
    },
  ];

  const cultureMultimediaItems: IndexActionItem[] = [
    {
      id: 'encyclopedia',
      titleEn: '2D Illustrated Cartoon Encyclopedia (PDF Book)',
      titleEs: 'Enciclopedia Ilustrada en Caricaturas 2D (PDF)',
      descEn:
        '6 illustrated comic chapters from 1681 to Present with bilingual voice narration and high-resolution PDF export.',
      descEs:
        '6 capítulos ilustrados en cómic desde 1681 hasta el presente con narración por voz y exportación a libro PDF.',
      badgeEn: '2D COMICS & PDF',
      badgeEs: 'CÓMIC 2D Y PDF',
      icon: <Palette className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: '3dstage',
      titleEn: '3D Historical Characters Diorama (WebGL)',
      titleEs: 'Diorama de Personajes Históricos en 3D',
      descEn:
        'Interactive 360° WebGL museum stage featuring sculpted 3D figures across all 67 Pennsylvania counties.',
      descEs:
        'Escenario de museo WebGL 360° con figuras históricas esculpidas en 3D para los 67 condados de Pensilvania.',
      badgeEn: 'THREE.JS 3D',
      badgeEs: 'DIORAMA 3D',
      icon: <Box className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'milestones',
      titleEn: 'Historical Milestones, Battles & Animated Routes',
      titleEs: 'Hitos, Batallas y Rutas Históricas Animadas',
      descEn:
        'Activates battlefield pins and animated campaign routes (Valley Forge, Gettysburg, Underground Railroad, Main Line Canal).',
      descEs:
        'Activa los hitos tácticos y rutas animadas (Valley Forge, Gettysburg, Ferrocarril Subterráneo y Canal Principal).',
      badgeEn: 'CAMPAIGNS',
      badgeEs: 'CAMPAÑAS',
      icon: <Swords className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'phmc',
      titleEn: 'Official Blue-and-Gold Historical Plaques (PHMC)',
      titleEs: 'Placas Históricas Oficiales Azul y Oro (PHMC)',
      descEn:
        'Displays the 25 official roadside plaques of the Pennsylvania Historical & Museum Commission with category filters.',
      descEs:
        'Activa los 25 marcadores oficiales Azul y Oro de la PHMC con filtros por categoría temática.',
      badgeEn: '25 PHMC PLAQUES',
      badgeEs: '25 PLACAS PHMC',
      icon: <MapPin className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'leaders',
      titleEn: 'Pennsylvania Leaders & Governors (MediaWiki Live)',
      titleEs: 'Líderes y Gobernadores de Pensilvania (MediaWiki)',
      descEn:
        'Biographies, historical balance, and live portraits of 11 foundational leaders from William Penn to Gifford Pinchot.',
      descEs:
        'Biografías, balance histórico y retratos en vivo de 11 líderes clave desde William Penn hasta Gifford Pinchot.',
      badgeEn: 'BIOGRAPHIES',
      badgeEs: 'BIOGRAFÍAS',
      icon: <BookOpen className="w-4 h-4 text-[#D4AF37]" />,
    },
  ];

  const edTechCommunityItems: IndexActionItem[] = [
    {
      id: 'teacher',
      titleEn: 'Teacher Mode (Smartboard Whiteboard, PDF Guides & Trivia)',
      titleEs: 'Modo Docente (Pizarra PDI, Guías PDF y Trivia)',
      descEn:
        'Activates PDE 8.2 classroom tools: touch whiteboard over the map, Primary Source Capsules, printable worksheets, and trivia.',
      descEs:
        'Activa herramientas de aula PDE 8.2: pizarra táctil PDI sobre el mapa, fuentes primarias, guías PDF y trivia.',
      badgeEn: 'PDE EDTECH',
      badgeEs: 'AULA PDE',
      icon: <GraduationCap className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'ai',
      titleEn: 'Voice & Text Conversational AI Guide',
      titleEs: 'Asistente de Inteligencia Artificial por Voz',
      descEn:
        'Opens the bilingual AI historian and cartographic navigator with microphone speech recognition and map commands.',
      descEs:
        'Abre el asistente conversacional bilingüe con reconocimiento de voz y ejecución de comandos sobre el mapa.',
      badgeEn: 'AI VOICE GUIDE',
      badgeEs: 'GUÍA IA VOZ',
      icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'fieldtrips',
      titleEn: 'GPS Field Trip Builder (Multi-Stop Route Planner)',
      titleEs: 'Planificador de Excursiones GPS (Field Trip Builder)',
      descEn:
        'Build custom itineraries across Pennsylvania counties and PHMC sites with mileage calculation and Google Maps export.',
      descEs:
        'Crea rutas educativas multiparada por Pensilvania con cálculo de millas viales y exportación directa a Google Maps.',
      badgeEn: 'GPS ROUTES',
      badgeEs: 'RUTAS GPS',
      icon: <Bus className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'guide',
      titleEn: 'Interactive Welcome Guide (45s Quick Tour)',
      titleEs: 'Manual Interactivo de Bienvenida (Tour Rápido)',
      descEn:
        '5-step visual walkthrough covering chronological eras, Turf.js unions, PHMC plaques, and classroom features.',
      descEs:
        'Recorrido guiado en 5 pasos por las épocas históricas, fusiones Turf.js, placas PHMC y herramientas docentes.',
      badgeEn: '5-STEP TOUR',
      badgeEs: 'GUÍA 5 PASOS',
      icon: <Compass className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      id: 'support',
      titleEn: 'Project Patronage & Community Outreach',
      titleEs: 'Manual de Apoyo al Proyecto y Difusión',
      descEn:
        'Support open-access Pennsylvania historical education via Zelle, Cash App, or Crypto and share with schools.',
      descEs:
        'Apoya el mantenimiento abierto del atlas educativo mediante Zelle, Cash App o Cripto y compártelo con escuelas.',
      badgeEn: 'OPEN ACCESS',
      badgeEs: 'ACCESO ABIERTO',
      icon: <Heart className="w-4 h-4 text-[#D4AF37]" />,
    },
  ];

  const paHeritageSources: SourceEntry[] = [
    {
      name: 'Pennsylvania Historical & Museum Commission (PHMC)',
      badge: 'STATE ARCHIVES & MARKERS',
      descEn:
        'Official Blue-and-Gold Historical Marker database, William Penn’s 1681 Royal Charter records, and Pennsylvania State Archives.',
      descEs:
        'Base de datos oficial de marcadores históricos Azul y Oro, registros de la Carta Real de 1681 y Archivos Estatales de Pensilvania.',
      url: 'https://www.pa.gov/agencies/phmc.html',
      domainLabel: 'pa.gov/phmc',
    },
    {
      name: 'Historical Society of Pennsylvania (HSP)',
      badge: 'COLONIAL CARTOGRAPHY',
      descEn:
        'Early colonial cartography, Thomas Holme’s 1687 surveyor plates, and foundational manuscripts of William Penn.',
      descEs:
        'Cartografía colonial temprana, planimetrías de Thomas Holme (1687) y manuscritos fundacionales de William Penn.',
      url: 'https://hsp.org',
      domainLabel: 'hsp.org',
    },
    {
      name: 'Pennsylvania Department of Education (PDE)',
      badge: 'ACADEMIC STANDARDS 8.2 & 7.1',
      descEn:
        'Academic Standards for History (8.2 Pennsylvania History) and Geography (7.1–7.3) aligned with classroom worksheets and trivia.',
      descEs:
        'Estándares Académicos de Historia (8.2 Historia de Pensilvania) y Geografía (7.1–7.3) que estructuran el Modo Docente.',
      url: 'https://www.pa.gov/agencies/education.html',
      domainLabel: 'pa.gov/education',
    },
  ];

  const federalSources: SourceEntry[] = [
    {
      name: 'U.S. National Archives (Charters of Freedom)',
      badge: 'FOUNDING DOCUMENTS',
      descEn:
        'Verbatim primary transcriptions of the Declaration of Independence (1776) and the U.S. Constitution (1787) signed in Philadelphia.',
      descEs:
        'Transcripciones primarias de la Declaración de Independencia (1776) y la Constitución de EE. UU. (1787) firmadas en Filadelfia.',
      url: 'https://www.archives.gov/founding-docs',
      domainLabel: 'archives.gov',
    },
    {
      name: 'Library of Congress (LOC Geography & Map Division)',
      badge: 'MILITARY & VINTAGE MAPS',
      descEn:
        'Digitized military topography of Valley Forge (1777), Reading Howell’s 1792 map, Gettysburg campaign plates (1863), and Lincoln manuscripts.',
      descEs:
        'Cartografía militar de Valley Forge (1777), mapa de Reading Howell (1792), láminas de Gettysburg (1863) y manuscritos de Lincoln.',
      url: 'https://www.loc.gov',
      domainLabel: 'loc.gov',
    },
  ];

  const liveDataApis: SourceEntry[] = [
    {
      name: 'U.S. Census Bureau & PA State Data Center',
      badge: 'DECENNIAL CENSUS & TIGER/LINE GIS',
      descEn:
        'Historical decennial population series (1790–Present), age/gender demographic structure, and official STATEFP 42 GeoJSON county boundaries.',
      descEs:
        'Series censales históricas (1790–Presente), estructura demográfica y fronteras GeoJSON oficiales (STATEFP 42) de los 67 condados.',
      url: 'https://www.census.gov',
      domainLabel: 'census.gov',
    },
    {
      name: 'Wikimedia Commons & MediaWiki REST API',
      badge: 'LIVE PORTRAITS & ARCHIVAL MEDIA',
      descEn:
        'Real-time biographical summaries, verified public-domain portraits of Pennsylvania leaders, and high-resolution historical engravings.',
      descEs:
        'Resúmenes biográficos en vivo, retratos oficiales de dominio público de líderes de Pensilvania y grabados históricos.',
      url: 'https://www.wikimedia.org',
      domainLabel: 'wikimedia.org',
    },
    {
      name: 'Open-Meteo Weather & Elevation API',
      badge: 'REAL-TIME TELEMETRY',
      descEn:
        'Live meteorological telemetry, temperature, wind speed, and topographic elevation (meters/feet above sea level) for all 67 county seats.',
      descEs:
        'Telemetría climática en tiempo real, temperatura, viento y altitud topográfica para las 67 sedes condales.',
      url: 'https://open-meteo.com',
      domainLabel: 'open-meteo.com',
    },
  ];

  const renderActionSection = (
    sectionTitle: string,
    items: IndexActionItem[]
  ) => (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span>{sectionTitle}</span>
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => {
          const copyId = `mod-${item.id}`;
          const isCopied = copiedKey === copyId;

          return (
            <div
              key={item.id}
              onClick={() => {
                onLaunchModule(item.id);
                onClose();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLaunchModule(item.id);
                  onClose();
                }
              }}
              className="group bg-[#09111E]/90 hover:bg-[#1E3A8A]/45 border border-slate-700/75 hover:border-[#D4AF37]/80 rounded-xl p-3 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0F1C30] border border-[#D4AF37]/40 group-hover:border-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-sm font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors">
                      {isEn ? item.titleEn : item.titleEs}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0F1C30] border border-slate-700 text-[9px] font-mono font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {isEn ? item.badgeEn : item.badgeEs}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                    {isEn ? item.descEn : item.descEs}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) =>
                    handleCopyDeepLink(e, `module=${item.id}`, copyId)
                  }
                  title={
                    isEn
                      ? `Copy direct link (?module=${item.id})`
                      : `Copiar enlace directo (?module=${item.id})`
                  }
                  aria-label={
                    isEn
                      ? `Copy direct link to ${item.titleEn}`
                      : `Copiar enlace directo a ${item.titleEs}`
                  }
                  className={`p-2 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    isCopied
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                      : 'bg-[#0F1C30] hover:bg-[#1D4ED8] border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="font-mono text-[10px] font-bold">
                        {isEn ? 'Copied' : 'Copiado'}
                      </span>
                    </>
                  ) : (
                    <Link2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                </button>

                <span className="w-8 h-8 rounded-lg bg-[#0F1C30] group-hover:bg-[#1D4ED8] border border-slate-700/80 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37] group-hover:text-[#F8FAFC] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSourceGroup = (groupTitle: string, entries: SourceEntry[]) => (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span>{groupTitle}</span>
      </h3>

      <div className="grid grid-cols-1 gap-2.5">
        {entries.map((entry) => (
          <a
            key={entry.name}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#09111E]/90 hover:bg-[#1E3A8A]/40 border border-slate-700/80 hover:border-[#D4AF37] rounded-xl p-3.5 transition-all flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-sm font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors">
                  {entry.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#0F1C30] border border-[#D4AF37]/40 text-[9px] font-mono font-semibold text-[#D4AF37]">
                  {entry.badge}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {isEn ? entry.descEn : entry.descEs}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F1C30] border border-slate-700 group-hover:border-[#D4AF37] text-[11px] font-mono text-[#D4AF37] shrink-0">
              <span>{entry.domainLabel}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09111E]/85 backdrop-blur-md no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="atlas-index-sources-title"
    >
      <div className="relative w-full max-w-3xl max-h-[82vh] bg-[#0F1C30]/96 backdrop-blur-2xl border border-[#D4AF37]/65 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] text-[#F8FAFC] flex flex-col overflow-hidden">
        {/* Top Archival Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#09111E] via-[#0F1C30] to-[#1E3A8A]/45 border-b border-slate-800/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo-keystone-chronomap.png"
              alt="Keystone ChronoMap Official Seal"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D4AF37] shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37] font-semibold truncate">
                {isEn
                  ? 'INTERACTIVE SITE MAP & VERIFIED ARCHIVAL DIRECTORY'
                  : 'MAPA DEL SITIO INTERACTIVO Y DIRECTORIO DE FUENTES'}
              </div>
              <h2
                id="atlas-index-sources-title"
                className="font-serif text-lg sm:text-xl font-bold text-[#F8FAFC] truncate"
              >
                {isEn
                  ? '📑 Atlas Index & Official Sources'
                  : '📑 Índice del Atlas y Fuentes Oficiales'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close modal' : 'Cerrar modal'}
            className="p-2 rounded-xl bg-[#09111E] hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Primary Navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#09111E]/90 border-b border-slate-800/90 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('index')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'index'
                ? 'bg-[#1D4ED8] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_15px_rgba(29,78,216,0.45)]'
                : 'bg-[#0F1C30]/80 text-[#94A3B8] hover:text-[#F8FAFC] border-slate-700/70'
            }`}
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {isEn
                ? '🧭 Interactive Index (Direct Access)'
                : '🧭 Índice Interactivo (Acceso Directo)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'sources'
                ? 'bg-[#B22234] text-[#F8FAFC] border-[#D4AF37] shadow-[0_0_15px_rgba(178,34,52,0.45)]'
                : 'bg-[#0F1C30]/80 text-[#94A3B8] hover:text-[#F8FAFC] border-slate-700/70'
            }`}
          >
            <Database className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {isEn
                ? '📚 Official Sources & APIs'
                : '📚 Fuentes Oficiales y APIs'}
            </span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'index' ? (
            <>
              <div className="bg-[#09111E]/75 border border-[#C5A059]/30 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs text-[#CBD5E1]">
                <span>
                  {isEn
                    ? 'Click any module below to launch it immediately, or click the 🔗 button to copy a shareable deep link.'
                    : 'Haz clic en cualquier módulo para abrirlo al instante, o pulsa el botón 🔗 para copiar un enlace directo compartible.'}
                </span>
              </div>

              {renderActionSection(
                isEn
                  ? '1. Cartography & Territorial Evolution'
                  : '1. Cartografía y Evolución Territorial',
                cartographyItems
              )}

              {renderActionSection(
                isEn
                  ? '2. History, Culture & Multimedia'
                  : '2. Historia, Cultura y Multimedia',
                cultureMultimediaItems
              )}

              {renderActionSection(
                isEn
                  ? '3. Educational Tools, AI & Community'
                  : '3. Herramientas Educativas, IA y Comunidad',
                edTechCommunityItems
              )}

              {/* Direct Featured County Deep-Links (?county=Name) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/90">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>
                      {isEn
                        ? '4. Featured Counties Direct Jump (?county=...)'
                        : '4. Acceso Directo a Condados Destacados (?county=...)'}
                    </span>
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      onLaunchModule('catalog');
                      onClose();
                    }}
                    className="text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    {isEn
                      ? 'View All 67 Counties Index →'
                      : 'Ver Índice de los 67 Condados →'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {FEATURED_DIRECT_COUNTIES.map((countyName) => {
                    const county = PA_COUNTIES_DATA[countyName];
                    if (!county) return null;
                    const copyId = `county-${countyName}`;
                    const isCopied = copiedKey === copyId;

                    return (
                      <div
                        key={countyName}
                        onClick={() => {
                          onSelectCounty(county);
                          onClose();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectCounty(county);
                            onClose();
                          }
                        }}
                        className="group bg-[#09111E]/90 hover:bg-[#1E3A8A]/55 border border-slate-700/75 hover:border-[#D4AF37] rounded-xl px-2.5 py-2 flex items-center justify-between gap-1.5 cursor-pointer transition-all"
                      >
                        <div className="min-w-0">
                          <div className="font-serif text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] truncate">
                            {county.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#94A3B8]">
                            {county.founded}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopyDeepLink(
                              e,
                              `county=${encodeURIComponent(county.name)}`,
                              copyId
                            )
                          }
                          title={
                            isEn
                              ? `Copy direct link (?county=${county.name})`
                              : `Copiar enlace directo (?county=${county.name})`
                          }
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                            isCopied
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                              : 'bg-[#0F1C30] hover:bg-[#1D4ED8] border-slate-700 text-[#D4AF37]'
                          }`}
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Link2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {renderSourceGroup(
                isEn
                  ? '1. Pennsylvania Historical Archives & Heritage'
                  : '1. Archivos Históricos y Patrimonio de Pensilvania',
                paHeritageSources
              )}

              {renderSourceGroup(
                isEn
                  ? '2. United States Federal Archives'
                  : '2. Archivos Federales de Estados Unidos',
                federalSources
              )}

              {renderSourceGroup(
                isEn
                  ? '3. Live Geospatial, Demographic & Weather Data'
                  : '3. Datos Geoespaciales, Demográficos y Climáticos en Vivo',
                liveDataApis
              )}

              {/* 4. Zero-Cost Browser-Native Technologies */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>
                    {isEn
                      ? '4. Browser-Native Technologies ($0 Cost Architecture)'
                      : '4. Tecnologías Nativas del Navegador (Costo $0)'}
                  </span>
                </h3>

                <div className="bg-[#09111E]/90 border border-[#D4AF37]/45 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                    <Cpu className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      Google Maps JavaScript API · Turf.js · Three.js / WebGL ·
                      HTML5 Canvas 2D · Web Speech API
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {isEn
                      ? 'Keystone ChronoMap executes spatial polygon unions (Turf.js), 360° 3D museum dioramas (Three.js/WebGL), comic strip rendering & PDF compilation (HTML5 Canvas + jsPDF), and bilingual voice synthesis/recognition (Web Speech API) 100% client-side in the browser.'
                      : 'Keystone ChronoMap ejecuta la unión geométrica de polígonos históricos (Turf.js), los dioramas 3D de 360° (Three.js/WebGL), la ilustración de cómics y maquetación PDF (HTML5 Canvas + jsPDF) y la narración/reconocimiento de voz bilingüe (Web Speech API) de forma 100% nativa en el navegador.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'Google Maps JS API',
                      'Turf.js Spatial GIS',
                      'Three.js / WebGL PBR',
                      'HTML5 Canvas 2D',
                      'Web Speech API (EN/ES)',
                      'IndexedDB / LocalStorage Cache',
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-[#0F1C30] border border-slate-700 text-[10px] font-mono text-[#D4AF37] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-[#09111E]/95 border-t border-slate-800/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>
              {isEn
                ? 'Tip: Append ?county=Lackawanna or ?module=encyclopedia to share any view directly.'
                : 'Tip: Añade ?county=Lackawanna o ?module=encyclopedia al enlace para compartir cualquier vista.'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E3A8A] border border-[#D4AF37] text-xs font-semibold text-[#F8FAFC] transition-colors cursor-pointer shrink-0"
          >
            {isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtlasIndexAndSourcesModal;
