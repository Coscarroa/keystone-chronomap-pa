import { CountyRecord, PA_REGIONS } from '../data/paCountiesData';
import { PALeaderRecord } from './paLeadersService';
import { PrimarySourceCapsule } from '../data/primarySourcesData';
import { getCountyFullDemographics } from '../data/paDemographicsFullData';

export type NarrationLanguage = 'es' | 'en';
export type NarrationRate = 1 | 1.2;

export interface BilingualNarrationScript {
  es: string;
  en: string;
}

const REGION_ENGLISH_LABELS: Record<CountyRecord['region'], string> = {
  southeast: 'Southeast Delaware Valley Region',
  northeast: 'Lehigh Valley, Poconos and Northeast Anthracite Region',
  southcentral: 'Susquehanna Valley and South Central Pennsylvania Dutch Region',
  alleghenies: 'Central Alleghenies, Laurel Highlands and Northern Tier',
  western: 'Western Pennsylvania, Pittsburgh Metropolitan Area and Lake Erie Shore',
};

const COUNTY_ENGLISH_SUMMARIES: Record<string, string> = {
  Philadelphia:
    'Philadelphia County, founded in 1682 by William Penn as one of the three original counties, served as the birthplace of American democracy. At Independence Hall, the Declaration of Independence was signed in 1776 and the United States Constitution was drafted in 1787. Historically a global manufacturing and maritime powerhouse on the Delaware and Schuylkill rivers, today it leads in medicine, higher education, and biotechnology.',
  Bucks:
    'Bucks County, founded in 1682 by William Penn and named after Buckinghamshire in England, is one of the three original counties of Pennsylvania. It houses Pennsbury Manor and Washington Crossing on the Delaware River, where George Washington launched his decisive Christmas night crossing in December 1776.',
  Chester:
    'Chester County, founded in 1682 as one of William Penn’s three original counties, was the site of the Battle of Brandywine in September 1777 and parts of the Valley Forge encampment. With its county seat in West Chester, it combines historic Quaker heritage, mushroom agriculture in Kennett Square, and a major pharmaceutical and technology corridor.',
  Lancaster:
    'Lancaster County, established in 1729 from Chester County as Pennsylvania’s fourth county, is the heartland of Pennsylvania Dutch, Amish, and Mennonite agricultural heritage. The city of Lancaster briefly served as the capital of the Continental Congress in September 1777 and as the state capital of Pennsylvania from 1799 to 1812.',
  York:
    'York County, founded in 1749 as the first county west of the Susquehanna River, served for nine months in 1777 and 1778 as the seat of the Continental Congress, where the Articles of Confederation were adopted.',
  Adams:
    'Adams County, established in 1800 and named after President John Adams, with its seat in Gettysburg, was the site of the three-day Battle of Gettysburg in July 1863—the turning point of the American Civil War—and President Abraham Lincoln’s historic Gettysburg Address in November 1863.',
  Allegheny:
    'Allegheny County, founded in 1788 with its seat in Pittsburgh at the confluence of the Allegheny and Monongahela rivers forming the Ohio River, became the undisputed Steel Capital of the World under industrialists like Andrew Carnegie, and later reinvented itself as a global hub for robotics, healthcare, and universities.',
  Lackawanna:
    'Lackawanna County, founded in 1878 with its seat in Scranton, is the sixty-seventh and youngest county in Pennsylvania. It rose to global prominence in the nineteenth century as the anthracite coal and electric streetcar capital of North America.',
  Luzerne:
    'Luzerne County, founded in 1786 with its seat in Wilkes-Barre along the Wyoming Valley of the Susquehanna River, was a strategic center of the anthracite coal revolution and the birthplace of the Huber Breaker.',
  Dauphin:
    'Dauphin County, founded in 1785 on the banks of the Susquehanna River, is home to Harrisburg, the official state capital of the Commonwealth of Pennsylvania since 1812 and a vital railroad and canal crossroads.',
  Crawford:
    'Crawford County, founded in 1800 with its seat in Meadville, is home to Titusville, where Colonel Edwin Drake drilled the world’s first commercial oil well in August 1859, launching the modern petroleum age.',
  Erie:
    'Erie County, established in 1800 following the 1792 Erie Triangle purchase, provides Pennsylvania’s strategic freshwater port on Lake Erie and Presque Isle Bay, where Commodore Oliver Hazard Perry built his victorious naval fleet during the War of 1812.',
  Montgomery:
    'Montgomery County, founded in 1784 with its seat in Norristown, preserves the winter encampment of the Continental Army at Valley Forge from 1777 to 1778 and is today one of the most populous economic centers in the Commonwealth.',
  Somerset:
    'Somerset County, founded in 1795 in the Laurel Highlands, contains Mount Davis, the highest natural point in Pennsylvania at 3,213 feet, as well as the Flight 93 National Memorial in Shanksville.',
  Franklin:
    'Franklin County, founded in 1784 in the Cumberland Valley and named after Benjamin Franklin, is the birthplace of President James Buchanan. Its county seat, Chambersburg, was the only major Northern town burned by Confederate forces in July 1864.',
  Cambria:
    'Cambria County, founded in 1804 with its seat in Ebensburg, includes the industrial valley of Johnstown, famous for the Cambria Iron Company, the western basin of the Pennsylvania Main Line Canal, and the historic Johnstown Flood of 1889.',
  Berks:
    'Berks County, founded in 1752 with its seat in Reading along the Schuylkill River, was the ancestral home of Daniel Boone and headquarters of the iconic Reading Railroad.',
  Lehigh:
    'Lehigh County, founded in 1812 with its seat in Allentown, sheltered the Liberty Bell during the British occupation of Philadelphia in 1777 and drove Pennsylvania’s industrial cement, steel, and truck manufacturing.',
  Northampton:
    'Northampton County, founded in 1752 with its seat in Easton at the confluence of the Lehigh and Delaware rivers, hosted the reading of the Declaration of Independence in July 1776 and the monumental Bethlehem Steel Works.',
};

