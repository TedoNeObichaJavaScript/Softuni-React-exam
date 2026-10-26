import { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createComment } from '../../api/comments';
import { COMMENT_MAX_LENGTH } from '../../utils/constants';
import { validateComment } from '../../utils/validators';
import './Comments.css';

export default function CommentForm({ trailId, onCreated }) {
  const { user, getAccessToken } = useAuth();
  const [body, setBody] = useState('');
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validationError = validateComment(body);
  const bodyLength = body.trim().length;
  const isOverLimit = bodyLength > COMMENT_MAX_LENGTH;
  const error = isSubmitAttempted || isOverLimit ? validationError : '';
  const shownError = error || serverError;

  function handleChange(event) {
    setBody(event.target.value);
    setServerError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitAttempted(true);
    if (validationError) {
      return;
    }

    setIsPosting(true);
    setServerError('');
    try {
      const token = await getAccessToken();
      const comment = await createComment(trailId, body.trim(), token);
      onCreated({ ...comment, author: comment.author ?? { id: user.id, username: user.username } });
      setBody('');
      setIsSubmitAttempted(false);
    } catch (submitError) {
      setServerError(submitError.message);
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form className="comment-form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="comment-body" className="comment-form-label">
        Add a comment
      </label>
      <textarea
        id="comment-body"
        name="body"
        className={shownError ? 'input comment-form-input has-error' : 'input comment-form-input'}
        rows={3}
        placeholder="How was the trail? Share conditions, tips or a favourite spot."
        value={body}
        onChange={handleChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={shownError ? 'comment-body-error comment-body-count' : 'comment-body-count'}
      />
      <div className="comment-form-footer">
        <div className="comment-form-status">
          {shownError && (
            <p id="comment-body-error" className="field-error" role="alert">{shownError}</p>
          )}
          <p id="comment-body-count" className={isOverLimit ? 'comment-form-count is-over' : 'comment-form-count'}>
            {bodyLength}/{COMMENT_MAX_LENGTH}
          </p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPosting}>
          <Send size={16} strokeWidth={2} aria-hidden="true" />
          {isPosting ? 'Posting...' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
