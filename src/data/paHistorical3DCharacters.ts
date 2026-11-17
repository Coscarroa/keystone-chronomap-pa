export type StageThemeType =
  | 'philadelphia_marble'
  | 'gettysburg_stone'
  | 'industrial_steel'
  | 'keystone_rotunda';

export type HatStyleType =
  | 'none_long_hair'
  | 'colonial_cap'
  | 'quaker_wide_brim'
  | 'stovepipe_top_hat'
  | 'union_kepi'
  | 'miner_carbide_helmet'
  | 'victorian_top_hat'
  | 'fedora_19th'
  | 'naturalist_bob';

export type PropStyleType =
  | 'kite_and_key'
  | 'betsy_ross_flag'
  | 'royal_charter_scroll'
  | 'gettysburg_manuscript'
  | 'union_saber_binoculars'
  | 'locomotive_blueprint'
  | 'labor_gavel_lantern'
  | 'anthracite_pickaxe'
  | 'steel_ibeam'
  | 'silent_spring_binoculars'
  | 'amendment_cane'
  | 'presidential_seal_scroll'
  | 'oil_derrick_model';

export interface Historical3DCallout {
  id: string;
  anchorOffset: [number, number, number];
  label: {
    en: string;
    es: string;
  };
  detail: {
    en: string;
    es: string;
  };
}

export interface Historical3DCharacter {
  id: string;
  name: string;
  years: string;
  wikiTitle: string;
  role: {
    en: string;
    es: string;
  };
  townName: {
    en: string;
    es: string;
  };
  biography: {
    en: string;
    es: string;
  };
  quote: {
    en: string;
    es: string;
  };
  // 3D Sculpt & Material Appearance
  appearance: {
    coatColor: string;
    vestColor: string;
    trimColor: string;
    skinTone: string;
    hairColor: string;
    coatRoughness: number;
    coatMetalness: number;
    isDress?: boolean;
    hasSpectacles?: boolean;
    hasBeard?: boolean;
    hasMustache?: boolean;
    hatStyle: HatStyleType;
    hatColor: string;
    propStyle: PropStyleType;
    heightScale: number;
  };
  callouts: Historical3DCallout[];
  officialSourceUrl: string;
}

export interface County3DStageConfig {
  id: string;
  counties: string[];
  townTitle: {
    en: string;
    es: string;
  };
  stageSubtitle: {
    en: string;
    es: string;
  };
  stageTheme: StageThemeType;
  ambientAccentColor: string;
  characters: Historical3DCharacter[];
}

