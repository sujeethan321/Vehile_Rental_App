from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.vehicle import TransmissionEnum, FuelTypeEnum, AvailabilityStatusEnum, VehicleStatusEnum

class VehicleCreate(BaseModel):
    name: str
    brand: str
    model: str
    manufacturing_year: int
    registration_number: str
    category_id: Optional[int] = None
    transmission: TransmissionEnum
    fuel_type: FuelTypeEnum
    seats: int
    price_per_day: Decimal
    image_url: Optional[str] = None
    mileage: Optional[Decimal] = None
    color: Optional[str] = None

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    manufacturing_year: Optional[int] = None
    category_id: Optional[int] = None
    transmission: Optional[TransmissionEnum] = None
    fuel_type: Optional[FuelTypeEnum] = None
    seats: Optional[int] = None
    price_per_day: Optional[Decimal] = None
    image_url: Optional[str] = None
    mileage: Optional[Decimal] = None
    color: Optional[str] = None
    availability_status: Optional[AvailabilityStatusEnum] = None
    vehicle_status: Optional[VehicleStatusEnum] = None

class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    brand: str
    model: str
    manufacturing_year: int
    registration_number: str
    category_id: Optional[int] = None
    transmission: TransmissionEnum
    fuel_type: FuelTypeEnum
    seats: int
    price_per_day: Decimal
    image_url: Optional[str] = None
    mileage: Optional[Decimal] = None
    color: Optional[str] = None
    availability_status: AvailabilityStatusEnum
    vehicle_status: VehicleStatusEnum
    created_at: datetime