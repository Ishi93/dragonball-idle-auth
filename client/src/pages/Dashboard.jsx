import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="bg-white rounded-xl shadow p-4">
        <p>Bienvenido, <b>{user.name}</b></p>
        <p className="text-sm text-slate-600">Email: {user.email}</p>
        <p className="text-sm text-slate-600">Usuario desde: {new Date(user.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
