import { useCallback, useRef, useState } from 'react';
import { NotificationContext } from './notificationContext';
import Toasts from '../components/ui/Toasts';

const MAX_TOASTS = 4;

export default function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);

  const notify = useCallback((message, type = 'success') => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setToasts((current) => [...current, { id, message, type }].slice(-MAX_TOASTS));
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}
