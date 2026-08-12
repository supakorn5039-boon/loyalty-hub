.PHONY: dev migrate seed fresh migrate-fresh migrate-force build test

dev:
	go run main.go

migrate:
	go run main.go migrate

seed:
	go run main.go seed

fresh:
	go run main.go fresh

migrate-fresh:
	go run main.go migrate fresh

migrate-force:
	go run main.go migrate --force

build:
	CGO_ENABLED=0 go build -ldflags="-w -s" -o loyaltyhub-api main.go

test:
	go test -v ./...
