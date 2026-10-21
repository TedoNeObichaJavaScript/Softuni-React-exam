export const EMPTY_TRAIL_VALUES = {
  title: '',
  region: '',
  difficulty: 'moderate',
  distanceKm: '',
  elevationGain: '',
  durationHours: '',
  description: '',
  imageUrl: '',
};

function toText(value) {
  return value === null || value === undefined ? '' : String(value);
}

export function toTrailPayload(values) {
  return {
    title: toText(values.title).trim(),
    region: toText(values.region).trim(),
    difficulty: values.difficulty,
    distance_km: Number(values.distanceKm),
    elevation_gain_m: Number(values.elevationGain),
    duration_hours: Number(values.durationHours),
    description: toText(values.description).trim(),
    image_url: toText(values.imageUrl).trim() || null,
  };
}

export function toTrailFormValues(trail) {
  return {
    title: toText(trail.title),
    region: toText(trail.region),
    difficulty: trail.difficulty || EMPTY_TRAIL_VALUES.difficulty,
    distanceKm: toText(trail.distance_km),
    elevationGain: toText(trail.elevation_gain_m),
    durationHours: toText(trail.duration_hours),
    description: toText(trail.description),
    imageUrl: toText(trail.image_url),
  };
}
