import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Timer,
  Users,
  User,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MapPin,
  Swords,
} from 'lucide-react';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';

export interface TriviaQuestionItem {
  id: number;
  eraTag: string;
  countyName: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export const PA_TRIVIA_QUESTIONS: TriviaQuestionItem[] = [
  {
    id: 1,
    eraTag: '1682 · Fundación',
    countyName: 'Philadelphia',
    question:
      '¿Cuáles fueron los 3 Condados Originales establecidos por William Penn en 1682 tras recibir la Carta Real de Carlos II?',
    options: [
      'Philadelphia, Bucks y Chester',
      'Philadelphia, Lancaster y York',
      'Philadelphia, Montgomery y Delaware',
      'Bucks, Berks y Northampton',
    ],
    correctIndex: 0,
    explanation:
      'En 1682 William Penn dividió la provincia inicial a orillas del río Delaware en tres jurisdicciones matrices: Philadelphia, Bucks y Chester.',
  },
  {
    id: 2,
    eraTag: '1878 · Condado N.º 67',
    countyName: 'Lackawanna',
    question:
      '¿Cuál fue el último de los 67 condados de Pensilvania en ser fundado (en 1878, con sede en Scranton), impulsado por el auge del carbón de antracita?',
    options: [
      'Luzerne County',
      'Lackawanna County',
      'Carbon County',
      'Schuylkill County',
    ],
    correctIndex: 1,
    explanation:
      'Lackawanna County fue escindido de Luzerne el 13 de agosto de 1878, convirtiéndose en el condado número 67 y cerrando el mapa político moderno de Pensilvania.',
  },
  {
    id: 3,
    eraTag: '1729 · Expansión Interior',
    countyName: 'Lancaster',
    question:
      '¿Qué condado, fundado en 1729 a partir de Chester County, fue el cuarto condado de Pensilvania y corazón de la agricultura "Pennsylvania Dutch"?',
    options: [
      'Dauphin County',
      'Berks County',
      'Lancaster County',
      'Lebanon County',
    ],
    correctIndex: 2,
    explanation:
      'Lancaster County fue creado en 1729 como el cuarto condado de la provincia, sirviendo brevemente como capital del Congreso Continental el 27 de septiembre de 1777.',
  },
  {
    id: 4,
    eraTag: '1777 · Revolución',
    countyName: 'York',
    question:
      'Durante la ocupación británica de Filadelfia en 1777, ¿en qué sede condal al oeste del río Susquehanna aprobó el Congreso Continental los Artículos de la Confederación?',
    options: [
      'Carlisle (Cumberland County)',
      'York (York County)',
      'Reading (Berks County)',
      'Easton (Northampton County)',
    ],
    correctIndex: 1,
    explanation:
      'El Congreso Continental sesionó durante nueve meses en York (1777–1778), donde adoptó los Artículos de la Confederación el 15 de noviembre de 1777.',
  },
  {
    id: 5,
    eraTag: '1859 · Energía Mundial',
    countyName: 'Crawford',
    question:
      '¿En qué localidad del noroeste de Pensilvania perforó el "Coronel" Edwin L. Drake el primer pozo comercial de petróleo del mundo en agosto de 1859?',
    options: [
      'Bradford (McKean County)',
      'Titusville (Crawford County)',
      'Meadville (Crawford County)',
      'Warren (Warren County)',
    ],
    correctIndex: 1,
    explanation:
      'El 27 de agosto de 1859, Edwin Drake perforó petróleo a 69.5 pies en el valle de Oil Creek al sur de Titusville (Crawford County), iniciando la industria petrolera moderna.',
  },
  {
    id: 6,
    eraTag: '1863 · Guerra Civil',
    countyName: 'Adams',
    question:
      '¿En qué condado del sur de Pensilvania se libró entre el 1 y el 3 de julio de 1863 la batalla más sangrienta de la Guerra Civil estadounidense?',
    options: [
      'Franklin County',
      'Adams County',
      'Cumberland County',
      'Fulton County',
    ],
    correctIndex: 1,
    explanation:
      'La Batalla de Gettysburg y el posterior Discurso de Gettysburg de Abraham Lincoln tuvieron lugar en Gettysburg, sede del condado de Adams (fundado en 1800).',
  },
  {
    id: 7,
    eraTag: '1864 · Guerra Civil',
    countyName: 'Franklin',
    question:
      '¿Qué sede condal del valle de Cumberland fue la única gran ciudad del Norte incendiada por tropas confederadas en julio de 1864 tras negarse a pagar un rescate en oro?',
    options: [
      'Chambersburg (Franklin County)',
      'Gettysburg (Adams County)',
      'Waynesboro (Franklin County)',
      'Bedford (Bedford County)',
    ],
    correctIndex: 0,
    explanation:
      'El 30 de julio de 1864 la caballería confederada de John McCausland incendió más de 500 edificios en Chambersburg, sede de Franklin County.',
  },
  {
    id: 8,
    eraTag: 'Geografía Fluvial',
    countyName: 'Allegheny',
    question:
      'En el "Triángulo Dorado" de Pittsburgh (Allegheny County), ¿qué dos ríos confluyen para dar nacimiento al gran río Ohio?',
    options: [
      'Ríos Delaware y Schuylkill',
      'Ríos Susquehanna y Juniata',
      'Ríos Allegheny y Monongahela',
      'Ríos Lehigh y Lackawanna',
    ],
    correctIndex: 2,
    explanation:
      'En Point State Park (Forks of the Ohio, Pittsburgh), el río Allegheny (desde el norte) y el río Monongahela (desde el sur) se unen para formar el río Ohio.',
  },
  {
    id: 9,
    eraTag: '1812 · Capital Estatal',
    countyName: 'Dauphin',
    question:
      '¿En qué condado a orillas del río Susquehanna se ubica Harrisburg, capital oficial de Pensilvania desde 1812?',
    options: [
      'Cumberland County',
      'Perry County',
      'Dauphin County',
      'Lebanon County',
    ],
    correctIndex: 2,
    explanation:
      'Harrisburg es la sede de Dauphin County (fundado en 1785 y nombrado en honor al delfín de Francia, Luis José, tras la alianza revolucionaria).',
  },
  {
    id: 10,
    eraTag: '1792 · Gran Lago',
    countyName: 'Erie',
    question:
      '¿Qué compra territorial de 1792 permitió a Pensilvania adquirir su única salida portuaria de agua dulce hacia los Grandes Lagos y construir la flota de Oliver Hazard Perry en 1813?',
    options: [
      'El Triángulo de Erie (Erie Triangle)',
      'La Compra Caminante (Walking Purchase)',
      'El Tratado de Fort Stanwix',
      'La Línea Mason-Dixon',
    ],
    correctIndex: 0,
    explanation:
      'La compra federal del Triángulo de Erie en 1792 otorgó a Erie County más de 40 millas de costa sobre el Lago Erie y la bahía natural de Presque Isle.',
  },
  {
    id: 11,
    eraTag: '1777 · Campaña de Filadelfia',
    countyName: 'Chester',
    question:
      '¿Dónde tuvo lugar el 11 de septiembre de 1777 el enfrentamiento terrestre con mayor número de soldados de toda la Guerra de Independencia?',
    options: [
      'Batalla de Germantown (Philadelphia)',
      'Batalla de Brandywine (Chester / Delaware County)',
      'Masacre de Wyoming (Luzerne County)',
      'Fuerte Necessity (Fayette County)',
    ],
    correctIndex: 1,
    explanation:
      'En los vados del arroyo Brandywine cerca de Chadds Ford combatieron cerca de 30,000 soldados bajo George Washington y el general británico William Howe.',
  },
  {
    id: 12,
    eraTag: '1892 · Era del Acero',
    countyName: 'Allegheny',
    question:
      '¿Qué conflicto laboral de julio de 1892 enfrentó a los trabajadores metalúrgicos con 300 agentes de Pinkerton en una planta de Andrew Carnegie junto al río Monongahela?',
    options: [
      'Rebelión del Whisky',
      'Huelga Siderúrgica de Homestead',
      'Huelga de Antracita de 1902',
      'Motín Ferroviario de Reading',
    ],
    correctIndex: 1,
    explanation:
      'La Huelga de Homestead (6 de julio de 1892) en Allegheny County fue uno de los episodios sindicales más decisivos de la industrialización estadounidense.',
  },
  {
    id: 13,
    eraTag: '1834 · Ingeniería',
    countyName: 'Blair',
    question:
      'En el Canal Principal de Pensilvania, ¿qué sistema ferroviario de planos inclinados entre Hollidaysburg (Blair) y Johnstown (Cambria) permitía cruzar la cresta de los Montes Alleghenies?',
    options: [
      'Allegheny Portage Railroad',
      ' Strasburg Rail Road',
      'Kinzua Viaduct Line',
      'Switchback Gravity Railroad',
    ],
    correctIndex: 0,
    explanation:
      'Inaugurado en 1834, el Allegheny Portage Railroad izaba los botes seccionables del canal mediante 10 planos inclinados accionados por vapor sobre la divisoria continental oriental.',
  },
  {
    id: 14,
    eraTag: 'Geografía · Superficie',
    countyName: 'Lycoming',
    question:
      'Con 1,229 millas cuadradas (más grande que el estado de Rhode Island) y sede en Williamsport, ¿cuál es el condado de mayor superficie territorial de los 67 de Pensilvania?',
    options: [
      'Centre County',
      'Bradford County',
      'Lycoming County',
      'Westmoreland County',
    ],
    correctIndex: 2,
    explanation:
      'Lycoming County (fundado en 1795) es el condado más extenso de Pensilvania y fue en el siglo XIX la capital mundial de la industria maderera.',
  },
  {
    id: 15,
    eraTag: '1855 · Educación Superior',
    countyName: 'Centre',
    question:
      '¿En qué condado situado en el centro geográfico exacto del estado (con sede en Bellefonte, cuna del gobernador Andrew Curtin) se fundó en 1855 Penn State University?',
    options: [
      'Centre County',
      'Union County',
      'Clinton County',
      'Huntingdon County',
    ],
    correctIndex: 0,
    explanation:
      'Centre County toma su nombre de su posición central en Pensilvania; alberga State College (Penn State) y la histórica sede victoriana de Bellefonte.',
  },
  {
    id: 16,
    eraTag: '1829 · Carbón y Transporte',
    countyName: 'Wayne',
    question:
      '¿En qué sede condal de Wayne County realizó el "Stourbridge Lion" el primer recorrido de una locomotora de vapor en una vía comercial de Estados Unidos el 8 de agosto de 1829?',
    options: [
      'Honesdale (Wayne County)',
      'Jim Thorpe / Mauch Chunk (Carbon County)',
      'Pottsville (Schuylkill County)',
      'Milford (Pike County)',
    ],
    correctIndex: 0,
    explanation:
      'Honesdale (Wayne County) fue el punto de partida del histórico recorrido del Stourbridge Lion para la Delaware and Hudson Canal Company.',
  },
  {
    id: 17,
    eraTag: '1754 · Guerra Franco-ígena',
    countyName: 'Fayette',
    question:
      '¿En qué condado de los Laurel Highlands construyó un joven George Washington el Fuerte Necessity en 1754, dando inicio a la Guerra de los Siete Años?',
    options: [
      'Somerset County',
      'Fayette County',
      'Washington County',
      'Greene County',
    ],
    correctIndex: 1,
    explanation:
      'Fort Necessity National Battlefield se ubica en Farmington, Fayette County (nombrado en honor al Marqués de Lafayette y con sede en Uniontown).',
  },
  {
    id: 18,
    eraTag: '1905 · Conservación Forestal',
    countyName: 'Pike',
    question:
      '¿Qué gobernador de Pensilvania y primer jefe del Servicio Forestal de EE. UU. impulsó desde su residencia Grey Towers (Milford, Pike County) la reforestación estatal y las carreteras rurales "Pinchot Roads"?',
    options: [
      'Gifford Pinchot',
      'Thomas Mifflin',
      'Milton Shapp',
      'Simon Cameron',
    ],
    correctIndex: 0,
    explanation:
      'Gifford Pinchot (gobernador 1923–1927 y 1931–1935) fue el padre de la conservación forestal estadounidense y pavimentó más de 20,000 millas rurales durante la Gran Depresión.',
  },
  {
    id: 19,
    eraTag: 'Geografía Física · Cumbre',
    countyName: 'Somerset',
    question:
      'Con 3,213 pies sobre el nivel del mar y ubicado en la frontera sur de Somerset County, ¿cuál es el punto natural más alto de Pensilvania (donde también se halla Shanksville)?',
    options: [
      'Mount Davis (Negro Mountain)',
      'Camelback Mountain (Monroe County)',
      'Blue Knob (Bedford County)',
      'Hawk Mountain (Berks/Schuylkill)',
    ],
    correctIndex: 0,
    explanation:
      'Mount Davis, en la cresta de Negro Mountain en Somerset County, es el techo topográfico de la Mancomunidad de Pensilvania con 3,213 pies.',
  },
  {
    id: 20,
    eraTag: 'Siglo XIX · Abolicionismo',
    countyName: 'Lancaster',
    question:
      '¿Qué congresista abolicionista de Gettysburg y Lancaster defendió las escuelas públicas gratuitas en 1835 y lideró la aprobación de las Enmiendas 13.ª y 14.ª de la Constitución?',
    options: [
      'James Buchanan',
      'Thaddeus Stevens',
      'David Wilmot',
      'Robert Morris',
    ],
    correctIndex: 1,
    explanation:
      'Thaddeus Stevens ejerció la abogacía en Gettysburg (Adams) y Lancaster, operó una estación del Ferrocarril Subterráneo y lideró la Reconstrucción en el Congreso.',
  },
];

type RivalryPresetId = '1776' | '1863' | '1682';

interface RivalryPreset {
  id: RivalryPresetId;
  label: string;
  teamAName: string;
  teamAColor: string;
  teamBName: string;
  teamBColor: string;
}

const RIVALRY_PRESETS: RivalryPreset[] = [
  {
    id: '1776',
    label: 'Duelo Revolucionario (1776): Patriots vs. Loyalists',
    teamAName: 'Patriots (Continentales)',
    teamAColor: '#1D3557',
    teamBName: 'Loyalists (Realistas)',
    teamBColor: '#9B2226',
  },
  {
    id: '1863',
    label: 'Duelo de Gettysburg (1863): Union vs. Confederates',
    teamAName: 'Army of the Potomac (Union)',
    teamAColor: '#1D3557',
    teamBName: 'Army of Northern Virginia (Confederates)',
    teamBColor: '#9B2226',
  },
  {
    id: '1682',
    label: 'Duelo Fundacional (1682): Quakers vs. Frontiersmen',
    teamAName: 'Delaware Valley Quakers',
    teamAColor: '#D4AF37',
    teamBName: 'Allegheny Frontiersmen',
    teamBColor: '#2A9D8F',
  },
];

interface ClassroomTriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCounty: (county: CountyRecord) => void;
}

