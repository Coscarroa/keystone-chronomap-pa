export interface PDEStandardRecord {
  code: string;
  gradeBand: string;
  title: string;
  description: string;
}

export interface PrimarySourceCapsule {
  id: string;
  title: string;
  shortTitle: string;
  year: number;
  eraIds: string[];
  linkedCounties: string[];
  authorOrOrigin: string;
  pdeStandardCode: string;
  originalQuoteEn: string;
  translatedQuoteEs: string;
  historicalContext: string;
  socraticQuestions: [string, string];
  officialRepositories: {
    name: string;
    domainLabel: string;
    url: string;
  }[];
}

export const PDE_HISTORY_STANDARDS: PDEStandardRecord[] = [
  {
    code: 'PDE 8.2.9.B / 8.2.12.B',
    gradeBand: 'Grades 9–12 (Pennsylvania History)',
    title: 'Primary Documents, Material Artifacts and Historical Places in PA',
    description:
      'Evalúa la importancia de documentos históricos primarios, artefactos y sitios patrimoniales fundamentales en el desarrollo político, social y territorial de la Mancomunidad de Pensilvania.',
  },
  {
    code: 'PDE 8.2.9.A / 8.2.12.A',
    gradeBand: 'Grades 9–12 (Contributions of Individuals & Groups)',
    title: 'Political and Cultural Contributions of Individuals and Groups in PA',
    description:
      'Analiza el impacto social, político, cultural y económico de líderes, reformadores y comunidades en la conformación de los 67 condados de Pensilvania.',
  },
  {
    code: 'PDE 8.2.9.C / 8.2.12.C',
    gradeBand: 'Grades 9–12 (Continuity and Change)',
    title: 'Impact of Continuity and Change on Pennsylvania History',
    description:
      'Examina cómo la innovación industrial, el comercio, el transporte (canales y ferrocarriles) y la expansión demográfica transformaron las fronteras internas de Pensilvania.',
  },
  {
    code: 'PDE 8.2.9.D / 8.2.12.D',
    gradeBand: 'Grades 9–12 (Conflict and Cooperation)',
    title: 'Conflict and Cooperation Among Groups and Organizations in PA',
    description:
      'Investiga los tratados indígenas, conflictos militares (Revolución y Guerra Civil), movimientos abolicionistas y luchas sindicales en territorio de Pensilvania.',
  },
  {
    code: 'PDE 7.1.9.B / 7.3.12.A',
    gradeBand: 'Grades 9–12 (Geography & Human Characteristics)',
    title: 'Geographic Regions, Boundaries and Settlement Patterns of PA',
    description:
      'Explica cómo la fisiografía fluvial (Delaware, Susquehanna, Ohio/Allegheny) y las cadenas montañosas determinaron el trazado de los condados y asentamientos humanos.',
  },
];

