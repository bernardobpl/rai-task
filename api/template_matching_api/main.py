from fastapi import FastAPI

from template_matching_api.api.api import api_router

app = FastAPI(title="Template matching management API")
app.include_router(api_router, prefix="/api")
