package main

import (
	"log"
	"os"

	"loyalty-hub/backend/config"
	"loyalty-hub/backend/database"
	"loyalty-hub/backend/handler"
	"loyalty-hub/backend/repository"
	"loyalty-hub/backend/router"
	"loyalty-hub/backend/service"
)

func main() {
	// 1. Load Configuration
	cfg := config.LoadConfig()

	// 2. Initialize DB Connection
	db := database.InitDB(cfg)

	// 3. Handle CLI Commands (migrate, seed, fresh, --force)
	if len(os.Args) > 1 {
		args := os.Args[1:]
		primaryCmd := args[0]
		subCmd := ""
		if len(args) > 1 {
			subCmd = args[1]
		}

		switch primaryCmd {
		case "migrate":
			if subCmd == "fresh" || subCmd == "--fresh" || subCmd == "--force" || subCmd == "-f" {
				repository.Fresh(db)
			} else {
				repository.Migrate(db)
			}
			return
		case "seed":
			repository.Seed(db)
			return
		case "fresh", "migrate:fresh":
			repository.Fresh(db)
			return
		case "help", "--help", "-h":
			log.Println("🛠 LoyaltyHub CLI Usage:")
			log.Println("  go run main.go               - Run HTTP server")
			log.Println("  go run main.go migrate       - Run DB auto-migration")
			log.Println("  go run main.go seed          - Seed initial mock data")
			log.Println("  go run main.go migrate fresh - Drop all tables, re-migrate & seed")
			log.Println("  go run main.go migrate --force - Force fresh migration & seed")
			return
		default:
			log.Fatalf("Unknown command: %s. Available commands: migrate, seed, fresh (Try: go run main.go --help)", primaryCmd)
		}
	}


	// Default: AutoMigrate & Seed if empty
	repository.AutoMigrateAndSeed(db)
	database.InitRedis(cfg)

	// 4. Dependency Injection (Layered Architecture)
	userRepo := repository.NewUserRepository(db)
	rewardRepo := repository.NewRewardRepository(db)
	couponRepo := repository.NewCouponRepository(db)
	campaignRepo := repository.NewCampaignRepository(db)
	transactionRepo := repository.NewTransactionRepository(db)

	loyaltySvc := service.NewLoyaltyService(
		userRepo,
		rewardRepo,
		couponRepo,
		campaignRepo,
		transactionRepo,
	)

	loyaltyHandler := handler.NewLoyaltyHandler(loyaltySvc)

	// 5. Setup Router & Middlewares
	r := router.SetupRouter(loyaltyHandler)

	// 6. Start HTTP Server
	log.Printf("🐹 LoyaltyHub Go API server listening on http://0.0.0.0:%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

