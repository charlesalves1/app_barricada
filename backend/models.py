from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    status = Column(String, default="pendente")

    created_at = Column(DateTime, default=datetime.utcnow)

    approved_at = Column(DateTime, nullable=True)

    approved_by = Column(String, nullable=True)