export const PA_HISTORICAL_3D_STAGES: County3DStageConfig[] = [
  {
    id: 'philadelphia',
    counties: ['Philadelphia', 'Bucks', 'Chester', 'Delaware', 'Montgomery'],
    townTitle: {
      en: 'Philadelphia — Cradle of American Liberty',
      es: 'Filadelfia — Cuna de la Libertad Estadounidense',
    },
    stageSubtitle: {
      en: 'Independence Hall Georgian Marble Rotunda (1682–1787)',
      es: 'Rotonda de Mármol Georgiano del Independence Hall (1682–1787)',
    },
    stageTheme: 'philadelphia_marble',
    ambientAccentColor: '#D4AF37',
    characters: [
      {
        id: 'benjamin-franklin',
        name: 'Benjamin Franklin',
        years: '1706 – 1790',
        wikiTitle: 'Benjamin_Franklin',
        role: {
          en: 'Founding Father, Scientist, Printer & Diplomat',
          es: 'Padre Fundador, Científico, Impresor y Diplomático',
        },
        townName: {
          en: 'Philadelphia, PA',
          es: 'Filadelfia, Pensilvania',
        },
        biography: {
          en: 'Philadelphia’s quintessential polymath. Franklin founded the Library Company of Philadelphia, the University of Pennsylvania, and Pennsylvania Hospital, proved the electrical nature of lightning in 1752, and signed both the Declaration of Independence and the U.S. Constitution.',
          es: 'El polímata por excelencia de Filadelfia. Franklin fundó la Library Company, la Universidad de Pensilvania y el Pennsylvania Hospital, demostró la naturaleza eléctrica del rayo en 1752 y firmó tanto la Declaración de Independencia como la Constitución de EE. UU.',
        },
        quote: {
          en: '"An investment in knowledge pays the best interest."',
          es: '"Una inversión en conocimiento paga el mejor interés."',
        },
        appearance: {
          coatColor: '#4A2C1D',
          vestColor: '#8B6508',
          trimColor: '#D4AF37',
          skinTone: '#E8C3A9',
          hairColor: '#CBD5E1',
          coatRoughness: 0.72,
          coatMetalness: 0.08,
          hasSpectacles: true,
          hatStyle: 'none_long_hair',
          hatColor: '#3E2723',
          propStyle: 'kite_and_key',
          heightScale: 0.98,
        },
        callouts: [
          {
            id: 'bf-spectacles',
            anchorOffset: [0, 1.62, 0.22],
            label: {
              en: 'Bifocal Spectacles (1784)',
              es: 'Lentes Bifocales (1784)',
            },
            detail: {
              en: 'Invented by Franklin to read both French diplomatic dispatches and distant charts.',
              es: 'Inventados por Franklin para leer despachos diplomáticos y mapas distantes.',
            },
          },
          {
            id: 'bf-kite',
            anchorOffset: [0.46, 1.15, 0.25],
            label: {
              en: '1752 Silk Kite & Brass Key',
              es: 'Cometa de Seda y Llave de Bronce (1752)',
            },
            detail: {
              en: 'Conducted in Philadelphia to prove lightning is electricity and invent the lightning rod.',
              es: 'Experimento en Filadelfia que probó la electricidad atmosférica e impulsó el pararrayos.',
            },
          },
        ],
        officialSourceUrl: 'https://www.nps.gov/inde/learn/historyculture/people-benjaminfranklin.htm',
      },
      {
        id: 'betsy-ross',
        name: 'Betsy Ross',
        years: '1752 – 1836',
        wikiTitle: 'Betsy_Ross',
        role: {
          en: 'Philadelphia Upholsterer & Early American Flag Maker',
          es: 'Tapicera de Filadelfia y Creadora de la Primera Bandera de EE. UU.',
        },
        townName: {
          en: 'Arch Street, Philadelphia',
          es: 'Arch Street, Filadelfia',
        },
        biography: {
          en: 'Born Elizabeth Griscom in Philadelphia to a Quaker family, Betsy Ross was a master upholsterer on Arch Street who sewed naval pennants and Revolutionary flags for the Pennsylvania State Navy and Continental Congress in 1776–1777.',
          es: 'Nacida como Elizabeth Griscom en Filadelfia en una familia cuáquera, Betsy Ross fue una maestra tapicera en Arch Street que confeccionó estandartes navales y la bandera de las 13 estrellas para Pensilvania y el Congreso Continental en 1776–1777.',
        },
        quote: {
          en: '"Our hearts are sewing the fabric of a new Republic."',
          es: '"Nuestros corazones cosen el tejido de una nueva República."',
        },
        appearance: {
          coatColor: '#1E3A8A',
          vestColor: '#F8FAFC',
          trimColor: '#B22234',
          skinTone: '#F1CFB6',
          hairColor: '#5C3A21',
          coatRoughness: 0.65,
          coatMetalness: 0.05,
          isDress: true,
          hatStyle: 'colonial_cap',
          hatColor: '#F8FAFC',
          propStyle: 'betsy_ross_flag',
          heightScale: 0.94,
        },
        callouts: [
          {
            id: 'br-flag',
            anchorOffset: [0.48, 1.24, 0.25],
            label: {
              en: '13-Star Circle Flag (1777)',
              es: 'Bandera Circular de 13 Estrellas (1777)',
            },
            detail: {
              en: 'Five-pointed stars arranged in an egalitarian circle representing the 13 colonies.',
              es: 'Estrellas de 5 puntas en círculo igualitario representando las 13 colonias.',
            },
          },
          {
            id: 'br-cap',
            anchorOffset: [0, 1.68, 0.16],
            label: {
              en: 'Colonial Mob Cap',
              es: 'Cofia Colonial de Lino',
            },
            detail: {
              en: 'Traditional 18th-century pleated linen cap worn by Philadelphia artisans.',
              es: 'Cofia tradicional de lino plisado usada por las artesanas de Filadelfia en el siglo XVIII.',
            },
          },
        ],
        officialSourceUrl: 'https://historicphiladelphia.org/betsy-ross-house/',
      },
      {
        id: 'william-penn',
        name: 'William Penn',
        years: '1644 – 1718',
        wikiTitle: 'William_Penn',
        role: {
          en: 'Founder of the Province of Pennsylvania (1681)',
          es: 'Fundador de la Provincia de Pensilvania (1681)',
        },
        townName: {
          en: 'Philadelphia & Pennsbury Manor',
          es: 'Filadelfia y Pennsbury Manor',
        },
        biography: {
          en: 'Granted the Royal Charter of Pennsylvania by King Charles II on March 4, 1681, William Penn launched his "Holy Experiment" of religious freedom, fair trial by jury, peaceful treaty with the Lenape Nation at Shackamaxon, and the grid plan of Philadelphia.',
          es: 'Recibió la Carta Real de Pensilvania del rey Carlos II el 4 de marzo de 1681 e inició su "Santo Experimento" de libertad de conciencia, juicio justo por jurado, tratado de paz con la Nación Lenape y el plano urbano de Filadelfia.',
        },
        quote: {
          en: '"Let the people think they govern and they will be governed."',
          es: '"El verdadero gobierno libre nace de la justicia y la libertad de conciencia."',
        },
        appearance: {
          coatColor: '#1E293B',
          vestColor: '#CBD5E1',
          trimColor: '#D4AF37',
          skinTone: '#EAD2AC',
          hairColor: '#2D1E18',
          coatRoughness: 0.68,
          coatMetalness: 0.1,
          hatStyle: 'quaker_wide_brim',
          hatColor: '#0F172A',
          propStyle: 'royal_charter_scroll',
          heightScale: 1.02,
        },
        callouts: [
          {
            id: 'wp-charter',
            anchorOffset: [0.44, 1.12, 0.28],
            label: {
              en: '1681 Royal Charter & Great Seal',
              es: 'Carta Real de 1681 y Gran Sello',
            },
            detail: {
              en: 'Original vellum charter preserved in the Pennsylvania State Archives in Harrisburg.',
              es: 'Pergamino original conservado en los Archivos Estatales de Pensilvania en Harrisburg.',
            },
          },
          {
            id: 'wp-hat',
            anchorOffset: [0, 1.75, 0.15],
            label: {
              en: 'Quaker Wide-Brimmed Hat',
              es: 'Sombrero Cuáquero de Ala Ancha',
            },
            detail: {
              en: 'Symbol of Quaker egalitarianism; Penn refused to doff his hat even before kings.',
              es: 'Símbolo de igualdad cuáquera; Penn no se quitaba el sombrero ni ante los reyes.',
            },
          },
        ],
        officialSourceUrl: 'https://www.pennsburymanor.org/',
      },
    ],
  },
  {
    id: 'gettysburg',
    counties: ['Adams', 'Franklin', 'Cumberland'],
    townTitle: {
      en: 'Gettysburg — Turning Point of the Union',
      es: 'Gettysburg — Punto de Inflexión de la Unión',
    },
    stageSubtitle: {
      en: 'Cemetery Ridge Stone Wall & Battlefield Diorama (1863)',
      es: 'Muro de Piedra de Cemetery Ridge y Campo de Batalla (1863)',
    },
    stageTheme: 'gettysburg_stone',
    ambientAccentColor: '#3B82F6',
    characters: [
      {
        id: 'abraham-lincoln',
        name: 'Abraham Lincoln',
        years: '1809 – 1865',
        wikiTitle: 'Abraham_Lincoln',
        role: {
          en: '16th President of the United States (Gettysburg Address, Nov 19, 1863)',
          es: '16.º Presidente de los EE. UU. (Discurso de Gettysburg, 19 nov 1863)',
        },
        townName: {
          en: 'Gettysburg, Adams County, PA',
          es: 'Gettysburg, Condado de Adams, PA',
        },
        biography: {
          en: 'On November 19, 1863, President Lincoln traveled to Gettysburg, Pennsylvania, to dedicate the Soldiers’ National Cemetery. In just 272 words, he redefined the American Civil War as a "new birth of freedom" ensuring that government of the people, by the people, for the people shall not perish.',
          es: 'El 19 de noviembre de 1863, el presidente Lincoln viajó a Gettysburg, Pensilvania, para consagrar el Cementerio Nacional de los Soldados. En solo 272 palabras, redefinió la Guerra Civil como un "nuevo nacimiento de la libertad".',
        },
        quote: {
          en: '"That government of the people, by the people, for the people, shall not perish from the earth."',
          es: '"Que el gobierno del pueblo, por el pueblo y para el pueblo, no desaparezca de la faz de la tierra."',
        },
        appearance: {
          coatColor: '#111827',
          vestColor: '#1F2937',
          trimColor: '#D4AF37',
          skinTone: '#E5C2A8',
          hairColor: '#18181B',
          coatRoughness: 0.75,
          coatMetalness: 0.05,
          hasBeard: true,
          hatStyle: 'stovepipe_top_hat',
          hatColor: '#090D16',
          propStyle: 'gettysburg_manuscript',
          heightScale: 1.09,
        },
        callouts: [
          {
            id: 'al-hat',
            anchorOffset: [0, 1.88, 0.14],
            label: {
              en: 'Presidential Silk Stovepipe Hat',
              es: 'Sombrero de Copa Presidencial',
            },
            detail: {
              en: 'Lincoln’s iconic tall black silk hat where he often tucked handwritten speech notes.',
              es: 'Icónico sombrero alto de seda donde Lincoln solía guardar notas manuscritas.',
            },
          },
          {
            id: 'al-address',
            anchorOffset: [0.45, 1.18, 0.25],
            label: {
              en: 'Gettysburg Address Manuscript (272 Words)',
              es: 'Manuscrito del Discurso de Gettysburg (272 Palabras)',
            },
            detail: {
              en: 'Finalized in the David Wills House on Gettysburg’s town square on Nov 18–19, 1863.',
              es: 'Finalizado en la Casa de David Wills en la plaza de Gettysburg el 18–19 de noviembre de 1863.',
            },
          },
        ],
        officialSourceUrl: 'https://www.nps.gov/gett/index.htm',
      },
      {
        id: 'george-meade',
        name: 'General George G. Meade',
        years: '1815 – 1872',
        wikiTitle: 'George_Meade',
        role: {
          en: 'Commander of the Union Army of the Potomac at Gettysburg',
          es: 'Comandante del Ejército de la Unión del Potomac en Gettysburg',
        },
        townName: {
          en: 'Gettysburg & Philadelphia, PA',
          es: 'Gettysburg y Filadelfia, PA',
        },
        biography: {
          en: 'Placed in command of the Army of the Potomac just three days before the Battle of Gettysburg (July 1–3, 1863), Pennsylvanian General George Gordon Meade organized the fishhook defensive line along Cemetery Ridge and repulsed Pickett’s Charge, saving the Union.',
          es: 'Nombrado comandante del Ejército del Potomac apenas tres días antes de la Batalla de Gettysburg (1–3 de julio de 1863), el general pensilvano George Gordon Meade organizó la defensa en Cemetery Ridge y repelió la Carga de Pickett.',
        },
        quote: {
          en: '"Corps and other commanders are authorized to order the instant death of any soldier who fails in his duty at this hour."',
          es: '"Hoy defendemos el suelo natal de Pensilvania y la integridad de la Unión."',
        },
        appearance: {
          coatColor: '#1E3A8A',
          vestColor: '#172554',
          trimColor: '#D4AF37',
          skinTone: '#E5C2A8',
          hairColor: '#4B5563',
          coatRoughness: 0.58,
          coatMetalness: 0.22,
          hasBeard: true,
          hasMustache: true,
          hatStyle: 'union_kepi',
          hatColor: '#1E3A8A',
          propStyle: 'union_saber_binoculars',
          heightScale: 1.01,
        },
        callouts: [
          {
            id: 'gm-uniform',
            anchorOffset: [0, 1.32, 0.24],
            label: {
              en: 'Union Major General Double-Breasted Coat',
              es: 'Casaca Azul de Mayor General de la Unión',
            },
            detail: {
              en: 'Adorned with twin rows of brass eagle buttons and gold-embroidered shoulder straps.',
              es: 'Adornada con doble fila de botones de águila en bronce y charreteras doradas.',
            },
          },
          {
            id: 'gm-saber',
            anchorOffset: [0.46, 1.05, 0.25],
            label: {
              en: 'Cavalry Officer Saber & Field Glasses',
              es: 'Sable de Oficial y Binoculares de Campaña',
            },
            detail: {
              en: 'Used from Little Round Top and Cemetery Ridge to direct Union artillery.',
              es: 'Utilizados desde Little Round Top y Cemetery Ridge para dirigir la artillería.',
            },
          },
        ],
        officialSourceUrl: 'https://www.nps.gov/gett/learn/historyculture/george-g-meade.htm',
      },
    ],
  },
  {
    id: 'scranton-anthracite',
    counties: ['Lackawanna', 'Luzerne', 'Carbon', 'Schuylkill', 'Northumberland'],
    townTitle: {
      en: 'Scranton & Wilkes-Barre — The Anthracite & Electric City',
      es: 'Scranton y Wilkes-Barre — Ciudad Eléctrica y del Carbón Antracita',
    },
    stageSubtitle: {
      en: 'Lackawanna Iron Furnaces & Anthracite Rail Stage (1840–1902)',
      es: 'Hornos de Hierro de Lackawanna y Ferrocarril de Antracita (1840–1902)',
    },
    stageTheme: 'industrial_steel',
    ambientAccentColor: '#F59E0B',
    characters: [
      {
        id: 'george-scranton',
        name: 'George W. Scranton',
        years: '1811 – 1861',
        wikiTitle: 'George_W._Scranton',
        role: {
          en: 'Founder of Scranton Iron Furnaces, DL&W Railroad & U.S. Congressman',
          es: 'Fundador de los Hornos de Hierro de Scranton, Ferrocarril DL&W y Congresista',
        },
        townName: {
          en: 'Scranton, Lackawanna County, PA',
          es: 'Scranton, Condado de Lackawanna, PA',
        },
        biography: {
          en: 'In 1840, George W. Scranton and his partners pioneered anthracite-fired blast furnaces in the Lackawanna Valley, mass-producing the first American iron T-rails for the Erie and Delaware, Lackawanna & Western Railroads and founding the City of Scranton.',
          es: 'En 1840, George W. Scranton y sus socios impulsaron los altos hornos alimentados con carbón antracita en el valle de Lackawanna, fabricando los primeros rieles de hierro en T de EE. UU. y dando origen a la ciudad de Scranton.',
        },
        quote: {
          en: '"With anthracite coal and Pennsylvania iron, we will bind a continent by rail."',
          es: '"Con el carbón antracita y el hierro de Pensilvania, uniremos un continente por ferrocarril."',
        },
        appearance: {
          coatColor: '#1E293B',
          vestColor: '#78350F',
          trimColor: '#D4AF37',
          skinTone: '#E8C5B0',
          hairColor: '#3B2F2F',
          coatRoughness: 0.62,
          coatMetalness: 0.15,
          hatStyle: 'victorian_top_hat',
          hatColor: '#1E293B',
          propStyle: 'locomotive_blueprint',
          heightScale: 1.01,
        },
        callouts: [
          {
            id: 'gs-rail',
            anchorOffset: [0.45, 1.15, 0.25],
            label: {
              en: '1847 Iron T-Rail & DL&W Blueprint',
              es: 'Riel en T de Hierro (1847) y Plano DL&W',
            },
            detail: {
              en: 'Rolled at the Scranton Iron Furnaces, breaking America’s dependence on British rail imports.',
              es: 'Fundido en los Hornos de Scranton, terminando con la dependencia de rieles británicos.',
            },
          },
        ],
        officialSourceUrl: 'https://www.nps.gov/stea/index.htm',
      },
      {
        id: 'terence-powderly',
        name: 'Terence V. Powderly',
        years: '1849 – 1924',
        wikiTitle: 'Terence_V._Powderly',
        role: {
          en: 'Mayor of Scranton (1878–1884) & Grand Master Workman, Knights of Labor',
          es: 'Alcalde de Scranton (1878–1884) y Líder Nacional de los Caballeros del Trabajo',
        },
        townName: {
          en: 'Carbondale & Scranton, PA',
          es: 'Carbondale y Scranton, PA',
        },
        biography: {
          en: 'Born in Carbondale, Lackawanna County, Powderly worked as a railroad machinist before serving three terms as Mayor of Scranton and leading the Knights of Labor, championing the 8-hour workday, mine safety laws, and abolition of child labor across Pennsylvania.',
          es: 'Nacido en Carbondale (Lackawanna), Powderly fue maquinista ferroviario antes de ser elegido tres veces Alcalde de Scranton y liderar los Knights of Labor, impulsando la jornada de 8 horas y leyes de seguridad minera.',
        },
        quote: {
          en: '"Eight hours for work, eight hours for rest, eight hours for what we will!"',
          es: '"¡Ocho horas para trabajar, ocho horas para descansar y ocho horas para lo que soñemos!"',
        },
        appearance: {
          coatColor: '#27272A',
          vestColor: '#451A03',
          trimColor: '#D4AF37',
          skinTone: '#ECCAB3',
          hairColor: '#52525B',
          coatRoughness: 0.66,
          coatMetalness: 0.1,
          hasMustache: true,
          hasSpectacles: true,
          hatStyle: 'fedora_19th',
          hatColor: '#18181B',
          propStyle: 'labor_gavel_lantern',
          heightScale: 0.99,
        },
        callouts: [
          {
            id: 'tp-gavel',
            anchorOffset: [0.44, 1.14, 0.25],
            label: {
              en: '8-Hour Day Charter & Civic Gavel',
              es: 'Carta de la Jornada de 8 Horas y Mazo Cívico',
            },
            detail: {
              en: 'Symbolizing Scranton’s pioneering municipal reforms and American labor rights.',
              es: 'Simboliza las reformas municipales de Scranton y los derechos laborales en EE. UU.',
            },
          },
        ],
        officialSourceUrl: 'https://anthracitemuseum.org/',
      },
      {
        id: 'anthracite-miner',
        name: 'Anthracite Coal Miner Pioneer',
        years: '1869 – 1902 Era',
        wikiTitle: 'Coal_Region',
        role: {
          en: 'Underground Anthracite Collier & Breaker Worker of Northeastern PA',
          es: 'Minero de Carbón Antracita del Noreste de Pensilvania',
        },
        townName: {
          en: 'Lackawanna & Wyoming Valleys, PA',
          es: 'Valles de Lackawanna y Wyoming, PA',
        },
        biography: {
          en: 'Representing the Welsh, Irish, Polish, Slovak, Italian, and Lithuanian immigrant miners who extracted "Black Diamonds" (pure anthracite coal) deep beneath Scranton, Wilkes-Barre, and Hazleton to heat American homes and power the Industrial Revolution.',
          es: 'Tributo a los mineros inmigrantes galeses, irlandeses, polacos, eslovacos, italianos y lituanos que extrajeron el "Diamante Negro" (carbón antracita) bajo Scranton y Wilkes-Barre para impulsar la Revolución Industrial.',
        },
        quote: {
          en: '"Deep beneath the Lackawanna hills, our lamps lit the industrial hearth of America."',
          es: '"Bajo las colinas de Lackawanna, nuestras lámparas encendieron el motor industrial de América."',
        },
        appearance: {
          coatColor: '#334155',
          vestColor: '#1E293B',
          trimColor: '#F59E0B',
          skinTone: '#DEC0A8',
          hairColor: '#27272A',
          coatRoughness: 0.78,
          coatMetalness: 0.18,
          hasMustache: true,
          hatStyle: 'miner_carbide_helmet',
          hatColor: '#451A03',
          propStyle: 'anthracite_pickaxe',
          heightScale: 1.0,
        },
        callouts: [
          {
            id: 'am-lamp',
            anchorOffset: [0, 1.78, 0.22],
            label: {
              en: 'Illuminated Brass Carbide Lamp',
              es: 'Lámpara de Carburo Iluminada en Bronce',
            },
            detail: {
              en: 'Active 3D PointLight beam mounted on a boiled-leather miner’s helmet.',
              es: 'Haz de luz 3D activo montado sobre el casco de cuero endurecido del minero.',
            },
          },
          {
            id: 'am-pick',
            anchorOffset: [0.48, 1.1, 0.25],
            label: {
              en: 'Forged Steel Pickaxe & Black Diamond Coal',
              es: 'Pico de Acero Forjado y Antracita Pura',
            },
            detail: {
              en: 'Used in the deep veins analyzed on the Lackawanna Coal Mine Tour.',
              es: 'Herramienta histórica preservada en el Lackawanna Coal Mine Tour.',
            },
          },
        ],
        officialSourceUrl: 'https://anthracitemuseum.org/',
      },
    ],
  },
  {
    id: 'pittsburgh-allegheny',
    counties: ['Allegheny', 'Westmoreland', 'Beaver', 'Butler', 'Washington'],
    townTitle: {
      en: 'Pittsburgh — Steel City & Ecological Awakening',
      es: 'Pittsburgh — La Ciudad del Acero y la Conciencia Ambiental',
    },
    stageSubtitle: {
      en: 'Three Rivers Bessemer Steel & Allegheny Naturalist Stage',
      es: 'Escenario del Acero Bessemer de los Tres Ríos y el Río Allegheny',
    },
    stageTheme: 'industrial_steel',
    ambientAccentColor: '#F59E0B',
    characters: [
      {
        id: 'andrew-carnegie',
        name: 'Andrew Carnegie',
        years: '1835 – 1919',
        wikiTitle: 'Andrew_Carnegie',
        role: {
          en: 'Founder of Carnegie Steel Company & Global Philanthropist',
          es: 'Fundador de Carnegie Steel Company y Filántropo Mundial',
        },
        townName: {
          en: 'Pittsburgh & Braddock, Allegheny County',
          es: 'Pittsburgh y Braddock, Condado de Allegheny',
        },
        biography: {
          en: 'Starting as a bobbin boy and Pennsylvania Railroad telegraph operator in Pittsburgh, Andrew Carnegie built the Edgar Thomson Steel Works in Braddock (1875) and later donated over $350 million to build 2,509 public libraries, Carnegie Mellon University, and Carnegie Museums of Pittsburgh.',
          es: 'Comenzó como telegrafista del Ferrocarril de Pensilvania en Pittsburgh, fundó la acería Edgar Thomson en Braddock (1875) y luego donó su fortuna para crear 2,509 bibliotecas públicas, la Universidad Carnegie Mellon y los Museos Carnegie.',
        },
        quote: {
          en: '"The man who dies thus rich dies disgraced."',
          es: '"El verdadero propósito de la riqueza es elevar la educación y la cultura de toda la comunidad."',
        },
        appearance: {
          coatColor: '#1F2937',
          vestColor: '#374151',
          trimColor: '#D4AF37',
          skinTone: '#ECC7B0',
          hairColor: '#F1F5F9',
          coatRoughness: 0.6,
          coatMetalness: 0.14,
          hasBeard: true,
          hasMustache: true,
          hatStyle: 'victorian_top_hat',
          hatColor: '#111827',
          propStyle: 'steel_ibeam',
          heightScale: 0.95,
        },
        callouts: [
          {
            id: 'ac-beam',
            anchorOffset: [0.48, 1.12, 0.25],
            label: {
              en: 'Bessemer Structural Steel I-Beam',
              es: 'Viga en I de Acero Estructural Bessemer',
            },
            detail: {
              en: 'Forged in Pittsburgh to build America’s suspension bridges and skyscrapers.',
              es: 'Forjada en Pittsburgh para construir los grandes puentes y rascacielos de EE. UU.',
            },
          },
        ],
        officialSourceUrl: 'https://carnegiemuseums.org/',
      },
      {
        id: 'rachel-carson',
        name: 'Rachel Carson',
        years: '1907 – 1964',
        wikiTitle: 'Rachel_Carson',
        role: {
          en: 'Marine Biologist, Author of Silent Spring & Mother of the Environmental Movement',
          es: 'Bióloga Marina, Autora de Primavera Silenciosa y Pionera Ambiental',
        },
        townName: {
          en: 'Springdale, Allegheny County, PA',
          es: 'Springdale, Condado de Allegheny, PA',
        },
        biography: {
          en: 'Born on a family farm along the Allegheny River in Springdale, Pennsylvania, and educated at Chatham University in Pittsburgh, Rachel Carson published Silent Spring (1962), exposing synthetic pesticide hazards and inspiring the creation of the U.S. EPA and Pennsylvania’s Environmental Rights Amendment.',
          es: 'Nacida junto al río Allegheny en Springdale (Condado de Allegheny) y graduada en Pittsburgh, Rachel Carson publicó Primavera Silenciosa (1962), inspirando el movimiento ecológico moderno y la protección de las aves y ríos.',
        },
        quote: {
          en: '"In nature nothing exists alone."',
          es: '"En la naturaleza nada existe en soledad."',
        },
        appearance: {
          coatColor: '#0F766E',
          vestColor: '#F8FAFC',
          trimColor: '#D4AF37',
          skinTone: '#F2CFB8',
          hairColor: '#5C4033',
          coatRoughness: 0.64,
          coatMetalness: 0.06,
          isDress: false,
          hatStyle: 'naturalist_bob',
          hatColor: '#5C4033',
          propStyle: 'silent_spring_binoculars',
          heightScale: 0.95,
        },
        callouts: [
          {
            id: 'rc-book',
            anchorOffset: [0.45, 1.15, 0.25],
            label: {
              en: 'Silent Spring (1962) & Field Binoculars',
              es: 'Primavera Silenciosa (1962) y Binoculares',
            },
            detail: {
              en: 'Led directly to the ban on DDT and the recovery of the American Bald Eagle.',
              es: 'Condujo a la prohibición del DDT y a la recuperación del águila calva estadounidense.',
            },
          },
        ],
        officialSourceUrl: 'https://www.rachelcarsonhomestead.org/',
      },
    ],
  },
  {
    id: 'lancaster-york',
    counties: ['Lancaster', 'York', 'Dauphin', 'Lebanon', 'Berks'],
    townTitle: {
      en: 'Lancaster & York — Constitutional & Civil Rights Heartland',
      es: 'Lancaster y York — Corazón Constitucional y de los Derechos Civiles',
    },
    stageSubtitle: {
      en: 'Susquehanna Valley Marble & Keystone Rotunda',
      es: 'Rotonda de Mármol y Sello Keystone del Valle del Susquehanna',
    },
    stageTheme: 'keystone_rotunda',
    ambientAccentColor: '#D4AF37',
    characters: [
      {
        id: 'thaddeus-stevens',
        name: 'Thaddeus Stevens',
        years: '1792 – 1868',
        wikiTitle: 'Thaddeus_Stevens',
        role: {
          en: 'U.S. Congressman from Lancaster, Abolitionist & Champion of Public Schools',
          es: 'Congresista por Lancaster, Abolicionista y Defensor de la Educación Pública',
        },
        townName: {
          en: 'Lancaster & Gettysburg, PA',
          es: 'Lancaster y Gettysburg, PA',
        },
        biography: {
          en: 'Practicing law in Gettysburg and Lancaster, Thaddeus Stevens saved Pennsylvania’s Free Public School Act of 1834, operated an active Underground Railroad station beneath his Lancaster office, and led the passage of the 13th and 14th Amendments in Congress.',
          es: 'Abogado en Gettysburg y Lancaster, Thaddeus Stevens salvó la Ley de Escuelas Públicas Gratuitas de Pensilvania (1834), operó una estación del Ferrocarril Subterráneo en Lancaster y lideró las Enmiendas 13.ª y 14.ª en el Congreso.',
        },
        quote: {
          en: '"I repose in this quiet and secluded spot, to illustrate in my death the Principles which I advocated through a long life: Equality of Man before his Creator."',
          es: '"Ilustro con mi vida y mi descanso final el principio que defendí siempre: la Igualdad de todo ser humano ante su Creador."',
        },
        appearance: {
          coatColor: '#18181B',
          vestColor: '#3F3F46',
          trimColor: '#D4AF37',
          skinTone: '#E5C3A8',
          hairColor: '#3E2723',
          coatRoughness: 0.7,
          coatMetalness: 0.08,
          hatStyle: 'none_long_hair',
          hatColor: '#3E2723',
          propStyle: 'amendment_cane',
          heightScale: 1.01,
        },
        callouts: [
          {
            id: 'ts-amendment',
            anchorOffset: [0.46, 1.12, 0.25],
            label: {
              en: '13th & 14th Amendments + Walking Cane',
              es: 'Enmiendas 13.ª y 14.ª + Bastón de Estadista',
            },
            detail: {
              en: 'Authored equal protection under the law and defended free public schools in PA.',
              es: 'Impulsó la igualdad ante la ley y la educación pública gratuita en Pensilvania.',
            },
          },
        ],
        officialSourceUrl: 'https://www.thaddeusstevenssociety.com/',
      },
      {
        id: 'james-buchanan',
        name: 'James Buchanan',
        years: '1791 – 1868',
        wikiTitle: 'James_Buchanan',
        role: {
          en: '15th President of the United States, U.S. Secretary of State & Diplomat',
          es: '15.º Presidente de los Estados Unidos y Secretario de Estado',
        },
        townName: {
          en: 'Wheatland, Lancaster County, PA',
          es: 'Wheatland, Condado de Lancaster, PA',
        },
        biography: {
          en: 'Born in Cove Gap (Franklin County) and longtime resident of his Wheatland estate in Lancaster, James Buchanan served as U.S. Representative, Senator, Minister to Russia and Great Britain, Secretary of State, and the 15th President of the United States (1857–1861).',
          es: 'Nacido en Franklin County y residente de la mansión Wheatland en Lancaster, James Buchanan fue representante, senador, embajador, Secretario de Estado y el 15.º Presidente de los Estados Unidos (1857–1861).',
        },
        quote: {
          en: '"Next to the Constitution itself, the Union is the highest trust of the Republic."',
          es: '"Mi hogar en Wheatland, Lancaster, ha sido siempre el puerto seguro de mi vida pública."',
        },
        appearance: {
          coatColor: '#1E293B',
          vestColor: '#F8FAFC',
          trimColor: '#D4AF37',
          skinTone: '#EAD0BA',
          hairColor: '#E2E8F0',
          coatRoughness: 0.65,
          coatMetalness: 0.1,
          hatStyle: 'none_long_hair',
          hatColor: '#E2E8F0',
          propStyle: 'presidential_seal_scroll',
          heightScale: 1.02,
        },
        callouts: [
          {
            id: 'jb-cravat',
            anchorOffset: [0, 1.44, 0.22],
            label: {
              en: 'White Silk Stock Cravat & Wheatland Seal',
              es: 'Corbatín Blanco de Seda y Sello Presidencial',
            },
            detail: {
              en: 'Preserved at President James Buchanan’s Wheatland historic site in Lancaster.',
              es: 'Conservado en el sitio histórico de Wheatland en Lancaster, Pensilvania.',
            },
          },
        ],
        officialSourceUrl: 'https://www.lancasterhistory.org/visit/wheatland/',
      },
    ],
  },
  {
    id: 'titusville-oil',
    counties: ['Crawford', 'Venango', 'Warren', 'McKean', 'Erie', 'Mercer'],
    townTitle: {
      en: 'Titusville & Oil Creek — Birthplace of the Modern Energy Era',
      es: 'Titusville y Oil Creek — Cuna de la Era Energética Moderna',
    },
    stageSubtitle: {
      en: '1859 Oil Creek Valley Industrial Stage',
      es: 'Escenario Industrial del Valle de Oil Creek (1859)',
    },
    stageTheme: 'industrial_steel',
    ambientAccentColor: '#D4AF37',
    characters: [
      {
        id: 'edwin-drake',
        name: 'Colonel Edwin L. Drake',
        years: '1819 – 1880',
        wikiTitle: 'Edwin_Drake',
        role: {
          en: 'Pioneer of the First Commercial Oil Well in the World (Titusville, 1859)',
          es: 'Pionero del Primer Pozo Petrolero Comercial del Mundo (Titusville, 1859)',
        },
        townName: {
          en: 'Titusville (Crawford & Venango Border), PA',
          es: 'Titusville (Frontera de Crawford y Venango), PA',
        },
        biography: {
          en: 'On August 27, 1859, along Oil Creek near Titusville, Pennsylvania, Edwin L. Drake and blacksmith "Uncle Billy" Smith struck petroleum at 69.5 feet using a steam engine and cast-iron drive pipe—inventing modern well drilling and launching the global petroleum industry.',
          es: 'El 27 de agosto de 1859, junto a Oil Creek en Titusville, Pensilvania, Edwin L. Drake y el herrero "Uncle Billy" Smith hallaron petróleo a 21 metros de profundidad usando una tubería de hierro fundido y motor de vapor, iniciando la industria energética mundial.',
        },
        quote: {
          en: '"Drive the iron pipe through the gravel to bedrock—there lies the future of illumination."',
          es: '"Hundan la tubería de hierro hasta la roca madre: allí aguarda la energía que iluminará al mundo."',
        },
        appearance: {
          coatColor: '#27272A',
          vestColor: '#451A03',
          trimColor: '#D4AF37',
          skinTone: '#E5C2A8',
          hairColor: '#27272A',
          coatRoughness: 0.68,
          coatMetalness: 0.14,
          hasBeard: true,
          hasMustache: true,
          hatStyle: 'stovepipe_top_hat',
          hatColor: '#18181B',
          propStyle: 'oil_derrick_model',
          heightScale: 1.02,
        },
        callouts: [
          {
            id: 'ed-derrick',
            anchorOffset: [0.48, 1.15, 0.25],
            label: {
              en: '1859 Drake Well Wooden Derrick & Drive Pipe',
              es: 'Torre de Perforación del Pozo Drake (1859)',
            },
            detail: {
              en: 'Scale 3D model of the 1859 Titusville derrick preserved at Drake Well Museum.',
              es: 'Modelo 3D a escala de la torre de Titusville preservada en el Drake Well Museum.',
            },
          },
        ],
        officialSourceUrl: 'https://www.drakewell.org/',
      },
      {
        id: 'samuel-kier',
        name: 'Samuel M. Kier',
        years: '1813 – 1874',
        wikiTitle: 'Samuel_Kier',
        role: {
          en: 'Founder of the First Oil Refinery in America (Pittsburgh & Oil Region)',
          es: 'Fundador de la Primera Refinería de Petróleo de EE. UU.',
        },
        townName: {
          en: 'Tarentum, Pittsburgh & Oil Creek, PA',
          es: 'Tarentum, Pittsburgh y Oil Creek, PA',
        },
        biography: {
          en: 'Before Drake drilled at Titusville, Pennsylvanian inventor Samuel M. Kier distilled crude oil seeping from his family’s salt wells along the Allegheny River into clean-burning "Carbon Oil" (kerosene) and built America’s first oil refinery in 1853.',
          es: 'Antes de la perforación en Titusville, el inventor pensilvano Samuel M. Kier destiló el petróleo crudo de los pozos de sal familiares en queroseno iluminante ("Carbon Oil") y construyó la primera refinería de EE. UU. en 1853.',
        },
        quote: {
          en: '"From rock oil we have distilled safe light for every household in the Commonwealth."',
          es: '"Del aceite de roca hemos destilado luz segura para cada hogar de la Mancomunidad."',
        },
        appearance: {
          coatColor: '#1E293B',
          vestColor: '#78350F',
          trimColor: '#D4AF37',
          skinTone: '#EAD0BA',
          hairColor: '#4B5563',
          coatRoughness: 0.64,
          coatMetalness: 0.12,
          hasBeard: true,
          hatStyle: 'victorian_top_hat',
          hatColor: '#1E293B',
          propStyle: 'labor_gavel_lantern',
          heightScale: 0.99,
        },
        callouts: [
          {
            id: 'sk-lamp',
            anchorOffset: [0.45, 1.14, 0.25],
            label: {
              en: '1853 Carbon Oil Kerosene Lamp',
              es: 'Lámpara de Queroseno "Carbon Oil" (1853)',
            },
            detail: {
              en: 'Replaced whale oil lamps across the world using refined Pennsylvania crude.',
              es: 'Reemplazó el aceite de ballena en todo el mundo usando crudo refinado de Pensilvania.',
            },
          },
        ],
        officialSourceUrl: 'https://www.drakewell.org/',
      },
    ],
  },
];

