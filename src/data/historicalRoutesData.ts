export interface RouteWaypoint {
  name: string;
  countyName: string;
  dateOrStep: string;
  position: google.maps.LatLngLiteral;
  description: string;
}

export interface HistoricalRouteItem {
  id: string;
  title: string;
  shortTitle: string;
  eraLabel: string;
  strokeColor: string;
  summary: string;
  historicalContext: string;
  waypoints: RouteWaypoint[];
}

export const HISTORICAL_ROUTES_DATA: HistoricalRouteItem[] = [
  {
    id: 'valley-forge-march-1777',
    title: 'Marcha del Ejército Continental hacia Valley Forge (1777)',
    shortTitle: 'Marcha hacia Valley Forge (1777)',
    eraLabel: 'Otoño – Invierno de 1777',
    strokeColor: '#1D3557',
    summary:
      'Maniobras defensivas de las tropas de George Washington durante la Campaña de Filadelfia antes de establecer el histórico campamento de invierno en Valley Forge.',
    historicalContext:
      'Entre septiembre y diciembre de 1777, el Ejército Continental defendió los vados del río Schuylkill y las colinas de Whitemarsh antes de marchar bajo la nieve hacia Valley Forge el 19 de diciembre.',
    waypoints: [
      {
        name: 'Philadelphia (Defensa del Delaware)',
        countyName: 'Philadelphia',
        dateOrStep: 'Agosto – Septiembre 1777',
        position: { lat: 39.9526, lng: -75.1652 },
        description:
          'El Ejército Continental atraviesa Filadelfia rumbo al suroeste para interceptar el desembarco británico del general William Howe.',
      },
      {
        name: 'Chadds Ford / Batalla de Brandywine',
        countyName: 'Chester',
        dateOrStep: '11 de septiembre de 1777',
        position: { lat: 39.8732, lng: -75.5768 },
        description:
          'Combate de once horas en los vados del arroyo Brandywine; Washington repliega sus fuerzas ordenadamente hacia Chester y el Schuylkill.',
      },
      {
        name: 'Campamento de Paoli',
        countyName: 'Chester',
        dateOrStep: '20 de septiembre de 1777',
        position: { lat: 40.0365, lng: -75.4835 },
        description:
          'Ataque nocturno británico a bayoneta contra la división de Anthony Wayne cerca de Malvern.',
      },
      {
        name: 'Colinas de Whitemarsh',
        countyName: 'Montgomery',
        dateOrStep: 'Noviembre – 8 de diciembre de 1777',
        position: { lat: 40.124, lng: -75.2185 },
        description:
          'Las fortificaciones continentales en Whitemarsh rechazan las escaramuzas británicas antes de iniciar la marcha de invierno.',
      },
      {
        name: 'Campamento de Valley Forge',
        countyName: 'Montgomery',
        dateOrStep: '19 de diciembre de 1777',
        position: { lat: 40.097, lng: -75.4426 },
        description:
          'Llegada al cuartel de invierno donde el barón von Steuben reorganiza e instruye al Ejército Continental.',
      },
    ],
  },
  {
    id: 'gettysburg-campaign-1863',
    title: 'Campaña de Gettysburg en el Valle del Cumberland y Susquehanna (1863)',
    shortTitle: 'Campaña de Gettysburg (1863)',
    eraLabel: 'Junio – Julio de 1863',
    strokeColor: '#9B2226',
    summary:
      'Invasión del sur de Pensilvania a través del valle de Cumberland hasta el río Susquehanna y convergencia de los ejércitos en la encrucijada de Gettysburg.',
    historicalContext:
      'A finales de junio de 1863, las columnas avanzaron por Chambersburg, Carlisle y York (llegando hasta los puentes de Wrightsville sobre el Susquehanna) antes de recibir la orden de concentrarse en Gettysburg el 1 de julio.',
    waypoints: [
      {
        name: 'Chambersburg (Cruce del Valle de Cumberland)',
        countyName: 'Franklin',
        dateOrStep: '24–28 de junio de 1863',
        position: { lat: 39.9376, lng: -77.6611 },
        description:
          'Punto de concentración en la ruta del valle de Cumberland tras cruzar la línea Mason-Dixon.',
      },
      {
        name: 'Carlisle (Amenaza sobre Harrisburg)',
        countyName: 'Cumberland',
        dateOrStep: '27–30 de junio de 1863',
        position: { lat: 40.2015, lng: -77.1889 },
        description:
          'Las columnas alcanzan Carlisle Barracks, a solo 18 millas de la capital estatal en Harrisburg, antes de ser llamadas hacia el sur.',
      },
      {
        name: 'York (Avance hacia el Río Susquehanna)',
        countyName: 'York',
        dateOrStep: '28–29 de junio de 1863',
        position: { lat: 39.9626, lng: -76.7277 },
        description:
          'La división de Jubal Early atraviesa York hacia el puente cubierto de Columbia-Wrightsville, que la milicia de Pensilvania incendia para impedir el cruce.',
      },
      {
        name: 'Gettysburg (Batalla de Tres Días)',
        countyName: 'Adams',
        dateOrStep: '1–3 de julio de 1863',
        position: { lat: 39.8107, lng: -77.2353 },
        description:
          'Diez carreteras convergen en Gettysburg, donde el Ejército del Potomac derrota la ofensiva en Cemetery Ridge.',
      },
    ],
  },
  {
    id: 'underground-railroad-pa',
    title: 'Ruta del Ferrocarril Subterráneo (Underground Railroad) en Pensilvania',
    shortTitle: 'Ferrocarril Subterráneo (1804–1865)',
    eraLabel: 'Siglo XIX · Red Abolicionista',
    strokeColor: '#2A9D8F',
    summary:
      'Red clandestina de casas seguras, iglesias afroamericanas libres y granjas cuáqueras desde la frontera de la línea Mason-Dixon hasta Filadelfia.',
    historicalContext:
      'Tras aprobar en 1780 la primera ley de abolición gradual, Pensilvania se convirtió en el corredor principal hacia la libertad bajo líderes como William Still, Thaddeus Stevens, Lucretia Mott y Harriet Tubman.',
    waypoints: [
      {
        name: 'Gettysburg (Casa de Thaddeus Stevens y Red de McAllister)',
        countyName: 'Adams',
        dateOrStep: 'Frontera Mason-Dixon',
        position: { lat: 39.8309, lng: -77.2311 },
        description:
          'Primer refugio al cruzar desde Maryland a través de South Mountain hacia el molino de McAllister y propiedades abolicionistas.',
      },
      {
        name: 'Columbia y Lancaster (Cruce del Río Susquehanna)',
        countyName: 'Lancaster',
        dateOrStep: 'Corredor del Susquehanna',
        position: { lat: 40.0337, lng: -76.5044 },
        description:
          'En Columbia y Lancaster (donde operaban William Whipper y Thaddeus Stevens), los fugitivos cruzaban el ancho río Susquehanna ocultos en vagones de falso fondo.',
      },
      {
        name: 'Kennett Square (Comunidad Cuáquera de Longwood)',
        countyName: 'Chester',
        dateOrStep: 'Estaciones de Chester County',
        position: { lat: 39.8468, lng: -75.7116 },
        description:
          'Densa red de familias cuáqueras (como Thomas Garrett y los Cox) que brindaban refugio, vestimenta y salvoconductos nocturnos.',
      },
      {
        name: 'Philadelphia (Comité de Vigilancia de William Still)',
        countyName: 'Philadelphia',
        dateOrStep: 'Centro Nacional de la Red',
        position: { lat: 39.944, lng: -75.158 },
        description:
          'Sede de la Sociedad Abolicionista de Pensilvania, la iglesia Mother Bethel AME y la oficina de William Still, "Padre del Ferrocarril Subterráneo".',
      },
    ],
  },
  {
    id: 'pennsylvania-main-line-canal',
    title: 'El Canal Principal de Pensilvania (Main Line of Public Works)',
    shortTitle: 'Canal Principal de PA (1826–1857)',
    eraLabel: 'Era de Canales y Ferrocarril de Portaje (1834)',
    strokeColor: '#D4AF37',
    summary:
      'Proeza de ingeniería de 395 millas que conectó Filadelfia con Pittsburgh combinando ferrocarriles primitivos, canales fluviales y planos inclinados sobre los Alleghenies.',
    historicalContext:
      'Construido entre 1826 y 1834 para competir con el Canal de Erie de Nueva York, redujo el viaje entre Filadelfia y el río Ohio de tres semanas en carromato Conestoga a solo cuatro días.',
    waypoints: [
      {
        name: 'Philadelphia (Inicio del Philadelphia & Columbia Railroad)',
        countyName: 'Philadelphia',
        dateOrStep: 'Milla 0 · Río Schuylkill',
        position: { lat: 39.9526, lng: -75.1652 },
        description:
          'Terminal oriental donde los botes seccionables iniciaban su recorrido sobre vagones ferroviarios hacia el valle de Lancaster.',
      },
      {
        name: 'Columbia (Embarcadero de la División Oriental del Canal)',
        countyName: 'Lancaster',
        dateOrStep: 'Milla 82 · Río Susquehanna',
        position: { lat: 40.0337, lng: -76.5044 },
        description:
          'En la cuenca de Columbia los botes de canal descendían al agua para remontar la ribera oriental del río Susquehanna.',
      },
      {
        name: 'Harrisburg y Confluencia del Río Juniata',
        countyName: 'Dauphin',
        dateOrStep: 'Milla 125 · División Juniata',
        position: { lat: 40.2732, lng: -76.8867 },
        description:
          'Nodo de esclusas en la capital estatal que enlazaba con el pintoresco canal del valle del río Juniata hacia el oeste.',
      },
      {
        name: 'Hollidaysburg (Inicio del Allegheny Portage Railroad)',
        countyName: 'Blair',
        dateOrStep: 'Milla 257 · Pie de los Alleghenies',
        position: { lat: 40.427, lng: -78.3947 },
        description:
          'Aquí las barcazas se izaban mediante 10 planos inclinados accionados por máquinas de vapor para cruzar la cresta de los Montes Alleghenies a 2,334 pies de altitud.',
      },
      {
        name: 'Johnstown (Cuenca de la División Occidental)',
        countyName: 'Cambria',
        dateOrStep: 'Milla 293 · Valle del Conemaugh',
        position: { lat: 40.3267, lng: -78.922 },
        description:
          'Las embarcaciones volvían al agua en la cuenca de Johnstown para descender por los ríos Conemaugh, Kiskiminetas y Allegheny.',
      },
      {
        name: 'Pittsburgh (Forks of the Ohio)',
        countyName: 'Allegheny',
        dateOrStep: 'Milla 395 · Puerta del Oeste',
        position: { lat: 40.4406, lng: -79.9959 },
        description:
          'Terminal occidental donde las mercancías y migrantes embarcaban en barcos de vapor hacia el río Ohio y el Misisipi.',
      },
    ],
  },
];
