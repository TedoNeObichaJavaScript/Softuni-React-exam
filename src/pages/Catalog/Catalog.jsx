import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Mountain, Plus, RotateCcw, SearchX } from 'lucide-react';
import TrailFilters from '../../components/trails/TrailFilters';
import TrailGrid from '../../components/trails/TrailGrid';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import { getTrails } from '../../api/trails';
import { DIFFICULTIES, SORT_OPTIONS } from '../../utils/constants';
import { pluralize } from '../../utils/format';
import './Catalog.css';

const DEFAULT_SORT = 'newest';

function withParams(current, changes) {
  const next = new URLSearchParams(current);
  Object.entries(changes).forEach(([key, value]) => {
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
  });
  return next;
}

function pickOption(value, options, fallback) {
  return options.some((option) => option.value === value) ? value : fallback;
}

export default function Catalog() {
  useDocumentTitle('All trails');
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const difficulty = pickOption(searchParams.get('difficulty'), DIFFICULTIES, '');
  const sort = pickOption(searchParams.get('sort'), SORT_OPTIONS, DEFAULT_SORT);

  const [searchText, setSearchText] = useState(q);
  const [syncedQuery, setSyncedQuery] = useState(q);
  const debouncedSearch = useDebounce(searchText, 400);
  const lastDebounced = useRef(debouncedSearch);

  // q can also change from outside (back button, a link with ?q=), so the input follows it
  if (syncedQuery !== q) {
    setSyncedQuery(q);
    if (q !== debouncedSearch.trim()) {
      setSearchText(q);
    }
  }

  useEffect(() => {
    if (lastDebounced.current === debouncedSearch) {
      return;
    }
    lastDebounced.current = debouncedSearch;

    const nextQuery = debouncedSearch.trim();
    if (nextQuery !== q) {
      setSearchParams((current) => withParams(current, { q: nextQuery }), { replace: true });
    }
  }, [debouncedSearch, q, setSearchParams]);

  const fetchTrails = useCallback(
    (signal) => getTrails({ search: q, difficulty, sort }, signal),
    [q, difficulty, sort],
  );
  const { data, error, isLoading, reload } = useFetch(fetchTrails);

  const trails = data ?? [];
  const hasFilters = q !== '' || difficulty !== '';

  function handleDifficultyChange(value) {
    setSearchParams((current) => withParams(current, { difficulty: value }), { replace: true });
  }

  function handleSortChange(value) {
    const sortParam = value === DEFAULT_SORT ? '' : value;
    setSearchParams((current) => withParams(current, { sort: sortParam }), { replace: true });
  }

  function handleReset() {
    setSearchText('');
    setSearchParams({}, { replace: true });
  }

  function getSubtitle() {
    if (isLoading) {
      return 'Loading trails...';
    }
    if (!data) {
      return 'Routes shared by hikers across the Bulgarian mountains.';
    }
    const count = pluralize(trails.length, 'trail', 'trails');
    return hasFilters ? `${count} found` : `${count} shared by hikers`;
  }

  function renderResults() {
    if (isLoading && trails.length === 0) {
      return <Spinner label="Loading trails..." />;
    }
    if (error) {
      return <ErrorMessage title="Could not load trails" message={error.message} onRetry={reload} />;
    }
    if (trails.length === 0 && hasFilters) {
      return (
        <EmptyState
          icon={SearchX}
          title="No trails match your filters"
          text="Try another name or region, or clear the filters to see every trail."
          action={(
            <button type="button" className="btn btn-outline" onClick={handleReset}>
              <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
              Reset filters
            </button>
          )}
        />
      );
    }
    if (trails.length === 0) {
      return (
        <EmptyState
          icon={Mountain}
          title="No trails yet"
          text="Nobody has shared a route so far. Know a good one?"
          action={isAuthenticated ? (
            <Link to="/trails/new" className="btn btn-accent">
              <Plus size={18} strokeWidth={2} aria-hidden="true" />
              Add a trail
            </Link>
          ) : (
            <Link to="/login" state={{ from: location }} className="btn btn-primary">
              Log in to add one
            </Link>
          )}
        />
      );
    }
    return (
      <div className={isLoading ? 'catalog-results is-refreshing' : 'catalog-results'} aria-busy={isLoading}>
        <TrailGrid trails={trails} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-header catalog-header">
          <div>
            <h1>All trails</h1>
            <p aria-live="polite">{getSubtitle()}</p>
          </div>
          {isAuthenticated && (
            <Link to="/trails/new" className="btn btn-accent">
              <Plus size={18} strokeWidth={2} aria-hidden="true" />
              Add a trail
            </Link>
          )}
        </header>

        <TrailFilters
          search={searchText}
          difficulty={difficulty}
          sort={sort}
          onSearchChange={setSearchText}
          onDifficultyChange={handleDifficultyChange}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />

        {renderResults()}
      </div>
    </div>
  );
}
