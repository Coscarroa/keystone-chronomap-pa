export type HistoricalScenarioId = '1682' | '1787';

export interface HistoricalTerritoryDefinition {
  id: string;
  name: string;
  historicalTitle: string;
  founded: string;
  seatOrCenter: string;
  category: 'colonial_county' | 'indigenous_territory' | 'constitutional_county';
  fillColor: string;
  hoverFillColor: string;
  strokeColor: string;
  modernCounties: string[];
  historicalSummary: string;
  subdivisionStory: string;
}

export interface HistoricalScenarioConfig {
  id: HistoricalScenarioId;
  title: string;
  shortTitle: string;
  year: number;
  subtitle: string;
  description: string;
  territories: HistoricalTerritoryDefinition[];
}

/**
 * Escenario A (1682): Los 3 Condados Originales de William Penn y Territorios Indígenas
 */
export const SCENARIO_1682_TERRITORIES: HistoricalTerritoryDefinition[] = [
  {
    id: '1682-philadelphia',
    name: 'Philadelphia County (Original)',
    historicalTitle: 'Condado Original de Philadelphia (1682)',
    founded: '1682',
    seatOrCenter: 'Philadelphia (Shackamaxon)',
    category: 'colonial_county',
    fillColor: '#1D3557',
    hoverFillColor: '#2B4C7E',
    strokeColor: '#D4AF37',
    modernCounties: ['Philadelphia', 'Montgomery', 'Berks'],
    historicalSummary:
      'Establecido por William Penn en noviembre de 1682 entre los ríos Delaware y Schuylkill, extendiéndose hacia el interior noroeste sin frontera occidental definida.',
    subdivisionStory:
      'De su expansión por el valle del Schuylkill se escindieron Berks County (1752) y Montgomery County (1784).',
  },
  {
    id: '1682-bucks',
    name: 'Bucks County (Original)',
    historicalTitle: 'Condado Original de Bucks (1682)',
    founded: '1682',
    seatOrCenter: 'Bristol / Newtown (actual Doylestown)',
    category: 'colonial_county',
    fillColor: '#2A4B6C',
    hoverFillColor: '#3A6690',
    strokeColor: '#D4AF37',
    modernCounties: [
      'Bucks',
      'Northampton',
      'Lehigh',
      'Monroe',
      'Pike',
      'Carbon',
      'Wayne',
    ],
    historicalSummary:
      'Bautizado por William Penn en honor a Buckinghamshire, abarcaba toda la ribera oriental del río Delaware y se proyectaba hacia el valle de Lehigh y los montes Poconos.',
    subdivisionStory:
      'En 1752 su vasto norte se convirtió en Northampton County, del cual luego nacieron Wayne (1798), Lehigh (1812), Pike (1814), Monroe (1836) y Carbon (1843).',
  },
  {
    id: '1682-chester',
    name: 'Chester County (Original)',
    historicalTitle: 'Condado Original de Chester (1682)',
    founded: '1682',
    seatOrCenter: 'Chester (Upland) / West Chester',
    category: 'colonial_county',
    fillColor: '#3D5A80',
    hoverFillColor: '#5073A0',
    strokeColor: '#D4AF37',
    modernCounties: ['Chester', 'Delaware', 'Lancaster'],
    historicalSummary:
      'Tercer condado fundacional de 1682, situado al suroeste del río Schuylkill y extendido inicialmente hasta las riberas del río Susquehanna.',
    subdivisionStory:
      'En 1729 su frontera occidental dio origen a Lancaster County (madre de decenas de condados interiores) y en 1789 su sector ribereño formó Delaware County.',
  },
  {
    id: '1682-lenape-munsee',
    name: 'Territorio Ancestral Lenape (Lenni-Lenape & Munsee)',
    historicalTitle: 'Nación Lenape / Delaware — Valle de Wyoming y Rama Norte',
    founded: 'Ancestral',
    seatOrCenter: 'M\'chewamisipu (Valle de Wyoming)',
    category: 'indigenous_territory',
    fillColor: '#3B4D3E',
    hoverFillColor: '#4E6652',
    strokeColor: '#C5A059',
    modernCounties: [
      'Luzerne',
      'Lackawanna',
      'Wyoming',
      'Susquehanna',
      'Sullivan',
      'Columbia',
      'Montour',
      'Schuylkill',
    ],
    historicalSummary:
      'Tierras ancestrales de los clanes Lenape Unami y Munsee en las cuencas altas del Delaware, Schuylkill y el brazo norte del Susquehanna.',
    subdivisionStory:
      'Incorporado progresivamente mediante tratados del siglo XVIII, dando paso a Luzerne (1786), Schuylkill (1811), Columbia (1813) y finalmente Lackawanna (1878).',
  },
  {
    id: '1682-susquehannock',
    name: 'Territorio Ancestral Susquehannock (Conestoga)',
    historicalTitle: 'Nación Susquehannock — Cuenca Central del Susquehanna y Juniata',
    founded: 'Ancestral',
    seatOrCenter: 'Conestoga / Shamokin (Sunbury)',
    category: 'indigenous_territory',
    fillColor: '#6B4E23',
    hoverFillColor: '#8A652E',
    strokeColor: '#C5A059',
    modernCounties: [
      'York',
      'Adams',
      'Cumberland',
      'Franklin',
      'Dauphin',
      'Lebanon',
      'Perry',
      'Juniata',
      'Mifflin',
      'Snyder',
      'Union',
      'Northumberland',
      'Centre',
      'Huntingdon',
      'Bedford',
      'Fulton',
      'Blair',
    ],
    historicalSummary:
      'Corazón fluvial de los pueblos de lengua iroquesa Susquehannock (Andaste) y rutas diplomáticas centradas en Shamokin en la confluencia del río Susquehanna.',
    subdivisionStory:
      'Tras los tratados de 1736–1768 se organizaron aquí York (1749), Cumberland (1750), Bedford (1771), Northumberland (1772), Dauphin (1785) y sus condados derivados.',
  },
  {
    id: '1682-haudenosaunee-ohio',
    name: 'Territorio Haudenosaunee (Séneca), Shawnee y Monongahela',
    historicalTitle: 'Confederación Haudenosaunee, Shawnee y Cuenca del Ohio',
    founded: 'Ancestral',
    seatOrCenter: 'Forks of the Ohio / Kittanning / Venango',
    category: 'indigenous_territory',
    fillColor: '#6A2629',
    hoverFillColor: '#8C3236',
    strokeColor: '#C5A059',
    modernCounties: [
      'Bradford',
      'Tioga',
      'Lycoming',
      'Clinton',
      'Potter',
      'Cameron',
      'McKean',
      'Elk',
      'Clearfield',
      'Jefferson',
      'Forest',
      'Warren',
      'Erie',
      'Crawford',
      'Venango',
      'Mercer',
      'Clarion',
      'Indiana',
      'Cambria',
      'Somerset',
      'Westmoreland',
      'Armstrong',
      'Butler',
      'Lawrence',
      'Beaver',
      'Allegheny',
      'Washington',
      'Fayette',
      'Greene',
    ],
    historicalSummary:
      'Vasto dominio occidental de bosques apalaches y los tres ríos (Allegheny, Monongahela y Ohio), custodiado por la Nación Séneca (Haudenosaunee) y pueblos Shawnee.',
    subdivisionStory:
      'Tras los Tratados de Fort Stanwix (1768 y 1784) y la compra del Triángulo de Erie (1792), se subdividió en más de 25 condados occidentales y norteños en 1800–1860.',
  },
];

