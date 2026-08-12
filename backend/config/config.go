package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	PostgresHost string
	PostgresUser string
	PostgresPass string
	PostgresDB   string
	PostgresPort string
	DatabaseDSN  string
	RedisHost    string
	RedisPort    string
	AppSecret    string
}

func LoadConfig() *Config {
	// Attempt to load .env file if present
	if err := godotenv.Load(); err != nil {
		// Attempt to load from parent directory if backend subfolder
		_ = godotenv.Load("../.env")
	} else {
		log.Println("🔑 Environment variables loaded from .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	pgHost := os.Getenv("POSTGRES_HOST")
	pgUser := os.Getenv("POSTGRES_USER")
	if pgUser == "" {
		pgUser = "loyalty_user"
	}
	pgPass := os.Getenv("POSTGRES_PASSWORD")
	if pgPass == "" {
		pgPass = "loyalty_password"
	}
	pgDb := os.Getenv("POSTGRES_DB")
	if pgDb == "" {
		pgDb = "loyaltyhub_db"
	}
	pgPort := os.Getenv("POSTGRES_PORT")
	if pgPort == "" {
		pgPort = "5432"
	}

	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost"
	}
	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}

	appSecret := os.Getenv("APP_SECRET")
	if appSecret == "" {
		appSecret = "default-dev-secret-change-me"
	}

	dsn := ""
	if pgHost != "" {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Bangkok",
			pgHost, pgUser, pgPass, pgDb, pgPort)
	}

	return &Config{
		Port:         port,
		PostgresHost: pgHost,
		PostgresUser: pgUser,
		PostgresPass: pgPass,
		PostgresDB:   pgDb,
		PostgresPort: pgPort,
		DatabaseDSN:  dsn,
		RedisHost:    redisHost,
		RedisPort:    redisPort,
		AppSecret:    appSecret,
	}
}
