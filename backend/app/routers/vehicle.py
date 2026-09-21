from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from decimal import Decimal
from app.database import get_db
from app.models.vehicle import Vehicle, TransmissionEnum, FuelTypeEnum, AvailabilityStatusEnum
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.core.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

# ---- Public: list with search/filter ----
@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db),
    brand: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    transmission: Optional[TransmissionEnum] = None,
    fuel_type: Optional[FuelTypeEnum] = None,
    seats: Optional[int] = None,
    availability_status: Optional[AvailabilityStatusEnum] = None,
    search: Optional[str] = Query(None, description="Search by name, brand, or model"),
):
    query = db.query(Vehicle)

    if brand:
        query = query.filter(Vehicle.brand.ilike(f"%{brand}%"))
    if category_id:
        query = query.filter(Vehicle.category_id == category_id)
    if min_price is not None:
        query = query.filter(Vehicle.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price_per_day <= max_price)
    if transmission:
        query = query.filter(Vehicle.transmission == transmission)
    if fuel_type:
        query = query.filter(Vehicle.fuel_type == fuel_type)
    if seats:
        query = query.filter(Vehicle.seats == seats)
    if availability_status:
        query = query.filter(Vehicle.availability_status == availability_status)
    if search:
        query = query.filter(
            (Vehicle.name.ilike(f"%{search}%")) |
            (Vehicle.brand.ilike(f"%{search}%")) |
            (Vehicle.model.ilike(f"%{search}%"))
        )

    return query.all()

# ---- Public: single vehicle ----
@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

# ---- Admin: create ----
@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing = db.query(Vehicle).filter(
        Vehicle.registration_number == vehicle_in.registration_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Registration number already exists")

    new_vehicle = Vehicle(**vehicle_in.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

# ---- Admin: update ----
@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle

# ---- Admin: delete/deactivate ----
@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # If vehicle has bookings, deactivate instead of hard-deleting
    if vehicle.bookings:
        vehicle.vehicle_status = "inactive"
        vehicle.availability_status = "inactive"
        db.commit()
        return None

    db.delete(vehicle)
    db.commit()
    return None