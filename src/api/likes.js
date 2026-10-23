import { ApiError, request } from './request';
import { TRAIL_SELECT } from './trails';
import { isUuid } from '../utils/validators';

const LIKES_PATH = '/rest/v1/likes';
const UNIQUE_VIOLATION = '23505';
const POLICY_VIOLATION = '42501';

function toLikeError(error) {
  if (!(error instanceof ApiError)) return error;

  if (error.code === UNIQUE_VIOLATION) {
    return new ApiError('You already liked this trail.', error.status, error.code);
  }
  if (error.code === POLICY_VIOLATION && error.status === 403) {
    return new ApiError('You cannot like your own trail.', error.status, error.code);
  }
  return error;
}

export async function likeTrail(trailId, token) {
  try {
    await request(LIKES_PATH, {
      method: 'POST',
      body: { trail_id: Number(trailId) },
      token,
    });
  } catch (error) {
    throw toLikeError(error);
  }
}

export async function unlikeTrail(trailId, userId, token) {
  await request(LIKES_PATH, {
    method: 'DELETE',
    params: { trail_id: `eq.${trailId}`, owner_id: `eq.${userId}` },
    token,
  });
}

export async function getLikedTrails(userId, signal) {
  if (!isUuid(userId)) return [];

  const data = await request(LIKES_PATH, {
    params: {
      select: `created_at,trail:trails(${TRAIL_SELECT})`,
      owner_id: `eq.${userId}`,
      order: 'created_at.desc',
    },
    signal,
  });

  return (data ?? []).map((like) => like.trail).filter(Boolean);
}
