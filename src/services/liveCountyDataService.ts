import { AppLanguage } from '../i18n/translations';

export interface LiveCountySnapshotData {
  countyName: string;
  language: AppLanguage;
  coordinates: {
    lat: number;
    lng: number;
  };
  wikipedia: {
    title: string;
    description: string;
    extract: string;
    imageUrl: string | null;
    articleUrl: string;
    sourceLang: 'en' | 'es';
  };
  weather: {
    tempF: number;
    tempC: number;
    humidity: number;
    windMph: number;
    weatherCode: number;
    elevationFeet: number;
    elevationMeters: number;
  } | null;
  fetchedAt: string;
}

/**
 * Exact geographic coordinates (lat, lng) for all 67 Pennsylvania counties
 * centered on their historic County Seats / Courthouses.
 */
export const PA_COUNTY_COORDS: Record<string, { lat: number; lng: number }> = {
  Adams: { lat: 39.8309, lng: -77.2311 },
  Allegheny: { lat: 40.4406, lng: -79.9959 },
  Armstrong: { lat: 40.8167, lng: -79.5189 },
  Beaver: { lat: 40.6953, lng: -80.3089 },
  Bedford: { lat: 40.0187, lng: -78.5039 },
  Berks: { lat: 40.3356, lng: -75.9269 },
  Blair: { lat: 40.4317, lng: -78.3911 },
  Bradford: { lat: 41.7679, lng: -76.4427 },
  Bucks: { lat: 40.3101, lng: -75.1299 },
  Butler: { lat: 40.8612, lng: -79.8953 },
  Cambria: { lat: 40.4862, lng: -78.7247 },
  Cameron: { lat: 41.5112, lng: -78.2353 },
  Carbon: { lat: 40.8759, lng: -75.7324 },
  Centre: { lat: 40.9131, lng: -77.7783 },
  Chester: { lat: 39.9607, lng: -75.6055 },
  Clarion: { lat: 41.2148, lng: -79.3853 },
  Clearfield: { lat: 41.0226, lng: -78.4392 },
  Clinton: { lat: 41.137, lng: -77.4469 },
  Columbia: { lat: 41.0037, lng: -76.4549 },
  Crawford: { lat: 41.6414, lng: -80.1514 },
  Cumberland: { lat: 40.2015, lng: -77.1889 },
  Dauphin: { lat: 40.2732, lng: -76.8867 },
  Delaware: { lat: 39.9168, lng: -75.3877 },
  Elk: { lat: 41.4239, lng: -78.7286 },
  Erie: { lat: 42.1292, lng: -80.0851 },
  Fayette: { lat: 39.9001, lng: -79.7164 },
  Forest: { lat: 41.4959, lng: -79.4525 },
  Franklin: { lat: 39.9376, lng: -77.6611 },
  Fulton: { lat: 39.9326, lng: -77.9989 },
  Greene: { lat: 39.8962, lng: -80.1867 },
  Huntingdon: { lat: 40.4848, lng: -78.0103 },
  Indiana: { lat: 40.6215, lng: -79.1525 },
  Jefferson: { lat: 41.1609, lng: -79.0817 },
  Juniata: { lat: 40.5706, lng: -77.3967 },
  Lackawanna: { lat: 41.409, lng: -75.6624 },
  Lancaster: { lat: 40.0379, lng: -76.3055 },
  Lawrence: { lat: 41.0037, lng: -80.347 },
  Lebanon: { lat: 40.3409, lng: -76.4113 },
  Lehigh: { lat: 40.6023, lng: -75.4714 },
  Luzerne: { lat: 41.2459, lng: -75.8813 },
  Lycoming: { lat: 41.2412, lng: -77.0011 },
  McKean: { lat: 41.8084, lng: -78.4453 },
  Mercer: { lat: 41.227, lng: -80.2398 },
  Mifflin: { lat: 40.5992, lng: -77.5714 },
  Monroe: { lat: 40.9868, lng: -75.1946 },
  Montgomery: { lat: 40.1215, lng: -75.3399 },
  Montour: { lat: 40.9634, lng: -76.6127 },
  Northampton: { lat: 40.6884, lng: -75.2207 },
  Northumberland: { lat: 40.8626, lng: -76.7944 },
  Perry: { lat: 40.4276, lng: -77.185 },
  Philadelphia: { lat: 39.9526, lng: -75.1652 },
  Pike: { lat: 41.3287, lng: -74.7985 },
  Potter: { lat: 41.7734, lng: -78.0206 },
  Schuylkill: { lat: 40.6856, lng: -76.1955 },
  Snyder: { lat: 40.7859, lng: -77.0453 },
  Somerset: { lat: 40.0084, lng: -79.0781 },
  Sullivan: { lat: 41.4234, lng: -76.4922 },
  Susquehanna: { lat: 41.8337, lng: -75.8771 },
  Tioga: { lat: 41.7487, lng: -77.3005 },
  Union: { lat: 40.9645, lng: -76.8844 },
  Venango: { lat: 41.3978, lng: -79.8314 },
  Warren: { lat: 41.8439, lng: -79.145 },
  Washington: { lat: 40.174, lng: -80.2462 },
  Wayne: { lat: 41.5743, lng: -75.2574 },
  Westmoreland: { lat: 40.3015, lng: -79.5389 },
  Wyoming: { lat: 41.5387, lng: -75.9469 },
  York: { lat: 39.9626, lng: -76.7277 },
};

