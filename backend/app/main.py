from fastapi import FastAPI
from app import models 
from app.routers import auth, vehicle_category

app = FastAPI(title="Vehicle Rental Management API")

app.include_router(auth.router)
app.include_router(vehicle_category.router)

@app.get("/")
def root():
    return {"message": "Vehicle Rental API is running"}