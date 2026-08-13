# backend/AGENTS.md

Guidance for working under `backend/`. Cross-cutting repo info is in the root `AGENTS.md`.

## 🛠 Stack

Go 1.22+ + Gin Framework + GORM ORM + PostgreSQL 16 / SQLite fallback + Redis 7 cache. JWT Bearer token authentication.

## 🚀 Commands

```bash
make dev           # go run main.go (auto-migrates & seeds if DB empty)
make migrate       # run DB auto-migrations
make seed          # seed initial mock data
make fresh         # drop all tables, re-migrate & seed
make build         # CGO-disabled binary output at ./loyaltyhub-api
make test          # run unit tests
make docker-up     # spin up Postgres & Redis containers
make docker-down   # stop containers
```

## 📂 Layout

```
backend/
├── config/        # Environment & config loader (godotenv + env vars)
├── database/      # PostgreSQL, SQLite, and Redis connection init
├── domain/        # Domain entities, tier logic, repository interfaces
├── dto/           # Request/Response DTOs
├── handler/       # Gin HTTP handlers & test files
├── middleware/    # Auth & security middleware (ExtractUserID)
├── repository/    # GORM implementations & database seeder
├── router/        # Route setup & CORS configuration
├── service/       # Business logic (LoyaltyService)
├── main.go        # Entry point & CLI handler
```

## 🛡 Auth & Middleware

- `middleware.ExtractUserID(c)` extracts User ID from:
  1. `Authorization: Bearer JWT-TOKEN-<userId>-<timestamp>`
  2. `X-User-ID` Header
  3. `userId` Query Parameter
  4. Default demo user (`usr_demo_711`) fallback
