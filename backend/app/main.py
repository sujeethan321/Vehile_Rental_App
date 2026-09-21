from fastapi import FastAPI
from app.routers import auth

app = FastAPI(title="Vehicle Rental Management API")

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Vehicle Rental API is running"}