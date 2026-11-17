import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HISTORICAL_ERAS,
  HistoricalEra,
  PA_COUNTIES_DATA,
  RegionId,
} from '../data/paCountiesData';
import { getCountyFullDemographics } from '../data/paDemographicsFullData';
import {
  getHistorical3DStageForCounty,
  PA_HISTORICAL_3D_STAGES,
} from '../data/paHistorical3DCharacters';
import { PA_LEADERS_DATA, PALeaderRecord } from './paLeadersService';
import { PHMC_MARKERS_DATA } from '../data/phmcMarkersData';
import { HISTORICAL_EVENTS_DATA } from '../data/historicalEventsData';
import {
  AppLanguage,
  getLocalizedCountyDossier,
  getLocalizedEra,
  getLocalizedEvent,
  getLocalizedRegion,
} from '../i18n/translations';

export type AIUIAction =
  | {
      type: 'FLY_TO_COUNTY';
      county: CountyRecord;
      lat?: number;
      lng?: number;
      zoom?: number;
    }
  | { type: 'SELECT_ERA'; era: HistoricalEra }
  | { type: 'OPEN_COMPARE_MODE' }
  | { type: 'OPEN_3D_STAGE'; countyName?: string }
  | { type: 'OPEN_COMIC_ENCYCLOPEDIA' }
  | { type: 'TOGGLE_TEACHER_MODE'; enable: boolean }
  | { type: 'OPEN_TRIVIA' }
  | { type: 'OPEN_WORKSHEET' }
  | { type: 'OPEN_VINTAGE_MAPS' }
  | { type: 'OPEN_LEADERS_MODAL'; leader?: PALeaderRecord }
  | { type: 'OPEN_WELCOME_GUIDE' }
  | { type: 'OPEN_CATALOG' }
  | { type: 'SELECT_REGION'; region: RegionId | 'all' };

export interface AIAgentContext {
  selectedCounty: CountyRecord | null;
  activeEra: HistoricalEra;
  language: AppLanguage;
  isTeacherMode: boolean;
  isCompareMode: boolean;
}

export interface AIAgentResponse {
  replyText: string;
  actionBadge?: string;
  action?: AIUIAction;
  followUpSuggestions: string[];
}

interface CityAliasEntry {
  keywords: string[];
  countyName: string;
  cityLabelEn: string;
  cityLabelEs: string;
  lat: number;
  lng: number;
  zoom: number;
}

