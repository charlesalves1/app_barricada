from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    latitude = Column(Float)

    longitude = Column(Float)

    status = Column(String, default="ativo")

    created_at = Column(DateTime, default=datetime.utcnow)