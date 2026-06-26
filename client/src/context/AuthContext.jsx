import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ekagra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ekagra_token'));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('ekagra_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ekagra_token');
        localStorage.removeItem('ekagra_user');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem('ekagra_token', nextToken);
    localStorage.setItem('ekagra_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post('/auth/login', { email, password });
      persistSession(res.data.token, res.data.user);
      return res.data.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await api.post('/auth/register', { name, email, password });
      persistSession(res.data.token, res.data.user);
      return res.data.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('ekagra_token');
    localStorage.removeItem('ekagra_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
