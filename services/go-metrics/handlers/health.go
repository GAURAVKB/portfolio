package handlers

import (
	"net/http"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
)

var startTime = time.Now()

func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "UP",
		"service":   "go-metrics",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"uptime":    time.Since(startTime).String(),
	})
}

func Metrics(c *gin.Context) {
	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)

	c.JSON(http.StatusOK, gin.H{
		"service":        "go-metrics",
		"status":         "UP",
		"uptime_seconds": int(time.Since(startTime).Seconds()),
		"uptime_human":   time.Since(startTime).String(),
		"go_version":     runtime.Version(),
		"goroutines":     runtime.NumGoroutine(),
		"memory": gin.H{
			"alloc_mb":       bToMb(mem.Alloc),
			"total_alloc_mb": bToMb(mem.TotalAlloc),
			"sys_mb":         bToMb(mem.Sys),
			"gc_runs":        mem.NumGC,
		},
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func bToMb(b uint64) float64 {
	return float64(b) / 1024 / 1024
}
