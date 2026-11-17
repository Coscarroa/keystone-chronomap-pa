import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { jsPDF } from 'jspdf';
import {
  X,
  BookOpen,
  Download,
  MapPin,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Box,
  Palette,
  Printer,
} from 'lucide-react';
import {
  ComicChapterData,
  ENCYCLOPEDIA_COMICS_CHAPTERS,
} from '../data/encyclopediaComicsData';
import CartoonComicCanvas, {
  COMIC_CANVAS_WIDTH,
  COMIC_CANVAS_HEIGHT,
  renderComicCoverToDataUrl,
  renderComicPanelToDataUrl,
} from './CartoonComicCanvas';
import AudioNarratorWidget from './AudioNarratorWidget';
import {
  CountyRecord,
  HISTORICAL_ERAS,
  HistoricalEra,
  PA_COUNTIES_DATA,
  RegionId,
} from '../data/paCountiesData';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedRegion } from '../i18n/translations';

const LazyHistorical3DStage = React.lazy(() => import('./Historical3DStage'));

export interface DigitalEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegion: (region: RegionId | 'all') => void;
  onSelectEra: (era: HistoricalEra) => void;
  onSelectCounty: (county: CountyRecord) => void;
  selectedCountyName?: string | null;
  initialViewMode?: '2d_comics' | '3d_stage';
}

interface PrintedPanelSnapshot {
  panelId: string;
  panelNumber: number;
  dataUrl: string;
  narratorCaption: string;
  factTitle: string;
  factBody: string;
}

interface PrintedChapterSnapshot {
  chapterNumber: number;
  yearsRange: string;
  title: string;
  subtitle: string;
  summary: string;
  panels: PrintedPanelSnapshot[];
  sources: {
    institution: string;
    title: string;
    domainLabel: string;
    url: string;
  }[];
}

/**
 * Ensures an offscreen or DOM image is 100% loaded and decoded before PDF/Print capture.
 */
function ensureImageLoaded(
  srcOrImg: string | HTMLImageElement
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof srcOrImg === 'string') {
      if (!srcOrImg) {
        reject(new Error('Empty image dataUrl'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img
            .decode()
            .then(() => resolve(img))
            .catch(() => resolve(img));
        } else {
          resolve(img);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = srcOrImg;
      return;
    }

    // Existing DOM HTMLImageElement inside .print-only-comic
    const domImg = srcOrImg;
    const finishDecode = () => {
      if (typeof domImg.decode === 'function') {
        domImg
          .decode()
          .then(() => resolve(domImg))
          .catch(() => resolve(domImg));
      } else {
        resolve(domImg);
      }
    };

    if (domImg.complete && domImg.naturalWidth > 0) {
      finishDecode();
    } else {
      domImg.addEventListener('load', finishDecode, { once: true });
      domImg.addEventListener('error', () => resolve(domImg), { once: true });
    }
  });
}

/**
 * Waits for React to commit the .print-only-comic DOM nodes and verifies via Promise.all
 * that every rendered <img> element in the Print DOM is 100% loaded and decoded.
 */
async function waitForPrintDomImagesReady(): Promise<void> {
  // Wait two animation frames for React state commit and layout paint
  await new Promise<void>((resolve) =>
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => resolve())
    )
  );

  const printContainer = document.querySelector('.print-only-comic');
  if (!printContainer) return;

  const domImages = Array.from(
    printContainer.querySelectorAll<HTMLImageElement>('img')
  );
  if (domImages.length > 0) {
    await Promise.all(domImages.map((imgEl) => ensureImageLoaded(imgEl)));
  }
}

export const DigitalEncyclopediaModal: React.FC<
  DigitalEncyclopediaModalProps
