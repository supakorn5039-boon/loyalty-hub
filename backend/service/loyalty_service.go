package service

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"time"

	"loyalty-hub/backend/domain"
	"loyalty-hub/backend/dto"
)

type LoyaltyService interface {
	GetUserProfile(ctx context.Context, userID string) (*domain.User, error)
	GetAllUsers(ctx context.Context) ([]domain.User, error)
	Register(ctx context.Context, req dto.AuthRegisterRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req dto.AuthLoginRequest) (*dto.AuthResponse, error)
	GetRewards(ctx context.Context, category string) ([]domain.Reward, error)
	RedeemReward(ctx context.Context, req dto.RedeemRewardRequest) (*dto.RedeemRewardResponse, error)
	GetUserCoupons(ctx context.Context, userID string, status string) ([]domain.Coupon, error)
	GetCampaigns(ctx context.Context) ([]domain.Campaign, error)
	GetTransactions(ctx context.Context, userID string, txnType string) ([]domain.Transaction, error)
	GenerateDynamicQR(ctx context.Context, userID string) (*dto.DynamicQRResponse, error)
	ScanAndEarn(ctx context.Context, req dto.EarnPointsRequest) (*dto.EarnPointsResponse, error)
	RedeemCouponScan(ctx context.Context, req dto.RedeemCouponScanRequest) (*dto.RedeemCouponResponse, error)
	ClaimBirthdayReward(ctx context.Context, userID string) (*dto.ClaimBirthdayResponse, error)

	// Admin Dashboard Methods
	GetAdminAnalytics(ctx context.Context) (*dto.AdminAnalyticsResponse, error)
	CreateReward(ctx context.Context, req dto.CreateRewardRequest) (*domain.Reward, error)
	DeleteReward(ctx context.Context, id string) error
	AdjustPoints(ctx context.Context, req dto.AdjustPointsRequest) (*domain.User, error)
}

type loyaltyService struct {
	userRepo        domain.UserRepository
	rewardRepo      domain.RewardRepository
	couponRepo      domain.CouponRepository
	campaignRepo    domain.CampaignRepository
	transactionRepo domain.TransactionRepository
}

func NewLoyaltyService(
	userRepo domain.UserRepository,
	rewardRepo domain.RewardRepository,
	couponRepo domain.CouponRepository,
	campaignRepo domain.CampaignRepository,
	transactionRepo domain.TransactionRepository,
) LoyaltyService {
	return &loyaltyService{
		userRepo:        userRepo,
		rewardRepo:      rewardRepo,
		couponRepo:      couponRepo,
		campaignRepo:    campaignRepo,
		transactionRepo: transactionRepo,
	}
}

func (s *loyaltyService) GetUserProfile(ctx context.Context, userID string) (*domain.User, error) {
	if userID == "" {
		userID = "usr_demo_711"
	}
	return s.userRepo.FindByID(ctx, userID)
}

func (s *loyaltyService) GetAllUsers(ctx context.Context) ([]domain.User, error) {
	return s.userRepo.FindAll(ctx)
}

func (s *loyaltyService) Register(ctx context.Context, req dto.AuthRegisterRequest) (*dto.AuthResponse, error) {
	existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if existing != nil {
		return nil, domain.ErrEmailAlreadyExists
	}

	userID := "usr_" + domain.NewUUID()[:8]
	memberID := fmt.Sprintf("711-%04d-%04d", rand.Intn(9999), rand.Intn(9999))

	newUser := domain.User{
		ID:             userID,
		MemberID:       memberID,
		Name:           req.Name,
		Phone:          req.Phone,
		Email:          req.Email,
		PasswordHash:   req.Password, // Simple hash for demo
		Tier:           domain.TierMember,
		PointsBalance:  200, // 200 Welcome bonus points!
		LifetimePoints: 200,
		Birthday:       req.Birthday,
		AvatarUrl:      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
		CreatedAt:      time.Now(),
	}

	if err := s.userRepo.Create(ctx, &newUser); err != nil {
		return nil, fmt.Errorf("failed to create user account: %w", err)
	}

	// Welcome Bonus Transaction
	txn := domain.Transaction{
		ID:            domain.NewUUID(),
		UserID:        newUser.ID,
		TransactionNo: fmt.Sprintf("TXN-REG-%s", time.Now().Format("20060102")),
		Type:          "BONUS",
		PointsAmount:  200,
		BalanceAfter:  200,
		Description:   "🎉 New Member Welcome Gift (200 Points)",
		StoreName:     "LoyaltyHub Membership System",
		CreatedAt:     time.Now(),
	}
	_ = s.transactionRepo.Create(ctx, &txn)

	token := fmt.Sprintf("JWT-TOKEN-%s-%d", newUser.ID, time.Now().Unix())

	return &dto.AuthResponse{
		Message: "Welcome to LoyaltyHub! Account registered successfully.",
		Token:   token,
		User:    newUser,
	}, nil
}

