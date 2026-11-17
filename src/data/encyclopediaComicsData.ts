import { EraId } from '../i18n/translations';
import { RegionId } from './paCountiesData';

export type ComicSceneType =
  | 'forest_river'
  | 'independence_hall'
  | 'underground_railroad'
  | 'gettysburg_hills'
  | 'industrial_boom'
  | 'modern_keystone';

export type ComicPanelSceneId =
  | 'cap1_1'
  | 'cap1_2'
  | 'cap1_3'
  | 'cap1_4'
  | 'cap2_1'
  | 'cap2_2'
  | 'cap2_3'
  | 'cap2_4'
  | 'cap3_1'
  | 'cap3_2'
  | 'cap3_3'
  | 'cap3_4'
  | 'cap4_1'
  | 'cap4_2'
  | 'cap4_3'
  | 'cap4_4'
  | 'cap5_1'
  | 'cap5_2'
  | 'cap5_3'
  | 'cap5_4'
  | 'cap6_1'
  | 'cap6_2'
  | 'cap6_3'
  | 'cap6_4';

export type ComicCharacterId =
  | 'keystone_kid'
  | 'william_penn'
  | 'lenape_chief'
  | 'ben_franklin'
  | 'harriet_conductor'
  | 'abe_lincoln'
  | 'coal_steel_pioneer'
  | 'eniac_scientist';

export type CharacterExpression =
  | 'happy'
  | 'excited'
  | 'determined'
  | 'wise'
  | 'heroic';

export interface ComicCharacterSlot {
  id: ComicCharacterId;
  nameEn: string;
  nameEs: string;
  expression: CharacterExpression;
}

export interface ComicPanelData {
  id: string;
  panelNumber: number;
  sceneId: ComicPanelSceneId;
  scene: ComicSceneType;
  narratorCaptionEn: string;
  narratorCaptionEs: string;
  leftCharacter: ComicCharacterSlot;
  rightCharacter: ComicCharacterSlot;
  leftSpeechEn: string;
  leftSpeechEs: string;
  rightSpeechEn: string;
  rightSpeechEs: string;
  expandedFactTitleEn: string;
  expandedFactTitleEs: string;
  expandedFactBodyEn: string;
  expandedFactBodyEs: string;
}

export interface DirectOfficialSource {
  id: string;
  institution: string;
  titleEn: string;
  titleEs: string;
  url: string;
  domainLabel: string;
}

export interface ComicChapterData {
  id: string;
  chapterNumber: number;
  yearsRange: string;
  eraId: EraId;
  regionId: RegionId;
  featuredCounty: string;
  titleEn: string;
  titleEs: string;
  subtitleEn: string;
  subtitleEs: string;
  summaryEn: string;
  summaryEs: string;
  panels: ComicPanelData[];
  directSources: DirectOfficialSource[];
}

