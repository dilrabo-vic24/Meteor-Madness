import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Path sozlamalari
sys.path.insert(0, os.path.dirname(__file__))

# Import - from .api o'rniga app.api
from app.api import routers  # ← BU O'ZGARDI

app = FastAPI(title="A.R.I.E.S. Backend API")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

client_url = os.getenv("FRONTEND_URL")
if client_url:
    origins.append(client_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers.router, prefix="/api", tags=["A.R.I.E.S. API"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "A.R.I.E.S. Backend is operational."}

@app.get("/health")
def health():
    return {"status": "healthy"}