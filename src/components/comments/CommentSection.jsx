import { useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import { LogIn, MessageCircle } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useNotify } from '../../hooks/useNotify';
import { deleteComment, getComments } from '../../api/comments';
import './Comments.css';

function byId(a, b) {
  return a.id - b.id;
}

export default function CommentSection({ trailId }) {
  const { user, getAccessToken } = useAuth();
  const notify = useNotify();
  const location = useLocation();

  const fetchComments = useCallback((signal) => getComments(trailId, signal), [trailId]);
  const { data: comments, error, isLoading, reload, setData } = useFetch(fetchComments);

  function handleCreated(comment) {
    setData((current) => [...(current ?? []), comment]);
  }

  async function handleDelete(comment) {
    if (!window.confirm('Delete this comment?')) {
      return;
    }

    setData((current) => current.filter((item) => item.id !== comment.id));
    try {
      const token = await getAccessToken();
      await deleteComment(comment.id, token);
      notify('Comment deleted.');
    } catch (deleteError) {
      setData((current) => [...current, comment].sort(byId));
      notify(deleteError.message, 'error');
    }
  }

  const count = comments?.length ?? 0;

  function renderList() {
    if (isLoading && !comments) {
      return <Spinner label="Loading comments..." />;
    }
    if (error) {
      return <ErrorMessage title="Could not load comments" message={error.message} onRetry={reload} />;
    }
    if (count === 0) {
      return <p className="comment-empty">No comments yet. Be the first to share how it went.</p>;
    }
    return (
      <ul className="comment-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canDelete={user?.id === comment.owner_id}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    );
  }

  return (
    <section className="comment-section" aria-labelledby="comment-section-title">
      <h2 id="comment-section-title" className="comment-section-title">
        <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
        Comments {comments && <span className="comment-section-count">({count})</span>}
      </h2>

      {renderList()}

      {user ? (
        <CommentForm trailId={trailId} onCreated={handleCreated} />
      ) : (
        <div className="comment-guest">
          <p>Log in to join the conversation.</p>
          <Link to="/login" state={{ from: location }} className="btn btn-outline btn-small">
            <LogIn size={16} strokeWidth={2} aria-hidden="true" />
            Log in
          </Link>
        </div>
      )}
    </section>
  );
}
