import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthErrors } from '../redux/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error when typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(login(formData));
  };

  // Get generic or credentials errors (e.g. form level errors)
  const getFormErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) {
      const found = error.find((err) => err.field === 'form' || !err.field);
      return found ? found.message : null;
    }
    return null;
  };

  const getFieldError = (fieldName) => {
    if (!error || !Array.isArray(error)) return null;
    const found = error.find((err) => err.field === fieldName);
    return found ? found.message : null;
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Glowing top line indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-brand-accent" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-dark-muted">
            Sign in to manage your portfolio and connections
          </p>
        </div>

        {/* Form Error Notification banner */}
        {getFormErrorMessage() && (
          <div className="mb-6 rounded-md bg-brand-error/10 border border-brand-error/25 p-3 text-sm text-brand-error">
            {getFormErrorMessage()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                validationErrors.email || getFieldError('email')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.email || getFieldError('email')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.email || getFieldError('email')}
              </p>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                validationErrors.password || getFieldError('password')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.password || getFieldError('password')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.password || getFieldError('password')}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium text-sm transition-all duration-200 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center shadow-lg shadow-brand-primary/20"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-muted">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-brand-highlight hover:text-brand-highlight/90 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
