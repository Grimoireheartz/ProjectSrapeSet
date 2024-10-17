package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors" // Import CORS
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// เพิ่ม CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://your-production-domain.com"}, // อนุญาต frontend ทั้ง localhost และ production
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// GET route
	r.GET("/api/data", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from the API on Render!"})
	})

	// POST route เพื่อรับข้อมูลจาก Python
	r.POST("/api/data", func(c *gin.Context) {
		var jsonData map[string]interface{}

		if err := c.ShouldBindJSON(&jsonData); err != nil {
			log.Println("Error binding JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Println("ข้อมูลที่ได้รับจาก Python:", jsonData)
		log.Printf("Received data: %v\n", jsonData)

		c.JSON(http.StatusOK, gin.H{"received_data": jsonData})
	})

	// เริ่มต้น server บนพอร์ตที่ Render ต้องการ
	port := ":8080"
	if err := r.Run(port); err != nil {
		log.Println("Error starting server:", err)
	}
}
