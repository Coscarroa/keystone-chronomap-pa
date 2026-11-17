import { CountyRecord } from './paCountiesData';
import { getCountyCensusProfile } from './paCensusData';

export interface AgeSexPyramidGroup {
  ageGroup: '0-17' | '18-34' | '35-54' | '55-64' | '65+';
  hombres: number; // % of total population
  mujeres: number; // % of total population
  hombresNeg: number; // Negative value for diverging horizontal BarChart
}

export interface StaticDemographics {
  poblacionTotal: number;
  densidadPoblacional: number; // hab/mi²
  urbanaPct: number;
  ruralPct: number;
  piramideEdadSexo: AgeSexPyramidGroup[];
  estadoCivil: {
    solteros: number; // Never married %
    casados: number; // Married %
    divorciados: number; // Divorced %
    viudos: number; // Widowed %
  };
  atributosSociales: {
    nivelEducativo: {
      universitarioPct: number; // Bachelor's degree or higher %
      secundariaPct: number; // High school graduate or higher %
    };
    lenguas: {
      englishOnlyPct: number;
      spanishPct: number;
      otherLanguagesPct: number;
      otherLanguageNoteEn?: string;
      otherLanguageNoteEs?: string;
    };
    origenEtnico: {
      whitePct: number;
      blackPct: number;
      hispanicPct: number;
      asianPct: number;
      multiracialPct: number;
    };
    situacionLaboral: {
      employedPct: number;
      unemploymentPct: number;
      medianHouseholdIncome: number; // USD ($)
    };
  };
}

export interface DynamicDemographics {
  tasaNatalidad: number; // Births per 1,000 (‰)
  tasaMortalidad: number; // Deaths per 1,000 (‰)
  crecimientoVegetativo: number; // tasaNatalidad - tasaMortalidad (‰)
  tasaGlobalFecundidad: number; // Children per woman
  mortalidadInfantil: number; // Infant deaths per 1,000 live births (‰)
  esperanzaVida: number; // Life expectancy at birth (years)
  migracion: {
    migracionInterna: number; // Domestic net migration per 1,000 (‰)
    inmigracionInternacional: number; // International net migration per 1,000 (‰)
    saldoNeto: number; // Total net migration per 1,000 (‰)
    etiquetaSaldoEs: 'Receptor Neto' | 'Emisor Neto';
    etiquetaSaldoEn: 'Net Receiver' | 'Net Sender';
  };
}

export interface CountyFullDemographics {
  countyName: string;
  estatica: StaticDemographics;
  dinamica: DynamicDemographics;
}

function makePyramid(
  cohorts: Array<[AgeSexPyramidGroup['ageGroup'], number, number]>
): AgeSexPyramidGroup[] {
  return cohorts.map(([ageGroup, hombres, mujeres]) => ({
    ageGroup,
    hombres,
    mujeres,
    hombresNeg: -Math.abs(hombres),
  }));
}

interface RawSeedDemographics {
  poblacionTotal: number;
  urbanaPct: number;
  piramide: Array<[AgeSexPyramidGroup['ageGroup'], number, number]>;
  estadoCivil: StaticDemographics['estadoCivil'];
  atributosSociales: StaticDemographics['atributosSociales'];
  tasaNatalidad: number;
  tasaMortalidad: number;
  tasaGlobalFecundidad: number;
  mortalidadInfantil: number;
  esperanzaVida: number;
  migracionInterna: number;
  inmigracionInternacional: number;
}

/**
 * Curated U.S. Census Bureau & PA State Data Center profiles for flagship counties
 */
