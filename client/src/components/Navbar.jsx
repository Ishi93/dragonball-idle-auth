import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold">Auth Dashboard</Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">Hola, <b>{user.name}</b></span>
              <button onClick={logout} className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
