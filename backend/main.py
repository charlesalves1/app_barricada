from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal, engine, Base
from models import Report
from schemas import ReportCreate

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
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = Report(
        latitude=report.latitude,
        longitude=report.longitude,
        status="pendente",
        created_at=datetime.utcnow()
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "message": "Barricada enviada para aprovação"
    }


@app.get("/reports")
def get_reports(
    db: Session = Depends(get_db)
):
    reports = (
        db.query(Report)
        .filter(Report.status == "ativo")
        .all()
    )

    return reports


@app.get("/reports/pending")
def get_pending_reports(
    db: Session = Depends(get_db)
):
    reports = (
        db.query(Report)
        .filter(Report.status == "pendente")
        .all()
    )

    return reports


@app.put("/reports/{report_id}/approve")
def approve_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        return {"error": "Barricada não encontrada"}

    report.status = "ativo"
    report.approved_at = datetime.utcnow()
    report.approved_by = "admin"

    db.commit()

    return {
        "message": "Barricada aprovada"
    }


@app.put("/reports/{report_id}/reject")
def reject_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        return {"error": "Barricada não encontrada"}

    report.status = "rejeitado"

    db.commit()

    return {
        "message": "Barricada rejeitada"
    }


@app.put("/reports/{report_id}/remove")
def remove_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        return {"error": "Barricada não encontrada"}

    report.status = "removido"

    db.commit()

    return {
        "message": "Barricada removida"
    }