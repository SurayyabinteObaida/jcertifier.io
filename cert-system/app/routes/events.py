from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Event
from app.schemas import EventCreate, EventResponse
from app.auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/issuer/events", tags=["events"])

@router.post("")
def create_event(event: EventCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = Event(**event.dict(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("")
def list_events(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Event).filter(Event.user_id == user_id).all()

@router.get("/{event_id}")
def get_event(event_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}")
def update_event(event_id: int, event: EventCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for key, value in event.dict().items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"deleted": True}
