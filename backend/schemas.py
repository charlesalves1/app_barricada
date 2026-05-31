from pydantic import BaseModel


class ReportCreate(BaseModel):
    latitude: float
    longitude: float


class ReportResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    status: str

    class Config:
        from_attributes = True