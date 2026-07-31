from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Time, Text, ForeignKey, Index, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    organization_name = Column(String(255), nullable=False)
    contact_person = Column(String(255))
    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    events = relationship("Event", back_populates="user", cascade="all, delete-orphan")
    templates = relationship("CertificateTemplate", back_populates="user", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"
    __table_args__ = (Index("idx_event_user_id", "user_id"),)
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_name = Column(String(255), nullable=False)
    organization = Column(String(255))
    signing_authority = Column(String(255))
    authority_name = Column(String(255))
    event_date = Column(Date, nullable=False)
    event_time = Column(Time)
    sponsor = Column(String(255))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="events")
    participants = relationship("Participant", back_populates="event", cascade="all, delete-orphan")
    certificates = relationship("IssuedCertificate", back_populates="event", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"
    __table_args__ = (Index("idx_participant_event_id", "event_id"),)
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(100))
    participant_id = Column(String(100))
    certificate_issued = Column(Boolean, default=False)
    issued_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    event = relationship("Event", back_populates="participants")
    certificate = relationship("IssuedCertificate", uselist=False, back_populates="participant")

class CertificateTemplate(Base):
    __tablename__ = "certificate_templates"
    __table_args__ = (Index("idx_template_user_id", "user_id"),)
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    template_name = Column(String(255), nullable=False)
    is_default = Column(Boolean, default=False)
    template_type = Column(String(50))
    design_file_path = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="templates")
    certificates = relationship("IssuedCertificate", back_populates="template")

class IssuedCertificate(Base):
    __tablename__ = "issued_certificates"
    __table_args__ = (
        Index("idx_cert_event_id", "event_id"),
        Index("idx_cert_token", "certificate_token"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)
    certificate_token = Column(String(100), unique=True, nullable=False, index=True)
    pdf_file_path = Column(String(500))
    image_file_path = Column(String(500))
    template_id = Column(Integer, ForeignKey("certificate_templates.id"))
    issued_at = Column(DateTime, default=datetime.utcnow)
    download_count = Column(Integer, default=0)
    
    event = relationship("Event", back_populates="certificates")
    participant = relationship("Participant", back_populates="certificate")
    template = relationship("CertificateTemplate", back_populates="certificates")
