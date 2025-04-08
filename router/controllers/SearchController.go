package controllers

import (
	"bytes"
	"fmt"
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

	// 1. Bind (leer) solo los headers para obtener el token
	if err := c.ShouldBindHeader(&headers); err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorRequest{MESSAGE: "los headers del request no coincide con lo esperado"})
		return
	}

	// 2. Validar credenciales con identidadesUrl
	client := &http.Client{}
	identidadesReq, _ := http.NewRequest(http.MethodGet, identidadesUrl, nil) // No se envía body a identidades
	identidadesReq.Header.Set("token", headers.TOKEN)
	identidadesRes, errIdentidades := client.Do(identidadesReq)
	if errIdentidades != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorRequest{MESSAGE: "Error al contactar el servicio de identidades"})
		return
	}
	defer identidadesRes.Body.Close()

	if identidadesRes.StatusCode != http.StatusOK {
		// Leer el cuerpo de la respuesta de error de identidades si es posible
		bodyIdentidadesErr, _ := io.ReadAll(identidadesRes.Body)
		fmt.Println("Error identidades:", string(bodyIdentidadesErr)) // Log para debug
		c.JSON(http.StatusUnauthorized, models.ErrorRequest{MESSAGE: "No se puede validar las credenciales"})
		return
	}

	// --- *** CORRECCIÓN AQUÍ *** ---
	// 3. Leer el cuerpo (body) RAW/CRUDO de la solicitud ENTRANTE
	// c.Request.Body solo se puede leer una vez. Gin ofrece c.GetRawData() para facilitar esto.
	rawBody, err := c.GetRawData()
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorRequest{MESSAGE: "No se pudo leer el cuerpo (body) de la solicitud entrante: " + err.Error()})
		return
	}
	// --- *** FIN DE LA CORRECCIÓN *** ---

	// 4. Crear la nueva solicitud a consultasUrl usando el cuerpo CRUDO
	// Usamos bytes.NewReader(rawBody) para que el cuerpo se pueda leer de nuevo
	consultasReq, errConsultasReq := http.NewRequest(http.MethodPost, consultasUrl, bytes.NewReader(rawBody))
	if errConsultasReq != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorRequest{MESSAGE: "Error interno al crear la solicitud de consulta"})
		return
	}

	// 5. Copiar headers relevantes (Content-Type es crucial)
	// Copiamos el Content-Type original, asumiendo que es el correcto para consultasUrl
	originalContentType := c.GetHeader("Content-Type")
	if originalContentType != "" {
		consultasReq.Header.Set("Content-Type", originalContentType)
	} else {
		// Establecer un default si no viene (aunque usualmente vendrá para POST con body)
		consultasReq.Header.Set("Content-Type", "application/json")
	}
	// Podrías copiar otros headers si fuesen necesarios para 'consultasUrl'
	// ej: consultasReq.Header.Set("Otro-Header", c.GetHeader("Otro-Header"))

	// 6. Ejecutar la solicitud a consultasUrl
	consultasRes, errConsultas := client.Do(consultasReq)
	if errConsultas != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorRequest{MESSAGE: "Error al contactar el servicio de consultas"})
		return
	}
	defer consultasRes.Body.Close() // Asegurar cierre del body de respuesta

	fmt.Println("consultasRes Status:", consultasRes.StatusCode)

	// 7. Leer el cuerpo de la respuesta de consultas
	bodyResponse, errReadBody := io.ReadAll(consultasRes.Body)
	if errReadBody != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorRequest{MESSAGE: "Error al leer la respuesta del servicio de consultas"})
		return
	}

	// 8. Reenviar la respuesta (status code y body) de consultas al cliente original
	// Es importante mantener el status code original de la respuesta de 'consultas'
	// y también el Content-Type de la respuesta.
	respContentType := consultasRes.Header.Get("Content-Type")
	if respContentType != "" {
		c.Data(consultasRes.StatusCode, respContentType, bodyResponse)
	} else {
		// Si no hay Content-Type en la respuesta, enviar como data cruda
		c.Data(consultasRes.StatusCode, "application/octet-stream", bodyResponse)
	}

	/* --- Código anterior para decodificar la respuesta (ya no aplica si solo reenvías) ---
	   // Revisar el status code ANTES de intentar decodificar el body
	   if consultasRes.StatusCode != http.StatusOK {
	       // ... (manejo de error como antes) ...
	       return
	   }
	   // Decodificar la respuesta exitosa si necesitaras procesarla aquí
	   var response models.Response
	   if err := json.Unmarshal(bodyResponse, &response); err != nil {
	       c.JSON(http.StatusInternalServerError, models.ErrorRequest{MESSAGE: "No se pueden procesar los datos recibidos del servicio de consultas"})
	       return
	   }
	   c.JSON(http.StatusOK, response)
	*/
}
