import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthErrors } from '../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear errors when entering page
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
    // Clear field-specific validation error on type
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
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = 'Username must be alphanumeric (letters and numbers only)';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(register(formData));
  };

  // Format backend API errors to show on the form
  const getBackendFieldError = (fieldName) => {
    if (!error || !Array.isArray(error)) return null;
    const found = error.find((err) => err.field === fieldName);
    return found ? found.message : null;
  };

  // Get generic form error not bound to specific fields
  const getGenericError = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) {
      const generic = error.find((err) => err.field === 'form' || !err.field);
      return generic ? generic.message : null;
    }
    return null;
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Subtle glow border line on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-brand-accent" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-dark-muted">
            Join DevConnect to showcase projects and net with developers
          </p>
        </div>

        {/* Global Error Banner */}
        {getGenericError() && (
          <div className="mb-6 rounded-md bg-brand-error/10 border border-brand-error/20 p-3 text-sm text-brand-error">
            {getGenericError()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alice Coder"
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                validationErrors.name || getBackendFieldError('name')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.name || getBackendFieldError('name')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.name || getBackendFieldError('name')}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. alicecoder"
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                validationErrors.username || getBackendFieldError('username')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.username || getBackendFieldError('username')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.username || getBackendFieldError('username')}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. alice@devconnect.com"
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                validationErrors.email || getBackendFieldError('email')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.email || getBackendFieldError('email')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.email || getBackendFieldError('email')}
              </p>
            )}
          </div>

          {/* Password */}
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
                validationErrors.password || getBackendFieldError('password')
                  ? 'border-brand-error/50 focus:border-brand-error focus:ring-1 focus:ring-brand-error/30'
                  : 'border-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30'
              }`}
            />
            {(validationErrors.password || getBackendFieldError('password')) && (
              <p className="mt-1 text-xs text-brand-error">
                {validationErrors.password || getBackendFieldError('password')}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium text-sm transition-all duration-200 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center shadow-lg shadow-brand-primary/20"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-brand-highlight hover:text-brand-highlight/90 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
