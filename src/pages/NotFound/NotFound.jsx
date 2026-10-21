import { Link } from 'react-router';
import { Compass } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './NotFound.css';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <div className="container page not-found">
      <p className="not-found-code">
        <Compass size={20} strokeWidth={2} aria-hidden="true" />
        Error 404
      </p>
      <h1 className="not-found-title">This trail leads nowhere</h1>
      <p className="not-found-text">
        The page you were looking for does not exist or has been moved. Head back to the start or
        pick a trail from the list.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">Back to home</Link>
        <Link to="/trails" className="btn btn-outline">Browse trails</Link>
      </div>
    </div>
  );
}
