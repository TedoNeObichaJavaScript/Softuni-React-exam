import { useContext } from 'react';
import { NotificationContext } from '../contexts/notificationContext';

export function useNotify() {
  const notify = useContext(NotificationContext);
  if (!notify) throw new Error('useNotify has to be used inside NotificationProvider.');
  return notify;
}
