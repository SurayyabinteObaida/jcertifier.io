from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"
    UPLOAD_DIR: str = "/var/data"
    
    class Config:
        env_file = ".env"

settings = Settings()
