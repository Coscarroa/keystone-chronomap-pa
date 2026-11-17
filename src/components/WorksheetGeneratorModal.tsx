import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  School,
  BookOpen,
  MapPin,
  CheckSquare,
} from 'lucide-react';
import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HistoricalEra,
  PA_COUNTIES_DATA,
} from '../data/paCountiesData';
import {
  PDE_HISTORY_STANDARDS,
  PRIMARY_SOURCES_DATA,
  PrimarySourceCapsule,
} from '../data/primarySourcesData';
import { useTranslation } from '../context/LanguageContext';
import {
  getLocalizedCountyDossier,
  getLocalizedEra,
  getLocalizedRegion,
} from '../i18n/translations';

interface WorksheetGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCounty: CountyRecord | null;
  activeEra: HistoricalEra;
  initialPrimarySource?: PrimarySourceCapsule | null;
}

const SOCRATIC_QUESTIONS_EN: Record<string, [string, string]> = {
  'penn-frame-1682': [
    'How did William Penn’s Frame of Government (1682) balance religious freedom with representative civic institutions across the three original counties (Philadelphia, Bucks, and Chester)?',
    'In what ways did Penn’s Quaker principles influence the peaceful Treaty of Shackamaxon with the Lenni-Lenape Nation compared to other seventeenth-century English colonies?',
  ],
  'gradual-abolition-1780': [
    'Why was Pennsylvania’s An Act for the Gradual Abolition of Slavery (1780) a historic milestone as the first legislative abolition law passed by a democracy in the Western Hemisphere?',
    'What limitations remained in the 1780 Act, and how did Pennsylvania communities along the Susquehanna and Delaware rivers later organize the Underground Railroad?',
  ],
  'gettysburg-address-1863': [
    'How did Abraham Lincoln connect the founding ideals of 1776 ("all men are created equal") with the sacrifices of Union soldiers at the Battle of Gettysburg in Adams County?',
    'What role did Pennsylvania Governor Andrew Gregg Curtin play in establishing the Soldiers’ National Cemetery in Gettysburg in November 1863?',
  ],
  'homestead-strike-1892': [
    'How did the rapid rise of Bessemer steel mills in Allegheny County create both unprecedented industrial wealth and intense labor conflict during the 1892 Homestead Strike?',
    'How do the testimonies of steelworkers and industrial management reflect the broader debate over workers’ rights and industrialization in Gilded Age Pennsylvania?',
  ],
};