export function getCountyCoordinates(countyName: string): {
  lat: number;
  lng: number;
} {
  return PA_COUNTY_COORDS[countyName] || { lat: 40.9699, lng: -77.7278 };
}

/**
 * WMO Weather interpretation code helper (bilingual EN / ES)
 */
export function describeWeatherCode(
  code: number,
  lang: AppLanguage
): {
  label: string;
  iconType: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog';
} {
  if (code === 0 || code === 1) {
    return {
      label: lang === 'en' ? 'Clear Sky' : 'Cielo Despejado',
      iconType: 'sun',
    };
  }
  if (code === 2 || code === 3) {
    return {
      label: lang === 'en' ? 'Partly Cloudy' : 'Parcialmente Nublado',
      iconType: 'cloud',
    };
  }
  if (code === 45 || code === 48) {
    return {
      label: lang === 'en' ? 'Appalachian Mist / Fog' : 'Neblina / Niebla',
      iconType: 'fog',
    };
  }
  if (code >= 51 && code <= 67) {
    return {
      label: lang === 'en' ? 'Light Rain / Drizzle' : 'Lluvia / Llovizna',
      iconType: 'rain',
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      label: lang === 'en' ? 'Snowfall' : 'Nevada',
      iconType: 'snow',
    };
  }
  if (code >= 80 && code <= 82) {
    return {
      label: lang === 'en' ? 'Rain Showers' : 'Chubascos',
      iconType: 'rain',
    };
  }
  if (code >= 85 && code <= 86) {
    return {
      label: lang === 'en' ? 'Snow Showers' : 'Chubascos de Nieve',
      iconType: 'snow',
    };
  }
  if (code >= 95) {
    return {
      label: lang === 'en' ? 'Thunderstorm' : 'Tormenta Eléctrica',
      iconType: 'storm',
    };
  }
  return {
    label: lang === 'en' ? 'Fair Conditions' : 'Condiciones Estables',
    iconType: 'cloud',
  };
}