const LEADER_ENGLISH_SUMMARIES: Record<string, string> = {
  'william-penn':
    'William Penn, lived 1644 to 1718. English Quaker founder and proprietor of the Province of Pennsylvania under the Royal Charter of 1681. He envisioned Pennsylvania as a Holy Experiment of religious liberty, trial by jury, peaceful treaties with the Lenni-Lenape Nation at Shackamaxon, and the Frame of Government of 1682, while establishing the three original counties of Philadelphia, Bucks, and Chester.',
  'benjamin-franklin':
    'Benjamin Franklin, lived 1706 to 1790. Polymath, printer, scientist, diplomat, and sixth President of the Supreme Executive Council of Pennsylvania. He signed both the Declaration of Independence and the United States Constitution in Philadelphia, founded the University of Pennsylvania, the American Philosophical Society, and Pennsylvania Hospital, and later served as President of the Pennsylvania Abolition Society.',
  'thomas-mifflin':
    'Thomas Mifflin, lived 1744 to 1800. Major General in the Continental Army, signer of the U.S. Constitution, and first constitutional Governor of the Commonwealth of Pennsylvania from 1790 to 1799. He oversaw the creation of the Philadelphia and Lancaster Turnpike, penal code reform, and the state response to the Whiskey Rebellion of 1794.',
  'james-buchanan':
    'James Buchanan, lived 1791 to 1868. Born in Franklin County and resident of Wheatland in Lancaster County, he served as Secretary of State and as the fifteenth President of the United States from 1857 to 1861 on the eve of the Civil War. Historians critically examine his administration for failing to prevent the secession crisis and for his involvement in the Dred Scott decision.',
  'thaddeus-stevens':
    'Thaddeus Stevens, lived 1792 to 1868. Abolitionist attorney and Congressman representing Adams and Lancaster counties. He defended free public education in Pennsylvania in 1835, operated an Underground Railroad station in Lancaster, and spearheaded the Thirteenth and Fourteenth Amendments to the U.S. Constitution during Reconstruction.',
  'andrew-gregg-curtin':
    'Andrew Gregg Curtin, lived 1815 to 1894. Born in Bellefonte, Centre County, he served as the fifteenth Governor of Pennsylvania from 1861 to 1867 during the Civil War. Known as the Soldier’s Friend, he established Camp Curtin in Harrisburg, organized the Loyal War Governors Conference in Altoona, and commissioned the Soldiers’ National Cemetery in Gettysburg where Abraham Lincoln delivered the Gettysburg Address.',
  'andrew-carnegie':
    'Andrew Carnegie, lived 1835 to 1919. Scottish-American industrialist and philanthropist who built Carnegie Steel Company in Pittsburgh and Allegheny County into the largest steel producer in the world. While his mills suffered the violent Homestead Strike of 1892, he later dedicated his fortune to founding Carnegie Mellon University, the Carnegie Museums, and over 2,500 public libraries.',
  'gifford-pinchot':
    'Gifford Pinchot, lived 1865 to 1946. From Grey Towers in Milford, Pike County, he became the first Chief of the United States Forest Service and served two terms as the twenty-eighth Governor of Pennsylvania. He reformed state finances, reforested state lands, and paved over 20,000 miles of rural Pinchot Roads during the Great Depression.',
  'milton-shapp':
    'Milton Shapp, lived 1912 to 1994. Cable television pioneer and fortieth Governor of Pennsylvania from 1971 to 1979. He created the Pennsylvania Lottery dedicated entirely to senior citizen benefits, led recovery after Hurricane Agnes in 1972, and championed consumer protection laws.',
  'tom-ridge':
    'Tom Ridge, born 1945. Erie native, Vietnam veteran, forty-third Governor of Pennsylvania from 1995 to 2001, and the first United States Secretary of Homeland Security following September 11, 2001. As Governor, he launched the nationally recognized Land Recycling brownfields program.',
  'josh-shapiro':
    'Josh Shapiro, born 1973. Former Montgomery County Commissioner, Pennsylvania Attorney General, and forty-eighth Governor of Pennsylvania since 2023. His administration coordinated the rapid twelve-day reconstruction of Interstate 95 in Philadelphia, expanded workforce opportunity, and led national opioid settlement agreements.',
};

