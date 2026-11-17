export type PhmcCategory =
  | 'industria'
  | 'derechos_civiles'
  | 'inventos'
  | 'mujeres_pioneras'
  | 'militar_politica';

export interface PhmcCategoryMeta {
  id: PhmcCategory | 'all';
  label: string;
  shortLabel: string;
  badgeColor: string;
}

export const PHMC_CATEGORIES: PhmcCategoryMeta[] = [
  {
    id: 'all',
    label: 'Todas las categorías (25 Placas)',
    shortLabel: 'Todas (25)',
    badgeColor: '#D4AF37',
  },
  {
    id: 'industria',
    label: 'Industria, Siderurgia y Carbón',
    shortLabel: 'Industria y Carbón',
    badgeColor: '#E07A5F',
  },
  {
    id: 'derechos_civiles',
    label: 'Derechos Civiles y Abolicionismo',
    shortLabel: 'Derechos Civiles',
    badgeColor: '#52B788',
  },
  {
    id: 'inventos',
    label: 'Inventos, Ciencia e Ingeniería',
    shortLabel: 'Inventos y Ciencia',
    badgeColor: '#3A7CA5',
  },
  {
    id: 'mujeres_pioneras',
    label: 'Mujeres Pioneras de Pensilvania',
    shortLabel: 'Mujeres Pioneras',
    badgeColor: '#C77DFF',
  },
  {
    id: 'militar_politica',
    label: 'Historia Política y Militar',
    shortLabel: 'Historia Política',
    badgeColor: '#9B2226',
  },
];

export interface PhmcMarkerRecord {
  id: string;
  title: string;
  cityOrTown: string;
  countyName: string;
  eventYear: number;
  dedicatedYear: number;
  category: PhmcCategory;
  position: google.maps.LatLngLiteral;
  plaqueTextEs: string;
  plaqueTextEn: string;
  historicalSignificance: string;
}

