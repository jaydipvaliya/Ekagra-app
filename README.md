# Ekagra — Full-Stack Rewrite

A focus & productivity app (Pomodoro timer, todo list, Eisenhower matrix, habit
tracker, calendar, goal countdown, ambience sounds, motivation board) rebuilt
from scratch as a full-stack application:

- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT authentication
- **Frontend:** React + Vite + Tailwind CSS, talking to the backend over a REST API

Every user has their own account. Tasks, habits, settings, goals, and
preferences are stored per-user in MongoDB instead of the browser's
`localStorage`.

## Project structure

```
ekagra/
  server/   Express + MongoDB + JWT API
  client/   React + Vite frontend
```

## 1. Backend setup

```bash
cd server
cp .env.example .env   # edit MONGODB_URI / JWT_SECRET as needed
npm install
npm run dev             # starts on http://localhost:4000
```

Required environment variables (`server/.env`):

| Variable          | Description                                  |
|-------------------|-----------------------------------------------|
| `PORT`            | Port the API listens on (default 4000)       |
| `MONGODB_URI`     | MongoDB connection string                    |
| `JWT_SECRET`      | Long random secret used to sign JWTs          |
| `JWT_EXPIRES_IN`  | Token lifetime, e.g. `7d`                     |
| `CLIENT_ORIGIN`   | Frontend origin allowed by CORS               |

You need a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/ekagra`)
or a free cluster on MongoDB Atlas.

### API overview

| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| POST   | `/api/auth/register`    | Create an account, returns JWT        |
| POST   | `/api/auth/login`       | Log in, returns JWT                   |
| GET    | `/api/auth/me`          | Get current user (auth required)      |
| GET    | `/api/tasks`            | List tasks                            |
| POST   | `/api/tasks`            | Create a task                         |
| PATCH  | `/api/tasks/:id`        | Update a task                         |
| DELETE | `/api/tasks/:id`        | Delete a task                         |
| DELETE | `/api/tasks`            | Delete all of the user's tasks        |
| GET    | `/api/habits`           | List habits                           |
| POST   | `/api/habits`           | Create a habit                        |
| PATCH  | `/api/habits/:id/toggle`| Toggle a habit's completion for a date|
| DELETE | `/api/habits/:id`       | Delete a habit                        |
| GET    | `/api/userdata`         | Get settings/goal/motivation/ambience |
| PATCH  | `/api/userdata`         | Update settings/goal/motivation/etc.  |

All routes except `/api/auth/register` and `/api/auth/login` require an
`Authorization: Bearer <token>` header.

## 2. Frontend setup

```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:4000`
(see `vite.config.js`), so the frontend and backend can run side by side
during development without CORS issues.

To build for production:

```bash
npm run build    # outputs to client/dist
```

Deploy `client/dist` behind any static host / reverse proxy and point
`/api` at your deployed `server`.

## What changed from the original

- Added a real backend: Express REST API + MongoDB models for users, tasks,
  habits, and per-user app data (settings, goal, motivation, ambience).
- Added authentication: registration & login with hashed passwords
  (bcrypt) and JWT-based sessions; the frontend ships a sign-in/sign-up flow
  and a protected dashboard route.
- Removed all `localStorage`-based persistence — every piece of state now
  round-trips through the API and is scoped to the logged-in user.
- Rewrote the frontend from TypeScript + import-map/CDN React into a normal
  Vite + React project with proper npm dependencies (no more loading React
  from `esm.sh` at runtime).
- Fixed and modernized the UI: consistent dark-mode styling across every
  view (previously only partially applied), a working mobile navigation
  drawer (the sidebar was desktop-only before), and removed UI affordances
  that relied on missing libraries (e.g. `animate-in` utilities that were
  never installed).
- Replaced the Ambience player's dead external audio links with
  Web Audio API–generated ambient noise, so the feature actually works
  without relying on third-party URLs that no longer resolve.
- Replaced the Motivation tab's broken/placeholder YouTube embeds with a
  self-contained "Daily Fuel" tips grid.
