import csv
from io import StringIO
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Event, Participant
from app.schemas import ParticipantCreate
from app.auth import get_current_user

router = APIRouter(tags=["participants"])

@router.post("/api/issuer/events/{event_id}/participants/upload")
def upload_participants(event_id: int, file: UploadFile = File(...), user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    contents = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(contents))
    
    errors = []
    created = 0
    
    for i, row in enumerate(reader, 1):
        try:
            name = row.get("name", "").strip()
            email = row.get("email", "").strip()
            role = row.get("role", "").strip()
            participant_id = row.get("participant_id", "").strip()
            
            if not name or not email:
                errors.append(f"Row {i}: name and email required")
                continue
            
            existing = db.query(Participant).filter(Participant.event_id == event_id, Participant.email == email).first()
            if existing:
                errors.append(f"Row {i}: {email} exists")
                continue
            
            participant = Participant(
                event_id=event_id,
                name=name,
                email=email,
                role=role if role else None,
                participant_id=participant_id if participant_id else None,
            )
            db.add(participant)
            created += 1
        except Exception as e:
            errors.append(f"Row {i}: {str(e)}")
    
    db.commit()
    return {"created": created, "errors": errors}

@router.get("/api/issuer/events/{event_id}/participants")
def list_participants(event_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return db.query(Participant).filter(Participant.event_id == event_id).all()

@router.delete("/api/issuer/events/{event_id}/participants/{participant_id}")
def delete_participant(event_id: int, participant_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    participant = db.query(Participant).filter(Participant.id == participant_id, Participant.event_id == event_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    db.delete(participant)
    db.commit()
    return {"deleted": True}
