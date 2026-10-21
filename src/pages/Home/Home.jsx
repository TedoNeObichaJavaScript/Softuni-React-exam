import { useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Footprints, Heart, MapPin, Plus, Route, Search } from 'lucide-react';
import { getLatestTrails } from '../../api/trails';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import TrailGrid from '../../components/trails/TrailGrid';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import HeroArt from './HeroArt';
import './Home.css';

const LATEST_TRAILS_COUNT = 3;

const STEPS = [
  {
    icon: Search,
    title: 'Browse',
    text: 'Search by name or region, filter by difficulty and sort by distance.',
  },
  {
    icon: Heart,
    title: 'Save the ones you like',
    text: 'Like a trail and it waits for you in My trails when the weekend comes.',
  },
  {
    icon: Route,
    title: 'Share your own',
    text: 'Add a route you know well, with distance, climb and a few honest tips.',
  },
];

function LatestTrails() {
  const fetchLatest = useCallback((signal) => getLatestTrails(LATEST_TRAILS_COUNT, signal), []);
  const { data: trails, error, isLoading, reload } = useFetch(fetchLatest);

  if (isLoading) return <Spinner label="Loading trails..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;

  if (!trails?.length) {
    return (
      <EmptyState
        icon={MapPin}
        title="No trails yet"
        text="Nobody has shared a trail so far. Yours could be the first one."
        action={
          <Link to="/trails/new" className="btn btn-primary">
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            Add a trail
          </Link>
        }
      />
    );
  }

  return <TrailGrid trails={trails} />;
}

export default function Home() {
  useDocumentTitle('Find your next hike');
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="container home-hero">
        <div className="home-hero-text">
          <p className="home-eyebrow">
            <Footprints size={16} strokeWidth={2} aria-hidden="true" />
            Hiking trails shared by hikers
          </p>
          <h1 className="home-title">Find your next trail and share the ones you love</h1>
          <p className="home-lead">
            Routes across Rila, Pirin, Vitosha and the Rhodopes, with distance, climb and tips
            from the people who walked them.
          </p>
          <div className="home-hero-actions">
            <Link to="/trails" className="btn btn-primary home-hero-button">
              Browse trails
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            {isAuthenticated ? (
              <Link to="/trails/new" className="btn btn-outline home-hero-button">
                Share a trail
              </Link>
            ) : (
              <Link to="/register" className="btn btn-outline home-hero-button">
                Join Trailbook
              </Link>
            )}
          </div>
        </div>
        <div className="home-hero-art">
          <HeroArt className="home-hero-svg" />
        </div>
      </section>

      <section className="container home-section" aria-labelledby="home-latest-title">
        <div className="section-heading">
          <h2 id="home-latest-title">Recently added</h2>
          <Link to="/trails" className="section-heading-link">
            See all trails
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
        <LatestTrails />
      </section>

      <section className="container home-section" aria-labelledby="home-steps-title">
        <div className="home-steps">
          <h2 className="home-steps-title" id="home-steps-title">How it works</h2>
          <ol className="home-steps-list">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="home-step">
                <span className="home-step-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="home-step-title">{title}</h3>
                  <p className="home-step-text">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
