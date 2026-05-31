from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Report
from schemas import ReportCreate
from database import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/report")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):

    new_report = Report(
        latitude=report.latitude,
        longitude=report.longitude,
        status="ativo"
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "message": "Report criado com sucesso",
        "id": new_report.id
    }

@app.get("/reports")
def get_reports(db: Session = Depends(get_db)):

    reports = db.query(Report).all()

    return reports