async function fetchWikipediaCountySummary(
  countyName: string,
  lang: AppLanguage
): Promise<LiveCountySnapshotData['wikipedia']> {
  const enSlug = encodeURIComponent(`${countyName}_County,_Pennsylvania`);
  const enEndpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${enSlug}`;

  if (lang === 'es') {
    const esSlug = encodeURIComponent(
      `Condado_de_${countyName}_(Pensilvania)`
    );
    const esEndpoint = `https://es.wikipedia.org/api/rest_v1/page/summary/${esSlug}`;

    try {
      const esRes = await fetch(esEndpoint, {
        headers: { Accept: 'application/json' },
      });
      if (esRes.ok) {
        const esJson = await esRes.json();
        let imgUrl: string | null =
          esJson.originalimage?.source || esJson.thumbnail?.source || null;

        // If Spanish article lacks a thumbnail, enrich image from English Wikipedia
        if (!imgUrl) {
          try {
            const enRes = await fetch(enEndpoint);
            if (enRes.ok) {
              const enJson = await enRes.json();
              imgUrl =
                enJson.originalimage?.source ||
                enJson.thumbnail?.source ||
                null;
            }
          } catch {
            // Ignore secondary image fetch error
          }
        }

        return {
          title: esJson.title || `Condado de ${countyName}, Pensilvania`,
          description:
            esJson.description || 'Condado del Estado de Pensilvania, EE. UU.',
          extract: esJson.extract || '',
          imageUrl: imgUrl,
          articleUrl:
            esJson.content_urls?.desktop?.page ||
            `https://es.wikipedia.org/wiki/${esSlug}`,
          sourceLang: 'es',
        };
      }
    } catch {
      // Fallback to English Wikipedia below
    }
  }

  const enRes = await fetch(enEndpoint, {
    headers: { Accept: 'application/json' },
  });
  if (!enRes.ok) {
    throw new Error(`Wikipedia REST error: ${enRes.status}`);
  }
  const enJson = await enRes.json();

  return {
    title: enJson.title || `${countyName} County, Pennsylvania`,
    description:
      enJson.description || 'County in the Commonwealth of Pennsylvania',
    extract: enJson.extract || '',
    imageUrl:
      enJson.originalimage?.source || enJson.thumbnail?.source || null,
    articleUrl:
      enJson.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${enSlug}`,
    sourceLang: 'en',
  };
}

async function fetchOpenMeteoCountyLive(
  lat: number,
  lng: number
): Promise<LiveCountySnapshotData['weather']> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP ${res.status}`);
  }
  const data = await res.json();

  const tempF = Math.round(Number(data.current?.temperature_2m ?? 56));
  const tempC = Math.round(((tempF - 32) * 5) / 9);
  const humidity = Math.round(Number(data.current?.relative_humidity_2m ?? 60));
  const windMph = Math.round(Number(data.current?.wind_speed_10m ?? 6));
  const weatherCode = Number(data.current?.weather_code ?? 1);
  const elevationMeters = Math.round(Number(data.elevation ?? 210));
  const elevationFeet = Math.round(elevationMeters * 3.28084);

  return {
    tempF,
    tempC,
    humidity,
    windMph,
    weatherCode,
    elevationFeet,
    elevationMeters,
  };
}

/**
 * Fetches live county data in parallel (Wikipedia REST + Open-Meteo API)
 * with sessionStorage caching (`keystone_live_${countyName}_${lang}`).
 */
export async function fetchLiveCountySnapshot(
  countyName: string,
  lang: AppLanguage
): Promise<LiveCountySnapshotData> {
  const cacheKey = `keystone_live_${countyName}_${lang}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as LiveCountySnapshotData;
      if (parsed && parsed.countyName === countyName) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }

  const coords = getCountyCoordinates(countyName);

  const [wikiResult, weatherResult] = await Promise.allSettled([
    fetchWikipediaCountySummary(countyName, lang),
    fetchOpenMeteoCountyLive(coords.lat, coords.lng),
  ]);

  const wikipedia: LiveCountySnapshotData['wikipedia'] =
    wikiResult.status === 'fulfilled'
      ? wikiResult.value
      : {
          title:
            lang === 'en'
              ? `${countyName} County, Pennsylvania`
              : `Condado de ${countyName}, Pensilvania`,
          description:
            lang === 'en'
              ? 'County in the Commonwealth of Pennsylvania'
              : 'Condado de la Mancomunidad de Pensilvania',
          extract: '',
          imageUrl: null,
          articleUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
            countyName + '_County,_Pennsylvania'
          )}`,
          sourceLang: lang,
        };

  const weather: LiveCountySnapshotData['weather'] =
    weatherResult.status === 'fulfilled' ? weatherResult.value : null;

  const snapshot: LiveCountySnapshotData = {
    countyName,
    language: lang,
    coordinates: coords,
    wikipedia,
    weather,
    fetchedAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(snapshot));
  } catch {
    // Ignore sessionStorage quota errors
  }

  return snapshot;
}
