import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      nav('/');
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full border rounded p-2" placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="w-full bg-slate-900 text-white rounded py-2">Registrarme</button>
      </form>
      <p className="text-sm mt-3">¿Ya tienes cuenta? <Link to="/login" className="underline">Inicia sesión</Link></p>
    </div>
  );
}