/**
 * Escenario B (1787): Pensilvania al Ratificar la Constitución de EE. UU. (18 Condados)
 */
export const SCENARIO_1787_TERRITORIES: HistoricalTerritoryDefinition[] = [
  {
    id: '1787-philadelphia',
    name: 'Philadelphia County (1787)',
    historicalTitle: 'Condado de Philadelphia (Fundado en 1682)',
    founded: '1682',
    seatOrCenter: 'Philadelphia',
    category: 'constitutional_county',
    fillColor: '#1D3557',
    hoverFillColor: '#2B4C7E',
    strokeColor: '#D4AF37',
    modernCounties: ['Philadelphia'],
    historicalSummary:
      'Sede de la Convención Constitucional de mayo–septiembre de 1787. En 1784 ya había cedido su sector rural noroccidental para crear Montgomery County.',
    subdivisionStory:
      'Mantuvo sus límites de 1784 y en 1854 consolidó todos sus municipios dentro de la Ciudad de Filadelfia.',
  },
  {
    id: '1787-bucks',
    name: 'Bucks County (1787)',
    historicalTitle: 'Condado de Bucks (Fundado en 1682)',
    founded: '1682',
    seatOrCenter: 'Newtown (Doylestown desde 1812)',
    category: 'constitutional_county',
    fillColor: '#27466E',
    hoverFillColor: '#365F94',
    strokeColor: '#D4AF37',
    modernCounties: ['Bucks'],
    historicalSummary:
      'En 1787 ya poseía sus fronteras definitivas actuales tras la escisión de Northampton County en 1752.',
    subdivisionStory:
      'Conserva intactas sus fronteras históricas desde 1752 hasta los 67 condados actuales.',
  },
  {
    id: '1787-chester',
    name: 'Chester County (1787)',
    historicalTitle: 'Condado de Chester (Fundado en 1682)',
    founded: '1682',
    seatOrCenter: 'West Chester (trasladada desde Chester en 1786)',
    category: 'constitutional_county',
    fillColor: '#31547B',
    hoverFillColor: '#4370A1',
    strokeColor: '#D4AF37',
    modernCounties: ['Chester', 'Delaware'],
    historicalSummary:
      'En 1787 aún abarcaba la ribera del río Delaware hasta que el traslado de la sede a West Chester impulsó la división.',
    subdivisionStory:
      'Dos años después de la Constitución, en septiembre de 1789, su tercio oriental se separó para formar Delaware County.',
  },
  {
    id: '1787-lancaster',
    name: 'Lancaster County (1787)',
    historicalTitle: 'Condado de Lancaster (Fundado en 1729)',
    founded: '1729',
    seatOrCenter: 'Lancaster',
    category: 'constitutional_county',
    fillColor: '#7A5928',
    hoverFillColor: '#9C7336',
    strokeColor: '#D4AF37',
    modernCounties: ['Lancaster'],
    historicalSummary:
      'Tras haber dado origen a York, Cumberland, Berks, Northumberland y Dauphin (1785), en 1787 Lancaster ya tenía su contorno actual.',
    subdivisionStory:
      'Sus fronteras de 1785 permanecen idénticas en la división política moderna.',
  },
  {
    id: '1787-york',
    name: 'York County (1787)',
    historicalTitle: 'Condado de York (Fundado en 1749)',
    founded: '1749',
    seatOrCenter: 'York',
    category: 'constitutional_county',
    fillColor: '#694B20',
    hoverFillColor: '#8B642C',
    strokeColor: '#D4AF37',
    modernCounties: ['York', 'Adams'],
    historicalSummary:
      'Abarcaba toda la franja meridional entre el río Susquehanna y las montañas de South Mountain.',
    subdivisionStory:
      'En el año 1800, debido a las diferencias políticas entre federalistas del oeste y demócrata-republicanos del este, su mitad occidental se escindió como Adams County (Gettysburg).',
  },
  {
    id: '1787-cumberland',
    name: 'Cumberland County (1787)',
    historicalTitle: 'Condado de Cumberland (Fundado en 1750)',
    founded: '1750',
    seatOrCenter: 'Carlisle',
    category: 'constitutional_county',
    fillColor: '#5B401B',
    hoverFillColor: '#7D5826',
    strokeColor: '#D4AF37',
    modernCounties: ['Cumberland', 'Perry', 'Juniata', 'Mifflin'],
    historicalSummary:
      'En 1787 comprendía el valle de Cumberland y los valles montañosos del río Juniata al norte de Blue Mountain.',
    subdivisionStory:
      'Se subdividió posteriormente en Mifflin County (1789), Perry County (1820) y Juniata County (1831).',
  },
  {
    id: '1787-berks',
    name: 'Berks County (1787)',
    historicalTitle: 'Condado de Berks (Fundado en 1752)',
    founded: '1752',
    seatOrCenter: 'Reading',
    category: 'constitutional_county',
    fillColor: '#735329',
    hoverFillColor: '#946B36',
    strokeColor: '#D4AF37',
    modernCounties: ['Berks', 'Schuylkill'],
    historicalSummary:
      'Se extendía desde el valle agrícola de Reading hasta las montañas carboníferas de la cuenca de antracita.',
    subdivisionStory:
      'En 1811 sus municipios montañosos del norte se separaron para constituir Schuylkill County.',
  },
  {
    id: '1787-northampton',
    name: 'Northampton County (1787)',
    historicalTitle: 'Condado de Northampton (Fundado en 1752)',
    founded: '1752',
    seatOrCenter: 'Easton',
    category: 'constitutional_county',
    fillColor: '#2A4747',
    hoverFillColor: '#3B6363',
    strokeColor: '#D4AF37',
    modernCounties: [
      'Northampton',
      'Lehigh',
      'Carbon',
      'Monroe',
      'Pike',
      'Wayne',
    ],
    historicalSummary:
      'En 1787 dominaba todo el cuadrante noreste del río Delaware, desde el valle de Lehigh hasta la frontera con el estado de Nueva York.',
    subdivisionStory:
      'El crecimiento demográfico y los canales de antracita lo fragmentaron en 6 condados actuales: Wayne (1798), Lehigh (1812), Pike (1814), Monroe (1836), Carbon (1843) y Northampton.',
  },
  {
    id: '1787-bedford',
    name: 'Bedford County (1787)',
    historicalTitle: 'Condado de Bedford (Fundado en 1771)',
    founded: '1771',
    seatOrCenter: 'Bedford',
    category: 'constitutional_county',
    fillColor: '#5C2C35',
    hoverFillColor: '#7D3C48',
    strokeColor: '#D4AF37',
    modernCounties: ['Bedford', 'Somerset', 'Cambria', 'Fulton'],
    historicalSummary:
      'Bastión de los Alleghenies meridionales tras haber cedido Westmoreland (1773) y Huntingdon (septiembre de 1787).',
    subdivisionStory:
      'Dio origen a Somerset County (1795), parte de Cambria County (1804) y finalmente Fulton County (1850).',
  },
  {
    id: '1787-northumberland',
    name: 'Northumberland County (1787)',
    historicalTitle: 'Condado de Northumberland (Fundado en 1772)',
    founded: '1772',
    seatOrCenter: 'Sunbury',
    category: 'constitutional_county',
    fillColor: '#4A3B2C',
    hoverFillColor: '#66513C',
    strokeColor: '#D4AF37',
    modernCounties: [
      'Northumberland',
      'Union',
      'Snyder',
      'Columbia',
      'Montour',
      'Lycoming',
      'Clinton',
      'Tioga',
      'Potter',
      'McKean',
      'Cameron',
      'Elk',
      'Clearfield',
      'Centre',
      'Sullivan',
      'Warren',
      'Forest',
      'Jefferson',
    ],
    historicalSummary:
      'Conocido como la "Madre de los Condados del Norte", en 1787 abarcaba casi un tercio de Pensilvania, incluyendo las tierras adquiridas en el segundo Tratado de Fort Stanwix (1784).',
    subdivisionStory:
      'De su inmenso territorio boscoso se escindieron Lycoming (1795), Centre (1800), Warren (1800), Clearfield, Jefferson, McKean, Potter y Tioga (1804), Union y Columbia (1813), Clinton (1839), Elk (1843), Sullivan (1847), Forest (1848), Montour (1850), Snyder (1855) y Cameron (1860).',
  },
  {
    id: '1787-westmoreland',
    name: 'Westmoreland County (1787)',
    historicalTitle: 'Condado de Westmoreland (Fundado en 1773)',
    founded: '1773',
    seatOrCenter: 'Greensburg (Hannastown hasta 1786)',
    category: 'constitutional_county',
    fillColor: '#782226',
    hoverFillColor: '#9B2226',
    strokeColor: '#D4AF37',
    modernCounties: [
      'Westmoreland',
      'Allegheny',
      'Armstrong',
      'Indiana',
      'Butler',
      'Clarion',
      'Mercer',
      'Venango',
      'Crawford',
      'Erie',
    ],
    historicalSummary:
      'Primer condado al oeste de los Montes Alleghenies; en diciembre de 1787 administraba Pittsburgh y las tierras de compensación militar (Depreciation & Donation Lands) del noroeste.',
    subdivisionStory:
      'En septiembre de 1788 se escindió Allegheny County, seguido en el año 1800 por la gran oleada organizativa del noroeste: Butler, Mercer, Venango, Crawford, Erie y Armstrong, además de Indiana (1803) y Clarion (1839).',
  },
  {
    id: '1787-washington',
    name: 'Washington County (1787)',
    historicalTitle: 'Condado de Washington (Fundado en 1781)',
    founded: '1781',
    seatOrCenter: 'Washington (Catfish Camp)',
    category: 'constitutional_county',
    fillColor: '#661D20',
    hoverFillColor: '#8A282C',
    strokeColor: '#D4AF37',
    modernCounties: ['Washington', 'Greene', 'Beaver', 'Lawrence'],
    historicalSummary:
      'Cubría el extremo suroccidental de Pensilvania desde el río Monongahela hasta la frontera con Virginia (actual West Virginia) y Ohio.',
    subdivisionStory:
      'En 1788 cedió parte de su norte a Allegheny, en 1796 su sur formó Greene County, en 1800 Beaver County y en 1849 Lawrence County.',
  },
  {
    id: '1787-fayette',
    name: 'Fayette County (1787)',
    historicalTitle: 'Condado de Fayette (Fundado en 1783)',
    founded: '1783',
    seatOrCenter: 'Uniontown',
    category: 'constitutional_county',
    fillColor: '#54181B',
    hoverFillColor: '#752226',
    strokeColor: '#D4AF37',
    modernCounties: ['Fayette'],
    historicalSummary:
      'Formado a partir de Westmoreland en 1783 en torno al paso de montaña de Nemacolin y el río Youghiogheny.',
    subdivisionStory:
      'Sus límites de 1783 se mantuvieron prácticamente inalterados hasta la actualidad.',
  },
  {
    id: '1787-franklin',
    name: 'Franklin County (1787)',
    historicalTitle: 'Condado de Franklin (Fundado en 1784)',
    founded: '1784',
    seatOrCenter: 'Chambersburg',
    category: 'constitutional_county',
    fillColor: '#6E4F26',
    hoverFillColor: '#8F6732',
    strokeColor: '#D4AF37',
    modernCounties: ['Franklin'],
    historicalSummary:
      'Separado de la porción suroccidental del valle de Cumberland en septiembre de 1784.',
    subdivisionStory:
      'Conserva sus límites históricos de finales del siglo XVIII.',
  },
  {
    id: '1787-montgomery',
    name: 'Montgomery County (1787)',
    historicalTitle: 'Condado de Montgomery (Fundado en 1784)',
    founded: '1784',
    seatOrCenter: 'Norristown',
    category: 'constitutional_county',
    fillColor: '#243F63',
    hoverFillColor: '#325787',
    strokeColor: '#D4AF37',
    modernCounties: ['Montgomery'],
    historicalSummary:
      'Creado el 10 de septiembre de 1784 a partir del sector rural de Philadelphia County.',
    subdivisionStory:
      'Sus fronteras permanecen estables desde su creación en 1784.',
  },
  {
    id: '1787-dauphin',
    name: 'Dauphin County (1787)',
    historicalTitle: 'Condado de Dauphin (Fundado en 1785)',
    founded: '1785',
    seatOrCenter: 'Harrisburg (Louisbourg)',
    category: 'constitutional_county',
    fillColor: '#805E2C',
    hoverFillColor: '#A17738',
    strokeColor: '#D4AF37',
    modernCounties: ['Dauphin', 'Lebanon'],
    historicalSummary:
      'Escindido de Lancaster en 1785 en torno al paso de John Harris en el río Susquehanna.',
    subdivisionStory:
      'En 1813 su próspera mitad oriental se separó para formar Lebanon County.',
  },
  {
    id: '1787-luzerne',
    name: 'Luzerne County (1787)',
    historicalTitle: 'Condado de Luzerne (Fundado en 1786)',
    founded: '1786',
    seatOrCenter: 'Wilkes-Barre',
    category: 'constitutional_county',
    fillColor: '#2E5252',
    hoverFillColor: '#3E6E6E',
    strokeColor: '#D4AF37',
    modernCounties: [
      'Luzerne',
      'Lackawanna',
      'Wyoming',
      'Susquehanna',
      'Bradford',
    ],
    historicalSummary:
      'Creado en septiembre de 1786 para pacificar las disputas territoriales Pennamite-Yankee con los colonos de Connecticut en el valle de Wyoming.',
    subdivisionStory:
      'De su territorio surgieron Bradford y Susquehanna (1810), Wyoming (1842) y finalmente en 1878 Lackawanna County (el condado número 67).',
  },
  {
    id: '1787-huntingdon',
    name: 'Huntingdon County (1787)',
    historicalTitle: 'Condado de Huntingdon (Fundado en sept. de 1787)',
    founded: '1787',
    seatOrCenter: 'Huntingdon (Standing Stone)',
    category: 'constitutional_county',
    fillColor: '#6B343E',
    hoverFillColor: '#8C4552',
    strokeColor: '#D4AF37',
    modernCounties: ['Huntingdon', 'Blair'],
    historicalSummary:
      'El decimoctavo condado de Pensilvania, fundado el 20 de septiembre de 1787 (apenas tres días después de la firma de la Constitución en Filadelfia).',
    subdivisionStory:
      'En 1846 cedió su mitad occidental rica en pasos ferroviarios para formar Blair County (Hollidaysburg / Altoona).',
  },
];