export const PRIMARY_SOURCES_DATA: PrimarySourceCapsule[] = [
  {
    id: 'charter-of-pa-1681',
    title: 'Carta Real de Pensilvania (1681) y Frame of Government (1682)',
    shortTitle: 'Charter of Pennsylvania & Frame of Government (1681–1682)',
    year: 1681,
    eraIds: ['1681', '1776', 'present'],
    linkedCounties: ['Philadelphia', 'Bucks', 'Chester'],
    authorOrOrigin: 'Rey Carlos II de Inglaterra y William Penn',
    pdeStandardCode: 'PDE 8.2.9.B / 8.2.12.B',
    originalQuoteEn:
      '"Any government is free to the people under it (whatever be the frame) where the laws rule, and the people are a party to those laws, and more than this is tyranny, oligarchy, or confusion." — William Penn, Preface to the Frame of Government of Pennsylvania (1682).',
    translatedQuoteEs:
      '«Cualquier gobierno es libre para el pueblo que vive bajo él (sea cual fuere su estructura) allí donde gobiernan las leyes y el pueblo es parte activa en la creación de esas leyes; cualquier cosa distinta a esto es tiranía, oligarquía o confusión.» — William Penn, Prefacio al Frame of Government de Pensilvania (1682).',
    historicalContext:
      'Otorgada el 4 de marzo de 1681 y complementada por el Frame of Government en 1682, esta carta fundacional estableció la Provincia de Pensilvania sobre los tres condados originales (Philadelphia, Bucks y Chester), garantizando libertad de conciencia religiosa, juicios con jurado e instituciones representativas inéditas en el mundo atlántico.',
    socraticQuestions: [
      '¿De qué manera la distinción de William Penn entre el "imperio de la ley participativa" y la "tiranía" anticipó un siglo antes los principios constitucionales redactados en Filadelfia en 1787?',
      '¿Cómo influyó la garantía de libertad religiosa del "Santo Experimento" de Penn en el patrón de asentamiento multicultural (cuáqueros, alemanes del Palatinado, escoceses-irlandeses) hacia el interior del valle de Susquehanna?',
    ],
    officialRepositories: [
      {
        name: 'Pennsylvania Historical & Museum Commission (State Archives)',
        domainLabel: 'pa.gov',
        url: 'https://www.pa.gov/agencies/phmc.html',
      },
      {
        name: 'Historical Society of Pennsylvania',
        domainLabel: 'hsp.org',
        url: 'https://hsp.org',
      },
    ],
  },
  {
    id: 'declaration-independence-1776',
    title: 'Declaración de Independencia en la Casa Estatal de Pensilvania (1776)',
    shortTitle: 'Declaration of Independence — Philadelphia (1776)',
    year: 1776,
    eraIds: ['1776', 'present'],
    linkedCounties: ['Philadelphia', 'York', 'Lancaster', 'Chester', 'Bucks'],
    authorOrOrigin: 'Segundo Congreso Continental (Independence Hall, Filadelfia)',
    pdeStandardCode: 'PDE 8.2.9.B / 8.3.12.B',
    originalQuoteEn:
      '"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. — That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed."',
    translatedQuoteEs:
      '«Sostenemos como evidentes estas verdades: que todos los hombres son creados iguales; que son dotados por su Creador de ciertos derechos inalienables; que entre éstos están la vida, la libertad y la búsqueda de la felicidad; y que para garantizar estos derechos se instituyen entre los hombres los gobiernos, que derivan sus poderes legítimos del consentimiento de los gobernados.»',
    historicalContext:
      'Adoptada el 4 de julio de 1776 en la Casa Estatal de Pensilvania (actual Independence Hall en Filadelfia) e impresa esa misma noche por John Dunlap a pocas cuadras. Mientras el Congreso debatía la ruptura con la Corona británica, Pensilvania también redactaba su propia Constitución radical de 1776 presidida por Benjamin Franklin.',
    socraticQuestions: [
      '¿Por qué la posición geográfica, demográfica e intelectual de Filadelfia en 1776 la convirtió en el escenario estratégico indispensable para articular el principio del "consentimiento de los gobernados"?',
      '¿Qué tensiones existían en 1776 entre la proclamación de los "derechos inalienables" en Independence Hall y la realidad de la frontera occidental de Pensilvania y la institución de la esclavitud (que llevaría a Pensilvania a aprobar la Ley de Abolición Gradual en 1780)?',
    ],
    officialRepositories: [
      {
        name: 'National Archives — Charters of Freedom',
        domainLabel: 'archives.gov',
        url: 'https://www.archives.gov/founding-docs/declaration',
      },
      {
        name: 'Historical Society of Pennsylvania',
        domainLabel: 'hsp.org',
        url: 'https://hsp.org',
      },
    ],
  },
  {
    id: 'us-constitution-1787',
    title: 'Constitución de los Estados Unidos y Ratificación de Pensilvania (1787)',
    shortTitle: 'U.S. Constitution — Philadelphia Convention (1787)',
    year: 1787,
    eraIds: ['1776', 'present'],
    linkedCounties: [
      'Philadelphia',
      'Cumberland',
      'Fayette',
      'Westmoreland',
      'Washington',
      'Dauphin',
    ],
    authorOrOrigin: 'Convención Constitucional en Filadelfia (17 de septiembre de 1787)',
    pdeStandardCode: 'PDE 8.2.12.B / 8.3.12.A',
    originalQuoteEn:
      '"We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America."',
    translatedQuoteEs:
      '«Nosotros, el Pueblo de los Estados Unidos, a fin de formar una Unión más perfecta, establecer la Justicia, asegurar la tranquilidad interior, proveer a la defensa común, promover el bienestar general y asegurar los beneficios de la Libertad para nosotros y para nuestra posteridad, ordenamos y establecemos esta Constitución para los Estados Unidos de América.»',
    historicalContext:
      'Redactada en Filadelfia con la participación decisiva de la delegación de Pensilvania (Benjamin Franklin, Gouverneur Morris —autor estilístico del Preámbulo—, James Wilson y Robert Morris). El 12 de diciembre de 1787, Pensilvania se convirtió en el segundo estado en ratificarla, aunque con un intenso debate entre los condados comerciales del este (Federalistas) y los condados agrarios de los Alleghenies y el oeste (Antifederalistas).',
    socraticQuestions: [
      'Al observar el mapa de los 18 condados de Pensilvania en 1787, ¿por qué los delegados del valle del Delaware (Philadelphia, Bucks, Chester) apoyaron abrumadoramente un gobierno federal fuerte mientras que los condados al oeste de las montañas (Cumberland, Westmoreland, Fayette) exigían primero una Carta de Derechos?',
      '¿Cómo se relaciona la cláusula de "asegurar la tranquilidad interior" del Preámbulo con el conflicto fiscal que estallaría pocos años después en el oeste de Pensilvania durante la Rebelión del Whisky (1794)?',
    ],
    officialRepositories: [
      {
        name: 'National Archives — U.S. Constitution',
        domainLabel: 'archives.gov',
        url: 'https://www.archives.gov/founding-docs/constitution',
      },
      {
        name: 'Historical Society of Pennsylvania',
        domainLabel: 'hsp.org',
        url: 'https://hsp.org',
      },
    ],
  },
  {
    id: 'gettysburg-address-1863',
    title: 'Discurso de Gettysburg (Gettysburg Address, 19 de noviembre de 1863)',
    shortTitle: 'Gettysburg Address — Adams County (1863)',
    year: 1863,
    eraIds: ['1861', '1870', '1950', 'present'],
    linkedCounties: ['Adams', 'Dauphin', 'Franklin', 'York', 'Cumberland'],
    authorOrOrigin: 'Presidente Abraham Lincoln (invitado por el Gobernador de PA Andrew G. Curtin)',
    pdeStandardCode: 'PDE 8.2.9.B / 8.2.12.D',
    originalQuoteEn:
      '"It is rather for us to be here dedicated to the great task remaining before us... that we here highly resolve that these dead shall not have died in vain — that this nation, under God, shall have a new birth of freedom — and that government of the people, by the people, for the people, shall not perish from the earth."',
    translatedQuoteEs:
      '«Más bien nos corresponde a nosotros dedicarnos aquí a la gran tarea que aún resta ante nosotros... que resolvamos solemnemente que estos muertos no habrán dado su vida en vano; que esta nación, bajo Dios, tendrá un nuevo nacimiento de la libertad; y que el gobierno del pueblo, por el pueblo y para el pueblo, no desaparecerá de la faz de la tierra.»',
    historicalContext:
      'Cuatro meses después de la batalla de tres días en el condado de Adams (1–3 de julio de 1863), el gobernador de Pensilvania Andrew Gregg Curtin comisionó a David Wills la creación del Cementerio Nacional de los Soldados. En apenas 272 palabras, Lincoln vinculó el sacrificio en suelo de Pensilvania con la promesa de igualdad de la Declaración de Independencia de 1776.',
    socraticQuestions: [
      '¿Por qué la invasión confederada del sur de Pensilvania en junio-julio de 1863 (amenazando Chambersburg, Carlisle, York y Harrisburg) convirtió a los campos del condado de Adams en el punto de inflexión militar y moral de la Guerra Civil?',
      '¿Cómo transforma Lincoln el significado de la guerra al pasar de una lucha por "preservar la Unión constitucional" a lo que él denomina un "nuevo nacimiento de la libertad"?',
    ],
    officialRepositories: [
      {
        name: 'Library of Congress — Gettysburg Address Exhibition',
        domainLabel: 'loc.gov',
        url: 'https://www.loc.gov/exhibits/gettysburg-address/',
      },
      {
        name: 'Pennsylvania Historical & Museum Commission',
        domainLabel: 'pa.gov',
        url: 'https://www.pa.gov/agencies/phmc.html',
      },
    ],
  },
];
