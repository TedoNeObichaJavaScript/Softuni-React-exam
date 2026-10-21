import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { CircleAlert, Info, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { validateLogin } from '../../utils/validators';
import TextField from '../../components/ui/TextField';
import '../auth.css';

const INITIAL_VALUES = { email: '', password: '' };
const ALL_TOUCHED = { email: true, password: true };

function onlyTouched(errors, touched) {
  return Object.fromEntries(Object.entries(errors).filter(([field]) => touched[field]));
}

export default function Login() {
  useDocumentTitle('Log in');
  const { login } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = onlyTouched(validateLogin(values), touched);
  const infoMessage = location.state?.message;

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

    const firstInvalidField = Object.keys(validateLogin(values))[0];
    if (firstInvalidField) {
      event.currentTarget.elements[firstInvalidField].focus();
      return;
    }

    setServerError('');
    setIsSubmitting(true);

    try {
      const user = await login(values.email.trim(), values.password);
      notify(`Welcome back, ${user.username}.`);
      navigate(location.state?.from ?? '/trails', { replace: true });
    } catch (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <span className="auth-icon" aria-hidden="true">
          <LogIn size={20} strokeWidth={2} />
        </span>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to add trails, like the ones you enjoy and leave comments.</p>

        {infoMessage && (
          <div className="alert alert-info auth-alert" role="status">
            <Info size={20} strokeWidth={2} aria-hidden="true" />
            <p>{infoMessage}</p>
          </div>
        )}

        {serverError && (
          <div className="alert alert-error auth-alert" role="alert">
            <CircleAlert size={20} strokeWidth={2} aria-hidden="true" />
            <p>{serverError}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-email"
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
            id="login-password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Trailbook? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
