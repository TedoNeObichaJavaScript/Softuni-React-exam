import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import TrailImage from './TrailImage';
import { DESCRIPTION_MAX_LENGTH, DIFFICULTIES, REGIONS } from '../../utils/constants';
import { isValidImageUrl, validateTrail } from '../../utils/validators';
import './TrailForm.css';

const FIELD_ORDER = [
  'title',
  'region',
  'difficulty',
  'distanceKm',
  'elevationGain',
  'durationHours',
  'description',
  'imageUrl',
];

const DIFFICULTY_HINTS = {
  easy: 'Gentle and well marked',
  moderate: 'Some steady climbing',
  hard: 'Steep, long or exposed',
};

function FieldError({ name, message }) {
  if (!message) {
    return null;
  }
  return <p id={`trail-${name}-error`} className="field-error">{message}</p>;
}

export default function TrailForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const errors = validateTrail(values);
  const imageUrl = values.imageUrl.trim();
  const previewUrl = imageUrl && !errors.imageUrl && isValidImageUrl(imageUrl) ? imageUrl : '';

  function getError(name) {
    return touched[name] || isSubmitAttempted ? errors[name] : '';
  }

  function getFieldProps(name, hintId) {
    const error = getError(name);
    const describedBy = [error && `trail-${name}-error`, hintId].filter(Boolean).join(' ');

    return {
      id: `trail-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      className: error ? 'input has-error' : 'input',
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy || undefined,
    };
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
      document.getElementById(`trail-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const difficultyError = getError('difficulty');
  const descriptionLength = values.description.trim().length;

  return (
    <form className="trail-form" noValidate onSubmit={handleSubmit}>
      <section className="trail-form-section">
        <h2 className="trail-form-section-title">Basics</h2>

        <div className="form-field">
          <label htmlFor="trail-title">Trail name</label>
          <input
            {...getFieldProps('title')}
            type="text"
            maxLength={80}
            placeholder="e.g. Seven Rila Lakes loop"
          />
          <FieldError name="title" message={getError('title')} />
        </div>

        <div className="form-field">
          <label htmlFor="trail-region">Region</label>
          <input
            {...getFieldProps('region')}
            type="text"
            list="trail-region-options"
            maxLength={60}
            autoComplete="off"
            placeholder="Start typing, e.g. Pirin"
          />
          <datalist id="trail-region-options">
            {REGIONS.map((region) => (
              <option key={region} value={region} />
            ))}
          </datalist>
          <FieldError name="region" message={getError('region')} />
        </div>

        <fieldset
          className="trail-form-fieldset"
          aria-describedby={difficultyError ? 'trail-difficulty-error' : undefined}
        >
          <legend className="trail-form-legend">Difficulty</legend>
          <div className="trail-form-segments">
            {DIFFICULTIES.map((option) => (
              <label key={option.value} className={`trail-form-segment trail-form-segment-${option.value}`}>
                <input
                  id={option.value === DIFFICULTIES[0].value ? 'trail-difficulty' : undefined}
                  className="trail-form-segment-input"
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={values.difficulty === option.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="trail-form-segment-box">
                  <span className="trail-form-segment-label">{option.label}</span>
                  <span className="trail-form-segment-hint">{DIFFICULTY_HINTS[option.value]}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError name="difficulty" message={difficultyError} />
        </fieldset>
      </section>

      <section className="trail-form-section">
        <h2 className="trail-form-section-title">Distance and time</h2>

        <div className="trail-form-row">
          <div className="form-field">
            <label htmlFor="trail-distanceKm">Distance (km)</label>
            <input
              {...getFieldProps('distanceKm')}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              placeholder="12.5"
            />
            <FieldError name="distanceKm" message={getError('distanceKm')} />
          </div>

          <div className="form-field">
            <label htmlFor="trail-elevationGain">Elevation gain (m)</label>
            <input
              {...getFieldProps('elevationGain')}
              type="number"
              inputMode="numeric"
              min="0"
              step="10"
              placeholder="850"
            />
            <FieldError name="elevationGain" message={getError('elevationGain')} />
          </div>

          <div className="form-field">
            <label htmlFor="trail-durationHours">Duration (hours)</label>
            <input
              {...getFieldProps('durationHours')}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              placeholder="5"
            />
            <FieldError name="durationHours" message={getError('durationHours')} />
          </div>
        </div>
      </section>

      <section className="trail-form-section">
        <h2 className="trail-form-section-title">Details</h2>

        <div className="form-field">
          <label htmlFor="trail-description">Description</label>
          <textarea
            {...getFieldProps('description', 'trail-description-count')}
            rows={7}
            placeholder="Where does it start, what is the path like, is there water on the way and what makes the view worth it?"
          />
          <div className="trail-form-field-footer">
            <FieldError name="description" message={getError('description')} />
            <p
              id="trail-description-count"
              className={descriptionLength > DESCRIPTION_MAX_LENGTH ? 'trail-form-counter is-over' : 'trail-form-counter'}
            >
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </p>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="trail-imageUrl">Image URL</label>
          <input
            {...getFieldProps('imageUrl', 'trail-imageUrl-hint')}
            type="url"
            inputMode="url"
            maxLength={500}
            placeholder="https://"
          />
          <p id="trail-imageUrl-hint" className="field-hint">
            Optional. Leave empty and we will draw one for you.
          </p>
          <FieldError name="imageUrl" message={getError('imageUrl')} />

          {previewUrl && (
            <div className="trail-form-preview">
              <TrailImage
                trail={{ id: 'preview', title: values.title || 'Trail photo preview', image_url: previewUrl }}
                className="trail-form-preview-image"
              />
            </div>
          )}
        </div>
      </section>

      {submitError && (
        <div className="alert alert-error" role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="trail-form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
