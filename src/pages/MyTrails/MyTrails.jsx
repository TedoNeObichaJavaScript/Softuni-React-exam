import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Compass, Heart, Mountain, Plus } from 'lucide-react';
import TrailGrid from '../../components/trails/TrailGrid';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import { getTrailsByOwner } from '../../api/trails';
import { getLikedTrails } from '../../api/likes';
import './MyTrails.css';

const TABS = [
  { id: 'added', label: 'Added by me', Icon: Mountain },
  { id: 'liked', label: 'Liked', Icon: Heart },
];

export default function MyTrails() {
  useDocumentTitle('My trails');
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'liked' ? 'liked' : 'added';

  const fetchTrails = useCallback(
    (signal) => (activeTab === 'liked'
      ? getLikedTrails(user.id, signal)
      : getTrailsByOwner(user.id, signal)),
    [activeTab, user.id],
  );
  const { data: trails, error, isLoading, reload } = useFetch(fetchTrails);

  function selectTab(tabId) {
    setSearchParams(tabId === 'added' ? {} : { tab: tabId }, { replace: true });
  }

  function handleTabKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    const nextTab = activeTab === 'added' ? 'liked' : 'added';
    selectTab(nextTab);
    document.getElementById(`my-trails-tab-${nextTab}`)?.focus();
  }

  function renderPanel() {
    if (isLoading) {
      return <Spinner label="Loading trails..." />;
    }
    if (error) {
      return <ErrorMessage title="Could not load your trails" message={error.message} onRetry={reload} />;
    }
    if (trails?.length) {
      return <TrailGrid trails={trails} />;
    }
    if (activeTab === 'liked') {
      return (
        <EmptyState
          icon={Heart}
          title="Trails you like will show up here."
          text="Hit the heart on any trail to keep it in this list."
          action={(
            <Link to="/trails" className="btn btn-outline">
              <Compass size={18} strokeWidth={2} aria-hidden="true" />
              Browse trails
            </Link>
          )}
        />
      );
    }
    return (
      <EmptyState
        icon={Mountain}
        title="You have not shared any trails yet."
        text="Add a route you know well so other hikers can find it."
        action={(
          <Link to="/trails/new" className="btn btn-accent">
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Add a trail
          </Link>
        )}
      />
    );
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-header my-trails-header">
          <div>
            <h1>My trails</h1>
            <p>Hi, {user.username}. Here are the routes you shared and the ones you liked.</p>
          </div>
        </header>

        <div className="my-trails-tabs" role="tablist" aria-label="My trails">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = id === activeTab;
            return (
              <button
                key={id}
                id={`my-trails-tab-${id}`}
                type="button"
                role="tab"
                className={isActive ? 'my-trails-tab is-active' : 'my-trails-tab'}
                aria-selected={isActive}
                aria-controls="my-trails-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(id)}
                onKeyDown={handleTabKeyDown}
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                {label}
                {isActive && trails && !isLoading && (
                  <span className="my-trails-tab-count">{trails.length}</span>
                )}
              </button>
            );
          })}
        </div>

        <div
          id="my-trails-panel"
          className="my-trails-panel"
          role="tabpanel"
          aria-labelledby={`my-trails-tab-${activeTab}`}
        >
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
