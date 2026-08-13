package domain

import "errors"

var (
	ErrUserNotFound       = errors.New("user profile not found")
	ErrEmailAlreadyExists = errors.New("email address is already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrRewardNotFound      = errors.New("reward item not found")
	ErrInsufficientPoints = errors.New("insufficient points for this redemption")
	ErrRewardOutOfStock   = errors.New("reward item is currently out of stock")
	ErrCouponNotFound     = errors.New("active coupon not found or already redeemed")
	ErrCouponExpired      = errors.New("this coupon voucher has expired")
	ErrInvalidAmount      = errors.New("purchase amount must be greater than zero")
	ErrAlreadyClaimedBday = errors.New("you have already claimed your birthday gift for this year")
)
