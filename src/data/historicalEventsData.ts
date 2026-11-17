export type HistoricalEventCategory = 'proclamation' | 'battle';

export interface HistoricalEventItem {
  id: string;
  title: string;
  shortTitle: string;
  dateLabel: string;
  year: number;
  eraIds: string[];
  countyName: string;
  category: HistoricalEventCategory;
  position: google.maps.LatLngLiteral;
  summary: string;
  historicalImpact: string;
  protagonists: string[];
}

export const HISTORICAL_EVENTS_DATA: HistoricalEventItem[] = [
  {
    id: 'penn-treaty-1682',
    title: 'Tratado de Shackamaxon (Gran Olmo de William Penn)',
    shortTitle: 'Tratado de Shackamaxon (1682)',
    dateLabel: 'Noviembre de 1682',
    year: 1682,
    eraIds: ['1681', '1776', 'present'],
    countyName: 'Philadelphia',
    category: 'proclamation',
    position: { lat: 39.9692, lng: -75.1286 },
    summary:
      'Bajo el Gran Olmo de Shackamaxon a orillas del río Delaware, William Penn y el sachem lenape Tamanend sellaron el histórico tratado de amistad y coexistencia pacífica.',
    historicalImpact:
      'Voltaire lo describió como "el único tratado entre indios y cristianos que no fue jurado con un juramento y el único que nunca fue quebrantado" en vida de Penn.',
    protagonists: ['William Penn', 'Jefe Tamanend (Lenni-Lenape)'],
  },
  {
    id: 'independence-hall-1776',
    title: 'Declaración de Independencia y Constitución en Independence Hall',
    shortTitle: 'Independence Hall (1776)',
    dateLabel: '4 de julio de 1776 · 17 de sept. de 1787',
    year: 1776,
    eraIds: ['1776', 'present'],
    countyName: 'Philadelphia',
    category: 'proclamation',
    position: { lat: 39.9489, lng: -75.15 },
    summary:
      'En la Casa Estatal de Pensilvania (Independence Hall), el Segundo Congreso Continental debatió y firmó la Declaración de Independencia en 1776 y la Constitución Federal en 1787.',
    historicalImpact:
      'Fundación jurídica y política de los Estados Unidos de América; declarado Patrimonio Mundial por la UNESCO.',
    protagonists: [
      'Benjamin Franklin',
      'Thomas Jefferson',
      'George Washington',
      'Robert Morris',
    ],
  },
  {
    id: 'brandywine-battle-1777',
    title: 'Batalla de Brandywine (Campaña de Filadelfia)',
    shortTitle: 'Batalla de Brandywine (1777)',
    dateLabel: '11 de septiembre de 1777',
    year: 1777,
    eraIds: ['1776', 'present'],
    countyName: 'Chester',
    category: 'battle',
    position: { lat: 39.8732, lng: -75.5768 },
    summary:
      'El mayor enfrentamiento terrestre en número de combatientes de toda la Guerra de Independencia (30,000 soldados) en los vados del arroyo Brandywine cerca de Chadds Ford.',
    historicalImpact:
      'Aunque las tropas británicas de William Howe flanquearon a Washington y ocuparon temporalmente Filadelfia, el Ejército Continental evitó su destrucción y demostró capacidad de resistencia.',
    protagonists: [
      'George Washington',
      'Marqués de Lafayette',
      'General William Howe',
    ],
  },
  {
    id: 'valley-forge-1777',
    title: 'Campamento Invernal del Ejército Continental en Valley Forge',
    shortTitle: 'Campamento de Valley Forge (1777)',
    dateLabel: 'Diciembre de 1777 – Junio de 1778',
    year: 1777,
    eraIds: ['1776', 'present'],
    countyName: 'Montgomery',
    category: 'battle',
    position: { lat: 40.097, lng: -75.4426 },
    summary:
      'Campamento estratégico de invierno de 12,000 soldados continentales en la confluencia del arroyo Valley Creek y el río Schuylkill (entre Chester y Montgomery County).',
    historicalImpact:
      'Bajo la instrucción táctica del barón prusiano Friedrich Wilhelm von Steuben y el liderazgo de Washington, las milicias dispersas se transformaron en un ejército profesional unificado.',
    protagonists: [
      'George Washington',
      'Barón von Steuben',
      'Alexander Hamilton',
      'Anthony Wayne',
    ],
  },
  {
    id: 'articles-confederation-york-1777',
    title: 'Adopción de los Artículos de la Confederación en York',
    shortTitle: 'Congreso Continental en York (1777)',
    dateLabel: '15 de noviembre de 1777',
    year: 1777,
    eraIds: ['1776', 'present'],
    countyName: 'York',
    category: 'proclamation',
    position: { lat: 39.9626, lng: -76.7277 },
    summary:
      'Con Filadelfia ocupada por los británicos, el Congreso Continental se instaló durante nueve meses en el tribunal de York, al oeste del río Susquehanna.',
    historicalImpact:
      'Aquí se aprobaron los Artículos de la Confederación (primer documento que usó oficialmente el nombre "Estados Unidos de América") y se ratificó la alianza con Francia.',
    protagonists: ['Henry Laurens', 'John Hancock', 'John Adams'],
  },
  {
    id: 'battle-of-gettysburg-1863',
    title: 'Batalla de Gettysburg — Punto de Inflexión de la Guerra Civil',
    shortTitle: 'Batalla de Gettysburg (Jul 1863)',
    dateLabel: '1 al 3 de julio de 1863',
    year: 1863,
    eraIds: ['1861', 'present'],
    countyName: 'Adams',
    category: 'battle',
    position: { lat: 39.8107, lng: -77.2353 },
    summary:
      'Durante tres días de intensos combates en Cemetery Ridge, Little Round Top y la Carga de Pickett, el Ejército del Potomac (Unión) bajo George G. Meade detuvo la segunda invasión al Norte del general confederado Robert E. Lee.',
    historicalImpact:
      'Fue la batalla más sangrienta en suelo estadounidense (~51,000 bajas entre ambos bandos) y quebró definitivamente la ofensiva estratégica de la Confederación.',
    protagonists: [
      'Mayor General George G. Meade (nacido en linaje de PA)',
      'Mayor General Winfield Scott Hancock (Montgomery County)',
      'General Robert E. Lee',
    ],
  },
  {
    id: 'gettysburg-address-1863',
    title: 'Discurso de Gettysburg (Gettysburg Address)',
    shortTitle: 'Discurso de Gettysburg (Nov 1863)',
    dateLabel: '19 de noviembre de 1863',
    year: 1863,
    eraIds: ['1861', 'present'],
    countyName: 'Adams',
    category: 'proclamation',
    position: { lat: 39.8195, lng: -77.2314 },
    summary:
      'En la consagración del Cementerio Nacional de los Soldados en Gettysburg, invitada y organizada por el gobernador de Pensilvania Andrew Gregg Curtin, Abraham Lincoln pronunció su discurso de 272 palabras.',
    historicalImpact:
      'Redefinió la Guerra Civil como un nuevo nacimiento de la libertad para garantizar que "el gobierno del pueblo, por el pueblo y para el pueblo, no desaparezca de la faz de la tierra".',
    protagonists: ['Abraham Lincoln', 'Gobernador Andrew Gregg Curtin'],
  },
  {
    id: 'burning-of-chambersburg-1864',
    title: 'Quema e Incendio de Chambersburg',
    shortTitle: 'Quema de Chambersburg (1864)',
    dateLabel: '30 de julio de 1864',
    year: 1864,
    eraIds: ['1861', 'present'],
    countyName: 'Franklin',
    category: 'battle',
    position: { lat: 39.9376, lng: -77.6611 },
    summary:
      'La caballería confederada del general John McCausland exigió un rescate de 100,000 dólares en oro o 500,000 en billetes; ante la negativa de la población, incendió más de 500 edificios del centro de Chambersburg.',
    historicalImpact:
      'Única gran ciudad del Norte destruida por el fuego confederado durante toda la Guerra Civil; fue reconstruida con el apoyo de la legislatura de Pensilvania.',
    protagonists: ['Ciudadanos de Chambersburg', 'General John McCausland'],
  },
  {
    id: 'drake-oil-well-1859',
    title: 'Primer Pozo Petrolero Comercial de Edwin Drake en Titusville',
    shortTitle: 'Pozo de Petróleo de Drake (1859)',
    dateLabel: '27 de agosto de 1859',
    year: 1859,
    eraIds: ['1870', 'present'],
    countyName: 'Crawford',
    category: 'proclamation',
    position: { lat: 41.6109, lng: -79.6578 },
    summary:
      'En el valle de Oil Creek, al sur de Titusville (en la frontera entre Crawford y Venango County), el "Coronel" Edwin L. Drake y el herrero Billy Smith perforaron petróleo a 69.5 pies de profundidad.',
    historicalImpact:
      'Inauguró la industria petrolera moderna a escala mundial y desató la primera fiebre del oro negro en el noroeste de Pensilvania.',
    protagonists: ['Edwin L. Drake', 'William "Uncle Billy" Smith'],
  },
  {
    id: 'homestead-strike-1892',
    title: 'Huelga Siderúrgica de Homestead (Batalla del Río Monongahela)',
    shortTitle: 'Huelga de Homestead (1892)',
    dateLabel: '6 de julio de 1892',
    year: 1892,
    eraIds: ['1870', 'present'],
    countyName: 'Allegheny',
    category: 'battle',
    position: { lat: 40.4112, lng: -79.9056 },
    summary:
      'Enfrentamiento armado en las acerías de Homestead (Carnegie Steel Company) entre los trabajadores sindicalizados de la Amalgamated Association of Iron and Steel Workers y 300 agentes de la agencia Pinkerton que desembarcaron por el río Monongahela.',
    historicalImpact:
      'Uno de los conflictos laborales más decisivos en la historia industrial de Estados Unidos, símbolo de las luchas obreras de la Era Dorada.',
    protagonists: [
      'Trabajadores de Homestead',
      'Henry Clay Frick',
      'Andrew Carnegie',
    ],
  },
  {
    id: 'flight-93-shanksville-2001',
    title: 'Memorial Nacional del Vuelo 93 en Shanksville',
    shortTitle: 'Memorial Vuelo 93 (2001)',
    dateLabel: '11 de septiembre de 2001',
    year: 2001,
    eraIds: ['1950', 'present'],
    countyName: 'Somerset',
    category: 'proclamation',
    position: { lat: 40.0528, lng: -78.9044 },
    summary:
      'Lugar sagrado en los campos de Stonycreek Township (cerca de Shanksville, Somerset County) donde los 40 pasajeros y tripulantes del Vuelo 93 impidieron que la aeronave secuestrada alcanzara el Capitolio en Washington D. C.',
    historicalImpact:
      'Monumento Nacional administrado por el Servicio de Parques Nacionales con el Muro de los Nombres y la Torre de las Voces.',
    protagonists: ['40 Pasajeros y Tripulantes del Vuelo 93'],
  },
];
