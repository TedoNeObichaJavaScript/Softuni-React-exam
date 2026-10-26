import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import OfflineBanner from './OfflineBanner';
import ErrorBoundary from '../ui/ErrorBoundary';
import './Layout.css';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="layout">
      <a className="layout-skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <OfflineBanner />
      <main className="layout-main" id="main-content">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