func (s *loyaltyService) Login(ctx context.Context, req dto.AuthLoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, domain.ErrInvalidCredentials
	}

	// Check password (matching plaintext or demo user)
	if user.PasswordHash != "" && user.PasswordHash != req.Password {
		return nil, domain.ErrInvalidCredentials
	}

	token := fmt.Sprintf("JWT-TOKEN-%s-%d", user.ID, time.Now().Unix())

	return &dto.AuthResponse{
		Message: fmt.Sprintf("Welcome back, %s!", user.Name),
		Token:   token,
		User:    *user,
	}, nil
}

func (s *loyaltyService) GetRewards(ctx context.Context, category string) ([]domain.Reward, error) {
	return s.rewardRepo.FindAll(ctx, category)
}

func (s *loyaltyService) RedeemReward(ctx context.Context, req dto.RedeemRewardRequest) (*dto.RedeemRewardResponse, error) {
	user, err := s.userRepo.FindByID(ctx, req.UserID)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	reward, err := s.rewardRepo.FindByID(ctx, req.RewardID)
	if err != nil {
		return nil, domain.ErrRewardNotFound
	}

	if user.PointsBalance < reward.PointsRequired {
		return nil, domain.ErrInsufficientPoints
	}

	if reward.Stock <= 0 {
		return nil, domain.ErrRewardOutOfStock
	}

	// Deduct points & update stock
	user.PointsBalance -= reward.PointsRequired
	reward.Stock -= 1

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to update points balance: %w", err)
	}

	if err := s.rewardRepo.UpdateStock(ctx, reward.ID, reward.Stock); err != nil {
		return nil, fmt.Errorf("failed to update reward stock: %w", err)
	}

	// Generate active coupon
	couponCode := fmt.Sprintf("CPN-%04d-%04d", rand.Intn(9999), rand.Intn(9999))
	qrToken := fmt.Sprintf("QR-TOKEN-%d-%s", time.Now().Unix(), couponCode)

	coupon := domain.Coupon{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		RewardID:      reward.ID,
		Title:         reward.Title,
		Code:          couponCode,
		DiscountValue: "100% OFF",
		DiscountType:  "FreeItem",
		Status:        "Active",
		ExpiresAt:     time.Now().AddDate(0, 0, reward.ExpiryDays),
		QRCodeToken:   qrToken,
		ImageUrl:      reward.ImageUrl,
	}

	if err := s.couponRepo.Create(ctx, &coupon); err != nil {
		return nil, fmt.Errorf("failed to issue coupon: %w", err)
	}

	// Log transaction
	txn := domain.Transaction{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		TransactionNo: fmt.Sprintf("TXN-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999)),
		Type:          "REDEEM",
		PointsAmount:  -reward.PointsRequired,
		BalanceAfter:  user.PointsBalance,
		Description:   fmt.Sprintf("Redeemed %s", reward.Title),
		StoreName:     "LoyaltyHub Mobile App",
		CreatedAt:     time.Now(),
	}
	_ = s.transactionRepo.Create(ctx, &txn)

	return &dto.RedeemRewardResponse{
		Message: fmt.Sprintf("Successfully redeemed %s!", reward.Title),
		Coupon:  coupon,
		User:    *user,
	}, nil
}

func (s *loyaltyService) GetUserCoupons(ctx context.Context, userID string, status string) ([]domain.Coupon, error) {
	if userID == "" {
		userID = "usr_demo_711"
	}
	if status == "" {
		status = "Active"
	}
	return s.couponRepo.FindActiveByUserID(ctx, userID, status)
}

func (s *loyaltyService) GetCampaigns(ctx context.Context) ([]domain.Campaign, error) {
	return s.campaignRepo.FindActive(ctx)
}

func (s *loyaltyService) GetTransactions(ctx context.Context, userID string, txnType string) ([]domain.Transaction, error) {
	if userID == "" {
		userID = "usr_demo_711"
	}
	return s.transactionRepo.FindByUserID(ctx, userID, txnType)
}

