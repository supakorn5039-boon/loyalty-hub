package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type MemberTier string

const (
	TierMember   MemberTier = "Member"
	TierSilver   MemberTier = "Silver"
	TierGold     MemberTier = "Gold"
	TierPlatinum MemberTier = "Platinum"
)

func (t MemberTier) Threshold() int {
	switch t {
	case TierPlatinum:
		return 5000
	case TierGold:
		return 2500
	case TierSilver:
		return 1000
	default:
		return 0
	}
}

func EvaluateTier(lifetimePoints int) MemberTier {
	if lifetimePoints >= 5000 {
		return TierPlatinum
	}
	if lifetimePoints >= 2500 {
		return TierGold
	}
	if lifetimePoints >= 1000 {
		return TierSilver
	}
	return TierMember
}

type UserRole string

const (
	RoleMember  UserRole = "Member"
	RoleCashier UserRole = "Cashier"
	RoleAdmin   UserRole = "Admin"
)

// Domain Entities
type User struct {
	ID             string     `gorm:"primaryKey" json:"id"`
	MemberID       string     `gorm:"uniqueIndex" json:"memberId"`
	Name           string     `json:"name"`
	Phone          string     `json:"phone"`
	Email          string     `gorm:"uniqueIndex" json:"email"`
	PasswordHash   string     `json:"-"`
	Role           UserRole   `json:"role"`
	Tier           MemberTier `json:"tier"`
	PointsBalance  int        `json:"pointsBalance"`
	LifetimePoints int        `json:"lifetimePoints"`
	Birthday       string     `json:"birthday"`
	AvatarUrl      string     `json:"avatarUrl"`
	CreatedAt      time.Time  `json:"createdAt"`
}

type Reward struct {
	ID             string    `gorm:"primaryKey" json:"id"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	Category       string    `json:"category"`
	PointsRequired int       `json:"pointsRequired"`
	RetailPrice    float64   `json:"retailPrice"`
	ImageUrl       string    `json:"imageUrl"`
	Stock          int       `json:"stock"`
	ExpiryDays     int       `json:"expiryDays"`
	Featured       bool      `json:"featured"`
	CreatedAt      time.Time `json:"createdAt"`
}

type Coupon struct {
	ID            string     `gorm:"primaryKey" json:"id"`
	UserID        string     `gorm:"index" json:"userId"`
	RewardID      string     `json:"rewardId"`
	Title         string     `json:"title"`
	Code          string     `gorm:"uniqueIndex" json:"code"`
	DiscountValue string     `json:"discountValue"`
	DiscountType  string     `json:"discountType"` // FreeItem, Percentage, FixedAmount
	Status        string     `json:"status"`       // Active, Redeemed, Expired
	ExpiresAt     time.Time  `json:"expiresAt"`
	RedeemedAt    *time.Time `json:"redeemedAt,omitempty"`
	QRCodeToken   string     `json:"qrCodeToken"`
	ImageUrl      string     `json:"imageUrl"`
}

type Campaign struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Subtitle    string    `json:"subtitle"`
	Description string    `json:"description"`
	BannerUrl   string    `json:"bannerUrl"`
	Type        string    `json:"type"` // DoublePoints, BirthdayGift, FlashSale
	Multiplier  float64   `json:"multiplier"`
	BadgeText   string    `json:"badgeText"`
	IsActive    bool      `json:"isActive"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
}

type Transaction struct {
	ID            string    `gorm:"primaryKey" json:"id"`
	UserID        string    `gorm:"index" json:"userId"`
	TransactionNo string    `gorm:"uniqueIndex" json:"transactionNo"`
	Type          string    `json:"type"` // EARN, REDEEM, BONUS, EXPIRED
	PointsAmount  int       `json:"pointsAmount"`
	BalanceAfter  int       `json:"balanceAfter"`
	Description   string    `json:"description"`
	StoreName     string    `json:"storeName"`
	CreatedAt     time.Time `json:"createdAt"`
}

func NewUUID() string {
	return uuid.New().String()
}

// Repository Interfaces (Data Access Layer Abstraction)
type UserRepository interface {
	FindByID(ctx context.Context, id string) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	Create(ctx context.Context, user *User) error
	Update(ctx context.Context, user *User) error
	FindAll(ctx context.Context) ([]User, error)
}

type RewardRepository interface {
	FindByID(ctx context.Context, id string) (*Reward, error)
	FindAll(ctx context.Context, category string) ([]Reward, error)
	Create(ctx context.Context, reward *Reward) error
	UpdateStock(ctx context.Context, id string, stock int) error
	Delete(ctx context.Context, id string) error
}

type CouponRepository interface {
	Create(ctx context.Context, coupon *Coupon) error
	FindByCodeOrToken(ctx context.Context, code string, token string) (*Coupon, error)
	FindActiveByUserID(ctx context.Context, userID string, status string) ([]Coupon, error)
	Update(ctx context.Context, coupon *Coupon) error
}

type CampaignRepository interface {
	FindActive(ctx context.Context) ([]Campaign, error)
}

type TransactionRepository interface {
	Create(ctx context.Context, txn *Transaction) error
	FindByUserID(ctx context.Context, userID string, txnType string) ([]Transaction, error)
	HasClaimedBirthday(ctx context.Context, userID string) (bool, error)
}
