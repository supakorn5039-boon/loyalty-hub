package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"loyalty-hub/backend/domain"
	"loyalty-hub/backend/dto"
	"loyalty-hub/backend/handler"
	"loyalty-hub/backend/repository"
	"loyalty-hub/backend/router"
	"loyalty-hub/backend/service"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestApp() *gin.Engine {
	gin.SetMode(gin.TestMode)
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	// Drop tables and re-migrate to ensure clean state
	_ = db.Migrator().DropTable(&domain.User{}, &domain.Reward{}, &domain.Coupon{}, &domain.Campaign{}, &domain.Transaction{})
	repository.AutoMigrateAndSeed(db)

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
	return router.SetupRouter(loyaltyHandler)
}

func TestGetUserProfile(t *testing.T) {
	r := setupTestApp()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/user/profile?userId=usr_demo_711", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var user domain.User
	err := json.Unmarshal(w.Body.Bytes(), &user)
	assert.NoError(t, err)
	assert.Equal(t, "usr_demo_711", user.ID)
}

func TestGetRewards(t *testing.T) {
	r := setupTestApp()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/rewards?category=All", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var rewards []domain.Reward
	err := json.Unmarshal(w.Body.Bytes(), &rewards)
	assert.NoError(t, err)
	assert.Greater(t, len(rewards), 0)
}

func TestScanAndEarnPoints(t *testing.T) {
	r := setupTestApp()

	payload := dto.EarnPointsRequest{
		UserID:    "usr_demo_711",
		Amount:    250.0,
		StoreName: "Test Store",
	}
	body, _ := json.Marshal(payload)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/qr/scan-earn", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "earnedPoints")
}

func TestRedeemCouponScan(t *testing.T) {
	r := setupTestApp()

	payload := dto.RedeemCouponScanRequest{
		CouponCode: "SLURP-FREE-2026",
		StoreName:  "Test Cashier",
	}
	body, _ := json.Marshal(payload)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/coupons/scan-redeem", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "successfully redeemed")
}
