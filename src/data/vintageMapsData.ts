export interface VintageMapRecord {
  id: string;
  title: string;
  shortTitle: string;
  cartographer: string;
  year: number;
  repository: string;
  commonsFileTitle: string;
  imageUrl: string;
  fallbackUrl: string;
  bounds: google.maps.LatLngBoundsLiteral;
  recommendedZoom: number;
  regionLabel: string;
  description: string;
  cartographicNotes: string;
}

export const VINTAGE_MAPS_DATA: VintageMapRecord[] = [
  {
    id: 'holme-1687',
    title: 'A Map of the Improved Part of the Province of Pennsilvania in America',
    shortTitle: 'Mapa de Thomas Holme (1687)',
    cartographer: 'Capitán Thomas Holme (Agrimensor General de William Penn)',
    year: 1687,
    repository: 'Library of Congress · Geography and Map Division (LOC 88695890)',
    commonsFileTitle:
      'File:Fac-simile of Holmes-map of the province of Pennsylvania - with the names of the original purchasers from William Penn, begun in 1681. LOC 88695890.jpg',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Fac-simile_of_Holmes-map_of_the_province_of_Pennsylvania_-_with_the_names_of_the_original_purchasers_from_William_Penn%2C_begun_in_1681._LOC_88695890.jpg/1920px-Fac-simile_of_Holmes-map_of_the_province_of_Pennsylvania_-_with_the_names_of_the_original_purchasers_from_William_Penn%2C_begun_in_1681._LOC_88695890.jpg',
    fallbackUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Fac-simile_of_Holmes-map_of_the_province_of_Pennsylvania_-_with_the_names_of_the_original_purchasers_from_William_Penn,_begun_in_1681._LOC_88695890.jpg?width=1600',
    bounds: {
      north: 40.48,
      south: 39.72,
      east: -74.68,
      west: -75.95,
    },
    recommendedZoom: 9,
    regionLabel: 'Sureste de Pensilvania (Bucks, Philadelphia y Chester)',
    description:
      'El primer levantamiento catastral y cartográfico de Pensilvania, encargado por William Penn a su agrimensor general Thomas Holme entre 1681 y 1687. Registra el plano ortogonal original de Filadelfia y las parcelas otorgadas a los "First Purchasers" (primeros compradores cuáqueros) en los tres condados originales.',
    cartographicNotes:
      'Georreferenciado sobre el valle inferior del río Delaware y el río Schuylkill (Philadelphia, Bucks, Chester, Delaware y Montgomery).',
  },
  {
    id: 'howell-1792',
    title: 'A Map of the State of Pennsylvania (Dedicated to Governor Thomas Mifflin)',
    shortTitle: 'Mapa Estatal de Reading Howell (1792)',
    cartographer: 'Reading Howell (Ingeniero y Cartógrafo de Filadelfia)',
    year: 1792,
    repository: 'Library of Congress / Wikimedia Commons Public Domain',
    commonsFileTitle:
      'File:A Map Of The State Of Pennsylvania by Reading Howell, 1792.jpg',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/A_Map_Of_The_State_Of_Pennsylvania_by_Reading_Howell%2C_1792.jpg/1920px-A_Map_Of_The_State_Of_Pennsylvania_by_Reading_Howell%2C_1792.jpg',
    fallbackUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/A_Map_Of_The_State_Of_Pennsylvania_by_Reading_Howell,_1792.jpg?width=1600',
    bounds: {
      north: 42.27,
      south: 39.72,
      east: -74.69,
      west: -80.52,
    },
    recommendedZoom: 7,
    regionLabel: 'Mancomunidad Completa de Pensilvania (Límites de 1792)',
    description:
      'Obra maestra de la cartografía post-revolucionaria dedicada al primer gobernador Thomas Mifflin. Muestra la Mancomunidad recién adquirido el Triángulo de Erie (1792), las cordilleras apalaches sombreadas a buril, los caminos reales, forjas de hierro y las fronteras de los condados a fines del siglo XVIII.',
    cartographicNotes:
      'Georreferenciado sobre la totalidad del Estado de Pensilvania, desde la línea Mason-Dixon (39°43\'N) hasta el paralelo 42°N y el Lago Erie.',
  },
  {
    id: 'gettysburg-1863',
    title: 'Map of the Battle Field of Gettysburg (July 1st, 2nd & 3rd, 1863)',
    shortTitle: 'Mapa de la Batalla de Gettysburg (1863)',
    cartographer: 'U.S. Army Corps of Engineers / Topographical Bureau',
    year: 1863,
    repository: 'Library of Congress Civil War Maps Collection (LOC lva0000068)',
    commonsFileTitle:
      'File:Map of the battle field of Gettysburg, July 1st, 2nd, 3rd 1863 LOC lva0000068.jpg',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Map_of_the_battle_field_of_Gettysburg%2C_July_1st%2C_2nd%2C_3rd_1863_LOC_lva0000068.jpg/1920px-Map_of_the_battle_field_of_Gettysburg%2C_July_1st%2C_2nd%2C_3rd_1863_LOC_lva0000068.jpg',
    fallbackUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c3/Map_of_the_Battle_of_Gettysburg%2C_1863_WDL9566.png',
    bounds: {
      north: 39.872,
      south: 39.768,
      east: -77.185,
      west: -77.285,
    },
    recommendedZoom: 12,
    regionLabel: 'Campo de Batalla de Gettysburg (Adams County)',
    description:
      'Plano topográfico militar levantado inmediatamente después de los combates del 1 al 3 de julio de 1863. Detalla las crestas de Seminary Ridge, Cemetery Ridge, Culp\'s Hill, Devil\'s Den y Little Round Top, así como las posiciones de los cuerpos del Ejército del Potomac y del Ejército del Norte de Virginia.',
    cartographicNotes:
      'Georreferenciado con precisión sobre el municipio de Gettysburg y el Parque Militar Nacional en Adams County.',
  },
];