export const ENCYCLOPEDIA_COMICS_CHAPTERS: ComicChapterData[] = [
  // =========================================================================
  // CHAPTER 1 (1681–1682): WELCOME TO PENN'S WOODS!
  // =========================================================================
  {
    id: 'chap-01-penns-woods',
    chapterNumber: 1,
    yearsRange: '1681 – 1682',
    eraId: '1681',
    regionId: 'southeast',
    featuredCounty: 'Philadelphia',
    titleEn: 'Welcome to Penn’s Woods!',
    titleEs: '¡Bienvenido a los Bosques de Penn!',
    subtitleEn:
      'Lenape Homelands, the 1681 Royal Charter & the 3 Original Counties',
    subtitleEs:
      'Pueblos Lenape, la Carta Real de 1681 y los 3 Condados Originales',
    summaryEn:
      'Discover how Indigenous nations stewarded Pennsylvania’s river valleys for millennia and how William Penn launched his "Holy Experiment" along the Delaware River.',
    summaryEs:
      'Descubre cómo las naciones originarias habitaron los valles fluviales y cómo William Penn fundó el "Santo Experimento" con libertad de conciencia y tres condados iniciales.',
    panels: [
      {
        id: 'c1-p1',
        panelNumber: 1,
        sceneId: 'cap1_1',
        scene: 'forest_river',
        narratorCaptionEn:
          'LONG BEFORE 1681 · ALONG THE DELAWARE & SUSQUEHANNA RIVERS...',
        narratorCaptionEs:
          'ANTES DE 1681 · EN LOS VALLES DEL DELAWARE Y EL SUSQUEHANNA...',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'lenape_chief',
          nameEn: 'Chief Tamanend',
          nameEs: 'Jefe Tamanend',
          expression: 'wise',
        },
        leftSpeechEn:
          'Whoa! Did river names like Susquehanna and Allegheny come from Indigenous nations?',
        leftSpeechEs:
          '¡Increíble! ¿Nombres como Susquehanna y Allegheny vienen de los pueblos originarios?',
        rightSpeechEn:
          'Indeed! The Lenape, Susquehannock, and Haudenosaunee blazed the trails across these woods!',
        rightSpeechEs:
          '¡Así es! Los Lenape, Susquehannock y Haudenosaunee trazaron las grandes rutas de esta tierra.',
        expandedFactTitleEn: 'Indigenous Toponymy Across All 67 Counties',
        expandedFactTitleEs: 'Toponimia Indígena en los 67 Condados',
        expandedFactBodyEn:
          'Before European settlement, the Lenni-Lenape (Delaware) lived in the eastern river valley, the Susquehannock along the Susquehanna River, and the Shawnee and Haudenosaunee (Iroquois Confederacy) in the west and north. Counties like Allegheny, Erie, Juniata, Lackawanna, Lehigh, Lycoming, Susquehanna, Tioga, Venango, and Wyoming preserve Indigenous words.',
        expandedFactBodyEs:
          'Antes de la llegada europea, las naciones Lenni-Lenape, Susquehannock, Shawnee y Haudenosaunee gobernaban las cuencas fluviales. Hoy condados como Allegheny, Erie, Juniata, Lackawanna, Lehigh, Lycoming, Susquehanna, Tioga y Wyoming conservan palabras indígenas originales.',
      },
      {
        id: 'c1-p2',
        panelNumber: 2,
        sceneId: 'cap1_2',
        scene: 'forest_river',
        narratorCaptionEn:
          'MARCH 4, 1681 · KING CHARLES II SIGNS THE ROYAL CHARTER',
        narratorCaptionEs:
          '4 DE MARZO DE 1681 · EL REY CARLOS II FIRMA LA CARTA REAL',
        leftCharacter: {
          id: 'william_penn',
          nameEn: 'William Penn',
          nameEs: 'William Penn',
          expression: 'happy',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        leftSpeechEn:
          'I wanted to call it "Sylvania" (Woods), but the King added "Penn" to honor my father, the Admiral!',
        leftSpeechEs:
          '¡Yo quería llamarla "Sylvania" (Bosques), pero el Rey añadió "Penn" en honor a mi padre!',
        rightSpeechEn:
          'And that means "Penn’s Woods"—45,000 square miles for your Quaker Holy Experiment!',
        rightSpeechEs:
          '¡Y así nació "Pennsylvania" (Bosques de Penn), hogar del Santo Experimento cuáquero!',
        expandedFactTitleEn: 'The 1681 Charter & Religious Liberty',
        expandedFactTitleEs: 'La Carta Real de 1681 y la Libertad de Conciencia',
        expandedFactBodyEn:
          'To settle a £16,000 royal debt owed to Admiral Sir William Penn, King Charles II granted William Penn the largest proprietary colony in British North America. Penn’s 1682 Frame of Government guaranteed freedom of worship, fair trial by jury, and a representative assembly.',
        expandedFactBodyEs:
          'Para saldar una deuda real de £16,000 con el almirante Sir William Penn, Carlos II otorgó a su hijo el territorio de Pensilvania. Su Frame of Government de 1682 garantizó la libertad de culto, el juicio por jurado y leyes votadas por el pueblo.',
      },
      {
        id: 'c1-p3',
        panelNumber: 3,
        sceneId: 'cap1_3',
        scene: 'forest_river',
        narratorCaptionEn:
          'NOVEMBER 1682 · BENEATH THE GREAT ELM AT SHACKAMAXON',
        narratorCaptionEs:
          'NOVIEMBRE DE 1682 · BAJO EL GRAN OLMO DE SHACKAMAXON',
        leftCharacter: {
          id: 'william_penn',
          nameEn: 'William Penn',
          nameEs: 'William Penn',
          expression: 'wise',
        },
        rightCharacter: {
          id: 'lenape_chief',
          nameEn: 'Chief Tamanend',
          nameEs: 'Jefe Tamanend',
          expression: 'happy',
        },
        leftSpeechEn:
          'We meet on the broad pathway of good faith and goodwill—no oaths, only mutual respect!',
        leftSpeechEs:
          'Nos encontramos en el camino de la buena fe: ¡sin armas, con respeto y paz duradera!',
        rightSpeechEn:
          'We shall live in love with William Penn and his children as long as the creeks and rivers run!',
        rightSpeechEs:
          '¡Viviremos en hermandad con William Penn mientras corran los ríos y brille el sol!',
        expandedFactTitleEn: 'The Treaty of Shackamaxon (Kensington, Philadelphia)',
        expandedFactTitleEs: 'El Tratado de Shackamaxon junto al Río Delaware',
        expandedFactBodyEn:
          'French philosopher Voltaire famously praised the 1682 Treaty of Shackamaxon between William Penn and Lenape Chief Tamanend as "the only treaty between Indians and Christians that was never sworn to and never broken."',
        expandedFactBodyEs:
          'El filósofo francés Voltaire elogió el Tratado de Shackamaxon de 1682 entre William Penn y el jefe lenape Tamanend como "el único tratado nunca jurado y jamás quebrantado" en vida de Penn.',
      },
      {
        id: 'c1-p4',
        panelNumber: 4,
        sceneId: 'cap1_4',
        scene: 'forest_river',
        narratorCaptionEn:
          'LATE 1682 · THREE ORIGINAL COUNTIES & PHILADELPHIA’S GRID',
        narratorCaptionEs:
          'FINALES DE 1682 · LOS 3 CONDADOS ORIGINALES Y FILADELFIA',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'william_penn',
          nameEn: 'William Penn',
          nameEs: 'William Penn',
          expression: 'excited',
        },
        leftSpeechEn:
          'Look at our Atlas map! In 1682 everything started with just THREE counties in the Southeast!',
        leftSpeechEs:
          '¡Mira el mapa del Atlas! En 1682 todo comenzó con solo TRES condados en el sureste.',
        rightSpeechEn:
          'Philadelphia, Bucks, and Chester! Plus Thomas Holme’s green grid plan with five public squares!',
        rightSpeechEs:
          '¡Philadelphia, Bucks y Chester! Y trazamos Filadelfia con cinco grandes plazas arboladas.',
        expandedFactTitleEn: 'Philadelphia, Bucks & Chester (1682)',
        expandedFactTitleEs: 'Los 3 Condados Matrices de 1682',
        expandedFactBodyEn:
          'In 1682, Penn established Bucks, Philadelphia, and Chester counties along the Delaware River. Surveyor Thomas Holme designed Philadelphia between the Delaware and Schuylkill rivers with five public squares (including Center Square, today’s City Hall), creating the blueprint for American urban grids.',
        expandedFactBodyEs:
          'En 1682, Penn organizó los tres primeros condados: Bucks, Philadelphia y Chester. El agrimensor Thomas Holme diseñó el plano ortogonal de Filadelfia entre los ríos Delaware y Schuylkill con cinco plazas públicas.',
      },
    ],
    directSources: [
      {
        id: 'src-c1-1',
        institution: 'Pennsylvania Historical & Museum Commission (PHMC)',
        titleEn: 'The 1681 Royal Charter of Pennsylvania (Original Archival Record)',
        titleEs: 'Carta Real de Pensilvania de 1681 (Archivo Estatal PHMC)',
        url: 'https://www.pa.gov/agencies/phmc/pa-state-archives.html',
        domainLabel: 'pa.gov',
      },
      {
        id: 'src-c1-2',
        institution: 'Historical Society of Pennsylvania',
        titleEn: 'William Penn Papers & Early Colonial Cartography Collection',
        titleEs: 'Documentos de William Penn y Cartografía Colonial Temprana',
        url: 'https://www.hsp.org',
        domainLabel: 'hsp.org',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 2 (1776–1787): PHILADELPHIA: LIBERTY FACTORY!
  // =========================================================================
  {
    id: 'chap-02-liberty-factory',
    chapterNumber: 2,
    yearsRange: '1776 – 1787',
    eraId: '1776',
    regionId: 'southeast',
    featuredCounty: 'Montgomery',
    titleEn: 'Philadelphia: Liberty Factory!',
    titleEs: '¡Filadelfia, Fábrica de Libertad!',
    subtitleEn:
      'Declaration of Independence, Valley Forge & the U.S. Constitution',
    subtitleEs:
      'Declaración de Independencia, Valley Forge y la Constitución de EE. UU.',
    summaryEn:
      'Follow Benjamin Franklin and Keystone Kid through the American Revolution as Pennsylvania becomes the birthplace of the United States and the "Keystone State".',
    summaryEs:
      'Acompaña a Benjamin Franklin y Keystone Kid durante la Revolución Americana mientras Pensilvania se convierte en cuna de la independencia y "Estado Clave" de la Unión.',
    panels: [
      {
        id: 'c2-p1',
        panelNumber: 1,
        sceneId: 'cap2_1',
        scene: 'independence_hall',
        narratorCaptionEn:
          'JULY 4, 1776 · PENNSYLVANIA STATE HOUSE (INDEPENDENCE HALL)',
        narratorCaptionEs:
          '4 DE JULIO DE 1776 · INDEPENDENCE HALL EN FILADELFIA',
        leftCharacter: {
          id: 'ben_franklin',
          nameEn: 'Benjamin Franklin',
          nameEs: 'Benjamin Franklin',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        leftSpeechEn:
          'Ring the Liberty Bell! The Continental Congress just adopted the Declaration of Independence!',
        leftSpeechEs:
          '¡Que repique la Campana de la Libertad! ¡El Congreso aprobó la Declaración de Independencia!',
        rightSpeechEn:
          'And right here in Philadelphia, you also chaired Pennsylvania’s democratic 1776 Constitution!',
        rightSpeechEs:
          '¡Y aquí mismo en Filadelfia presidiste la Constitución de la Mancomunidad de 1776!',
        expandedFactTitleEn: 'Birthplace of American Democracy (1776)',
        expandedFactTitleEs: 'Cuna de la Democracia Estadounidense (1776)',
        expandedFactBodyEn:
          'By 1776, Pennsylvania had expanded to 11 counties. Inside Independence Hall in Philadelphia, delegates signed both the Declaration of Independence (1776) and the U.S. Constitution (1787), while Pennsylvania adopted the official title "Commonwealth".',
        expandedFactBodyEs:
          'Para 1776, Pensilvania ya contaba con 11 condados. En el Independence Hall de Filadelfia se firmaron la Declaración de Independencia (1776) y la Constitución de EE. UU. (1787), adoptando además el título de "Commonwealth".',
      },
      {
        id: 'c2-p2',
        panelNumber: 2,
        sceneId: 'cap2_2',
        scene: 'independence_hall',
        narratorCaptionEn:
          'SEPT 1777 · LANCASTER & YORK SERVE AS CAPITALS IN EXILE',
        narratorCaptionEs:
          'SEPT. 1777 · LANCASTER Y YORK, CAPITALES DE LA REVOLUCIÓN',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'determined',
        },
        rightCharacter: {
          id: 'ben_franklin',
          nameEn: 'Benjamin Franklin',
          nameEs: 'Benjamin Franklin',
          expression: 'wise',
        },
        leftSpeechEn:
          'Wait—when British troops occupied Philadelphia in 1777, where did the Liberty Bell and Congress go?',
        leftSpeechEs:
          'Cuando las tropas británicas ocuparon Filadelfia en 1777, ¿adónde fueron el Congreso y la Campana?',
        rightSpeechEn:
          'Patriots hid the Liberty Bell in Allentown, and Congress adopted the Articles of Confederation in York!',
        rightSpeechEs:
          '¡Ocultaron la Campana en Allentown y el Congreso sesionó en Lancaster y en York!',
        expandedFactTitleEn: 'Allentown, Lancaster & York in the Revolution',
        expandedFactTitleEs: 'Allentown, Lancaster y York en la Independencia',
        expandedFactBodyEn:
          'In September 1777, farmers hauled the 2,080-pound Liberty Bell by wagon to Zion’s Reformed Church in Allentown (Lehigh County). The Continental Congress met in Lancaster for one day (Sept 27, 1777) and then in York for nine months, where it adopted the Articles of Confederation.',
        expandedFactBodyEs:
          'En septiembre de 1777, la Campana de la Libertad fue ocultada bajo el piso de una iglesia en Allentown (Lehigh). El Congreso Continental sesionó en Lancaster y durante nueve meses en York, donde aprobó los Artículos de la Confederación.',
      },
      {
        id: 'c2-p3',
        panelNumber: 3,
        sceneId: 'cap2_3',
        scene: 'independence_hall',
        narratorCaptionEn:
          'WINTER 1777–1778 · VALLEY FORGE ENCAMPMENT (MONTGOMERY COUNTY)',
        narratorCaptionEs:
          'INVIERNO 1777–1778 · CAMPAMENTO DE VALLEY FORGE (MONTGOMERY)',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'determined',
        },
        rightCharacter: {
          id: 'ben_franklin',
          nameEn: 'Benjamin Franklin',
          nameEs: 'Benjamin Franklin',
          expression: 'heroic',
        },
        leftSpeechEn:
          'Brrr! 12,000 Continental soldiers braved snow and ice at Valley Forge alongside George Washington!',
        leftSpeechEs:
          '¡12,000 soldados continentales resistieron la nieve en Valley Forge junto a George Washington!',
        rightSpeechEn:
          'Baron von Steuben trained them there, turning a weary militia into a victorious professional army!',
        rightSpeechEs:
          '¡Allí el barón von Steuben los entrenó y transformó en un ejército profesional invencible!',
        expandedFactTitleEn: 'Crucible of the Continental Army at Valley Forge',
        expandedFactTitleEs: 'El Crisol del Ejército Continental en Valley Forge',
        expandedFactBodyEn:
          'Located 20 miles northwest of Philadelphia in modern Montgomery County, Valley Forge was the third largest city in the colonies during the winter of 1777–1778, forging the discipline that won American independence.',
        expandedFactBodyEs:
          'Ubicado en el actual condado de Montgomery, el campamento de invierno de Valley Forge (1777–1778) forjó la disciplina militar que permitió triunfar en la Guerra de Independencia.',
      },
      {
        id: 'c2-p4',
        panelNumber: 4,
        sceneId: 'cap2_4',
        scene: 'independence_hall',
        narratorCaptionEn:
          'DECEMBER 12, 1787 · PENNSYLVANIA RATIFIES AS THE 2ND U.S. STATE',
        narratorCaptionEs:
          '12 DE DICIEMBRE DE 1787 · PENSILVANIA, 2.º ESTADO DE LA UNIÓN',
        leftCharacter: {
          id: 'ben_franklin',
          nameEn: 'Benjamin Franklin',
          nameEs: 'Benjamin Franklin',
          expression: 'happy',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        leftSpeechEn:
          'Look at the sun carved on George Washington’s chair—it is a RISING sun for our new Constitution!',
        leftSpeechEs:
          '¡Mira el sol tallado en el sillón de Washington: es un sol NACIENTE para nuestra Constitución!',
        rightSpeechEn:
          'With 18 counties in 1787, Pennsylvania became the "Keystone" holding the 13 states together!',
        rightSpeechEs:
          '¡Con 18 condados en 1787, Pensilvania se convirtió en la "Piedra Angular" (Keystone) de la Unión!',
        expandedFactTitleEn: 'Why Pennsylvania is Called the "Keystone State"',
        expandedFactTitleEs: '¿Por qué Pensilvania es el "Keystone State"?',
        expandedFactBodyEn:
          'Standing geographically in the center of the original 13 states (6 to the north, 6 to the south) and ratifying the U.S. Constitution second on Dec 12, 1787, Pennsylvania became known as the central "Keystone" of the American arch.',
        expandedFactBodyEs:
          'Situada en el centro geográfico de las 13 colonias originales y segunda en ratificar la Constitución Federal el 12 de diciembre de 1787, Pensilvania fue bautizada como la piedra angular ("Keystone") del arco estadounidense.',
      },
    ],
    directSources: [
      {
        id: 'src-c2-1',
        institution: 'U.S. National Archives (Charters of Freedom)',
        titleEn: 'Declaration of Independence (1776) & U.S. Constitution (1787)',
        titleEs: 'Declaración de Independencia (1776) y Constitución de EE. UU. (1787)',
        url: 'https://www.archives.gov/founding-docs',
        domainLabel: 'archives.gov',
      },
      {
        id: 'src-c2-2',
        institution: 'Library of Congress',
        titleEn: 'George Washington Papers & Valley Forge Military Maps (1777–1778)',
        titleEs: 'Mapas Militares de Valley Forge y Papeles de George Washington',
        url: 'https://www.loc.gov',
        domainLabel: 'loc.gov',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 3 (1790–1860): BORDERS, CANALS & SECRET ROUTES!
  // =========================================================================
  {
    id: 'chap-03-borders-freedom',
    chapterNumber: 3,
    yearsRange: '1790 – 1860',
    eraId: '1776',
    regionId: 'southcentral',
    featuredCounty: 'Lancaster',
    titleEn: 'Borders, Canals & Secret Routes!',
    titleEs: 'Fronteras, Canales y Rutas Secretas',
    subtitleEn:
      'Mason–Dixon Line, Erie Triangle, Harrisburg & the Underground Railroad',
    subtitleEs:
      'Línea Mason-Dixon, Triángulo de Erie, Harrisburg y el Ferrocarril Subterráneo',
    summaryEn:
      'Explore how astronomers drew Pennsylvania’s borders, how the Erie Triangle gave the state a Great Lakes port, and how courageous conductors guided freedom seekers north.',
    summaryEs:
      'Explora cómo se trazaron las fronteras actuales de Pensilvania, cómo obtuvo salida al lago Erie y cómo la Ley de Abolición de 1780 impulsó el Ferrocarril Subterráneo.',
    panels: [
      {
        id: 'c3-p1',
        panelNumber: 1,
        sceneId: 'cap3_1',
        scene: 'underground_railroad',
        narratorCaptionEn:
          '1767 & 1780 · THE MASON–DIXON LINE BECOMES FREE SOIL’S BORDER',
        narratorCaptionEs:
          '1767 Y 1780 · LA LÍNEA MASON-DIXON Y LA PRIMERA LEY ABOLICIONISTA',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'wise',
        },
        rightCharacter: {
          id: 'harriet_conductor',
          nameEn: 'Freedom Conductor',
          nameEs: 'Conductora de Libertad',
          expression: 'heroic',
        },
        leftSpeechEn:
          'Astronomers Charles Mason and Jeremiah Dixon used stars to survey our 233-mile southern border!',
        leftSpeechEs:
          '¡Mason y Dixon usaron las estrellas para trazar las 233 millas de nuestra frontera sur!',
        rightSpeechEn:
          'And after PA passed America’s first Gradual Abolition Act in 1780, crossing that line meant HOPE!',
        rightSpeechEs:
          '¡Y tras la primera Ley de Abolición de EE. UU. en Pensilvania (1780), cruzar esa línea significó LIBERTAD!',
        expandedFactTitleEn: '1780 Gradual Abolition Act & Mason–Dixon Line',
        expandedFactTitleEs: 'Ley de Abolición de 1780 y la Línea Mason-Dixon',
        expandedFactBodyEn:
          'On March 1, 1780, the Pennsylvania General Assembly enacted the first legislative abolition of slavery in the Western Hemisphere. Originally surveyed in 1763–1767 to settle the Penn-Calvert border dispute, the Mason–Dixon Line (39°43′ N) became the symbolic divide between slave states and free soil.',
        expandedFactBodyEs:
          'El 1 de marzo de 1780, la Asamblea General de Pensilvania aprobó la primera ley abolicionista de la historia moderna. La Línea Mason-Dixon (trazada entre 1763 y 1767) pasó a dividir las tierras esclavistas del suelo libre del Norte.',
      },
      {
        id: 'c3-p2',
        panelNumber: 2,
        sceneId: 'cap3_2',
        scene: 'underground_railroad',
        narratorCaptionEn:
          'MARCH 3, 1792 · PURCHASING THE ERIE TRIANGLE ON LAKE ERIE',
        narratorCaptionEs:
          '3 DE MARZO DE 1792 · LA COMPRA DEL TRIÁNGULO DE ERIE',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'ben_franklin',
          nameEn: 'PA Surveyor',
          nameEs: 'Agrimensor de PA',
          expression: 'happy',
        },
        leftSpeechEn:
          'Why does northwest Pennsylvania have that cool triangle chimney touching Lake Erie?',
        leftSpeechEs:
          '¿Por qué el noroeste de Pensilvania tiene ese triángulo que toca el lago Erie?',
        rightSpeechEn:
          'In 1792 PA bought 202,187 acres for 75 cents an acre so we’d have our own Great Lakes port!',
        rightSpeechEs:
          '¡En 1792 Pensilvania compró 202,187 acres a 75 centavos por acre para tener puerto en los Grandes Lagos!',
        expandedFactTitleEn: 'The 1792 Erie Triangle & 1812 Harrisburg Capital',
        expandedFactTitleEs: 'El Triángulo de Erie (1792) y Capital en Harrisburg (1812)',
        expandedFactBodyEn:
          'Purchasing the Erie Triangle in 1792 for $151,640.25 gave Pennsylvania 51 miles of Lake Erie shoreline, where Commodore Perry built his War of 1812 fleet. Meanwhile, the state capital moved from Philadelphia to Lancaster (1799) and permanently to Harrisburg (Dauphin County) in 1812.',
        expandedFactBodyEs:
          'La compra del Triángulo de Erie en 1792 por $151,640.25 otorgó a Pensilvania el puerto de Presque Isle. En 1812, la capital estatal se trasladó de forma permanente a Harrisburg (condado de Dauphin) a orillas del río Susquehanna.',
      },
      {
        id: 'c3-p3',
        panelNumber: 3,
        sceneId: 'cap3_3',
        scene: 'underground_railroad',
        narratorCaptionEn:
          '1830s–1860 · FOLLOW THE NORTH STAR ON THE UNDERGROUND RAILROAD',
        narratorCaptionEs:
          '1830–1860 · SIGUIENDO LA ESTRELLA DEL NORTE EN EL FERROCARRIL SUBTERRÁNEO',
        leftCharacter: {
          id: 'harriet_conductor',
          nameEn: 'Harriet & William Still',
          nameEs: 'Harriet y William Still',
          expression: 'determined',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        leftSpeechEn:
          'Keep the lantern low! From Chester, York, and Lancaster to Philadelphia and Erie, safe houses await!',
        leftSpeechEs:
          '¡Sigan la Estrella Polar! Desde Chester, York y Lancaster hasta Filadelfia y Erie hay refugios seguros.',
        rightSpeechEn:
          'And in 1834 Thaddeus Stevens defended the Free Public School Act for every child in PA!',
        rightSpeechEs:
          '¡Y en 1834 Thaddeus Stevens defendió la Ley de Escuelas Públicas Gratuitas para todos!',
        expandedFactTitleEn: 'William Still, Harriet Tubman & Thaddeus Stevens',
        expandedFactTitleEs: 'El Ferrocarril Subterráneo y las Escuelas Públicas (1834)',
        expandedFactBodyEn:
          'Philadelphia abolitionist William Still documented over 800 freedom seekers passing through Pennsylvania stations in Kennett Square (Chester), Columbia (Lancaster), Mercersburg (Franklin), and Williamsport (Lycoming).',
        expandedFactBodyEs:
          'El abolicionista filadelfiano William Still ayudó a más de 800 personas a alcanzar la libertad a través de estaciones secretas en los condados de Chester, Lancaster, Adams, Franklin y Erie.',
      },
      {
        id: 'c3-p4',
        panelNumber: 4,
        sceneId: 'cap3_4',
        scene: 'underground_railroad',
        narratorCaptionEn:
          '1800–1850 · CONESTOGA WAGONS & ALLEGHENY PORTAGE RAILROAD',
        narratorCaptionEs:
          '1800–1850 · CARROMATOS CONESTOGA Y EL CRUCE DE LOS ALLEGHENIES',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'coal_steel_pioneer',
          nameEn: 'Canal Engineer',
          nameEs: 'Ingeniero de Canales',
          expression: 'happy',
        },
        leftSpeechEn:
          'How did pioneers cross the steep Allegheny Mountains between Harrisburg and Pittsburgh?',
        leftSpeechEs:
          '¿Cómo cruzaban los pioneros la cordillera de los Alleghenies entre Harrisburg y Pittsburgh?',
        rightSpeechEn:
          'We built the Main Line Canal and hoisted canal boats right over the mountain on inclined rails!',
        rightSpeechEs:
          '¡Construimos el Canal de Pensilvania y subíamos los barcos por rieles inclinados sobre la montaña!',
        expandedFactTitleEn: '40+ New Counties Carved Across the Frontier',
        expandedFactTitleEs: 'Más de 40 Nuevos Condados entre 1800 y 1850',
        expandedFactBodyEn:
          'Turnpikes, the Conestoga wagon (invented in Lancaster County), and the Allegheny Portage Railroad (1834, Blair/Cambria counties) cut travel time from Philadelphia to Pittsburgh from 23 days to just 4 days, spurring the creation of dozens of western and northern counties.',
        expandedFactBodyEs:
          'El carromato Conestoga (nacido en Lancaster) y el ferrocarril funicular de Allegheny Portage (1834, Blair y Cambria) redujeron el viaje entre Filadelfia y Pittsburgh de 23 días a solo 4 días.',
      },
    ],
    directSources: [
      {
        id: 'src-c3-1',
        institution: 'Pennsylvania State Archives (PHMC)',
        titleEn: '1780 Act for the Gradual Abolition of Slavery & Erie Triangle Deed',
        titleEs: 'Ley de Abolición Gradual de 1780 y Escritura del Triángulo de Erie',
        url: 'https://www.pa.gov/agencies/phmc.html',
        domainLabel: 'pa.gov',
      },
      {
        id: 'src-c3-2',
        institution: 'Library of Congress',
        titleEn: 'William Still’s Underground Railroad Records (Philadelphia, 1872)',
        titleEs: 'Registros del Ferrocarril Subterráneo de William Still (Filadelfia)',
        url: 'https://www.loc.gov',
        domainLabel: 'loc.gov',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 4 (1861–1865): THREE DAYS THAT CHANGED HISTORY: GETTYSBURG
  // =========================================================================
  {
    id: 'chap-04-gettysburg',
    chapterNumber: 4,
    yearsRange: '1861 – 1865',
    eraId: '1861',
    regionId: 'southcentral',
    featuredCounty: 'Adams',
    titleEn: 'Three Days That Changed History: Gettysburg',
    titleEs: 'Tres Días que Cambiaron la Historia: Gettysburg',
    subtitleEn:
      '65 Counties Established, General Meade & Lincoln’s Gettysburg Address',
    subtitleEs:
      '65 Condados Constituidos, el General Meade y el Discurso de Lincoln',
    summaryEn:
      'Stand on the hills of Adams County in July and November 1863 as Pennsylvania defends the Union and Abraham Lincoln redefines democracy.',
    summaryEs:
      'Viaja a las colinas del condado de Adams en julio y noviembre de 1863, cuando Pensilvania defendió la Unión y Abraham Lincoln inmortalizó el gobierno del pueblo.',
    panels: [
      {
        id: 'c4-p1',
        panelNumber: 1,
        sceneId: 'cap4_1',
        scene: 'gettysburg_hills',
        narratorCaptionEn:
          '1861 · PENNSYLVANIA BECOMES THE ARSENAL OF THE UNION',
        narratorCaptionEs:
          '1861 · PENSILVANIA SE CONVIERTE EN EL ARSENAL DE LA UNIÓN',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'determined',
        },
        rightCharacter: {
          id: 'abe_lincoln',
          nameEn: 'President Lincoln',
          nameEs: 'Presidente Lincoln',
          expression: 'wise',
        },
        leftSpeechEn:
          'By 1861, 65 of our 67 counties were already on the map—and Governor Curtin rallied the state!',
        leftSpeechEs:
          '¡En 1861 ya existían 65 de los 67 condados y Pensilvania movilizó más de 360,000 soldados!',
        rightSpeechEn:
          'Pennsylvania’s First Defenders reached Washington first, and your iron and railways sustained the Union!',
        rightSpeechEs:
          '¡Los voluntarios de Pensilvania fueron los primeros en llegar y sus ferrocarriles sostuvieron a la Unión!',
        expandedFactTitleEn: '360,000 Pennsylvanians & Camp Curtin (Harrisburg)',
        expandedFactTitleEs: '360,000 Soldados de Pensilvania y Camp Curtin',
        expandedFactBodyEn:
          'During the Civil War, Pennsylvania supplied over 360,000 Union soldiers (second only to New York), including 8,600 African American United States Colored Troops trained at Camp William Penn in Montgomery County.',
        expandedFactBodyEs:
          'Pensilvania aportó más de 360,000 soldados a la Unión, incluyendo 11 regimientos de tropas afroamericanas entrenadas en Camp William Penn (condado de Montgomery), además del acero y carbón de Pittsburgh y Scranton.',
      },
      {
        id: 'c4-p2',
        panelNumber: 2,
        sceneId: 'cap4_2',
        scene: 'gettysburg_hills',
        narratorCaptionEn:
          'JUNE 30, 1863 · CAVALRY CLASH IN HANOVER & MARCH TO GETTYSBURG',
        narratorCaptionEs:
          '30 DE JUNIO DE 1863 · DEFENSA DEL VALLE DEL SUSQUEHANNA',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'abe_lincoln',
          nameEn: 'Gen. George Meade',
          nameEs: 'Gral. George Meade',
          expression: 'determined',
        },
        leftSpeechEn:
          'Confederate forces crossed the Mason–Dixon Line into Franklin, Cumberland, York, and Adams counties!',
        leftSpeechEs:
          '¡Las tropas confederadas cruzaron la Línea Mason-Dixon hacia Franklin, York y Adams!',
        rightSpeechEn:
          'We burned the Wrightsville bridge to protect Harrisburg and converged on the crossroads of Gettysburg!',
        rightSpeechEs:
          '¡Protegimos el río Susquehanna en Wrightsville y concentramos el Ejército del Potomac en Gettysburg!',
        expandedFactTitleEn: 'The Invasion of Southern Pennsylvania (June 1863)',
        expandedFactTitleEs: 'La Campaña de Pensilvania (Junio–Julio de 1863)',
        expandedFactBodyEn:
          'When General Robert E. Lee’s army invaded southern Pennsylvania in June 1863, Union militia burned the 1.25-mile covered bridge between Wrightsville (York County) and Columbia (Lancaster County) to block an attack on the state capital at Harrisburg.',
        expandedFactBodyEs:
          'Durante la invasión de junio de 1863, la milicia quemó el puente cubierto entre Wrightsville (York) y Columbia (Lancaster) sobre el río Susquehanna para impedir el avance hacia la capital estatal en Harrisburg.',
      },
      {
        id: 'c4-p3',
        panelNumber: 3,
        sceneId: 'cap4_3',
        scene: 'gettysburg_hills',
        narratorCaptionEn:
          'JULY 1–3, 1863 · LITTLE ROUND TOP & CEMETERY RIDGE (ADAMS COUNTY)',
        narratorCaptionEs:
          '1 AL 3 DE JULIO DE 1863 · LA BATALLA DECISIVA DE GETTYSBURG',
        leftCharacter: {
          id: 'abe_lincoln',
          nameEn: 'Gen. Meade & Hancock',
          nameEs: 'Meade y Hancock',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        leftSpeechEn:
          'Hold the line on Cemetery Ridge and Little Round Top! The Union stands firm on Pennsylvania soil!',
        leftSpeechEs:
          '¡Mantengan firme la línea en Cemetery Ridge y Little Round Top! ¡La Unión resiste en suelo de Pensilvania!',
        rightSpeechEn:
          'Both Union commanders—George Gordon Meade and Winfield Scott Hancock—were Pennsylvanians!',
        rightSpeechEs:
          '¡Ambos generales clave de la Unión, George G. Meade y Winfield Scott Hancock, eran de Pensilvania!',
        expandedFactTitleEn: 'Turning Point of the Civil War in Adams County',
        expandedFactTitleEs: 'El Punto de Inflexión de la Guerra Civil en Adams County',
        expandedFactBodyEn:
          'Over three days (July 1–3, 1863) around the county seat of Gettysburg in Adams County, 93,000 Union soldiers under General Meade defeated 71,000 Confederate troops, marking the "High Water Mark of the Confederacy."',
        expandedFactBodyEs:
          'Durante tres días (1 al 3 de julio de 1863) en el condado de Adams, el Ejército de la Unión al mando del general George G. Meade repelió el asalto final ("Pickett’s Charge"), cambiando para siempre el curso de la guerra.',
      },
      {
        id: 'c4-p4',
        panelNumber: 4,
        sceneId: 'cap4_4',
        scene: 'gettysburg_hills',
        narratorCaptionEn:
          'NOVEMBER 19, 1863 · 272 WORDS THAT IMMORTALIZED DEMOCRACY',
        narratorCaptionEs:
          '19 DE NOVIEMBRE DE 1863 · LAS 272 PALABRAS DE ABRAHAM LINCOLN',
        leftCharacter: {
          id: 'abe_lincoln',
          nameEn: 'Abraham Lincoln',
          nameEs: 'Abraham Lincoln',
          expression: 'wise',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'happy',
        },
        leftSpeechEn:
          '"...that government of the people, by the people, for the people, shall not perish from the earth."',
        leftSpeechEs:
          '"...que el gobierno del pueblo, por el pueblo y para el pueblo, no desaparezca de la tierra."',
        rightSpeechEn:
          'Just two minutes long, yet it connected 1863 directly back to Philadelphia’s 1776 promise of equality!',
        rightSpeechEs:
          '¡En solo dos minutos, Lincoln unió el sacrificio de 1863 con la promesa de igualdad de 1776!',
        expandedFactTitleEn: 'The Gettysburg Address (Soldiers’ National Cemetery)',
        expandedFactTitleEs: 'El Discurso de Gettysburg en el Cementerio Nacional',
        expandedFactBodyEn:
          'Commissioned by PA Governor Andrew Curtin and local attorney David Wills, Soldiers’ National Cemetery in Gettysburg was dedicated on November 19, 1863, where President Lincoln delivered his 272-word address calling for "a new birth of freedom."',
        expandedFactBodyEs:
          'Impulsado por el gobernador de Pensilvania Andrew Curtin, el Cementerio Nacional de Gettysburg fue consagrado el 19 de noviembre de 1863 con el célebre discurso de 272 palabras del presidente Lincoln.',
      },
    ],
    directSources: [
      {
        id: 'src-c4-1',
        institution: 'Library of Congress',
        titleEn: 'Abraham Lincoln’s Gettysburg Address (Nicolay & Hay Manuscripts, 1863)',
        titleEs: 'Manuscritos Originales del Discurso de Gettysburg (Library of Congress)',
        url: 'https://www.loc.gov/exhibits/gettysburg-address/',
        domainLabel: 'loc.gov',
      },
      {
        id: 'src-c4-2',
        institution: 'National Archives & PHMC',
        titleEn: 'Official Battle of Gettysburg Maps & Pennsylvania Civil War Muster Rolls',
        titleEs: 'Mapas Oficiales de la Batalla de Gettysburg y Archivos de la Guerra Civil',
        url: 'https://www.archives.gov',
        domainLabel: 'archives.gov',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 5 (1859–1930): FULL STEAM AHEAD: COAL, STEEL & OIL!
  // =========================================================================
  {
    id: 'chap-05-industrial-titans',
    chapterNumber: 5,
    yearsRange: '1859 – 1930',
    eraId: '1870',
    regionId: 'western',
    featuredCounty: 'Allegheny',
    titleEn: 'Full Steam Ahead: Coal, Steel & Oil!',
    titleEs: '¡Carbón, Acero y Petróleo a Todo Vapor!',
    subtitleEn:
      'Titusville Oil, Scranton Anthracite (67th County) & Pittsburgh Steel',
    subtitleEs:
      'Petróleo en Titusville, Antracita en Scranton (Condado 67) y Acero en Pittsburgh',
    summaryEn:
      'See how Pennsylvania powered the modern world with the first oil well, 99% of America’s anthracite coal, 60% of its steel, and the birth of the 67th county!',
    summaryEs:
      'Observa cómo Pensilvania impulsó la revolución industrial mundial con el primer pozo petrolero, el carbón antracita, el acero de Pittsburgh y la creación del condado 67.',
    panels: [
      {
        id: 'c5-p1',
        panelNumber: 1,
        sceneId: 'cap5_1',
        scene: 'industrial_boom',
        narratorCaptionEn:
          'AUGUST 27, 1859 · TITUSVILLE (CRAWFORD / VENANGO COUNTIES)',
        narratorCaptionEs:
          '27 DE AGOSTO DE 1859 · POZO DE DRAKE EN TITUSVILLE',
        leftCharacter: {
          id: 'coal_steel_pioneer',
          nameEn: 'Col. Edwin Drake',
          nameEs: 'Cnel. Edwin Drake',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'happy',
        },
        leftSpeechEn:
          'Eureka! At 69.5 feet deep along Oil Creek, we struck liquid "Black Gold" with a steam drill!',
        leftSpeechEs:
          '¡Eureka! A 69.5 pies de profundidad junto a Oil Creek perforamos el primer pozo de petróleo del mundo.',
        rightSpeechEn:
          'That single well in Northwest PA launched the modern global petroleum energy era!',
        rightSpeechEs:
          '¡Ese pozo en el noroeste de Pensilvania inauguró la era energética moderna en todo el planeta!',
        expandedFactTitleEn: 'Birth of the Petroleum Industry in Oil Creek Valley',
        expandedFactTitleEs: 'Nacimiento de la Industria Petrolera Mundial (1859)',
        expandedFactBodyEn:
          'Before Texas or Arabia, Northwest Pennsylvania (Crawford, Venango, McKean, and Warren counties) produced nearly all of the world’s oil between 1859 and the 1890s, creating boomtowns like Titusville, Oil City, and Bradford.',
        expandedFactBodyEs:
          'Entre 1859 y la década de 1890, el noroeste de Pensilvania (condados de Crawford, Venango, McKean y Warren) produjo la mayor parte del petróleo mundial en torno a Titusville y Oil City.',
      },
      {
        id: 'c5-p2',
        panelNumber: 2,
        sceneId: 'cap5_2',
        scene: 'industrial_boom',
        narratorCaptionEn:
          'AUGUST 13, 1878 · LACKAWANNA BECOMES THE 67TH & FINAL COUNTY!',
        narratorCaptionEs:
          '13 DE AGOSTO DE 1878 · ¡NACE LACKAWANNA, EL CONDADO NÚMERO 67!',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'coal_steel_pioneer',
          nameEn: 'Anthracite Miner',
          nameEs: 'Minero de Antracita',
          expression: 'happy',
        },
        leftSpeechEn:
          'Pop quiz! Which county was the 67th and very last county created on Pennsylvania’s map?',
        leftSpeechEs:
          '¡Pregunta de trivia! ¿Cuál fue el condado número 67 y último en completarse en nuestro mapa?',
        rightSpeechEn:
          'Lackawanna County in 1878, with Scranton as its seat—the "Electric City" & Anthracite Capital!',
        rightSpeechEs:
          '¡El condado de Lackawanna en 1878, con sede en Scranton, capital del carbón antracita y del tranvía eléctrico!',
        expandedFactTitleEn: 'Why Pennsylvania Has Exactly 67 Counties since 1878',
        expandedFactTitleEs: 'Cómo se Completaron los 67 Condados en 1878',
        expandedFactBodyEn:
          'Northeastern Pennsylvania (Luzerne, Lackawanna, Schuylkill, Carbon, Northumberland) holds 99% of North America’s clean-burning hard anthracite coal. Scranton’s boom led voters to split Lackawanna from northern Luzerne on August 13, 1878, completing the 67 counties.',
        expandedFactBodyEs:
          'El noreste de Pensilvania concentra casi toda la reserva de carbón antracita de América del Norte. El rápido crecimiento de Scranton llevó a separar Lackawanna del norte de Luzerne el 13 de agosto de 1878.',
      },
      {
        id: 'c5-p3',
        panelNumber: 3,
        sceneId: 'cap5_3',
        scene: 'industrial_boom',
        narratorCaptionEn:
          '1875–1920 · PITTSBURGH STEEL & THE HORSE SHOE CURVE',
        narratorCaptionEs:
          '1875–1920 · EL ACERO DE PITTSBURGH Y EL FERROCARRIL DE PENSILVANIA',
        leftCharacter: {
          id: 'coal_steel_pioneer',
          nameEn: 'Pittsburgh Steelworker',
          nameEs: 'Siderúrgico de Pittsburgh',
          expression: 'determined',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        leftSpeechEn:
          'From the Edgar Thomson Works in Braddock to Bethlehem Steel, PA forged the Brooklyn Bridge and skyscrapers!',
        leftSpeechEs:
          '¡Desde las acerías de Pittsburgh y Bethlehem forjamos puentes, rascacielos y barcos para todo el mundo!',
        rightSpeechEn:
          'And the Pennsylvania Railroad’s famous Horseshoe Curve in Blair County connected East and West!',
        rightSpeechEs:
          '¡Y la famosa Curva de la Herradura (Horseshoe Curve) en Altoona conectó el Atlántico con el Medio Oeste!',
        expandedFactTitleEn: '60% of U.S. Steel & Census Surge to 9.6 Million',
        expandedFactTitleEs: 'El 60% del Acero de EE. UU. y el Auge Demográfico',
        expandedFactBodyEn:
          'By 1910, Allegheny County and the Monongahela Valley produced nearly 60% of the nation’s steel. Millions of immigrants from Italy, Poland, Ireland, Germany, Slovakia, and Lithuania—along with Black families in the Great Migration—built Pennsylvania’s industrial cities.',
        expandedFactBodyEs:
          'Para 1910, el condado de Allegheny producía cerca del 60% del acero estadounidense. Millones de trabajadores europeos y afroamericanos multiplicaron la población de Pensilvania de 3.5 millones (1870) a 9.6 millones (1930).',
      },
      {
        id: 'c5-p4',
        panelNumber: 4,
        sceneId: 'cap5_4',
        scene: 'industrial_boom',
        narratorCaptionEn:
          '1915–1920 · THE JUSTICE BELL TOURS ALL 67 COUNTIES!',
        narratorCaptionEs:
          '1915–1920 · ¡LA CAMPANA DE LA JUSTICIA RECORRE LOS 67 CONDADOS!',
        leftCharacter: {
          id: 'harriet_conductor',
          nameEn: 'PA Suffragist',
          nameEs: 'Sufragista de PA',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'happy',
        },
        leftSpeechEn:
          'We drove our 2,000-pound bronze Justice Bell 5,000 miles across every single one of PA’s 67 counties!',
        leftSpeechEs:
          '¡Llevamos la Campana de la Justicia de 2,000 libras por 5,000 millas a través de los 67 condados!',
        rightSpeechEn:
          'And in 1919 Pennsylvania ratified the 19th Amendment so women could vote across America!',
        rightSpeechEs:
          '¡Y en junio de 1919 Pensilvania ratificó la 19.ª Enmienda garantizando el voto femenino!',
        expandedFactTitleEn: 'Women’s Suffrage & Civic Reform in the Commonwealth',
        expandedFactTitleEs: 'Sufragio Femenino y Derechos Laborales en Pensilvania',
        expandedFactBodyEn:
          'Cast in 1915 as a replica of the Liberty Bell with its clapper chained silent until women won the vote, the Justice Bell toured all 67 counties on a flatbed truck and rang triumphantly at Independence Square in 1920.',
        expandedFactBodyEs:
          'Fundida en 1915 con su badajo encadenado hasta conquistar el voto femenino, la Campana de la Justicia recorrió los 67 condados de Pensilvania y repicó en libertad frente al Independence Hall en 1920.',
      },
    ],
    directSources: [
      {
        id: 'src-c5-1',
        institution: 'U.S. Census Bureau (Historical Decennial Census)',
        titleEn: 'Pennsylvania County Population & Industrial Statistics (1790–Present)',
        titleEs: 'Estadísticas Censales e Industriales por Condado (U.S. Census Bureau)',
        url: 'https://www.census.gov',
        domainLabel: 'census.gov',
      },
      {
        id: 'src-c5-2',
        institution: 'Pennsylvania Historical & Museum Commission (PHMC)',
        titleEn: 'Drake Well Museum, Railroad Museum of PA & Anthracite Heritage Trail',
        titleEs: 'Museo del Pozo Drake, Museo Ferroviario de PA y Ruta de la Antracita',
        url: 'https://www.pa.gov/agencies/phmc.html',
        domainLabel: 'pa.gov',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 6 (1930–PRESENT): 67 COUNTIES & THE FUTURE OF PENNSYLVANIA
  // =========================================================================
  {
    id: 'chap-06-modern-keystone',
    chapterNumber: 6,
    yearsRange: '1930 – Present',
    eraId: 'present',
    regionId: 'northeast',
    featuredCounty: 'Lackawanna',
    titleEn: '67 Counties & The Future of Pennsylvania',
    titleEs: '67 Condados y el Futuro de Pensilvania',
    subtitleEn:
      'ENIAC Computer, PHMC Blue & Gold Plaques, 13M Citizens & Clean Innovation',
    subtitleEs:
      'La Computadora ENIAC, Placas PHMC, 13 Millones de Habitantes e Innovación',
    summaryEn:
      'Celebrate modern Pennsylvania: from the birth of the digital computer age in Philadelphia to environmental rights, vibrant bilingual communities, and 67 counties united!',
    summaryEs:
      'Celebra la Pensilvania actual: desde el nacimiento de la primera computadora electrónica en Filadelfia hasta la reconversión tecnológica, el patrimonio PHMC y su diversidad bilingüe.',
    panels: [
      {
        id: 'c6-p1',
        panelNumber: 1,
        sceneId: 'cap6_1',
        scene: 'modern_keystone',
        narratorCaptionEn:
          'FEBRUARY 1946 · UNIVERSITY OF PENNSYLVANIA (PHILADELPHIA)',
        narratorCaptionEs:
          'FEBRERO DE 1946 · UNIVERSIDAD DE PENSILVANIA (FILADELFIA)',
        leftCharacter: {
          id: 'eniac_scientist',
          nameEn: 'ENIAC Programmer',
          nameEs: 'Programadora ENIAC',
          expression: 'excited',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'happy',
        },
        leftSpeechEn:
          'Meet ENIAC! With 18,000 vacuum tubes and six pioneering women programmers, we just booted the Digital Age!',
        leftSpeechEs:
          '¡Conoce a ENIAC! Con 18,000 tubos de vacío y seis mujeres programadoras pioneras, ¡iniciamos la Era Digital!',
        rightSpeechEn:
          'Every smartphone and laptop we use to explore Keystone ChronoMap traces its roots to Philadelphia!',
        rightSpeechEs:
          '¡Cada computadora y tableta con la que exploramos hoy Keystone ChronoMap nació en Filadelfia!',
        expandedFactTitleEn: 'ENIAC (1946) & The Six Women Pioneers of Computing',
        expandedFactTitleEs: 'ENIAC (1946): La Primera Computadora Electrónica Digital',
        expandedFactBodyEn:
          'Built at the University of Pennsylvania’s Moore School of Electrical Engineering by J. Presper Eckert and John Mauchly, ENIAC was programmed by Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Meltzer, Fran Bilas, and Ruth Lichterman.',
        expandedFactBodyEs:
          'Construida en la Universidad de Pensilvania en Filadelfia en 1946, la computadora ENIAC fue programada por seis matemáticas pioneras, dando origen al software moderno.',
      },
      {
        id: 'c6-p2',
        panelNumber: 2,
        sceneId: 'cap6_2',
        scene: 'modern_keystone',
        narratorCaptionEn:
          'MAY 18, 1971 · THE ENVIRONMENTAL RIGHTS AMENDMENT (ART. I, SEC. 27)',
        narratorCaptionEs:
          '18 DE MAYO DE 1971 · LA ENMIENDA CONSTITUCIONAL AMBIENTAL',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'eniac_scientist',
          nameEn: 'Civic Conservationist',
          nameEs: 'Conservacionista Cívica',
          expression: 'wise',
        },
        leftSpeechEn:
          'Did you know Pennsylvania’s Constitution guarantees every citizen the right to clean air and pure water?',
        leftSpeechEs:
          '¿Sabías que la Constitución de Pensilvania garantiza el derecho a aire limpio y agua pura?',
        rightSpeechEn:
          'Yes! Plus preservation of our natural, scenic, historic, and esthetic values for generations to come!',
        rightSpeechEs:
          '¡Sí! El Artículo I, Sección 27 protege nuestros bosques, ríos y monumentos históricos para el futuro.',
        expandedFactTitleEn: '124 State Parks & Constitutional Conservation',
        expandedFactTitleEs: '124 Parques Estatales y Protección Constitucional',
        expandedFactBodyEn:
          'Following the work of conservation pioneers Gifford Pinchot, Mira Lloyd Dock, and Rachel Carson (born in Springdale, Allegheny County), Pennsylvania voters ratified Article I, Section 27 in 1971 by a 4-to-1 margin.',
        expandedFactBodyEs:
          'Inspirada por pioneros como Gifford Pinchot, Mira Lloyd Dock y la bióloga Rachel Carson (nacida en el condado de Allegheny), Pensilvania consagró en 1971 el derecho constitucional al medio ambiente sano.',
      },
      {
        id: 'c6-p3',
        panelNumber: 3,
        sceneId: 'cap6_3',
        scene: 'modern_keystone',
        narratorCaptionEn:
          'TODAY · 13.0 MILLION RESIDENTS & THRIVING BILINGUAL COMMUNITIES',
        narratorCaptionEs:
          'HOY · 13 MILLONES DE HABITANTES Y COMUNIDADES BILINGÜES VIBRANTES',
        leftCharacter: {
          id: 'eniac_scientist',
          nameEn: 'PA Educator',
          nameEs: 'Docente de PA',
          expression: 'happy',
        },
        rightCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'excited',
        },
        leftSpeechEn:
          'From Pittsburgh’s robotics and meds to Lehigh, Berks, and Lancaster valleys, PA is a $965B hub!',
        leftSpeechEs:
          '¡Desde la robótica y medicina en Pittsburgh hasta Lehigh, Berks y Filadelfia, somos una potencia!',
        rightSpeechEn:
          'And over 1.1 million Hispanic and bilingual Pennsylvanians enrich our schools, culture, and future!',
        rightSpeechEs:
          '¡Y más de 1.1 millones de residentes hispanos y bilingües enriquecen nuestras escuelas y cultura!',
        expandedFactTitleEn: 'Demographic Evolution & Dual-Language Education',
        expandedFactTitleEs: 'Evolución Demográfica y Educación Bilingüe en Pensilvania',
        expandedFactBodyEn:
          'Today Pennsylvania is the 5th most populous U.S. state (13.0 million residents). Dynamic Hispanic and bilingual communities in Lehigh (28.8%), Berks (25.4%), Monroe (19.6%), Luzerne (17.5%), Philadelphia (16.3%), and Lancaster (12.1%) drive the Commonwealth’s demographic vitality.',
        expandedFactBodyEs:
          'Con 13 millones de habitantes, Pensilvania es el 5.º estado más poblado de EE. UU. El crecimiento de las comunidades bilingües en Lehigh, Berks, Monroe, Luzerne, Philadelphia, York y Lancaster impulsa la vitalidad joven del estado.',
      },
      {
        id: 'c6-p4',
        panelNumber: 4,
        sceneId: 'cap6_4',
        scene: 'modern_keystone',
        narratorCaptionEn:
          'YOUR TURN! · EXPLORE ALL 67 COUNTIES & PLAN YOUR FIELD TRIP!',
        narratorCaptionEs:
          '¡AHORA TE TOCA A TI! · ¡EXPLORA LOS 67 CONDADOS EN EL MAPA!',
        leftCharacter: {
          id: 'keystone_kid',
          nameEn: 'Keystone Kid',
          nameEs: 'Keystone Kid',
          expression: 'heroic',
        },
        rightCharacter: {
          id: 'william_penn',
          nameEn: 'William Penn',
          nameEs: 'William Penn',
          expression: 'happy',
        },
        leftSpeechEn:
          'You did it! Now click any county, blue-and-gold PHMC plaque, or build your own Google Maps Field Trip!',
        leftSpeechEs:
          '¡Lo lograste! Ahora haz clic en cualquier condado, placa azul y oro PHMC o arma tu excursión GPS.',
        rightSpeechEn:
          'History isn’t stuck in the past—every student and citizen writes the next chapter of Pennsylvania!',
        rightSpeechEs:
          '¡La historia sigue viva y cada estudiante escribe el próximo capítulo de Pensilvania!',
        expandedFactTitleEn: '2,500+ Official Blue-and-Gold PHMC Historical Markers',
        expandedFactTitleEs: 'Más de 2,500 Placas Oficiales Azul y Oro de la PHMC',
        expandedFactBodyEn:
          'Since 1914 and 1946, the Pennsylvania Historical and Museum Commission (PHMC) has placed iconic Blue-and-Gold roadside markers across all 67 counties—25 of the most emblematic plaques are interactive right on your Keystone ChronoMap!',
        expandedFactBodyEs:
          'La Comisión Histórica y de Museos de Pensilvania (PHMC) mantiene las emblemáticas placas Azul y Oro en los 67 condados. ¡Explora las 25 placas curadas y planifica tu ruta real en Keystone ChronoMap!',
      },
    ],
    directSources: [
      {
        id: 'src-c6-1',
        institution: 'Pennsylvania Historical & Museum Commission (PHMC)',
        titleEn: 'Official PHMC Historical Marker Database & State Museum of PA',
        titleEs: 'Base de Datos Oficial de Marcadores Históricos PHMC y Museo Estatal',
        url: 'https://www.pa.gov/agencies/phmc.html',
        domainLabel: 'pa.gov',
      },
      {
        id: 'src-c6-2',
        institution: 'U.S. Census Bureau QuickFacts',
        titleEn: 'Pennsylvania & All 67 Counties Live Demographic Profiles',
        titleEs: 'Perfiles Demográficos Oficiales de Pensilvania y sus 67 Condados',
        url: 'https://www.census.gov/quickfacts/PA',
        domainLabel: 'census.gov',
      },
    ],
  },
];