const PA_CITY_AND_LANDMARK_ALIASES: CityAliasEntry[] = [
  {
    keywords: ['philadelphia', 'filadelfia', 'philly', 'independence hall', 'liberty bell', 'campana de la libertad'],
    countyName: 'Philadelphia',
    cityLabelEn: 'Philadelphia (Independence Hall)',
    cityLabelEs: 'Filadelfia (Independence Hall)',
    lat: 39.9489,
    lng: -75.15,
    zoom: 11,
  },
  {
    keywords: ['gettysburg', 'lincoln address', 'cemetery ridge', 'little round top'],
    countyName: 'Adams',
    cityLabelEn: 'Gettysburg (Adams County)',
    cityLabelEs: 'Gettysburg (Condado de Adams)',
    lat: 39.8309,
    lng: -77.2311,
    zoom: 11,
  },
  {
    keywords: ['scranton', 'electric city', 'steamtown', 'lackawanna'],
    countyName: 'Lackawanna',
    cityLabelEn: 'Scranton (Lackawanna County)',
    cityLabelEs: 'Scranton (Condado de Lackawanna)',
    lat: 41.409,
    lng: -75.6624,
    zoom: 11,
  },
  {
    keywords: ['pittsburgh', 'steel city', 'three rivers', 'carnegie', 'fort pitt', 'duquesne'],
    countyName: 'Allegheny',
    cityLabelEn: 'Pittsburgh (Allegheny County)',
    cityLabelEs: 'Pittsburgh (Condado de Allegheny)',
    lat: 40.4406,
    lng: -79.9959,
    zoom: 11,
  },
  {
    keywords: ['harrisburg', 'state capitol', 'capitolio estatal', 'three mile island'],
    countyName: 'Dauphin',
    cityLabelEn: 'Harrisburg (State Capital, Dauphin County)',
    cityLabelEs: 'Harrisburg (Capital Estatal, Condado de Dauphin)',
    lat: 40.2732,
    lng: -76.8867,
    zoom: 11,
  },
  {
    keywords: ['lancaster', 'amish', 'wheatland'],
    countyName: 'Lancaster',
    cityLabelEn: 'Lancaster County',
    cityLabelEs: 'Condado de Lancaster',
    lat: 40.0379,
    lng: -76.3055,
    zoom: 10,
  },
  {
    keywords: ['york', 'articles of confederation', 'articulos de la confederacion'],
    countyName: 'York',
    cityLabelEn: 'York County',
    cityLabelEs: 'Condado de York',
    lat: 39.9626,
    lng: -76.7277,
    zoom: 10,
  },
  {
    keywords: ['titusville', 'drake well', 'oil creek', 'pozo drake', 'petroleo'],
    countyName: 'Crawford',
    cityLabelEn: 'Titusville & Drake Oil Well (Crawford County)',
    cityLabelEs: 'Titusville y Pozo Drake (Condado de Crawford)',
    lat: 41.627,
    lng: -79.6736,
    zoom: 11,
  },
  {
    keywords: ['erie', 'presque isle', 'lake erie', 'lago erie'],
    countyName: 'Erie',
    cityLabelEn: 'Erie & Presque Isle (Erie County)',
    cityLabelEs: 'Erie y Presque Isle (Condado de Erie)',
    lat: 42.1292,
    lng: -80.0851,
    zoom: 10,
  },
  {
    keywords: ['wilkes-barre', 'wilkes barre', 'wyoming valley'],
    countyName: 'Luzerne',
    cityLabelEn: 'Wilkes-Barre (Luzerne County)',
    cityLabelEs: 'Wilkes-Barre (Condado de Luzerne)',
    lat: 41.2459,
    lng: -75.8813,
    zoom: 10,
  },
  {
    keywords: ['allentown', 'lehigh'],
    countyName: 'Lehigh',
    cityLabelEn: 'Allentown (Lehigh County)',
    cityLabelEs: 'Allentown (Condado de Lehigh)',
    lat: 40.6023,
    lng: -75.4714,
    zoom: 11,
  },
  {
    keywords: ['bethlehem', 'easton', 'bethlehem steel'],
    countyName: 'Northampton',
    cityLabelEn: 'Bethlehem & Easton (Northampton County)',
    cityLabelEs: 'Bethlehem y Easton (Condado de Northampton)',
    lat: 40.6259,
    lng: -75.3705,
    zoom: 11,
  },
  {
    keywords: ['reading', 'pagoda'],
    countyName: 'Berks',
    cityLabelEn: 'Reading (Berks County)',
    cityLabelEs: 'Reading (Condado de Berks)',
    lat: 40.3356,
    lng: -75.9269,
    zoom: 10,
  },
  {
    keywords: ['valley forge', 'norristown'],
    countyName: 'Montgomery',
    cityLabelEn: 'Valley Forge (Montgomery County)',
    cityLabelEs: 'Valley Forge (Condado de Montgomery)',
    lat: 40.099,
    lng: -75.446,
    zoom: 11,
  },
  {
    keywords: ['washington crossing', 'pennsbury manor', 'doylestown'],
    countyName: 'Bucks',
    cityLabelEn: 'Washington Crossing & Doylestown (Bucks County)',
    cityLabelEs: 'Washington Crossing y Doylestown (Condado de Bucks)',
    lat: 40.295,
    lng: -74.872,
    zoom: 10,
  },
  {
    keywords: ['johnstown', 'flood', 'inundacion de johnstown'],
    countyName: 'Cambria',
    cityLabelEn: 'Johnstown (Cambria County)',
    cityLabelEs: 'Johnstown (Condado de Cambria)',
    lat: 40.3267,
    lng: -78.922,
    zoom: 10,
  },
  {
    keywords: ['state college', 'penn state', 'bellefonte'],
    countyName: 'Centre',
    cityLabelEn: 'State College & Bellefonte (Centre County)',
    cityLabelEs: 'State College y Bellefonte (Condado de Centre)',
    lat: 40.7934,
    lng: -77.86,
    zoom: 10,
  },
  {
    keywords: ['jim thorpe', 'mauch chunk'],
    countyName: 'Carbon',
    cityLabelEn: 'Jim Thorpe (Carbon County)',
    cityLabelEs: 'Jim Thorpe (Condado de Carbon)',
    lat: 40.876,
    lng: -75.732,
    zoom: 11,
  },
  {
    keywords: ['shanksville', 'flight 93', 'vuelo 93', 'mount davis'],
    countyName: 'Somerset',
    cityLabelEn: 'Shanksville & Mount Davis (Somerset County)',
    cityLabelEs: 'Shanksville y Mount Davis (Condado de Somerset)',
    lat: 40.052,
    lng: -78.904,
    zoom: 10,
  },
];

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Generates contextual quick suggestion chips based on the active county and language.
 */
