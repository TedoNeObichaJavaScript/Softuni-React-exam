import { startTransition, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { LogOut, Menu, MountainSnow, Plus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import './Header.css';

const MAIN_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/trails', label: 'Trails' },
  { to: '/about', label: 'About' },
];

const MOBILE_MENU_ID = 'header-mobile-menu';

function linkClassName({ isActive }) {
  return isActive ? 'header-link is-active' : 'header-link';
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    // Navigation runs as a transition. Clearing the session in the same one keeps
    // private pages from redirecting to /login before the user reaches home.
    startTransition(() => {
      navigate('/');
      logout();
    });
    notify('You have been logged out.', 'info');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') closeMenu();
  };

  const mainLinks = MAIN_LINKS.map((link) => (
    <li key={link.to}>
      <NavLink to={link.to} end={link.end} className={linkClassName} onClick={closeMenu}>
        {link.label}
      </NavLink>
    </li>
  ));

  return (
    <header className="header" onKeyDown={handleKeyDown}>
      <div className="container header-inner">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <span className="header-logo-mark" aria-hidden="true">
            <MountainSnow size={18} strokeWidth={2} />
          </span>
          Trailbook
        </Link>

        <nav className="header-nav" aria-label="Main">
          <ul className="header-links">{mainLinks}</ul>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <NavLink to="/my-trails" className={linkClassName}>
                My trails
              </NavLink>
              <Link to="/trails/new" className="btn btn-primary btn-small">
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                Add a trail
              </Link>
              <NavLink
                to={`/users/${user.id}`}
                className={({ isActive }) => (isActive ? 'header-user is-active' : 'header-user')}
                title="Your profile"
              >
                <span className="header-user-avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="header-user-name">{user.username}</span>
              </NavLink>
              <button type="button" className="btn btn-ghost btn-small header-logout" onClick={handleLogout}>
                <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                <span className="header-logout-label">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-small">
                Log in
              </Link>
              <Link to="/register" className="btn btn-accent btn-small">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="header-toggle"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      <div className="header-mobile" id={MOBILE_MENU_ID} hidden={!isMenuOpen}>
        <nav className="container" aria-label="Mobile">
          <ul className="header-mobile-links">
            {mainLinks}
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to="/my-trails" className={linkClassName} onClick={closeMenu}>
                    My trails
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/users/${user.id}`} className={linkClassName} onClick={closeMenu}>
                    Your profile ({user.username})
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="header-mobile-actions">
            {isAuthenticated ? (
              <>
                <Link to="/trails/new" className="btn btn-primary" onClick={closeMenu}>
                  <Plus size={16} strokeWidth={2} aria-hidden="true" />
                  Add a trail
                </Link>
                <button type="button" className="btn btn-outline" onClick={handleLogout}>
                  <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-accent" onClick={closeMenu}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
