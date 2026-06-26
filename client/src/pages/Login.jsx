import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark p-6 relative">
      {/* Subtle ruled lines across the page */}
      <div className="absolute inset-0 ruled-bg opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" className="text-ink dark:text-chalk" />
              <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="2" className="text-ink dark:text-chalk" />
              <circle cx="20" cy="20" r="4" fill="currentColor" className="text-accent" />
            </svg>
          </div>
          <h1 className="text-5xl font-heading font-bold text-ink dark:text-chalk tracking-tight">Ekagra</h1>
          <p className="text-sm font-body text-ink-light dark:text-chalk-dim mt-1 tracking-wide">single-pointed focus</p>
        </div>

        {/* Login Card */}
        <div className="sketch-card ink-shadow p-8 md:p-10">
          <h2 className="text-3xl font-heading font-bold text-ink dark:text-chalk mb-2">Welcome back</h2>
          <div className="sketch-divider mb-6"></div>

          {error && (
            <div className="mb-5 px-4 py-3 border-2 border-accent bg-accent/5 text-accent text-sm font-body rounded-sketch">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-widest">Email</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sketch-input w-full text-lg"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-widest">Password</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sketch-input w-full text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="sketch-btn w-full text-xl py-3"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-light dark:text-chalk-dim mt-8 font-body">
            New here?{' '}
            <Link to="/register" className="text-accent font-bold sketch-underline hover:opacity-80 transition-opacity">
              Create an account
            </Link>
          </p>
        </div>

        {/* Annotation */}
        <div className="text-center mt-6">
          <span className="annotation">your ideas, your sanctuary</span>
        </div>
      </div>
    </div>
  );
}
