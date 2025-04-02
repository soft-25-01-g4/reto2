package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"router/config"
	"router/models"

	"github.com/gin-gonic/gin"
)

func ReceiveRequest(c *gin.Context) {
	identidadesUrl := config.Environment.IdentidadesUrl
	consultasUrl := config.Environment.ConsultasUrl
	var headers models.Credentials
	var body models.Request

	// bind the headers to data
	if err := c.ShouldBindHeader(&headers); err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorRequest{MESSAGE: "los headers del request no coincide con lo esperado"})
		return
	}

	// bind the body to data
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorRequest{MESSAGE: "el cuerpo del request no coincide con el esperado"})
		return
	}

	client := &http.Client{}
	identidadesReq, _ := http.NewRequest(http.MethodGet, identidadesUrl, nil)
	identidadesReq.Header.Set("token", headers.TOKEN)
	identidadesRes, _ := client.Do(identidadesReq)
	if identidadesRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, models.ErrorRequest{MESSAGE: "No se puede validar las credenciales"})
		return
	}

	marshalledBody, _ := json.Marshal(body)
	consultasReq, _ := http.NewRequest(http.MethodPost, consultasUrl, bytes.NewReader(marshalledBody))
	consultasReq.Header.Set("Content-Type", "application/json")
	consultasRes, _ := client.Do(consultasReq)
	if consultasRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, models.ErrorRequest{MESSAGE: "No se puede validar el request"})
		return
	}
	if consultasRes.Body != nil {
		defer consultasRes.Body.Close()
	}
	bodyResponse, err := io.ReadAll(consultasRes.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorRequest{MESSAGE: "El servicio de consultas no devolvio datos"})
	}

	var response models.Response
	if err = json.Unmarshal(bodyResponse, &response); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorRequest{MESSAGE: "No se pueden mostrar los datos en este momento, intente luego"})
	}

	c.JSON(http.StatusOK, response)

}
