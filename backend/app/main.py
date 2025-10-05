import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Backend papkasini path ga qo'shish
sys.path.insert(0, os.path.dirname(__file__))

# Relative import o'rniga absolute import
from app.api import routers

app = FastAPI(title="A.R.I.E.S. Backend API")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Hozircha hamma uchun ochiq
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