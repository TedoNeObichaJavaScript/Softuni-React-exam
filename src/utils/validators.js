import { COMMENT_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, DIFFICULTIES } from './constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;
const HTTP_PREFIX_PATTERN = /^https?:\/\//i;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POSITIVE_ID_PATTERN = /^[1-9]\d{0,17}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const IMAGE_URL_MAX_LENGTH = 500;

function toText(value) {
  return String(value ?? '').trim();
}

function collectErrors(fieldErrors) {
  return Object.fromEntries(Object.entries(fieldErrors).filter(([, message]) => message));
}

function checkLength(value, label, min, max) {
  const text = toText(value);
  if (!text) return `${label} is required.`;
  if (text.length < min || text.length > max) {
    return `${label} must be between ${min} and ${max} characters.`;
  }
  return '';
}

function checkNumber(value, { label, unit, min, max, inclusiveMin = false, wholeOnly = false }) {
  const text = toText(value);
  if (!text) return `${label} is required.`;

  const number = Number(text);
  if (!Number.isFinite(number)) return 'Enter a number.';
  if (wholeOnly && !Number.isInteger(number)) return `${label} must be a whole number.`;

  const isTooSmall = inclusiveMin ? number < min : number <= min;
  if (isTooSmall || number > max) {
    const lowerBound = inclusiveMin ? `between ${min} and ${max}` : `more than ${min} and at most ${max}`;
    return `${label} must be ${lowerBound} ${unit}.`;
  }
  return '';
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(toText(value));
}

export function isValidUrl(value) {
  const text = toText(value);
  if (!HTTP_PREFIX_PATTERN.test(text)) return false;

  try {
    return Boolean(new URL(text).hostname);
  } catch {
    return false;
  }
}

export function isUuid(value) {
  return UUID_PATTERN.test(String(value ?? ''));
}

export function isPositiveId(value) {
  return POSITIVE_ID_PATTERN.test(String(value ?? ''));
}

function checkEmail(email) {
  if (!toText(email)) return 'Email is required.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  return '';
}

function checkUsername(username) {
  const lengthError = checkLength(username, 'Username', 3, 20);
  if (lengthError) return lengthError;
  if (!USERNAME_PATTERN.test(toText(username))) {
    return 'Username can only contain letters, numbers and underscores.';
  }
  return '';
}

function checkNewPassword(password = '') {
  if (!password) return 'Password is required.';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password can be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return '';
}

function checkRepeatPassword(password, repeatPassword) {
  if (!repeatPassword) return 'Please repeat your password.';
  if (password !== repeatPassword) return 'Passwords do not match.';
  return '';
}

function checkDifficulty(difficulty) {
  const isKnown = DIFFICULTIES.some((option) => option.value === difficulty);
  return isKnown ? '' : 'Choose a difficulty.';
}

function checkImageUrl(imageUrl) {
  const text = toText(imageUrl);
  if (!text) return '';
  if (text.length > IMAGE_URL_MAX_LENGTH) {
    return `Image URL can be at most ${IMAGE_URL_MAX_LENGTH} characters.`;
  }
  if (!isValidUrl(text)) return 'Enter a valid link that starts with http:// or https://.';
  return '';
}

export function validateLogin({ email, password }) {
  return collectErrors({
    email: checkEmail(email),
    password: password ? '' : 'Password is required.',
  });
}

export function validateRegister({ username, email, password, repeatPassword }) {
  return collectErrors({
    username: checkUsername(username),
    email: checkEmail(email),
    password: checkNewPassword(password),
    repeatPassword: checkRepeatPassword(password, repeatPassword),
  });
}

export function validateTrail(values) {
  return collectErrors({
    title: checkLength(values.title, 'Title', 3, 80),
    region: checkLength(values.region, 'Region', 2, 60),
    difficulty: checkDifficulty(values.difficulty),
    distanceKm: checkNumber(values.distanceKm, { label: 'Distance', unit: 'km', min: 0.1, max: 300, inclusiveMin: true }),
    elevationGain: checkNumber(values.elevationGain, {
      label: 'Elevation gain',
      unit: 'm',
      min: 0,
      max: 5000,
      inclusiveMin: true,
      wholeOnly: true,
    }),
    durationHours: checkNumber(values.durationHours, { label: 'Duration', unit: 'hours', min: 0.1, max: 72, inclusiveMin: true }),
    description: checkLength(values.description, 'Description', 20, DESCRIPTION_MAX_LENGTH),
    imageUrl: checkImageUrl(values.imageUrl),
  });
}

export function validateComment(body) {
  const text = toText(body);
  if (!text) return 'Write something before posting.';
  if (text.length > COMMENT_MAX_LENGTH) {
    return `Comments can be at most ${COMMENT_MAX_LENGTH} characters.`;
  }
  return '';
}
