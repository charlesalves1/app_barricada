from pydantic import BaseModel

class ReportCreate(BaseModel):
    latitude: float
    longitude: float