export function getContextualQuickChips(context: AIAgentContext): string[] {
  const { selectedCounty, language } = context;
  const cName = selectedCounty?.name || 'Philadelphia';

  if (language === 'en') {
    return [
      `📍 Tell me about ${cName} County`,
      `🏛️ Show ${cName} in 3D Stage`,
      `📊 Demographics of ${cName}`,
      `⚖️ Compare 1682 vs. Today`,
      `🦸‍♂️ Open Cartoon Encyclopedia`,
    ];
  }

  return [
    `📍 Resumen del Condado de ${cName}`,
    `🏛️ Ver ${cName} en Escenario 3D`,
    `📊 Demografía de ${cName}`,
    `⚖️ Comparar 1682 vs. Hoy`,
    `🦸‍♂️ Abrir Enciclopedia Caricatura`,
  ];
}

/**
 * Builds a comprehensive summary of a specific county (history + demographics + 3D figures)
 */
function buildCountyComprehensiveReply(
  county: CountyRecord,
  lang: AppLanguage,
  focusAspect?: 'demographics' | 'general'
): string {
  const locDossier = getLocalizedCountyDossier(county, lang);
  const locRegion = getLocalizedRegion(county.region, lang);
  const demo = getCountyFullDemographics(county);
  const stage3d = getHistorical3DStageForCounty(county.name);
  const charNames = stage3d.characters.map((c) => c.name).join(', ');

  if (focusAspect === 'demographics') {
    if (lang === 'en') {
      return `📊 **${county.name} County Demographic Analysis:**\n• **Total Population:** ${demo.estatica.poblacionTotal.toLocaleString('en-US')} residents (${demo.estatica.densidadPoblacional.toLocaleString('en-US')} pop./mi², ${demo.estatica.urbanaPct}% urban / ${demo.estatica.ruralPct}% rural).\n• **Vital Dynamics:** Birth rate of ${demo.dinamica.tasaNatalidad}‰ vs. mortality rate of ${demo.dinamica.tasaMortalidad}‰ (natural growth ${demo.dinamica.crecimientoVegetativo > 0 ? '+' : ''}${demo.dinamica.crecimientoVegetativo}‰). Life expectancy is ${demo.dinamica.esperanzaVida} years.\n• **Education & Income:** ${demo.estatica.atributosSociales.nivelEducativo.universitarioPct}% hold a Bachelor's degree or higher; median household income is $${demo.estatica.atributosSociales.situacionLaboral.medianHouseholdIncome.toLocaleString('en-US')}.`;
    }
    return `📊 **Análisis Demográfico del Condado de ${county.name}:**\n• **Población Total:** ${demo.estatica.poblacionTotal.toLocaleString('es-US')} habitantes (${demo.estatica.densidadPoblacional.toLocaleString('es-US')} hab/mi², ${demo.estatica.urbanaPct}% urbana / ${demo.estatica.ruralPct}% rural).\n• **Dinámica Vital:** Natalidad de ${demo.dinamica.tasaNatalidad}‰ frente a mortalidad de ${demo.dinamica.tasaMortalidad}‰ (crecimiento vegetativo ${demo.dinamica.crecimientoVegetativo > 0 ? '+' : ''}${demo.dinamica.crecimientoVegetativo}‰). Esperanza de vida: ${demo.dinamica.esperanzaVida} años.\n• **Educación e Ingresos:** ${demo.estatica.atributosSociales.nivelEducativo.universitarioPct}% con título universitario; ingreso familiar medio de $${demo.estatica.atributosSociales.situacionLaboral.medianHouseholdIncome.toLocaleString('es-US')}.`;
  }

  if (lang === 'en') {
    return `🏛️ **${county.name} County (Founded ${county.founded} · Seat: ${county.countySeat})**\n• **Region:** ${locRegion.title} (${county.areaSqMi.toLocaleString('en-US')} sq mi).\n• **Historical Significance:** ${locDossier.historicalImportance}\n• **Population & Economy:** ${demo.estatica.poblacionTotal.toLocaleString('en-US')} residents. ${locDossier.economicProfile}\n• **3D Stage Cast:** ${charNames}.`;
  }

  return `🏛️ **Condado de ${county.name} (Fundado en ${county.founded} · Sede: ${county.countySeat})**\n• **Región:** ${locRegion.title} (${county.areaSqMi.toLocaleString('es-US')} mi²).\n• **Importancia Histórica:** ${locDossier.historicalImportance}\n• **Población y Economía:** ${demo.estatica.poblacionTotal.toLocaleString('es-US')} habitantes. ${locDossier.economicProfile}\n• **Personajes en Escenario 3D:** ${charNames}.`;
}

