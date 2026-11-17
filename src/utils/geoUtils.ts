import { union, featureCollection } from '@turf/turf';
import {
  PA_COUNTIES_DATA,
  CountyRecord,
  RegionId,
} from '../data/paCountiesData';
import {
  HISTORICAL_SCENARIOS,
  HistoricalScenarioId,
  HistoricalTerritoryDefinition,
} from '../data/historicalTerritoriesConfig';

export const PA_CENTER: google.maps.LatLngLiteral = {
  lat: 40.9699,
  lng: -77.7278,
};

export const PA_DEFAULT_ZOOM = 7;

export const SESSION_STORAGE_KEY = 'keystone_pa_67_counties_geojson_v1';

// Public GeoJSON sources for US Counties (STATE == '42' / STATEFP == '42' is Pennsylvania)
const LOCAL_PA_GEOJSON_URL = '/pa-counties.geojson';
const OPEN_US_COUNTIES_GEOJSON_URL =
  'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';

export interface EnrichedCountyFeature {
  type: 'Feature';
  id: string;
  properties: CountyRecord & {
    STATE: string;
    COUNTY: string;
    NAME: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface PACountiesGeoJSON {
  type: 'FeatureCollection';
  features: EnrichedCountyFeature[];
}

export interface MergedHistoricalFeature {
  type: 'Feature';
  id: string;
  properties: HistoricalTerritoryDefinition & {
    mergedCountiesCount: number;
    totalAreaSqMi: number;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface HistoricalMergedGeoJSON {
  type: 'FeatureCollection';
  scenarioId: HistoricalScenarioId;
  features: MergedHistoricalFeature[];
}

// Match county record by name or 5-digit FIPS
const FIPS_TO_COUNTY: Record<string, CountyRecord> = {};
Object.values(PA_COUNTIES_DATA).forEach((county) => {
  FIPS_TO_COUNTY[county.fips] = county;
});

// In-memory cache for merged Turf.js scenarios
const mergedScenarioCache: Partial<
  Record<HistoricalScenarioId, HistoricalMergedGeoJSON>
> = {};

function normalizeCountyName(rawName: string): string {
  return rawName
    .replace(/\s+County$/i, '')
    .trim()
    .replace(/^Mc\s*kean$/i, 'McKean');
}

/**
 * Loads the real boundaries of all 67 Pennsylvania counties from GeoJSON,
 * filtering by STATE == '42' / STATEFP == '42' and caching in sessionStorage.
 */
export async function loadPACountiesGeoJSON(): Promise<PACountiesGeoJSON> {
  try {
    const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as PACountiesGeoJSON;
      if (
        parsed &&
        Array.isArray(parsed.features) &&
        parsed.features.length === 67
      ) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }

  let rawData: any = null;

  try {
    const localRes = await fetch(LOCAL_PA_GEOJSON_URL);
    if (localRes.ok) {
      rawData = await localRes.json();
    }
  } catch {
    // Fallback to remote open source
  }

  if (!rawData || !Array.isArray(rawData.features)) {
    const remoteRes = await fetch(OPEN_US_COUNTIES_GEOJSON_URL);
    if (!remoteRes.ok) {
      throw new Error(
        `No se pudo cargar el archivo GeoJSON (${remoteRes.status})`
      );
    }
    rawData = await remoteRes.json();
  }

  const paFeatures = (rawData.features || []).filter((f: any) => {
    const props = f.properties || {};
    const stateCode = String(props.STATE || props.STATEFP || '');
    const idStr = String(f.id || props.GEO_ID || '');
    return (
      stateCode === '42' ||
      idStr.startsWith('42') ||
      idStr.endsWith('US42' + (props.COUNTY || ''))
    );
  });

  const enrichedFeatures: EnrichedCountyFeature[] = paFeatures.map((f: any) => {
    const props = f.properties || {};
    const fipsFromId =
      typeof f.id === 'string' && f.id.length === 5
        ? f.id
        : `42${String(props.COUNTY || props.COUNTYFP || '').padStart(3, '0')}`;

    const rawName = normalizeCountyName(String(props.NAME || ''));
    const countyInfo =
      PA_COUNTIES_DATA[rawName] ||
      FIPS_TO_COUNTY[fipsFromId] || {
        fips: fipsFromId,
        name: rawName || 'Unknown',
        founded: 1800,
        countySeat: 'N/A',
        region: 'southcentral' as RegionId,
        etymology: 'Condado histórico de la Mancomunidad de Pensilvania.',
        historicalImportance:
          'Territorio integrante de la evolución política de Pensilvania.',
        economicProfile: 'Agricultura, industria y servicios regionales.',
        indigenousHeritage:
          'Territorio ancestral de naciones Lenape, Susquehannock e Iroquesas.',
        keyLandmark: 'Centro Histórico del Condado',
        areaSqMi: 500,
      };

    return {
      type: 'Feature',
      id: countyInfo.fips,
      properties: {
        ...countyInfo,
        STATE: '42',
        COUNTY: countyInfo.fips.slice(2),
        NAME: countyInfo.name,
      },
      geometry: f.geometry,
    };
  });

  const collection: PACountiesGeoJSON = {
    type: 'FeatureCollection',
    features: enrichedFeatures,
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(collection));
  } catch {
    // Ignore quota errors on sessionStorage
  }

  return collection;
}

/**
 * Merges modern Pennsylvania county polygons into unified historical territories
 * without internal modern borders using @turf/turf (turf.union).
 */
export function buildHistoricalMergedGeoJSON(
  baseGeoJSON: PACountiesGeoJSON,
  scenarioId: HistoricalScenarioId
): HistoricalMergedGeoJSON {
  if (mergedScenarioCache[scenarioId]) {
    return mergedScenarioCache[scenarioId]!;
  }

  const storageKey = `keystone_pa_merged_scenario_${scenarioId}_v1`;
  try {
    const cachedStr = sessionStorage.getItem(storageKey);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr) as HistoricalMergedGeoJSON;
      if (parsed && Array.isArray(parsed.features) && parsed.features.length > 0) {
        mergedScenarioCache[scenarioId] = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore sessionStorage errors
  }

  const scenario = HISTORICAL_SCENARIOS[scenarioId];
  const countyByName: Record<string, EnrichedCountyFeature> = {};
  baseGeoJSON.features.forEach((f) => {
    countyByName[f.properties.name] = f;
  });

  const mergedFeatures: MergedHistoricalFeature[] = [];

  for (const territory of scenario.territories) {
    const memberFeatures = territory.modernCounties
      .map((name) => countyByName[name])
      .filter((f): f is EnrichedCountyFeature => Boolean(f));

    if (memberFeatures.length === 0) continue;

    const totalAreaSqMi = memberFeatures.reduce(
      (sum, f) => sum + (f.properties.areaSqMi || 0),
      0
    );

    let mergedGeometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: any } =
      memberFeatures[0].geometry;

    if (memberFeatures.length >= 2) {
      try {
        // Turf v7 union accepts a FeatureCollection of Polygon/MultiPolygon features
        const fc = featureCollection(memberFeatures as any);
        const united = union(fc as any);
        if (united && united.geometry) {
          mergedGeometry = united.geometry as {
            type: 'Polygon' | 'MultiPolygon';
            coordinates: any;
          };
        }
      } catch {
        // Fallback: combine polygon coordinate arrays into a single MultiPolygon
        const multiCoords: any[] = [];
        memberFeatures.forEach((mf) => {
          if (mf.geometry.type === 'Polygon') {
            multiCoords.push(mf.geometry.coordinates);
          } else if (mf.geometry.type === 'MultiPolygon') {
            multiCoords.push(...mf.geometry.coordinates);
          }
        });
        mergedGeometry = {
          type: 'MultiPolygon',
          coordinates: multiCoords,
        };
      }
    }

    mergedFeatures.push({
      type: 'Feature',
      id: territory.id,
      properties: {
        ...territory,
        mergedCountiesCount: memberFeatures.length,
        totalAreaSqMi,
      },
      geometry: mergedGeometry,
    });
  }

  const result: HistoricalMergedGeoJSON = {
    type: 'FeatureCollection',
    scenarioId,
    features: mergedFeatures,
  };

  mergedScenarioCache[scenarioId] = result;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(result));
  } catch {
    // Ignore storage quota errors
  }

