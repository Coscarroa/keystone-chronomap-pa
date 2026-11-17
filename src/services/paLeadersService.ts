export interface PALeaderRecord {
  id: string;
  name: string;
  roleTitle: string;
  lifespanOrTerm: string;
  eraIds: string[];
  linkedCounties: string[];
  wikiPageTitle: string;
  defaultPortraitUrl: string;
  managementSummary: string;
  achievements: string[];
  controversiesAndCrises: string[];
  institutionsFounded: string[];
}

export interface WikiLeaderEnrichment {
  portraitUrl: string;
  wikiExtract?: string;
  wikiUrl: string;
}

const LOCAL_STORAGE_WIKI_KEY = 'keystone_pa_leaders_wiki_portraits_v1';

export const PA_LEADERS_DATA: PALeaderRecord[] = [
  {
    id: 'william-penn',
    name: 'William Penn',
    roleTitle: 'Fundador y Primer Propietario de la Provincia de Pensilvania',
    lifespanOrTerm: '1644–1718 · Carta Real: 1681',
    eraIds: ['1681', '1776', 'present'],
    linkedCounties: ['Philadelphia', 'Bucks', 'Chester'],
    wikiPageTitle: 'William_Penn',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/William_Penn_by_Francis_Place.jpg?width=500',
    managementSummary:
      'Pensador cuáquero inglés que recibió de Carlos II la Carta Real de 1681 para saldar una deuda de la Corona con su padre, el almirante Sir William Penn. Concibió Pensilvania como un "Santo Experimento" (Holy Experiment) basado en la libertad de conciencia religiosa, el juicio por jurado, la limitación de la pena capital y la negociación diplomática de tierras con las naciones indígenas.',
    achievements: [
      'Redacción del Frame of Government (1682) y la Carta de Privilegios (1701), precursores directos de la Constitución de EE. UU. y la Carta de Derechos.',
      'Diseño urbano ortogonal de Filadelfia con cinco plazas públicas verdes junto a su agrimensor Thomas Holme.',
      'Política de adquisición mediante tratados pacíficos con los líderes Lenni-Lenape (Tratado de Shackamaxon de 1682), atrayendo inmigrantes cuáqueros, menonitas, luteranos y hugonotes.',
    ],
    controversiesAndCrises: [
      'A pesar de sus principios cuáqueros de igualdad espiritual, Penn poseyó personas esclavizadas en su residencia de Pennsbury Manor reflejando las contradicciones de la época colonial.',
      'Sus prolongadas ausencias en Inglaterra, disputas fronterizas con Lord Baltimore (Maryland) y la mala administración financiera de su agente Philip Ford lo llevaron temporalmente a la prisión por deudas en Londres.',
      'Tras su muerte, sus hijos abandonaron su política indígena pacífica al ejecutar el fraudulento "Walking Purchase" de 1737.',
    ],
    institutionsFounded: [
      'Provincia de Pensilvania y los 3 Condados Originales: Philadelphia, Bucks y Chester (1682).',
      'Ciudad de Filadelfia (1682) y William Penn Charter School (1689).',
      'Residencia histórica de Pennsbury Manor en Bucks County.',
    ],
  },
  {
    id: 'benjamin-franklin',
    name: 'Benjamin Franklin',
    roleTitle: '6.º Presidente del Consejo Ejecutivo Supremo de Pensilvania y Polímata',
    lifespanOrTerm: '1706–1790 · Mandato en PA: 1785–1788',
    eraIds: ['1776', 'present'],
    linkedCounties: ['Philadelphia', 'Franklin', 'Lancaster'],
    wikiPageTitle: 'Benjamin_Franklin',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/BenFranklinDuplessis.jpg?width=500',
    managementSummary:
      'Científico, impresor, diplomático y estadista que transformó Filadelfia en el centro intelectual de la Ilustración en América. Presidió la Convención Constitucional de Pensilvania de 1776, aseguró la alianza militar y financiera de Francia durante la Guerra de Independencia y ejerció como jefe del ejecutivo de Pensilvania entre 1785 y 1788.',
    achievements: [
      'Único Padre Fundador firmante de los cuatro documentos clave: la Declaración de Independencia (1776), el Tratado de Alianza con Francia (1778), el Tratado de París (1783) y la Constitución de EE. UU. (1787).',
      'Investigaciones pioneras sobre la naturaleza eléctrica del rayo, invención del pararrayos, las lentes bifocales y la estufa Franklin.',
      'En sus últimos años asumió la presidencia de la Sociedad de Pensilvania para Promover la Abolición de la Esclavitud, enviando al Congreso en 1790 un memorial antiesclavista.',
    ],
    controversiesAndCrises: [
      'En su juventud y madurez temprana poseyó esclavos domésticos y publicó anuncios de compraventa en su periódico The Pennsylvania Gazette antes de evolucionar hacia el abolicionismo activo.',
      'Tensiones políticas severas con la familia propietaria Penn por la exención fiscal de sus tierras y debates polarizados en torno a la Constitución unicameral de Pensilvania de 1776.',
    ],
    institutionsFounded: [
      'Library Company of Philadelphia (1731) y American Philosophical Society (1743).',
      'Academy and College of Philadelphia (1749, actual University of Pennsylvania).',
      'Pennsylvania Hospital (1751, primer hospital público de EE. UU.) y Union Fire Company (1736).',
    ],
  },
  {
    id: 'thomas-mifflin',
    name: 'Thomas Mifflin',
    roleTitle: '1.er Gobernador Constitucional de la Mancomunidad de Pensilvania',
    lifespanOrTerm: '1744–1800 · Gobernador: 1790–1799',
    eraIds: ['1776', 'present'],
    linkedCounties: ['Philadelphia', 'Mifflin', 'Berks', 'Lancaster'],
    wikiPageTitle: 'Thomas_Mifflin',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Thomas_Mifflin_by_Gilbert_Stuart.jpeg?width=500',
    managementSummary:
      'Mayor general del Ejército Continental, presidente del Congreso Continental (quien aceptó la renuncia militar de George Washington en 1783), firmante de la Constitución Federal y primer gobernador de Pensilvania bajo la Constitución estatal de 1790 durante tres mandatos consecutivos.',
    achievements: [
      'Presidió la convención que redactó la Constitución de Pensilvania de 1790, estableciendo el poder ejecutivo moderno y una legislatura bicameral.',
      'Impulsó la primera red de carreteras pavimentadas de peaje (como la Philadelphia and Lancaster Turnpike, 1794) y mejoras de navegación fluvial.',
      'Reforma del código penal de Pensilvania e impulso al sistema de escuelas públicas.',
    ],
    controversiesAndCrises: [
      'Su gestión como Intendente General (Quartermaster General) del Ejército Continental (1775–1777) fue cuestionada por fallos de suministro antes de Valley Forge y su presunta cercanía a la "Conway Cabal".',
      'Crisis de la Rebelión del Whisky (1794) en el oeste de Pensilvania: inicialmente reacio a emplear la fuerza militar contra los agricultores de Washington y Allegheny, finalmente comandó la milicia estatal junto a Washington.',
    ],
    institutionsFounded: [
      'Gobierno Ejecutivo Constitucional de Pensilvania (1790).',
      'Philadelphia and Lancaster Turnpike (1794, primera carretera de macadán de larga distancia en EE. UU.).',
      'Condado de Mifflin (1789) y localidad de Mifflinburg nombrados en su honor.',
    ],
  },
  {
    id: 'james-buchanan',
    name: 'James Buchanan',
    roleTitle: '15.º Presidente de los Estados Unidos y Diplomático de Pensilvania',
    lifespanOrTerm: '1791–1868 · Presidencia: 1857–1861',
    eraIds: ['1861', 'present'],
    linkedCounties: ['Franklin', 'Lancaster'],
    wikiPageTitle: 'James_Buchanan',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/James_Buchanan.jpg?width=500',
    managementSummary:
      'Nacido en Cove Gap (Franklin County) y residente en su finca "Wheatland" en Lancaster, tuvo una extensa carrera como congresista, senador, embajador en Rusia y el Reino Unido, y Secretario de Estado antes de convertirse en el decimoquinto presidente de EE. UU. en la víspera inmediata de la Guerra Civil.',
    achievements: [
      'Como Secretario de Estado (1845–1849), negoció el Tratado de Oregón de 1846 con Gran Bretaña, fijando pacíficamente la frontera del paralelo 49°N en el Pacífico Noroeste.',
      'Promoción de tratados comerciales internacionales y servicio diplomático de carrera durante cuatro décadas.',
    ],
    controversiesAndCrises: [
      'Considerado de forma recurrente por los historiadores como uno de los presidentes más cuestionados por su incapacidad para frenar la secesión de siete estados del Sur entre diciembre de 1860 y marzo de 1861.',
      'Intervino indebidamente ante magistrados del Tribunal Supremo antes del fallo Dred Scott v. Sandford (1857) y apoyó la constitución esclavista de Lecompton en Kansas.',
      'Sostuvo la doctrina de que los estados no tenían derecho constitucional a secesionarse, pero que el gobierno federal carecía de autoridad constitucional para impedirlo por la fuerza.',
    ],
    institutionsFounded: [
      'Sitio Histórico Presidencial de Wheatland en Lancaster (conservado hoy por LancasterHistory).',
      'Buchanan\'s Birthplace State Park en Franklin County.',
    ],
  },
  {
    id: 'thaddeus-stevens',
    name: 'Thaddeus Stevens',
    roleTitle: 'Líder de la Cámara de Representantes, Abolicionista y Defensor de la Educación Pública',
    lifespanOrTerm: '1792–1868 · Congresista por PA: 1849–1853, 1859–1868',
    eraIds: ['1861', 'present'],
    linkedCounties: ['Adams', 'Lancaster'],
    wikiPageTitle: 'Thaddeus_Stevens',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Thaddeus_Stevens_-_Brady-Handy.jpg?width=500',
    managementSummary:
      'Abogado en Gettysburg y posteriormente en Lancaster, legislador estatal y presidente del Comité de Medios y Arbitrios y de Asignaciones del Congreso durante la Guerra Civil. Fue el principal arquitecto legislativo de la abolición de la esclavitud, el financiamiento de la Unión y la Reconstrucción Radical.',
    achievements: [
      'En 1835 pronunció en la legislatura de Pensilvania su célebre discurso en defensa de la Ley de Escuelas Públicas Gratuitas (Free School Act), salvando la educación pública universal en el estado.',
      'Lideró la aprobación de las Enmiendas 13.ª (abolición de la esclavitud), 14.ª (igualdad ante la ley y ciudadanía) y las bases de la 15.ª (sufragio sin distinción racial).',
      'Su vivienda y despacho en Lancaster funcionaron activamente como estación comprobada del Ferrocarril Subterráneo.',
    ],
    controversiesAndCrises: [
      'Fuerte enfrentamiento institucional con el presidente Andrew Johnson durante la Reconstrucción, siendo el principal impulsor del juicio político (impeachment) contra Johnson en 1868.',
      'En junio de 1863 las tropas confederadas de Jubal Early destruyeron deliberadamente su fundición de hierro Caledonia Iron Works (entre Chambersburg y Gettysburg) en represalia por sus posturas abolicionistas.',
    ],
    institutionsFounded: [
      'Thaddeus Stevens College of Technology en Lancaster (fundado por legado testamentario para jóvenes sin recursos sin distinción de raza ni origen).',
      'Consolidación del Sistema de Escuelas Públicas Gratuitas de Pensilvania (1834–1835).',
    ],
  },
  {
    id: 'andrew-gregg-curtin',
    name: 'Andrew Gregg Curtin',
    roleTitle: '15.º Gobernador de Pensilvania ("The Soldier\'s Friend")',
    lifespanOrTerm: '1815–1894 · Gobernador: 1861–1867',
    eraIds: ['1861', 'present'],
    linkedCounties: ['Centre', 'Dauphin', 'Adams', 'Blair'],
    wikiPageTitle: 'Andrew_Gregg_Curtin',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Andrew_Gregg_Curtin_-_Brady-Handy.jpg?width=500',
    managementSummary:
      'Nacido en Bellefonte (Centre County), gobernó Pensilvania durante toda la Guerra Civil como el aliado estatal más estratégico de Abraham Lincoln. Movilizó más de 360,000 soldados de Pensilvania para el Ejército de la Unión y organizó la defensa del estado durante la invasión de 1863.',
    achievements: [
      'Estableció en Harrisburg el Camp Curtin, el mayor campamento de entrenamiento militar de la Unión por el que pasaron más de 300,000 soldados.',
      'Organizó en septiembre de 1862 la Conferencia de Gobernadores Leales en Altoona (Blair County) para respaldar la Proclamación de Emancipación de Lincoln.',
      'Impulsó la creación del Cementerio Nacional de los Soldados en Gettysburg y extendió la invitación oficial a Lincoln que dio origen al Discurso de Gettysburg (noviembre de 1863).',
    ],
    controversiesAndCrises: [
      'Crisis política y logística en los primeros meses de 1861 por contratos de uniformes defectuosos antes de reformar la intendencia estatal.',
      'Rivalidad política permanente dentro del Partido Republicano de Pensilvania con la maquinaria del senador Simon Cameron.',
    ],
    institutionsFounded: [
      'Soldiers\' National Cemetery en Gettysburg (1863).',
      'Sistema de Escuelas para Huérfanos de Soldados de Pensilvania (Pennsylvania Soldiers\' Orphan Schools, 1864).',
      'Cuerpo de Reserva de Pensilvania (Pennsylvania Reserve Corps).',
    ],
  },
  {
    id: 'andrew-carnegie',
    name: 'Andrew Carnegie',
    roleTitle: 'Industrial Siderúrgico y Filántropo de Pittsburgh',
    lifespanOrTerm: '1835–1919 · Era del Acero en PA: 1865–1901',
    eraIds: ['1870', 'present'],
    linkedCounties: ['Allegheny', 'Westmoreland', 'Cambria'],
    wikiPageTitle: 'Andrew_Carnegie',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Andrew_Carnegie,_by_Theodore_Marceau.jpg?width=500',
    managementSummary:
      'Inmigrante escocés que comenzó como mensajero de telégrafos y ferroviario en el Pennsylvania Railroad en Pittsburgh, hasta construir Carnegie Steel Company. Introdujo el proceso Bessemer y de hogar abierto a gran escala en Braddock, Duquesne y Homestead, convirtiendo al condado de Allegheny en el corazón mundial del acero.',
    achievements: [
      'Integración vertical de la industria del acero (mineral de hierro, coque de Connellsville, ferrocarriles y acerías), abaratando el acero estructural para puentes, rascacielos y rieles.',
      'Autor de "El Evangelio de la Riqueza" (1889), dedicando tras la venta de su empresa en 1901 más de 350 millones de dólares a bibliotecas públicas, ciencia, educación y paz mundial.',
      'Financió más de 2,500 bibliotecas públicas (incluyendo la primera en Braddock, PA, en 1889).',
    ],
    controversiesAndCrises: [
      'La sangrienta Huelga de Homestead de julio de 1892, gestionada en el terreno por su socio Henry Clay Frick con agentes de Pinkerton, dejó diez muertos y destruyó la sindicalización en las acerías durante cuatro décadas.',
      'Jornadas laborales extenuantes de 12 horas en los altos hornos y vinculación juvenil al South Fork Fishing and Hunting Club antes de la inundación de Johnstown de 1889.',
    ],
    institutionsFounded: [
      'Carnegie Technical Schools (1900, actual Carnegie Mellon University en Pittsburgh).',
      'Carnegie Institute, Carnegie Museums of Pittsburgh y Carnegie Library of Pittsburgh (1895).',
      'Planta Edgar Thomson Steel Works en Braddock (1875, aún operativa).',
    ],
  },
  {
    id: 'gifford-pinchot',
    name: 'Gifford Pinchot',
    roleTitle: '28.º Gobernador de Pensilvania y Primer Jefe del Servicio Forestal de EE. UU.',
    lifespanOrTerm: '1865–1946 · Gobernador: 1923–1927 y 1931–1935',
    eraIds: ['1870', '1950', 'present'],
    linkedCounties: ['Pike', 'Dauphin', 'Potter', 'Tioga'],
    wikiPageTitle: 'Gifford_Pinchot',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Gifford_Pinchot_3c03915u.jpg?width=500',
    managementSummary:
      'Desde su residencia familiar Grey Towers en Milford (Pike County), Pinchot fundó la silvicultura científica y la conservación de recursos naturales en EE. UU. Elegido dos veces gobernador de Pensilvania como republicano progresista, modernizó la administración estatal y enfrentó los años más duros de la Gran Depresión.',
    achievements: [
      'Reorganizó las finanzas estatales eliminando un déficit de 32 millones de dólares y estableciendo un código administrativo meritocrático.',
      'Programa "Get the Farmers Out of the Mud" durante su segundo mandato, pavimentando más de 20,000 millas de caminos rurales ("Pinchot Roads") que dieron empleo a decenas de miles de trabajadores en la Gran Depresión.',
      'Reforestación y protección de los bosques estatales de Pensilvania tras décadas de tala rasa en el siglo XIX.',
    ],
    controversiesAndCrises: [
      'La célebre controversia Pinchot-Ballinger (1909–1910) con el Secretario del Interior del presidente William Howard Taft, que provocó su destitución federal y dividió al Partido Republicano en 1912.',
      'Choque constante con la vieja guardia conservadora de su propio partido y los monopolios de compañías eléctricas en Pensilvania.',
    ],
    institutionsFounded: [
      'U.S. Forest Service (1905) y Yale School of Forestry (financiada en Milford, Pike County, en 1900).',
      'Red de carreteras secundarias pavimentadas de Pensilvania ("Pinchot Roads") y Gifford Pinchot State Park en York County.',
    ],
  },
  {
    id: 'milton-shapp',
    name: 'Milton Shapp',
    roleTitle: '40.º Gobernador de Pensilvania y Pionero de las Telecomunicaciones',
    lifespanOrTerm: '1912–1994 · Gobernador: 1971–1979',
    eraIds: ['1950', 'present'],
    linkedCounties: ['Montgomery', 'Philadelphia', 'Dauphin', 'Luzerne'],
    wikiPageTitle: 'Milton_Shapp',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Milton_Shapp_1976.jpg?width=500',
    managementSummary:
      'Fundador de Jerrold Electronics en Filadelfia/Montgomery (empresa pionera de la televisión por cable en ciudades montañosas de Pensilvania como Lansford y Mahanoy City). Fue el primer gobernador judío de Pensilvania y el primero en ejercer dos mandatos consecutivos bajo la Constitución estatal reformada de 1968.',
    achievements: [
      'Creó la Lotería Estatal de Pensilvania (1971), siendo el primer estado de EE. UU. en destinar íntegramente sus fondos al transporte gratuito, rebajas de impuestos prediales y medicamentos para adultos mayores.',
      'Lideró la respuesta de emergencia y reconstrucción tras el devastador Huracán Agnes de junio de 1972, que inundó el valle de Wyoming (Wilkes-Barre) y Harrisburg.',
      'Defensor pionero de los derechos del consumidor, reformas de salud mental y derechos civiles en el empleo público.',
    ],
    controversiesAndCrises: [
      'Crisis fiscal al inicio de su mandato que lo llevó a promulgar en 1971 el impuesto sobre la renta personal estatal tras que el Tribunal Supremo de PA invalidara un esquema progresivo.',
      'Investigaciones federales sobre funcionarios de su gabinete y contribuciones de campaña en su segundo mandato, aunque Shapp nunca fue imputado penalmente.',
    ],
    institutionsFounded: [
      'Pennsylvania Lottery para programas de la tercera edad (1971).',
      'Industria comercial de televisión por antena comunitaria (CATV / Cable TV) iniciada en los montes de antracita de Pensilvania (1948–1950).',
    ],
  },
  {
    id: 'tom-ridge',
    name: 'Tom Ridge',
    roleTitle: '43.º Gobernador de Pensilvania y 1.er Secretario de Seguridad Nacional de EE. UU.',
    lifespanOrTerm: '1945–presente · Gobernador: 1995–2001',
    eraIds: ['1950', 'present'],
    linkedCounties: ['Erie', 'Dauphin', 'Somerset'],
    wikiPageTitle: 'Tom_Ridge',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Tom_Ridge_official_portrait.jpg?width=500',
    managementSummary:
      'Veterano condecorado en Vietnam y congresista por el distrito de Erie durante doce años. Como gobernador entre 1995 y octubre de 2001, impulsó la reconversión económica e industrial de antiguos terrenos siderúrgicos y mineros, hasta ser llamado tras los atentados del 11 de septiembre de 2001 (incluyendo Shanksville, PA) para dirigir la seguridad nacional federal.',
    achievements: [
      'Programa de reciclaje de suelos industriales ("Land Recycling / Brownfields Program", 1995), premiado nacionalmente por recuperar antiguas plantas de acero para parques tecnológicos.',
      'Creación del programa educativo Keystone Opportunity Zones y modernización del sistema de justicia juvenil.',
      'Primer titular del Departamento de Seguridad Nacional (Department of Homeland Security) de EE. UU. (2001–2005).',
    ],
    controversiesAndCrises: [
      'Debates legislativos intensos sobre vales escolares (school vouchers) y desregulación del mercado eléctrico de Pensilvania en 1996.',
      'Como Secretario de Seguridad Nacional, recibió críticas por el sistema cromático de alertas de amenazas y presiones políticas en 2004.',
    ],
    institutionsFounded: [
      'Pennsylvania Land Recycling Program (1995) y Tom Ridge Environmental Center en Presque Isle (Erie County).',
      'Organización fundacional del U.S. Department of Homeland Security (2001–2003).',
    ],
  },
  {
    id: 'josh-shapiro',
    name: 'Josh Shapiro',
    roleTitle: '48.º Gobernador de Pensilvania y ex Fiscal General del Estado',
    lifespanOrTerm: '1973–presente · Gobernador: 2023–presente',
    eraIds: ['present'],
    linkedCounties: ['Montgomery', 'Dauphin', 'Philadelphia'],
    wikiPageTitle: 'Josh_Shapiro',
    defaultPortraitUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Governor_Josh_Shapiro_official_portrait_(cropped).jpg?width=500',
    managementSummary:
      'Ex comisionado del condado de Montgomery (2012–2017) y Fiscal General de Pensilvania (2017–2023). Asumió la gobernación en enero de 2023 enfocando su administración en infraestructura, simplificación de permisos económicos, educación pública y acuerdos bipartidistas en una legislatura estatal dividida.',
    achievements: [
      'Coordinación de emergencia para reconstruir y reabrir en solo 12 días el viaducto colapsado de la autopista interestatal I-95 en Filadelfia (junio de 2023).',
      'Eliminación del requisito de título universitario de cuatro años para el 92 % de los empleos de la administración estatal de Pensilvania.',
      'Como Fiscal General, lideró acuerdos nacionales multimillonarios contra la crisis de los opioides para financiar tratamientos en los 67 condados.',
    ],
    controversiesAndCrises: [
      'Desacuerdos presupuestarios con el Senado estatal en torno al programa de becas escolares (PASS / vouchers) y al ingreso de Pensilvania en la iniciativa regional de emisiones de carbono (RGGI).',
      'Debates sobre el manejo administrativo de denuncias internas en el entorno legislativo de Harrisburg en 2023.',
    ],
    institutionsFounded: [
      'Office of Transformation and Opportunity (OTO) para agilizar inversiones e infraestructuras en Pensilvania (2023).',
      'Commonwealth Office of Digital Experience (CODE PA).',
    ],
  },
];

