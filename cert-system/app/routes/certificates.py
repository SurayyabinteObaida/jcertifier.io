from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Event, Participant, IssuedCertificate, CertificateTemplate
from app.schemas import GenerateCertificatesRequest
from app.auth import get_current_user
from app.utils.certificate_generator import CertificateGenerator
from app.config import settings

router = APIRouter(tags=["certificates"])

@router.get("/api/issuer/templates")
def list_templates(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    templates = db.query(CertificateTemplate).filter(CertificateTemplate.user_id == user_id).all()
    return [{"id": t.id, "template_name": t.template_name, "template_type": t.template_type, "is_default": t.is_default} for t in templates]


@router.post("/api/issuer/events/{event_id}/regenerate")
def regenerate_certificates(event_id: int, request: GenerateCertificatesRequest, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    template = db.query(CertificateTemplate).filter(CertificateTemplate.id == request.template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Delete old certificates
    old_certs = db.query(IssuedCertificate).filter(IssuedCertificate.event_id == event_id).all()
    for old in old_certs:
        import os
        if old.pdf_file_path and os.path.exists(old.pdf_file_path):
            os.remove(old.pdf_file_path)
        db.delete(old)
    
    # Reset participant status
    participants = db.query(Participant).filter(Participant.event_id == event_id).all()
    for p in participants:
        p.certificate_issued = False
        p.issued_at = None
    
    db.flush()
    
    # Generate fresh
    generator = CertificateGenerator(settings.UPLOAD_DIR)
    certificates = []
    errors = []
    template_key = template.template_type or "classic"
    
    for participant in participants:
        try:
            token = generator.generate_token()
            verify_url = f"{settings.BACKEND_URL}/api/verify/{token}"
            event_date = event.event_date.strftime("%Y-%m-%d")
            
            pdf_path = generator.generate_pdf(
                name=participant.name,
                event_name=event.event_name,
                event_date=event_date,
                organization=event.organization or "Not specified",
                authority=event.signing_authority or "Authorized Signatory",
                authority_name=event.authority_name or "Name",
                verify_url=verify_url,
                token=token,
                template_key=template_key
            )
            
            cert = IssuedCertificate(
                event_id=event_id,
                participant_id=participant.id,
                certificate_token=token,
                pdf_file_path=pdf_path,
                image_file_path=pdf_path,
                template_id=request.template_id,
                issued_at=datetime.utcnow()
            )
            db.add(cert)
            participant.certificate_issued = True
            participant.issued_at = datetime.utcnow()
            
            certificates.append({
                "certificate_token": token,
                "participant_id": participant.id,
                "participant_name": participant.name,
            })
        except Exception as e:
            errors.append(f"{participant.name}: {str(e)}")
    
    db.commit()
    return {"generated": len(certificates), "certificates": certificates, "errors": errors}

@router.post("/api/issuer/events/{event_id}/generate")
def generate_certificates(event_id: int, request: GenerateCertificatesRequest, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    template = db.query(CertificateTemplate).filter(CertificateTemplate.id == request.template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    query = db.query(Participant).filter(Participant.event_id == event_id)
    if request.participant_ids:
        query = query.filter(Participant.id.in_(request.participant_ids))
    
    participants = query.all()
    if not participants:
        raise HTTPException(status_code=400, detail="No participants found")
    
    generator = CertificateGenerator(settings.UPLOAD_DIR)
    certificates = []
    errors = []
    template_key = template.template_type or "classic"
    
    for participant in participants:
        try:
            token = generator.generate_token()
            verify_url = f"{settings.BACKEND_URL}/api/verify/{token}"
            event_date = event.event_date.strftime("%Y-%m-%d")
            
            pdf_path = generator.generate_pdf(
                name=participant.name,
                event_name=event.event_name,
                event_date=event_date,
                organization=event.organization or "Not specified",
                authority=event.signing_authority or "Authorized Signatory",
                authority_name=event.authority_name or "Name",
                verify_url=verify_url,
                token=token,
                template_key=template_key
            )
            
            cert = IssuedCertificate(
                event_id=event_id,
                participant_id=participant.id,
                certificate_token=token,
                pdf_file_path=pdf_path,
                image_file_path=pdf_path,
                template_id=request.template_id,
                issued_at=datetime.utcnow()
            )
            db.add(cert)
            
            participant.certificate_issued = True
            participant.issued_at = datetime.utcnow()
            
            certificates.append({
                "certificate_token": token,
                "participant_id": participant.id,
                "participant_name": participant.name,
            })
        except Exception as e:
            errors.append(f"{participant.name}: {str(e)}")
    
    db.commit()
    return {"generated": len(certificates), "certificates": certificates, "errors": errors}

@router.get("/api/issuer/events/{event_id}/certificates")
def list_certificates(event_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    certs = db.query(IssuedCertificate).filter(IssuedCertificate.event_id == event_id).all()
    return [{
        "id": c.id,
        "certificate_token": c.certificate_token,
        "participant_name": c.participant.name,
        "issued_at": c.issued_at,
        "download_count": c.download_count,
        "verify_url": f"{settings.BACKEND_URL}/api/verify/{c.certificate_token}",
        "pdf_url": f"{settings.BACKEND_URL}/api/verify/{c.certificate_token}/pdf",
    } for c in certs]

@router.get("/api/issuer/sample-csv")
def download_sample_csv():
    csv_content = "name,email,role,participant_id\nAhmed Ali,ahmed@example.com,Attendee,P001\nFatima Khan,fatima@example.com,Speaker,P002\nHassan Malik,hassan@example.com,Attendee,P003\n"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sample_participants.csv"}
    )
