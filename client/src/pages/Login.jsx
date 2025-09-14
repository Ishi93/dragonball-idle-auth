import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      nav('/');
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full border rounded p-2" placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="w-full bg-slate-900 text-white rounded py-2">Entrar</button>
      </form>
      <p className="text-sm mt-3">¿No tienes cuenta? <Link to="/register" className="underline">Regístrate</Link></p>
    </div>
  );
}