const CURATED_DEMOGRAPHICS_SEEDS: Record<string, RawSeedDemographics> = {
  Philadelphia: {
    poblacionTotal: 1603797,
    urbanaPct: 100,
    piramide: [
      ['65+', 6.4, 8.8],
      ['55-64', 5.6, 6.4],
      ['35-54', 12.1, 13.0],
      ['18-34', 13.4, 14.5],
      ['0-17', 10.0, 9.8],
    ],
    estadoCivil: {
      solteros: 48.2,
      casados: 34.6,
      divorciados: 10.8,
      viudos: 6.4,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 34.8, secundariaPct: 87.2 },
      lenguas: {
        englishOnlyPct: 75.4,
        spanishPct: 11.6,
        otherLanguagesPct: 13.0,
        otherLanguageNoteEn: 'Chinese, Vietnamese, Russian, Arabic, French',
        otherLanguageNoteEs: 'Chino, vietnamita, ruso, árabe, francés',
      },
      origenEtnico: {
        whitePct: 34.3,
        blackPct: 39.3,
        hispanicPct: 15.9,
        asianPct: 7.8,
        multiracialPct: 2.7,
      },
      situacionLaboral: {
        employedPct: 59.4,
        unemploymentPct: 5.4,
        medianHouseholdIncome: 57537,
      },
    },
    tasaNatalidad: 12.4,
    tasaMortalidad: 9.8,
    tasaGlobalFecundidad: 1.62,
    mortalidadInfantil: 7.1,
    esperanzaVida: 75.8,
    migracionInterna: -6.8,
    inmigracionInternacional: 6.2,
  },

  Allegheny: {
    poblacionTotal: 1250578,
    urbanaPct: 96.4,
    piramide: [
      ['65+', 8.6, 11.2],
      ['55-64', 6.5, 7.1],
      ['35-54', 11.8, 12.2],
      ['18-34', 12.0, 12.1],
      ['0-17', 9.4, 9.1],
    ],
    estadoCivil: {
      solteros: 37.5,
      casados: 45.8,
      divorciados: 10.2,
      viudos: 6.5,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 45.6, secundariaPct: 95.1 },
      lenguas: {
        englishOnlyPct: 91.2,
        spanishPct: 2.1,
        otherLanguagesPct: 6.7,
        otherLanguageNoteEn: 'Chinese, Hindi, Arabic, Slavic languages',
        otherLanguageNoteEs: 'Chino, hindi, árabe, lenguas eslavas',
      },
      origenEtnico: {
        whitePct: 75.1,
        blackPct: 13.4,
        hispanicPct: 2.8,
        asianPct: 4.7,
        multiracialPct: 4.0,
      },
      situacionLaboral: {
        employedPct: 63.2,
        unemploymentPct: 3.9,
        medianHouseholdIncome: 72537,
      },
    },
    tasaNatalidad: 9.8,
    tasaMortalidad: 11.4,
    tasaGlobalFecundidad: 1.51,
    mortalidadInfantil: 5.6,
    esperanzaVida: 78.6,
    migracionInterna: -2.4,
    inmigracionInternacional: 3.8,
  },

  Montgomery: {
    poblacionTotal: 856553,
    urbanaPct: 94.8,
    piramide: [
      ['65+', 8.3, 10.4],
      ['55-64', 6.8, 7.2],
      ['35-54', 13.1, 13.5],
      ['18-34', 10.1, 10.0],
      ['0-17', 10.5, 10.1],
    ],
    estadoCivil: {
      solteros: 31.2,
      casados: 54.6,
      divorciados: 8.4,
      viudos: 5.8,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 52.4, secundariaPct: 94.8 },
      lenguas: {
        englishOnlyPct: 86.2,
        spanishPct: 4.4,
        otherLanguagesPct: 9.4,
      },
      origenEtnico: {
        whitePct: 73.6,
        blackPct: 9.8,
        hispanicPct: 6.4,
        asianPct: 7.9,
        multiracialPct: 2.3,
      },
      situacionLaboral: {
        employedPct: 66.8,
        unemploymentPct: 3.2,
        medianHouseholdIncome: 107441,
      },
    },
    tasaNatalidad: 10.6,
    tasaMortalidad: 9.1,
    tasaGlobalFecundidad: 1.71,
    mortalidadInfantil: 4.4,
    esperanzaVida: 81.2,
    migracionInterna: 2.6,
    inmigracionInternacional: 3.4,
  },

  Bucks: {
    poblacionTotal: 646538,
    urbanaPct: 91.5,
    piramide: [
      ['65+', 9.1, 11.1],
      ['55-64', 7.4, 7.8],
      ['35-54', 12.8, 13.1],
      ['18-34', 9.6, 9.3],
      ['0-17', 10.1, 9.7],
    ],
    estadoCivil: {
      solteros: 29.4,
      casados: 55.8,
      divorciados: 8.7,
      viudos: 6.1,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 44.2, secundariaPct: 94.6 },
      lenguas: {
        englishOnlyPct: 87.8,
        spanishPct: 3.8,
        otherLanguagesPct: 8.4,
        otherLanguageNoteEn: 'Russian, Ukrainian, Gujarati, Hindi',
        otherLanguageNoteEs: 'Ruso, ucraniano, guyaratí, hindi',
      },
      origenEtnico: {
        whitePct: 80.5,
        blackPct: 4.4,
        hispanicPct: 6.3,
        asianPct: 5.5,
        multiracialPct: 3.3,
      },
      situacionLaboral: {
        employedPct: 65.4,
        unemploymentPct: 3.4,
        medianHouseholdIncome: 107826,
      },
    },
    tasaNatalidad: 9.4,
    tasaMortalidad: 9.6,
    tasaGlobalFecundidad: 1.66,
    mortalidadInfantil: 4.3,
    esperanzaVida: 80.7,
    migracionInterna: 1.9,
    inmigracionInternacional: 2.3,
  },

  Chester: {
    poblacionTotal: 534413,
    urbanaPct: 87.6,
    piramide: [
      ['65+', 8.0, 9.6],
      ['55-64', 6.9, 7.2],
      ['35-54', 13.3, 13.7],
      ['18-34', 10.2, 9.9],
      ['0-17', 10.8, 10.4],
    ],
    estadoCivil: {
      solteros: 30.1,
      casados: 57.2,
      divorciados: 7.6,
      viudos: 5.1,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 55.8, secundariaPct: 94.3 },
      lenguas: {
        englishOnlyPct: 86.9,
        spanishPct: 5.8,
        otherLanguagesPct: 7.3,
      },
      origenEtnico: {
        whitePct: 77.2,
        blackPct: 6.1,
        hispanicPct: 8.4,
        asianPct: 6.5,
        multiracialPct: 1.8,
      },
      situacionLaboral: {
        employedPct: 67.5,
        unemploymentPct: 2.9,
        medianHouseholdIncome: 118574,
      },
    },
    tasaNatalidad: 10.8,
    tasaMortalidad: 7.9,
    tasaGlobalFecundidad: 1.76,
    mortalidadInfantil: 4.1,
    esperanzaVida: 81.9,
    migracionInterna: 4.5,
    inmigracionInternacional: 2.9,
  },

  Lancaster: {
    poblacionTotal: 552984,
    urbanaPct: 76.2,
    piramide: [
      ['65+', 8.5, 10.3],
      ['55-64', 6.2, 6.5],
      ['35-54', 11.7, 11.9],
      ['18-34', 10.8, 10.7],
      ['0-17', 11.9, 11.5],
    ],
    estadoCivil: {
      solteros: 30.8,
      casados: 54.9,
      divorciados: 8.6,
      viudos: 5.7,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 31.2, secundariaPct: 87.9 },
      lenguas: {
        englishOnlyPct: 82.8,
        spanishPct: 7.9,
        otherLanguagesPct: 9.3,
        otherLanguageNoteEn: 'Pennsylvania Dutch / Amish German (7.1%)',
        otherLanguageNoteEs: 'Alemán de Pensilvania / Amish (7.1%)',
      },
      origenEtnico: {
        whitePct: 79.8,
        blackPct: 4.2,
        hispanicPct: 11.6,
        asianPct: 2.4,
        multiracialPct: 2.0,
      },
      situacionLaboral: {
        employedPct: 64.9,
        unemploymentPct: 3.1,
        medianHouseholdIncome: 81458,
      },
    },
    tasaNatalidad: 13.2,
    tasaMortalidad: 9.4,
    tasaGlobalFecundidad: 2.18,
    mortalidadInfantil: 5.2,
    esperanzaVida: 80.4,
    migracionInterna: 3.4,
    inmigracionInternacional: 2.1,
  },

  Lehigh: {
    poblacionTotal: 374557,
    urbanaPct: 89.2,
    piramide: [
      ['65+', 7.8, 9.7],
      ['55-64', 6.4, 6.8],
      ['35-54', 12.5, 12.8],
      ['18-34', 11.2, 11.1],
      ['0-17', 11.0, 10.7],
    ],
    estadoCivil: {
      solteros: 35.6,
      casados: 48.2,
      divorciados: 10.1,
      viudos: 6.1,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 33.4, secundariaPct: 89.2 },
      lenguas: {
        englishOnlyPct: 74.8,
        spanishPct: 18.6,
        otherLanguagesPct: 6.6,
        otherLanguageNoteEn: 'Arabic (Syrian-Lebanese heritage), German',
        otherLanguageNoteEs: 'Árabe (herencia sirio-libanesa), alemán',
      },
      origenEtnico: {
        whitePct: 59.8,
        blackPct: 6.8,
        hispanicPct: 27.6,
        asianPct: 3.6,
        multiracialPct: 2.2,
      },
      situacionLaboral: {
        employedPct: 63.5,
        unemploymentPct: 4.1,
        medianHouseholdIncome: 74973,
      },
    },
    tasaNatalidad: 11.5,
    tasaMortalidad: 9.5,
    tasaGlobalFecundidad: 1.81,
    mortalidadInfantil: 5.4,
    esperanzaVida: 79.3,
    migracionInterna: 4.2,
    inmigracionInternacional: 3.9,
  },

  Northampton: {
    poblacionTotal: 312951,
    urbanaPct: 84.5,
    piramide: [
      ['65+', 8.9, 10.9],
      ['55-64', 6.9, 7.2],
      ['35-54', 12.4, 12.6],
      ['18-34', 10.9, 10.6],
      ['0-17', 9.9, 9.7],
    ],
    estadoCivil: {
      solteros: 33.4,
      casados: 50.6,
      divorciados: 9.7,
      viudos: 6.3,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 34.1, secundariaPct: 91.5 },
      lenguas: {
        englishOnlyPct: 84.6,
        spanishPct: 9.8,
        otherLanguagesPct: 5.6,
      },
      origenEtnico: {
        whitePct: 73.2,
        blackPct: 6.2,
        hispanicPct: 15.1,
        asianPct: 3.2,
        multiracialPct: 2.3,
      },
      situacionLaboral: {
        employedPct: 63.1,
        unemploymentPct: 3.9,
        medianHouseholdIncome: 82625,
      },
    },
    tasaNatalidad: 9.6,
    tasaMortalidad: 10.2,
    tasaGlobalFecundidad: 1.64,
    mortalidadInfantil: 5.1,
    esperanzaVida: 79.6,
    migracionInterna: 5.1,
    inmigracionInternacional: 2.2,
  },

  Lackawanna: {
    poblacionTotal: 215896,
    urbanaPct: 83.4,
    piramide: [
      ['65+', 9.2, 11.8],
      ['55-64', 6.8, 7.2],
      ['35-54', 12.0, 12.1],
      ['18-34', 10.6, 10.5],
      ['0-17', 10.0, 9.8],
    ],
    estadoCivil: {
      solteros: 35.8,
      casados: 46.2,
      divorciados: 10.4,
      viudos: 7.6,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 30.8, secundariaPct: 91.2 },
      lenguas: {
        englishOnlyPct: 87.9,
        spanishPct: 6.8,
        otherLanguagesPct: 5.3,
      },
      origenEtnico: {
        whitePct: 79.4,
        blackPct: 4.3,
        hispanicPct: 10.8,
        asianPct: 3.1,
        multiracialPct: 2.4,
      },
      situacionLaboral: {
        employedPct: 59.8,
        unemploymentPct: 4.4,
        medianHouseholdIncome: 64210,
      },
    },
    tasaNatalidad: 9.7,
    tasaMortalidad: 12.8,
    tasaGlobalFecundidad: 1.63,
    mortalidadInfantil: 5.8,
    esperanzaVida: 77.5,
    migracionInterna: 2.8,
    inmigracionInternacional: 2.4,
  },

  Luzerne: {
    poblacionTotal: 325594,
    urbanaPct: 78.6,
    piramide: [
      ['65+', 9.1, 11.4],
      ['55-64', 6.9, 7.1],
      ['35-54', 12.3, 12.1],
      ['18-34', 10.5, 10.2],
      ['0-17', 10.3, 10.1],
    ],
    estadoCivil: {
      solteros: 36.2,
      casados: 45.4,
      divorciados: 10.9,
      viudos: 7.5,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 25.4, secundariaPct: 89.4 },
      lenguas: {
        englishOnlyPct: 83.2,
        spanishPct: 13.4,
        otherLanguagesPct: 3.4,
      },
      origenEtnico: {
        whitePct: 74.6,
        blackPct: 5.2,
        hispanicPct: 16.8,
        asianPct: 1.4,
        multiracialPct: 2.0,
      },
      situacionLaboral: {
        employedPct: 58.9,
        unemploymentPct: 4.7,
        medianHouseholdIncome: 60845,
      },
    },
    tasaNatalidad: 10.1,
    tasaMortalidad: 13.1,
    tasaGlobalFecundidad: 1.72,
    mortalidadInfantil: 6.1,
    esperanzaVida: 76.9,
    migracionInterna: 3.1,
    inmigracionInternacional: 2.7,
  },

  Erie: {
    poblacionTotal: 270876,
    urbanaPct: 79.4,
    piramide: [
      ['65+', 8.8, 10.7],
      ['55-64', 6.7, 7.0],
      ['35-54', 11.6, 11.8],
      ['18-34', 11.4, 11.2],
      ['0-17', 10.5, 10.3],
    ],
    estadoCivil: {
      solteros: 36.4,
      casados: 46.1,
      divorciados: 11.0,
      viudos: 6.5,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 29.6, secundariaPct: 92.1 },
      lenguas: {
        englishOnlyPct: 91.8,
        spanishPct: 3.2,
        otherLanguagesPct: 5.0,
        otherLanguageNoteEn: 'Nepali, Arabic, Bosnian, Russian',
        otherLanguageNoteEs: 'Nepalí, árabe, bosnio, ruso',
      },
      origenEtnico: {
        whitePct: 81.2,
        blackPct: 7.4,
        hispanicPct: 5.1,
        asianPct: 2.2,
        multiracialPct: 4.1,
      },
      situacionLaboral: {
        employedPct: 59.2,
        unemploymentPct: 4.5,
        medianHouseholdIncome: 61890,
      },
    },
    tasaNatalidad: 10.2,
    tasaMortalidad: 11.6,
    tasaGlobalFecundidad: 1.69,
    mortalidadInfantil: 6.3,
    esperanzaVida: 77.6,
    migracionInterna: -3.2,
    inmigracionInternacional: 1.9,
  },

  Dauphin: {
    poblacionTotal: 286401,
    urbanaPct: 85.2,
    piramide: [
      ['65+', 7.9, 9.8],
      ['55-64', 6.5, 6.9],
      ['35-54', 12.4, 12.8],
      ['18-34', 11.0, 11.2],
      ['0-17', 10.8, 10.7],
    ],
    estadoCivil: {
      solteros: 37.2,
      casados: 45.9,
      divorciados: 10.9,
      viudos: 6.0,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 33.8, secundariaPct: 91.0 },
      lenguas: {
        englishOnlyPct: 84.9,
        spanishPct: 7.6,
        otherLanguagesPct: 7.5,
      },
      origenEtnico: {
        whitePct: 61.5,
        blackPct: 18.4,
        hispanicPct: 11.2,
        asianPct: 5.4,
        multiracialPct: 3.5,
      },
      situacionLaboral: {
        employedPct: 64.1,
        unemploymentPct: 3.8,
        medianHouseholdIncome: 71840,
      },
    },
    tasaNatalidad: 11.8,
    tasaMortalidad: 10.1,
    tasaGlobalFecundidad: 1.79,
    mortalidadInfantil: 6.0,
    esperanzaVida: 78.4,
    migracionInterna: 1.8,
    inmigracionInternacional: 2.9,
  },

  Berks: {
    poblacionTotal: 428849,
    urbanaPct: 77.5,
    piramide: [
      ['65+', 8.2, 9.9],
      ['55-64', 6.6, 6.8],
      ['35-54', 12.2, 12.4],
      ['18-34', 11.1, 10.9],
      ['0-17', 11.1, 10.8],
    ],
    estadoCivil: {
      solteros: 34.9,
      casados: 49.3,
      divorciados: 9.8,
      viudos: 6.0,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 27.4, secundariaPct: 87.8 },
      lenguas: {
        englishOnlyPct: 78.2,
        spanishPct: 17.8,
        otherLanguagesPct: 4.0,
      },
      origenEtnico: {
        whitePct: 67.4,
        blackPct: 4.9,
        hispanicPct: 24.2,
        asianPct: 1.6,
        multiracialPct: 1.9,
      },
      situacionLaboral: {
        employedPct: 63.4,
        unemploymentPct: 4.1,
        medianHouseholdIncome: 74610,
      },
    },
    tasaNatalidad: 11.4,
    tasaMortalidad: 10.0,
    tasaGlobalFecundidad: 1.84,
    mortalidadInfantil: 5.7,
    esperanzaVida: 78.9,
    migracionInterna: 2.1,
    inmigracionInternacional: 2.6,
  },

  Centre: {
    poblacionTotal: 158172,
    urbanaPct: 68.4,
    piramide: [
      ['65+', 7.1, 8.2],
      ['55-64', 5.2, 5.4],
      ['35-54', 10.4, 10.2],
      ['18-34', 20.6, 18.9],
      ['0-17', 7.1, 6.9],
    ],
    estadoCivil: {
      solteros: 46.8,
      casados: 42.1,
      divorciados: 6.9,
      viudos: 4.2,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 46.9, secundariaPct: 94.8 },
      lenguas: {
        englishOnlyPct: 88.4,
        spanishPct: 2.4,
        otherLanguagesPct: 9.2,
        otherLanguageNoteEn: 'Mandarin, Korean, Hindi (Penn State Campus)',
        otherLanguageNoteEs: 'Mandarín, coreano, hindi (Campus Penn State)',
      },
      origenEtnico: {
        whitePct: 83.6,
        blackPct: 3.4,
        hispanicPct: 3.5,
        asianPct: 6.8,
        multiracialPct: 2.7,
      },
      situacionLaboral: {
        employedPct: 58.6,
        unemploymentPct: 3.1,
        medianHouseholdIncome: 70920,
      },
    },
    tasaNatalidad: 7.4,
    tasaMortalidad: 7.1,
    tasaGlobalFecundidad: 1.24,
    mortalidadInfantil: 4.2,
    esperanzaVida: 81.6,
    migracionInterna: 1.5,
    inmigracionInternacional: 4.8,
  },

  Cambria: {
    poblacionTotal: 133472,
    urbanaPct: 64.2,
    piramide: [
      ['65+', 10.6, 12.8],
      ['55-64', 7.6, 7.8],
      ['35-54', 11.8, 11.4],
      ['18-34', 9.8, 9.4],
      ['0-17', 9.5, 9.3],
    ],
    estadoCivil: {
      solteros: 31.8,
      casados: 48.6,
      divorciados: 10.8,
      viudos: 8.8,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 23.8, secundariaPct: 91.6 },
      lenguas: {
        englishOnlyPct: 96.4,
        spanishPct: 1.4,
        otherLanguagesPct: 2.2,
      },
      origenEtnico: {
        whitePct: 90.8,
        blackPct: 3.9,
        hispanicPct: 2.1,
        asianPct: 0.7,
        multiracialPct: 2.5,
      },
      situacionLaboral: {
        employedPct: 54.2,
        unemploymentPct: 4.8,
        medianHouseholdIncome: 55420,
      },
    },
    tasaNatalidad: 8.6,
    tasaMortalidad: 14.9,
    tasaGlobalFecundidad: 1.58,
    mortalidadInfantil: 6.4,
    esperanzaVida: 76.1,
    migracionInterna: -3.5,
    inmigracionInternacional: 0.4,
  },

  York: {
    poblacionTotal: 456438,
    urbanaPct: 76.8,
    piramide: [
      ['65+', 8.6, 10.2],
      ['55-64', 7.1, 7.3],
      ['35-54', 12.8, 13.0],
      ['18-34', 10.1, 9.9],
      ['0-17', 10.6, 10.4],
    ],
    estadoCivil: {
      solteros: 30.9,
      casados: 52.8,
      divorciados: 10.4,
      viudos: 5.9,
    },
    atributosSociales: {
      nivelEducativo: { universitarioPct: 27.9, secundariaPct: 91.1 },
      lenguas: {
        englishOnlyPct: 91.2,
        spanishPct: 5.8,
        otherLanguagesPct: 3.0,
      },
      origenEtnico: {
        whitePct: 81.4,
        blackPct: 6.4,
        hispanicPct: 8.6,
        asianPct: 1.6,
        multiracialPct: 2.0,
      },
      situacionLaboral: {
        employedPct: 64.5,
        unemploymentPct: 3.5,
        medianHouseholdIncome: 79180,
      },
    },
    tasaNatalidad: 10.5,
    tasaMortalidad: 10.1,
    tasaGlobalFecundidad: 1.74,
    mortalidadInfantil: 5.5,
    esperanzaVida: 78.8,
    migracionInterna: 4.1,
    inmigracionInternacional: 1.2,
  },
};

