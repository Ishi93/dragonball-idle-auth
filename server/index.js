import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from './db.js';
import { authRequired } from './auth.js';

const app = express();
app.use(express.json());

// 🔧 CORS fijo para el cliente de desarrollo
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Helpers
const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });

// Validaciones
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// SQL prepared statements
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const insertUser = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
const findUserById = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?');

// Rutas
app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/register', (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { name, email, password } = parse.data;
  const exists = findUserByEmail.get(email);
  if (exists) return res.status(409).json({ error: 'Email ya registrado' });

  const hash = bcrypt.hashSync(password, 10);
  const info = insertUser.run(email, hash, name);
  const user = { id: info.lastInsertRowid, email, name };
  const token = signToken(user);

  return res.status(201).json({ user, token });
});

app.post('/api/auth/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, password } = parse.data;
  const user = findUserByEmail.get(email);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = signToken(user);
  return res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

app.get('/api/auth/me', authRequired, (req, res) => {
  const user = findUserById.get(req.user.id);
  return res.json({ user });
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Auth server on http://localhost:' + (process.env.PORT || 4000));
});
