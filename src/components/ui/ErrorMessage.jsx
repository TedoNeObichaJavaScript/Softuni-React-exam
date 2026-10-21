import { CircleAlert, RefreshCw } from 'lucide-react';
import './ui.css';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message-icon" aria-hidden="true">
        <CircleAlert size={20} strokeWidth={2} />
      </span>
      <p className="error-message-title">{title}</p>
      {message && <p className="error-message-text">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn-outline btn-small" onClick={onRetry}>
          <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
