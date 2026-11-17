import { EraId } from '../i18n/translations';
import { HistoricalScenarioId } from './historicalTerritoriesConfig';

export type ChronologyCategoryId = 'political' | 'geographic' | 'statistical';

export type ChronologySubcategoryId =
  // Category 1: Political & Historical
  | 'origins'
  | 'independence'
  | 'regime_changes'
  | 'wars_conflicts'
  | 'constitutional_reforms'
  // Category 2: Geographic & Territorial
  | 'border_evolution'
  | 'city_foundations'
  // Category 3: Statistical & Time-Series
  | 'demographic_evolution'
  | 'economic_indicators'
  | 'social_development';

export interface ChronologyTimeSeriesPoint {
  period: string;
  value: number;
  secondaryValue?: number;
  unitEn: string;
  unitEs: string;
}

export interface ChronologyMilestoneItem {
  id: string;
  year: number;
  dateLabelEn: string;
  dateLabelEs: string;
  category: ChronologyCategoryId;
  subcategory: ChronologySubcategoryId;
  eraId: EraId;
  titleEn: string;
  titleEs: string;
  shortTitleEn: string;
  shortTitleEs: string;
  summaryEn: string;
  summaryEs: string;
  impactEn: string;
  impactEs: string;
  countyName?: string;
  coordinates?: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  turfScenario?: HistoricalScenarioId | 'none';
  seriesTitleEn?: string;
  seriesTitleEs?: string;
  seriesUnitEn?: string;
  seriesUnitEs?: string;
  seriesData?: ChronologyTimeSeriesPoint[];
}

export interface SubcategoryMeta {
  id: ChronologySubcategoryId | 'all';
  category: ChronologyCategoryId | 'all';
  labelEn: string;
  labelEs: string;
}

export const CHRONOLOGY_SUBCATEGORIES: SubcategoryMeta[] = [
  // Category 1: Political & Historical
  {
    id: 'origins',
    category: 'political',
    labelEn: 'Origins & Foundations',
    labelEs: 'Orígenes y Fundaciones',
  },
  {
    id: 'independence',
    category: 'political',
    labelEn: 'Independence & Union',
    labelEs: 'Independencia y Unión',
  },
  {
    id: 'regime_changes',
    category: 'political',
    labelEn: 'Regime Transitions',
    labelEs: 'Cambios de Régimen',
  },
  {
    id: 'wars_conflicts',
    category: 'political',
    labelEn: 'Wars & Conflicts',
    labelEs: 'Guerras y Conflictos',
  },
  {
    id: 'constitutional_reforms',
    category: 'political',
    labelEn: 'Constitutional Reforms',
    labelEs: 'Reformas Constitucionales',
  },
  // Category 2: Geographic & Territorial
  {
    id: 'border_evolution',
    category: 'geographic',
    labelEn: 'Border Evolution & Disputes',
    labelEs: 'Evolución de Fronteras',
  },
  {
    id: 'city_foundations',
    category: 'geographic',
    labelEn: 'Major City Foundations',
    labelEs: 'Fundación de Ciudades',
  },
  // Category 3: Statistical & Social
  {
    id: 'demographic_evolution',
    category: 'statistical',
    labelEn: 'Demographic Evolution',
    labelEs: 'Evolución Demográfica',
  },
  {
    id: 'economic_indicators',
    category: 'statistical',
    labelEn: 'Economic Indicators & GDP',
    labelEs: 'Indicadores Económicos',
  },
  {
    id: 'social_development',
    category: 'statistical',
    labelEn: 'Social & Civic Development',
    labelEs: 'Desarrollo Social',
  },
];

