import { Link } from 'react-router';
import { Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/format';
import './Comments.css';

export default function CommentItem({ comment, canDelete, onDelete }) {
  const username = comment.author?.username ?? 'Hiker';

  return (
    <li className="comment-item">
      <span className="comment-avatar" aria-hidden="true">
        {username.charAt(0).toUpperCase()}
      </span>

      <div className="comment-content">
        <div className="comment-meta">
          <Link to={`/users/${comment.owner_id}`} className="comment-author">{username}</Link>
          <time className="comment-date" dateTime={comment.created_at}>
            {formatDate(comment.created_at)}
          </time>
          {canDelete && (
            <button
              type="button"
              className="comment-delete"
              onClick={() => onDelete(comment)}
              aria-label="Delete your comment"
              title="Delete comment"
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="comment-body">{comment.body}</p>
      </div>
    </li>
  );
}
