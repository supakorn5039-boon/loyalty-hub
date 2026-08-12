package handler

import (
	"net/http"

	"loyalty-hub/backend/dto"
	"loyalty-hub/backend/middleware"
	"loyalty-hub/backend/service"

	"github.com/gin-gonic/gin"
)

type LoyaltyHandler struct {
	loyaltyService service.LoyaltyService
}

func NewLoyaltyHandler(loyaltyService service.LoyaltyService) *LoyaltyHandler {
	return &LoyaltyHandler{loyaltyService: loyaltyService}
}

func (h *LoyaltyHandler) GetUserProfile(c *gin.Context) {
	userId := middleware.ExtractUserID(c)
	user, err := h.loyaltyService.GetUserProfile(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *LoyaltyHandler) GetAllUsers(c *gin.Context) {
	users, err := h.loyaltyService.GetAllUsers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *LoyaltyHandler) Register(c *gin.Context) {
	var req dto.AuthRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	resp, err := h.loyaltyService.Register(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *LoyaltyHandler) Login(c *gin.Context) {
	var req dto.AuthLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	resp, err := h.loyaltyService.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) GetRewards(c *gin.Context) {
	category := c.Query("category")
	rewards, err := h.loyaltyService.GetRewards(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, rewards)
}

func (h *LoyaltyHandler) RedeemReward(c *gin.Context) {
	var req dto.RedeemRewardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	resp, err := h.loyaltyService.RedeemReward(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) GetUserCoupons(c *gin.Context) {
	userId := middleware.ExtractUserID(c)
	status := c.DefaultQuery("status", "Active")

	coupons, err := h.loyaltyService.GetUserCoupons(c.Request.Context(), userId, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, coupons)
}

func (h *LoyaltyHandler) GetCampaigns(c *gin.Context) {
	campaigns, err := h.loyaltyService.GetCampaigns(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, campaigns)
}

func (h *LoyaltyHandler) GetTransactions(c *gin.Context) {
	userId := middleware.ExtractUserID(c)
	txnType := c.Query("type")

	txns, err := h.loyaltyService.GetTransactions(c.Request.Context(), userId, txnType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, txns)
}

func (h *LoyaltyHandler) GenerateDynamicQR(c *gin.Context) {
	userId := middleware.ExtractUserID(c)
	resp, err := h.loyaltyService.GenerateDynamicQR(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) ScanAndEarnPoints(c *gin.Context) {
	var req dto.EarnPointsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	resp, err := h.loyaltyService.ScanAndEarn(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) RedeemCouponScan(c *gin.Context) {
	var req dto.RedeemCouponScanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	resp, err := h.loyaltyService.RedeemCouponScan(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) ClaimBirthdayReward(c *gin.Context) {
	userId := middleware.ExtractUserID(c)
	resp, err := h.loyaltyService.ClaimBirthdayReward(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) GetAdminAnalytics(c *gin.Context) {
	resp, err := h.loyaltyService.GetAdminAnalytics(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *LoyaltyHandler) CreateReward(c *gin.Context) {
	var req dto.CreateRewardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	reward, err := h.loyaltyService.CreateReward(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, reward)
}

func (h *LoyaltyHandler) DeleteReward(c *gin.Context) {
	rewardId := c.Param("id")
	if err := h.loyaltyService.DeleteReward(c.Request.Context(), rewardId); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, dto.APIResponse{Message: "Reward deleted successfully"})
}

func (h *LoyaltyHandler) AdjustPoints(c *gin.Context) {
	var req dto.AdjustPointsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}

	user, err := h.loyaltyService.AdjustPoints(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}