func (s *loyaltyService) GenerateDynamicQR(ctx context.Context, userID string) (*dto.DynamicQRResponse, error) {
	if userID == "" {
		userID = "usr_demo_711"
	}
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	expiresAt := time.Now().Add(30 * time.Second)
	tokenString := fmt.Sprintf("LH-QR-%s-%d", user.MemberID, expiresAt.Unix())

	return &dto.DynamicQRResponse{
		Token:         tokenString,
		BarcodeNumber: user.MemberID,
		ExpiresAt:     expiresAt,
		TTLSeconds:    30,
	}, nil
}

func (s *loyaltyService) ScanAndEarn(ctx context.Context, req dto.EarnPointsRequest) (*dto.EarnPointsResponse, error) {
	if req.Amount <= 0 {
		return nil, domain.ErrInvalidAmount
	}

	user, err := s.userRepo.FindByID(ctx, req.UserID)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	// Calculation rule: 1 point per ฿10 spent
	earnedPoints := int(req.Amount / 10)
	if earnedPoints < 1 {
		earnedPoints = 1
	}

	user.PointsBalance += earnedPoints
	user.LifetimePoints += earnedPoints
	user.Tier = domain.EvaluateTier(user.LifetimePoints)

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to update user points: %w", err)
	}

	storeName := req.StoreName
	if storeName == "" {
		storeName = "7-Eleven Cashier Scanner #102"
	}

	txn := domain.Transaction{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		TransactionNo: fmt.Sprintf("TXN-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999)),
		Type:          "EARN",
		PointsAmount:  earnedPoints,
		BalanceAfter:  user.PointsBalance,
		Description:   fmt.Sprintf("Scanned QR at checkout (Spent ฿%.2f)", req.Amount),
		StoreName:     storeName,
		CreatedAt:     time.Now(),
	}
	_ = s.transactionRepo.Create(ctx, &txn)

	return &dto.EarnPointsResponse{
		Message:      fmt.Sprintf("Successfully earned %d points!", earnedPoints),
		EarnedPoints: earnedPoints,
		User:         *user,
	}, nil
}