export const HISTORICAL_SCENARIOS: Record<
  HistoricalScenarioId,
  HistoricalScenarioConfig
> = {
  '1682': {
    id: '1682',
    title: '3 Condados Originales de William Penn (1682)',
    shortTitle: '1682 · 3 Condados Originales',
    year: 1682,
    subtitle: 'Carta Real y Frontera Indígena (Philadelphia, Bucks y Chester)',
    description:
      'Fusión geoespacial mediante Turf.js (turf.union) que reconstruye las tres jurisdicciones fundacionales establecidas por William Penn en 1682 junto al río Delaware y los tres grandes dominios indígenas del interior (Lenape, Susquehannock y Haudenosaunee/Shawnee), eliminando las fronteras de los condados modernos.',
    territories: SCENARIO_1682_TERRITORIES,
  },
  '1787': {
    id: '1787',
    title: 'Pensilvania en la Constitución (1787 — 18 Condados)',
    shortTitle: '1787 · Ratificación Constitucional (18 Condados)',
    year: 1787,
    subtitle: 'Las 18 Jurisdicciones al Ratificar la Constitución de EE. UU.',
    description:
      'Fusión geoespacial mediante Turf.js (turf.union) de los 67 condados modernos dentro de las 18 jurisdicciones matrices existentes en diciembre de 1787, cuando Pensilvania se convirtió en el segundo estado en ratificar la Constitución Federal.',
    territories: SCENARIO_1787_TERRITORIES,
  },
};
