import React, { useState } from 'react';
import {
  GraduationCap,
  MonitorUp,
  MousePointer,
  PenTool,
  MoveUpRight,
  Circle,
  Trash2,
  Undo2,
  ScrollText,
  FileSpreadsheet,
  Trophy,
  ExternalLink,
  HelpCircle,
  X,
  MapPin,
} from 'lucide-react';
import {
  WhiteboardColor,
  WhiteboardTool,
} from './WhiteboardCanvasOverlay';
import {
  PRIMARY_SOURCES_DATA,
  PrimarySourceCapsule,
} from '../data/primarySourcesData';
import { CountyRecord, PA_COUNTIES_DATA } from '../data/paCountiesData';
import AudioNarratorWidget from './AudioNarratorWidget';
import { buildPrimarySourceNarrationScript } from '../services/speechService';
import { useTranslation } from '../context/LanguageContext';

interface TeacherToolbarProps {
  isSmartboardScale: boolean;
  onToggleSmartboardScale: () => void;
  activeTool: WhiteboardTool;
  onSelectTool: (tool: WhiteboardTool) => void;
  activeColor: WhiteboardColor;
  onSelectColor: (color: WhiteboardColor) => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  strokeCount: number;
  onUndoStroke: () => void;
  onClearWhiteboard: () => void;
  onOpenWorksheetModal: (initialSource?: PrimarySourceCapsule) => void;
  onOpenTriviaModal: () => void;
  onSelectCounty: (county: CountyRecord) => void;
  onCloseTeacherMode: () => void;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  isSmartboardScale,
  onToggleSmartboardScale,
  activeTool,
  onSelectTool,
  activeColor,
  onSelectColor,
  strokeWidth,
  onChangeStrokeWidth,
  strokeCount,
  onUndoStroke,
  onClearWhiteboard,
  onOpenWorksheetModal,
  onOpenTriviaModal,
  onSelectCounty,
  onCloseTeacherMode,
}) => {
  const { t } = useTranslation();
  const [isSourcesDrawerOpen, setIsSourcesDrawerOpen] =
    useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<PrimarySourceCapsule>(
    PRIMARY_SOURCES_DATA[0]
  );

  const colorOptions: {
    id: WhiteboardColor;
    label: string;
    swatch: string;
  }[] = [
    {
      id: '#D4AF37',
      label: 'Parchment Gold',
      swatch: '#D4AF37',
    },
    {
      id: '#9B2226',
      label: 'Revolutionary Crimson',
      swatch: '#E63946',
    },
    {
      id: '#1D3557',
      label: 'Colonial Blue',
      swatch: '#3A7CA5',
    },
  ];

  return (
    <>
      {/* Floating Classroom Mode Sidebar (Left-Center / Bottom-Left responsive) */}
      <aside
        aria-label={t.teacherToolbar.title}
        className="fixed left-3 bottom-28 z-30 w-[290px] bg-[#161920]/94 backdrop-blur-2xl border-2 border-[#D4AF37]/65 rounded-2xl p-3.5 shadow-2xl space-y-3 pointer-events-auto no-print"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#C5A059]/25">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-[#0D0F12] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] font-bold">
                {t.teacherToolbar.kicker}
              </div>
              <div className="font-serif text-sm font-bold text-[#F4F1EA]">
                {t.teacherToolbar.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseTeacherMode}
            title={t.teacherToolbar.exitTitle}
            aria-label={t.teacherToolbar.exitTitle}
            className="p-1 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Smartboard Projection Mode (+18% Typography) */}
        <button
          type="button"
          onClick={onToggleSmartboardScale}
          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer border ${
            isSmartboardScale
              ? 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA] shadow-md'
              : 'bg-[#0D0F12]/80 text-[#F4F1EA] hover:border-[#D4AF37] border-[#C5A059]/30'
          }`}
        >
          <span className="flex items-center gap-2">
            <MonitorUp className="w-4 h-4 shrink-0" />
            <span>{t.teacherToolbar.smartboardBtn}</span>
          </span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm ${
              isSmartboardScale
                ? 'bg-[#0D0F12] text-[#D4AF37]'
                : 'bg-[#161920] text-[#D4AF37]'
            }`}
          >
            {isSmartboardScale ? '+18% ON' : '+18% OFF'}
          </span>
        </button>

        {/* 2. Interactive Whiteboard Tools (HTML5 Canvas) */}
        <div className="bg-[#0D0F12]/75 border border-[#C5A059]/25 rounded-xl p-2.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
              {t.teacherToolbar.whiteboardHeader}
            </span>
            {strokeCount > 0 && (
              <span className="font-mono text-[10px] text-[#A39E93]">
                {t.teacherToolbar.strokesCount(strokeCount)}
              </span>
            )}
          </div>

          {/* 4 Tool Buttons: Navigate, Pen, Tactical Arrow, Circle */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectTool('navigate')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTool === 'navigate'
                  ? 'bg-[#1D3557] text-[#F4F1EA] border-[#D4AF37] font-semibold'
                  : 'bg-[#161920] text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.teacherToolbar.toolNavigate}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('pen')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTool === 'pen'
                  ? 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA] font-semibold'
                  : 'bg-[#161920] text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{t.teacherToolbar.toolPen}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('arrow')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTool === 'arrow'
                  ? 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA] font-semibold'
                  : 'bg-[#161920] text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
              }`}
            >
              <MoveUpRight className="w-3.5 h-3.5" />
              <span>{t.teacherToolbar.toolArrow}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('circle')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTool === 'circle'
                  ? 'bg-[#D4AF37] text-[#0D0F12] border-[#F4F1EA] font-semibold'
                  : 'bg-[#161920] text-[#A39E93] hover:text-[#F4F1EA] border-[#C5A059]/20'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              <span>{t.teacherToolbar.toolCircle}</span>
            </button>
          </div>

          {/* Color Swatches + Undo + Clear */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#C5A059]/15">
            <div className="flex items-center gap-1.5">
              {colorOptions.map((c) => {
                const isSelected = activeColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectColor(c.id);
                      if (activeTool === 'navigate') {
                        onSelectTool('arrow');
                      }
                    }}
                    title={c.label}
                    aria-label={c.label}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border-2 ${
                      isSelected
                        ? 'scale-115 border-[#F4F1EA] shadow-md'
                        : 'border-[#0D0F12] opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.swatch }}
                  />
                );
              })}
            </div>

            {/* Stroke Width Toggle */}
            <div className="flex items-center gap-1">
              {[3, 5, 8].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChangeStrokeWidth(w)}
                  title={`${w}px`}
                  className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border ${
                    strokeWidth === w
                      ? 'bg-[#1D3557] border-[#D4AF37]'
                      : 'bg-[#161920] border-[#C5A059]/20'
                  }`}
                >
                  <span
                    className="rounded-full bg-[#F4F1EA]"
                    style={{ width: w + 1, height: w + 1 }}
                  />
                </button>
              ))}
            </div>

            {/* Undo & Clear Whiteboard */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={strokeCount === 0}
                onClick={onUndoStroke}
                title={t.teacherToolbar.undoTitle}
                aria-label={t.teacherToolbar.undoTitle}
                className="p-1.5 rounded-lg bg-[#161920] border border-[#C5A059]/25 text-[#A39E93] hover:text-[#F4F1EA] disabled:opacity-35 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={strokeCount === 0}
                onClick={onClearWhiteboard}
                title={t.teacherToolbar.clearTitle}
                aria-label={t.teacherToolbar.clearTitle}
                className="p-1.5 rounded-lg bg-[#9B2226]/80 hover:bg-[#9B2226] text-[#F4F1EA] disabled:opacity-35 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Classroom Pedagogical Modules (Primary Sources, PDE Worksheet PDF, Classroom Trivia) */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsSourcesDrawerOpen((prev) => !prev)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer border ${
              isSourcesDrawerOpen
                ? 'bg-[#1D3557] text-[#F4F1EA] border-[#D4AF37] font-semibold'
                : 'bg-[#0D0F12]/80 text-[#F4F1EA] hover:border-[#D4AF37] border-[#C5A059]/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.teacherToolbar.primarySourcesBtn}</span>
            </span>
            <span className="font-mono text-[10px] text-[#D4AF37]">
              ({PRIMARY_SOURCES_DATA.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWorksheetModal(selectedSource)}
            className="w-full px-3 py-2 rounded-xl bg-[#0D0F12]/80 hover:bg-[#1D3557]/70 border border-[#C5A059]/30 hover:border-[#D4AF37] text-xs font-medium text-[#F4F1EA] flex items-center justify-between gap-2 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.teacherToolbar.worksheetBtn}</span>
            </span>
            <span className="font-mono text-[10px] text-[#D4AF37]">PDE 8.2</span>
          </button>

          <button
            type="button"
            onClick={onOpenTriviaModal}
            className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2bc3f] hover:to-[#d4af37] text-[#0D0F12] font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{t.teacherToolbar.triviaBtn}</span>
            </span>
            <span className="font-mono text-[10px] bg-[#0D0F12] text-[#D4AF37] px-1.5 py-0.5 rounded-sm">
              {t.teacherToolbar.triviaCountBadge}
            </span>
          </button>
        </div>
      </aside>

      {/* Primary Sources & Socratic Questions Modal / Drawer for Classroom Discussion */}
      {isSourcesDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0D0F12]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
          role="dialog"
          aria-modal="true"
          aria-label="Cápsulas de Fuentes Primarias de Pensilvania"
        >
          <div className="w-full max-w-5xl max-h-[88vh] bg-[#161920]/95 border border-[#C5A059]/45 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12]/70 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold">
                  DOCUMENTOS FUNDACIONALES · PDE ACADEMIC STANDARDS (8.2 PENNSYLVANIA HISTORY)
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
                  Cápsulas de Fuentes Primarias y Seminario Socrático
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsSourcesDrawerOpen(false)}
                aria-label="Cerrar fuentes primarias"
                className="p-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Selector Tabs */}
            <div className="px-6 py-3 border-b border-[#C5A059]/20 bg-[#161920] flex items-center gap-2 overflow-x-auto no-scrollbar">
              {PRIMARY_SOURCES_DATA.map((src) => {
                const isSelected = selectedSource.id === src.id;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setSelectedSource(src)}
                    className={`px-3.5 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1D3557]/85 border-[#D4AF37] text-[#F4F1EA] shadow-md'
                        : 'bg-[#0D0F12]/60 border-[#C5A059]/20 text-[#A39E93] hover:text-[#F4F1EA]'
                    }`}
                  >
                    <div className="font-serif text-xs sm:text-sm font-bold">
                      {src.shortTitle}
                    </div>
                    <div className="font-mono text-[10px] text-[#D4AF37] tabular-nums">
                      Año {src.year} · {src.pdeStandardCode}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Verbatim Excerpts & Historical Context */}
              <div className="lg:col-span-7 space-y-4">
                <AudioNarratorWidget
                  script={buildPrimarySourceNarrationScript(selectedSource)}
                  contextKey={`primary-source-${selectedSource.id}`}
                  label={`Audio-Fuente: ${selectedSource.shortTitle}`}
                />

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono text-[11px] text-[#D4AF37] font-semibold">
                    {selectedSource.pdeStandardCode}
                  </span>
                  <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
                    {selectedSource.title}
                  </h3>
                  <p className="text-xs text-[#A39E93] mt-0.5">
                    Autoría / Origen: <span className="text-[#F4F1EA]">{selectedSource.authorOrOrigin}</span>
                  </p>
                </div>

                {/* Verbatim Quote Box */}
                <blockquote className="p-4 rounded-xl bg-[#0D0F12]/90 border-l-4 border-[#D4AF37] space-y-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37]">
                    Cita Textual de Archivo (Traducción al Español):
                  </div>
                  <p className="font-serif text-sm sm:text-base italic text-[#F4F1EA] leading-relaxed">
                    {selectedSource.translatedQuoteEs}
                  </p>
                  <div className="pt-2 border-t border-[#C5A059]/15 text-xs text-[#A39E93] font-serif">
                    <span className="font-mono text-[10px] uppercase text-[#C5A059] not-italic block mb-0.5">
                      Texto Original en Inglés:
                    </span>
                    {selectedSource.originalQuoteEn}
                  </div>
                </blockquote>

                <div className="bg-[#0D0F12]/60 border border-[#C5A059]/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold mb-1">
                    Contexto Histórico y Territorial en Pensilvania
                  </div>
                  <p className="text-xs sm:text-sm text-[#F4F1EA]/90 leading-relaxed">
                    {selectedSource.historicalContext}
                  </p>
                </div>
              </div>

              {/* Right 5 cols: Socratic Questions, Linked Counties & Official Archival Links */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Socratic Questions */}
                  <div className="bg-[#1D3557]/25 border border-[#D4AF37]/45 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#D4AF37] font-bold">
                      <HelpCircle className="w-4 h-4" />
                      <span>Preguntas Socráticas para el Aula</span>
                    </div>

                    {selectedSource.socraticQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#0D0F12]/80 border border-[#C5A059]/25 text-xs sm:text-[13px] text-[#F4F1EA] leading-relaxed"
                      >
                        <span className="font-mono text-[#D4AF37] font-bold mr-1.5">
                          P{idx + 1}:
                        </span>
                        {q}
                      </div>
                    ))}
                  </div>

                  {/* Official Archival Links (pa.gov, archives.gov, hsp.org, loc.gov) */}
                  <div className="bg-[#0D0F12]/70 border border-[#C5A059]/25 rounded-xl p-4 space-y-2.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
                      Repositorios Oficiales Verificados
                    </div>
                    <div className="space-y-2">
                      {selectedSource.officialRepositories.map((repo) => (
                        <a
                          key={repo.url}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3 py-2 rounded-lg bg-[#161920] hover:bg-[#1D3557]/60 border border-[#C5A059]/30 hover:border-[#D4AF37] flex items-center justify-between gap-2 text-xs text-[#F4F1EA] transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">{repo.name}</div>
                            <div className="font-mono text-[10px] text-[#D4AF37]">
                              https://{repo.domainLabel}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Linked Counties */}
                  <div className="bg-[#0D0F12]/70 border border-[#C5A059]/25 rounded-xl p-3.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#A39E93] mb-2">
                      Jurisdicciones Vinculadas en el Atlas:
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedSource.linkedCounties.map((cName) => {
                        const c = PA_COUNTIES_DATA[cName];
                        if (!c) return null;
                        return (
                          <button
                            key={cName}
                            type="button"
                            onClick={() => {
                              onSelectCounty(c);
                              setIsSourcesDrawerOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#161920] hover:bg-[#1D3557] border border-[#C5A059]/30 text-xs text-[#F4F1EA] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
                            <span>{cName} County</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Direct CTA to Generate Printable PDE Worksheet from this Primary Source */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSourcesDrawerOpen(false);
                    onOpenWorksheetModal(selectedSource);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xl"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Generar Guía Imprimible PDE con esta Fuente Primaria</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherToolbar;
