package repository

import (
	"log"
	"time"

	"loyalty-hub/backend/domain"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	log.Println("🔄 Running database migrations...")
	err := db.AutoMigrate(
		&domain.User{},
		&domain.Reward{},
		&domain.Coupon{},
		&domain.Campaign{},
		&domain.Transaction{},
	)
	if err != nil {
		log.Fatalf("❌ AutoMigrate failed: %v", err)
	}
	log.Println("✅ Database migration completed!")
}

func Seed(db *gorm.DB) {
	log.Println("🌱 Seeding database...")
	seedData(db)
}

func Fresh(db *gorm.DB) {
	log.Println("🔥 Dropping all database tables...")
	_ = db.Migrator().DropTable(
		&domain.Transaction{},
		&domain.Coupon{},
		&domain.Campaign{},
		&domain.Reward{},
		&domain.User{},
	)
	log.Println("✅ All tables dropped!")
	Migrate(db)
	seedData(db)
}

func AutoMigrateAndSeed(db *gorm.DB) {
	Migrate(db)

	var userCount int64
	db.Model(&domain.User{}).Count(&userCount)
	if userCount > 0 {
		return
	}

	seedData(db)
}

func seedData(db *gorm.DB) {
	log.Println("🌱 Seeding initial mock data into LoyaltyHub database...")


	// Seed Users
	defaultUser := domain.User{
		ID:             "usr_demo_711",
		MemberID:       "711-8899-2341",
		Name:           "Alex Morgan",
		Phone:          "+66 81 234 5678",
		Email:          "alex.m@loyaltyhub.io",
		PasswordHash:   "password123",
		Role:           domain.RoleMember,
		Tier:           domain.TierGold,
		PointsBalance:  1250,
		LifetimePoints: 3450,
		Birthday:       "1995-08-15",
		AvatarUrl:      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
		CreatedAt:      time.Now().AddDate(-1, 0, 0),
	}
	db.Create(&defaultUser)

	secondUser := domain.User{
		ID:             "usr_demo_999",
		MemberID:       "711-9900-8812",
		Name:           "Sarah Connor",
		Phone:          "+66 82 987 6543",
		Email:          "sarah.c@loyaltyhub.io",
		PasswordHash:   "password123",
		Role:           domain.RoleMember,
		Tier:           domain.TierPlatinum,
		PointsBalance:  4800,
		LifetimePoints: 6200,
		Birthday:       "1992-05-20",
		AvatarUrl:      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
		CreatedAt:      time.Now().AddDate(-2, 0, 0),
	}
	db.Create(&secondUser)

	adminUser := domain.User{
		ID:             "usr_admin_001",
		MemberID:       "711-0000-0001",
		Name:           "Store Manager (Admin)",
		Phone:          "+66 80 000 9999",
		Email:          "admin@loyaltyhub.io",
		PasswordHash:   "admin123",
		Role:           domain.RoleAdmin,
		Tier:           domain.TierPlatinum,
		PointsBalance:  99999,
		LifetimePoints: 99999,
		Birthday:       "1988-01-01",
		AvatarUrl:      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
		CreatedAt:      time.Now().AddDate(-3, 0, 0),
	}
	db.Create(&adminUser)

	// Seed Rewards
	rewards := []domain.Reward{
		{
			ID:             "rw_711_slurpee",
			Title:          "7-Select Slurpee (Large)",
			Description:    "Refreshingly ice cold Slurpee in your favorite Berry Blast flavor.",
			Category:       "Drinks",
			PointsRequired: 150,
			RetailPrice:    35.00,
			ImageUrl:       "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
			Stock:          250,
			ExpiryDays:     14,
			Featured:       true,
			CreatedAt:      time.Now(),
		},
		{
			ID:             "rw_sbx_latte",
			Title:          "Iced Caramel Macchiato",
			Description:    "Espresso combined with vanilla syrup, milk, caramel drizzle and ice.",
			Category:       "Drinks",
			PointsRequired: 450,
			RetailPrice:    155.00,
			ImageUrl:       "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
			Stock:          100,
			ExpiryDays:     30,
			Featured:       true,
			CreatedAt:      time.Now(),
		},
		{
			ID:             "rw_mcd_fries",
			Title:          "French Fries (Large)",
			Description:    "Golden, crispy salted potato fries freshly fried to perfection.",
			Category:       "Snacks",
			PointsRequired: 200,
			RetailPrice:    75.00,
			ImageUrl:       "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600",
			Stock:          500,
			ExpiryDays:     7,
			Featured:       true,
			CreatedAt:      time.Now(),
		},
		{
			ID:             "rw_711_toastie",
			Title:          "Ham & Cheese Hot Sandwich",
			Description:    "Press-grilled crispy white bread stuffed with premium smoked ham and cheddar cheese.",
			Category:       "Snacks",
			PointsRequired: 250,
			RetailPrice:    39.00,
			ImageUrl:       "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600",
			Stock:          300,
			ExpiryDays:     14,
			Featured:       true,
			CreatedAt:      time.Now(),
		},
		{
			ID:             "rw_vch_100",
			Title:          "฿100 Cash Cashier Voucher",
			Description:    "Instant 100 Baht discount barcode usable at any partner cashier counter.",
			Category:       "Vouchers",
			PointsRequired: 800,
			RetailPrice:    100.00,
			ImageUrl:       "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=600",
			Stock:          50,
			ExpiryDays:     60,
			Featured:       false,
			CreatedAt:      time.Now(),
		},
	}
	for _, r := range rewards {
		db.Create(&r)
	}

	// Seed Coupons
	coupons := []domain.Coupon{
		{
			ID:            "cpn_act_01",
			UserID:        defaultUser.ID,
			RewardID:      "rw_711_slurpee",
			Title:         "FREE 7-Select Slurpee (Large)",
			Code:          "SLURP-FREE-2026",
			DiscountValue: "100% OFF",
			DiscountType:  "FreeItem",
			Status:        "Active",
			ExpiresAt:     time.Now().AddDate(0, 0, 7),
			QRCodeToken:   "QR-CPN-SLURP-9921",
			ImageUrl:      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
		},
		{
			ID:            "cpn_act_02",
			UserID:        defaultUser.ID,
			RewardID:      "rw_mcd_fries",
			Title:         "Free Large French Fries",
			Code:          "MCD-FRIES-8812",
			DiscountValue: "FREE",
			DiscountType:  "FreeItem",
			Status:        "Active",
			ExpiresAt:     time.Now().AddDate(0, 0, 3),
			QRCodeToken:   "QR-CPN-FRIES-4411",
			ImageUrl:      "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600",
		},
	}
	for _, c := range coupons {
		db.Create(&c)
	}

	// Seed Campaigns
	campaigns := []domain.Campaign{
		{
			ID:          "cmp_bday_special",
			Title:       "🎉 August Birthday Month Extravaganza!",
			Subtitle:    "Claim your free 500 Bonus Points & Birthday Gift Coupon",
			Description: "As a valued Gold member, enjoy 2X points on all coffee purchases during your birthday month plus a special free treat!",
			BannerUrl:   "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1000",
			Type:        "BirthdayGift",
			Multiplier:  2.0,
			BadgeText:   "BIRTHDAY PERK",
			IsActive:    true,
			StartDate:   time.Now().AddDate(0, -1, 0),
			EndDate:     time.Now().AddDate(0, 1, 0),
		},
		{
			ID:          "cmp_double_points",
			Title:       "⚡ 2X Stamp & Points Weekend",
			Subtitle:    "Earn double ALL Member points on snacks & cold drinks",
			Description: "Spend ฿50 or more on participating items and automatically collect double points at POS scanner.",
			BannerUrl:   "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
			Type:        "DoublePoints",
			Multiplier:  2.0,
			BadgeText:   "LIMITED TIME",
			IsActive:    true,
			StartDate:   time.Now(),
			EndDate:     time.Now().AddDate(0, 0, 5),
		},
	}
	for _, cmp := range campaigns {
		db.Create(&cmp)
	}

	// Seed Transactions
	transactions := []domain.Transaction{
		{
			ID:            "txn_001",
			UserID:        defaultUser.ID,
			TransactionNo: "TXN-20260805-0912",
			Type:          "EARN",
			PointsAmount:  120,
			BalanceAfter:  1250,
			Description:   "Purchased Iced Latte & Ham Toastie",
			StoreName:     "7-Eleven Branch #4012 (Silom)",
			CreatedAt:     time.Now().Add(-24 * time.Hour),
		},
		{
			ID:            "txn_002",
			UserID:        defaultUser.ID,
			TransactionNo: "TXN-20260803-1420",
			Type:          "REDEEM",
			PointsAmount:  -200,
			BalanceAfter:  1130,
			Description:   "Redeemed Large French Fries Coupon",
			StoreName:     "McDonald's Siam Paragon",
			CreatedAt:     time.Now().Add(-72 * time.Hour),
		},
		{
			ID:            "txn_003",
			UserID:        defaultUser.ID,
			TransactionNo: "TXN-20260801-1000",
			Type:          "BONUS",
			PointsAmount:  500,
			BalanceAfter:  1330,
			Description:   "August Birthday Month Gift Bonus Points",
			StoreName:     "LoyaltyHub System",
			CreatedAt:     time.Now().Add(-120 * time.Hour),
		},
	}
	for _, txn := range transactions {
		db.Create(&txn)
	}

	log.Println("✅ Mock data seeded successfully!")
}
