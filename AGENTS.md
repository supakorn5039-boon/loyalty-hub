# AGENTS.md

This file provides architectural guidance and guidelines when working in this repository.

Nested `AGENTS.md` files live in `frontend/` and `backend/` and contain sub-project specific details.

## 🏗 Repo Architecture

Monorepo containing two core applications:

- `frontend/` — React 19 + TypeScript + Vite + Tailwind CSS + Shadcn UI + TanStack Query v5 + Framer Motion. See `frontend/AGENTS.md`.
- `backend/` — Go 1.22+ + Gin + GORM + PostgreSQL 16 / SQLite + Redis 7. See `backend/AGENTS.md`.

## ⚙️ Local Infrastructure

PostgreSQL and Redis run in Docker for backend development:

```bash
cd backend && docker compose up -d
```

If PostgreSQL or Redis containers are not running, the Go backend seamlessly falls back to local SQLite (`loyaltyhub.db`) and in-memory cache.

## 🚀 Quick Development Commands

- **Backend**: `cd backend && make dev` (runs API on http://localhost:8080)
- **Frontend**: `cd frontend && npm run dev` (runs SPA on http://localhost:3000)
- **Full Stack Production**: `docker compose up --build -d` (spins up full stack on port 80)

## 📐 Coding Conventions

- **Clean Architecture**: Domain entities in `backend/domain`, business logic in `backend/service`, Gin controllers in `backend/handler`, data access in `backend/repository`.
- **Frontend State**: Server state managed via TanStack Query (`frontend/src/hooks/`), auth persistence via `localStorage`.
- **API Error Handling**: All HTTP handlers return structured `dto.APIResponse{Error: "..."}` on errors.
