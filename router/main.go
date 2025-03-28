package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type request struct {
	ID string `json:"id"`
}
type credentials struct {
	TOKEN string `json:"token"`
}
type errorRequest struct {
	MESSAGE string `json:"message"`
}

func receiveRequest(c *gin.Context) {
	identidadesUrl := "http://localhost:8000/identidades/validar"
	consultasUrl := "http://localhost:8000/consultas"
	var headers credentials
	var body request

	// bind the headers to data
	if err := c.ShouldBindHeader(&headers); err != nil {
		c.JSON(401, err.Error())
		return
	}

	// bind the body to data
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, err.Error())
		return
	}

	client := &http.Client{}
	identidadesReq, _ := http.NewRequest("GET", identidadesUrl, nil)
	identidadesReq.Header.Set("token", headers.TOKEN)
	identidadesRes, _ := client.Do(identidadesReq)
	if identidadesRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, errorRequest{MESSAGE: "No se puede validar las credenciales"})
		return
	}
	consultasReq, _ := http.NewRequest("POST", consultasUrl, nil)
	consultasRes, _ := client.Do(consultasReq)
	if consultasRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, errorRequest{MESSAGE: "No se puede validar el request"})
		return
	}
	c.IndentedJSON(http.StatusOK, request{ID: "123"})
}

func main() {
	router := gin.Default()
	router.POST("/consultas", receiveRequest)

	router.Run("localhost:8080")
}
