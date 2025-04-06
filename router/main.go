package main

import (
	"github.com/gin-gonic/gin"
	"router/config"
	"router/routers"
)

func main() {
	config.EnvSetup()
	router := gin.Default()
	routers.SearchRouter(router)

	router.Run("0.0.0.0:8080")
}