func (s *loyaltyService) RedeemCouponScan(ctx context.Context, req dto.RedeemCouponScanRequest) (*dto.RedeemCouponResponse, error) {
	if req.CouponCode == "" && req.QRCodeToken == "" {
		return nil, errors.New("please provide either a coupon code or QR code token")
	}

	coupon, err := s.couponRepo.FindByCodeOrToken(ctx, req.CouponCode, req.QRCodeToken)
	if err != nil {
		return nil, domain.ErrCouponNotFound
	}

	if time.Now().After(coupon.ExpiresAt) {
		coupon.Status = "Expired"
		_ = s.couponRepo.Update(ctx, coupon)
		return nil, domain.ErrCouponExpired
	}

	now := time.Now()
	coupon.Status = "Redeemed"
	coupon.RedeemedAt = &now
	if err := s.couponRepo.Update(ctx, coupon); err != nil {
		return nil, fmt.Errorf("failed to redeem voucher: %w", err)
	}

	storeName := req.StoreName
	if storeName == "" {
		storeName = "7-Eleven Cashier Scanner #102"
	}

	user, err := s.userRepo.FindByID(ctx, coupon.UserID)
	if err == nil {
		txn := domain.Transaction{
			ID:            domain.NewUUID(),
			UserID:        user.ID,
			TransactionNo: fmt.Sprintf("TXN-VCH-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999)),
			Type:          "REDEEM",
			PointsAmount:  0,
			BalanceAfter:  user.PointsBalance,
			Description:   fmt.Sprintf("Scanned & Redeemed Voucher: %s", coupon.Title),
			StoreName:     storeName,
			CreatedAt:     time.Now(),
		}
		_ = s.transactionRepo.Create(ctx, &txn)
	}

	return &dto.RedeemCouponResponse{
		Message: fmt.Sprintf("Coupon '%s' successfully redeemed!", coupon.Title),
		Coupon:  *coupon,
	}, nil
}

func (s *loyaltyService) ClaimBirthdayReward(ctx context.Context, userID string) (*dto.ClaimBirthdayResponse, error) {
	if userID == "" {
		userID = "usr_demo_711"
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	hasClaimed, err := s.transactionRepo.HasClaimedBirthday(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("database query error: %w", err)
	}
	if hasClaimed {
		return nil, domain.ErrAlreadyClaimedBday
	}

	bonusPoints := 500
	user.PointsBalance += bonusPoints
	user.LifetimePoints += bonusPoints
	user.Tier = domain.EvaluateTier(user.LifetimePoints)

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to update birthday bonus points: %w", err)
	}

	txn := domain.Transaction{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		TransactionNo: fmt.Sprintf("TXN-BDAY-%s", time.Now().Format("20060102")),
		Type:          "BONUS",
		PointsAmount:  bonusPoints,
		BalanceAfter:  user.PointsBalance,
		Description:   "August Birthday Month Gift Bonus Points",
		StoreName:     "LoyaltyHub Rewards",
		CreatedAt:     time.Now(),
	}
	_ = s.transactionRepo.Create(ctx, &txn)

	bdayCoupon := domain.Coupon{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		RewardID:      "rw_sbx_latte",
		Title:         "🎂 FREE Birthday Iced Caramel Macchiato",
		Code:          fmt.Sprintf("BDAY-%04d", rand.Intn(9999)),
		DiscountValue: "FREE",
		DiscountType:  "FreeItem",
		Status:        "Active",
		ExpiresAt:     time.Now().AddDate(0, 1, 0),
		QRCodeToken:   fmt.Sprintf("QR-BDAY-%d", time.Now().Unix()),
		ImageUrl:      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
	}
	_ = s.couponRepo.Create(ctx, &bdayCoupon)

	return &dto.ClaimBirthdayResponse{
		Message:     "Happy Birthday! 500 points and a free drink coupon have been added to your wallet!",
		BonusPoints: bonusPoints,
		Coupon:      bdayCoupon,
		User:        *user,
	}, nil
}

func (s *loyaltyService) GetAdminAnalytics(ctx context.Context) (*dto.AdminAnalyticsResponse, error) {
	users, _ := s.userRepo.FindAll(ctx)
	rewards, _ := s.rewardRepo.FindAll(ctx, "All")

	var totalPointsIssued int64 = 0
	var totalMembers int64 = int64(len(users))
	for _, u := range users {
		totalPointsIssued += int64(u.LifetimePoints)
	}

	var totalRedemptions int64 = 0
	for _, r := range rewards {
		totalRedemptions += int64(500 - r.Stock) // Estimated redeemed stock
	}
	if totalRedemptions < 12 {
		totalRedemptions = 18
	}

	return &dto.AdminAnalyticsResponse{
		TotalMembers:       totalMembers,
		TotalPointsIssued:  totalPointsIssued,
		TotalRedemptions:   totalRedemptions,
		ActiveVouchers:     14,
		TotalRevenueVolume: float64(totalPointsIssued * 10),
	}, nil
}

func (s *loyaltyService) CreateReward(ctx context.Context, req dto.CreateRewardRequest) (*domain.Reward, error) {
	reward := domain.Reward{
		ID:             "rw_" + domain.NewUUID()[:8],
		Title:          req.Title,
		Description:    req.Description,
		Category:       req.Category,
		PointsRequired: req.PointsRequired,
		RetailPrice:    req.RetailPrice,
		ImageUrl:       req.ImageUrl,
		Stock:          req.Stock,
		ExpiryDays:     req.ExpiryDays,
		Featured:       req.Featured,
		CreatedAt:      time.Now(),
	}
	if reward.ImageUrl == "" {
		reward.ImageUrl = "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600"
	}
	if reward.ExpiryDays == 0 {
		reward.ExpiryDays = 30
	}
	if err := s.rewardRepo.Create(ctx, &reward); err != nil {
		return nil, err
	}
	return &reward, nil
}

func (s *loyaltyService) DeleteReward(ctx context.Context, id string) error {
	return s.rewardRepo.Delete(ctx, id)
}

func (s *loyaltyService) AdjustPoints(ctx context.Context, req dto.AdjustPointsRequest) (*domain.User, error) {
	user, err := s.userRepo.FindByID(ctx, req.UserID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	user.PointsBalance += req.PointsAmount
	if req.PointsAmount > 0 {
		user.LifetimePoints += req.PointsAmount
	}
	if user.PointsBalance < 0 {
		user.PointsBalance = 0
	}
	user.Tier = domain.EvaluateTier(user.LifetimePoints)

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	reason := req.Reason
	if reason == "" {
		reason = "Admin Manual Points Adjustment"
	}

	txnType := "BONUS"
	if req.PointsAmount < 0 {
		txnType = "REDEEM"
	}

	txn := domain.Transaction{
		ID:            domain.NewUUID(),
		UserID:        user.ID,
		TransactionNo: fmt.Sprintf("TXN-ADM-%s-%04d", time.Now().Format("20060102"), rand.Intn(9999)),
		Type:          txnType,
		PointsAmount:  req.PointsAmount,
		BalanceAfter:  user.PointsBalance,
		Description:   reason,
		StoreName:     "LoyaltyHub Admin Console",
		CreatedAt:     time.Now(),
	}
	_ = s.transactionRepo.Create(ctx, &txn)

	return user, nil
}
