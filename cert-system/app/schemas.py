from pydantic import BaseModel
from datetime import datetime, date, time
from typing import Optional

class UserRegister(BaseModel):
    email: str
    password: str
    organization_name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class EventCreate(BaseModel):
    event_name: str
    organization: Optional[str] = None
    signing_authority: Optional[str] = None
    authority_name: Optional[str] = None
    event_date: date
    event_time: Optional[time] = None
    sponsor: Optional[str] = None
    description: Optional[str] = None

class EventResponse(EventCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class ParticipantCreate(BaseModel):
    name: str
    email: str
    role: Optional[str] = None
    participant_id: Optional[str] = None

class ParticipantResponse(ParticipantCreate):
    id: int
    event_id: int
    certificate_issued: bool
    class Config:
        from_attributes = True

class GenerateCertificatesRequest(BaseModel):
    template_id: int
    participant_ids: Optional[list[int]] = None

class CertificateVerificationResponse(BaseModel):
    certificate_token: str
    participant_name: str
    event_name: str
    organization: Optional[str]
    event_date: date
    signing_authority: Optional[str]
    authority_name: Optional[str]
    issued_at: datetime
    pdf_url: str
    image_url: str
