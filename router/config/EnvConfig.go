package config

import (
	"os"
)

type EnvironmentType struct {
	ConsultasUrl   string `json:"consultasUrl"`
	IdentidadesUrl string `json:"identidadesUrl"`
}

var Environment = EnvironmentType{}

// EnvSetup - load env from json
func EnvSetup() {

	Environment.ConsultasUrl = os.Getenv("CONSULTAS_URL")
	Environment.IdentidadesUrl = os.Getenv("IDENTIDADES_URL")
	if Environment.ConsultasUrl == "" || Environment.IdentidadesUrl == "" {
		panic("Url de consultas y/o identidades no configuradas")
	}
}
