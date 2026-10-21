import { Link } from 'react-router';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          &copy; {CURRENT_YEAR} Trailbook, a course project built with React and Supabase.
        </p>
        <nav aria-label="Footer">
          <ul className="footer-links">
            <li>
              <Link to="/trails">Trails</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
