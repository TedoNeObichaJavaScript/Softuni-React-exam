import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import { likeTrail, unlikeTrail } from '../../api/likes';
import { pluralize } from '../../utils/format';
import './LikeButton.css';

export default function LikeButton({ trail }) {
  const { user, getAccessToken } = useAuth();
  const notify = useNotify();
  const location = useLocation();
  const [likes, setLikes] = useState(trail.likes ?? []);
  const [isPending, setIsPending] = useState(false);
  const [justLiked, setJustLiked] = useState(false);

  const count = likes.length;

  if (!user) {
    return (
      <Link to="/login" state={{ from: location }} className="like-button">
        <Heart size={18} strokeWidth={2} aria-hidden="true" />
        <span>Log in to like</span>
        <span className="like-button-count">{count}</span>
      </Link>
    );
  }

  if (user.id === trail.owner_id) {
    return (
      <span className="like-button is-static" title="You can't like your own trail">
        <Heart size={18} strokeWidth={2} aria-hidden="true" />
        <span>{pluralize(count, 'like', 'likes')}</span>
      </span>
    );
  }

  const isLiked = likes.some((like) => like.owner_id === user.id);

  async function handleToggle() {
    const previousLikes = likes;
    setIsPending(true);
    setJustLiked(!isLiked);
    setLikes(isLiked
      ? likes.filter((like) => like.owner_id !== user.id)
      : [...likes, { owner_id: user.id }]);

    try {
      const token = await getAccessToken();
      if (isLiked) {
        await unlikeTrail(trail.id, user.id, token);
      } else {
        await likeTrail(trail.id, token);
      }
    } catch (error) {
      setLikes(previousLikes);
      setJustLiked(false);
      notify(error.message, 'error');
    } finally {
      setIsPending(false);
    }
  }

  const className = ['like-button', isLiked && 'is-liked', justLiked && 'is-popping']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      aria-pressed={isLiked}
      disabled={isPending}
      onClick={handleToggle}
    >
      <Heart
        className="like-button-icon"
        size={18}
        strokeWidth={2}
        fill={isLiked ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      <span>Like</span>
      <span className="like-button-count">
        {count}
        <span className="sr-only">{count === 1 ? ' like' : ' likes'}</span>
      </span>
    </button>
  );
}
