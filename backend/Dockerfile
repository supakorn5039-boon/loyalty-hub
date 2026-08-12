# Multi-stage Dockerfile for Golang Backend
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy module files & download deps
COPY go.mod go.sum ./
RUN go mod download

# Copy source code & build binary (CGO_ENABLED=0 for instant static binary)
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/loyaltyhub-api .

# Final minimal runtime image
FROM alpine:latest

WORKDIR /app
RUN apk add --no-cache ca-certificates tzdata

# Copy binary from builder
COPY --from=builder /app/loyaltyhub-api /app/loyaltyhub-api

EXPOSE 8080

CMD ["/app/loyaltyhub-api"]
