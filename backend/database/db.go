package database

import (
	"log"

	"loyalty-hub/backend/config"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDB(cfg *config.Config) *gorm.DB {
	var db *gorm.DB
	var err error

	if cfg.DatabaseDSN != "" {
		db, err = gorm.Open(postgres.Open(cfg.DatabaseDSN), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err != nil {
			log.Printf("⚠️ Failed to connect PostgreSQL, falling back to SQLite: %v", err)
			db, err = gorm.Open(sqlite.Open("loyaltyhub.db"), &gorm.Config{})
		} else {
			log.Println("🐘 Connected to PostgreSQL successfully!")
		}
	} else {
		log.Println("📦 Using SQLite storage (loyaltyhub.db)...")
		db, err = gorm.Open(sqlite.Open("loyaltyhub.db"), &gorm.Config{})
	}

	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}

	return db
}