> = ({
  isOpen,
  onClose,
  onSelectRegion,
  onSelectEra,
  onSelectCounty,
  selectedCountyName,
  initialViewMode = '2d_comics',
}) => {
  const { language, t } = useTranslation();

  const [viewMode, setViewMode] = useState<'2d_comics' | '3d_stage'>(
    initialViewMode
  );
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [printCoverUrl, setPrintCoverUrl] = useState<string>('');
  const [printChapters, setPrintChapters] = useState<PrintedChapterSnapshot[]>(
    []
  );
  const [captured3dSnapshot, setCaptured3dSnapshot] = useState<{
    dataUrl: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialViewMode);
    }
  }, [isOpen, initialViewMode]);

  const activeChapter: ComicChapterData =
    ENCYCLOPEDIA_COMICS_CHAPTERS[activeChapterIdx] ||
    ENCYCLOPEDIA_COMICS_CHAPTERS[0];

  // Build bilingual narration script for the active chapter's 4 comic panels
  const chapterNarrationScript = useMemo(() => {
    const enParts: string[] = [
      `Chapter ${activeChapter.chapterNumber} (${activeChapter.yearsRange}): ${activeChapter.titleEn}. ${activeChapter.summaryEn}`,
    ];
    const esParts: string[] = [
      `Capítulo ${activeChapter.chapterNumber} (${activeChapter.yearsRange}): ${activeChapter.titleEs}. ${activeChapter.summaryEs}`,
    ];

    activeChapter.panels.forEach((p) => {
      enParts.push(
        `Panel ${p.panelNumber}. ${p.narratorCaptionEn}. ${p.leftCharacter.nameEn} says: ${p.leftSpeechEn} ${p.rightCharacter.nameEn} replies: ${p.rightSpeechEn} Encyclopedic note: ${p.expandedFactBodyEn}`
      );
      esParts.push(
        `Viñeta ${p.panelNumber}. ${p.narratorCaptionEs}. ${p.leftCharacter.nameEs} dice: ${p.leftSpeechEs} ${p.rightCharacter.nameEs} responde: ${p.rightSpeechEs} Dato enciclopédico: ${p.expandedFactBodyEs}`
      );
    });

    return {
      en: enParts.join(' '),
      es: esParts.join(' '),
    };
  }, [activeChapter]);

  if (!isOpen) return null;

  const chapterTitle =
    language === 'en' ? activeChapter.titleEn : activeChapter.titleEs;
  const chapterSubtitle =
    language === 'en' ? activeChapter.subtitleEn : activeChapter.subtitleEs;
  const chapterSummary =
    language === 'en' ? activeChapter.summaryEn : activeChapter.summaryEs;
  const locRegion = getLocalizedRegion(activeChapter.regionId, language);

  const handleViewChapterOnMap = () => {
    const targetEra = HISTORICAL_ERAS.find(
      (e) => e.id === activeChapter.eraId
    );
    if (targetEra) {
      onSelectEra(targetEra);
    }
    onSelectRegion(activeChapter.regionId);
    const countyRec = PA_COUNTIES_DATA[activeChapter.featuredCounty];
    if (countyRec) {
      onSelectCounty(countyRec);
    }
    onClose();
  };

  /**
   * Renders all offscreen HTML5 canvases and decodes every resulting image concurrently via Promise.all
   */
  const prepareVerifiedSnapshots = async (
    mode: 'single' | 'full_book'
  ): Promise<{
    coverImg: string;
    snapshots: PrintedChapterSnapshot[];
  }> => {
    // 1. Ensure web fonts are loaded before measuring text on HTML5 Canvas
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      } catch {
        // Fallback if FontFaceSet is unavailable
      }
    }

    const targetChapters =
      mode === 'single' ? [activeChapter] : ENCYCLOPEDIA_COMICS_CHAPTERS;

    // 2. Wrap cover canvas rendering + all chapter panel canvas renderings in Promise.all
    const [coverImg, snapshots] = await Promise.all([
      Promise.resolve().then(() => renderComicCoverToDataUrl(language)),
      Promise.all(
        targetChapters.map(async (chap) => {
          const panelSnapshots: PrintedPanelSnapshot[] = await Promise.all(
            chap.panels.map(async (p) => {
              const dataUrl = renderComicPanelToDataUrl(p, language);
              await ensureImageLoaded(dataUrl);
              return {
                panelId: p.id,
                panelNumber: p.panelNumber,
                dataUrl,
                narratorCaption:
                  language === 'en'
                    ? p.narratorCaptionEn
                    : p.narratorCaptionEs,
                factTitle:
                  language === 'en'
                    ? p.expandedFactTitleEn
                    : p.expandedFactTitleEs,
                factBody:
                  language === 'en'
                    ? p.expandedFactBodyEn
                    : p.expandedFactBodyEs,
              };
            })
          );

          return {
            chapterNumber: chap.chapterNumber,
            yearsRange: chap.yearsRange,
            title: language === 'en' ? chap.titleEn : chap.titleEs,
            subtitle: language === 'en' ? chap.subtitleEn : chap.subtitleEs,
            summary: language === 'en' ? chap.summaryEn : chap.summaryEs,
            panels: panelSnapshots,
            sources: chap.directSources.map((s) => ({
              institution: s.institution,
              title: language === 'en' ? s.titleEn : s.titleEs,
              domainLabel: s.domainLabel,
              url: s.url,
            })),
          };
        })
      ),
    ]);

    // 3. Verify cover image and optional 3D snapshot are also 100% decoded via Promise.all
    const extraUrls: string[] = [coverImg];
    if (captured3dSnapshot?.dataUrl) {
      extraUrls.push(captured3dSnapshot.dataUrl);
    }
    await Promise.all(extraUrls.map((url) => ensureImageLoaded(url)));

    return { coverImg, snapshots };
  };

  // Pre-hydrate the native print DOM (.print-only-comic) whenever the modal opens or language changes
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const { coverImg, snapshots } =
          await prepareVerifiedSnapshots('full_book');
        if (!cancelled) {
          setPrintCoverUrl(coverImg);
          setPrintChapters(snapshots);
        }
      } catch {
        // Ignore background pre-render errors
      }
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, language]);

  /**
   * Builds and downloads a multi-page Letter PDF using jsPDF or triggers native browser print
   * only after Promise.all confirms all canvas renders and DOM <img> elements are 100% loaded.
   */
  const exportComicBookPDF = async (
    mode: 'single' | 'full_book',
    triggerBrowserPrint = false
  ) => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const { coverImg, snapshots } = await prepareVerifiedSnapshots(mode);

      // Commit rendered cover and chapter snapshots into the Print View DOM
      setPrintCoverUrl(coverImg);
      setPrintChapters(snapshots);

      // Wait for all <img> elements inside .print-only-comic DOM to finish loading & decoding via Promise.all
      await waitForPrintDomImagesReady();

      if (triggerBrowserPrint) {
        window.print();
        setIsGeneratingPdf(false);
        return;
      }

      // Create native multi-page Letter PDF (215.9mm x 279.4mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
        compress: true,
      });

      const pageW = doc.internal.pageSize.getWidth(); // 215.9 mm
      const pageH = doc.internal.pageSize.getHeight(); // 279.4 mm
      const margin = 9;
      const contentW = pageW - margin * 2; // 197.9 mm
      const bottomLimit = pageH - 10; // 269.4 mm safe bottom margin before footer
      const canvasAspect = COMIC_CANVAS_WIDTH / COMIC_CANVAS_HEIGHT; // 1200 / 680

      // =======================================================================
      // PAGE 1: ILLUSTRATED FULL-COLOR COVER PAGE & TABLE OF CONTENTS
      // =======================================================================
      doc.setFillColor(255, 253, 245);
      doc.rect(0, 0, pageW, pageH, 'F');

      // Outer decorative border
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(0.9);
      doc.rect(margin - 2, margin - 2, contentW + 4, pageH - margin * 2 + 4);

      let cursorY = margin + 4;

      // Kicker
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(178, 34, 52);
      doc.text(
        'KEYSTONE CHRONOMAP · COMMONWEALTH OF PENNSYLVANIA (1681–PRESENT)',
        pageW / 2,
        cursorY,
        { align: 'center' }
      );
      cursorY += 6;

      // Main Title
      doc.setFont('times', 'bold');
      doc.setFontSize(14.5);
      doc.setTextColor(17, 24, 39);
      const mainTitle =
        language === 'en'
          ? 'THE ADVENTURES OF KEYSTONE CHRONOMAP: PENNSYLVANIA HISTORY IN CARTOONS'
          : 'LAS AVENTURAS DE KEYSTONE CHRONOMAP: HISTORIA DE PENSILVANIA EN CARICATURAS';
      const titleLines = doc.splitTextToSize(mainTitle, contentW - 8);
      doc.text(titleLines, pageW / 2, cursorY, { align: 'center' });
      cursorY += titleLines.length * 5.6 + 1;

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const subLines = doc.splitTextToSize(
        t.comicEncyclopedia.printCoverSubtitle,
        contentW - 12
      );
      doc.text(subLines, pageW / 2, cursorY, { align: 'center' });
      cursorY += subLines.length * 3.8 + 3;

      // Divider line
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageW - margin, cursorY);
      cursorY += 4;

      // High-Res 2D Collector's Cover Illustration (1200x680 aspect ratio)
      const coverW = contentW;
      const coverH = Math.min(coverW / canvasAspect, 108);
      doc.addImage(coverImg, 'PNG', margin, cursorY, coverW, coverH);
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(0.8);
      doc.rect(margin, cursorY, coverW, coverH);
      cursorY += coverH + 5.5;

      // Table of Contents Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(29, 78, 216);
      doc.text(
        language === 'en'
          ? 'HISTORICAL CHAPTERS INDEX (1681 – PRESENT)'
          : 'ÍNDICE DE CAPÍTULOS HISTÓRICOS (1681 – PRESENTE)',
        margin,
        cursorY
      );
      cursorY += 3.5;

      // 2-Column Grid of the 6 Chapters with dynamic untruncated row heights
      const colGap = 4;
      const tocColW = (contentW - colGap) / 2;

      for (let i = 0; i < ENCYCLOPEDIA_COMICS_CHAPTERS.length; i += 2) {
        const leftChap = ENCYCLOPEDIA_COMICS_CHAPTERS[i];
        const rightChap = ENCYCLOPEDIA_COMICS_CHAPTERS[i + 1];
        const rowChaps = [leftChap, rightChap].filter(Boolean);

        const rowMetrics = rowChaps.map((c) => {
          doc.setFont('times', 'bold');
          doc.setFontSize(8.8);
          const chTitle = language === 'en' ? c.titleEn : c.titleEs;
          const chTitleLines = doc.splitTextToSize(chTitle, tocColW - 6);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.4);
          const chSub = language === 'en' ? c.subtitleEn : c.subtitleEs;
          const chSubLines = doc.splitTextToSize(chSub, tocColW - 6);

          const neededH =
            6.5 + chTitleLines.length * 3.6 + chSubLines.length * 3.1 + 3;
          return { c, chTitleLines, chSubLines, neededH };
        });

        const tocRowH = Math.max(17, ...rowMetrics.map((m) => m.neededH));

        rowMetrics.forEach((m, cIdx) => {
          const boxX = margin + cIdx * (tocColW + colGap);
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(148, 163, 184);
          doc.setLineWidth(0.35);
          doc.roundedRect(boxX, cursorY, tocColW, tocRowH, 1.5, 1.5, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.8);
          doc.setTextColor(178, 34, 52);
          doc.text(
            `${t.comicEncyclopedia.chapterPrefix.toUpperCase()} 0${m.c.chapterNumber} (${m.c.yearsRange})`,
            boxX + 3,
            cursorY + 4.8
          );

          doc.setFont('times', 'bold');
          doc.setFontSize(8.8);
          doc.setTextColor(17, 24, 39);
          doc.text(m.chTitleLines, boxX + 3, cursorY + 9.2);

          const subY = cursorY + 9.2 + m.chTitleLines.length * 3.6;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.4);
          doc.setTextColor(71, 85, 105);
          doc.text(m.chSubLines, boxX + 3, subY);
        });

        cursorY += tocRowH + 2.8;
      }

      // =======================================================================
      // OPTIONAL PAGE: 3D HISTORICAL FIGURES MUSEUM DIORAMA SNAPSHOT
      // =======================================================================
      if (captured3dSnapshot?.dataUrl) {
        doc.addPage();
        doc.setFillColor(255, 253, 245);
        doc.rect(0, 0, pageW, pageH, 'F');

        let y3d = margin + 4;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(178, 34, 52);
        doc.text(
          t.comicEncyclopedia.print3dSectionTitle.toUpperCase(),
          margin,
          y3d
        );
        y3d += 6;

        doc.setFont('times', 'bold');
        doc.setFontSize(13.5);
        doc.setTextColor(17, 24, 39);
        const capLines = doc.splitTextToSize(
          captured3dSnapshot.caption,
          contentW
        );
        doc.text(capLines, margin, y3d);
        y3d += capLines.length * 5.5 + 3;

        const snapH = Math.min(contentW * 0.62, bottomLimit - y3d - 6);
        doc.addImage(
          captured3dSnapshot.dataUrl,
          'PNG',
          margin,
          y3d,
          contentW,
          snapH
        );
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.8);
        doc.rect(margin, y3d, contentW, snapH);
      }

      // =======================================================================
      // CHAPTER PAGES: 1 CHAPTER PER PAGE (2x2 GRID + FACTS + OFFICIAL SOURCES)
      // =======================================================================
      const drawChapterHeader = (
        chap: PrintedChapterSnapshot,
        isContinuation: boolean
      ): number => {
        let y = margin;

        doc.setFont('times', 'bold');
        doc.setFontSize(isContinuation ? 9.8 : 10.6);
        const headerTitleLines = doc.splitTextToSize(chap.title, contentW - 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.4);
        const subLinesFit = !isContinuation
          ? doc.splitTextToSize(chap.subtitle, contentW - 8)
          : [];

        const bannerH =
          6.0 +
          headerTitleLines.length * 3.9 +
          (subLinesFit.length > 0 ? subLinesFit.length * 3.2 + 1.6 : 1.2);

        // Top chapter banner bar with dynamic height
        doc.setFillColor(15, 28, 48);
        doc.rect(margin, y, contentW, bannerH, 'F');
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.rect(margin, y, contentW, bannerH, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        doc.setTextColor(212, 175, 55);
        const contSuffix = isContinuation
          ? language === 'en'
            ? ' — CONTINUED'
            : ' — CONTINUACIÓN'
          : '';
        doc.text(
          `${t.comicEncyclopedia.chapterPrefix.toUpperCase()} 0${chap.chapterNumber} (${chap.yearsRange})${contSuffix}`,
          margin + 3.5,
          y + 4.1
        );

        let innerY = y + 8.2;
        doc.setFont('times', 'bold');
        doc.setFontSize(isContinuation ? 9.8 : 10.6);
        doc.setTextColor(248, 250, 252);
        doc.text(headerTitleLines, margin + 3.5, innerY);
        innerY += headerTitleLines.length * 3.9;

        if (subLinesFit.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.4);
          doc.setTextColor(203, 213, 225);
          doc.text(subLinesFit, margin + 3.5, innerY);
        }

        y += bannerH + 2.5;

        if (!isContinuation && chap.summary) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.6);
          doc.setTextColor(30, 41, 59);
          const sumLines = doc.splitTextToSize(chap.summary, contentW - 2);
          doc.text(sumLines, margin + 1, y);
          y += sumLines.length * 3.1 + 1.8;
        }

        return y;
      };

      for (const chap of snapshots) {
        doc.addPage();
        let chapY = drawChapterHeader(chap, false);

        // Process panels in pairs (Row 1: Panel #01 & #02; Row 2: Panel #03 & #04)
        const pairGap = 3.8;
        const cardW = (contentW - pairGap) / 2; // 97.05 mm
        const imgH = 48.5; // Calibrated height so 2x2 grid + expanded facts + official sources fit on 1 Letter page

        for (let pIdx = 0; pIdx < chap.panels.length; pIdx += 2) {
          const leftPanel = chap.panels[pIdx];
          const rightPanel = chap.panels[pIdx + 1];
          const rowPanels = [leftPanel, rightPanel].filter(Boolean);

          // Pre-calculate exact text height of both panels in this row so a card NEVER splits across pages
          const metrics = rowPanels.map((p) => {
            doc.setFont('times', 'bold');
            doc.setFontSize(8.4);
            const titleLines = doc.splitTextToSize(
              `0${p.panelNumber}. ${p.factTitle}`,
              cardW - 5
            );

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.2);
            const bodyLines = doc.splitTextToSize(p.factBody, cardW - 5);

            const textBoxH =
              titleLines.length * 3.25 + bodyLines.length * 2.9 + 4.2;
            return {
              panel: p,
              titleLines,
              bodyLines,
              textBoxH,
            };
          });

          const maxTextBoxH = Math.max(...metrics.map((m) => m.textBoxH));
          const totalCardH = imgH + maxTextBoxH;

          // Dynamic Page-Break Check (`break-inside: avoid` guarantee)
          if (chapY + totalCardH > bottomLimit) {
            doc.addPage();
            chapY = drawChapterHeader(chap, true);
          }

          // Render both cards in this row
          metrics.forEach((m, colIdx) => {
            const cardX = margin + colIdx * (cardW + pairGap);

            // Card background
            doc.setFillColor(255, 253, 245);
            doc.setDrawColor(17, 24, 39);
            doc.setLineWidth(0.45);
            doc.rect(cardX, chapY, cardW, totalCardH, 'FD');

            // High-resolution 2D Cinematic Comic Panel PNG (1200x680)
            doc.addImage(
              m.panel.dataUrl,
              'PNG',
              cardX,
              chapY,
              cardW,
              imgH
            );

            // Divider line between cartoon canvas and encyclopedic fact box
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.line(
              cardX,
              chapY + imgH,
              cardX + cardW,
              chapY + imgH
            );

            // Encyclopedic Fact Title
            let textY = chapY + imgH + 3.2;
            doc.setFont('times', 'bold');
            doc.setFontSize(8.4);
            doc.setTextColor(15, 23, 42);
            doc.text(m.titleLines, cardX + 2.5, textY);
            textY += m.titleLines.length * 3.25 + 0.5;

            // Encyclopedic Fact Body (100% untruncated)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.2);
            doc.setTextColor(51, 65, 85);
            doc.text(m.bodyLines, cardX + 2.5, textY);
          });

          chapY += totalCardH + 2.8;
        }

        // Verified Official Sources Footer Box at the bottom of the Chapter Page
        const sourcesText = chap.sources
          .map(
            (s) =>
              `• ${s.institution} (${s.domainLabel}): ${s.title} — ${s.url}`
          )
          .join('\n');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.9);
        const sourceLines = doc.splitTextToSize(sourcesText, contentW - 7);
        const sourcesBoxH = sourceLines.length * 2.85 + 6.5;

        if (chapY + sourcesBoxH > bottomLimit) {
          doc.addPage();
          chapY = drawChapterHeader(chap, true);
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.45);
        doc.roundedRect(margin, chapY, contentW, sourcesBoxH, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(178, 34, 52);
        doc.text(
          language === 'en'
            ? 'OFFICIAL ARCHIVAL SOURCES:'
            : 'FUENTES DIRECTAS OFICIALES VERIFICADAS:',
          margin + 3.5,
          chapY + 3.9
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.9);
        doc.setTextColor(30, 41, 59);
        doc.text(sourceLines, margin + 3.5, chapY + 7.0);
      }

      // =======================================================================
      // ADD PAGE NUMBERS & ARCHIVAL FOOTER TO ALL PAGES
      // =======================================================================
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          t.comicEncyclopedia.printFooterNote,
          margin,
          pageH - 5
        );
        doc.setFont('helvetica', 'bold');
        doc.text(
          language === 'en'
            ? `Page ${p} of ${totalPages}`
            : `Página ${p} de ${totalPages}`,
          pageW - margin,
          pageH - 5,
          { align: 'right' }
        );
      }

      const fileName =
        mode === 'single'
          ? `Keystone_ChronoMap_Chapter_0${activeChapter.chapterNumber}_${language.toUpperCase()}.pdf`
          : `Keystone_ChronoMap_Complete_Comic_Encyclopedia_${language.toUpperCase()}.pdf`;

      doc.save(fileName);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Interactive On-Screen Comic & 3D Encyclopedia Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-[#09111E]/88 backdrop-blur-md no-print"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comic-encyclopedia-title"
      >
        <div className="relative w-full max-w-6xl max-h-[93vh] flex flex-col bg-[#0F1C30]/96 backdrop-blur-2xl border-2 border-[#D4AF37]/75 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] text-[#F8FAFC] overflow-hidden">
          {/* Top Masthead Header */}
          <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#09111E] via-[#0F1C30] to-[#1E3A8A]/45 border-b border-slate-700/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B22234] border border-[#D4AF37]/80 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F8FAFC] font-bold">
                  {t.comicEncyclopedia.modalKicker}
                </span>
              </div>
              <h2
                id="comic-encyclopedia-title"
                className="font-serif text-lg sm:text-2xl font-bold text-[#F8FAFC] leading-tight"
              >
                {t.comicEncyclopedia.modalTitle}
              </h2>
              <p className="text-xs text-[#94A3B8] max-w-3xl">
                {t.comicEncyclopedia.modalSubtitle}
              </p>
            </div>

            {/* Top Action Toolbar: Direct Multi-Page PDF Exporters + Print + Close Button */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => exportComicBookPDF('single', false)}
                className="px-3 py-2 rounded-xl bg-[#09111E] hover:bg-[#1E3A8A] border border-[#D4AF37]/70 text-xs font-semibold text-[#F8FAFC] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {isGeneratingPdf
                    ? t.comicEncyclopedia.preparingPdfBadge
                    : t.comicEncyclopedia.downloadChapterPdfBtn}
                </span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => exportComicBookPDF('full_book', false)}
                className="px-3.5 py-2 rounded-xl bg-[#B22234] hover:bg-[#991B1B] border border-[#D4AF37] text-xs font-bold text-[#F8FAFC] shadow-[0_0_20px_rgba(178,34,52,0.5)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {isGeneratingPdf
                    ? t.comicEncyclopedia.preparingPdfBadge
                    : t.comicEncyclopedia.downloadFullBookPdfBtn}
                </span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => exportComicBookPDF('full_book', true)}
                title={
                  language === 'en'
                    ? 'Print Complete Comic Book'
                    : 'Imprimir Libro Completo'
                }
                className="p-2 rounded-xl bg-[#09111E] hover:bg-[#1E3A8A] border border-slate-700 hover:border-[#D4AF37] text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-60"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.comicEncyclopedia.closeBtn}
                className="p-2 rounded-xl bg-[#09111E] hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Mode Switcher: 🎨 2D Comic Strips vs. 🏛️ 3D Historical Figures Stage (WebGL) */}
          <div className="px-4 sm:px-6 py-2 bg-[#09111E] border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('2d_comics')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  viewMode === '2d_comics'
                    ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC] shadow-[0_0_15px_rgba(29,78,216,0.45)]'
                    : 'bg-[#0F1C30] hover:bg-[#1E3A8A]/50 border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.comicEncyclopedia.mode2dComicsBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('3d_stage')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  viewMode === '3d_stage'
                    ? 'bg-[#B22234] border-[#D4AF37] text-[#F8FAFC] shadow-[0_0_18px_rgba(178,34,52,0.5)]'
                    : 'bg-[#0F1C30] hover:bg-[#1E3A8A]/50 border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.comicEncyclopedia.mode3dStageBtn}</span>
              </button>
            </div>

            {captured3dSnapshot && (
              <span className="text-[11px] font-mono text-emerald-400">
                {t.comicEncyclopedia.snapshotCapturedBadge}
              </span>
            )}
          </div>

          {viewMode === '3d_stage' ? (
            /* =================================================================
               PHASE 14: INTERACTIVE 3D HISTORICAL FIGURES STAGE (WebGL)
               ================================================================= */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <Suspense
                fallback={
                  <div className="h-[420px] rounded-2xl bg-[#09111E] border border-[#D4AF37]/40 flex items-center justify-center text-sm font-mono text-[#D4AF37]">
                    Loading 3D Historical Museum Stage (WebGL)...
                  </div>
                }
              >
                <LazyHistorical3DStage
                  selectedCountyName={
                    selectedCountyName || activeChapter.featuredCounty
                  }
                  onSelectCounty={onSelectCounty}
                  onCaptureSnapshotForPdf={(dataUrl, caption) =>
                    setCaptured3dSnapshot({ dataUrl, caption })
                  }
                />
              </Suspense>
            </div>
          ) : (
            /* =================================================================
               PHASE 13: 2D ILLUSTRATED CARTOON COMIC STRIPS (6 CHAPTERS)
               ================================================================= */
            <>
              {/* Chapter Navigation Tabs (Chapters 01 – 06) */}
              <div className="px-4 sm:px-6 py-2.5 bg-[#09111E]/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                {ENCYCLOPEDIA_COMICS_CHAPTERS.map((chap, idx) => {
                  const isSelected = idx === activeChapterIdx;
                  const shortTitle =
                    language === 'en' ? chap.titleEn : chap.titleEs;
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-left transition-all cursor-pointer border shrink-0 flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC] shadow-[0_0_15px_rgba(29,78,216,0.45)]'
                          : 'bg-[#0F1C30]/80 hover:bg-[#1E3A8A]/45 border-slate-700/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#09111E]'
                            : 'bg-[#09111E] text-[#D4AF37]'
                        }`}
                      >
                        0{chap.chapterNumber}
                      </span>
                      <div>
                        <div className="text-[10px] font-mono text-[#D4AF37] leading-none">
                          {chap.yearsRange}
                        </div>
                        <div className="text-xs font-bold truncate max-w-[165px]">
                          {shortTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Comic Strip Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Active Chapter Banner + Bilingual Audio-Guide + Map Focus Button */}
                <div className="bg-[#09111E]/85 border border-slate-700/75 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-semibold flex-wrap">
                      <span>
                        {t.comicEncyclopedia.chapterPrefix} 0
                        {activeChapter.chapterNumber} (
                        {activeChapter.yearsRange})
                      </span>
                      <span>·</span>
                      <span className="text-[#94A3B8]">
                        {locRegion.shortName}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F8FAFC]">
                      {chapterTitle}
                    </h3>
                    <p className="text-xs text-[#D4AF37] font-medium">
                      {chapterSubtitle}
                    </p>
                    <p className="text-xs text-[#94A3B8] leading-relaxed pt-0.5">
                      {chapterSummary}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                    <AudioNarratorWidget
                      script={chapterNarrationScript}
                      contextKey={`comic-${activeChapter.id}`}
                      label={t.comicEncyclopedia.listenComicLabel}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setViewMode('3d_stage')}
                        className="px-3 py-2 rounded-xl bg-[#B22234] hover:bg-[#991B1B] border border-[#D4AF37] text-xs font-semibold text-[#F8FAFC] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{t.comicEncyclopedia.mode3dStageBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleViewChapterOnMap}
                        className="px-3.5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E3A8A] border border-[#D4AF37] text-xs font-semibold text-[#F8FAFC] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{t.comicEncyclopedia.viewCountiesOnMapBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2x2 Comic Strip Grid (4 HTML5 Canvas Panels + Expanded Encyclopedic Facts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeChapter.panels.map((panel) => {
                    const factTitle =
                      language === 'en'
                        ? panel.expandedFactTitleEn
                        : panel.expandedFactTitleEs;
                    const factBody =
                      language === 'en'
                        ? panel.expandedFactBodyEn
                        : panel.expandedFactBodyEs;

                    return (
                      <article
                        key={panel.id}
                        className="bg-[#FFFDF5] text-[#111827] rounded-2xl border-2 border-[#D4AF37] shadow-[0_12px_32px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col"
                      >
                        {/* Procedural HTML5 2D Cartoon Canvas */}
                        <CartoonComicCanvas panel={panel} language={language} />

                        {/* Expanded Encyclopedic Fact Card beneath the Comic Panel */}
                        <div className="p-3.5 sm:p-4 bg-[#09111E] text-[#F8FAFC] border-t-2 border-[#D4AF37] flex-1 flex flex-col justify-between gap-2">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E3A8A]/80 border border-[#D4AF37]/60 font-mono text-[10px] font-bold text-[#D4AF37]">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>
                                  {t.comicEncyclopedia.expandedFactBadge} · #0
                                  {panel.panelNumber}
                                </span>
                              </span>
                            </div>
                            <h4 className="font-serif text-sm sm:text-base font-bold text-[#F8FAFC]">
                              {factTitle}
                            </h4>
                            <p className="text-xs text-[#94A3B8] leading-relaxed">
                              {factBody}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Verified Direct Official Sources Section */}
                <div className="bg-[#09111E]/90 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-[0.16em] text-[#D4AF37] font-semibold">
                    {t.comicEncyclopedia.directSourcesHeader}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeChapter.directSources.map((src) => {
                      const srcTitle =
                        language === 'en' ? src.titleEn : src.titleEs;
                      return (
                        <a
                          key={src.id}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A]/65 border border-slate-700 hover:border-[#D4AF37] transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                              {src.institution} ({src.domainLabel})
                            </div>
                            <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#D4AF37]">
                              {srcTitle}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Chapter Pager Bar */}
              <div className="px-4 sm:px-6 py-3 bg-[#09111E] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  disabled={activeChapterIdx === 0}
                  onClick={() =>
                    setActiveChapterIdx((prev) => Math.max(0, prev - 1))
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A] disabled:opacity-40 border border-slate-700 text-xs font-semibold text-[#F8FAFC] flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.comicEncyclopedia.prevChapterBtn}</span>
                </button>

                <span className="font-mono text-xs text-[#D4AF37]">
                  0{activeChapter.chapterNumber} / 0
                  {ENCYCLOPEDIA_COMICS_CHAPTERS.length}
                </span>

                <button
                  type="button"
                  disabled={
                    activeChapterIdx === ENCYCLOPEDIA_COMICS_CHAPTERS.length - 1
                  }
                  onClick={() =>
                    setActiveChapterIdx((prev) =>
                      Math.min(
                        ENCYCLOPEDIA_COMICS_CHAPTERS.length - 1,
                        prev + 1
                      )
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#0F1C30] hover:bg-[#1E3A8A] disabled:opacity-40 border border-slate-700 text-xs font-semibold text-[#F8FAFC] flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>{t.comicEncyclopedia.nextChapterBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================================
          PRINT-ONLY COMIC BOOK EDITION (Fallback for Native Browser Print)
          ===================================================================== */}
      {printChapters.length > 0 && (
        <div className="hidden print-only-comic">
          {/* Page 1: Illustrated Full-Color Comic Book Cover */}
          <div className="comic-print-page p-4 border-4 border-black bg-[#FFFDF5] text-black">
            <div className="text-center border-b-2 border-black pb-3 mb-4">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#B22234]">
                KEYSTONE CHRONOMAP · COMMONWEALTH OF PENNSYLVANIA (1681–PRESENT)
              </div>
              <h1 className="font-serif text-2xl font-black uppercase mt-1">
                THE ADVENTURES OF KEYSTONE CHRONOMAP: PENNSYLVANIA HISTORY IN
                CARTOONS
              </h1>
              <p className="text-xs font-medium text-slate-700 mt-1">
                {t.comicEncyclopedia.printCoverSubtitle}
              </p>
            </div>

            {printCoverUrl && (
              <div className="my-3 border-4 border-black rounded-lg overflow-hidden comic-print-avoid-break">
                <img
                  src={printCoverUrl}
                  alt="Keystone ChronoMap Comic Book Cover"
                  className="w-full max-h-[340px] object-contain block mx-auto"
                />
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs border-t-2 border-black pt-3 comic-print-avoid-break">
              {ENCYCLOPEDIA_COMICS_CHAPTERS.map((c) => (
                <div
                  key={c.id}
                  className="p-2 border border-black rounded bg-white comic-print-avoid-break"
                >
                  <div className="font-mono font-bold text-[#1D4ED8]">
                    {t.comicEncyclopedia.chapterPrefix} 0{c.chapterNumber} (
                    {c.yearsRange})
                  </div>
                  <div className="font-serif font-bold">
                    {language === 'en' ? c.titleEn : c.titleEs}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center font-mono text-[10px] text-slate-600">
              {t.comicEncyclopedia.printFooterNote}
            </div>
          </div>

          {/* Dedicated Page for 3D Stage Snapshot if captured */}
          {captured3dSnapshot && (
            <div className="comic-print-page p-4 border-2 border-black bg-white text-black">
              <div className="font-mono text-xs font-bold uppercase text-[#B22234] mb-2">
                {t.comicEncyclopedia.print3dSectionTitle}:{' '}
                {captured3dSnapshot.caption}
              </div>
              <img
                src={captured3dSnapshot.dataUrl}
                alt={captured3dSnapshot.caption}
                className="w-full h-auto rounded border-2 border-black block"
              />
            </div>
          )}

          {/* Subsequent Pages: 1 Chapter per Letter Page (2x2 Grid + Expanded Facts + Official Sources Footer) */}
          {printChapters.map((chap) => (
            <div
              key={chap.chapterNumber}
              className="comic-print-page p-2.5 border-2 border-black bg-white text-black"
            >
              <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-1.5 comic-print-avoid-break">
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#B22234] mr-2">
                    {t.comicEncyclopedia.chapterPrefix.toUpperCase()} 0
                    {chap.chapterNumber} ({chap.yearsRange})
                  </span>
                  <span className="font-serif text-base font-bold">
                    {chap.title}
                  </span>
                </div>
                <span className="font-mono text-[9.5px] text-slate-600">
                  Keystone ChronoMap
                </span>
              </div>

              <p className="text-[10.5px] text-slate-700 mb-2 leading-snug comic-print-avoid-break">
                {chap.summary}
              </p>

              {/* 2x2 Grid of 1200x680 Canvas PNG Snapshots + Encyclopedic Notes */}
              <div className="grid grid-cols-2 gap-2.5">
                {chap.panels.map((p) => (
                  <div
                    key={p.panelId}
                    className="comic-panel-print-card border-2 border-black rounded overflow-hidden flex flex-col bg-[#FFFDF5]"
                  >
                    <img
                      src={p.dataUrl}
                      alt={p.factTitle}
                      className="w-full max-h-[175px] object-cover block border-b border-black"
                    />
                    <div className="p-2 text-[9.5px] leading-snug bg-white flex-1">
                      <div className="font-serif font-bold text-black">
                        0{p.panelNumber}. {p.factTitle}
                      </div>
                      <p className="text-slate-800 mt-0.5">{p.factBody}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean Official Archival Citations Footer Box (Zero Compass Rose Overlap) */}
              <div className="mt-2 pt-1.5 border-t border-black text-[9.5px] leading-tight comic-print-avoid-break">
                <span className="font-bold">Official Sources: </span>
                {chap.sources
                  .map(
                    (s) => `${s.institution} (${s.domainLabel}: ${s.title})`
                  )
                  .join(' · ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DigitalEncyclopediaModal;
