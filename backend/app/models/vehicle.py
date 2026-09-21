from sqlalchemy import Column, Integer, String, Numeric, Enum, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class TransmissionEnum(str, enum.Enum):
    manual = "manual"
    automatic = "automatic"

class FuelTypeEnum(str, enum.Enum):
    petrol = "petrol"
    diesel = "diesel"
    hybrid = "hybrid"
    electric = "electric"

class AvailabilityStatusEnum(str, enum.Enum):
    available = "available"
    rented = "rented"
    maintenance = "maintenance"
    inactive = "inactive"

class VehicleStatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class VehicleCategory(Base):
    __tablename__ = "vehicle_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

    vehicles = relationship("Vehicle", back_populates="category")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False)
    manufacturing_year = Column(Integer, nullable=False)
    registration_number = Column(String(50), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("vehicle_categories.id"))
    transmission = Column(Enum(TransmissionEnum), nullable=False)
    fuel_type = Column(Enum(FuelTypeEnum), nullable=False)
    seats = Column(Integer, nullable=False)
    price_per_day = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(500))
    mileage = Column(Numeric(10, 2))
    color = Column(String(50))
    availability_status = Column(Enum(AvailabilityStatusEnum), default=AvailabilityStatusEnum.available, index=True)
    vehicle_status = Column(Enum(VehicleStatusEnum), default=VehicleStatusEnum.active)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("VehicleCategory", back_populates="vehicles")
    bookings = relationship("Booking", back_populates="vehicle")