export const WorksheetGeneratorModal: React.FC<WorksheetGeneratorModalProps> = ({
  isOpen,
  onClose,
  selectedCounty,
  activeEra,
  initialPrimarySource,
}) => {
  const { language, locale, t } = useTranslation();

  const [schoolName, setSchoolName] = useState<string>(
    'Commonwealth of Pennsylvania Social Studies Department'
  );
  const [courseGrade, setCourseGrade] = useState<string>(
    'Pennsylvania & U.S. History · Grades 9–12 (45 Min)'
  );
  const [selectedStandardCode, setSelectedStandardCode] = useState<string>(
    PDE_HISTORY_STANDARDS[0].code
  );
  const [countyName, setCountyName] = useState<string>(
    selectedCounty?.name || 'Philadelphia'
  );
  const [sourceId, setSourceId] = useState<string>(
    initialPrimarySource?.id || PRIMARY_SOURCES_DATA[0].id
  );
  const [includeDualLanguageQuote, setIncludeDualLanguageQuote] =
    useState<boolean>(true);

  useEffect(() => {
    if (selectedCounty) {
      setCountyName(selectedCounty.name);
    }
  }, [selectedCounty]);

  useEffect(() => {
    if (initialPrimarySource) {
      setSourceId(initialPrimarySource.id);
      setSelectedStandardCode(initialPrimarySource.pdeStandardCode);
    }
  }, [initialPrimarySource]);

  if (!isOpen) return null;

  const county =
    PA_COUNTIES_DATA[countyName] || PA_COUNTIES_DATA['Philadelphia'];
  const locRegion = getLocalizedRegion(county.region, language);
  const locCounty = getLocalizedCountyDossier(county, language);
  const locEra = getLocalizedEra(activeEra, language);

  const primarySource =
    PRIMARY_SOURCES_DATA.find((s) => s.id === sourceId) ||
    PRIMARY_SOURCES_DATA[0];
  const pdeStandard =
    PDE_HISTORY_STANDARDS.find((s) => s.code === selectedStandardCode) ||
    PDE_HISTORY_STANDARDS[0];

  const socraticPair =
    language === 'en'
      ? SOCRATIC_QUESTIONS_EN[primarySource.id] ||
        primarySource.socraticQuestions
      : primarySource.socraticQuestions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/88 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t.worksheet.modalTitle}
    >
      <div className="w-full max-w-6xl max-h-[92vh] bg-[#161920] border border-[#C5A059]/45 rounded-2xl shadow-2xl flex flex-col overflow-hidden print-only-worksheet">
        {/* Top Modal Controls Bar (Hidden when printing via .no-print) */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 bg-[#0D0F12] flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold">
                {t.worksheet.modalKicker}
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F4F1EA]">
                {t.worksheet.modalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0D0F12] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>{t.worksheet.printBtn}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.worksheet.closePreviewBtn}
              className="p-2 rounded-lg bg-[#161920] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Teacher Customization Controls (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-[#12151B] border-b border-[#C5A059]/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 no-print shrink-0">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mb-1">
              {t.worksheet.schoolLabel}
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mb-1">
              {t.worksheet.countyLabel}
            </label>
            <select
              value={countyName}
              onChange={(e) => setCountyName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              {ALL_COUNTIES_LIST.map((c) => (
                <option key={c.fips} value={c.name}>
                  {c.name} County ({c.founded} · {c.countySeat})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mb-1">
              {t.worksheet.sourceLabel}
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              {PRIMARY_SOURCES_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortTitle} ({s.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mb-1">
              {t.worksheet.standardLabel}
            </label>
            <select
              value={selectedStandardCode}
              onChange={(e) => setSelectedStandardCode(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              {PDE_HISTORY_STANDARDS.map((std) => (
                <option key={std.code} value={std.code}>
                  {std.code} — {std.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Black-and-White Ink-Saving Sheet Preview (Automatically Generated in EN or ES) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0D0F12] print:bg-white print:p-0">
          <div className="max-w-4xl mx-auto bg-white text-black rounded-xl shadow-2xl p-6 sm:p-10 border border-neutral-300 print:border-none print:shadow-none print:p-0 space-y-5 font-sans">
            {/* Sheet Header: School & Student Metadata */}
            <header className="border-b-2 border-black pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold text-neutral-700">
                    {t.worksheet.sheetHeaderKicker}
                  </div>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-black mt-0.5">
                    {schoolName}
                  </h1>
                  <p className="text-xs text-neutral-700 font-medium">
                    {courseGrade} · {t.worksheet.referenceEra}{' '}
                    {locEra.yearLabel} ({locEra.title})
                  </p>
                </div>

                <div className="border border-black px-3 py-1.5 text-right shrink-0">
                  <div className="font-mono text-[10px] uppercase font-bold">
                    {t.worksheet.officialStandardBox}
                  </div>
                  <div className="font-mono text-xs font-bold">
                    {pdeStandard.code}
                  </div>
                </div>
              </div>

              {/* Student Name / Date / Section Blank Lines */}
              <div className="mt-4 pt-3 border-t border-neutral-400 grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                <div className="sm:col-span-6 flex items-baseline gap-2">
                  <span className="font-bold shrink-0">
                    {t.worksheet.studentName}
                  </span>
                  <span className="flex-1 border-b border-black h-4" />
                </div>
                <div className="sm:col-span-3 flex items-baseline gap-2">
                  <span className="font-bold shrink-0">
                    {t.worksheet.courseGroup}
                  </span>
                  <span className="flex-1 border-b border-black h-4" />
                </div>
                <div className="sm:col-span-3 flex items-baseline gap-2">
                  <span className="font-bold shrink-0">
                    {t.worksheet.dateLabel}
                  </span>
                  <span className="flex-1 border-b border-black h-4" />
                </div>
              </div>
            </header>

            {/* Applicable PDE Academic Standard Box */}
            <section className="border border-black p-3 bg-neutral-50 print:bg-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <School className="w-3.5 h-3.5" />
                <span>{t.worksheet.curriculumAlignment}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-900 leading-relaxed">
                <strong>
                  {pdeStandard.code} ({pdeStandard.title}):
                </strong>{' '}
                {pdeStandard.description}
              </p>
            </section>

            {/* Section I: Cartographic & Territorial Investigation */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-black pb-1">
                <h2 className="font-serif text-base font-bold uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {t.worksheet.part1Title(county.name, county.founded)}
                  </span>
                </h2>
                <span className="font-mono text-xs font-bold">
                  {t.worksheet.duration15}
                </span>
              </div>

              {/* County Data Summary Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-black text-xs divide-y sm:divide-y-0 sm:divide-x divide-black">
                <div className="p-2">
                  <div className="font-mono text-[10px] uppercase text-neutral-600">
                    {t.worksheet.colCountyFips}
                  </div>
                  <div className="font-bold">
                    {county.name} (FIPS {county.fips})
                  </div>
                </div>
                <div className="p-2">
                  <div className="font-mono text-[10px] uppercase text-neutral-600">
                    {t.worksheet.colFounded}
                  </div>
                  <div className="font-bold">{county.founded}</div>
                </div>
                <div className="p-2">
                  <div className="font-mono text-[10px] uppercase text-neutral-600">
                    {t.worksheet.colSeat}
                  </div>
                  <div className="font-bold">{county.countySeat}</div>
                </div>
                <div className="p-2">
                  <div className="font-mono text-[10px] uppercase text-neutral-600">
                    {t.worksheet.colRegionArea}
                  </div>
                  <div className="font-bold">
                    {locRegion.shortName} (
                    {county.areaSqMi.toLocaleString(locale)} mi²)
                  </div>
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-1 bg-neutral-50 print:bg-white p-2.5 border border-neutral-400">
                <p>
                  <strong>{t.worksheet.etymologyAndHistory}</strong>{' '}
                  {locCounty.etymology} {locCounty.historicalImportance}
                </p>
                <p>
                  <strong>{t.worksheet.economyAndIndigenous}</strong>{' '}
                  {locCounty.economicProfile}{' '}
                  {t.worksheet.precolonialTerritory}{' '}
                  {locCounty.indigenousHeritage}.
                </p>
              </div>

              {/* Cartographic Activity Prompt */}
              <div className="space-y-2 pt-1 text-xs">
                <p className="font-bold">{t.worksheet.activity1Title}</p>
                <p className="text-neutral-800">
                  {t.worksheet.activity1Prompt(
                    locEra.yearLabel,
                    county.name,
                    county.countySeat
                  )}
                </p>
                <div className="space-y-3 pt-2">
                  <div className="border-b border-neutral-500 h-4" />
                  <div className="border-b border-neutral-500 h-4" />
                  <div className="border-b border-neutral-500 h-4" />
                </div>
              </div>
            </section>

            {/* Section II: Primary Source Analysis & 2 Development Questions */}
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-1">
                <h2 className="font-serif text-base font-bold uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {t.worksheet.part2Title(primarySource.shortTitle)}
                  </span>
                </h2>
                <span className="font-mono text-xs font-bold">
                  {t.worksheet.duration20}
                </span>
              </div>

              {/* Primary Source Excerpt Box */}
              <div className="border-2 border-black p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold">
                  <span>
                    {t.worksheet.sourceHeader} {primarySource.authorOrOrigin} (
                    {primarySource.year})
                  </span>
                  <span>
                    {t.worksheet.officialArchiveHeader}{' '}
                    {primarySource.officialRepositories
                      .map((r) => r.domainLabel)
                      .join(' / ')}
                  </span>
                </div>
                <p className="font-serif italic text-sm leading-relaxed text-black">
                  {language === 'en'
                    ? primarySource.originalQuoteEn
                    : primarySource.translatedQuoteEs}
                </p>
                {includeDualLanguageQuote && (
                  <p className="font-serif text-[11px] text-neutral-700 pt-1 border-t border-neutral-300">
                    <strong>
                      {language === 'en' ? 'Español (ES):' : 'Original (EN):'}
                    </strong>{' '}
                    {language === 'en'
                      ? primarySource.translatedQuoteEs
                      : primarySource.originalQuoteEn}
                  </p>
                )}
              </div>

              {/* 2 Socratic Development Questions */}
              <div className="space-y-4 text-xs pt-1">
                <div>
                  <p className="font-bold">{t.worksheet.socraticQuestionA}</p>
                  <p className="text-neutral-900 mt-0.5">{socraticPair[0]}</p>
                  <div className="space-y-3.5 pt-2.5">
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                  </div>
                </div>

                <div>
                  <p className="font-bold">{t.worksheet.socraticQuestionB}</p>
                  <p className="text-neutral-900 mt-0.5">{socraticPair[1]}</p>
                  <div className="space-y-3.5 pt-2.5">
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                    <div className="border-b border-neutral-500 h-4" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section III: Quick 3-Level Evaluation Rubric */}
            <section className="space-y-2 pt-1">
              <div className="flex items-center justify-between border-b border-black pb-1">
                <h2 className="font-serif text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>{t.worksheet.part3Title(pdeStandard.code)}</span>
                </h2>
                <span className="font-mono text-xs font-bold">
                  {t.worksheet.scoreLabel}
                </span>
              </div>

              <table className="w-full border-collapse border border-black text-[11px]">
                <thead>
                  <tr className="bg-neutral-100 print:bg-white border-b border-black text-left">
                    <th className="border border-black p-2 w-1/3">
                      {t.worksheet.rubricLevel3}
                    </th>
                    <th className="border border-black p-2 w-1/3">
                      {t.worksheet.rubricLevel2}
                    </th>
                    <th className="border border-black p-2 w-1/3">
                      {t.worksheet.rubricLevel1}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow1Col3(
                        county.name,
                        county.countySeat,
                        county.founded
                      )}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow1Col2(county.name)}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow1Col1(locEra.yearLabel)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow2Col3(primarySource.shortTitle)}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow2Col2}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {t.worksheet.rubricRow2Col1}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>

        {/* Bottom Bar (Hidden when printing) */}
        <div className="px-6 py-3 border-t border-[#C5A059]/25 bg-[#0D0F12] flex items-center justify-between gap-3 no-print shrink-0">
          <label className="flex items-center gap-2 text-xs text-[#A39E93] cursor-pointer">
            <input
              type="checkbox"
              checked={includeDualLanguageQuote}
              onChange={(e) => setIncludeDualLanguageQuote(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            <span>{t.worksheet.includeDualLangQuoteLabel}</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#161920] border border-[#C5A059]/30 text-xs text-[#A39E93] hover:text-[#F4F1EA] cursor-pointer"
            >
              {t.worksheet.closePreviewBtn}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#0D0F12] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.worksheet.printNowBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetGeneratorModal;
