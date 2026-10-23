import { ApiError, request } from './request';
import { isUuid } from '../utils/validators';

const PROFILES_PATH = '/rest/v1/profiles';

function profileNotFound() {
  return new ApiError('This hiker does not exist.', 404);
}

export async function getProfile(id, signal) {
  if (!isUuid(id)) throw profileNotFound();

  const data = await request(PROFILES_PATH, {
    params: { select: 'id,username,created_at', id: `eq.${id}` },
    signal,
  });

  if (!data?.length) throw profileNotFound();
  return data[0];
}

export async function isUsernameTaken(username, signal) {
  const wanted = String(username ?? '').trim().toLowerCase();
  if (!wanted) return false;

  const data = await request(PROFILES_PATH, {
    params: { select: 'username', username: `ilike.${wanted}` },
    signal,
  });

  return (data ?? []).some((profile) => profile.username.toLowerCase() === wanted);
}