/**
 * Fetches real portraits and introductory extracts from the public English Wikipedia MediaWiki API
 * and caches the results in localStorage.
 */
export async function fetchLeadersWikiData(): Promise<
  Record<string, WikiLeaderEnrichment>
> {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_WIKI_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as Record<string, WikiLeaderEnrichment>;
      if (parsed && Object.keys(parsed).length >= 8) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage read errors
  }

  const result: Record<string, WikiLeaderEnrichment> = {};
  PA_LEADERS_DATA.forEach((leader) => {
    result[leader.id] = {
      portraitUrl: leader.defaultPortraitUrl,
      wikiUrl: `https://en.wikipedia.org/wiki/${leader.wikiPageTitle}`,
    };
  });

  try {
    const titlesParam = PA_LEADERS_DATA.map((l) => l.wikiPageTitle).join('|');
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      titlesParam
    )}&prop=pageimages|extracts&exintro=1&explaintext=1&pithumbsize=600&redirects=1&format=json&origin=*`;

    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const pageList = Object.values(pages) as any[];

      PA_LEADERS_DATA.forEach((leader) => {
        const normalizedTarget = leader.wikiPageTitle
          .replace(/_/g, ' ')
          .toLowerCase();
        const matchedPage = pageList.find(
          (p) =>
            String(p.title || '').toLowerCase() === normalizedTarget ||
            String(p.title || '')
              .toLowerCase()
              .includes(leader.name.toLowerCase())
        );

        if (matchedPage) {
          result[leader.id] = {
            portraitUrl:
              matchedPage.thumbnail?.source || leader.defaultPortraitUrl,
            wikiExtract: matchedPage.extract
              ? String(matchedPage.extract).slice(0, 460) + '...'
              : undefined,
            wikiUrl: `https://en.wikipedia.org/wiki/${leader.wikiPageTitle}`,
          };
        }
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_WIKI_KEY, JSON.stringify(result));
      } catch {
        // Ignore storage write errors
      }
    }
  } catch {
    // Keep default Wikimedia Special:FilePath fallback URLs if offline
  }

  return result;
}
