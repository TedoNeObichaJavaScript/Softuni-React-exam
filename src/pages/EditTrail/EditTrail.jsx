import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Lock, SearchX } from 'lucide-react';
import TrailForm from '../../components/trails/TrailForm';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import { useNotify } from '../../hooks/useNotify';
import { getTrail, updateTrail } from '../../api/trails';
import { toTrailFormValues, toTrailPayload } from '../../utils/trailForm';
import './EditTrail.css';

export default function EditTrail() {
  const { trailId } = useParams();
  const { user, getAccessToken } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  const fetchTrail = useCallback((signal) => getTrail(trailId, signal), [trailId]);
  const { data: trail, error, isLoading, reload } = useFetch(fetchTrail);

  useDocumentTitle(trail ? `Edit ${trail.title}` : 'Edit trail');

  async function handleSubmit(values) {
    const token = await getAccessToken();
    await updateTrail(trail.id, toTrailPayload(values), token);
    notify('Changes saved.');
    navigate(`/trails/${trail.id}`);
  }

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
    if (trail.owner_id !== user.id) {
      return (
        <EmptyState
          icon={Lock}
          title="Only the hiker who added this trail can edit it."
          text="You can still read it, like it and leave a comment."
          action={<Link to={`/trails/${trail.id}`} className="btn btn-outline">Back to the trail</Link>}
        />
      );
    }

    return (
      <>
        <header className="page-header">
          <h1>Edit trail</h1>
          <p>Update the details other hikers see for {trail.title}.</p>
        </header>
        <TrailForm
          key={trail.id}
          initialValues={toTrailFormValues(trail)}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/trails/${trail.id}`)}
        />
      </>
    );
  }

  return (
    <div className="page">
      <div className="container edit-trail">{renderContent()}</div>
    </div>
  );
}
