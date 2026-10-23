import { ApiError, request } from './request';

const WRONG_CREDENTIALS = 'Wrong email or password.';
const EMAIL_NOT_CONFIRMED = 'Please confirm your email address before logging in.';
const EMAIL_TAKEN = 'An account with this email already exists.';
const TOO_MANY_ATTEMPTS = 'Too many attempts. Wait a minute and try again.';
const SIGNUP_FAILED = 'Could not create the account. The username might already be taken.';

const MESSAGES_BY_CODE = {
  invalid_credentials: WRONG_CREDENTIALS,
  email_not_confirmed: EMAIL_NOT_CONFIRMED,
  user_already_exists: EMAIL_TAKEN,
  email_exists: EMAIL_TAKEN,
  over_email_send_rate_limit: TOO_MANY_ATTEMPTS,
  over_request_rate_limit: TOO_MANY_ATTEMPTS,
};

const MESSAGES_BY_TEXT = [
  ['invalid login credentials', WRONG_CREDENTIALS],
  ['email not confirmed', EMAIL_NOT_CONFIRMED],
  ['already registered', EMAIL_TAKEN],
  ['database error saving new user', SIGNUP_FAILED],
];

function getFriendlyMessage(error) {
  if (error.code === 'weak_password') return error.message;
  if (Object.hasOwn(MESSAGES_BY_CODE, error.code)) return MESSAGES_BY_CODE[error.code];
  if (error.status === 429) return TOO_MANY_ATTEMPTS;

  const text = error.message.toLowerCase();
  const match = MESSAGES_BY_TEXT.find(([fragment]) => text.includes(fragment));
  return match ? match[1] : error.message;
}

async function authRequest(path, options) {
  try {
    return await request(path, options);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    throw new ApiError(getFriendlyMessage(error), error.status, error.code);
  }
}

function toSession(data) {
  const expiresAt = data.expires_at
    ? data.expires_at * 1000
    : Date.now() + data.expires_in * 1000;
  const { id, email = '', user_metadata: metadata } = data.user;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt,
    user: {
      id,
      email,
      username: metadata?.username || email.split('@')[0],
    },
  };
}

export async function signUp({ username, email, password }) {
  const data = await authRequest('/auth/v1/signup', {
    method: 'POST',
    body: { email: email.trim(), password, data: { username: username.trim() } },
  });

  if (data?.access_token) {
    return { session: toSession(data), needsConfirmation: false };
  }
  return { session: null, needsConfirmation: true };
}

export async function signIn({ email, password }) {
  const data = await authRequest('/auth/v1/token', {
    method: 'POST',
    params: { grant_type: 'password' },
    body: { email: email.trim(), password },
  });
  return toSession(data);
}

export async function refreshSession(refreshToken) {
  const data = await authRequest('/auth/v1/token', {
    method: 'POST',
    params: { grant_type: 'refresh_token' },
    body: { refresh_token: refreshToken },
  });
  return toSession(data);
}

export async function signOut(accessToken) {
  try {
    await authRequest('/auth/v1/logout', {
      method: 'POST',
      params: { scope: 'local' },
      token: accessToken,
    });
  } catch (error) {
    const isSessionGone = error instanceof ApiError && (error.status === 401 || error.status === 403);
    if (!isSessionGone) throw error;
  }
}
