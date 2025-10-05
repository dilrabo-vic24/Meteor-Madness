# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import routers  # CORRECTED: Relative import for the router file

# Create the FastAPI application instance
app = FastAPI(title="A.R.I.E.S. Backend API")

# CORS configuration to allow communication with the frontend
origins = [
    "http://localhost",
    "http://localhost:5173",  # Your frontend port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main router
# All requests starting with /api will be forwarded to the routers.py file
app.include_router(routers.router, prefix="/api", tags=["A.R.I.E.S. API"])

# Root endpoint for health check
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "A.R.I.E.S. Backend is operational."}