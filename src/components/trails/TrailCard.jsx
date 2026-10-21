import { Link } from 'react-router';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import TrailImage from './TrailImage';
import TrailStats from './TrailStats';
import { pluralize } from '../../utils/format';
import './TrailCard.css';

export default function TrailCard({ trail }) {
  const likeCount = trail.likes?.length ?? 0;
  const commentCount = trail.comments?.length ?? 0;

  return (
    <Link to={`/trails/${trail.id}`} className="trail-card">
      <div className="trail-card-media">
        <TrailImage trail={trail} className="trail-card-image" />
        <span className="trail-card-badge">
          <DifficultyBadge difficulty={trail.difficulty} />
        </span>
      </div>

      <div className="trail-card-body">
        <h3 className="trail-card-title">{trail.title}</h3>
        <p className="trail-card-region">
          <MapPin size={16} strokeWidth={2} aria-hidden="true" />
          <span>{trail.region}</span>
        </p>

        <TrailStats trail={trail} />

        <div className="trail-card-footer">
          <span className="trail-card-author">by {trail.author?.username ?? 'a hiker'}</span>
          <span className="trail-card-counts">
            <span className="trail-card-count" title={pluralize(likeCount, 'like', 'likes')}>
              <Heart size={16} strokeWidth={2} aria-hidden="true" />
              {likeCount}
              <span className="sr-only">{likeCount === 1 ? ' like' : ' likes'}</span>
            </span>
            <span className="trail-card-count" title={pluralize(commentCount, 'comment', 'comments')}>
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              {commentCount}
              <span className="sr-only">{commentCount === 1 ? ' comment' : ' comments'}</span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
