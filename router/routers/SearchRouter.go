package routers

import (
	"router/controllers"

	"github.com/gin-gonic/gin"
)

func SearchRouter(router *gin.Engine) {

	routes := router.Group("consultas")
	routes.POST("", controllers.ReceiveRequest)
}
