export default function TextField({ id, label, error, hint, ...inputProps }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const showHint = Boolean(hint) && !error;
  const describedBy = error ? errorId : showHint ? hintId : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={error ? 'input has-error' : 'input'}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {showHint && <p className="field-hint" id={hintId}>{hint}</p>}
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}
