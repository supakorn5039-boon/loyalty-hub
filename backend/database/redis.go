package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"loyalty-hub/backend/config"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis(cfg *config.Config) *redis.Client {
	addr := fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "",
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Printf("⚠️ Redis connection (%s) unavailable, fallback to local memory mode: %v", addr, err)
		return nil
	}

	log.Printf("⚡ Connected to Redis successfully at %s!", addr)
	RedisClient = rdb
	return rdb
}
