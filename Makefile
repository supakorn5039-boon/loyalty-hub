.PHONY: dev backend frontend migrate seed fresh test build prod-up prod-down package

dev:
	@echo "🚀 Starting backend & frontend in development mode..."
	cd backend && go run main.go &
	cd frontend && npm run dev

backend:
	cd backend && go run main.go

frontend:
	cd frontend && npm run dev

migrate:
	cd backend && go run main.go migrate

seed:
	cd backend && go run main.go seed

fresh:
	cd backend && go run main.go fresh

test:
	@echo "🧪 Running unit & integration tests..."
	cd backend && go test -v ./...
	cd frontend && npm run build

build:
	@echo "📦 Building production binaries & frontend static assets..."
	cd backend && CGO_ENABLED=0 go build -ldflags="-w -s" -o loyaltyhub-api main.go
	cd frontend && npm run build

prod-up:
	@echo "🐳 Launching full production Docker Compose stack (Backend + Frontend + Postgres + Redis)..."
	docker compose up --build -d

prod-down:
	@echo "🛑 Stopping production Docker Compose stack..."
	docker compose down

package:
	@echo "📦 Packaging software for sale and vendor distribution..."
	bash scripts/package-release.sh
