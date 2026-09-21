from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.models.booking import Booking, BookingStatusEnum

# Statuses that "block" a vehicle for a date range
BLOCKING_STATUSES = [BookingStatusEnum.pending, BookingStatusEnum.confirmed, BookingStatusEnum.active]

def is_vehicle_available(
    db: Session,
    vehicle_id: int,
    start_date: date,
    end_date: date,
    exclude_booking_id: Optional[int] = None,
) -> bool:
    """
    Returns True if the vehicle has NO conflicting booking in the given range.
    Overlap rule: existing.start_date <= new.end_date AND existing.end_date >= new.start_date
    """
    query = db.query(Booking).filter(
        Booking.vehicle_id == vehicle_id,
        Booking.booking_status.in_(BLOCKING_STATUSES),
        Booking.start_date <= end_date,
        Booking.end_date >= start_date,
    )

    if exclude_booking_id is not None:
        query = query.filter(Booking.id != exclude_booking_id)

    conflicting = query.first()
    return conflicting is None