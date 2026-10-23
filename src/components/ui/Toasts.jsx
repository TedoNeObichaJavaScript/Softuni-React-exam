import { useEffect } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import './Toasts.css';

const TOAST_DURATION_MS = 4500;

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
};

function Toast({ toast, onDismiss }) {
  const { id, message, type } = toast;
  const Icon = ICONS[type] ?? Info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`toast toast-${type}`} role={type === 'error' ? 'alert' : undefined}>
      <Icon className="toast-icon" size={20} strokeWidth={2} aria-hidden="true" />
      <p className="toast-message">{message}</p>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(id)}
        aria-label="Close notification"
      >
        <X size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