  return result;
}

/**
 * Recursively extends a google.maps.LatLngBounds object with a google.maps.Data.Geometry
 */
export function processDataGeometryPoints(
  geometry: google.maps.LatLng | google.maps.Data.Geometry,
  bounds: google.maps.LatLngBounds
): void {
  if (geometry instanceof google.maps.LatLng) {
    bounds.extend(geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    bounds.extend(geometry.get());
  } else {
    const arr = (
      geometry as
        | google.maps.Data.Polygon
        | google.maps.Data.MultiPolygon
        | google.maps.Data.LinearRing
    ).getArray();
    arr.forEach((subGeometry) => {
      processDataGeometryPoints(subGeometry, bounds);
    });
  }
}

/**
 * Computes LatLngBounds for a google.maps.Data.Feature
 */
export function getDataFeatureBounds(
  feature: google.maps.Data.Feature
): google.maps.LatLngBounds | null {
  const geometry = feature.getGeometry();
  if (!geometry) return null;
  const bounds = new google.maps.LatLngBounds();
  processDataGeometryPoints(geometry, bounds);
  return bounds;
}

/**
 * Computes LatLngBounds from raw GeoJSON geometry coordinates
 */
export function getGeoJsonFeatureBounds(feature: {
  geometry?: { coordinates: any };
}): google.maps.LatLngBounds | null {
  if (!feature || !feature.geometry) return null;
  const bounds = new google.maps.LatLngBounds();

  const extendCoords = (coords: any): void => {
    if (!Array.isArray(coords) || coords.length === 0) return;
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // GeoJSON uses [lng, lat]
      bounds.extend({ lat: coords[1], lng: coords[0] });
    } else {
      coords.forEach((child: any) => extendCoords(child));
    }
  };

  extendCoords(feature.geometry.coordinates);
  return bounds;
}

/**
 * Computes the approximate visual center of a GeoJSON feature
 */
export function getGeoJsonFeatureCenter(feature: {
  geometry?: { coordinates: any };
}): google.maps.LatLngLiteral {
  const bounds = getGeoJsonFeatureBounds(feature);
  if (!bounds) return PA_CENTER;
  const center = bounds.getCenter();
  return { lat: center.lat(), lng: center.lng() };
}

/**
 * Minimalist dark map style ("American Civic Archive" — Federal Midnight Blue)
 * Hides businesses, commercial POIs, and secondary road clutter.
 */
export const ARCHIVAL_DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#09111E' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748B' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#09111E' }, { weight: 2 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#D4AF37' }, { weight: 1.5 }, { visibility: 'on' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94A3B8' }],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0C1728' }, { visibility: 'simplified' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#16243D' }, { weight: 0.7 }],
  },
  {
    featureType: 'road.arterial',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.local',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#0B1526' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#050A14' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#475569' }],
  },
];