export const ClassroomTriviaModal: React.FC<ClassroomTriviaModalProps> = ({
  isOpen,
  onClose,
  onSelectCounty,
}) => {
  const [gameMode, setGameMode] = useState<'solo' | 'teams'>('teams');
  const [rivalryId, setRivalryId] = useState<RivalryPresetId>('1776');
  const [questionLimit, setQuestionLimit] = useState<number>(20);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Scores
  const [soloScore, setSoloScore] = useState<number>(0);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);

  const activeRivalry =
    RIVALRY_PRESETS.find((r) => r.id === rivalryId) || RIVALRY_PRESETS[0];
  const questionsPool = PA_TRIVIA_QUESTIONS.slice(0, questionLimit);
  const currentQuestion = questionsPool[currentIdx] || questionsPool[0];
  const currentTurnTeam: 'A' | 'B' = currentIdx % 2 === 0 ? 'A' : 'B';

  // 30-second countdown timer
  useEffect(() => {
    if (
      !isOpen ||
      !hasStarted ||
      isFinished ||
      selectedOption !== null ||
      isTimerPaused
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setSelectedOption(-1); // Time expired
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    isOpen,
    hasStarted,
    isFinished,
    selectedOption,
    isTimerPaused,
    timeLeft,
  ]);

  if (!isOpen) return null;

  const handleStartGame = () => {
    setCurrentIdx(0);
    setTimeLeft(30);
    setIsTimerPaused(false);
    setSelectedOption(null);
    setIsFinished(false);
    setSoloScore(0);
    setTeamAScore(0);
    setTeamBScore(0);
    setHasStarted(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);

    const isCorrect = optIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      const bonus = timeLeft >= 20 ? 150 : timeLeft >= 10 ? 120 : 100;
      if (gameMode === 'solo') {
        setSoloScore((s) => s + bonus);
      } else if (currentTurnTeam === 'A') {
        setTeamAScore((s) => s + bonus);
      } else {
        setTeamBScore((s) => s + bonus);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 >= questionsPool.length) {
      setIsFinished(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(30);
      setIsTimerPaused(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/88 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Desafío Rápido en Clase — Trivia Histórica de Pensilvania"
    >
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#161920]/96 border-2 border-[#D4AF37]/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#0D0F12] flex items-center justify-center shrink-0 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37] font-bold">
                DESAFÍO RÁPIDO EN CLASE · 67 CONDADOS DE PENSILVANIA
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#F4F1EA]">
                Trivia Cartográfica e Histórica para Proyección en Aula
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar trivia"
            className="p-2 rounded-lg bg-[#161920] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen 1: Setup Screen */}
        {!hasStarted && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mode: Teams vs Solo */}
              <button
                type="button"
                onClick={() => setGameMode('teams')}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                  gameMode === 'teams'
                    ? 'bg-[#1D3557]/75 border-[#D4AF37] text-[#F4F1EA] shadow-xl'
                    : 'bg-[#0D0F12]/60 border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#D4AF37]" />
                  <span className="font-serif text-lg font-bold text-[#F4F1EA]">
                    Duelo de Equipos en Aula
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#A39E93]">
                  Ideal para proyectar en pizarra digital (Smartboard). Divide la clase en dos bandos históricos que responden por turnos con marcador en vivo.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('solo')}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                  gameMode === 'solo'
                    ? 'bg-[#1D3557]/75 border-[#D4AF37] text-[#F4F1EA] shadow-xl'
                    : 'bg-[#0D0F12]/60 border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                  <span className="font-serif text-lg font-bold text-[#F4F1EA]">
                    Modo Individual / Repaso General
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#A39E93]">
                  Recorrido continuo con temporizador de 30 segundos por pregunta y retroalimentación documental inmediata.
                </p>
              </button>
            </div>

            {gameMode === 'teams' && (
              <div className="space-y-2.5">
                <label className="block text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                  Selecciona los Bandos Históricos del Duelo:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {RIVALRY_PRESETS.map((preset) => {
                    const isSelected = rivalryId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setRivalryId(preset.id)}
                        className={`p-3.5 rounded-xl text-left flex items-center justify-between gap-3 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0D0F12] border-[#D4AF37] text-[#F4F1EA]'
                            : 'bg-[#0D0F12]/50 border-[#C5A059]/20 text-[#A39E93] hover:text-[#F4F1EA]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Swords className="w-4 h-4 text-[#D4AF37]" />
                          <span className="font-serif text-sm font-bold">
                            {preset.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-sm bg-[#1D3557] text-[#F4F1EA]">
                            {preset.teamAName.split(' (')[0]}
                          </span>
                          <span className="text-[#D4AF37]">VS</span>
                          <span className="px-2 py-0.5 rounded-sm bg-[#9B2226] text-[#F4F1EA]">
                            {preset.teamBName.split(' (')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question Count Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#C5A059]/20">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
                  Extensión de la Partida
                </div>
                <div className="text-xs text-[#A39E93]">
                  Temporizador oficial de 30 segundos por pregunta
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[10, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionLimit(count)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer border ${
                      questionLimit === count
                        ? 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA]'
                        : 'bg-[#0D0F12] text-[#A39E93] border-[#C5A059]/30'
                    }`}
                  >
                    {count === 20
                      ? '20 Preguntas (Banco Completo)'
                      : `${count} Preguntas Rápidas`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xl"
            >
              <Play className="w-5 h-5" />
              <span>Iniciar Desafío en el Aula ({questionLimit} Preguntas)</span>
            </button>
          </div>
        )}

        {/* Screen 2: Active Gameplay */}
        {hasStarted && !isFinished && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Top Scoreboard & 30s Countdown Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#0D0F12]/90 border border-[#C5A059]/30 rounded-xl p-3.5">
              {/* Scoreboard */}
              <div className="sm:col-span-7 flex items-center gap-3">
                {gameMode === 'teams' ? (
                  <>
                    <div
                      className={`flex-1 p-2.5 rounded-lg border transition-all ${
                        currentTurnTeam === 'A'
                          ? 'bg-[#1D3557]/80 border-[#D4AF37] shadow-md'
                          : 'bg-[#161920]/60 border-[#C5A059]/20 opacity-75'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase text-[#D4AF37] flex items-center justify-between">
                        <span>EQUIPO A {currentTurnTeam === 'A' ? '· TURNO ACTIVO' : ''}</span>
                      </div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-[#F4F1EA] truncate">
                        {activeRivalry.teamAName}
                      </div>
                      <div className="font-mono text-lg font-bold text-[#D4AF37] tabular-nums">
                        {teamAScore} pts
                      </div>
                    </div>

                    <div
                      className={`flex-1 p-2.5 rounded-lg border transition-all ${
                        currentTurnTeam === 'B'
                          ? 'bg-[#9B2226]/80 border-[#D4AF37] shadow-md'
                          : 'bg-[#161920]/60 border-[#C5A059]/20 opacity-75'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase text-[#D4AF37] flex items-center justify-between">
                        <span>EQUIPO B {currentTurnTeam === 'B' ? '· TURNO ACTIVO' : ''}</span>
                      </div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-[#F4F1EA] truncate">
                        {activeRivalry.teamBName}
                      </div>
                      <div className="font-mono text-lg font-bold text-[#D4AF37] tabular-nums">
                        {teamBScore} pts
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-1.5">
                    <div className="text-[10px] font-mono uppercase text-[#A39E93]">
                      PUNTUACIÓN ACUMULADA
                    </div>
                    <div className="font-mono text-xl font-bold text-[#D4AF37] tabular-nums">
                      {soloScore} puntos
                    </div>
                  </div>
                )}
              </div>

              {/* Progress + 30s Timer */}
              <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-3">
                <div className="text-right">
                  <div className="font-mono text-xs text-[#D4AF37] font-bold tabular-nums">
                    Pregunta {currentIdx + 1} de {questionsPool.length}
                  </div>
                  <div className="text-[11px] text-[#A39E93]">
                    {currentQuestion.eraTag}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#161920] border border-[#D4AF37]/50 rounded-xl px-3 py-2">
                  <Timer
                    className={`w-4 h-4 ${
                      timeLeft <= 8
                        ? 'text-[#E63946] animate-pulse'
                        : 'text-[#D4AF37]'
                    }`}
                  />
                  <span
                    className={`font-mono text-lg font-bold tabular-nums ${
                      timeLeft <= 8 ? 'text-[#E63946]' : 'text-[#F4F1EA]'
                    }`}
                  >
                    {timeLeft}s
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsTimerPaused((p) => !p)}
                    title={isTimerPaused ? 'Reanudar reloj' : 'Pausar reloj'}
                    className="ml-1 p-1 rounded-md hover:bg-[#0D0F12] text-[#A39E93] hover:text-[#D4AF37] cursor-pointer"
                  >
                    {isTimerPaused ? (
                      <Play className="w-3.5 h-3.5" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#0D0F12]/70 border border-[#C5A059]/35 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#D4AF37]">
                <span>CONDADO VINCULADO: {currentQuestion.countyName.toUpperCase()} COUNTY</span>
                {gameMode === 'teams' && (
                  <span className="px-2 py-0.5 rounded-sm bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                    Responde:{' '}
                    {currentTurnTeam === 'A'
                      ? activeRivalry.teamAName
                      : activeRivalry.teamBName}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#F4F1EA] leading-snug">
                {currentQuestion.question}
              </h3>

              {/* 4 Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isRevealed = selectedOption !== null;
                  const isCorrectOpt = idx === currentQuestion.correctIndex;
                  const isChosenOpt = idx === selectedOption;

                  let btnClass =
                    'bg-[#161920] hover:bg-[#1D3557]/60 border-[#C5A059]/30 hover:border-[#D4AF37] text-[#F4F1EA]';
                  if (isRevealed) {
                    if (isCorrectOpt) {
                      btnClass =
                        'bg-[#2D6A4F]/85 border-[#52B788] text-[#F4F1EA] shadow-lg';
                    } else if (isChosenOpt && !isCorrectOpt) {
                      btnClass =
                        'bg-[#9B2226]/85 border-[#E63946] text-[#F4F1EA]';
                    } else {
                      btnClass =
                        'bg-[#0D0F12]/50 border-[#C5A059]/15 text-[#A39E93] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isRevealed}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer border-2 ${btnClass}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-[#0D0F12]/80 border border-[#D4AF37]/50 font-mono text-xs font-bold text-[#D4AF37] flex items-center justify-center shrink-0">
                          {letters[idx]}
                        </span>
                        <span className="text-sm sm:text-base font-medium leading-snug">
                          {opt}
                        </span>
                      </div>

                      {isRevealed && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-[#52B788] shrink-0" />
                      )}
                      {isRevealed && isChosenOpt && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-[#F4F1EA] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Historical Explanation Banner after answering */}
              {selectedOption !== null && (
                <div className="mt-4 pt-4 border-t border-[#C5A059]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161920]/90 rounded-xl p-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider font-bold">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <span className="text-[#52B788]">
                          ✓ ¡RESPUESTA CORRECTA!
                        </span>
                      ) : selectedOption === -1 ? (
                        <span className="text-[#E07A5F]">
                          ⏰ TIEMPO AGOTADO (30 SEGUNDOS)
                        </span>
                      ) : (
                        <span className="text-[#E63946]">
                          ✕ RESPUESTA INCORRECTA
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#F4F1EA]/90 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const c = PA_COUNTIES_DATA[currentQuestion.countyName];
                        if (c) {
                          onSelectCounty(c);
                          onClose();
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/35 text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Ver {currentQuestion.countyName}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>
                        {currentIdx + 1 >= questionsPool.length
                          ? 'Ver Podio Final'
                          : 'Siguiente Pregunta'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Screen 3: Final Podium & Summary */}
        {hasStarted && isFinished && (
          <div className="p-8 text-center space-y-6">
            <Trophy className="w-14 h-14 text-[#D4AF37] mx-auto" />
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                PARTIDA COMPLETADA · {questionsPool.length} PREGUNTAS
              </div>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
                {gameMode === 'solo'
                  ? `Puntuación Final: ${soloScore} puntos`
                  : teamAScore > teamBScore
                    ? `¡Victoria para ${activeRivalry.teamAName}!`
                    : teamBScore > teamAScore
                      ? `¡Victoria para ${activeRivalry.teamBName}!`
                      : '¡Empate Histórico entre ambos Equipos!'}
              </h3>
            </div>

            {gameMode === 'teams' && (
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="p-4 rounded-xl bg-[#1D3557]/70 border border-[#D4AF37]">
                  <div className="font-serif text-sm font-bold text-[#F4F1EA]">
                    {activeRivalry.teamAName}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#D4AF37] mt-1">
                    {teamAScore} pts
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#9B2226]/70 border border-[#D4AF37]">
                  <div className="font-serif text-sm font-bold text-[#F4F1EA]">
                    {activeRivalry.teamBName}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#D4AF37] mt-1">
                    {teamBScore} pts
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHasStarted(false)}
                className="px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#C5A059]/40 text-xs font-semibold text-[#F4F1EA] hover:border-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                <span>Configurar Nueva Partida</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0D0F12] font-bold text-xs cursor-pointer"
              >
                Volver al Atlas Cartográfico
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomTriviaModal;
