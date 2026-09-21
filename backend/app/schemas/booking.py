from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from app.models.booking import BookingStatusEnum

class BookingCreate(BaseModel):
    vehicle_id: int
    start_date: date
    end_date: date

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be on or after start_date")
        return v

class BookingUpdate(BaseModel):
    booking_status: Optional[BookingStatusEnum] = None

class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    vehicle_id: int
    start_date: date
    end_date: date
    rental_days: int
    price_per_day: Decimal
    total_amount: Decimal
    booking_status: BookingStatusEnum
    created_at: datetime