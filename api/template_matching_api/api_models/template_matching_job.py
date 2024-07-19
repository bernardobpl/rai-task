from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict

from template_matching_api.api_models.document_template import DocumentTemplateOut


class JobState(StrEnum):
    SUBMITTED = "SUBMITTED"
    RUNNING = "RUNNING"
    FAILED = "FAILED"
    SUCCEEDED = "SUCCEEDED"


class TemplateMatchingJobIn(BaseModel):
    document_template_ids: list[int]


class TemplateMatchingJobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    job_state: JobState | None
    job_id: str | None

    document_templates: list[DocumentTemplateOut]
