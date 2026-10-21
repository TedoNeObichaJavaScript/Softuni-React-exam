import { ApiError, request } from './request';
import { DIFFICULTIES } from '../utils/constants';
import { isPositiveId, isUuid } from '../utils/validators';

/* likes links trails and profiles a second time, so the author embed needs the FK name. */
export const TRAIL_SELECT = '*,author:profiles!trails_owner_id_fkey(id,username),likes(owner_id),comments(id)';

const TRAILS_PATH = '/rest/v1/trails';
const TRAIL_FIELDS = [
  'title',
  'region',
  'difficulty',
  'distance_km',
  'elevation_gain_m',
  'duration_hours',
  'description',
  'image_url',
];

const SORT_ORDERS = {
  newest: 'created_at.desc',
  oldest: 'created_at.asc',
  shortest: 'distance_km.asc',
  longest: 'distance_km.desc',
  name: 'title.asc',
};

function trailNotFound() {
  return new ApiError('This trail does not exist or was removed.', 404);
}

function toSortOrder(sort) {
  return Object.hasOwn(SORT_ORDERS, sort) ? SORT_ORDERS[sort] : SORT_ORDERS.newest;
}

/* These characters have a meaning inside PostgREST filters, so they are dropped from the search. */
function sanitizeSearch(search) {
  return String(search ?? '').replace(/[,()"*\\:%]/g, ' ').trim();
}

function pickTrailFields(payload) {
  return Object.fromEntries(
    TRAIL_FIELDS.filter((field) => field in payload).map((field) => [field, payload[field]]),
  );
}

async function sendTrailWrite(options) {
  try {
    return await request(TRAILS_PATH, options);
  } catch (error) {
    if (error instanceof ApiError && error.code === '23514') {
      throw new ApiError('Some of the trail details are not valid. Check the form and try again.', error.status, error.code);
    }
    throw error;
  }
}

export function getTrails({ search, difficulty, sort } = {}, signal) {
  const params = { select: TRAIL_SELECT, order: toSortOrder(sort) };

  if (DIFFICULTIES.some((option) => option.value === difficulty)) {
    params.difficulty = `eq.${difficulty}`;
  }

  const term = sanitizeSearch(search);
  if (term) {
    params.or = `(title.ilike.*${term}*,region.ilike.*${term}*)`;
  }

  return request(TRAILS_PATH, { params, signal });
}

export function getLatestTrails(limit = 6, signal) {
  return request(TRAILS_PATH, {
    params: { select: TRAIL_SELECT, order: SORT_ORDERS.newest, limit },
    signal,
  });
}

export async function getTrail(id, signal) {
  if (!isPositiveId(id)) throw trailNotFound();

  const data = await request(TRAILS_PATH, {
    params: { select: TRAIL_SELECT, id: `eq.${id}` },
    signal,
  });

  if (!data?.length) throw trailNotFound();
  return data[0];
}

export async function getTrailsByOwner(ownerId, signal) {
  if (!isUuid(ownerId)) return [];

  return request(TRAILS_PATH, {
    params: { select: TRAIL_SELECT, owner_id: `eq.${ownerId}`, order: SORT_ORDERS.newest },
    signal,
  });
}

export async function createTrail(payload, token) {
  const data = await sendTrailWrite({
    method: 'POST',
    params: { select: TRAIL_SELECT },
    body: pickTrailFields(payload),
    token,
    prefer: 'return=representation',
  });
  return data[0];
}

export async function updateTrail(id, payload, token) {
  if (!isPositiveId(id)) throw trailNotFound();

  const data = await sendTrailWrite({
    method: 'PATCH',
    params: { id: `eq.${id}`, select: TRAIL_SELECT },
    body: pickTrailFields(payload),
    token,
    prefer: 'return=representation',
  });

  if (!data?.length) {
    throw new ApiError('This trail could not be updated. Only its author can edit it.', 403);
  }
  return data[0];
}

export async function deleteTrail(id, token) {
  if (!isPositiveId(id)) throw trailNotFound();

  const data = await request(TRAILS_PATH, {
    method: 'DELETE',
    params: { id: `eq.${id}`, select: 'id' },
    token,
    prefer: 'return=representation',
  });

  if (!data?.length) {
    throw new ApiError('This trail could not be deleted. Only its author can delete it.', 403);
  }
}