/**
 * Main $0 Local Context-Aware AI Agent Brain & Action Dispatcher
 */
export function processAIAgentQuery(
  rawQuery: string,
  context: AIAgentContext
): AIAgentResponse {
  const { selectedCounty, activeEra, language } = context;
  const q = normalizeText(rawQuery);
  const defaultChips = getContextualQuickChips(context);

  // 1. Detect target county mentioned in the user's prompt (by county name or city alias)
  let mentionedCounty: CountyRecord | null = null;
  let matchedCityAlias: CityAliasEntry | null = null;

  for (const alias of PA_CITY_AND_LANDMARK_ALIASES) {
    if (alias.keywords.some((kw) => q.includes(normalizeText(kw)))) {
      matchedCityAlias = alias;
      mentionedCounty = PA_COUNTIES_DATA[alias.countyName] || null;
      break;
    }
  }

  if (!mentionedCounty) {
    for (const c of ALL_COUNTIES_LIST) {
      const cNorm = normalizeText(c.name);
      const seatNorm = normalizeText(c.countySeat);
      const regexCounty = new RegExp(`\\b${cNorm}\\b`, 'i');
      const regexSeat = seatNorm.length > 3 ? new RegExp(`\\b${seatNorm}\\b`, 'i') : null;
      if (regexCounty.test(q) || (regexSeat && regexSeat.test(q))) {
        mentionedCounty = c;
        break;
      }
    }
  }

  const targetCounty = mentionedCounty || selectedCounty || PA_COUNTIES_DATA['Philadelphia'];

  // 2. Check for 3D Historical Figures Stage command
  if (
    /\b(3d|escenario 3d|personajes 3d|figuras 3d|diorama|webgl|estatua|escultura)\b/.test(
      q
    )
  ) {
    const stage = getHistorical3DStageForCounty(targetCounty.name);
    const castList = stage.characters
      .map((c) => `${c.name} (${c.years})`)
      .join(', ');

    return {
      replyText:
        language === 'en'
          ? `🏛️ Opening the **Interactive 3D Historical Figures Stage** for **${targetCounty.name} County** (${stage.townTitle.en}). You can rotate 360°, zoom with studio lighting, and inspect: **${castList}**.`
          : `🏛️ Abriendo el **Escenario Interactivo de Personajes Históricos en 3D** para el **Condado de ${targetCounty.name}** (${stage.townTitle.es}). Puedes rotar 360°, hacer zoom e inspeccionar a: **${castList}**.`,
      actionBadge:
        language === 'en'
          ? `⚡ Action: Opening 3D Stage (${targetCounty.name})`
          : `⚡ Acción: Abriendo Escenario 3D (${targetCounty.name})`,
      action: {
        type: 'OPEN_3D_STAGE',
        countyName: targetCounty.name,
      },
      followUpSuggestions: defaultChips,
    };
  }

  // 3. Check for Cartoon / Comic Encyclopedia command
  if (
    /\b(comic|comics|caricatura|caricaturas|historieta|historietas|encyclopedia|enciclopedia)\b/.test(
      q
    )
  ) {
    return {
      replyText:
        language === 'en'
          ? `🦸‍♂️ Opening **The Adventures of Keystone ChronoMap: Illustrated Cartoon Encyclopedia** (6 chapters, 24 comic panels from 1681 to the present, with full multi-page PDF book download).`
          : `🦸‍♂️ Abriendo **Las Aventuras de Keystone ChronoMap: Enciclopedia Digital en Caricatura** (6 capítulos y 24 viñetas desde 1681 hasta hoy, con descarga de libro completo en PDF).`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Opening Cartoon Encyclopedia'
          : '⚡ Acción: Abriendo Enciclopedia Caricatura',
      action: { type: 'OPEN_COMIC_ENCYCLOPEDIA' },
      followUpSuggestions: defaultChips,
    };
  }

  // 4. Check for Before vs. Today Compare Mode
  if (
    /\b(comparar|compare|antes vs|before vs|before and after|1682 vs|cortina)\b/.test(
      q
    )
  ) {
    return {
      replyText:
        language === 'en'
          ? `⏳ Activating the **Before vs. Today Split-Curtain Comparator**. Drag the golden slider at the center of the map to compare William Penn’s original 1682 territories and 1787 Constitutional counties against modern Pennsylvania’s 67 counties.`
          : `⏳ Activando el **Comparador de Cortina Antes vs. Hoy**. Desliza el divisor dorado central para comparar los 3 condados originales de William Penn (1682) y la frontera de 1787 frente a los 67 condados actuales.`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Launching Before vs. Today Comparator'
          : '⚡ Acción: Abriendo Comparador Antes vs. Hoy',
      action: { type: 'OPEN_COMPARE_MODE' },
      followUpSuggestions: defaultChips,
    };
  }

  // 5. Check for Teacher Mode, Trivia, or PDE Worksheet
  if (/\b(trivia|quiz|juego|reto|desaf[ií]o)\b/.test(q)) {
    return {
      replyText:
        language === 'en'
          ? `🏆 Launching the **20-Question Pennsylvania Classroom Trivia Challenge**! You can play Solo Mode or 2-Team Classroom Duel.`
          : `🏆 ¡Abriendo el **Desafío de Trivia de Aula de Pensilvania (20 Preguntas)**! Puedes jugar en modo individual o Duelo de Equipos.`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Opening Classroom Trivia'
          : '⚡ Acción: Abriendo Trivia de Aula',
      action: { type: 'OPEN_TRIVIA' },
      followUpSuggestions: defaultChips,
    };
  }

  if (/\b(worksheet|hoja de trabajo|guia imprimible|tarea|pde)\b/.test(q)) {
    return {
      replyText:
        language === 'en'
          ? `🖨️ Opening the **PDE 8.2 Printable Classroom Worksheet Generator** for **${targetCounty.name} County**.`
          : `🖨️ Abriendo el **Generador de Guías de Clase Imprimibles (PDE 8.2)** para el **Condado de ${targetCounty.name}**.`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Opening PDE Worksheet Generator'
          : '⚡ Acción: Abriendo Generador de Guía PDE',
      action: { type: 'OPEN_WORKSHEET' },
      followUpSuggestions: defaultChips,
    };
  }

  if (
    /\b(teacher|docente|profesor|smartboard|pizarra|aula|classroom)\b/.test(q)
  ) {
    return {
      replyText:
        language === 'en'
          ? `🎓 Activating **PDE Teacher & Classroom Mode** with interactive touch whiteboard over the map, Primary Source Capsules, and Smartboard projection scaling.`
          : `🎓 Activando el **Modo Docente PDE** con pizarra táctil sobre el mapa, cápsulas de fuentes primarias y escala de proyección Smartboard.`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Activating Teacher Mode'
          : '⚡ Acción: Activando Modo Docente',
      action: { type: 'TOGGLE_TEACHER_MODE', enable: true },
      followUpSuggestions: defaultChips,
    };
  }

  // 6. Check for Vintage Maps Gallery
  if (/\b(vintage map|mapas antiguos|old map|mapa antiguo|superposicion)\b/.test(q)) {
    return {
      replyText:
        language === 'en'
          ? `🗺️ Opening the **Archival Vintage Maps Gallery** (1681–1920s Library of Congress & David Rumsey Collection). You can overlay historic maps directly onto the live Pennsylvania map.`
          : `🗺️ Abriendo la **Galería de Mapas Históricos Antiguos** (1681–1920). Puedes superponer mapas coloniales e industriales directamente sobre el mapa actual.`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Opening Vintage Maps Gallery'
          : '⚡ Acción: Abriendo Galería de Mapas Antiguos',
      action: { type: 'OPEN_VINTAGE_MAPS' },
      followUpSuggestions: defaultChips,
    };
  }

  // 7. Check for Specific Historical Leader or Governor
  for (const leader of PA_LEADERS_DATA) {
    const lName = normalizeText(leader.name);
    const lastName = lName.split(' ').pop() || lName;
    if (q.includes(lName) || (lastName.length >= 5 && q.includes(lastName))) {
      return {
        replyText:
          language === 'en'
            ? `🏛️ **${leader.name}** (${leader.lifespanOrTerm}) — *${leader.roleTitle}*.\n• **Linked Counties:** ${leader.linkedCounties.join(', ')}.\n• **Key Achievements:** ${leader.achievements.slice(0, 2).join(' ')}\nOpening the biographical dossier with official Wikipedia portrait.`
            : `🏛️ **${leader.name}** (${leader.lifespanOrTerm}) — *${leader.roleTitle}*.\n• **Condados vinculados:** ${leader.linkedCounties.join(', ')}.\n• **Logros clave:** ${leader.managementSummary}\nAbriendo su ficha biográfica completa.`,
        actionBadge:
          language === 'en'
            ? `⚡ Action: Inspecting ${leader.name}`
            : `⚡ Acción: Abriendo biografía de ${leader.name}`,
        action: { type: 'OPEN_LEADERS_MODAL', leader },
        followUpSuggestions: defaultChips,
      };
    }
  }

  // Also check 3D characters not in PA_LEADERS_DATA (e.g. Betsy Ross, Rachel Carson, Edwin Drake, George Meade, George Scranton, Terence Powderly)
  for (const stg of PA_HISTORICAL_3D_STAGES) {
    for (const char3d of stg.characters) {
      const cNameNorm = normalizeText(char3d.name);
      const cLast = cNameNorm.split(' ').pop() || cNameNorm;
      if (q.includes(cNameNorm) || (cLast.length >= 5 && q.includes(cLast))) {
        return {
          replyText:
            language === 'en'
              ? `🏛️ **${char3d.name} (${char3d.years})** — *${char3d.role.en}* (${char3d.townName.en}).\n${char3d.biography.en}\n> ${char3d.quote.en}`
              : `🏛️ **${char3d.name} (${char3d.years})** — *${char3d.role.es}* (${char3d.townName.es}).\n${char3d.biography.es}\n> ${char3d.quote.es}`,
          actionBadge:
            language === 'en'
              ? `⚡ Action: Viewing ${char3d.name} in 3D Stage`
              : `⚡ Acción: Viendo a ${char3d.name} en Escenario 3D`,
          action: {
            type: 'OPEN_3D_STAGE',
            countyName: stg.counties[0] || 'Philadelphia',
          },
          followUpSuggestions: defaultChips,
        };
      }
    }
  }

  // 8. Check for Demographic / Population / Census questions
  if (
    /\b(demograf[ií]a|demographics|poblaci[oó]n|population|habitantes|censo|census|natalidad|mortalidad|esperanza de vida|income|ingresos|idiomas)\b/.test(
      q
    )
  ) {
    const reply = buildCountyComprehensiveReply(
      targetCounty,
      language,
      'demographics'
    );
    return {
      replyText: reply,
      actionBadge: mentionedCounty
        ? language === 'en'
          ? `⚡ Action: Flying to ${targetCounty.name} County`
          : `⚡ Acción: Volando al Condado de ${targetCounty.name}`
        : undefined,
      action: mentionedCounty
        ? { type: 'FLY_TO_COUNTY', county: targetCounty, zoom: 10 }
        : undefined,
      followUpSuggestions: defaultChips,
    };
  }

  // 9. Check for Chronological Era switching (1681, 1776, 1861, 1870, 1950)
  const eraMatches: { keywords: string[]; eraIndex: number }[] = [
    {
      keywords: ['1681', '1682', 'carta real', 'royal charter', 'holy experiment', 'santo experimento', 'colonial'],
      eraIndex: 0,
    },
    {
      keywords: ['1776', '1787', 'revolucion', 'revolution', 'independencia', 'independence', 'constitucion'],
      eraIndex: 1,
    },
    {
      keywords: ['1861', '1863', 'guerra civil', 'civil war', 'union'],
      eraIndex: 2,
    },
    {
      keywords: ['1870', '1900', 'revolucion industrial', 'industrial', 'acero y carbon', 'steel and coal'],
      eraIndex: 3,
    },
    {
      keywords: ['1950', 'posguerra', 'post-war', 'modernizacion', 'autopistas'],
      eraIndex: 4,
    },
  ];

  for (const em of eraMatches) {
    if (
      !mentionedCounty &&
      em.keywords.some((kw) => q.includes(kw))
    ) {
      const targetEra = HISTORICAL_ERAS[em.eraIndex];
      const locEra = getLocalizedEra(targetEra, language);
      const countFounded = ALL_COUNTIES_LIST.filter(
        (c) => c.founded <= targetEra.cutoffYear
      ).length;

      return {
        replyText:
          language === 'en'
            ? `⏳ **Time Travel to Era ${locEra.yearLabel}: ${locEra.title}**\n• **Counties Incorporated by ${targetEra.cutoffYear}:** ${countFounded} of 67 counties.\n• **Historical Context:** ${locEra.summary}`
            : `⏳ **Viaje en el Tiempo a la Época ${locEra.yearLabel}: ${locEra.title}**\n• **Condados constituidos hasta ${targetEra.cutoffYear}:** ${countFounded} de 67 condados.\n• **Contexto Histórico:** ${locEra.summary}`,
        actionBadge:
          language === 'en'
            ? `⚡ Action: Setting Timeline to ${locEra.yearLabel}`
            : `⚡ Acción: Cambiando Línea de Tiempo a ${locEra.yearLabel}`,
        action: { type: 'SELECT_ERA', era: targetEra },
        followUpSuggestions: defaultChips,
      };
    }
  }

  // 10. If a specific County or City was mentioned, fly to it on the map and narrate its dossier!
  if (mentionedCounty) {
    const reply = buildCountyComprehensiveReply(
      mentionedCounty,
      language,
      'general'
    );
    const badgePlace = matchedCityAlias
      ? language === 'en'
        ? matchedCityAlias.cityLabelEn
        : matchedCityAlias.cityLabelEs
      : `${mentionedCounty.name} County`;

    return {
      replyText: reply,
      actionBadge:
        language === 'en'
          ? `⚡ Action: Flying to ${badgePlace}`
          : `⚡ Acción: Volando a ${badgePlace}`,
      action: {
        type: 'FLY_TO_COUNTY',
        county: mentionedCounty,
        lat: matchedCityAlias?.lat,
        lng: matchedCityAlias?.lng,
        zoom: matchedCityAlias?.zoom || 10,
      },
      followUpSuggestions: getContextualQuickChips({
        ...context,
        selectedCounty: mentionedCounty,
      }),
    };
  }

  // 11. Context-aware questions about "here / this county / este condado / qué pasó aquí"
  if (
    /\b(aqui|este condado|este lugar|this county|here|resumen|summary|cuentame|tell me|historia|history|que paso|what happened)\b/.test(
      q
    )
  ) {
    const reply = buildCountyComprehensiveReply(
      targetCounty,
      language,
      'general'
    );
    return {
      replyText: reply,
      followUpSuggestions: defaultChips,
    };
  }

  // 12. Questions about PHMC Plaques or Battles
  if (/\b(placas|plaques|phmc|batallas|battles|hitos|milestones)\b/.test(q)) {
    const countyMarkers = PHMC_MARKERS_DATA.filter(
      (m) => m.countyName === targetCounty.name
    );
    const countyEvents = HISTORICAL_EVENTS_DATA.filter(
      (e) => e.countyName === targetCounty.name
    );
    const markerTitles =
      countyMarkers.length > 0
        ? countyMarkers.map((m) => `${m.title} (${m.eventYear})`).join(', ')
        : PHMC_MARKERS_DATA.slice(0, 4)
            .map((m) => `${m.title} (${m.countyName})`)
            .join(', ');
    const eventTitles =
      countyEvents.length > 0
        ? countyEvents
            .map((e) => getLocalizedEvent(e, language).shortTitle)
            .join(', ')
        : HISTORICAL_EVENTS_DATA.slice(0, 3)
            .map((e) => getLocalizedEvent(e, language).shortTitle)
            .join(', ');

    return {
      replyText:
        language === 'en'
          ? `🪧 **Historical Markers & Battles (${targetCounty.name} County & Commonwealth):**\n• **PHMC Blue & Gold Plaques:** ${markerTitles}.\n• **Key Historical Milestones:** ${eventTitles}.`
          : `🪧 **Placas Históricas PHMC y Batallas (${targetCounty.name} y Pensilvania):**\n• **Placas Oficiales Azul y Oro:** ${markerTitles}.\n• **Hitos y Batallas Clave:** ${eventTitles}.`,
      followUpSuggestions: defaultChips,
    };
  }

  // 13. Help / Guide / All 67 Counties Catalog
  if (/\b(67|catalogo|catalog|indice|todos los condados|all counties)\b/.test(q)) {
    return {
      replyText:
        language === 'en'
          ? `📚 Opening the **Complete 67-County Archival Index** of Pennsylvania (from Philadelphia, Bucks, and Chester in 1682 to Lackawanna in 1878).`
          : `📚 Abriendo el **Índice de Archivo Completo de los 67 Condados** de Pensilvania (desde Filadelfia, Bucks y Chester en 1682 hasta Lackawanna en 1878).`,
      actionBadge:
        language === 'en'
          ? '⚡ Action: Opening 67-County Catalog'
          : '⚡ Acción: Abriendo Catálogo de 67 Condados',
      action: { type: 'OPEN_CATALOG' },
      followUpSuggestions: defaultChips,
    };
  }

  // 14. Default Helpful Contextual Response
  const locEra = getLocalizedEra(activeEra, language);
  if (language === 'en') {
    return {
      replyText: `✨ **Keystone AI Guide (Active Context: ${targetCounty.name} County · Era ${locEra.yearLabel})**\n${buildCountyComprehensiveReply(targetCounty, 'en', 'general')}\n\n💡 *Tip: You can ask me by voice or text to fly to any county or town (e.g., "Go to Gettysburg", "Show Scranton in 3D", "Demographics of Allegheny", or "Compare 1682 vs Today").*`,
      followUpSuggestions: defaultChips,
    };
  }

  return {
    replyText: `✨ **Asistente IA Keystone (Contexto Activo: Condado de ${targetCounty.name} · Época ${locEra.yearLabel})**\n${buildCountyComprehensiveReply(targetCounty, 'es', 'general')}\n\n💡 *Consejo: Puedes pedirme por voz o texto volar a cualquier condado o ciudad (ej. "Llévame a Gettysburg", "Ver Scranton en 3D", "Demografía de Allegheny" o "Comparar 1682 vs Hoy").*`,
    followUpSuggestions: defaultChips,
  };
}
