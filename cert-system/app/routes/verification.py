from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import IssuedCertificate
from app.config import settings

router = APIRouter(prefix="/api/verify", tags=["verification"])

@router.get("/{certificate_token}")
def verify_certificate(certificate_token: str, db: Session = Depends(get_db)):
    cert = db.query(IssuedCertificate).filter(IssuedCertificate.certificate_token == certificate_token).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    cert.download_count += 1
    db.commit()
    
    return {
        "certificate_token": certificate_token,
        "participant_name": cert.participant.name,
        "event_name": cert.event.event_name,
        "organization": cert.event.organization,
        "event_date": cert.event.event_date,
        "signing_authority": cert.event.signing_authority,
        "authority_name": cert.event.authority_name,
        "issued_at": cert.issued_at,
        "pdf_url": f"{settings.BACKEND_URL}/api/verify/{certificate_token}/pdf",
        "verify_url": f"{settings.BACKEND_URL}/api/verify/{certificate_token}",
        "share_url": f"{settings.FRONTEND_URL}/verify/{certificate_token}",
    }

@router.get("/{certificate_token}/pdf")
def download_pdf(certificate_token: str, db: Session = Depends(get_db)):
    cert = db.query(IssuedCertificate).filter(IssuedCertificate.certificate_token == certificate_token).first()
    if not cert or not cert.pdf_file_path:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    try:
        with open(cert.pdf_file_path, "rb") as f:
            pdf_data = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Certificate file not found on server")
    
    return Response(content=pdf_data, media_type="application/pdf", headers={"Content-Disposition": f"inline; filename=certificate_{certificate_token[:8]}.pdf"})

@router.get("/{certificate_token}/image")
def download_image(certificate_token: str, db: Session = Depends(get_db)):
    cert = db.query(IssuedCertificate).filter(IssuedCertificate.certificate_token == certificate_token).first()
    if not cert or not cert.image_file_path:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    try:
        with open(cert.image_file_path, "rb") as f:
            data = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Certificate file not found on server")
    
    return Response(content=data, media_type="application/pdf", headers={"Content-Disposition": f"inline; filename=certificate_{certificate_token[:8]}.pdf"})

@router.get("/{certificate_token}/qr")
def get_qr_code(certificate_token: str, db: Session = Depends(get_db)):
    cert = db.query(IssuedCertificate).filter(IssuedCertificate.certificate_token == certificate_token).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    import qrcode
    from io import BytesIO
    verify_url = f"{settings.FRONTEND_URL}/verify/{certificate_token}"
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=2)
    qr.add_data(verify_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = BytesIO()
    img.save(buf, format="PNG")
    
    return Response(content=buf.getvalue(), media_type="image/png", headers={"Content-Disposition": f"inline; filename=qr_{certificate_token[:8]}.png"})
