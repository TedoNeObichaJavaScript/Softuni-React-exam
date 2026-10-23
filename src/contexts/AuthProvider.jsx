import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './authContext';
import { refreshSession, signIn, signOut, signUp } from '../api/auth';
import { ApiError } from '../api/request';

const STORAGE_KEY = 'trailbook.session';
const REFRESH_MARGIN_MS = 60 * 1000;
const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.';

function readStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return session?.accessToken && session?.user?.id ? session : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

function isExpiringSoon(session) {
  return session.expiresAt - Date.now() < REFRESH_MARGIN_MS;
}

function isRejectedRefresh(error) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429;
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const sessionRef = useRef(session);
  const pendingRefreshRef = useRef(null);

  const syncSession = useCallback((nextSession) => {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const applySession = useCallback((nextSession) => {
    writeStoredSession(nextSession);
    syncSession(nextSession);
  }, [syncSession]);

  const refresh = useCallback(() => {
    if (pendingRefreshRef.current) return pendingRefreshRef.current;

    const { refreshToken } = sessionRef.current;
    const isStillCurrent = () => sessionRef.current?.refreshToken === refreshToken;

    const pending = refreshSession(refreshToken)
      .then(
        (nextSession) => {
          if (isStillCurrent()) applySession(nextSession);
          if (!sessionRef.current) throw new ApiError(SESSION_EXPIRED_MESSAGE, 401);
          return sessionRef.current;
        },
        (error) => {
          if (!isRejectedRefresh(error)) throw error;
          if (isStillCurrent()) applySession(null);
          throw new ApiError(SESSION_EXPIRED_MESSAGE, 401);
        },
      )
      .finally(() => {
        pendingRefreshRef.current = null;
      });

    pendingRefreshRef.current = pending;
    return pending;
  }, [applySession]);

  useEffect(() => {
    const storedSession = sessionRef.current;
    if (storedSession && isExpiringSoon(storedSession)) {
      refresh().catch(() => {});
    }
  }, [refresh]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      syncSession(readStoredSession());
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncSession]);

  const getAccessToken = useCallback(async () => {
    const currentSession = sessionRef.current;
    if (!currentSession) throw new ApiError('You need to log in first.', 401);
    if (!isExpiringSoon(currentSession)) return currentSession.accessToken;

    const nextSession = await refresh();
    return nextSession.accessToken;
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const nextSession = await signIn({ email, password });
    applySession(nextSession);
    return nextSession.user;
  }, [applySession]);

  const register = useCallback(async ({ username, email, password }) => {
    const result = await signUp({ username, email, password });
    if (result.session) applySession(result.session);
    return { needsConfirmation: result.needsConfirmation || !result.session };
  }, [applySession]);

  const logout = useCallback(async () => {
    const currentSession = sessionRef.current;
    applySession(null);
    if (!currentSession) return;

    await signOut(currentSession.accessToken).catch(() => null);
  }, [applySession]);

  const user = session?.user ?? null;

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    getAccessToken,
  }), [user, login, register, logout, getAccessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