export const DEFAULT_COMMONWEALTH_3D_STAGE: County3DStageConfig = {
  id: 'commonwealth-keystone',
  counties: [],
  townTitle: {
    en: 'Commonwealth of Pennsylvania — Founding & Civic Hall of Fame',
    es: 'Mancomunidad de Pensilvania — Salón de la Fama Fundacional y Cívico',
  },
  stageSubtitle: {
    en: 'Keystone State Capitol Black Marble & Gold Rotunda',
    es: 'Rotonda de Mármol Negro y Oro del Estado Clave (Keystone State)',
  },
  stageTheme: 'keystone_rotunda',
  ambientAccentColor: '#D4AF37',
  characters: [
    PA_HISTORICAL_3D_STAGES[0].characters[2], // William Penn
    PA_HISTORICAL_3D_STAGES[0].characters[0], // Benjamin Franklin
    {
      id: 'thomas-mifflin',
      name: 'Governor Thomas Mifflin',
      years: '1744 – 1800',
      wikiTitle: 'Thomas_Mifflin',
      role: {
        en: '1st Governor of Pennsylvania (1790–1799) & Quartermaster General of the Continental Army',
        es: '1.er Gobernador Constitucional de Pensilvania (1790–1799) y General Continental',
      },
      townName: {
        en: 'Philadelphia, Reading & Harrisburg, PA',
        es: 'Filadelfia, Reading y Harrisburg, PA',
      },
      biography: {
        en: 'Born to a Quaker family in Philadelphia, Thomas Mifflin served as George Washington’s aide-de-camp and Quartermaster General during the Revolution, presided over the Continental Congress when Washington resigned his commission, signed the U.S. Constitution, and served as Pennsylvania’s first Governor under the 1790 Constitution.',
        es: 'Nacido en Filadelfia, Thomas Mifflin fue ayudante de campo de George Washington e Intendente General del Ejército Continental, firmó la Constitución de EE. UU. y fue el primer Gobernador de Pensilvania bajo la Constitución estatal de 1790.',
      },
      quote: {
        en: '"Virtue, Liberty, and Independence—the enduring pillars of our Keystone Commonwealth."',
        es: '"Virtud, Libertad e Independencia: los pilares eternos de nuestra Mancomunidad Keystone."',
      },
      appearance: {
        coatColor: '#1E3A8A',
        vestColor: '#FDE68A',
        trimColor: '#D4AF37',
        skinTone: '#E8C6AF',
        hairColor: '#E2E8F0',
        coatRoughness: 0.62,
        coatMetalness: 0.16,
        hatStyle: 'none_long_hair',
        hatColor: '#E2E8F0',
        propStyle: 'presidential_seal_scroll',
        heightScale: 1.0,
      },
      callouts: [
        {
          id: 'tm-constitution',
          anchorOffset: [0.46, 1.15, 0.25],
          label: {
            en: '1790 Pennsylvania Constitution & State Seal',
            es: 'Constitución de Pensilvania de 1790 y Sello Estatal',
          },
          detail: {
            en: 'Mifflin County and Mifflinburg in Central Pennsylvania are named in his honor.',
            es: 'El Condado de Mifflin en el centro de Pensilvania lleva su nombre en su honor.',
          },
        },
      ],
      officialSourceUrl: 'https://www.phmc.pa.gov/Archives/Research-Online/Pages/Governors-Biographies.aspx',
    },
  ],
};

/**
 * Resolves the appropriate 3D Historical Stage Configuration for any Pennsylvania county or town ID.
 */
export function getHistorical3DStageForCounty(countyOrStageName?: string | null): County3DStageConfig {
  if (!countyOrStageName) {
    return PA_HISTORICAL_3D_STAGES[0]; // Default to Philadelphia when opening encyclopedia fresh
  }

  const normalized = countyOrStageName.trim().toLowerCase();

  // Direct match by stage ID
  const byId = PA_HISTORICAL_3D_STAGES.find((s) => s.id.toLowerCase() === normalized);
  if (byId) return byId;

  // Match by county name
  const byCounty = PA_HISTORICAL_3D_STAGES.find((stage) =>
    stage.counties.some((c) => c.toLowerCase() === normalized || normalized.includes(c.toLowerCase()))
  );
  if (byCounty) return byCounty;

  // Fallback to Commonwealth Cast with customized county title if a specific county out of the 67 is selected
  return {
    ...DEFAULT_COMMONWEALTH_3D_STAGE,
    townTitle: {
      en: `${countyOrStageName} County — Commonwealth Founding Figures`,
      es: `Condado de ${countyOrStageName} — Figuras Fundacionales de Pensilvania`,
    },
  };
}
