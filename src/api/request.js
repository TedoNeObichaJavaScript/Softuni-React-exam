import { SUPABASE_KEY, SUPABASE_URL } from './config';

const MISSING_CONFIG_MESSAGE = 'The app is missing its Supabase settings. Check the .env.local file.';
const NETWORK_ERROR_MESSAGE = 'Could not reach the server. Check your connection and try again.';

export class ApiError extends Error {
  constructor(message, status = 0, code = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path, params = {}) {
  const url = new URL(path, SUPABASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

function buildHeaders({ token, prefer, hasBody }) {
  const headers = { apikey: SUPABASE_KEY };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (prefer) headers.Prefer = prefer;

  return headers;
}

async function readBody(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getFallbackMessage(status) {
  if (status === 401 || status === 403) return 'You are not allowed to do that. Try logging in again.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status >= 500) return 'The server had a problem. Please try again later.';
  return `Request failed (status ${status}).`;
}

function toApiError(data, status) {
  const candidates = [data?.msg, data?.error_description, data?.message, data?.error];
  const serverMessage = candidates.find((value) => typeof value === 'string' && value.trim());
  const code = data?.error_code || data?.code || null;

  return new ApiError(serverMessage || getFallbackMessage(status), status, code);
}

export async function request(path, { method = 'GET', params, body, token, signal, prefer } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new ApiError(MISSING_CONFIG_MESSAGE, 0);
  }

  const url = buildUrl(path, params);
  const hasBody = body !== undefined;
  let response;
  let data;

  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders({ token, prefer, hasBody }),
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });
    data = await readBody(response);
  } catch (error) {
    if (error.name === 'AbortError' || signal?.aborted) throw error;
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
  }

  if (!response.ok) throw toApiError(data, response.status);

  return data;
}