/**
 * Checks whether the browser supports native Web Speech API synthesis.
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Selects the highest quality OS/browser voice for English (en-US/en-GB) or Spanish (es-US/es-ES/es-MX).
 */
export function pickBestVoice(
  lang: NarrationLanguage
): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetPrefixes =
    lang === 'en'
      ? ['en-us', 'en-gb', 'en']
      : ['es-us', 'es-es', 'es-mx', 'es-419', 'es'];

  for (const prefix of targetPrefixes) {
    // Prefer natural/neural/Google/Microsoft/Apple enhanced voices first
    const premiumMatch = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(prefix) &&
        /natural|neural|google|siri|premium|enhanced|mónica|paulina|jorge|samantha|alex|daniel/i.test(
          v.name
        )
    );
    if (premiumMatch) return premiumMatch;

    const standardMatch = voices.find((v) =>
      v.lang.toLowerCase().startsWith(prefix)
    );
    if (standardMatch) return standardMatch;
  }

  return null;
}

/**
 * Builds a complete bilingual narration script (ES & EN) for any of the 67 Pennsylvania counties,
 * including both historical dossier and static/dynamic demographic indicators.
 */
export function buildCountyNarrationScript(
  county: CountyRecord,
  activeEraLabel?: string
): BilingualNarrationScript {
  const regionMeta = PA_REGIONS[county.region];
  const regionEn = REGION_ENGLISH_LABELS[county.region];
  const demo = getCountyFullDemographics(county);

  const esText = [
    `Expediente histórico y demográfico del Condado de ${county.name}, Pensilvania.`,
    `Fundado en el año ${county.founded}, con sede condal en ${county.countySeat}, dentro de la región ${regionMeta.spanishTitle}.`,
    `Estructura demográfica: cuenta con una población actual de ${demo.estatica.poblacionTotal.toLocaleString('es-US')} habitantes y una densidad de ${demo.estatica.densidadPoblacional.toLocaleString('es-US')} habitantes por milla cuadrada, con un ${demo.estatica.urbanaPct} por ciento de población urbana.`,
    `Dinámica demográfica: registra una esperanza de vida de ${demo.dinamica.esperanzaVida} años, una tasa de natalidad de ${demo.dinamica.tasaNatalidad} por mil y mortalidad de ${demo.dinamica.tasaMortalidad} por mil (${demo.dinamica.migracion.etiquetaSaldoEs}).`,
    `Importancia histórica: ${county.historicalImportance}`,
    `Vocación económica: ${county.economicProfile}`,
    `Hito patrimonial destacado: ${county.keyLandmark}.`,
    activeEraLabel ? `Contexto de exploración actual: época ${activeEraLabel}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const customEn = COUNTY_ENGLISH_SUMMARIES[county.name];
  const demoSummaryEn = `Demographic snapshot: total population of ${demo.estatica.poblacionTotal.toLocaleString('en-US')} residents (${demo.estatica.densidadPoblacional.toLocaleString('en-US')} per square mile, ${demo.estatica.urbanaPct}% urban). Life expectancy is ${demo.dinamica.esperanzaVida} years, with a birth rate of ${demo.dinamica.tasaNatalidad} per thousand, mortality rate of ${demo.dinamica.tasaMortalidad} per thousand, and a median household income of $${demo.estatica.atributosSociales.situacionLaboral.medianHouseholdIncome.toLocaleString('en-US')}.`;

  const enText = customEn
    ? `${customEn} Located in the ${regionEn}, ${county.name} County covers ${county.areaSqMi.toLocaleString('en-US')} square miles with its county seat in ${county.countySeat}. ${demoSummaryEn} Key landmark: ${county.keyLandmark}.`
    : `Historical and demographic dossier for ${county.name} County, Commonwealth of Pennsylvania. Founded in ${county.founded}, with its county seat in ${county.countySeat}, located in the ${regionEn}. Covering ${county.areaSqMi.toLocaleString('en-US')} square miles, its pre-colonial heritage includes the ${county.indigenousHeritage}. ${demoSummaryEn} Key landmark: ${county.keyLandmark}.`;

  return { es: esText, en: enText };
}

/**
 * Builds a complete bilingual narration script (ES & EN) for any of the 11 Pennsylvania historical leaders.
 */
export function buildLeaderNarrationScript(
  leader: PALeaderRecord,
  wikiExtractEn?: string
): BilingualNarrationScript {
  const esText = [
    `${leader.name}. ${leader.roleTitle}. Período: ${leader.lifespanOrTerm}.`,
    `Resumen de gestión: ${leader.managementSummary}`,
    `Principales logros: ${leader.achievements.join(' ')}`,
    `Controversias y crisis históricas: ${leader.controversiesAndCrises.join(' ')}`,
    `Instituciones u obras fundadas: ${leader.institutionsFounded.join(' ')}`,
  ].join(' ');

  const enBase =
    LEADER_ENGLISH_SUMMARIES[leader.id] ||
    `${leader.name}, ${leader.roleTitle}. Linked to ${leader.linkedCounties.join(', ')} in the Commonwealth of Pennsylvania.`;

  const enText = wikiExtractEn
    ? `${enBase} Historical Archive Summary: ${wikiExtractEn.replace(/\.\.\.$/, '.')}`
    : enBase;

  return { es: esText, en: enText };
}

/**
 * Builds a bilingual narration script (ES & EN) for a Primary Source Capsule.
 */
export function buildPrimarySourceNarrationScript(
  source: PrimarySourceCapsule
): BilingualNarrationScript {
  const esText = [
    `Fuente primaria oficial: ${source.title}, año ${source.year}.`,
    `Cita histórica: ${source.translatedQuoteEs}`,
    `Contexto: ${source.historicalContext}`,
    `Primera pregunta socrática: ${source.socraticQuestions[0]}`,
  ].join(' ');

  const enText = [
    `Official Primary Source: ${source.shortTitle}, year ${source.year}.`,
    `Verbatim historical excerpt: ${source.originalQuoteEn}`,
    `Aligned with Pennsylvania Department of Education Standard ${source.pdeStandardCode}.`,
  ].join(' ');

  return { es: esText, en: enText };
}

/**
 * Directly speaks any text string (such as an AI Assistant response) using the best available OS/browser voice.
 */
export function speakTextDirect(
  text: string,
  lang: NarrationLanguage,
  rate: NarrationRate = 1,
  onEnd?: () => void
): void {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    // Strip markdown symbols or emojis that sound awkward when read aloud
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = pickBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === 'en' ? 'en-US' : 'es-US';
    }
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

/**
 * Stops any active speech synthesis immediately.
 */
export function stopDirectSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore cancel errors
  }
}

