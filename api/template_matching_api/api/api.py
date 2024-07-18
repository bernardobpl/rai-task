from fastapi import APIRouter
from .endpoints import document_template

api_router = APIRouter()
api_router.include_router(document_template.router, prefix="/document-template", tags=["document-templates"])