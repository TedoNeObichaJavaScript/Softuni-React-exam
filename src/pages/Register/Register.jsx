import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CircleAlert, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { isUsernameTaken } from '../../api/profiles';
import { validateRegister } from '../../utils/validators';
import TextField from '../../components/ui/TextField';
import '../auth.css';

const INITIAL_VALUES = { username: '', email: '', password: '', repeatPassword: '' };
const ALL_TOUCHED = { username: true, email: true, password: true, repeatPassword: true };
const USERNAME_TAKEN = 'That username is already taken.';
const CONFIRM_EMAIL_MESSAGE = 'Your account was created. Check your email to confirm it, then log in.';

function onlyTouched(errors, touched) {
  return Object.fromEntries(Object.entries(errors).filter(([field]) => touched[field]));
}

export default function Register() {
  useDocumentTitle('Sign up');
  const { register } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [takenUsername, setTakenUsername] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = onlyTouched(validateRegister(values), touched);
  const isTakenUsername = Boolean(takenUsername)
    && values.username.trim().toLowerCase() === takenUsername;
  const usernameError = errors.username || (isTakenUsername ? USERNAME_TAKEN : '');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(ALL_TOUCHED);

    const form = event.currentTarget;
    const firstInvalidField = Object.keys(validateRegister(values))[0];
    if (firstInvalidField) {
      form.elements[firstInvalidField].focus();
      return;
    }

    const username = values.username.trim();
    setServerError('');
    setIsSubmitting(true);

    try {
      if (await isUsernameTaken(username)) {
        setTakenUsername(username.toLowerCase());
        setIsSubmitting(false);
        form.elements.username.focus();
        return;
      }

      const { needsConfirmation } = await register({
        username,
        email: values.email.trim(),
        password: values.password,
      });

      if (needsConfirmation) {
        navigate('/login', { replace: true, state: { message: CONFIRM_EMAIL_MESSAGE } });
        return;
      }

      notify(`Welcome to Trailbook, ${username}.`);
      navigate('/trails', { replace: true });
    } catch (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <span className="auth-icon" aria-hidden="true">
          <UserPlus size={20} strokeWidth={2} />
        </span>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">It takes a minute. Then you can share trails and comment on others.</p>

        {serverError && (
          <div className="alert alert-error auth-alert" role="alert">
            <CircleAlert size={20} strokeWidth={2} aria-hidden="true" />
            <p>{serverError}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="register-username"
            name="username"
            label="Username"
            autoComplete="username"
            hint="3 to 20 characters: letters, numbers and underscores."
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={usernameError}
          />
          <TextField
            id="register-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <TextField
            id="register-password"
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            hint="At least 8 characters, with at least one letter and one number."
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <TextField
            id="register-repeat-password"
            name="repeatPassword"
            type="password"
            label="Repeat password"
            autoComplete="new-password"
            value={values.repeatPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.repeatPassword}
          />
          <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
