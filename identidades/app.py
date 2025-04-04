from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.identidades import IdentityView


''' -------------------- Main -------------------- '''

''' inicializacion '''
# uvicorn main:app --reload
# pip freeze > requirements.txt

app = FastAPI(openapi_url="/openapi.json", docs_url="/docs")

app.include_router(IdentityView.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def read_root():
	return {"status_code": 200, "message": "OK"}