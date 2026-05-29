# Estate AI

AI-powered real estate investment platform — analyze markets, discover undervalued properties, and automate investment research with autonomous AI agents.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Zustand |
| Backend | FastAPI (Python), modular agent orchestrator |
| Database | PostgreSQL, Prisma ORM |
| Auth | Clerk (optional — works without keys in demo mode) |
| Maps | Leaflet + OpenStreetMap (no token required) |
| AI | OpenAI API (optional — mock responses when unset) |

## Project structure

```
EstateAI/
├── frontend/          # Next.js App Router
├── backend/           # FastAPI REST API + AI agents
├── docker-compose.yml # PostgreSQL + backend
└── .env.example
```

## Quick start (demo — no database required)

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses in-memory multi-market property data when the API is offline.

### Backend (optional)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local`.

### Full stack with Docker

```bash
docker compose up -d postgres
cd frontend && npm run db:push && npm run db:seed
docker compose up backend
```

## Features

- **Landing page** — Hero, features, AI workflow, analytics preview, property showcase, testimonials, pricing, FAQ
- **Dashboard** — Portfolio metrics, sentiment index, charts, heatmap, AI opportunity feed
- **Properties** — 75 seeded listings (06103), filters, semantic search
- **Property details** — Gallery, AI recommendation, charts, mortgage calculator, comparables
- **AI Assistant** — Streaming chat with suggested prompts
- **AI Agents** — Market, scoring, opportunity, report, portfolio optimization
- **Map** — Leaflet/OpenStreetMap interactive markers and zones
- **Watchlist** — Persisted via Zustand
- **Investors page** — Vision, metrics, roadmap, contact form

## Environment variables

See `.env.example` and `frontend/.env.example`.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | FastAPI base URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (optional) |
| `OPENAI_API_KEY` | OpenAI for live AI chat |
| `DATABASE_URL` | PostgreSQL for Prisma |

## Deployment

- **Frontend:** Vercel — root directory `frontend`
- **Backend:** Railway or Render — use `backend/Dockerfile`
- Set environment variables in each platform

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/properties` | List/filter properties |
| GET | `/api/v1/properties/{id}` | Property detail |
| GET | `/api/v1/dashboard` | Dashboard aggregates |
| POST | `/api/v1/chat` | AI assistant |
| POST | `/api/v1/chat/stream` | Streaming chat |
| POST | `/api/v1/agents/workflow` | Run agent workflow |
| POST | `/api/v1/agents/run` | Run single agent |

## License

Demo project for investor presentations. Connect live MLS/property APIs for production use.
