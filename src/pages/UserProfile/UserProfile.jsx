import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { CalendarDays, Mountain, UserX } from 'lucide-react';
import TrailGrid from '../../components/trails/TrailGrid';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFetch } from '../../hooks/useFetch';
import { getProfile } from '../../api/profiles';
import { getTrailsByOwner } from '../../api/trails';
import { formatDate } from '../../utils/format';
import './UserProfile.css';

function ProfileCard({ profile, trails, isMe }) {
  const likesReceived = trails.reduce((sum, trail) => sum + (trail.likes?.length ?? 0), 0);

  return (
    <section className="user-profile-card" aria-labelledby="user-profile-name">
      <span className="user-profile-avatar" aria-hidden="true">
        {profile.username.charAt(0).toUpperCase()}
      </span>

      <div className="user-profile-info">
        <div className="user-profile-name-row">
          <h1 id="user-profile-name" className="user-profile-name">{profile.username}</h1>
          {isMe && <span className="user-profile-pill">This is you</span>}
        </div>
        <p className="user-profile-since">
          <CalendarDays size={16} strokeWidth={2} aria-hidden="true" />
          Member since {formatDate(profile.created_at)}
        </p>
        {isMe && (
          <Link to="/my-trails" className="user-profile-link">Go to My trails</Link>
        )}
      </div>

      <dl className="user-profile-stats">
        <div className="user-profile-stat">
          <dt>Trails shared</dt>
          <dd>{trails.length}</dd>
        </div>
        <div className="user-profile-stat">
          <dt>Likes received</dt>
          <dd>{likesReceived}</dd>
        </div>
      </dl>
    </section>
  );
}

function ProfileTrails({ profile, trails, isMe }) {
  return (
    <section className="user-profile-trails" aria-labelledby="user-profile-trails-title">
      <h2 id="user-profile-trails-title">Trails by {profile.username}</h2>
      {trails.length > 0 ? (
        <TrailGrid trails={trails} />
      ) : (
        <EmptyState
          icon={Mountain}
          title={isMe ? 'You have not shared any trails yet.' : `${profile.username} has not shared any trails yet.`}
          text={isMe
            ? 'Add a route you know well so other hikers can find it.'
            : 'Check back later or browse what others have added.'}
          action={isMe ? (
            <Link to="/trails/new" className="btn btn-accent">Add a trail</Link>
          ) : (
            <Link to="/trails" className="btn btn-outline">Browse trails</Link>
          )}
        />
      )}
    </section>
  );
}

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();

  const fetchProfile = useCallback(
    (signal) => Promise.all([getProfile(userId, signal), getTrailsByOwner(userId, signal)])
      .then(([profile, trails]) => ({ profile, trails })),
    [userId],
  );
  const { data, error, isLoading, reload } = useFetch(fetchProfile);

  useDocumentTitle(data?.profile.username || 'Hiker');

  function renderContent() {
    if (isLoading) {
      return <Spinner label="Loading profile..." />;
    }
    if (error?.status === 404) {
      return (
        <EmptyState
          icon={UserX}
          title="Hiker not found"
          text={error.message}
          action={<Link to="/trails" className="btn btn-primary">Browse trails</Link>}
        />
      );
    }
    if (error || !data) {
      return <ErrorMessage title="Could not load this profile" message={error?.message} onRetry={reload} />;
    }

    const isMe = user?.id === data.profile.id;
    return (
      <>
        <ProfileCard profile={data.profile} trails={data.trails} isMe={isMe} />
        <ProfileTrails profile={data.profile} trails={data.trails} isMe={isMe} />
      </>
    );
  }

  return (
    <div className="page">
      <div className="container">{renderContent()}</div>
    </div>
  );
}
