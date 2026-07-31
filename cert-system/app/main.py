from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.config import settings
from app.routes import auth, events, participants, certificates, verification

app = FastAPI(title="Certificate System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()
    print("Database ready")

@app.get("/")
def root():
    return {"status": "Certificate System API running"}

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(participants.router)
app.include_router(certificates.router)
app.include_router(verification.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
