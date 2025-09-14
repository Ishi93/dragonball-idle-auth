Arranque rápido:

1) Servidor:
   cd server
   npm i
   cp .env.example .env
   npm run dev

2) Cliente:
   cd ../client
   npm i
   npm run dev

Rutas:
- POST /api/auth/register  { name, email, password }
- POST /api/auth/login     { email, password }
- GET  /api/auth/me        Authorization: Bearer <token>
