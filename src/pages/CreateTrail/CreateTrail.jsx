import { useNavigate } from 'react-router';
import TrailForm from '../../components/trails/TrailForm';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useNotify } from '../../hooks/useNotify';
import { createTrail } from '../../api/trails';
import { EMPTY_TRAIL_VALUES, toTrailPayload } from '../../utils/trailForm';
import './CreateTrail.css';

export default function CreateTrail() {
  useDocumentTitle('Add a trail');
  const { getAccessToken } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const token = await getAccessToken();
    const trail = await createTrail(toTrailPayload(values), token);
    notify('Your trail is live.');
    navigate(`/trails/${trail.id}`);
  }

  function handleCancel() {
    // idx is the router's history position. At 0 (bookmark, login redirect) going back leaves the site.
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/trails');
    }
  }

  return (
    <div className="page">
      <div className="container create-trail">
        <header className="page-header">
          <h1>Add a trail</h1>
          <p>
            Share a route you know well. Honest numbers and a clear description help
            other hikers plan their day.
          </p>
        </header>

        <TrailForm
          initialValues={EMPTY_TRAIL_VALUES}
          submitLabel="Publish trail"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
