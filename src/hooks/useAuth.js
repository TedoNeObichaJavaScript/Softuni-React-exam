import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth has to be used inside AuthProvider.');
  return context;
}