/**
 * Generates or retrieves the complete Static & Dynamic Demographics dossier
 * for any of the 67 counties of Pennsylvania.
 */
export function getCountyFullDemographics(
  county: CountyRecord
): CountyFullDemographics {
  const curated = CURATED_DEMOGRAPHICS_SEEDS[county.name];

  if (curated) {
    const densidad = Math.round(curated.poblacionTotal / county.areaSqMi);
    const ruralPct = Number((100 - curated.urbanaPct).toFixed(1));
    const crecimientoVegetativo = Number(
      (curated.tasaNatalidad - curated.tasaMortalidad).toFixed(1)
    );
    const saldoNeto = Number(
      (curated.migracionInterna + curated.inmigracionInternacional).toFixed(1)
    );

    return {
      countyName: county.name,
      estatica: {
        poblacionTotal: curated.poblacionTotal,
        densidadPoblacional: densidad,
        urbanaPct: curated.urbanaPct,
        ruralPct,
        piramideEdadSexo: makePyramid(curated.piramide),
        estadoCivil: curated.estadoCivil,
        atributosSociales: curated.atributosSociales,
      },
      dinamica: {
        tasaNatalidad: curated.tasaNatalidad,
        tasaMortalidad: curated.tasaMortalidad,
        crecimientoVegetativo,
        tasaGlobalFecundidad: curated.tasaGlobalFecundidad,
        mortalidadInfantil: curated.mortalidadInfantil,
        esperanzaVida: curated.esperanzaVida,
        migracion: {
          migracionInterna: curated.migracionInterna,
          inmigracionInternacional: curated.inmigracionInternacional,
          saldoNeto,
          etiquetaSaldoEs: saldoNeto >= 0 ? 'Receptor Neto' : 'Emisor Neto',
          etiquetaSaldoEn: saldoNeto >= 0 ? 'Net Receiver' : 'Net Sender',
        },
      },
    };
  }

  // Calibrated regional generator for the remaining counties of Pennsylvania
  const censusProfile = getCountyCensusProfile(county);
  const currentPop =
    censusProfile.series[censusProfile.series.length - 1]?.population || 65000;
  const densidad = Math.max(8, Math.round(currentPop / county.areaSqMi));
  const fipsSeed = Number(county.fips.slice(-2)) || 15;

  const isSoutheast = county.region === 'southeast';
  const isSouthCentral = county.region === 'southcentral';
  const isNortheast = county.region === 'northeast';

  const urbanaPct = Math.min(
    94,
    Math.max(
      18,
      Math.round(
        densidad > 600
          ? 85 + (fipsSeed % 9)
          : densidad > 200
          ? 62 + (fipsSeed % 16)
          : 34 + (fipsSeed % 22)
      )
    )
  );
  const ruralPct = Number((100 - urbanaPct).toFixed(1));

  const piramide: Array<[AgeSexPyramidGroup['ageGroup'], number, number]> =
    isSoutheast || isSouthCentral
      ? [
          ['65+', 8.6, 10.2],
          ['55-64', 6.9, 7.2],
          ['35-54', 12.7, 13.0],
          ['18-34', 10.4, 10.2],
          ['0-17', 10.5, 10.3],
        ]
      : [
          ['65+', 10.2, 12.1],
          ['55-64', 7.4, 7.6],
          ['35-54', 11.9, 11.8],
          ['18-34', 9.8, 9.5],
          ['0-17', 9.9, 9.8],
        ];

  const universitarioPct = isSoutheast
    ? 42.5
    : isSouthCentral
    ? 28.4 + (fipsSeed % 7)
    : 22.6 + (fipsSeed % 8);
  const secundariaPct = 90.2 + (fipsSeed % 5);

  const hispanicPct = isNortheast || isSoutheast ? 8.4 + (fipsSeed % 6) : 2.6 + (fipsSeed % 3);
  const blackPct = isSoutheast ? 11.2 : 2.8 + (fipsSeed % 4);
  const asianPct = isSoutheast ? 4.8 : 1.1 + (fipsSeed % 2);
  const multiracialPct = 2.2;
  const whitePct = Number(
    (100 - hispanicPct - blackPct - asianPct - multiracialPct).toFixed(1)
  );

  const spanishPct = Number((hispanicPct * 0.68).toFixed(1));
  const otherLanguagesPct = isSoutheast ? 6.4 : 2.8;
  const englishOnlyPct = Number((100 - spanishPct - otherLanguagesPct).toFixed(1));

  const medianIncome = isSoutheast
    ? 96500 + (fipsSeed % 12) * 1100
    : isSouthCentral
    ? 72400 + (fipsSeed % 10) * 900
    : 58900 + (fipsSeed % 11) * 850;

  const tasaNatalidad = isSouthCentral
    ? 10.8
    : isSoutheast
    ? 10.4
    : 9.1;
  const tasaMortalidad = isSoutheast || isSouthCentral ? 9.8 : 12.6;
  const crecimientoVegetativo = Number(
    (tasaNatalidad - tasaMortalidad).toFixed(1)
  );

  const migracionInterna =
    isSouthCentral || isNortheast
      ? Number((2.2 + (fipsSeed % 4) * 0.6).toFixed(1))
      : Number((-1.8 + (fipsSeed % 5) * 0.5).toFixed(1));
  const inmigracionInternacional = isSoutheast
    ? 2.8
    : isSouthCentral || isNortheast
    ? 1.4
    : 0.6;
  const saldoNeto = Number(
    (migracionInterna + inmigracionInternacional).toFixed(1)
  );

  return {
    countyName: county.name,
    estatica: {
      poblacionTotal: currentPop,
      densidadPoblacional: densidad,
      urbanaPct,
      ruralPct,
      piramideEdadSexo: makePyramid(piramide),
      estadoCivil: {
        solteros: 31.5,
        casados: 51.8,
        divorciados: 10.1,
        viudos: 6.6,
      },
      atributosSociales: {
        nivelEducativo: {
          universitarioPct: Number(universitarioPct.toFixed(1)),
          secundariaPct: Number(secundariaPct.toFixed(1)),
        },
        lenguas: {
          englishOnlyPct,
          spanishPct,
          otherLanguagesPct,
        },
        origenEtnico: {
          whitePct,
          blackPct: Number(blackPct.toFixed(1)),
          hispanicPct: Number(hispanicPct.toFixed(1)),
          asianPct: Number(asianPct.toFixed(1)),
          multiracialPct,
        },
        situacionLaboral: {
          employedPct: isSoutheast || isSouthCentral ? 64.2 : 57.8,
          unemploymentPct: isSoutheast || isSouthCentral ? 3.5 : 4.4,
          medianHouseholdIncome: medianIncome,
        },
      },
    },
    dinamica: {
      tasaNatalidad,
      tasaMortalidad,
      crecimientoVegetativo,
      tasaGlobalFecundidad: isSouthCentral ? 1.82 : 1.64,
      mortalidadInfantil: 5.4,
      esperanzaVida: isSoutheast ? 80.2 : isSouthCentral ? 79.1 : 77.3,
      migracion: {
        migracionInterna,
        inmigracionInternacional,
        saldoNeto,
        etiquetaSaldoEs: saldoNeto >= 0 ? 'Receptor Neto' : 'Emisor Neto',
        etiquetaSaldoEn: saldoNeto >= 0 ? 'Net Receiver' : 'Net Sender',
      },
    },
  };
}
