from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reports = []

class Report(BaseModel):
    latitude: float
    longitude: float

@app.post("/report")
def create_report(report: Report):
    new_report = {
        "id": len(reports) + 1,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "created_at": datetime.now(),
        "status": "ativo"
    }
    reports.append(new_report)
    return {"message": "Report criado com sucesso"}

@app.get("/reports")
def get_reports():
    now = datetime.now()

    valid_reports = []
    for r in reports:
        if now - r["created_at"] < timedelta(hours=6):
            valid_reports.append(r)

    return valid_reports