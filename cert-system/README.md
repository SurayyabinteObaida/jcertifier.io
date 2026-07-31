# Certificate System

## Quick Start

### 1. Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env

# Add your database URL to .env
# DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 2. Initialize Database
```bash
python init_db.py
```

### 3. Run
```bash
uvicorn app.main:app --reload
```

Access:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Get token

### Events (Auth Required)
- `POST /api/issuer/events` — Create event
- `GET /api/issuer/events` — List events
- `GET /api/issuer/events/{id}` — Get event
- `PUT /api/issuer/events/{id}` — Update event
- `DELETE /api/issuer/events/{id}` — Delete event

### Participants (Auth Required)
- `POST /api/issuer/events/{id}/participants/upload` — Upload CSV
- `GET /api/issuer/events/{id}/participants` — List participants
- `DELETE /api/issuer/events/{id}/participants/{pid}` — Delete participant

### Certificates (Auth Required)
- `POST /api/issuer/events/{id}/generate` — Generate certificates
- `GET /api/issuer/events/{id}/certificates` — List certificates

### Public Verification (No Auth)
- `GET /api/verify/{token}` — View certificate
- `GET /api/verify/{token}/pdf` — Download PDF
- `GET /api/verify/{token}/image` — Download PNG

## Example Workflow

```bash
# 1. Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "organization_name": "My Organization"
  }'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
# Copy the access_token

# 3. Create event
curl -X POST http://localhost:8000/api/issuer/events \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "Python Workshop",
    "organization": "My Org",
    "signing_authority": "Head of Department",
    "authority_name": "Dr. Smith",
    "event_date": "2024-08-15"
  }'

# 4. Upload participants (participants.csv)
curl -X POST http://localhost:8000/api/issuer/events/1/participants/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@participants.csv"

# 5. Generate certificates
curl -X POST http://localhost:8000/api/issuer/events/1/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": 1
  }'

# 6. Verify certificate (public, no token needed)
curl http://localhost:8000/api/verify/{certificate_token}
```

## CSV Format

participants.csv:
```
name,email,role,participant_id
Ahmed Ali,ahmed@example.com,Attendee,P001
Fatima Khan,fatima@example.com,Attendee,P002
```

## Deployment

### Render
1. Set DATABASE_URL env variable
2. Set SECRET_KEY env variable
3. Run: `python init_db.py`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
