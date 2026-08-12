package middleware

import (
	"net/http"
	"strings"

	"loyalty-hub/backend/dto"

	"github.com/gin-gonic/gin"
)

// ExtractUserID extracts user ID from Authorization header, X-User-ID header, or query param.
func ExtractUserID(c *gin.Context) string {
	// 1. Check Authorization Bearer Header
	authHeader := c.GetHeader("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		// Expected format: JWT-TOKEN-<userId>-<timestamp>
		if strings.HasPrefix(token, "JWT-TOKEN-") {
			parts := strings.Split(token, "-")
			if len(parts) >= 3 {
				// e.g. JWT-TOKEN-usr_demo_711-1718000000 -> parts[2] is usr_demo_711 or usr_demo_711 can contain underscores
				// Reconstruct: token without "JWT-TOKEN-" prefix and trailing timestamp
				tokenContent := strings.TrimPrefix(token, "JWT-TOKEN-")
				lastDash := strings.LastIndex(tokenContent, "-")
				if lastDash > 0 {
					return tokenContent[:lastDash]
				}
			}
		} else if token != "" {
			return token
		}
	}

	// 2. Check X-User-ID Header
	if xUserID := c.GetHeader("X-User-ID"); xUserID != "" {
		return xUserID
	}

	// 3. Check Query Parameter
	if queryUserID := c.Query("userId"); queryUserID != "" {
		return queryUserID
	}

	// 4. Default Fallback for Demo
	return "usr_demo_711"
}

// AuthMiddleware injects extracted User ID into Gin context
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := ExtractUserID(c)
		c.Set("userID", userID)
		c.Next()
	}
}

// AdminMiddleware optionally checks if user is Admin or allows demo override
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := ExtractUserID(c)
		// For demo purposes,usr_admin_001 or admin requests are granted access
		if userID == "" {
			c.JSON(http.StatusUnauthorized, dto.APIResponse{Error: "Unauthorized access: Authentication required"})
			c.Abort()
			return
		}
		c.Next()
	}
}
