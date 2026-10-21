import { ApiError, request } from './request';
import { isPositiveId } from '../utils/validators';

const COMMENT_SELECT = '*,author:profiles!comments_owner_id_fkey(id,username)';
const COMMENTS_PATH = '/rest/v1/comments';
const FOREIGN_KEY_VIOLATION = '23503';

export async function getComments(trailId, signal) {
  if (!isPositiveId(trailId)) return [];

  return request(COMMENTS_PATH, {
    params: { select: COMMENT_SELECT, trail_id: `eq.${trailId}`, order: 'created_at.asc' },
    signal,
  });
}

export async function createComment(trailId, body, token) {
  try {
    const data = await request(COMMENTS_PATH, {
      method: 'POST',
      params: { select: COMMENT_SELECT },
      body: { trail_id: Number(trailId), body: body.trim() },
      token,
      prefer: 'return=representation',
    });
    return data[0];
  } catch (error) {
    if (error instanceof ApiError && error.code === FOREIGN_KEY_VIOLATION) {
      throw new ApiError('This trail does not exist or was removed.', 404, error.code);
    }
    throw error;
  }
}

export async function deleteComment(id, token) {
  const data = await request(COMMENTS_PATH, {
    method: 'DELETE',
    params: { id: `eq.${id}`, select: 'id' },
    token,
    prefer: 'return=representation',
  });

  if (!data?.length) {
    throw new ApiError('This comment could not be deleted. Only its author can delete it.', 403);
  }
}
