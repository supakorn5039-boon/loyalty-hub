package dto

import (
	"time"

	"loyalty-hub/backend/domain"
)

type DynamicQRResponse struct {
	Token         string    `json:"token"`
	BarcodeNumber string    `json:"barcodeNumber"`
	ExpiresAt     time.Time `json:"expiresAt"`
	TTLSeconds    int       `json:"ttlSeconds"`
}

type RedeemRewardRequest struct {
	UserID   string `json:"userId" binding:"required"`
	RewardID string `json:"rewardId" binding:"required"`
}

type EarnPointsRequest struct {
	UserID    string  `json:"userId" binding:"required"`
	Amount    float64 `json:"amount" binding:"required"`
	StoreName string  `json:"storeName"`
}

type RedeemCouponScanRequest struct {
	CouponCode  string `json:"couponCode"`
	QRCodeToken string `json:"qrCodeToken"`
	StoreName   string `json:"storeName"`
}

type APIResponse struct {
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type RedeemRewardResponse struct {
	Message string        `json:"message"`
	Coupon  domain.Coupon `json:"coupon"`
	User    domain.User   `json:"user"`
}

type EarnPointsResponse struct {
	Message      string      `json:"message"`
	EarnedPoints int         `json:"earnedPoints"`
	User         domain.User `json:"user"`
}

type RedeemCouponResponse struct {
	Message string        `json:"message"`
	Coupon  domain.Coupon `json:"coupon"`
}

type AuthLoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthRegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	Birthday string `json:"birthday"`
}

type AuthResponse struct {
	Message string      `json:"message"`
	Token   string      `json:"token"`
	User    domain.User `json:"user"`
}

type AdminAnalyticsResponse struct {
	TotalMembers       int64   `json:"totalMembers"`
	TotalPointsIssued  int64   `json:"totalPointsIssued"`
	TotalRedemptions   int64   `json:"totalRedemptions"`
	ActiveVouchers     int64   `json:"activeVouchers"`
	TotalRevenueVolume float64 `json:"totalRevenueVolume"`
}

type CreateRewardRequest struct {
	Title          string  `json:"title" binding:"required"`
	Description    string  `json:"description" binding:"required"`
	Category       string  `json:"category" binding:"required"`
	PointsRequired int     `json:"pointsRequired" binding:"required"`
	RetailPrice    float64 `json:"retailPrice" binding:"required"`
	ImageUrl       string  `json:"imageUrl"`
	Stock          int     `json:"stock"`
	ExpiryDays     int     `json:"expiryDays"`
	Featured       bool    `json:"featured"`
}

type AdjustPointsRequest struct {
	UserID       string `json:"userId" binding:"required"`
	PointsAmount int    `json:"pointsAmount" binding:"required"`
	Reason       string `json:"reason"`
}

type ClaimBirthdayResponse struct {
	Message     string        `json:"message"`
	BonusPoints int           `json:"bonusPoints"`
	Coupon      domain.Coupon `json:"coupon"`
	User        domain.User   `json:"user"`
}
