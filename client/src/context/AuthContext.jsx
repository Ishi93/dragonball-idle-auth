import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (token) {
          const { user } = await api('/api/auth/me', { token });
          setUser(user);
        }
      } catch (e) {
        console.error(e);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const login = async (email, password) => {
    const { user, token } = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    setUser(user); setToken(token); localStorage.setItem('token', token);
  };

  const register = async (name, email, password) => {
    const { user, token } = await api('/api/auth/register', { method: 'POST', body: { name, email, password } });
    setUser(user); setToken(token); localStorage.setItem('token', token);
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('token'); };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
