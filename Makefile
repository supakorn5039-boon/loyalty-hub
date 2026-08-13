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
	rm -rf dist_release
	mkdir -p dist_release/loyalty-hub-v1.0.0
	cp -R backend frontend docker-compose.yml .env.example Makefile README.md VENDOR_HOSTING_GUIDE.md dist_release/loyalty-hub-v1.0.0/
	rm -rf dist_release/loyalty-hub-v1.0.0/frontend/node_modules dist_release/loyalty-hub-v1.0.0/frontend/dist dist_release/loyalty-hub-v1.0.0/backend/loyaltyhub.db dist_release/loyalty-hub-v1.0.0/backend/loyaltyhub-api
	cd dist_release && tar -czf loyalty-hub-v1.0.0-vendor-package.tar.gz loyalty-hub-v1.0.0
	@echo "✅ SUCCESS! Release package generated at: dist_release/loyalty-hub-v1.0.0-vendor-package.tar.gz"
