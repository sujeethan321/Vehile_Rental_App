from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.routers import auth, vehicle_category, vehicle, booking, dashboard
from app.routers import user







app = FastAPI(title="Vehicle Rental Management API")

app.include_router(user.router)

app.include_router(dashboard.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicle_category.router)
app.include_router(vehicle.router)
app.include_router(booking.router)

@app.get("/")
def root():
    return {"message": "Vehicle Rental API is running"}