export const PHMC_MARKERS_DATA: PhmcMarkerRecord[] = [
  {
    id: 'phmc-scranton-streetcars-1886',
    title: 'First Electric Streetcars ("The Electric City")',
    cityOrTown: 'Scranton',
    countyName: 'Lackawanna',
    eventYear: 1886,
    dedicatedYear: 1986,
    category: 'inventos',
    position: { lat: 41.4089, lng: -75.6624 },
    plaqueTextEs:
      'El 29 de noviembre de 1886 comenzó a operar en Scranton el primer sistema exitoso de tranvías impulsados exclusivamente por energía eléctrica en Estados Unidos, otorgando a la ciudad el célebre sobrenombre de "The Electric City".',
    plaqueTextEn:
      'On November 29, 1886, the first streetcar system in the U.S. operated solely by electricity began regular service here on the Scranton Suburban Railway, earning Scranton the nickname "The Electric City."',
    historicalSignificance:
      'Revolucionó el transporte público urbano mundial utilizando el sistema eléctrico de Charles Van Depoele.',
  },
  {
    id: 'phmc-scranton-iron-furnaces-1840',
    title: 'Scranton Iron Furnaces (Lackawanna Iron & Steel)',
    cityOrTown: 'Scranton',
    countyName: 'Lackawanna',
    eventYear: 1840,
    dedicatedYear: 1991,
    category: 'industria',
    position: { lat: 41.4042, lng: -75.6631 },
    plaqueTextEs:
      'Construidos a partir de 1840 por los hermanos George y Selden Scranton junto al arroyo Roaring Brook, estos cuatro monumentales altos hornos de piedra fundieron hierro con carbón de antracita para producir rieles ferroviarios para todo Estados Unidos.',
    plaqueTextEn:
      'Built starting in 1840 by George and Selden Scranton, these massive stone blast furnaces used anthracite coal to smelt iron and roll T-rails that built America’s expanding railroad network.',
    historicalSignificance:
      'Dio origen a la ciudad de Scranton y demostró la viabilidad industrial de la fundición con antracita.',
  },
  {
    id: 'phmc-mother-bethel-ame-1794',
    title: 'Mother Bethel A.M.E. Church / Obispo Richard Allen',
    cityOrTown: 'Philadelphia',
    countyName: 'Philadelphia',
    eventYear: 1794,
    dedicatedYear: 1974,
    category: 'derechos_civiles',
    position: { lat: 39.9431, lng: -75.1489 },
    plaqueTextEs:
      'Fundada en 1794 por el obispo Richard Allen, exesclavo, abolicionista y líder cívico. Este terreno en 6th & Lombard es la parcela de tierra de propiedad continua por afroamericanos más antigua de los Estados Unidos y cuna de la Iglesia Metodista Episcopal Africana.',
    plaqueTextEn:
      'Founded in 1794 by Bishop Richard Allen, this site is the oldest parcel of land continuously owned by African Americans in the United States and birthplace of the African Methodist Episcopal Church.',
    historicalSignificance:
      'Sede de la primera Convención Nacional Negra en 1830 y estación clave del Ferrocarril Subterráneo.',
  },
  {
    id: 'phmc-betsy-ross-house-1777',
    title: 'Betsy Ross House (1752–1836)',
    cityOrTown: 'Philadelphia',
    countyName: 'Philadelphia',
    eventYear: 1777,
    dedicatedYear: 1968,
    category: 'mujeres_pioneras',
    position: { lat: 39.9524, lng: -75.1446 },
    plaqueTextEs:
      'Artesana tapicera y fabricante de banderas en Arch Street, Filadelfia. Confeccionó enseñas navales para la flota de Pensilvania durante la Revolución Americana y es reconocida tradicionalmente por coser la primera bandera de barras y estrellas.',
    plaqueTextEn:
      'Philadelphia upholsterer and flag maker who sewed naval ensigns for the Pennsylvania State Navy in 1777 and is celebrated in American tradition as maker of the first Stars and Stripes.',
    historicalSignificance:
      'Representa el papel esencial de las mujeres artesanas e independientes en la economía revolucionaria de Filadelfia.',
  },
  {
    id: 'phmc-eniac-upenn-1946',
    title: 'ENIAC — First Electronic General-Purpose Computer',
    cityOrTown: 'Philadelphia (UPenn)',
    countyName: 'Philadelphia',
    eventYear: 1946,
    dedicatedYear: 1996,
    category: 'inventos',
    position: { lat: 39.9522, lng: -75.1932 },
    plaqueTextEs:
      'En la Escuela Moore de Ingeniería Eléctrica de la Universidad de Pensilvania se construyó y presentó en febrero de 1946 la ENIAC (Electronic Numerical Integrator and Computer), diseñada por J. Presper Eckert, John Mauchly y seis mujeres programadoras pioneras.',
    plaqueTextEn:
      'At the University of Pennsylvania Moore School of Electrical Engineering, the world’s first general-purpose electronic digital computer (ENIAC) was unveiled in 1946, programmed by six pioneering women mathematicians.',
    historicalSignificance:
      'Inauguró la era digital y de la computación electrónica moderna a nivel mundial.',
  },
  {
    id: 'phmc-gettysburg-address-1863',
    title: "Lincoln's Gettysburg Address (Soldiers' National Cemetery)",
    cityOrTown: 'Gettysburg',
    countyName: 'Adams',
    eventYear: 1863,
    dedicatedYear: 1948,
    category: 'militar_politica',
    position: { lat: 39.8194, lng: -77.2311 },
    plaqueTextEs:
      'Aquí, el 19 de noviembre de 1863, por invitación del gobernador de Pensilvania Andrew Gregg Curtin, el presidente Abraham Lincoln dedicó el Cementerio Nacional de los Soldados con su inmortal Discurso de Gettysburg de 272 palabras.',
    plaqueTextEn:
      'Here on November 19, 1863, at the dedication of the Soldiers’ National Cemetery organized by Pennsylvania Governor Andrew Curtin, President Abraham Lincoln delivered his immortal Gettysburg Address.',
    historicalSignificance:
      'Consagró la preservación de la Unión y el principio de igualdad humana universal tras la Batalla de Gettysburg.',
  },
  {
    id: 'phmc-homestead-steel-strike-1892',
    title: 'Homestead Steel Strike (Battle of the Monongahela)',
    cityOrTown: 'Homestead',
    countyName: 'Allegheny',
    eventYear: 1892,
    dedicatedYear: 1992,
    category: 'industria',
    position: { lat: 40.4092, lng: -79.9119 },
    plaqueTextEs:
      'En el muelle "Pump House" a orillas del río Monongahela, el 6 de julio de 1892 los trabajadores siderúrgicos sindicalizados y sus familias se enfrentaron a 300 guardias de la agencia Pinkerton contratados por Carnegie Steel Company.',
    plaqueTextEn:
      'On July 6, 1892, locked-out steelworkers of the Amalgamated Association of Iron and Steel Workers clashed here at the Pump House landing with 300 Pinkerton agents hired by Carnegie Steel.',
    historicalSignificance:
      'Hito fundamental en la historia del movimiento obrero y de la industrialización del acero en Estados Unidos.',
  },
  {
    id: 'phmc-rachel-carson-homestead-1907',
    title: 'Rachel Carson Homestead (1907–1964)',
    cityOrTown: 'Springdale',
    countyName: 'Allegheny',
    eventYear: 1907,
    dedicatedYear: 1976,
    category: 'mujeres_pioneras',
    position: { lat: 40.5439, lng: -79.7825 },
    plaqueTextEs:
      'Lugar de nacimiento y crianza de la bióloga marina y escritora Rachel Carson en el valle del río Allegheny. Su obra "Silent Spring" (Primavera Silenciosa, 1962) alertó sobre los pesticidas sintéticos e inspiró el movimiento ambientalista moderno.',
    plaqueTextEn:
      'Birthplace and childhood home of marine biologist and conservationist Rachel Carson (1907–1964), whose landmark 1962 book "Silent Spring" launched the modern global environmental movement.',
    historicalSignificance:
      'Impulsó la prohibición del DDT y la creación de la Agencia de Protección Ambiental (EPA) de EE. UU.',
  },
  {
    id: 'phmc-drake-oil-well-1859',
    title: 'Drake Oil Well — Birthplace of the Petroleum Industry',
    cityOrTown: 'Titusville',
    countyName: 'Crawford',
    eventYear: 1859,
    dedicatedYear: 1946,
    category: 'inventos',
    position: { lat: 41.6108, lng: -79.6569 },
    plaqueTextEs:
      'El 27 de agosto de 1859, Edwin L. Drake y el herrero William "Uncle Billy" Smith perforaron aquí a orillas de Oil Creek el primer pozo comercial de petróleo del mundo a 69.5 pies de profundidad.',
    plaqueTextEn:
      'On August 27, 1859, Colonel Edwin L. Drake drilled the world’s first commercially successful oil well here along Oil Creek at a depth of 69.5 feet, inaugurating the modern petroleum age.',
    historicalSignificance:
      'Transformó la energía, el transporte y la química industrial en todo el planeta.',
  },
  {
    id: 'phmc-thaddeus-stevens-lydia-smith-1843',
    title: 'Thaddeus Stevens & Lydia Hamilton Smith Residence',
    cityOrTown: 'Lancaster',
    countyName: 'Lancaster',
    eventYear: 1843,
    dedicatedYear: 2002,
    category: 'derechos_civiles',
    position: { lat: 40.0379, lng: -76.3055 },
    plaqueTextEs:
      'Hogar y despacho del congresista abolicionista Thaddeus Stevens y de la empresaria afroamericana Lydia Hamilton Smith. Excavaciones arqueológicas confirmaron una cisterna subterránea adaptada para ocultar a personas que huían de la esclavitud.',
    plaqueTextEn:
      'Home and law office of abolitionist Congressman Thaddeus Stevens and businesswoman Lydia Hamilton Smith, verified as an active station on the Underground Railroad.',
    historicalSignificance:
      'Centro neurálgico del abolicionismo en Lancaster y de la redacción de las Enmiendas 13.ª y 14.ª.',
  },
  {
    id: 'phmc-bethlehem-steel-1857',
    title: 'Bethlehem Steel Plant (1857–1995)',
    cityOrTown: 'Bethlehem',
    countyName: 'Northampton',
    eventYear: 1857,
    dedicatedYear: 1997,
    category: 'industria',
    position: { lat: 40.6146, lng: -75.3679 },
    plaqueTextEs:
      'Sede de una de las mayores productoras mundiales de acero y construcción naval. Sus trenes de laminación "Grey Mill" fabricaron las vigas estructurales de los rascacielos y puentes más emblemáticos del siglo XX y blindajes para la Marina de EE. UU.',
    plaqueTextEn:
      'Site of the flagship plant of Bethlehem Steel Corporation, whose structural wide-flange beams built America’s skyscrapers and bridges and forged armor plate in two World Wars.',
    historicalSignificance:
      'Motor industrial del valle de Lehigh durante casi 140 años; hoy preservado como el complejo cultural SteelStacks.',
  },
  {
    id: 'phmc-liberty-bell-hiding-place-1777',
    title: 'Liberty Bell Hiding Place (Zion Reformed Church)',
    cityOrTown: 'Allentown',
    countyName: 'Lehigh',
    eventYear: 1777,
    dedicatedYear: 1955,
    category: 'militar_politica',
    position: { lat: 40.6023, lng: -75.4714 },
    plaqueTextEs:
      'En septiembre de 1777, ante el avance británico sobre Filadelfia tras la Batalla de Brandywine, patriotas transportaron en carromato la Campana de la Libertad y la ocultaron bajo el piso de esta iglesia de Allentown hasta junio de 1778.',
    plaqueTextEn:
      'In September 1777, to prevent its capture and melting down by British forces occupying Philadelphia, the Liberty Bell was transported by wagon and hidden beneath the floor of Zion Reformed Church here in Allentown.',
    historicalSignificance:
      'Salvó el símbolo más preciado de la Independencia estadounidense durante la ocupación de Filadelfia.',
  },
  {
    id: 'phmc-rebecca-lukens-1825',
    title: 'Rebecca Lukens (1794–1854) — First Female Industrial CEO',
    cityOrTown: 'Coatesville',
    countyName: 'Chester',
    eventYear: 1825,
    dedicatedYear: 1994,
    category: 'mujeres_pioneras',
    position: { lat: 39.9834, lng: -75.8238 },
    plaqueTextEs:
      'En 1825, a los 31 años, Rebecca Pennock Lukens asumió la dirección de Brandywine Iron Works en Coatesville, convirtiéndose en la primera mujer directora ejecutiva industrial de EE. UU. y pionera en placas de hierro para calderas de barcos de vapor.',
    plaqueTextEn:
      'Taking charge of Brandywine Iron Works here in 1825, Rebecca Lukens became America’s first female CEO of an industrial company, pioneering heavy iron boiler plate production.',
    historicalSignificance:
      'Cimentó en Coatesville la acería de operación continua más antigua de América del Norte.',
  },
  {
    id: 'phmc-christiana-resistance-1851',
    title: 'Christiana Resistance of 1851 (William Parker)',
    cityOrTown: 'Christiana',
    countyName: 'Lancaster',
    eventYear: 1851,
    dedicatedYear: 1998,
    category: 'derechos_civiles',
    position: { lat: 39.9562, lng: -75.9985 },
    plaqueTextEs:
      'El 11 de septiembre de 1851, en la granja de William y Eliza Parker, una organización de defensa mutua afroamericana con apoyo de vecinos cuáqueros resistió con éxito una incursión armada bajo la Ley de Esclavos Fugitivos de 1850.',
    plaqueTextEn:
      'On September 11, 1851, freedom seekers led by William and Eliza Parker defended their home here against slaveholders enforcing the Fugitive Slave Act of 1850, a key prelude to the Civil War.',
    historicalSignificance:
      'Primer desafío armado colectivo exitoso contra la Ley Federal de Esclavos Fugitivos de 1850.',
  },
  {
    id: 'phmc-us-brig-niagara-erie-1813',
    title: 'U.S. Brig Niagara & Battle of Lake Erie (1813)',
    cityOrTown: 'Erie',
    countyName: 'Erie',
    eventYear: 1813,
    dedicatedYear: 1963,
    category: 'militar_politica',
    position: { lat: 42.1369, lng: -80.0911 },
    plaqueTextEs:
      'Construido en los astilleros de Presque Isle Bay en Erie en 1813 bajo la supervisión de Daniel Dobbins, el bergantín USS Niagara llevó al comodoro Oliver Hazard Perry a la victoria naval decisiva sobre la flota británica en la Guerra de 1812.',
    plaqueTextEn:
      'Built here on Presque Isle Bay in 1813, the U.S. Brig Niagara served as Commodore Oliver Hazard Perry’s relief flagship in the decisive American victory at the Battle of Lake Erie.',
    historicalSignificance:
      'Aseguró el control estadounidense de los Grandes Lagos y del Territorio del Noroeste.',
  },
  {
    id: 'phmc-cambria-iron-johnstown-1852',
    title: 'Cambria Iron Company & William Kelly Steel Converter',
    cityOrTown: 'Johnstown',
    countyName: 'Cambria',
    eventYear: 1852,
    dedicatedYear: 1989,
    category: 'industria',
    position: { lat: 40.3308, lng: -78.9255 },
    plaqueTextEs:
      'Fundada en 1852 en la confluencia de los ríos Conemaugh y Stonycreek, Cambria Iron Works perfeccionó aquí el convertidor neumático de acero de William Kelly y laminó los primeros rieles de acero Bessemer comerciales de EE. UU. en 1867.',
    plaqueTextEn:
      'Founded in 1852, the Cambria Iron Works experimented here with William Kelly’s pneumatic steel converter and rolled the nation’s first commercial Bessemer steel railroad rails in 1867.',
    historicalSignificance:
      'Monumento Histórico Nacional de la ingeniería metalúrgica estadounidense.',
  },
  {
    id: 'phmc-pa-state-capitol-harrisburg-1906',
    title: 'Pennsylvania State Capitol & Eighth Ward Monument',
    cityOrTown: 'Harrisburg',
    countyName: 'Dauphin',
    eventYear: 1906,
    dedicatedYear: 2020,
    category: 'militar_politica',
    position: { lat: 40.2643, lng: -76.8835 },
    plaqueTextEs:
      'Sede del gobierno de la Mancomunidad desde 1812. El Capitolio actual, inaugurado en 1906 por el presidente Theodore Roosevelt, incorpora los murales de Violet Oakley, vitrales de Tiffany y el monumento afroamericano del antiguo Octavo Distrito.',
    plaqueTextEn:
      'Dedicated in 1906 by President Theodore Roosevelt as "the handsomest building I ever saw," the Capitol Complex also honors the historic African American Eighth Ward community and Underground Railroad leaders.',
    historicalSignificance:
      'Corazón legislativo y artístico de la Mancomunidad de Pensilvania junto al río Susquehanna.',
  },
  {
    id: 'phmc-penn-state-founding-1855',
    title: "The Farmers' High School (Penn State Founding, 1855)",
    cityOrTown: 'State College',
    countyName: 'Centre',
    eventYear: 1855,
    dedicatedYear: 1955,
    category: 'inventos',
    position: { lat: 40.7965, lng: -77.8628 },
    plaqueTextEs:
      'Establecida en 1855 en el centro geográfico de Pensilvania por impulso de la Sociedad Agrícola Estatal y terrenos donados por el maestro ferrero James Irvin, aplicando la ciencia experimental a la agricultura y la ingeniería (Ley Morrill Land-Grant en 1863).',
    plaqueTextEn:
      'Chartered in 1855 as the Farmers’ High School of Pennsylvania to apply scientific research to agriculture and industry, becoming Pennsylvania’s sole Morrill Land-Grant university in 1863.',
    historicalSignificance:
      'Cuna de la educación superior científica y pública de alcance estatal en Pensilvania.',
  },
  {
    id: 'phmc-reading-railroad-boone-1833',
    title: 'Philadelphia & Reading Railroad Locomotive Shops',
    cityOrTown: 'Reading',
    countyName: 'Berks',
    eventYear: 1833,
    dedicatedYear: 1983,
    category: 'industria',
    position: { lat: 40.3356, lng: -75.9269 },
    plaqueTextEs:
      'Incorporado en 1833 para transportar carbón de antracita por el valle del río Schuylkill hacia Filadelfia, el Reading Railroad llegó a ser en 1871 la corporación más grande del mundo y construyó en estos talleres centenares de locomotoras de vapor.',
    plaqueTextEn:
      'Chartered in 1833 to haul anthracite coal down the Schuylkill Valley, the Reading Railroad grew into the largest corporation in the world by 1871 with its massive locomotive shops here in Reading.',
    historicalSignificance:
      'Articuló la red energética y ferroviaria del sureste de Pensilvania.',
  },
  {
    id: 'phmc-lucretia-mott-camp-william-penn-1863',
    title: 'Lucretia Coffin Mott & Camp William Penn (1863)',
    cityOrTown: 'La Mott (Cheltenham)',
    countyName: 'Montgomery',
    eventYear: 1863,
    dedicatedYear: 1978,
    category: 'mujeres_pioneras',
    position: { lat: 40.0681, lng: -75.1408 },
    plaqueTextEs:
      'Residencia de la predicadora cuáquera, abolicionista y coorganizadora de la Convención de Seneca Falls (1848) Lucretia Mott. A pocos pasos operó entre 1863 y 1865 Camp William Penn, el primer y mayor campamento federal de entrenamiento de soldados afroamericanos (USCT).',
    plaqueTextEn:
      'Near the home of Quaker abolitionist and women’s rights pioneer Lucretia Mott stood Camp William Penn (1863–1865), the first federal training ground for nearly 11,000 United States Colored Troops.',
    historicalSignificance:
      'Convergencia histórica de la lucha por el sufragio femenino, la abolición y el servicio militar afroamericano en la Unión.',
  },
  {
    id: 'phmc-anthracite-strike-1902-wilkes-barre',
    title: 'Great Anthracite Coal Strike of 1902 (United Mine Workers)',
    cityOrTown: 'Wilkes-Barre',
    countyName: 'Luzerne',
    eventYear: 1902,
    dedicatedYear: 2002,
    category: 'industria',
    position: { lat: 41.2459, lng: -75.8813 },
    plaqueTextEs:
      'Entre mayo y octubre de 1902, más de 147,000 mineros de antracita liderados por John Mitchell (UMWA) sostuvieron aquí una huelga que llevó al presidente Theodore Roosevelt a mediar por primera vez de forma neutral entre trabajadores y patronal.',
    plaqueTextEn:
      'From May to October 1902, 147,000 anthracite miners led by John Mitchell struck for higher wages and shorter hours, prompting President Theodore Roosevelt’s historic federal arbitration.',
    historicalSignificance:
      'Primera intervención presidencial en EE. UU. para arbitrar equitativamente una disputa laboral en lugar de enviar tropas contra los huelguistas.',
  },
  {
    id: 'phmc-salk-polio-vaccine-1953',
    title: 'Polio Vaccine Discovery — Dr. Jonas Salk (Univ. of Pittsburgh)',
    cityOrTown: 'Pittsburgh',
    countyName: 'Allegheny',
    eventYear: 1953,
    dedicatedYear: 1995,
    category: 'inventos',
    position: { lat: 40.4428, lng: -79.9605 },
    plaqueTextEs:
      'En el Laboratorio de Investigación de Virus del Hospital Municipal de la Universidad de Pittsburgh, el Dr. Jonas Salk y su equipo desarrollaron entre 1948 y 1955 la primera vacuna segura y eficaz contra la poliomielitis, negándose a patentarla para beneficio de la humanidad.',
    plaqueTextEn:
      'Here at the University of Pittsburgh Virus Research Laboratory, Dr. Jonas Salk and his team developed the first safe and effective poliomyelitis vaccine, declared effective on April 12, 1955.',
    historicalSignificance:
      'Uno de los mayores triunfos de la medicina preventiva y la salud pública del siglo XX.',
  },
  {
    id: 'phmc-ida-tarbell-titusville-1857',
    title: 'Ida M. Tarbell (1857–1944) — Pioneering Investigative Journalist',
    cityOrTown: 'Titusville',
    countyName: 'Crawford',
    eventYear: 1904,
    dedicatedYear: 1993,
    category: 'mujeres_pioneras',
    position: { lat: 41.6279, lng: -79.6736 },
    plaqueTextEs:
      'Criada en Titusville durante el auge petrolero y graduada de Allegheny College (Meadville), Ida Tarbell publicó en 1904 "The History of the Standard Oil Company", obra maestra del periodismo de investigación que condujo a la disolución antimonopolio de 1911.',
    plaqueTextEn:
      'Raised here in the Oil Region and educated at Allegheny College, pioneering journalist Ida Tarbell wrote "The History of the Standard Oil Company" (1904), leading to the landmark 1911 Supreme Court antitrust ruling.',
    historicalSignificance:
      'Fundó el periodismo de investigación moderno y la regulación antimonopolio en Estados Unidos.',
  },
  {
    id: 'phmc-carlisle-indian-school-1879',
    title: 'Carlisle Indian Industrial School (1879–1918)',
    cityOrTown: 'Carlisle',
    countyName: 'Cumberland',
    eventYear: 1879,
    dedicatedYear: 2003,
    category: 'derechos_civiles',
    position: { lat: 40.2144, lng: -77.1822 },
    plaqueTextEs:
      'Primer internado federal fuera de las reservas para más de 10,000 niños y jóvenes de 140 naciones indígenas (donde destacó el atleta olímpico Jim Thorpe). Hoy es sitio de memoria histórica sobre el impacto de las políticas de asimilación forzada.',
    plaqueTextEn:
      'Site of the first federally funded off-reservation boarding school (1879–1918) attended by over 10,000 Native American children, including Olympic legend Jim Thorpe; preserved today as a site of conscience and remembrance.',
    historicalSignificance:
      'Lugar fundamental de memoria histórica indígena y derechos culturales en Pensilvania.',
  },
  {
    id: 'phmc-horseshoe-curve-altoona-1854',
    title: 'Horseshoe Curve Engineering Landmark (1854)',
    cityOrTown: 'Altoona',
    countyName: 'Blair',
    eventYear: 1854,
    dedicatedYear: 1954,
    category: 'inventos',
    position: { lat: 40.4998, lng: -78.4831 },
    plaqueTextEs:
      'Inaugurada el 15 de febrero de 1854 por el ingeniero jefe del Pennsylvania Railroad J. Edgar Thomson, esta curva de 220 grados tallada a mano en los Montes Alleghenies permitió a los trenes superar el frente montañoso entre Filadelfia y Pittsburgh.',
    plaqueTextEn:
      'Opened February 15, 1854, by Pennsylvania Railroad Chief Engineer J. Edgar Thomson, this 220-degree railroad curve conquered the steep eastern grade of the Allegheny Mountains.',
    historicalSignificance:
      'Maravilla de la ingeniería ferroviaria civil mundial y objetivo estratégico protegido durante la Segunda Guerra Mundial.',
  },
];
