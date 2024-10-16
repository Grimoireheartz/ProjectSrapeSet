package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// รองรับการใช้ GET
	r.GET("/api/data", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from the API on Render!"})
	})

	// รองรับการใช้ POST เพื่อรับข้อมูลจาก Python
	r.POST("/api/data", func(c *gin.Context) {
		var jsonData map[string]interface{}

		// ดึงข้อมูล JSON จาก request และเก็บใน map
		if err := c.ShouldBindJSON(&jsonData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// แสดงข้อมูลที่รับจาก Python
		fmt.Println("Data received from Python:", jsonData)

		// ส่งกลับข้อมูลที่รับมา
		c.JSON(http.StatusOK, gin.H{"received_data": jsonData})
	})

	// เริ่มต้น server บนพอร์ตที่ Render ต้องการ
	port := ":8080"
	if err := r.Run(port); err != nil {
		fmt.Println("Error Starting server:", err)
	}
}
