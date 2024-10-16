package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// GET route
	r.GET("/api/data", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from the API on Render!"})
	})

	// POST route เพื่อรับข้อมูลจาก Python
	r.POST("/api/data", func(c *gin.Context) {
		var jsonData map[string]interface{}

		// Bind ข้อมูล JSON ไปยัง map
		if err := c.ShouldBindJSON(&jsonData); err != nil {
			log.Println("Error binding JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// แสดงข้อมูลที่รับมาใน log
		fmt.Println("ข้อมูลที่ได้รับจาก Python:", jsonData)

		// คุณสามารถทำอะไรบางอย่างกับข้อมูลที่ได้รับ เช่นเก็บลงฐานข้อมูล หรือประมวลผลเพิ่มเติม

		// ส่งกลับข้อมูลที่ได้รับไปยัง Python
		c.JSON(http.StatusOK, gin.H{"received_data": jsonData})
	})

	// เริ่มต้น server บนพอร์ตที่ Render ต้องการ
	port := ":8080"
	if err := r.Run(port); err != nil {
		log.Println("Error starting server:", err)
	}
}
