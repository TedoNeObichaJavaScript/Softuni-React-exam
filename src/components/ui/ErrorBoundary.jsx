import { Component } from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';
import './ui.css';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="container page">
        <div className="error-message error-boundary" role="alert">
          <span className="error-message-icon" aria-hidden="true">
            <CircleAlert size={20} strokeWidth={2} />
          </span>
          <h1 className="error-message-title">Something went wrong on this page</h1>
          <p className="error-message-text">Try reloading. If it keeps happening, go back to the home page.</p>
          <div className="error-boundary-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
              Reload page
            </button>
            <a href="/" className="btn btn-outline">Go home</a>
          </div>
        </div>
      </div>
    );
  }
}
