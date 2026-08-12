package router

import (
	"loyalty-hub/backend/handler"
	"loyalty-hub/backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(h *handler.LoyaltyHandler) *gin.Engine {
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-User-ID"}
	r.Use(cors.New(config))

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "LoyaltyHub Go Backend API (Clean Architecture)",
		})
	})

	// API v1 Routes
	v1 := r.Group("/api/v1")
	v1.Use(middleware.AuthMiddleware())
	{
		v1.POST("/auth/register", h.Register)
		v1.POST("/auth/login", h.Login)
		v1.GET("/users", h.GetAllUsers)

		v1.GET("/user/profile", h.GetUserProfile)
		v1.GET("/rewards", h.GetRewards)
		v1.POST("/rewards/redeem", h.RedeemReward)
		v1.GET("/coupons", h.GetUserCoupons)
		v1.GET("/campaigns", h.GetCampaigns)
		v1.GET("/transactions", h.GetTransactions)
		v1.GET("/qr/generate", h.GenerateDynamicQR)
		v1.POST("/qr/scan-earn", h.ScanAndEarnPoints)
		v1.POST("/coupons/scan-redeem", h.RedeemCouponScan)
		v1.POST("/campaigns/claim-bday", h.ClaimBirthdayReward)

		// Admin Console Routes
		admin := v1.Group("/admin")
		{
			admin.GET("/analytics", h.GetAdminAnalytics)
			admin.POST("/rewards", h.CreateReward)
			admin.DELETE("/rewards/:id", h.DeleteReward)
			admin.POST("/users/adjust-points", h.AdjustPoints)
		}
	}

	return r
}
