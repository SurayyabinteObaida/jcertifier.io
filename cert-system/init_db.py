#!/usr/bin/env python
import os
from dotenv import load_dotenv
from app.database import init_db

load_dotenv()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("✓ Database schema created")
    print("✅ Ready! Start with: uvicorn app.main:app --reload")