export const CHRONOLOGY_MILESTONES_DATA: ChronologyMilestoneItem[] = [
  // =========================================================================
  // CATEGORY 1: HISTORICAL & POLITICAL MILESTONES
  // =========================================================================
  {
    id: 'pol-indigenous-origins',
    year: 1600,
    dateLabelEn: 'Pre-1681 · Indigenous Nations',
    dateLabelEs: 'Pre-1681 · Pueblos Originarios',
    category: 'political',
    subcategory: 'origins',
    eraId: '1681',
    titleEn: 'Lenape, Susquehannock & Haudenosaunee Homelands',
    titleEs: 'Territorios Originarios Lenape, Susquehannock y Haudenosaunee',
    shortTitleEn: 'Indigenous Nations',
    shortTitleEs: 'Pueblos Originarios',
    summaryEn:
      'For millennia prior to European colonization, the Delaware (Lenni-Lenape), Susquehannock, Shawnee, and Haudenosaunee Confederacy governed the river valleys and trails that later became Pennsylvania highways.',
    summaryEs:
      'Durante milenios antes de la colonización europea, las naciones Lenni-Lenape (Delaware), Susquehannock, Shawnee y la Confederación Haudenosaunee habitaron y gobernaron las cuencas fluviales de Pensilvania.',
    impactEn:
      'Established the Great Shamokin Path, Kittanning Path, and indigenous place names across all 67 counties (Susquehanna, Allegheny, Lackawanna, Monongahela, Juniata).',
    impactEs:
      'Dieron origen a las grandes rutas continentales y a la toponimia de ríos y condados como Susquehanna, Allegheny, Lackawanna, Juniata y Tioga.',
    countyName: 'Philadelphia',
    coordinates: { lat: 40.2732, lng: -76.8867, zoom: 7 },
  },
  {
    id: 'pol-royal-charter-1681',
    year: 1681,
    dateLabelEn: 'March 4, 1681',
    dateLabelEs: '4 de marzo de 1681',
    category: 'political',
    subcategory: 'origins',
    eraId: '1681',
    titleEn: 'Royal Charter of King Charles II to William Penn',
    titleEs: 'Carta Real de Carlos II a William Penn ("Sylvania")',
    shortTitleEn: 'Royal Charter',
    shortTitleEs: 'Carta Real',
    summaryEn:
      'King Charles II granted Quaker thinker William Penn 45,000 square miles in North America to settle a royal debt owed to Admiral Sir William Penn, naming the province Pennsylvania.',
    summaryEs:
      'El rey Carlos II otorgó a William Penn la Carta Real de Pensilvania para saldar una deuda de la Corona con su padre, el almirante Sir William Penn, dando inicio al "Santo Experimento".',
    impactEn:
      'Created the largest proprietary colony in the British Empire and enshrined religious liberty and trial by jury from its inception.',
    impactEs:
      'Fundó el "Santo Experimento" cuáquero basado en la libertad de conciencia religiosa, el juicio por jurado y la convivencia pacífica.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9526, lng: -75.1652, zoom: 10 },
  },
  {
    id: 'pol-shackamaxon-1682',
    year: 1682,
    dateLabelEn: 'November 1682',
    dateLabelEs: 'Noviembre de 1682',
    category: 'political',
    subcategory: 'origins',
    eraId: '1681',
    titleEn: 'Treaty of Shackamaxon & Frame of Government',
    titleEs: 'Tratado de Shackamaxon y Primer Frame of Government',
    shortTitleEn: 'Shackamaxon Treaty',
    shortTitleEs: 'Tratado de Shackamaxon',
    summaryEn:
      'Beneath the Great Elm at Shackamaxon along the Delaware River, William Penn and Lenape Chief Tamanend forged a treaty of mutual peace alongside Penn’s 1682 Frame of Government.',
    summaryEs:
      'Bajo el Gran Olmo de Shackamaxon a orillas del río Delaware, William Penn y el jefe lenape Tamanend sellaron el tratado de paz junto con el primer marco constitucional de la colonia.',
    impactEn:
      'Praised by Voltaire as "the only treaty between Indians and Christians that was never sworn to and never broken" during Penn’s lifetime.',
    impactEs:
      'Elogiado por Voltaire como el único pacto colonial nunca quebrantado en vida de Penn; inspiró la separación de poderes estadounidense.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9692, lng: -75.1286, zoom: 12 },
  },
  {
    id: 'pol-french-indian-war-1758',
    year: 1758,
    dateLabelEn: 'November 25, 1758',
    dateLabelEs: '25 de noviembre de 1758',
    category: 'political',
    subcategory: 'wars_conflicts',
    eraId: '1681',
    titleEn: 'French & Indian War: Capture of Fort Duquesne (Fort Pitt)',
    titleEs: 'Guerra Franco-Indígena: Toma del Fuerte Duquesne (Fort Pitt)',
    shortTitleEn: 'Fort Duquesne / Pitt',
    shortTitleEs: 'Fuerte Duquesne / Pitt',
    summaryEn:
      'General John Forbes and Colonel George Washington marched across the Alleghenies to capture the strategic Forks of the Ohio, renaming it Fort Pitt and founding Pittsburgh.',
    summaryEs:
      'La expedición del general John Forbes y George Washington cruzó los montes Allegheny para tomar la confluencia de los ríos Allegheny, Monongahela y Ohio, fundando Fort Pitt.',
    impactEn:
      'Secured British control of the Ohio River Valley and opened Western Pennsylvania to permanent settlement.',
    impactEs:
      'Aseguró el dominio anglosajón del valle del Ohio y abrió el oeste de Pensilvania a la colonización.',
    countyName: 'Allegheny',
    coordinates: { lat: 40.4417, lng: -80.0089, zoom: 11 },
  },
  {
    id: 'pol-independence-1776',
    year: 1776,
    dateLabelEn: 'July 4, 1776',
    dateLabelEs: '4 de julio de 1776',
    category: 'political',
    subcategory: 'independence',
    eraId: '1776',
    titleEn: 'Continental Congress & Declaration of Independence',
    titleEs: 'Congreso Continental y Declaración de Independencia en Filadelfia',
    shortTitleEn: 'Declaration of Independence',
    shortTitleEs: 'Independencia',
    summaryEn:
      'Meeting inside the Pennsylvania State House (Independence Hall) in Philadelphia, the Second Continental Congress adopted the Declaration of Independence, making Pennsylvania the cradle of the American Republic.',
    summaryEs:
      'Reunido en la Casa Estatal de Pensilvania (Independence Hall), el Segundo Congreso Continental proclamó la Declaración de Independencia de los Estados Unidos.',
    impactEn:
      'Transformed Philadelphia into the Revolutionary capital of the United States and made the Liberty Bell a global emblem of freedom.',
    impactEs:
      'Convirtió a Filadelfia en la capital revolucionaria de la nación y a la Campana de la Libertad en emblema universal.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9489, lng: -75.15, zoom: 13 },
  },
  {
    id: 'pol-pa-constitution-1776',
    year: 1776,
    dateLabelEn: 'September 28, 1776',
    dateLabelEs: '28 de septiembre de 1776',
    category: 'political',
    subcategory: 'regime_changes',
    eraId: '1776',
    titleEn: 'Proprietary Regime Ends: Radical PA Constitution of 1776',
    titleEs: 'Fin del Régimen Propietario y Constitución Radical de 1776',
    shortTitleEn: 'Commonwealth Born',
    shortTitleEs: 'Nace la Mancomunidad',
    summaryEn:
      'Chaired by Benjamin Franklin, Pennsylvania ended the Penn family’s proprietary rule, establishing the "Commonwealth of Pennsylvania" with a unicameral assembly and abolishing property requirements for voting.',
    summaryEs:
      'Presidida por Benjamin Franklin, la convención puso fin al gobierno propietario de la familia Penn, instauró el nombre oficial "Commonwealth of Pennsylvania" y creó la constitución más democrática del siglo XVIII.',
    impactEn:
      'Expanded suffrage to all taxpaying freemen and enacted the Divestment Act of 1779 transferring 24 million acres of Penn lands to the public.',
    impactEs:
      'Eliminó el requisito de propiedad territorial para votar y nacionalizó las tierras de los Penn mediante el Divestment Act de 1779.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9489, lng: -75.15, zoom: 11 },
  },
  {
    id: 'pol-valley-forge-1777',
    year: 1777,
    dateLabelEn: 'Winter 1777–1778',
    dateLabelEs: 'Invierno de 1777–1778',
    category: 'political',
    subcategory: 'wars_conflicts',
    eraId: '1776',
    titleEn: 'Continental Army Winter Encampment at Valley Forge',
    titleEs: 'Campamento de Invierno del Ejército Continental en Valley Forge',
    shortTitleEn: 'Valley Forge',
    shortTitleEs: 'Valley Forge',
    summaryEn:
      'General George Washington and 12,000 Continental soldiers endured a brutal winter at Valley Forge while Baron von Steuben forged them into a professional army.',
    summaryEs:
      'George Washington y 12,000 soldados continentales resistieron el duro invierno en Valley Forge mientras el barón von Steuben profesionalizaba las tropas.',
    impactEn:
      'Decisive turning point of the American Revolutionary War while the Continental Congress met in exile in Lancaster and York.',
    impactEs:
      'Punto de inflexión militar de la Guerra de Independencia mientras el Congreso sesionaba en Lancaster y York.',
    countyName: 'Montgomery',
    coordinates: { lat: 40.0997, lng: -75.4469, zoom: 11 },
  },
  {
    id: 'pol-us-constitution-1787',
    year: 1787,
    dateLabelEn: 'Sept 17 & Dec 12, 1787',
    dateLabelEs: '17 sept. y 12 dic. de 1787',
    category: 'political',
    subcategory: 'independence',
    eraId: '1776',
    titleEn: 'U.S. Constitution Signed & PA Ratifies as 2nd State',
    titleEs: 'Convención Constitucional y Ratificación como 2.º Estado de la Unión',
    shortTitleEn: '2nd State · Constitution',
    shortTitleEs: '2.º Estado de la Unión',
    summaryEn:
      'Following the Philadelphia Constitutional Convention ("We the People", drafted by Gouverneur Morris of PA), Pennsylvania ratified the U.S. Constitution on December 12, 1787 as the 2nd state ("Keystone State").',
    summaryEs:
      'Tras redactarse la Constitución de EE. UU. en Filadelfia, Pensilvania la ratificó el 12 de diciembre de 1787 convirtiéndose en el segundo estado de la Unión y piedra angular ("Keystone State").',
    impactEn:
      'Philadelphia served as the federal capital of the United States from 1790 to 1800 while Washington, D.C. was built.',
    impactEs:
      'Consolidó a Pensilvania como el estado bisagra entre el Norte y el Sur; Filadelfia fue capital federal de EE. UU. entre 1790 y 1800.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9489, lng: -75.15, zoom: 11 },
    turfScenario: '1787',
  },
  {
    id: 'pol-whiskey-rebellion-1794',
    year: 1794,
    dateLabelEn: 'July–November 1794',
    dateLabelEs: 'Julio–noviembre de 1794',
    category: 'political',
    subcategory: 'wars_conflicts',
    eraId: '1776',
    titleEn: 'Whiskey Rebellion in Western Pennsylvania',
    titleEs: 'Rebelión del Whiskey en el Oeste de Pensilvania',
    shortTitleEn: 'Whiskey Rebellion',
    shortTitleEs: 'Rebelión del Whiskey',
    summaryEn:
      'Frontier farmers in Washington, Allegheny, Fayette, and Westmoreland counties rose against Alexander Hamilton’s federal excise tax on distilled spirits; President Washington led 13,000 militia across the Alleghenies.',
    summaryEs:
      'Los agricultores fronterizos de Washington y Allegheny se alzaron contra el impuesto federal al licor; el presidente George Washington encabezó personalmente las tropas hasta Bedford.',
    impactEn:
      'First major test of federal constitutional authority under the newly ratified U.S. Constitution.',
    impactEs:
      'Primera prueba histórica de la autoridad ejecutiva del Gobierno Federal bajo la Constitución de 1787.',
    countyName: 'Washington',
    coordinates: { lat: 40.174, lng: -80.2462, zoom: 10 },
  },
  {
    id: 'pol-gettysburg-1863',
    year: 1863,
    dateLabelEn: 'July 1–3 & Nov 19, 1863',
    dateLabelEs: '1–3 julio y 19 nov. de 1863',
    category: 'political',
    subcategory: 'wars_conflicts',
    eraId: '1861',
    titleEn: 'Battle of Gettysburg & Lincoln’s Gettysburg Address',
    titleEs: 'Batalla de Gettysburg y Discurso de Abraham Lincoln',
    shortTitleEn: 'Battle of Gettysburg',
    shortTitleEs: 'Batalla de Gettysburg',
    summaryEn:
      'Union forces under Pennsylvanian General George Gordon Meade repelled Robert E. Lee’s Confederate invasion in Adams County. Four months later, President Lincoln delivered the Gettysburg Address.',
    summaryEs:
      'El Ejército de la Unión al mando del general pensilvano George G. Meade detuvo la invasión confederada en el condado de Adams; en noviembre, Lincoln pronunció el inmortal Discurso de Gettysburg.',
    impactEn:
      'Preserved the Union at the "High Water Mark of the Confederacy" and redefined American democracy around human equality.',
    impactEs:
      'Salvó a la Unión en el punto culminante de la Guerra Civil y redefinió la democracia estadounidense.',
    countyName: 'Adams',
    coordinates: { lat: 39.8105, lng: -77.2341, zoom: 11 },
  },
  {
    id: 'pol-constitutions-1790-1968',
    year: 1968,
    dateLabelEn: '1790 · 1838 · 1874 · 1968',
    dateLabelEs: '1790 · 1838 · 1874 · 1968',
    category: 'political',
    subcategory: 'constitutional_reforms',
    eraId: 'present',
    titleEn: 'Evolution of Pennsylvania State Constitutions (1790–1968)',
    titleEs: 'Reformas Constitucionales de Pensilvania (1790, 1838, 1874 y 1968)',
    shortTitleEn: 'PA Constitutions',
    shortTitleEs: 'Constituciones Estatales',
    summaryEn:
      'Pennsylvania evolved through five constitutions: 1776 (unicameral revolutionary), 1790 (bicameral General Assembly & Governor), 1838 (popular election of judges), 1874 (Gilded Age anti-monopoly checks), and 1968 (modern home rule & unified judiciary).',
    summaryEs:
      'Pensilvania perfeccionó su arquitectura institucional a través de las Constituciones de 1790 (bicameralismo), 1838, 1874 (freno a monopolios ferroviarios) y la reforma moderna de 1968.',
    impactEn:
      'Added the Environmental Rights Amendment (Article I, Section 27) in 1971 guaranteeing every citizen the right to clean air and pure water.',
    impactEs:
      'Incorporó la histórica Enmienda de Derechos Ambientales (Art. I, Sec. 27) que garantiza aire limpio, agua pura y conservación del patrimonio.',
    countyName: 'Dauphin',
    coordinates: { lat: 40.2644, lng: -76.8836, zoom: 11 },
  },

  // =========================================================================
  // CATEGORY 2: GEOGRAPHIC & TERRITORIAL DATA (BORDERS & MAJOR CITIES)
  // =========================================================================
  {
    id: 'geo-three-counties-1682',
    year: 1682,
    dateLabelEn: '1682 · Original Borders',
    dateLabelEs: '1682 · 3 Condados Originales',
    category: 'geographic',
    subcategory: 'border_evolution',
    eraId: '1681',
    titleEn: 'William Penn’s 3 Original Counties: Philadelphia, Bucks & Chester',
    titleEs: 'Los 3 Condados Originales de Penn: Philadelphia, Bucks y Chester',
    shortTitleEn: '3 Original Counties',
    shortTitleEs: '3 Condados Originales',
    summaryEn:
      'In 1682, William Penn organized the colonized southeast along the Delaware River into three foundational counties—Philadelphia, Bucks, and Chester—from which all 67 modern counties would eventually be carved.',
    summaryEs:
      'En 1682, William Penn estructuró el territorio colonizado junto al río Delaware en tres condados matrices (Philadelphia, Bucks y Chester), semilla territorial de los 67 condados actuales.',
    impactEn:
      'Click "Locate on Map" to activate the Turf.js 1682 territorial union and inspect the original colonial boundaries.',
    impactEs:
      'Pulsa "Ubicar en el Mapa" para activar la fusión territorial Turf.js de 1682 sobre la cartografía.',
    countyName: 'Philadelphia',
    coordinates: { lat: 40.05, lng: -75.3, zoom: 8 },
    turfScenario: '1682',
  },
  {
    id: 'geo-city-philadelphia-1682',
    year: 1682,
    dateLabelEn: 'October 1682 · City Grid',
    dateLabelEs: 'Octubre de 1682 · Plan Urbano',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1681',
    titleEn: 'Foundation of Philadelphia (Thomas Holme’s Grid Plan)',
    titleEs: 'Fundación de Filadelfia (Plano Ortogonal de Thomas Holme)',
    shortTitleEn: 'Philadelphia Grid',
    shortTitleEs: 'Plano de Filadelfia',
    summaryEn:
      'Surveyed by Thomas Holme between the Delaware and Schuylkill rivers, Philadelphia was designed as a " Greene Country Towne" with five public squares and an orthogonal grid that inspired American urban planning.',
    summaryEs:
      'Trazada por el agrimensor Thomas Holme entre los ríos Delaware y Schuylkill con cinco plazas públicas arboladas, su cuadrícula ortogonal fue modelo para las ciudades de Norteamérica.',
    impactEn:
      'Became the largest city in British North America by 1770 and the birthplace of the United States.',
    impactEs:
      'Se convirtió en la mayor urbe de la América británica y primera capital de los Estados Unidos.',
    countyName: 'Philadelphia',
    coordinates: { lat: 39.9526, lng: -75.1652, zoom: 11 },
  },
  {
    id: 'geo-city-lancaster-york-1729',
    year: 1729,
    dateLabelEn: '1729 (Lancaster) · 1741 (York)',
    dateLabelEs: '1729 (Lancaster) · 1741 (York)',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1681',
    titleEn: 'Foundation of Lancaster (1729) & York (1741) in the Susquehanna Valley',
    titleEs: 'Fundación de Lancaster (1729) y York (1741) en el Valle del Susquehanna',
    shortTitleEn: 'Lancaster & York',
    shortTitleEs: 'Lancaster y York',
    summaryEn:
      'Lancaster (4th county, 1729) became the largest inland town in the Thirteen Colonies and hub of Pennsylvania Dutch agriculture and the Conestoga wagon; York (5th county, 1741) was the first town west of the Susquehanna.',
    summaryEs:
      'Lancaster (4.º condado, 1729) se consolidó como la mayor ciudad interior de las Trece Colonias y cuna del carromato Conestoga; York (1741) encabezó la expansión al oeste del río Susquehanna.',
    impactEn:
      'Both cities served as capitals during the American Revolution; Lancaster was State Capital of Pennsylvania from 1799 to 1812.',
    impactEs:
      'Ambas ciudades acogieron al Congreso Continental en 1777–1778; Lancaster fue capital estatal entre 1799 y 1812.',
    countyName: 'Lancaster',
    coordinates: { lat: 40.0379, lng: -76.3055, zoom: 10 },
  },
  {
    id: 'geo-city-reading-allentown-1748',
    year: 1748,
    dateLabelEn: '1748 (Reading) · 1762 (Allentown)',
    dateLabelEs: '1748 (Reading) · 1762 (Allentown)',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1681',
    titleEn: 'Foundation of Reading (1748) & Allentown (1762)',
    titleEs: 'Fundación de Reading (1748) y Allentown (1762)',
    shortTitleEn: 'Reading & Allentown',
    shortTitleEs: 'Reading y Allentown',
    summaryEn:
      'Reading was laid out in 1748 by Thomas and Richard Penn along the Schuylkill River (Berks County, 1752), while Chief Justice William Allen founded Allentown in 1762 along the Lehigh River (Lehigh County, 1812).',
    summaryEs:
      'Reading fue trazada en 1748 por los hijos de William Penn junto al río Schuylkill (sede de Berks), mientras William Allen fundó Allentown en 1762 en el corazón del valle de Lehigh.',
    impactEn:
      'Allentown hid the Liberty Bell in 1777, and Reading gave rise to the mighty Reading Railroad and early American ironworks.',
    impactEs:
      'Allentown resguardó la Campana de la Libertad en 1777 y Reading impulsó el histórico Ferrocarril de Reading.',
    countyName: 'Berks',
    coordinates: { lat: 40.3356, lng: -75.9269, zoom: 10 },
  },
  {
    id: 'geo-city-pittsburgh-1758',
    year: 1758,
    dateLabelEn: '1758 · Forks of the Ohio',
    dateLabelEs: '1758 · Confluencia del Ohio',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1776',
    titleEn: 'Foundation of Pittsburgh at the Golden Triangle',
    titleEs: 'Fundación de Pittsburgh en el Triángulo Dorado de los Tres Ríos',
    shortTitleEn: 'Pittsburgh Founded',
    shortTitleEs: 'Fundación de Pittsburgh',
    summaryEn:
      'Founded where the Allegheny and Monongahela rivers join to form the Ohio River, Pittsburgh grew from Fort Pitt into the "Gateway to the West" and the steel capital of the world.',
    summaryEs:
      'Situada en la unión de los ríos Allegheny y Monongahela que forman el río Ohio, Pittsburgh evolucionó desde el Fuerte Pitt hasta convertirse en la "Puerta del Oeste" y capital mundial del acero.',
    impactEn:
      'Seat of Allegheny County (created 1788) and western anchor of the Commonwealth.',
    impactEs:
      'Sede del condado de Allegheny (1788) y motor industrial y tecnológico del oeste de Pensilvania.',
    countyName: 'Allegheny',
    coordinates: { lat: 40.4406, lng: -79.9959, zoom: 11 },
  },
  {
    id: 'geo-mason-dixon-1767',
    year: 1767,
    dateLabelEn: '1763–1767 · Southern Border',
    dateLabelEs: '1763–1767 · Frontera Sur',
    category: 'geographic',
    subcategory: 'border_evolution',
    eraId: '1776',
    titleEn: 'Survey of the Mason–Dixon Line (Pennsylvania–Maryland Dispute)',
    titleEs: 'Trazado de la Línea Mason-Dixon (Resolución con Maryland)',
    shortTitleEn: 'Mason-Dixon Line',
    shortTitleEs: 'Línea Mason-Dixon',
    summaryEn:
      'English astronomers Charles Mason and Jeremiah Dixon surveyed the 233-mile southern boundary at 39°43′ N to end the 80-year border conflict between the Penn family of Pennsylvania and the Calvert family of Maryland.',
    summaryEs:
      'Los astrónomos Charles Mason y Jeremiah Dixon trazaron con precisión astronómica el paralelo 39°43′ N para resolver tras 80 años la disputa fronteriza entre los Penn y los Calvert de Maryland.',
    impactEn:
      'After Pennsylvania abolished slavery in 1780, the Mason–Dixon Line became the historic demarcation between free soil and slave states.',
    impactEs:
      'Tras la ley abolicionista de Pensilvania de 1780, la línea se convirtió en la frontera histórica entre los estados libres y esclavistas.',
    countyName: 'York',
    coordinates: { lat: 39.72, lng: -76.95, zoom: 9 },
  },
  {
    id: 'geo-wyoming-valley-1782',
    year: 1782,
    dateLabelEn: 'December 30, 1782',
    dateLabelEs: '30 de diciembre de 1782',
    category: 'geographic',
    subcategory: 'border_evolution',
    eraId: '1776',
    titleEn: 'Decree of Trenton: Resolution of the Yankee–Pennamite Wars',
    titleEs: 'Decreto de Trenton: Fin de la Disputa del Valle de Wyoming con Connecticut',
    shortTitleEn: 'Wyoming Valley Dispute',
    shortTitleEs: 'Disputa de Wyoming',
    summaryEn:
      'Connecticut claimed the entire northern third of Pennsylvania under its sea-to-sea charter, sparking the armed Yankee-Pennamite Wars in the Wyoming Valley. The federal Decree of Trenton awarded sovereignty to Pennsylvania.',
    summaryEs:
      'Connecticut reclamaba la franja norte de Pensilvania, desatando las Guerras Yanqui-Pennamitas en el Valle de Wyoming; el Decreto de Trenton de 1782 confirmó la soberanía de Pensilvania y creó el condado de Luzerne en 1786.',
    impactEn:
      'Secured the northern anthracite coal fields and led to the creation of Luzerne County (1786).',
    impactEs:
      'Aseguró para Pensilvania la rica cuenca de carbón antracita del noreste.',
    countyName: 'Luzerne',
    coordinates: { lat: 41.2459, lng: -75.8813, zoom: 10 },
  },
  {
    id: 'geo-city-harrisburg-1785',
    year: 1785,
    dateLabelEn: '1785 · Capital since 1812',
    dateLabelEs: '1785 · Capital desde 1812',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1776',
    titleEn: 'Foundation of Harrisburg & Designation as State Capital (1812)',
    titleEs: 'Fundación de Harrisburg y Designación como Capital Estatal (1812)',
    shortTitleEn: 'Harrisburg Capital',
    shortTitleEs: 'Capital Harrisburg',
    summaryEn:
      'Laid out by John Harris Jr. along the Susquehanna River in newly created Dauphin County (1785), Harrisburg became the permanent State Capital of Pennsylvania in October 1812 due to its central location.',
    summaryEs:
      'Fundada a orillas del río Susquehanna como sede del condado de Dauphin (1785), Harrisburg fue proclamada capital permanente del Estado de Pensilvania en 1812 por su posición estratégica central.',
    impactEn:
      'Became the nexus of the Pennsylvania Canal, the Pennsylvania Railroad, and the monumental 1906 State Capitol.',
    impactEs:
      'Nudo vital del Canal de Pensilvania, del Ferrocarril de Pensilvania y sede del Capitolio Estatal.',
    countyName: 'Dauphin',
    coordinates: { lat: 40.2732, lng: -76.8867, zoom: 11 },
  },
  {
    id: 'geo-erie-triangle-1792',
    year: 1792,
    dateLabelEn: 'March 3, 1792 · Erie (1795)',
    dateLabelEs: '3 de marzo de 1792 · Erie (1795)',
    category: 'geographic',
    subcategory: 'border_evolution',
    eraId: '1776',
    titleEn: 'Purchase of the Erie Triangle (1792) & Foundation of Erie (1795)',
    titleEs: 'Compra del Triángulo de Erie (1792) y Fundación del Puerto de Erie (1795)',
    shortTitleEn: 'Erie Triangle & Port',
    shortTitleEs: 'Triángulo y Puerto de Erie',
    summaryEn:
      'Pennsylvania purchased the 202,187-acre Erie Triangle from the U.S. government for $151,640.25 ($0.75/acre) in 1792 and surveyed the port city of Erie in 1795 on Presque Isle Bay.',
    summaryEs:
      'Pensilvania compró al Gobierno Federal los 202,187 acres del Triángulo de Erie en 1792 y trazó en 1795 la ciudad portuaria de Erie sobre los Grandes Lagos.',
    impactEn:
      'Gave Pennsylvania a vital Great Lakes port (Presque Isle), where Oliver Hazard Perry built his victorious fleet in the War of 1812.',
    impactEs:
      'Otorgó a Pensilvania salida marítima a los Grandes Lagos y el astillero naval de la Guerra de 1812.',
    countyName: 'Erie',
    coordinates: { lat: 42.1292, lng: -80.0851, zoom: 10 },
  },
  {
    id: 'geo-city-scranton-1856',
    year: 1856,
    dateLabelEn: '1856 · Electric City',
    dateLabelEs: '1856 · Ciudad Eléctrica',
    category: 'geographic',
    subcategory: 'city_foundations',
    eraId: '1861',
    titleEn: 'Foundation of Scranton: Anthracite & Iron Capital (1856)',
    titleEs: 'Fundación de Scranton: Capital de la Antracita y el Tranvía Eléctrico (1856)',
    shortTitleEn: 'Scranton Electric City',
    shortTitleEs: 'Scranton Ciudad Eléctrica',
    summaryEn:
      'Founded by the Scranton brothers around the Lackawanna Iron & Coal Company blast furnaces, Scranton became the "Electric City" in 1886 after inaugurating the first electric streetcar system in the United States.',
    summaryEs:
      'Desarrollada en torno a los altos hornos de la familia Scranton, se convirtió en la "Ciudad Eléctrica" de EE. UU. al inaugurar en 1886 la primera red de tranvías eléctricos del país.',
    impactEn:
      'Catalyzed the creation of Lackawanna County in 1878 as its county seat.',
    impactEs:
      'Impulsó la creación del condado 67 (Lackawanna) en 1878 como su sede condal.',
    countyName: 'Lackawanna',
    coordinates: { lat: 41.409, lng: -75.6624, zoom: 11 },
  },
  {
    id: 'geo-67-counties-lackawanna-1878',
    year: 1878,
    dateLabelEn: 'August 13, 1878',
    dateLabelEs: '13 de agosto de 1878',
    category: 'geographic',
    subcategory: 'border_evolution',
    eraId: '1870',
    titleEn: 'Lackawanna County Created as Pennsylvania’s 67th & Final County',
    titleEs: 'Creación de Lackawanna (1878): Se Completan los 67 Condados Actuales',
    shortTitleEn: '67th County: Lackawanna',
    shortTitleEs: 'Condado 67: Lackawanna',
    summaryEn:
      'Driven by the rapid growth of Scranton (incorporated 1856/1866) as the anthracite coal and electric streetcar capital, voters approved carving Lackawanna County out of northern Luzerne County on August 13, 1878.',
    summaryEs:
      'Impulsado por el auge industrial de Scranton en el valle de Lackawanna, el 13 de agosto de 1878 se separó del norte de Luzerne para constituir el condado número 67 y último de Pensilvania.',
    impactEn:
      'Locked in the modern 67-county cartographic map of Pennsylvania that endures to the present day.',
    impactEs:
      'Cerró definitivamente el mapa político-administrativo de los 67 condados de Pensilvania.',
    countyName: 'Lackawanna',
    coordinates: { lat: 41.409, lng: -75.6624, zoom: 10 },
    turfScenario: 'none',
  },

  // =========================================================================
  // CATEGORY 3: STATISTICAL & TIME-SERIES DATA (DEMOGRAPHIC, ECONOMIC, SOCIAL)
  // =========================================================================
  {
    id: 'stat-abolition-act-1780',
    year: 1780,
    dateLabelEn: 'March 1, 1780',
    dateLabelEs: '1 de marzo de 1780',
    category: 'statistical',
    subcategory: 'social_development',
    eraId: '1776',
    titleEn: 'First Gradual Abolition of Slavery Act in the United States',
    titleEs: 'Primera Ley de Abolición Gradual de la Esclavitud en EE. UU. (1780)',
    shortTitleEn: 'Gradual Abolition',
    shortTitleEs: 'Abolición Gradual',
    summaryEn:
      'Enacted by the Pennsylvania General Assembly on March 1, 1780 amidst the Revolutionary War, it was the first legislative abolition law in the Western Hemisphere, making Pennsylvania a beacon of the Underground Railroad.',
    summaryEs:
      'Promulgada por la Asamblea General de Pensilvania el 1 de marzo de 1780, fue la primera ley abolicionista aprobada por una legislatura democrática en la historia moderna.',
    impactEn:
      'Reduced the enslaved population in PA from 3,737 in 1790 to near zero while growing the free Black civic community in Philadelphia, Lancaster, and Pittsburgh.',
    impactEs:
      'Convirtió a Pensilvania en el corredor central del Ferrocarril Subterráneo hacia la libertad.',
    countyName: 'Philadelphia',
    seriesTitleEn: 'Decline of Enslaved Population in PA (U.S. Census 1790–1850)',
    seriesTitleEs: 'Reducción de Población Esclavizada en PA (Censos 1790–1850)',
    seriesUnitEn: 'enslaved persons',
    seriesUnitEs: 'personas esclavizadas',
    seriesData: [
      { period: '1790', value: 3737, unitEn: 'persons', unitEs: 'personas' },
      { period: '1800', value: 1706, unitEn: 'persons', unitEs: 'personas' },
      { period: '1810', value: 795, unitEn: 'persons', unitEs: 'personas' },
      { period: '1820', value: 211, unitEn: 'persons', unitEs: 'personas' },
      { period: '1830', value: 67, unitEn: 'persons', unitEs: 'personas' },
      { period: '1840', value: 0, unitEn: 'persons', unitEs: 'personas' },
    ],
  },
  {
    id: 'stat-census-growth-1790-present',
    year: 1790,
    dateLabelEn: '1790 – Present (Decennial)',
    dateLabelEs: '1790 – Presente (Decenal)',
    category: 'statistical',
    subcategory: 'demographic_evolution',
    eraId: 'present',
    titleEn: 'Pennsylvania Decennial Population Growth (434k to 13.0 Million)',
    titleEs: 'Evolución Demográfica de Pensilvania (1790–Presente: 434 mil a 13 M)',
    shortTitleEn: 'Census Series',
    shortTitleEs: 'Serie Censal',
    summaryEn:
      'From 434,373 residents in the First U.S. Census of 1790, Pennsylvania surged through European immigration to its coal mines and steel mills (1880–1920) and the Great Migration, reaching 13.0 million residents today.',
    summaryEs:
      'Desde 434,373 habitantes en el Primer Censo Federal de 1790, Pensilvania creció exponencialmente con las olas migratorias hacia minas y acerías (1880–1920) hasta superar los 13 millones de habitantes.',
    impactEn:
      'Ranked as the 2nd most populous U.S. state from 1790 until 1950, and remains the 5th most populous state today.',
    impactEs:
      'Fue el 2.º estado más poblado de EE. UU. durante 160 años consecutivos (1790–1950).',
    countyName: 'Philadelphia',
    seriesTitleEn: 'Total Commonwealth Population (in Millions)',
    seriesTitleEs: 'Población Total de Pensilvania (en Millones)',
    seriesUnitEn: 'M residents',
    seriesUnitEs: 'M hab.',
    seriesData: [
      { period: '1790', value: 0.43, unitEn: 'M', unitEs: 'M' },
      { period: '1830', value: 1.35, unitEn: 'M', unitEs: 'M' },
      { period: '1870', value: 3.52, unitEn: 'M', unitEs: 'M' },
      { period: '1910', value: 7.66, unitEn: 'M', unitEs: 'M' },
      { period: '1950', value: 10.5, unitEn: 'M', unitEs: 'M' },
      { period: '1990', value: 11.88, unitEn: 'M', unitEs: 'M' },
      { period: '2020+', value: 13.0, unitEn: 'M', unitEs: 'M' },
    ],
  },
  {
    id: 'stat-public-schools-1834',
    year: 1834,
    dateLabelEn: 'April 1, 1834',
    dateLabelEs: '1 de abril de 1834',
    category: 'statistical',
    subcategory: 'social_development',
    eraId: '1861',
    titleEn: 'Free Public School Act of 1834 (Thaddeus Stevens’ Defense)',
    titleEs: 'Ley de Escuelas Públicas Gratuitas de 1834 (Defensa de Thaddeus Stevens)',
    shortTitleEn: 'Free Schools Act',
    shortTitleEs: 'Escuelas Públicas',
    summaryEn:
      'Signed by Governor George Wolf and heroically defended against repeal in 1835 by Representative Thaddeus Stevens, this law created universal, tax-supported public education across all Pennsylvania counties.',
    summaryEs:
      'Promulgada en 1834 y defendida ante la legislatura en 1835 por el discurso histórico de Thaddeus Stevens, instauró la educación pública universal y gratuita en los condados de Pensilvania.',
    impactEn:
      'Expanded literacy past 95% and laid the foundation for the Pennsylvania State System of Higher Education and Penn State (1855).',
    impactEs:
      'Multiplicó las escuelas públicas de menos de 800 en 1835 a más de 11,000 en 1860 y elevó la alfabetización estatal.',
    countyName: 'Adams',
    seriesTitleEn: 'Public School Enrollment in PA (in Thousands)',
    seriesTitleEs: 'Matrícula en Escuelas Públicas de PA (en Miles)',
    seriesUnitEn: 'k students',
    seriesUnitEs: 'mil alumnos',
    seriesData: [
      { period: '1835', value: 32, unitEn: 'k', unitEs: 'mil' },
      { period: '1845', value: 327, unitEn: 'k', unitEs: 'mil' },
      { period: '1860', value: 647, unitEn: 'k', unitEs: 'mil' },
      { period: '1880', value: 937, unitEn: 'k', unitEs: 'mil' },
      { period: '1910', value: 1282, unitEn: 'k', unitEs: 'mil' },
      { period: 'Present', value: 1700, unitEn: 'k', unitEs: 'mil' },
    ],
  },
  {
    id: 'stat-oil-coal-steel-1859-1920',
    year: 1859,
    dateLabelEn: '1859 – 1920 · Industrial Boom',
    dateLabelEs: '1859 – 1920 · Auge Industrial',
    category: 'statistical',
    subcategory: 'economic_indicators',
    eraId: '1870',
    titleEn: 'Titusville Oil Boom (1859), Anthracite Peak & Pittsburgh Steel',
    titleEs: 'Auge del Petróleo (1859), Carbón Antracita y Acero de Pittsburgh',
    shortTitleEn: 'Coal, Oil & Steel',
    shortTitleEs: 'Carbón, Petróleo y Acero',
    summaryEn:
      'Edwin Drake’s 1859 Titusville well birthed the global petroleum industry; northeastern mines produced 99% of America’s anthracite coal (peaking at 100 million tons in 1917); and Pittsburgh produced 60% of U.S. steel.',
    summaryEs:
      'El pozo de Edwin Drake en Titusville (1859) inauguró la era mundial del petróleo, mientras el noreste extraía 100 millones de toneladas anuales de antracita (1917) y Pittsburgh producía el 60% del acero de EE. UU.',
    impactEn:
      'Made the Pennsylvania Railroad the largest corporation in the world and fueled America’s rise as an industrial superpower.',
    impactEs:
      'Convirtió a Pensilvania en el motor energético y siderúrgico mundial durante la Segunda Revolución Industrial.',
    countyName: 'Crawford',
    coordinates: { lat: 41.612, lng: -79.6584, zoom: 10 },
    seriesTitleEn: 'PA Anthracite Coal Production (Million Tons/Yr)',
    seriesTitleEs: 'Producción de Carbón Antracita en PA (Millones Ton/Año)',
    seriesUnitEn: 'M tons',
    seriesUnitEs: 'M ton.',
    seriesData: [
      { period: '1830', value: 0.2, unitEn: 'M tons', unitEs: 'M ton' },
      { period: '1860', value: 10.9, unitEn: 'M tons', unitEs: 'M ton' },
      { period: '1890', value: 46.4, unitEn: 'M tons', unitEs: 'M ton' },
      { period: '1917', value: 99.6, unitEn: 'M tons', unitEs: 'M ton' },
      { period: '1950', value: 44.1, unitEn: 'M tons', unitEs: 'M ton' },
      { period: '1990', value: 3.5, unitEn: 'M tons', unitEs: 'M ton' },
    ],
  },
  {
    id: 'stat-womens-suffrage-1915',
    year: 1915,
    dateLabelEn: '1915 – June 24, 1919',
    dateLabelEs: '1915 – 24 de junio de 1919',
    category: 'statistical',
    subcategory: 'social_development',
    eraId: '1870',
    titleEn: 'Justice Bell Tour (67 Counties) & Ratification of the 19th Amendment',
    titleEs: 'Gira de la Campana de la Justicia (67 Condados) y Sufragio Femenino',
    shortTitleEn: "Women's Suffrage",
    shortTitleEs: 'Sufragio Femenino',
    summaryEn:
      'Suffragist Katharine Wentworth Ruschenberger commissioned the 2,000-pound bronze "Justice Bell" with its clapper chained silent until women won the vote, touring 5,000 miles across all 67 Pennsylvania counties in 1915.',
    summaryEs:
      'Las sufragistas de Pensilvania fundieron la "Campana de la Justicia" con su badajo encadenado y recorrieron 5,000 millas por los 67 condados en 1915; Pensilvania fue el 7.º estado en ratificar la 19.ª Enmienda en 1919.',
    impactEn:
      'Doubled the electorate of the Commonwealth and rang triumphantly at Independence Square in September 1920.',
    impactEs:
      'Duplicó el padrón electoral democrático y repicó en libertad en Independence Square en 1920.',
    countyName: 'Chester',
    coordinates: { lat: 40.0997, lng: -75.4469, zoom: 10 },
    seriesTitleEn: 'Share of Eligible Citizens Enfranchised in PA (%)',
    seriesTitleEs: '% de Ciudadanos Adultos con Derecho a Voto en PA',
    seriesUnitEn: '% voters',
    seriesUnitEs: '% padrón',
    seriesData: [
      { period: '1776', value: 42, unitEn: '%', unitEs: '%' },
      { period: '1838', value: 46, unitEn: '%', unitEs: '%' },
      { period: '1870', value: 49, unitEn: '%', unitEs: '%' },
      { period: '1920', value: 96, unitEn: '%', unitEs: '%' },
      { period: '1971', value: 100, unitEn: '%', unitEs: '%' },
    ],
  },
  {
    id: 'stat-gdp-modern-transition-1970-present',
    year: 1995,
    dateLabelEn: '1970 – Present · Economic Shift',
    dateLabelEs: '1970 – Actualidad · Reconversión',
    category: 'statistical',
    subcategory: 'economic_indicators',
    eraId: 'present',
    titleEn: 'Rust Belt Transformation to $965B Eds, Meds & Tech Economy',
    titleEs: 'Reconversión Económica: Del Acero a Biotecnología, Salud e IA ($965 mil M)',
    shortTitleEn: 'Modern GDP & Tech Shift',
    shortTitleEs: 'PIB y Reconversión Actual',
    summaryEn:
      'Following the 1970s–1980s steel restructuring, Pennsylvania reinvented its economy around world-class universities, healthcare systems (UPMC, Penn Medicine), robotics, logistics, and clean energy, reaching nearly $1 Trillion in state GDP.',
    summaryEs:
      'Tras la crisis siderúrgica de los años 70 y 80, Pensilvania protagonizó una reconversión ejemplar hacia medicina universitaria, robótica, biotecnología, energía y logística, rozando el billón de dólares de PIB estatal.',
    impactEn:
      'Service, technology, healthcare, and education sectors now generate over 72% of Pennsylvania’s gross state product.',
    impactEs:
      'Los sectores de salud, educación superior, tecnología y servicios representan hoy más del 72% del PIB de Pensilvania.',
    countyName: 'Allegheny',
    seriesTitleEn: 'Pennsylvania Gross State Product (Nominal USD Billions)',
    seriesTitleEs: 'Producto Interno Bruto de Pensilvania (Miles de Millones USD)',
    seriesUnitEn: '$B GDP',
    seriesUnitEs: 'mil M USD',
    seriesData: [
      { period: '1970', value: 53, unitEn: '$B', unitEs: 'mil M$' },
      { period: '1985', value: 182, unitEn: '$B', unitEs: 'mil M$' },
      { period: '2000', value: 407, unitEn: '$B', unitEs: 'mil M$' },
      { period: '2010', value: 598, unitEn: '$B', unitEs: 'mil M$' },
      { period: '2020', value: 795, unitEn: '$B', unitEs: 'mil M$' },
      { period: 'Present', value: 965, unitEn: '$B', unitEs: 'mil M$' },
    ],
  },
];
