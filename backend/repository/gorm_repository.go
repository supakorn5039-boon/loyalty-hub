package repository

import (
	"context"
	"errors"

	"loyalty-hub/backend/domain"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).First(&user, "email = ?", email).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) Update(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *userRepository) FindAll(ctx context.Context) ([]domain.User, error) {
	var users []domain.User
	err := r.db.WithContext(ctx).Order("points_balance desc").Find(&users).Error
	return users, err
}

type rewardRepository struct {
	db *gorm.DB
}

func NewRewardRepository(db *gorm.DB) domain.RewardRepository {
	return &rewardRepository{db: db}
}

func (r *rewardRepository) FindByID(ctx context.Context, id string) (*domain.Reward, error) {
	var reward domain.Reward
	if err := r.db.WithContext(ctx).First(&reward, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &reward, nil
}

func (r *rewardRepository) FindAll(ctx context.Context, category string) ([]domain.Reward, error) {
	var rewards []domain.Reward
	query := r.db.WithContext(ctx).Order("featured desc, created_at desc")
	if category != "" && category != "All" {
		query = query.Where("category = ?", category)
	}
	if err := query.Find(&rewards).Error; err != nil {
		return nil, err
	}
	return rewards, nil
}

func (r *rewardRepository) Create(ctx context.Context, reward *domain.Reward) error {
	return r.db.WithContext(ctx).Create(reward).Error
}

func (r *rewardRepository) UpdateStock(ctx context.Context, id string, stock int) error {
	return r.db.WithContext(ctx).Model(&domain.Reward{}).Where("id = ?", id).Update("stock", stock).Error
}

func (r *rewardRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Reward{}, "id = ?", id).Error
}

type couponRepository struct {
	db *gorm.DB
}

func NewCouponRepository(db *gorm.DB) domain.CouponRepository {
	return &couponRepository{db: db}
}

func (r *couponRepository) Create(ctx context.Context, coupon *domain.Coupon) error {
	return r.db.WithContext(ctx).Create(coupon).Error
}

func (r *couponRepository) FindByCodeOrToken(ctx context.Context, code string, token string) (*domain.Coupon, error) {
	var coupon domain.Coupon
	query := r.db.WithContext(ctx).Where("status = ?", "Active")

	if code != "" && token != "" {
		query = query.Where("code = ? OR qr_code_token = ?", code, token)
	} else if code != "" {
		query = query.Where("code = ? OR qr_code_token = ?", code, code)
	} else if token != "" {
		query = query.Where("code = ? OR qr_code_token = ?", token, token)
	} else {
		return nil, errors.New("neither code nor token specified")
	}

	if err := query.First(&coupon).Error; err != nil {
		return nil, err
	}
	return &coupon, nil
}

func (r *couponRepository) FindActiveByUserID(ctx context.Context, userID string, status string) ([]domain.Coupon, error) {
	var coupons []domain.Coupon
	err := r.db.WithContext(ctx).Where("user_id = ? AND status = ?", userID, status).Order("expires_at asc").Find(&coupons).Error
	return coupons, err
}

func (r *couponRepository) Update(ctx context.Context, coupon *domain.Coupon) error {
	return r.db.WithContext(ctx).Save(coupon).Error
}

type campaignRepository struct {
	db *gorm.DB
}

func NewCampaignRepository(db *gorm.DB) domain.CampaignRepository {
	return &campaignRepository{db: db}
}

func (r *campaignRepository) FindActive(ctx context.Context) ([]domain.Campaign, error) {
	var campaigns []domain.Campaign
	err := r.db.WithContext(ctx).Where("is_active = ?", true).Order("start_date desc").Find(&campaigns).Error
	return campaigns, err
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) domain.TransactionRepository {
	return &transactionRepository{db: db}
}

func (r *transactionRepository) Create(ctx context.Context, txn *domain.Transaction) error {
	return r.db.WithContext(ctx).Create(txn).Error
}

func (r *transactionRepository) FindByUserID(ctx context.Context, userID string, txnType string) ([]domain.Transaction, error) {
	var txns []domain.Transaction
	query := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at desc")
	if txnType != "" && txnType != "ALL" {
		query = query.Where("type = ?", txnType)
	}
	err := query.Find(&txns).Error
	return txns, err
}

func (r *transactionRepository) HasClaimedBirthday(ctx context.Context, userID string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.Transaction{}).
		Where("user_id = ? AND description LIKE ?", userID, "%Birthday%").
		Count(&count).Error
	return count > 0, err
}
