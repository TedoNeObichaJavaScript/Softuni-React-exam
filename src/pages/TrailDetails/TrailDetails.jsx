import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Pencil, SearchX, Trash2 } from 'lucide-react';
import DifficultyBadge from '../../components/trails/DifficultyBadge';
import LikeButton from '../../components/trails/LikeButton';
import TrailImage from '../../components/trails/TrailImage';
import TrailStats from '../../components/trails/TrailStats';
import CommentSection from '../../components/comments/CommentSection';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import { useNotify } from '../../hooks/useNotify';
import { deleteTrail, getTrail } from '../../api/trails';
import { formatDate } from '../../utils/format';
import './TrailDetails.css';

function OwnerActions({ trailId }) {
  const { getAccessToken } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const token = await getAccessToken();
      await deleteTrail(trailId, token);
      notify('Trail deleted.');
      navigate('/my-trails', { replace: true });
    } catch (error) {
      notify(error.message, 'error');
      setIsDeleting(false);
    }
  }

  if (!isConfirming) {
    return (
      <div className="trail-details-owner-actions">
        <Link to={`/trails/${trailId}/edit`} className="btn btn-outline">
          <Pencil size={16} strokeWidth={2} aria-hidden="true" />
          Edit
        </Link>
        <button type="button" className="btn btn-danger" onClick={() => setIsConfirming(true)}>
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="trail-details-confirm" role="group" aria-labelledby="trail-delete-question">
      <p id="trail-delete-question">Delete this trail? This also removes its comments.</p>
      <div className="trail-details-confirm-buttons">
        <button type="button" className="btn btn-danger btn-small" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          autoFocus
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TrailView({ trail, isOwner }) {
  return (
    <>
      <Link to="/trails" className="trail-details-back">
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        All trails
      </Link>

      <div className="trail-details-hero">
        <TrailImage trail={trail} />
      </div>

      <article className="trail-details-content">
        <header className="trail-details-header">
          <DifficultyBadge difficulty={trail.difficulty} />
          <h1 className="trail-details-title">{trail.title}</h1>
          <p className="trail-details-region">
            <MapPin size={18} strokeWidth={2} aria-hidden="true" />
            {trail.region}
          </p>
          <p className="trail-details-meta">
            Added by{' '}
            <Link to={`/users/${trail.owner_id}`}>{trail.author?.username ?? 'a hiker'}</Link>
            {' '}on{' '}
            <time dateTime={trail.created_at}>{formatDate(trail.created_at)}</time>
          </p>
        </header>

        <div className="trail-details-actions">
          <LikeButton key={trail.id} trail={trail} />
          {isOwner && <OwnerActions trailId={trail.id} />}
        </div>

        <section className="trail-details-stats" aria-label="Trail numbers">
          <TrailStats trail={trail} size="large" />
        </section>

        <section className="trail-details-description">
          <h2>About this trail</h2>
          <p>{trail.description}</p>
        </section>

        <CommentSection trailId={trail.id} />
      </article>
    </>
  );
}

export default function TrailDetails() {
  const { trailId } = useParams();
  const { user } = useAuth();

  const fetchTrail = useCallback((signal) => getTrail(trailId, signal), [trailId]);
  const { data: trail, error, isLoading, reload } = useFetch(fetchTrail);

  useDocumentTitle(trail?.title || 'Trail');

  function renderContent() {
    if (isLoading) {
      return <Spinner label="Loading trail..." />;
    }
    if (error?.status === 404) {
      return (
        <EmptyState
          icon={SearchX}
          title="Trail not found"
          text={error.message}
          action={<Link to="/trails" className="btn btn-primary">Back to all trails</Link>}
        />
      );
    }
    if (error || !trail) {
      return <ErrorMessage title="Could not load this trail" message={error?.message} onRetry={reload} />;
    }
    return <TrailView trail={trail} isOwner={user?.id === trail.owner_id} />;
  }

  return (
    <div className="page trail-details">
      <div className="container">{renderContent()}</div>
    </div>
  );
}
