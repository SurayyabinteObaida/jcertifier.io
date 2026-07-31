from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User, CertificateTemplate
from app.schemas import UserRegister, UserLogin, TokenResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        organization_name=user.organization_name,
        contact_person=user.contact_person,
        phone=user.phone,
    )
    db.add(db_user)
    db.flush()

    for key, info in [("classic", "Classic Blue"), ("elegant", "Elegant Gold"), ("modern", "Modern Teal")]:
        template = CertificateTemplate(
            user_id=db_user.id,
            template_name=info,
            template_type=key,
            is_default=(key == "classic")
        )
        db.add(template)

    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "email": db_user.email, "organization_name": db_user.organization_name}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=7)
    )
    return {"access_token": access_token}
