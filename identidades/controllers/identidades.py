from typing import Annotated
from fastapi import APIRouter, Response, status, Header
import json
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

class IdentityView:
	router = APIRouter(
				prefix="/identidades",
				tags=["identidades"]
				)

	@router.get("/validar", response_description='Valida que el token este correcto')
	async def validar(response: Response, token: Annotated[str | None, Header()] = None):
		with open(dir_path + '/whitelist.json') as f:
			tokens_allowed = json.load(f)
			if (token in tokens_allowed["allowedList"]):
				response.status_code = status.HTTP_200_OK
			else:
				response.status_code = status.HTTP_401_UNAUTHORIZED
		return response